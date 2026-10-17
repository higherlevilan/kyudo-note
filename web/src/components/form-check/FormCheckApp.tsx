"use client";

// 射形分析（實驗）: choose or record a clip → (opt-in) load MediaPipe → detect poses frame by frame
// → guess the 節 → let the learner adjust → compare with the illustration poses → optional summary
// to the 稽古帳. Everything runs in this tab; the video is never uploaded.

import { useEffect, useMemo, useRef, useState } from "react";
import { analyze, autoPicks, buildSummary, stepStatements, type Analysis, type Picks } from "@/lib/form-check/analysis";
import {
  CancelledError,
  MAX_DURATION_S,
  MODELS,
  WASM_MB,
  chooseFps,
  closeDetector,
  createDetector,
  runDetection,
  unsupportedReason,
  type Detector,
  type ModelId,
} from "@/lib/form-check/detector";
import type { PoseTrack } from "@/lib/form-check/landmarks";
import { SHOULDER_CM } from "@/lib/form-check/metrics";
import { snapshot } from "@/lib/form-check/snapshot";
import { STEPS, STEP_IDS, type StepId } from "@/lib/form-check/steps";
import { VideoLoadError, loadVideo } from "@/lib/form-check/video";
import type { ShahoStep } from "@/lib/journal/types";
import CameraRecorder, { cameraSupported } from "./CameraRecorder";
import Player from "./Player";
import SaveToJournal from "./SaveToJournal";
import StepResults from "./StepResults";
import { StepNum, btn, cardCls, stepTitleCls } from "./ui";

type Phase = "idle" | "loadingVideo" | "ready" | "loadingModel" | "analyzing" | "done";

interface Source {
  url: string;
  name: string;
  duration: number;
  width: number;
  height: number;
}

const fill = <T,>(v: T) => Object.fromEntries(STEP_IDS.map((id) => [id, v])) as Record<StepId, T>;

/** 大三 is the first part of 引分け in the journal's step list. */
const TO_JOURNAL_STEP: Record<StepId, ShahoStep> = {
  ashibumi: "ashibumi",
  dozukuri: "dozukuri",
  yugamae: "yugamae",
  uchiokoshi: "uchiokoshi",
  daisan: "hikiwake",
  kai: "kai",
  hanare: "hanare",
  zanshin: "zanshin",
};

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function FormCheckApp() {
  const workRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  // Long-lived resources, released on unmount.
  const res = useRef<{ det: Detector; model: ModelId } | null>(null);
  const urlRef = useRef<string | null>(null);
  const cancelRef = useRef({ cancelled: false });
  const snapQueue = useRef<Promise<void>>(Promise.resolve());
  const liveAnalysis = useRef<Analysis | null>(null);

  const [src, setSrc] = useState<Source | null>(null);
  const [camera, setCamera] = useState(false);
  const [model, setModel] = useState<ModelId>("full");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<{ track: PoseTrack; model: ModelId } | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [picks, setPicks] = useState<Picks | null>(null);
  const [manual, setManual] = useState(() => fill(false));
  const [enabled, setEnabled] = useState(() => fill(true));
  const [active, setActive] = useState<StepId>("kai");
  const [idx, setIdx] = useState(0);
  const [snaps, setSnaps] = useState<Partial<Record<StepId, string>>>({});

  useEffect(() => {
    const r = res;
    const u = urlRef;
    const c = cancelRef;
    const work = workRef.current;
    return () => {
      c.current.cancelled = true;
      closeDetector(r.current?.det ?? null);
      r.current = null;
      if (u.current) URL.revokeObjectURL(u.current);
      u.current = null;
      if (work) {
        work.removeAttribute("src");
        work.load();
      }
    };
  }, []);

  const busy = phase === "loadingVideo" || phase === "loadingModel" || phase === "analyzing";

  function resetResults() {
    liveAnalysis.current = null;
    setRaw(null);
    setAnalysis(null);
    setPicks(null);
    setSnaps({});
  }

  async function loadSource(url: string, name: string, fallbackDuration?: number) {
    const work = workRef.current;
    if (!work) return;
    if (urlRef.current && urlRef.current !== url) URL.revokeObjectURL(urlRef.current);
    urlRef.current = url;
    resetResults();
    setSrc(null);
    setError(null);
    setPhase("loadingVideo");
    setStatus("正在讀取影片…");
    try {
      const meta = await loadVideo(work, url, fallbackDuration);
      if (meta.duration > MAX_DURATION_S) {
        setPhase("idle");
        setStatus("");
        setError(`影片約 ${Math.round(meta.duration)} 秒，超過 ${MAX_DURATION_S / 60} 分鐘。請先剪成單一射（約 30–90 秒）再分析。`);
        return;
      }
      setSrc({ url, name, ...meta });
      setPhase("ready");
      setStatus(`已讀取影片（約 ${Math.round(meta.duration)} 秒）。`);
    } catch (e) {
      setPhase("idle");
      setStatus("");
      setError(e instanceof VideoLoadError ? e.message : "無法讀取這支影片。");
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (file.type && !file.type.startsWith("video/")) {
      setError("請選擇影片檔（例如 MP4、MOV、WebM）。");
      return;
    }
    void loadSource(URL.createObjectURL(file), file.name);
  }

  function queueSnapshots(a: Analysis, p: Picks, steps: readonly StepId[]) {
    const work = workRef.current;
    if (!work) return;
    for (const s of steps) {
      snapQueue.current = snapQueue.current.then(async () => {
        if (liveAnalysis.current !== a) return;
        const url = await snapshot(work, a, p[s], STEPS[s].pose).catch(() => null);
        if (liveAnalysis.current !== a || !url) return;
        setSnaps((prev) => ({ ...prev, [s]: url }));
      });
    }
  }

  function applyAnalysis(track: PoseTrack, mirror: boolean | null, usedModel: ModelId): boolean {
    // Tested on real footage: the lite model places the ears/nose of a turned head far too frontal.
    const a = analyze(track, mirror, usedModel === "lite" ? { headTurn: "較快（lite）模型對轉頭的角度明顯偏小" } : {});
    liveAnalysis.current = a;
    setAnalysis(a);
    setSnaps({});
    if (!a) {
      setPicks(null);
      return false;
    }
    const p = autoPicks(a);
    setPicks(p);
    setManual(fill(false));
    setEnabled(fill(true));
    setActive("kai");
    setIdx(p.kai);
    queueSnapshots(a, p, STEP_IDS);
    return true;
  }

  async function start() {
    const work = workRef.current;
    if (!src || !work) return;
    const why = unsupportedReason();
    if (why) {
      setError(why);
      return;
    }
    setError(null);
    resetResults();
    const signal = { cancelled: false };
    cancelRef.current = signal;
    // Snapshots share the work video; let a pending one finish before seeking for detection.
    await snapQueue.current.catch(() => undefined);
    try {
      if (!res.current || res.current.model !== model) {
        closeDetector(res.current?.det ?? null);
        res.current = null;
        setPhase("loadingModel");
        setStatus("正在下載並啟動姿勢偵測模型（第一次較久，之後瀏覽器會快取）…");
        res.current = { det: await createDetector(model), model };
      }
      if (signal.cancelled) throw new CancelledError();
      const fps = chooseFps(src.duration);
      setPhase("analyzing");
      setProgress({ done: 0, total: 0 });
      setStatus(`開始分析：每秒 ${fps} 格，使用${res.current.det.delegate === "GPU" ? " GPU" : " CPU"}。`);
      let lastAnnounce = 0;
      const out = await runDetection(
        work,
        res.current.det,
        {
          fps,
          duration: src.duration,
          width: src.width,
          height: src.height,
          signal,
          onHidden: (hidden) => setStatus(hidden ? "分頁在背景時瀏覽器會暫停讀取影片；回到這個分頁就會繼續分析。" : "繼續分析。"),
          onProgress: (done, total) => {
            setProgress({ done, total });
            const pct = Math.floor((done / total) * 100);
            if (pct >= lastAnnounce + 25) {
              lastAnnounce = pct - (pct % 25);
              setStatus(`分析中，約 ${lastAnnounce}%。`);
            }
          },
        },
        () => createDetector(model, false),
      );
      res.current = { det: out.detector, model };
      setRaw({ track: out.track, model });
      if (applyAnalysis(out.track, null, model)) {
        setPhase("done");
        setStatus("分析完成。下方可以檢視各節，並用時間軸調整。");
        requestAnimationFrame(() => playerRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" }));
      } else {
        setPhase("ready");
        setStatus("");
        setError("幾乎沒有偵測到清楚的人體（尤其是兩肩）。請確認全身都在畫面內、光線充足、鏡頭在射手正前方，再試一次。");
      }
    } catch (e) {
      if (e instanceof CancelledError) {
        setPhase("ready");
        setStatus("已取消分析。");
        return;
      }
      setPhase("ready");
      setStatus("");
      setError(e instanceof Error && /[一-鿿]/.test(e.message) ? e.message : "分析時發生錯誤。可以重新整理頁面，或改用「較快（lite）」模型再試。");
    }
  }

  function cancel() {
    cancelRef.current.cancelled = true;
  }

  function pick(s: StepId, i: number) {
    if (!analysis || !picks) return;
    const p = { ...picks, [s]: i };
    setPicks(p);
    setManual((m) => ({ ...m, [s]: true }));
    setSnaps((prev) => ({ ...prev, [s]: undefined }));
    queueSnapshots(analysis, p, [s]);
    setStatus(`已把第 ${analysis.track.frames[i].t.toFixed(1)} 秒設為${STEPS[s].term}。`);
  }

  function resetPick(s: StepId) {
    if (!analysis || !picks) return;
    const i = analysis.seg.moments[s].index;
    const p = { ...picks, [s]: i };
    setPicks(p);
    setManual((m) => ({ ...m, [s]: false }));
    setIdx(i);
    queueSnapshots(analysis, p, [s]);
  }

  function showStep(s: StepId) {
    if (!picks) return;
    setActive(s);
    setIdx(picks[s]);
    playerRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }

  function setMirror(v: boolean) {
    if (!raw) return;
    applyAnalysis(raw.track, v, raw.model);
    setStatus(v ? "已改為：影片是鏡像，左右翻轉後分析。" : "已改為：影片不是鏡像。");
  }

  const summary = useMemo(
    () => (analysis && picks ? buildSummary(analysis, picks, { enabled, manual }) : ""),
    [analysis, picks, enabled, manual],
  );
  const focusSteps = useMemo(() => {
    if (!analysis || !picks) return [];
    const out = new Set<ShahoStep>();
    for (const s of STEP_IDS) {
      if (enabled[s] && stepStatements(analysis, s, picks).some((x) => x.verdict === "some" || x.verdict === "far")) out.add(TO_JOURNAL_STEP[s]);
    }
    return [...out];
  }, [analysis, picks, enabled]);

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hidden element used for frame-by-frame processing and stills (kept in the DOM for iOS). */}
      <video ref={workRef} muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} className="pointer-events-none fixed top-0 left-0 h-px w-px opacity-0" />

      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>

      <section className={cardCls} aria-labelledby="fc-s1">
        <h2 id="fc-s1" className={stepTitleCls}>
          <StepNum n={1} />
          準備影片
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          選一支正面拍攝的影片（射手面向鏡頭，靶在畫面右側）。建議 30–90 秒、只含一射，全身與弓都在畫面內。
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className={`${btn.primary} cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--wood)] ${busy ? "pointer-events-none opacity-50" : ""}`}>
            選擇影片檔
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                onFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            className={btn.secondary}
            disabled={busy}
            onClick={() => {
              if (!cameraSupported()) {
                setError("這個瀏覽器不支援在網頁中錄影。請用手機相機錄好後「選擇影片檔」。");
                return;
              }
              setError(null);
              setCamera(true);
            }}
          >
            用相機錄影
          </button>
          {src && <span className="text-sm text-muted">目前：{src.name}（約 {Math.round(src.duration)} 秒）</span>}
        </div>
        {camera && (
          <CameraRecorder
            onClose={() => setCamera(false)}
            onRecorded={(blob, secs) => {
              setCamera(false);
              void loadSource(URL.createObjectURL(blob), "相機錄影", secs);
            }}
          />
        )}
      </section>

      <section className={cardCls} aria-labelledby="fc-s2">
        <h2 id="fc-s2" className={stepTitleCls}>
          <StepNum n={2} />
          在這台裝置上分析
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed">
          按下「開始分析」後，瀏覽器會下載姿勢偵測模型與執行環境（共約 {WASM_MB + MODELS[model].mb} MB，之後通常會快取）：
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-muted">
          <li>
            執行環境（WebAssembly）：<code className="text-xs">cdn.jsdelivr.net</code>
          </li>
          <li>
            模型檔：<code className="text-xs">storage.googleapis.com</code>（Google MediaPipe 官方）
          </li>
        </ul>
        <p className="mt-1 text-sm leading-relaxed text-muted">這是唯一的網路請求。影片與分析結果都不會離開你的裝置。</p>
        <fieldset className="mt-3" disabled={busy}>
          <legend className="mb-1 text-sm font-semibold">模型</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {(Object.keys(MODELS) as ModelId[]).map((m) => (
              <label key={m} className="inline-flex min-h-10 items-center gap-2 text-sm">
                <input type="radio" name="fc-model" className="h-4 w-4 accent-[var(--wood)]" checked={model === m} onChange={() => setModel(m)} />
                {MODELS[m].label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {phase === "loadingModel" || phase === "analyzing" ? (
            <button type="button" className={btn.danger} onClick={cancel}>
              取消
            </button>
          ) : (
            <button type="button" className={btn.primary} onClick={start} disabled={!src || busy}>
              {phase === "done" ? "重新分析" : "同意下載模型並開始分析"}
            </button>
          )}
          {!src && <span className="text-sm text-muted">請先選擇影片。</span>}
        </div>
        {(phase === "analyzing" || phase === "loadingModel") && (
          <div className="mt-3">
            <label htmlFor="fc-progress" className="mb-1 block text-sm">
              {phase === "loadingModel" ? "下載與啟動模型中…" : `分析中：${progress.done} / ${progress.total || "…"} 格（${pct}%）`}
            </label>
            <progress
              id="fc-progress"
              className="h-2 w-full overflow-hidden rounded-full accent-[var(--wood)]"
              max={phase === "loadingModel" ? undefined : progress.total || 1}
              value={phase === "loadingModel" ? undefined : progress.done}
            />
            <p className="mt-1 text-xs text-muted">分析時請保持這個分頁開著；手機上一分鐘的影片大約需要一到數分鐘。</p>
          </div>
        )}
        {phase === "loadingVideo" && <p className="mt-3 text-sm text-muted">讀取影片中…</p>}
        {error && (
          <p role="alert" className="mt-3 rounded-lg border border-vermilion/40 bg-vermilion/5 p-3 text-sm leading-relaxed text-vermilion">
            {error}
          </p>
        )}
      </section>

      {analysis && picks && src && (
        <>
          <section className={cardCls} aria-labelledby="fc-s3" ref={playerRef} style={{ scrollMarginTop: "calc(var(--header-h) + 0.5rem)" }}>
            <h2 id="fc-s3" className={stepTitleCls}>
              <StepNum n={3} />
              檢視與調整各節
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              自動找出的位置只是推測。拖動時間軸（或用鍵盤左右鍵）找到最符合的一格，再按「把目前畫面設為…」。
            </p>
            <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm leading-relaxed">
              <p>
                {analysis.mirrored ? "判斷這支影片是鏡像（常見於前鏡頭），已左右翻轉後分析。" : "判斷這支影片不是鏡像：弓手（左手）在畫面右側。"}
                <span className="text-muted">（判斷依據：会時往靶的方向伸直的是哪一隻手。）</span>
              </p>
              <label className="mt-1 inline-flex min-h-10 items-center gap-2">
                <input type="checkbox" className="h-4 w-4 accent-[var(--wood)]" checked={analysis.mirrored} onChange={(e) => setMirror(e.target.checked)} />
                影片是鏡像（左右顛倒）
              </label>
            </div>
            {analysis.quality.length > 0 && (
              <ul className="mt-3 space-y-1 rounded-lg border border-vermilion/30 bg-vermilion/5 p-3 text-sm leading-relaxed">
                {analysis.quality.map((q) => (
                  <li key={q.id}>{q.text}</li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <Player
                key={src.url + String(analysis.mirrored)}
                url={src.url}
                analysis={analysis}
                picks={picks}
                manual={manual}
                enabled={enabled}
                active={active}
                idx={idx}
                onIdx={setIdx}
                onActive={setActive}
                onPick={pick}
                onReset={resetPick}
              />
            </div>
          </section>

          <section aria-labelledby="fc-s4">
            <h2 id="fc-s4" className={`${stepTitleCls} mb-2`}>
              <StepNum n={4} />
              與示意圖比較
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-muted">
              長度以你的肩寬當作約 {SHOULDER_CM} 公分換算（示意圖是約 170 公分的成人），所以公分數只是概略值；角度不受身高影響。
              「接近／略有不同／差異較明顯」只是和示意圖的距離，不代表對錯。
            </p>
            <StepResults
              analysis={analysis}
              picks={picks}
              manual={manual}
              enabled={enabled}
              snapshots={snaps}
              onToggle={(s, on) => setEnabled((e) => ({ ...e, [s]: on }))}
              onShow={showStep}
            />
          </section>

          <section className={cardCls} aria-labelledby="fc-s5">
            <h2 id="fc-s5" className={stepTitleCls}>
              <StepNum n={5} />
              存成稽古帳筆記（選用）
            </h2>
            <p className="mt-2 mb-3 text-sm leading-relaxed text-muted">把上面的文字摘要存成一筆練習紀錄，之後可以和老師的意見對照。</p>
            <SaveToJournal key={summary} summary={summary} focusSteps={focusSteps} />
          </section>
        </>
      )}
    </div>
  );
}
