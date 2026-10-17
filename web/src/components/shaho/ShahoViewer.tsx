"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { PlaybackClock } from "@/lib/shaho/clock";
import { CUES } from "@/content/shaho";
import { bowState, frameAt, parseMotion, segmentAt, videoAt, type Motion, type MotionFile } from "@/lib/shaho/motion";
import { ShahoScene } from "@/lib/shaho/scene";
import { useSeek, VIEWER_ID } from "./SeekContext";

const RATES = [0.25, 0.5, 1] as const;
const PHASE_COLORS = ["#a7a196", "#cdb88c", "#d6ab60", "#dfbf78", "#a8c08b", "#8ebfa6", "#86b2c4", "#97a4d4", "#da8c74", "#b8a0cf", "#a7a196"];

function ToggleButton({ on, onClick, children, label }: { on: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={onClick}
      className={`min-w-11 px-3 py-1.5 text-sm transition-colors first:rounded-l-full last:rounded-r-full ${
        on ? "bg-ink text-paper" : "bg-surface text-ink hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

const btn = "rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink transition-colors hover:bg-surface-2";

export default function ShahoViewer({ dataUrl }: { dataUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<PlaybackClock | null>(null);
  const [motion, setMotion] = useState<Motion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [frame, setFrame] = useState(0);
  const { request } = useSeek();

  // Load motion data.
  useEffect(() => {
    let cancelled = false;
    fetch(dataUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<MotionFile>;
      })
      .then((file) => {
        if (!cancelled) setMotion(parseMotion(file));
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(`動作資料載入失敗（${e instanceof Error ? e.message : String(e)}）`);
      });
    return () => {
      cancelled = true;
    };
  }, [dataUrl]);

  // Scene, clock and render loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!motion || !canvas) return;
    let scene: ShahoScene;
    try {
      scene = new ShahoScene(canvas);
    } catch {
      const id = requestAnimationFrame(() => setError("這個瀏覽器無法顯示 3D（WebGL 未啟用）。"));
      return () => cancelAnimationFrame(id);
    }
    const clock = new PlaybackClock(motion.duration);
    clockRef.current = clock;
    const unsubscribe = clock.subscribe(() => setPlaying(!clock.paused));

    // Autoplay from the start, unless the reader prefers reduced motion: then hold on 会.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const kai = motion.meta.segments.find((s) => s.id === "kai") ?? motion.meta.segments[0];
      if (kai) clock.time = kai.keyframe_t;
    } else {
      clock.play();
    }

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      scene.resize();
      scene.render();
    });
    ro.observe(canvas);
    scene.resize();

    let lastKey = "";
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.time;
      if (!clock.paused && t >= motion.duration) clock.pause();
      const i = frameAt(motion.times, t);
      const state = bowState(motion.meta, t);
      const key = `${i}:${state}`;
      if (key !== lastKey) {
        lastKey = key;
        scene.setPose(motion.poses[i], state, motion.floorY);
        setFrame(i);
      }
      if (cursorRef.current) cursorRef.current.style.left = `${(t / motion.duration) * 100}%`;
      if (visible) scene.render();
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      unsubscribe();
      clock.pause();
      clockRef.current = null;
      scene.dispose();
    };
  }, [motion]);

  // Jump requests from the article sections.
  useEffect(() => {
    const clock = clockRef.current;
    if (!request || !motion || !clock) return;
    const seg = motion.meta.segments.find((s) => s.id === request.segmentId);
    if (!seg) return;
    clock.pause();
    clock.time = seg.keyframe_t;
  }, [request, motion]);

  const meta = motion?.meta;
  const duration = motion?.duration ?? 1;
  const t = motion?.times[frame] ?? 0;
  const current = useMemo(() => (meta ? segmentAt(meta, t) : null), [meta, t]);
  const phase = current?.label ?? "—";
  const cues = current ? CUES[current.id] : undefined;

  const togglePlay = () => {
    const c = clockRef.current;
    if (!c) return;
    if (c.paused) c.play();
    else c.pause();
  };
  const changeRate = (r: number) => {
    if (clockRef.current) clockRef.current.playbackRate = r;
    setRate(r);
  };
  const stepBy = (d: number) => {
    const c = clockRef.current;
    if (!c || !motion) return;
    c.pause();
    const i = Math.max(0, Math.min(motion.times.length - 1, frameAt(motion.times, c.time) + d));
    c.time = motion.times[i];
  };
  const jumpTo = (keyframe: number) => {
    const c = clockRef.current;
    if (!c) return;
    c.pause();
    c.time = keyframe;
  };
  const onTimelineClick = (e: MouseEvent<HTMLDivElement>) => {
    const c = clockRef.current;
    if (!c) return;
    const r = e.currentTarget.getBoundingClientRect();
    c.time = ((e.clientX - r.left) / r.width) * duration;
  };
  const onKeys = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepBy(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stepBy(1);
    }
  };

  return (
    <section id={VIEWER_ID} aria-label="射法八節 3D 示範" className="scroll-mt-20">
      <div
        className="relative h-[min(62vh,600px)] min-h-[360px] overflow-hidden rounded-2xl border border-line bg-[radial-gradient(var(--stage-a),var(--stage-b))]"
        tabIndex={0}
        onKeyDown={onKeys}
        aria-label="3D 人形。空白鍵播放／暫停，左右方向鍵逐格。"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <span className="pointer-events-none absolute top-2 left-2 rounded-md bg-ink/70 px-2 py-0.5 text-xs text-paper">
          3D 人形（可拖曳旋轉）
        </span>
        <span
          lang="ja"
          className="pointer-events-none absolute top-2 right-2 rounded-md bg-wood px-3 py-1 text-lg font-semibold text-paper shadow"
        >
          {phase}
        </span>
        {!motion && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">動作資料載入中…</div>
        )}
        {error && (
          <div role="alert" className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-ink">
            {error}
          </div>
        )}
      </div>

      {meta?.ref && (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          動作來源：
          <a href={meta.ref.url} target="_blank" rel="noopener noreferrer" className="text-wood underline">
            {meta.ref.title}
          </a>
          （YouTube）。3D 人形依此影片的動作重建，未使用影片畫面。
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={togglePlay} disabled={!motion} className={`${btn} min-w-24 font-medium`}>
          {playing ? "❚❚ 暫停" : "▶ 播放"}
        </button>
        <div role="group" aria-label="播放速度" className="flex overflow-hidden rounded-full border border-line">
          {RATES.map((r) => (
            <ToggleButton key={r} on={rate === r} onClick={() => changeRate(r)} label={`${r} 倍速`}>
              {r}×
            </ToggleButton>
          ))}
        </div>
        <button type="button" onClick={() => stepBy(-1)} disabled={!motion} className={btn} aria-label="上一格">
          ◀ 上一格
        </button>
        <button type="button" onClick={() => stepBy(1)} disabled={!motion} className={btn} aria-label="下一格">
          下一格 ▶
        </button>
      </div>

      {meta && (
        <>
          <div
            role="slider"
            tabIndex={0}
            aria-label="時間軸"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(t)}
            aria-valuetext={`${phase}，${t.toFixed(1)} 秒`}
            onClick={onTimelineClick}
            onKeyDown={onKeys}
            className="relative mt-4 h-11 cursor-pointer overflow-hidden rounded-lg bg-surface-2"
          >
            {meta.segments.map((s, i) => {
              const end = Math.min(s.end, duration);
              if (end <= s.start) return null;
              return (
                <div
                  key={s.id}
                  lang="ja"
                  title={`${s.label}  ${s.start}–${s.end}s`}
                  className="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden border-r border-paper text-[11px] whitespace-nowrap text-[#1f1b17]"
                  style={{
                    left: `${(s.start / duration) * 100}%`,
                    width: `${((end - s.start) / duration) * 100}%`,
                    background: PHASE_COLORS[i % PHASE_COLORS.length],
                  }}
                >
                  {s.label}
                </div>
              );
            })}
            {meta.release_t != null && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 bg-vermilion"
                style={{ left: `${(meta.release_t / duration) * 100}%` }}
              />
            )}
            <div ref={cursorRef} aria-hidden="true" className="pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 bg-ink" />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="跳到各節">
            {meta.segments.map((s) => (
              <button
                key={s.id}
                type="button"
                lang="ja"
                onClick={() => jumpTo(s.keyframe_t)}
                title={`關鍵影格 ${s.keyframe_t.toFixed(2)}s`}
                aria-pressed={phase === s.label}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  phase === s.label ? "border-wood bg-wood-soft text-ink" : "border-line bg-surface text-ink hover:bg-surface-2"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}

      <div aria-live="polite" className="mt-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <h3 className="text-base font-bold">
          <span lang="ja">{phase}</span>
          <span className="ml-1 font-normal text-muted">要注意的地方</span>
        </h3>
        {cues ? (
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
            {cues.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">播放或點選上方的節，就會顯示該節的重點。</p>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        3D 人形依單一示範者的一次動作重建，用來理解動作順序，不是標準值。原影片只有正面鏡頭，手臂前後的深度依骨長與各節標準形推算；
        軀幹保持垂直、腳步固定的部分也依弓道的身體原則做了校正。弓與箭是依手的位置計算畫出的；手の内、取懸け的細節未呈現。
      </p>

      {meta?.ref && (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          在原影片中看：
          {meta.segments.map((s) => (
            <a
              key={s.id}
              lang="ja"
              href={videoAt(meta.ref!.url, s.start)}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-3 inline-block whitespace-nowrap text-wood underline"
            >
              {s.label}
            </a>
          ))}
        </p>
      )}
    </section>
  );
}
