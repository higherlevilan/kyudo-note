// Simple 2D front-view metrics. The same function measures the learner's detected landmarks and
// the canonical illustration skeleton (canonical.ts), so both sides are always defined alike.
//
// Coordinates are centimetres with x toward the target (the archer's LEFT = the viewer's right in a
// front view, as in the illustrations) and y up. Only differences matter, so the origin is arbitrary.

import { SK } from "@/components/illustrations/archer/geometry";
import { LM, median, px, type PoseTrack, type Pt } from "./landmarks";

/** Width between the two shoulder joints in the illustration skeleton (cm). Used as the scale bar. */
export const SHOULDER_CM = SK.shoulderX * 2;

/**
 * Head model for the turn estimate: half the distance between the ears and how far the nose sits in
 * front of the ear axis (cm). Only their ratio matters; the canonical head uses the same numbers.
 */
export const HEAD = { earHalf: 7.5, noseFwd: 9.5 } as const;

export interface Body2D {
  ls: Pt;
  rs: Pt;
  le: Pt;
  re: Pt;
  lw: Pt;
  rw: Pt;
  lh: Pt;
  rh: Pt;
  la: Pt;
  ra: Pt;
  nose: Pt;
  lear: Pt;
  rear: Pt;
}

export const METRIC_IDS = [
  "elbowL",
  "elbowR",
  "shoulderTilt",
  "wristDiff",
  "fistRise",
  "handsCenter",
  "fistElevL",
  "fistElevR",
  "torsoLean",
  "headTurn",
  "stance",
  "spread",
] as const;
export type MetricId = (typeof METRIC_IDS)[number];

export interface MetricValue {
  value: number;
  /** 0–1: the lowest landmark visibility involved */
  conf: number;
}
export type Metrics = Partial<Record<MetricId, MetricValue>>;

const DEG = 180 / Math.PI;

/** Interior angle at b (degrees, 180 = straight). */
function angleAt(a: Pt, b: Pt, c: Pt): number {
  const ux = a.x - b.x, uy = a.y - b.y, vx = c.x - b.x, vy = c.y - b.y;
  const n = Math.hypot(ux, uy) * Math.hypot(vx, vy);
  if (n < 1e-9) return 180;
  return Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / n))) * DEG;
}

const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, v: Math.min(a.v, b.v) });
const conf = (...ps: Pt[]) => Math.min(...ps.map((p) => p.v));

/**
 * Head turn toward the target (degrees, 0 = facing the camera, 90 = profile toward the target),
 * from the nose's sideways offset against the ear spacing: tan θ = (dx / noseFwd) / (earDist / 2·earHalf).
 * Scale-free, so it does not depend on the cm estimate.
 */
export function headTurn(nose: Pt, lear: Pt, rear: Pt): number {
  const em = mid(lear, rear);
  const sinPart = (nose.x - em.x) / HEAD.noseFwd;
  const cosPart = (lear.x - rear.x) / (2 * HEAD.earHalf);
  return Math.atan2(sinPart, Math.max(0, cosPart)) * DEG;
}

export function computeMetrics(b: Body2D): Metrics {
  const sm = mid(b.ls, b.rs);
  const hm = mid(b.lh, b.rh);
  const m: Metrics = {
    elbowL: { value: angleAt(b.ls, b.le, b.lw), conf: conf(b.ls, b.le, b.lw) },
    elbowR: { value: angleAt(b.rs, b.re, b.rw), conf: conf(b.rs, b.re, b.rw) },
    // + = the bow-side (left) shoulder higher
    shoulderTilt: { value: Math.atan2(b.ls.y - b.rs.y, b.ls.x - b.rs.x) * DEG, conf: conf(b.ls, b.rs) },
    // + = the bow hand (left) higher
    wristDiff: { value: b.lw.y - b.rw.y, conf: conf(b.lw, b.rw) },
    // mean fist height above the shoulder line
    fistRise: { value: (b.lw.y + b.rw.y) / 2 - sm.y, conf: conf(b.lw, b.rw, b.ls, b.rs) },
    // mean fist position sideways from the body centre (+ = toward the target)
    handsCenter: { value: (b.lw.x + b.rw.x) / 2 - sm.x, conf: conf(b.lw, b.rw, b.ls, b.rs) },
    // elevation of shoulder → wrist; left arm measured toward the target, right arm away from it
    fistElevL: { value: Math.atan2(b.lw.y - b.ls.y, b.lw.x - b.ls.x) * DEG, conf: conf(b.ls, b.lw) },
    fistElevR: { value: Math.atan2(b.rw.y - b.rs.y, b.rs.x - b.rw.x) * DEG, conf: conf(b.rs, b.rw) },
    // + = upper body leaning toward the target
    torsoLean: { value: Math.atan2(sm.x - hm.x, sm.y - hm.y) * DEG, conf: conf(b.ls, b.rs, b.lh, b.rh) },
    headTurn: { value: headTurn(b.nose, b.lear, b.rear), conf: conf(b.nose, b.lear, b.rear) },
    stance: { value: Math.abs(b.la.x - b.ra.x), conf: conf(b.la, b.ra) },
    spread: { value: Math.hypot(b.lw.x - b.rw.x, b.lw.y - b.rw.y), conf: conf(b.lw, b.rw) },
  };
  return m;
}

// --- From detected landmarks -------------------------------------------------------------

/**
 * cm per pixel, from the median shoulder width over the clip (shoulders stay square to the camera
 * in a front view). Returns null when the shoulders were never seen clearly.
 */
export function estimateScale(track: PoseTrack): number | null {
  const ws: number[] = [];
  for (const f of track.frames) {
    if (!f.pts) continue;
    const l = px(f.pts, LM.leftShoulder, track.width, track.height);
    const r = px(f.pts, LM.rightShoulder, track.width, track.height);
    if (l.v < 0.5 || r.v < 0.5) continue;
    ws.push(Math.hypot(l.x - r.x, l.y - r.y));
  }
  const w = median(ws);
  return w && w > 1 ? SHOULDER_CM / w : null;
}

export function bodyFromPts(pts: Float32Array, track: Pick<PoseTrack, "width" | "height">, cmPerPx: number): Body2D {
  const g = (i: number): Pt => {
    const p = px(pts, i, track.width, track.height);
    return { x: p.x * cmPerPx, y: -p.y * cmPerPx, v: p.v };
  };
  return {
    ls: g(LM.leftShoulder),
    rs: g(LM.rightShoulder),
    le: g(LM.leftElbow),
    re: g(LM.rightElbow),
    lw: g(LM.leftWrist),
    rw: g(LM.rightWrist),
    lh: g(LM.leftHip),
    rh: g(LM.rightHip),
    la: g(LM.leftAnkle),
    ra: g(LM.rightAnkle),
    nose: g(LM.nose),
    lear: g(LM.leftEar),
    rear: g(LM.rightEar),
  };
}

/** Per-frame metrics for the whole track (null where nothing was detected). */
export function trackMetrics(track: PoseTrack, cmPerPx: number): (Metrics | null)[] {
  return track.frames.map((f) => (f.pts ? computeMetrics(bodyFromPts(f.pts, track, cmPerPx)) : null));
}

/** Median of each metric over frames [i − r, i + r]: robust against one-frame detector jitter. */
export function windowMetrics(per: (Metrics | null)[], i: number, r = 2): Metrics {
  const out: Metrics = {};
  for (const id of [...METRIC_IDS]) {
    const vs: number[] = [];
    const cs: number[] = [];
    for (let j = Math.max(0, i - r); j <= Math.min(per.length - 1, i + r); j++) {
      const mv = per[j]?.[id];
      if (mv) {
        vs.push(mv.value);
        cs.push(mv.conf);
      }
    }
    const v = median(vs);
    const c = median(cs);
    if (v != null && c != null) out[id] = { value: v, conf: c };
  }
  return out;
}
