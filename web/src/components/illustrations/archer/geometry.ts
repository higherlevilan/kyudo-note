// Geometry for the archer figure: a small 3D skeleton of a ~170 cm adult, forward
// kinematics from joint angles, the yumi / arrow construction, and orthographic projection.
// Units are centimetres. World axes: x = the archer's LEFT (toward the target),
// y = up (floor at 0), z = forward (toward the viewer in the front view).

import type { ArcherPose, Dir } from "@/content/illustrations/archer/poses";

export type V3 = readonly [number, number, number];
export type P2 = readonly [number, number];

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a: V3): number => Math.hypot(a[0], a[1], a[2]);
export const unit = (a: V3): V3 => mul(a, 1 / (len(a) || 1));

const RAD = Math.PI / 180;

/** Direction from azimuth / elevation (degrees). az 0 = archer's left (target), 90 = forward, 180 = right, −90 = back. */
export function dir({ az, el }: Dir): V3 {
  const c = Math.cos(el * RAD);
  return [c * Math.cos(az * RAD), Math.sin(el * RAD), c * Math.sin(az * RAD)];
}

/** Skeleton proportions (cm) for an adult of about 170 cm. */
export const SK = {
  height: 170,
  shoulderY: 140,
  shoulderX: 18,
  upperArm: 29,
  forearm: 25,
  /** wrist → centre of the fist */
  hand: 5,
  headY: 159,
  headRx: 8.4,
  headRy: 11,
  neckY: 143,
  waistY: 100,
  kneeY: 49,
  hemY: 3.5,
} as const;

/** Yumi: 七尺三寸 ≈ 221 cm; the grip sits about 1/3 from the bottom. */
export const BOW = {
  length: 221,
  /** grip (fist centre) → 末弭 along the bow */
  upper: 149,
  /** grip (fist centre) → 本弭 */
  lower: 72,
  /** braced string distance from the grip (弦の高さ) */
  brace: 15,
  /** nocking point above the fist centre (the arrow rests on the thumb) */
  nockH: 6,
} as const;

export const ARROW_LEN = 95;

export interface ArmJoints {
  shoulder: V3;
  elbow: V3;
  wrist: V3;
  hand: V3;
  foreDir: V3;
}

export function armJoints(side: "left" | "right", arm: ArcherPose["left"]): ArmJoints {
  const shoulder: V3 = [side === "left" ? SK.shoulderX : -SK.shoulderX, SK.shoulderY, 0];
  const elbow = add(shoulder, mul(dir(arm.upper), SK.upperArm));
  const foreDir = dir(arm.fore);
  const wrist = add(elbow, mul(foreDir, SK.forearm));
  const hand = add(wrist, mul(foreDir, SK.hand));
  return { shoulder, elbow, wrist, hand, foreDir };
}

// --- Yumi -------------------------------------------------------------------------------

export interface BowGeom {
  grip: V3;
  /** along the bow, 本弭 → 末弭 */
  u: V3;
  /** the side the bow's back faces (the arrow flies this way) */
  b: V3;
  /** the archer's right of the bow when aiming: the arrow lies on this side */
  r: V3;
  upperLimb: V3[];
  lowerLimb: V3[];
  tipTop: V3;
  tipBottom: V3;
  nock: V3;
}

function cubic(p0: P2, p1: P2, p2: P2, p3: P2, t: number): P2 {
  const m = 1 - t;
  const a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

/**
 * One limb in the bow's own plane: s along the bow, t toward the back (negative = string side).
 * Tangent along the bow at the grip; the tip bends toward the string by `defl`, with the
 * small outward flick near the 弭 that a yumi has.
 */
function limb(L: number, defl: number, n: number): P2[] {
  const chord = L * 0.985 - (defl * defl) / (2 * L);
  const p0: P2 = [0, 0], p1: P2 = [L * 0.42, 0], p2: P2 = [chord * 0.83, -defl * 1.08], p3: P2 = [chord, -defl];
  return Array.from({ length: n + 1 }, (_, i) => cubic(p0, p1, p2, p3, i / n));
}

export function bowGeom(pose: ArcherPose, grip: V3): BowGeom {
  const u = unit(dir(pose.bow.up));
  const face = dir({ az: pose.bow.face, el: 0 });
  const b = unit(sub(face, mul(u, dot(face, u))));
  const r = cross(b, u);
  const draw = Math.max(BOW.brace, pose.bow.draw);
  const extra = draw - BOW.brace;
  const deflTop = BOW.brace + extra * 0.46;
  const deflBottom = BOW.brace + extra * 0.36;
  const toWorld = (sgn: 1 | -1) => ([s, t]: P2): V3 => add(grip, add(mul(u, s * sgn), mul(b, t)));
  const upperLimb = limb(BOW.upper, deflTop, 28).map(toWorld(1));
  const lowerLimb = limb(BOW.lower, deflBottom, 16).map(toWorld(-1));
  const tipTop = upperLimb[upperLimb.length - 1];
  const tipBottom = lowerLimb[lowerLimb.length - 1];
  // Nock: on the braced string, or pulled back along −b when drawn.
  const nock = add(grip, add(mul(u, BOW.nockH), mul(b, -draw)));
  return { grip, u, b, r, upperLimb, lowerLimb, tipTop, tipBottom, nock };
}

// --- Projection ---------------------------------------------------------------------------

export type View = "front" | "side" | "top";

/**
 * front: the archer faces the viewer (脇正面), the target is on the viewer's right.
 * side: seen from the target, looking back at the archer; the archer's front is on the viewer's left.
 * top: seen from above, target on the right, the archer's front toward the bottom.
 * Returns screen [x, y] (y down) and depth (larger = nearer the viewer).
 */
export function project(p: V3, view: View): { x: number; y: number; d: number } {
  if (view === "front") return { x: p[0], y: -p[1], d: p[2] };
  if (view === "side") return { x: -p[2], y: -p[1], d: p[0] };
  return { x: p[0], y: p[2], d: p[1] };
}

/** Feet: big-toe tip and heel positions on the floor. */
export function feet(pose: ArcherPose): { left: { toe: V3; heel: V3 }; right: { toe: V3; heel: V3 } } {
  if (pose.stance === "together") {
    return {
      left: { toe: [4.5, 0, 17], heel: [4.5, 0, -7] },
      right: { toe: [-4.5, 0, 17], heel: [-4.5, 0, -7] },
    };
  }
  // 足踏み: toe tips one 矢束 (≈ 85 cm here) apart on the line to the target, about 60° between the feet.
  const half = 85 / 2;
  const footLen = 24;
  const out = 30 * RAD;
  const toeZ = 10.5;
  const heelX = half - footLen * Math.sin(out);
  const heelZ = toeZ - footLen * Math.cos(out);
  return {
    left: { toe: [half, 0, toeZ], heel: [heelX, 0, heelZ] },
    right: { toe: [-half, 0, toeZ], heel: [-heelX, 0, heelZ] },
  };
}
