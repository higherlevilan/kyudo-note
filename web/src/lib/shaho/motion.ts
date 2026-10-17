// Motion data exported by tools/pose/export_web.py.
// Coordinates are already in three.js convention (metres, +y up, +z toward the camera,
// hip-centred), upright-corrected and smoothed. Target direction is +x.

export type Vec3 = [number, number, number];

export interface Segment {
  id: string;
  label: string;
  start: number;
  end: number;
  keyframe_t: number;
}

export interface MotionMeta {
  source: string;
  ref: { title: string; url: string } | null;
  segments: Segment[];
  release_t: number | null;
  nock_t: number | null;
  depth_refined?: boolean;
}

export interface MotionFile {
  meta: MotionMeta;
  fps: number;
  frames: number[][];
  /** [shoulder°, hip°] per frame, measured in the 2D image (+ = left side higher). */
  tilt?: number[][];
}

export interface Motion {
  meta: MotionMeta;
  fps: number;
  times: number[];
  /** poses[frame][landmark] — 33 MediaPipe landmarks */
  poses: Vec3[][];
  /** [shoulder°, hip°] per frame, from the 2D image; null when the file has none. */
  tilts: ([number, number] | null)[];
  duration: number;
}

export const LANDMARKS = 33;

export function parseMotion(file: MotionFile): Motion {
  const times: number[] = [];
  const poses: Vec3[][] = [];
  const tilts: ([number, number] | null)[] = [];
  for (const [i, row] of file.frames.entries()) {
    if (row.length < 1 + LANDMARKS * 3) continue;
    times.push(row[0]);
    const tl = file.tilt?.[i];
    tilts.push(tl ? [tl[0], tl[1]] : null);
    const pts: Vec3[] = [];
    for (let j = 0; j < LANDMARKS; j++) pts.push([row[1 + j * 3], row[2 + j * 3], row[3 + j * 3]]);
    poses.push(pts);
  }
  return { meta: file.meta, fps: file.fps, times, poses, tilts, duration: times[times.length - 1] ?? 0 };
}

/** Index of the frame nearest to time t (times sorted ascending). */
export function frameAt(times: number[], t: number): number {
  let lo = 0;
  let hi = times.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (times[mid] < t) lo = mid + 1;
    else hi = mid;
  }
  return lo > 0 && Math.abs(times[lo - 1] - t) < Math.abs(times[lo] - t) ? lo - 1 : lo;
}

/** Label of the 節 at time t (the release instant is flagged as 離れ for ±0.25 s). */
export function phaseAt(meta: MotionMeta, t: number): string {
  if (meta.release_t != null && Math.abs(t - meta.release_t) < 0.25) return "離れ";
  const s = meta.segments.find((s) => t >= s.start && t < s.end);
  return s ? s.label : "—";
}

/** Link to the original video at a given second. */
export function videoAt(url: string, seconds: number): string {
  return `${url}${url.includes("?") ? "&" : "?"}t=${Math.floor(seconds)}s`;
}

// Bow / arrow state at time t:
//   carry:    arrows held in the right hand (before 矢番え)
//   rest:     arrow nocked, right hand off the string (矢番え done, 胴造り)
//   drawn:    right hand on the string, from 弓構え (取懸け) until 離れ
//   released: after 離れ (弓返り done)
//   lowered:  弓倒し onward — back to 執弓の姿勢 without an arrow
export type BowState = "carry" | "rest" | "drawn" | "released" | "lowered";
const DRAW_FROM = ["yugamae", "uchiokoshi", "daisan", "hikiwake", "kai"];

export function bowState(meta: MotionMeta, t: number): BowState {
  const yudaoshi = meta.segments.find((s) => s.id === "yudaoshi");
  if (yudaoshi && t >= yudaoshi.start) return "lowered";
  if (meta.release_t != null && t >= meta.release_t) return "released";
  const draw = meta.segments.find((s) => DRAW_FROM.includes(s.id));
  if (draw && t >= draw.start) return "drawn";
  const dozukuri = meta.segments.find((s) => s.id === "dozukuri");
  if ((meta.nock_t != null && t >= meta.nock_t) || (dozukuri && t >= dozukuri.start)) return "rest";
  return "carry";
}
