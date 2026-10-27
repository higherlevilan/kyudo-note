"use client";

// 步驟播放器 (TechEDU HC.stepper): the diagram for the current step on top, then a caption
// (「k/N」 + title + text, announced politely) and the controls: 上一步／下一步／自動播放・暫停 and
// one dot per step. ← / → move between steps while focus is inside the player.
// `children(step)` renders the diagram for a step, so call it from a client component.
// Reaching the last step dispatches a bubbling "course:done" event (marks the 小節 as seen).
// Autoplay only starts when asked, pauses when the player leaves the screen or the tab is hidden,
// and the caption doesn't animate under prefers-reduced-motion.

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface StepDef {
  title: string;
  text?: ReactNode;
}

export default function Stepper({
  steps,
  children,
  label,
  autoplayMs = 2600,
  loop = false,
  initial = 0,
  onStep,
  className = "",
}: {
  steps: StepDef[];
  children: (step: number) => ReactNode;
  /** accessible name for the control group, e.g. 「坐射一手的步驟」 */
  label?: string;
  /** autoplay interval in ms (default 2600) */
  autoplayMs?: number;
  loop?: boolean;
  /** first step shown (default 0) */
  initial?: number;
  /** called whenever the step changes */
  onStep?: (step: number) => void;
  className?: string;
}) {
  const n = steps.length;
  const [step, setStep] = useState(() => Math.max(0, Math.min(n - 1, initial)));
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const uid = useId();
  const onStepRef = useRef(onStep);
  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  const go = useCallback(
    (k: number) => {
      if (k < 0 || k >= n) return;
      setStep(k);
      onStepRef.current?.(k);
      if (k === n - 1) root.current?.dispatchEvent(new CustomEvent("course:done", { bubbles: true }));
    },
    [n],
  );

  // Autoplay: advance every autoplayMs; stop (or wrap with `loop`) at the end.
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (step >= n - 1) {
        if (loop) go(0);
        else setPlaying(false);
      } else go(step + 1);
    }, autoplayMs);
    return () => clearTimeout(t);
  }, [playing, step, n, loop, autoplayMs, go]);

  // Pause when scrolled away or the tab is hidden.
  useEffect(() => {
    if (!playing) return;
    const el = root.current;
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && setPlaying(false));
    if (el) io.observe(el);
    const onVis = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [playing]);

  if (!n) return null;

  const play = () => {
    if (playing) return setPlaying(false);
    if (step >= n - 1) go(0);
    setPlaying(true);
  };
  const user = (k: number) => {
    setPlaying(false);
    go(k);
  };
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable]")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      user(Math.min(n - 1, step + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      user(Math.max(0, step - 1));
    }
  };

  const cur = steps[step];
  const btn =
    "inline-flex min-h-11 items-center justify-center gap-1 rounded-xl px-3.5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div ref={root} role="group" aria-label={label ?? "步驟播放器"} onKeyDown={onKey} className={`flex flex-col gap-3 ${className}`}>
      <div>{children(step)}</div>

      <div
        id={`${uid}-cap`}
        aria-live="polite"
        aria-atomic="true"
        className="min-h-[3.2em] rounded-xl bg-wood-soft/60 px-4 py-2.5 leading-relaxed"
      >
        <p key={step} className="course-pop flex flex-wrap items-baseline gap-x-2.5">
          <span className="text-xs font-semibold text-wood tabular-nums">
            <span className="sr-only">第 </span>
            {step + 1}/{n}
            <span className="sr-only"> 步</span>
          </span>
          <b className="text-ink">{cur.title}</b>
        </p>
        {cur.text && <div className="mt-0.5 text-[15px] text-ink">{cur.text}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => user(step - 1)} disabled={step === 0} className={`${btn} text-wood hover:bg-surface-2`}>
          <span aria-hidden="true">◀</span> 上一步
        </button>
        <button type="button" onClick={() => user(step + 1)} disabled={step === n - 1} className={`${btn} bg-ink text-paper hover:bg-ink/85`}>
          下一步 <span aria-hidden="true">▶</span>
        </button>
        <button
          type="button"
          onClick={play}
          aria-pressed={playing}
          className={`${btn} border ${playing ? "border-wood bg-wood-soft text-ink" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`}
        >
          {playing ? "暫停" : "自動播放"}
        </button>
        <div className="ml-auto flex flex-wrap items-center gap-1" role="group" aria-label="跳到步驟">
          {steps.map((s, k) => (
            <button
              key={k}
              type="button"
              onClick={() => user(k)}
              aria-label={`第 ${k + 1} 步：${s.title}`}
              aria-current={k === step ? "step" : undefined}
              className="group flex h-8 w-6 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`block rounded-full border-2 transition-transform ${
                  k === step ? "h-3.5 w-3.5 border-wood bg-wood" : k < step ? "h-3 w-3 border-wood bg-wood-soft" : "h-3 w-3 border-line bg-surface group-hover:border-wood"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
