"use client";

// Video + skeleton overlay + an accessible frame scrubber, with buttons to assign the current frame
// to a 節. The overlay redraws whenever the selected frame changes (scrubbing or playback).

import { useCallback, useEffect, useRef, useState } from "react";
import type { Analysis, Picks } from "@/lib/form-check/analysis";
import { drawPose, OVERLAY } from "@/lib/form-check/draw";
import { nearestFrame } from "@/lib/form-check/landmarks";
import { STEPS, STEP_IDS, type StepId } from "@/lib/form-check/steps";
import { btn } from "./ui";

export default function Player({
  url,
  analysis,
  picks,
  manual,
  enabled,
  active,
  idx,
  onIdx,
  onActive,
  onPick,
  onReset,
}: {
  url: string;
  analysis: Analysis;
  picks: Picks;
  manual: Record<StepId, boolean>;
  enabled: Record<StepId, boolean>;
  active: StepId;
  /** selected frame (controlled, so the result cards can jump here) */
  idx: number;
  onIdx: (i: number) => void;
  onActive: (s: StepId) => void;
  onPick: (s: StepId, index: number) => void;
  onReset: (s: StepId) => void;
}) {
  const { track } = analysis;
  const n = track.frames.length;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showCanon, setShowCanon] = useState(true);

  const goTo = useCallback(
    (i: number) => {
      videoRef.current?.pause();
      onIdx(Math.max(0, Math.min(n - 1, i)));
    },
    [n, onIdx],
  );

  // Keep the paused video on the selected frame.
  useEffect(() => {
    const v = videoRef.current;
    const t = track.frames[idx]?.t;
    if (!v || t == null || !v.paused || v.readyState < 1) return;
    if (Math.abs(v.currentTime - t) > 0.01) v.currentTime = t;
  }, [idx, track]);

  // Draw the overlay for the selected frame.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const k = Math.min(1, 960 / Math.max(track.width, track.height));
    const w = Math.round(track.width * k), h = Math.round(track.height * k);
    if (c.width !== w) c.width = w;
    if (c.height !== h) c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    drawPose(ctx, track.frames[idx]?.pts ?? null, {
      w,
      h,
      mirrored: analysis.mirrored,
      // The active step's illustration arms help find the matching frame.
      canonical: showCanon ? { pose: STEPS[active].pose, cmPerPx: analysis.cmPerPx, videoW: track.width } : null,
    });
  }, [idx, analysis, track, showCanon, active]);

  // Follow playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tick = () => {
      onIdx(nearestFrame(track, v.currentTime));
      rafRef.current = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onPause);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [track, onIdx]);

  // Show the first pick's frame once the video can seek.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      v.currentTime = track.frames[idx]?.t ?? 0;
    };
    if (v.readyState >= 2) onMeta();
    else v.addEventListener("loadeddata", onMeta, { once: true });
    return () => v.removeEventListener("loadeddata", onMeta);
    // Only on mount / new video.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const t = track.frames[idx]?.t ?? 0;
  const here = STEP_IDS.filter((s) => enabled[s] && picks[s] === idx);
  const detected = !!track.frames[idx]?.pts;
  const aspect = track.width / track.height;
  const def = STEPS[active];

  return (
    <div>
      <div
        className="relative mx-auto overflow-hidden rounded-xl bg-black"
        style={{ aspectRatio: `${track.width} / ${track.height}`, width: `min(100%, calc(64vh * ${aspect.toFixed(4)}))` }}
      >
        <video ref={videoRef} src={url} muted playsInline preload="auto" className="absolute inset-0 h-full w-full" aria-label="你的影片" />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
      </div>

      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted">
        <span>
          <span aria-hidden="true" className="mr-1 inline-block h-2 w-4 rounded-sm align-middle" style={{ background: OVERLAY.bowSide }} />
          弓手（左）
        </span>
        <span>
          <span aria-hidden="true" className="mr-1 inline-block h-2 w-4 rounded-sm align-middle" style={{ background: OVERLAY.drawSide }} />
          妻手（右）
        </span>
        {showCanon && (
          <span>
            <span aria-hidden="true" className="mr-1 inline-block h-0 w-4 border-t-2 border-dashed align-middle" style={{ borderColor: OVERLAY.canonical }} />
            「{def.term}」示意圖的手臂（對齊你的肩膀）
          </span>
        )}
        <span>虛線＝偵測信心低</span>
      </p>

      <div className="mt-3">
        <label htmlFor="fc-scrub" className="mb-1 flex items-baseline justify-between text-sm font-semibold">
          <span>時間軸</span>
          <span className="font-normal text-muted tabular-nums">
            {t.toFixed(2)} 秒・第 {idx + 1}/{n} 格{detected ? "" : "（沒有偵測到人）"}
          </span>
        </label>
        <div className="relative">
          <input
            id="fc-scrub"
            type="range"
            min={0}
            max={n - 1}
            step={1}
            value={idx}
            onChange={(e) => goTo(Number(e.target.value))}
            aria-valuetext={`${t.toFixed(1)} 秒${here.length ? `，${here.map((s) => STEPS[s].term).join("、")}` : ""}`}
            className="h-11 w-full accent-[var(--wood)]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-2 bottom-0 h-2">
            {STEP_IDS.filter((s) => enabled[s]).map((s) => (
              <span
                key={s}
                className={`absolute h-2 w-0.5 -translate-x-1/2 ${s === active ? "bg-vermilion" : "bg-wood"}`}
                style={{ left: `${(picks[s] / Math.max(1, n - 1)) * 100}%` }}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" className={btn.small} onClick={() => goTo(idx - 1)} aria-label="上一格">
            ‹ 上一格
          </button>
          <button
            type="button"
            className={btn.small}
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              if (v.paused) void v.play().catch(() => undefined);
              else v.pause();
            }}
          >
            {playing ? "暫停" : "播放"}
          </button>
          <button type="button" className={btn.small} onClick={() => goTo(idx + 1)} aria-label="下一格">
            下一格 ›
          </button>
          <label className="ml-auto inline-flex min-h-10 items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[var(--wood)]" checked={showCanon} onChange={(e) => setShowCanon(e.target.checked)} />
            疊上示意圖手臂
          </label>
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-2 text-sm font-semibold">選擇要調整的節（點選會跳到目前的位置）</legend>
        <div className="flex flex-wrap gap-2">
          {STEP_IDS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={s === active}
              onClick={() => {
                onActive(s);
                goTo(picks[s]);
              }}
              className={`min-h-10 rounded-full border px-3 py-1 text-sm ${
                s === active ? "border-wood bg-wood-soft text-ink" : "border-line bg-surface text-muted hover:bg-surface-2"
              } ${enabled[s] ? "" : "line-through opacity-60"}`}
            >
              <span lang="ja">{STEPS[s].term}</span>
              <span className="ml-1 text-xs tabular-nums">{track.frames[picks[s]]?.t.toFixed(1)}s</span>
              {manual[s] ? <span className="ml-1 text-xs">・手動</span> : null}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          <span lang="ja">{def.term}</span>的自動位置：{def.auto}。
          {analysis.seg.moments[active].found ? "" : "（這一節沒有找到明確的特徵，只是粗估。）"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className={btn.primary} onClick={() => onPick(active, idx)} disabled={picks[active] === idx}>
            把目前畫面設為「<span lang="ja">{def.term}</span>」
          </button>
          {manual[active] && (
            <button type="button" className={btn.secondary} onClick={() => { onReset(active); goTo(analysis.seg.moments[active].index); }}>
              回到自動位置
            </button>
          )}
        </div>
      </fieldset>
    </div>
  );
}
