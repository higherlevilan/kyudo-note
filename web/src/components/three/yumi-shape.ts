// 和弓的程序化形狀，給 3D 場景（scenes/yumi.ts、scenes/yugaeri.ts）共用。
// - 長度、握的位置、張弦後的弓身曲線與厚度，都沿用〈和弓各部位〉SVG 圖（YumiParts.tsx）的資料：
//   並寸 221 cm、握在從本弭算起約 1/3、握處弓把約 15 cm；曲線本身是示意。
// - 卸弦（裏反り）與拉開（会）的形狀是在張弦形狀上加一個平滑的彎曲量，純屬示意，不是實測。
// - 單位：這裡用 cm 計算，寫進 three.js 時再乘 0.01 換成公尺。
// 座標（弓的本地座標）：y 往上，z 由弦指向弓背（張弦時弦在 z = 0），x 是弓的左右寬度方向。
// 形狀用「沿弓身的長度 s（從本弭量起）→ 中心線的 z」表示；y 由弧長積分而來，所以弓變形時長度不變。
// 握的中心固定在原點高度附近（左手握住的地方不動）。

import type * as T from "three";
import type { SceneCtx } from "./ThreeStage";
import { GRIP_C, L, belly, thick } from "@/components/illustrations/gear/YumiParts";

export { GRIP_C, L };

export type BowState = "unstrung" | "braced" | "drawn";
export const STATES: BowState[] = ["unstrung", "braced", "drawn"];

/** 弓身厚度放大倍數（真實 2〜3 cm 在整把弓的畫面裡太細） */
export const EXAG = 2;
/** 寬度 / 厚度：斷面稍扁（示意） */
const WIDTH_RATIO = 1.15;
/** 弦掛在弭上的位置（cm，從本弭量起），同〈和弓各部位〉圖 */
export const NOCK_LO = 3;
export const NOCK_HI = 217;
/** 搭箭位置（中仕掛け 78〜86 cm 的中間） */
export const NOCK_ARROW = 82;
/** 拉開時握到弦的距離（cm）。弓具店：矢束 85 cm 以內用並寸；這裡以 85 cm 示意 */
export const DRAW_CM = 85;

export const depth = (s: number) => thick(s) * EXAG;
export const width = (s: number) => thick(s) * EXAG * WIDTH_RATIO;

const STEP = 1; // cm
const N = Math.round(L / STEP) + 1;

/** 握附近不彎的一段（±cm），之外才加彎曲量 */
const FLAT = 8;
const UP = L - GRIP_C - FLAT;
const LO = GRIP_C - FLAT;
const bendShape = (s: number, up: number, lo: number, pow: number) => {
  const d = s - GRIP_C;
  if (Math.abs(d) <= FLAT) return 0;
  return d > 0 ? up * ((d - FLAT) / UP) ** pow : lo * ((-d - FLAT) / LO) ** pow;
};

/** centre-line z (cm) at each sample for one state */
function offsets(state: BowState): Float64Array {
  const z = new Float64Array(N);
  const zg = belly(GRIP_C) + depth(GRIP_C) / 2;
  for (let i = 0; i < N; i++) {
    const s = i * STEP;
    const braced = belly(s) + depth(s) / 2;
    if (state === "braced") z[i] = braced;
    // 裏反り：兩端往弓背那一側翻（示意）
    else if (state === "unstrung") z[i] = zg + bendShape(s, 15, 11, 1.6);
    // 拉開：兩端往射手這一側彎（示意；上半部較長，彎得較多；彎曲量取到弦長大致不變）
    else z[i] = braced - bendShape(s, 36, 20, 1.7);
  }
  return z;
}

const SHAPES: Record<BowState, Float64Array> = {
  unstrung: offsets("unstrung"),
  braced: offsets("braced"),
  drawn: offsets("drawn"),
};

export type Weights = Record<BowState, number>;
export const only = (s: BowState): Weights => ({ unstrung: s === "unstrung" ? 1 : 0, braced: s === "braced" ? 1 : 0, drawn: s === "drawn" ? 1 : 0 });
export const mixWeights = (a: Weights, b: Weights, k: number): Weights => ({
  unstrung: a.unstrung + (b.unstrung - a.unstrung) * k,
  braced: a.braced + (b.braced - a.braced) * k,
  drawn: a.drawn + (b.drawn - a.drawn) * k,
});

export interface Frame {
  /** centre (cm) */
  y: number;
  z: number;
  /** unit normal in the y-z plane, pointing to the back (away from the string) */
  ny: number;
  nz: number;
}

/** The bow's centre line for a blend of the three states. */
export class BowCurve {
  z = new Float64Array(N);
  y = new Float64Array(N);
  dz = new Float64Array(N);
  w: Weights = only("braced");

  constructor(w: Weights = only("braced")) {
    this.set(w);
  }

  set(w: Weights) {
    this.w = w;
    for (let i = 0; i < N; i++) this.z[i] = w.unstrung * SHAPES.unstrung[i] + w.braced * SHAPES.braced[i] + w.drawn * SHAPES.drawn[i];
    for (let i = 0; i < N; i++) {
      const a = this.z[Math.max(0, i - 1)];
      const b = this.z[Math.min(N - 1, i + 1)];
      const span = (Math.min(N - 1, i + 1) - Math.max(0, i - 1)) * STEP;
      this.dz[i] = Math.max(-0.95, Math.min(0.95, (b - a) / span));
    }
    // y by arc length, measured from the grip centre (which stays at y = 0)
    const g = GRIP_C / STEP;
    const gi = Math.floor(g);
    const yAt = (i: number) => Math.sqrt(1 - this.dz[i] ** 2) * STEP;
    this.y[gi] = -(g - gi) * Math.sqrt(1 - this.dz[gi] ** 2) * STEP;
    for (let i = gi + 1; i < N; i++) this.y[i] = this.y[i - 1] + (yAt(i - 1) + yAt(i)) / 2;
    for (let i = gi - 1; i >= 0; i--) this.y[i] = this.y[i + 1] - (yAt(i) + yAt(i + 1)) / 2;
  }

  at(s: number): Frame {
    const u = Math.max(0, Math.min(N - 1.0001, s / STEP));
    const i = Math.floor(u);
    const f = u - i;
    const y = this.y[i] + (this.y[i + 1] - this.y[i]) * f;
    const z = this.z[i] + (this.z[i + 1] - this.z[i]) * f;
    const dz = this.dz[i] + (this.dz[i + 1] - this.dz[i]) * f;
    const ty = Math.sqrt(1 - dz * dz);
    return { y, z, ny: -dz, nz: ty };
  }

  /** point on the belly (string side) surface at s */
  belly(s: number): [number, number] {
    const f = this.at(s);
    const h = depth(s) / 2;
    return [f.y - f.ny * h, f.z - f.nz * h];
  }

  /** 弦: 5 points (cm, y-z) from the lower nock up — 本弭, 中仕掛け下端, 搭箭處, 中仕掛け上端, 末弭 */
  string(): [number, number][] {
    const lo = this.belly(NOCK_LO);
    const hi = this.belly(NOCK_HI);
    const yN = NOCK_ARROW - GRIP_C;
    const k = (yN - lo[0]) / (hi[0] - lo[0]);
    const straight = lo[1] + (hi[1] - lo[1]) * k;
    const zDrawn = belly(GRIP_C) - DRAW_CM;
    const zN = straight + (zDrawn - straight) * this.w.drawn;
    const n: [number, number] = [yN, zN];
    const toward = (p: [number, number], d: number): [number, number] => {
      const dy = p[0] - n[0];
      const dzz = p[1] - n[1];
      const len = Math.hypot(dy, dzz) || 1;
      return [n[0] + (dy / len) * d, n[1] + (dzz / len) * d];
    };
    return [lo, toward(lo, NOCK_ARROW - 78), n, toward(hi, 86 - NOCK_ARROW), hi];
  }
}

/* ───────── three.js pieces ───────── */

const RING = 12; // vertices around a cross-section

export interface Sleeve {
  mesh: T.Mesh;
  update(c: BowCurve): void;
}

/**
 * A tapered, slightly flattened tube following the bow from s = a to b (cm).
 * pad: extra radius (cm). plate: a thin plate glued on the belly face (関板) instead of a full tube.
 */
export function sleeve(
  ctx: SceneCtx,
  a: number,
  b: number,
  material: T.Material,
  { pad = 0, step = 1.5, plate = false }: { pad?: number; step?: number; plate?: boolean } = {},
): Sleeve {
  const { THREE } = ctx;
  const ss: number[] = [];
  for (let s = a; s < b; s += step) ss.push(s);
  ss.push(b);
  const rows = ss.length;
  const vCount = rows * RING + 2;
  const pos = new Float32Array(vCount * 3);
  const idx: number[] = [];
  for (let r = 0; r < rows - 1; r++)
    for (let j = 0; j < RING; j++) {
      const p = r * RING + j;
      const q = r * RING + ((j + 1) % RING);
      idx.push(p, q, p + RING, q, q + RING, p + RING);
    }
  const c0 = rows * RING;
  const c1 = c0 + 1;
  for (let j = 0; j < RING; j++) {
    idx.push(c0, (j + 1) % RING, j);
    const base = (rows - 1) * RING;
    idx.push(c1, base + j, base + ((j + 1) % RING));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx);
  const mesh = new THREE.Mesh(geo, material);

  const update = (c: BowCurve) => {
    const put = (v: number, x: number, y: number, z: number) => {
      pos[v * 3] = x * 0.01;
      pos[v * 3 + 1] = y * 0.01;
      pos[v * 3 + 2] = z * 0.01;
    };
    ss.forEach((s, r) => {
      const f = c.at(s);
      let hd = depth(s) / 2 + pad;
      let hw = width(s) / 2 + pad;
      let cy = f.y;
      let cz = f.z;
      if (plate) {
        const off = depth(s) / 2 + 0.2;
        cy -= f.ny * off;
        cz -= f.nz * off;
        hd = 0.28;
        hw *= 0.85;
      }
      for (let j = 0; j < RING; j++) {
        const th = (j / RING) * Math.PI * 2;
        const ct = Math.cos(th) * hd;
        put(r * RING + j, Math.sin(th) * hw, cy + f.ny * ct, cz + f.nz * ct);
      }
      if (r === 0) put(c0, 0, cy, cz);
      if (r === rows - 1) put(c1, 0, cy, cz);
    });
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
  };
  update(new BowCurve());
  return { mesh, update };
}

/** A unit cylinder (height 1 along y) placed between two points; used for the string. */
export function rod(ctx: SceneCtx, radiusCm: number, material: T.Material) {
  const { THREE } = ctx;
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusCm * 0.01, radiusCm * 0.01, 1, 8, 1), material);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();
  return {
    mesh,
    /** endpoints in cm (y, z), x = 0 */
    set(p: [number, number], q: [number, number]) {
      a.set(0, p[0] * 0.01, p[1] * 0.01);
      b.set(0, q[0] * 0.01, q[1] * 0.01);
      dir.subVectors(b, a);
      const len = dir.length() || 1e-6;
      mesh.position.addVectors(a, b).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(up, dir.normalize());
      mesh.scale.set(1, len, 1);
    },
  };
}
