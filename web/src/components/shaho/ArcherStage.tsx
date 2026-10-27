"use client";

// Animated stage for the 射法八節 players: the existing ArcherFigure (front view, optionally the
// view from the target beside it) driven by a pose id. Moving between neighbouring poses blends
// the two poses (tween.ts); other jumps fade in. prefers-reduced-motion: no animation at all.
// `overlay` draws on top of the front view in its own coordinates (cm, y up is negative).

import { useEffect, useRef, useState, type ReactNode } from "react";
import ArcherFigure, { FRAMES } from "@/components/illustrations/archer/ArcherFigure";
import { ease, lerpPose } from "@/components/illustrations/archer/tween";
import { POSES, type ArcherPose, type PoseId } from "@/content/illustrations/archer/poses";

/** Pose pairs that are one continuous movement, so they can be blended (either direction). */
const CONTINUOUS = new Set([
  "torimi>ashibumi",
  "dozukuri>yugamae",
  "yugamae>uchiokoshi",
  "uchiokoshi>daisan",
  "daisan>hikiwake",
  "hikiwake>kai",
  "kai>hanare",
  "hanare>zanshin",
  "zanshin>yudaoshi",
]);
const continuous = (a: PoseId, b: PoseId) => CONTINUOUS.has(`${a}>${b}`) || CONTINUOUS.has(`${b}>${a}`);

export function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

/** Run `frame(t)` with t going 0 → 1 over `ms` (one call with t = 1 when motion is reduced). Returns a cancel function. */
export function animate(ms: number, frame: (t: number) => void): () => void {
  let raf = 0;
  if (reducedMotion() || ms <= 0) {
    raf = requestAnimationFrame(() => frame(1));
    return () => cancelAnimationFrame(raf);
  }
  const t0 = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - t0) / ms);
    frame(t);
    if (t < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/** The pose to draw for `target`, animated from whatever was shown before. */
export function useTweenedPose(target: PoseId, opts: { fast?: boolean } = {}): { pose: ArcherPose; fade: number } {
  const [shown, setShown] = useState<{ pose: ArcherPose; fade: number }>({ pose: POSES[target], fade: 1 });
  const from = useRef<{ id: PoseId; pose: ArcherPose }>({ id: target, pose: POSES[target] });
  const fast = opts.fast ?? false;

  useEffect(() => {
    const start = from.current;
    if (start.id === target) return;
    const b = POSES[target];
    const blend = continuous(start.id, target);
    // 離れ is quick; the rest move at a calm pace.
    const ms = blend ? (target === "hanare" && start.id === "kai" ? 240 : fast ? 500 : 850) : 380;
    from.current = { id: target, pose: b };
    return animate(ms, (t) => {
      const e = ease(t);
      const pose = blend ? lerpPose(start.pose, b, e) : b;
      if (blend) from.current = { id: target, pose: t >= 1 ? b : pose };
      setShown({ pose, fade: blend ? 1 : 0.2 + 0.8 * e });
    });
  }, [target, fast]);

  return shown;
}

export default function ArcherStage({
  pose,
  fade = 1,
  side = false,
  overlay,
  sideLabel = "從靶的方向看",
}: {
  pose: ArcherPose;
  fade?: number;
  /** also draw the view from the target, at the same scale */
  side?: boolean;
  overlay?: ReactNode;
  sideLabel?: string;
}) {
  const F = FRAMES.front;
  const S = FRAMES.side;
  return (
    <div
      className="grid items-end gap-2"
      style={{ gridTemplateColumns: side ? `${F.w}fr ${S.w}fr` : "1fr", opacity: fade }}
    >
      <div className="relative min-w-0">
        <ArcherFigure pose={pose} className="block h-auto w-full" />
        {overlay && (
          <svg
            aria-hidden="true"
            viewBox={`${F.x} ${F.y} ${F.w} ${F.h}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {overlay}
          </svg>
        )}
      </div>
      {side && (
        <div className="flex min-w-0 flex-col items-center">
          <ArcherFigure pose={pose} view="side" decorative className="block h-auto w-full" />
          <span className="mt-0.5 text-xs text-muted">{sideLabel}</span>
        </div>
      )}
    </div>
  );
}
