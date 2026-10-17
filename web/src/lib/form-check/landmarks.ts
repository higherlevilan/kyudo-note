// MediaPipe Pose landmark layout and the pose track produced by the detector.
// Pure data helpers — no browser APIs, so they can be tested in Node.

/** MediaPipe Pose landmark indices (33 points). "left" / "right" are the person's own sides. */
export const LM = {
  nose: 0,
  leftEar: 7,
  rightEar: 8,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
} as const;

export const N_LM = 33;
/** Values stored per landmark: x, y (normalised 0–1 of the image), visibility (0–1). */
export const STRIDE = 3;

/** Left/right landmark pairs, swapped when un-mirroring a selfie video. */
const LR_PAIRS: readonly (readonly [number, number])[] = [
  [1, 4], [2, 5], [3, 6], [7, 8], [9, 10], [11, 12], [13, 14], [15, 16],
  [17, 18], [19, 20], [21, 22], [23, 24], [25, 26], [27, 28], [29, 30], [31, 32],
];

/** Bones drawn on the overlay (face points other than nose / ears are left out). */
export const BONES: readonly (readonly [number, number])[] = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24],
  [23, 25], [25, 27], [24, 26], [26, 28],
  [0, 7], [0, 8],
];

/** One sampled video frame. `pts` is null when no person was detected. */
export interface PoseFrame {
  /** seconds from the start of the video */
  t: number;
  /** N_LM × STRIDE values: x, y (normalised), visibility */
  pts: Float32Array | null;
}

export interface PoseTrack {
  /** video pixel size (normalised x is relative to width, y to height) */
  width: number;
  height: number;
  /** sampling rate actually used */
  fps: number;
  duration: number;
  frames: PoseFrame[];
}

export interface Pt {
  x: number;
  y: number;
  /** visibility 0–1 */
  v: number;
}

/** Landmark i in pixel units (x right, y down). */
export function px(pts: Float32Array, i: number, w: number, h: number): Pt {
  const o = i * STRIDE;
  return { x: pts[o] * w, y: pts[o + 1] * h, v: pts[o + 2] };
}

/** From a MediaPipe result's first pose (array of {x, y, visibility}). */
export function packLandmarks(lms: readonly { x: number; y: number; visibility?: number }[]): Float32Array {
  const out = new Float32Array(N_LM * STRIDE);
  for (let i = 0; i < N_LM && i < lms.length; i++) {
    out[i * STRIDE] = lms[i].x;
    out[i * STRIDE + 1] = lms[i].y;
    out[i * STRIDE + 2] = lms[i].visibility ?? 0;
  }
  return out;
}

/** Flip a frame horizontally and swap the left/right labels (for mirrored selfie footage). */
export function mirrorPts(pts: Float32Array): Float32Array {
  const out = new Float32Array(pts.length);
  for (let i = 0; i < N_LM; i++) {
    out[i * STRIDE] = 1 - pts[i * STRIDE];
    out[i * STRIDE + 1] = pts[i * STRIDE + 1];
    out[i * STRIDE + 2] = pts[i * STRIDE + 2];
  }
  for (const [a, b] of LR_PAIRS) {
    for (let k = 0; k < STRIDE; k++) {
      const va = out[a * STRIDE + k];
      out[a * STRIDE + k] = out[b * STRIDE + k];
      out[b * STRIDE + k] = va;
    }
  }
  return out;
}

export function mirrorTrack(track: PoseTrack): PoseTrack {
  return { ...track, frames: track.frames.map((f) => ({ t: f.t, pts: f.pts ? mirrorPts(f.pts) : null })) };
}

/** Index of the sampled frame nearest to time t. */
export function nearestFrame(track: PoseTrack, t: number): number {
  const fr = track.frames;
  if (!fr.length) return -1;
  let lo = 0;
  let hi = fr.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (fr[mid].t <= t) lo = mid;
    else hi = mid;
  }
  return Math.abs(fr[lo].t - t) <= Math.abs(fr[hi].t - t) ? lo : hi;
}

export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function percentile(xs: number[], p: number): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const k = Math.min(s.length - 1, Math.max(0, Math.round((p / 100) * (s.length - 1))));
  return s[k];
}

/**
 * Temporal median filter (per coordinate, over ±radius detected neighbours). Used for
 * segmentation only, so single-frame detector glitches do not create fake key moments.
 */
export function smoothTrack(track: PoseTrack, radius = 2): PoseTrack {
  const fr = track.frames;
  const frames = fr.map((f, i) => {
    if (!f.pts) return f;
    const win: Float32Array[] = [];
    for (let j = Math.max(0, i - radius); j <= Math.min(fr.length - 1, i + radius); j++) {
      const p = fr[j].pts;
      if (p) win.push(p);
    }
    const out = new Float32Array(f.pts.length);
    const buf: number[] = [];
    for (let k = 0; k < out.length; k++) {
      buf.length = 0;
      for (const p of win) buf.push(p[k]);
      out[k] = median(buf) ?? f.pts[k];
    }
    return { t: f.t, pts: out };
  });
  return { ...track, frames };
}
