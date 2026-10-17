// Joint metrics shown under the 3D viewer (same definitions as tools/pose/analyze.py).
// Inputs are three.js-convention points (+y up). Shoulder / hip tilt come from the 2D
// image when the motion file has them (the detector's 3D y is off by ~10° at the
// shoulders); otherwise they fall back to the 3D left–right line in the x–y plane.

import type { Vec3 } from "./motion";

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const norm = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);
const deg = (r: number) => (r * 180) / Math.PI;
const clamp1 = (v: number) => Math.min(1, Math.max(-1, v));

/** Angle at b between b→a and b→c. */
function angle(a: Vec3, b: Vec3, c: Vec3) {
  const u = sub(a, b);
  const v = sub(c, b);
  return deg(Math.acos(clamp1((u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (norm(u) * norm(v)))));
}
/** Elevation of p→q above the horizontal plane (+ = q higher). */
function elevation(p: Vec3, q: Vec3) {
  const d = sub(q, p);
  return deg(Math.atan2(d[1], Math.hypot(d[0], d[2])));
}
/** Tilt of the right→left line in the x–y (frontal) plane; + = left (q) higher. */
function tilt(right: Vec3, left: Vec3) {
  return deg(Math.atan2(left[1] - right[1], Math.abs(left[0] - right[0])));
}
/** Angle between the two feet (heel → toe) on the floor plane. */
function footAngle(w: Vec3[]) {
  const l = [w[31][0] - w[29][0], w[31][2] - w[29][2]];
  const r = [w[32][0] - w[30][0], w[32][2] - w[30][2]];
  return deg(Math.acos(clamp1((l[0] * r[0] + l[1] * r[1]) / (Math.hypot(l[0], l[1]) * Math.hypot(r[0], r[1])))));
}

export type NumberMode = "beginner" | "detail";
type Unit = "°" | " cm" | " 肩寬";
type Kind = "elbow" | "shoulder" | "elevation" | "wristDiff" | "tilt" | "stance" | "feet";

export interface MetricDef {
  id: string;
  label: string;
  unit: Unit;
  hint: string;
  kind: Kind;
  fn: (w: Vec3[], tilt: [number, number] | null) => number;
}

export const METRICS: MetricDef[] = [
  { id: "lElbow", label: "弓手肘角（左）", unit: "°", hint: "180° = 完全伸直", kind: "elbow", fn: (w) => angle(w[11], w[13], w[15]) },
  { id: "rElbow", label: "妻手肘角（右）", unit: "°", hint: "", kind: "elbow", fn: (w) => angle(w[12], w[14], w[16]) },
  { id: "lShoulder", label: "左肩開角", unit: "°", hint: "軀幹與上臂夾角", kind: "shoulder", fn: (w) => angle(w[23], w[11], w[13]) },
  { id: "rShoulder", label: "右肩開角", unit: "°", hint: "", kind: "shoulder", fn: (w) => angle(w[24], w[12], w[14]) },
  { id: "lFist", label: "左拳仰角", unit: "°", hint: "肩→腕，相對水平", kind: "elevation", fn: (w) => elevation(w[11], w[15]) },
  { id: "rFist", label: "右拳仰角", unit: "°", hint: "", kind: "elevation", fn: (w) => elevation(w[12], w[16]) },
  { id: "wristDiff", label: "左右腕高低差", unit: " cm", hint: "+ = 弓手較高", kind: "wristDiff", fn: (w) => (w[15][1] - w[16][1]) * 100 },
  { id: "shoulderTilt", label: "肩線傾斜", unit: "°", hint: "+ = 左肩較高", kind: "tilt", fn: (w, t) => t?.[0] ?? tilt(w[12], w[11]) },
  { id: "hipTilt", label: "腰線傾斜", unit: "°", hint: "+ = 左腰較高", kind: "tilt", fn: (w, t) => t?.[1] ?? tilt(w[24], w[23]) },
  {
    id: "stance",
    label: "兩腳寬度",
    unit: " 肩寬",
    hint: "腳踝間距÷肩寬；袴會遮住腳踝",
    kind: "stance",
    fn: (w) => Math.hypot(w[27][0] - w[28][0], w[27][2] - w[28][2]) / Math.hypot(w[11][0] - w[12][0], w[11][2] - w[12][2]),
  },
  { id: "feet", label: "腳尖夾角", unit: "°", hint: "足踏み約 60°", kind: "feet", fn: footAngle },
];

/** 初學者: round to the nearest 5 with 「約」; 詳細: whole numbers (cm to 0.1, 肩寬 to 0.01). */
export function formatMetric(v: number, unit: Unit, mode: NumberMode): string {
  if (!Number.isFinite(v)) return "—";
  if (unit === " 肩寬") return mode === "beginner" ? `約 ${(Math.round(v * 2) / 2).toFixed(1)} 個肩寬` : `${v.toFixed(2)} 個肩寬`;
  if (unit === " cm") return mode === "beginner" ? `約 ${Math.round(v)} cm` : `${v.toFixed(1)} cm`;
  // Avoid "-0°".
  const r = mode === "beginner" ? Math.round(v / 5) * 5 : Math.round(v);
  return mode === "beginner" ? `約 ${r === 0 ? 0 : r}°` : `${r === 0 ? 0 : r}°`;
}

/** Plain-language reading of a value. */
export function describeMetric(kind: Kind, v: number): string {
  if (!Number.isFinite(v)) return "";
  switch (kind) {
    case "elbow":
      return v >= 165 ? "幾乎伸直" : v >= 80 && v <= 100 ? "約直角" : v < 80 ? "彎曲較深" : "微彎";
    case "shoulder":
      return v >= 80 && v <= 100 ? "手臂約水平" : v > 150 ? "手臂高舉" : v < 45 ? "手臂下垂" : "";
    case "elevation":
      return Math.abs(v) <= 5 ? "與肩同高" : v > 45 ? "高舉過頭" : v > 5 ? "高於肩" : "低於肩";
    case "wristDiff":
      return Math.abs(v) <= 3 ? "左右同高" : v > 0 ? "弓手較高" : "妻手較高";
    case "stance":
      return v < 0.6 ? "雙腳併攏" : v < 1.2 ? "略為張開" : "足踏み寬度";
    case "feet":
      return v >= 50 && v <= 70 ? "約 60°（標準）" : v < 50 ? "偏窄" : "偏寬";
    case "tilt":
    default:
      return Math.abs(v) <= 3 ? "水平" : "傾斜";
  }
}
