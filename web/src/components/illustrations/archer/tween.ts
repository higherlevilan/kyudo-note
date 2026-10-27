// In-between poses for the animated 射法八節 players (src/components/shaho/*). Pure helpers on top
// of the pose data: nothing here changes POSES or geometry.ts, it only blends two existing poses.
//
// Directions are blended as unit vectors (normalised lerp), so an arm never swings the "long way"
// round when its azimuth crosses ±180°, and a segment pointing straight up stays put. Discrete
// fields (stance, arrow, gaze, motion) switch at the half-way point, except where `hold` asks to
// keep the starting value (e.g. the nocked arrow while the 離れ is being drawn by the caller).

import type { ArcherPose, ArmPose, Dir } from "@/content/illustrations/archer/poses";
import { dir } from "./geometry";

const DEG = 180 / Math.PI;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smooth start and end (cubic ease-in-out). */
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function lerpDir(a: Dir, b: Dir, t: number): Dir {
  const va = dir(a);
  const vb = dir(b);
  const v = [lerp(va[0], vb[0], t), lerp(va[1], vb[1], t), lerp(va[2], vb[2], t)];
  const l = Math.hypot(v[0], v[1], v[2]);
  // Opposite directions: fall back to the plain angle blend.
  if (l < 1e-6) return { az: lerp(a.az, b.az, t), el: lerp(a.el, b.el, t) };
  const x = v[0] / l, y = v[1] / l, z = v[2] / l;
  const el = Math.asin(Math.max(-1, Math.min(1, y))) * DEG;
  // Near vertical the azimuth is meaningless; keep the nearer end's so nothing flips.
  const az = Math.hypot(x, z) < 1e-4 ? (t < 0.5 ? a.az : b.az) : Math.atan2(z, x) * DEG;
  return { az, el };
}

/** Shortest way round between two horizontal angles (degrees). */
function lerpAngle(a: number, b: number, t: number): number {
  let d = ((b - a) % 360 + 540) % 360 - 180;
  if (d === -180) d = 180;
  return a + d * t;
}

function lerpArm(a: ArmPose, b: ArmPose, t: number): ArmPose {
  return { upper: lerpDir(a.upper, b.upper, t), fore: lerpDir(a.fore, b.fore, t) };
}

export interface TweenOptions {
  /** keep these discrete fields from `a` for the whole tween */
  hold?: ("arrow" | "stance" | "gaze" | "motion")[];
}

/** A pose `t` (0–1) of the way from `a` to `b`. t = 0 returns `a`, t = 1 returns `b` unchanged. */
export function lerpPose(a: ArcherPose, b: ArcherPose, t: number, opts: TweenOptions = {}): ArcherPose {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const hold = new Set(opts.hold ?? []);
  const pick = <K extends "arrow" | "stance" | "gaze" | "motion">(k: K): ArcherPose[K] => (hold.has(k) || t < 0.5 ? a[k] : b[k]);
  return {
    ...(t < 0.5 ? a : b),
    stance: pick("stance"),
    arrow: pick("arrow"),
    gaze: pick("gaze"),
    // motion marks (arrows, speed lines) only belong to the finished pose
    motion: hold.has("motion") ? a.motion : undefined,
    headYaw: lerp(a.headYaw, b.headYaw, t),
    left: lerpArm(a.left, b.left, t),
    right: lerpArm(a.right, b.right, t),
    bow: {
      up: lerpDir(a.bow.up, b.bow.up, t),
      face: lerpAngle(a.bow.face, b.bow.face, t),
      draw: lerp(a.bow.draw, b.bow.draw, t),
    },
  };
}
