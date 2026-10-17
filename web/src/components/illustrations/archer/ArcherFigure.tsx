// Parametric archer figure: ink-brush style, drawn from pose data (see
// src/content/illustrations/archer/poses.ts). Pure and deterministic, server-renderable.
// Colours come only from CSS variables so the figure follows light / dark mode.

import type { ReactNode } from "react";
import { POSES, type ArcherPose, type PoseId } from "@/content/illustrations/archer/poses";
import {
  ARROW_LEN,
  BOW,
  SK,
  add,
  armJoints,
  bowGeom,
  feet,
  mul,
  project,
  sub,
  unit,
  type ArmJoints,
  type BowGeom,
  type V3,
  type View,
} from "./geometry";

type Pt = [number, number];

const INK = "var(--ink)";
const SURFACE = "var(--surface)";
const WOOD = "var(--wood)";
const WOOD_SOFT = "var(--wood-soft)";
const MUTED = "var(--muted)";
const VERMILION = "var(--vermilion)";
const LINE = "var(--line)";

/** Fixed frames so every pose is drawn at the same scale. */
export const FRAMES: Record<View, { x: number; y: number; w: number; h: number }> = {
  front: { x: -86, y: -336, w: 210, h: 344 },
  side: { x: -138, y: -300, w: 214, h: 308 },
  top: { x: -86, y: -40, w: 210, h: 80 },
};

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;

function to2(p: V3, view: View): Pt {
  const q = project(p, view);
  return [q.x, q.y];
}
const depth = (p: V3, view: View) => project(p, view).d;

function v2sub(a: Pt, b: Pt): Pt {
  return [a[0] - b[0], a[1] - b[1]];
}
function v2len(a: Pt) {
  return Math.hypot(a[0], a[1]);
}
function v2norm(a: Pt): Pt {
  const l = v2len(a) || 1;
  return [a[0] / l, a[1] / l];
}

/** A tapered capsule from a (radius ra) to b (radius rb), as a path. */
function capsule(a: Pt, b: Pt, ra: number, rb: number): string {
  const d = v2sub(b, a);
  const l = v2len(d);
  if (l < Math.abs(ra - rb) + 0.5) {
    const r = Math.max(ra, rb);
    const c = l < 0.01 ? a : ra > rb ? a : b;
    return `M${pt([c[0] - r, c[1]])}a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0Z`;
  }
  const u = v2norm(d);
  const n: Pt = [-u[1], u[0]];
  const a1: Pt = [a[0] + n[0] * ra, a[1] + n[1] * ra];
  const b1: Pt = [b[0] + n[0] * rb, b[1] + n[1] * rb];
  const b2: Pt = [b[0] - n[0] * rb, b[1] - n[1] * rb];
  const a2: Pt = [a[0] - n[0] * ra, a[1] - n[1] * ra];
  return `M${pt(a1)}L${pt(b1)}A${r1(rb)} ${r1(rb)} 0 0 0 ${pt(b2)}L${pt(a2)}A${r1(ra)} ${r1(ra)} 0 0 0 ${pt(a1)}Z`;
}

/** The capsule outline without the cap at a (for limbs that grow out of the body). */
function openCapsule(a: Pt, b: Pt, ra: number, rb: number): string {
  const u = v2norm(v2sub(b, a));
  const n: Pt = [-u[1], u[0]];
  const a1: Pt = [a[0] + n[0] * ra, a[1] + n[1] * ra];
  const b1: Pt = [b[0] + n[0] * rb, b[1] + n[1] * rb];
  const b2: Pt = [b[0] - n[0] * rb, b[1] - n[1] * rb];
  const a2: Pt = [a[0] - n[0] * ra, a[1] - n[1] * ra];
  return `M${pt(a1)}L${pt(b1)}A${r1(rb)} ${r1(rb)} 0 0 0 ${pt(b2)}L${pt(a2)}`;
}

/** A polyline offset to both sides with a varying half-width: a tapered brush stroke. */
function ribbon(pts: Pt[], halfW: (t: number) => number): string {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const u = v2norm(v2sub(b, a));
    const n: Pt = [-u[1], u[0]];
    const w = halfW(i / (pts.length - 1));
    left.push([pts[i][0] + n[0] * w, pts[i][1] + n[1] * w]);
    right.push([pts[i][0] - n[0] * w, pts[i][1] - n[1] * w]);
  }
  return `M${left.map(pt).join("L")}L${right.reverse().map(pt).join("L")}Z`;
}

const poly = (pts: Pt[]) => `M${pts.map(pt).join("L")}`;

interface Item {
  d: number;
  key: string;
  node: ReactNode;
}

// --- Body ----------------------------------------------------------------------------------

function bodyFront(pose: ArcherPose): ReactNode {
  const wide = pose.stance === "ashibumi";
  const hw = wide ? 47 : 25;
  const f = feet(pose);
  const footShape = (toe: V3, heel: V3, k: string) => {
    const cx = (toe[0] + heel[0]) / 2;
    const rx = Math.max(5.2, Math.abs(toe[0] - heel[0]) / 2 + 4.2);
    return <ellipse key={k} cx={r1(cx)} cy={-2.6} rx={r1(rx)} ry={2.7} fill={SURFACE} stroke={INK} strokeWidth={1} />;
  };
  // Hakama: waist band at y 101, hem just above the floor; with the feet apart the hem
  // rises a little at the centre and a crease runs down between the legs.
  const hem = wide ? `Q-30 -2 -9 -6Q0 -10 9 -6Q30 -2 ${hw} -3.5` : `Q0 -1.5 ${hw} -3.5`;
  const side = wide ? 26 : 21;
  const hakama = `M-17 -101Q-${side} -58 ${-hw} -3.5${hem}Q${side} -58 17 -101Q0 -99 -17 -101Z`;
  const pleats = [-11, -5, 5, 11].map((x) => {
    const bx = (x / 11) * hw * (Math.abs(x) > 6 ? 0.62 : 0.5) * (wide ? 1 : 1.1);
    return `M${x} -99L${r1(bx)} -5`;
  });
  return (
    <g>
      {footShape(f.left.toe, f.left.heel, "fl")}
      {footShape(f.right.toe, f.right.heel, "fr")}
      {/* 道衣 (gi) */}
      <path
        d="M-5.5 -146.5Q-14 -144 -19.5 -139.5Q-21 -130 -18.6 -121Q-17.4 -110 -16.6 -98L16.6 -98Q17.4 -110 18.6 -121Q21 -130 19.5 -139.5Q14 -144 5.5 -146.5Z"
        fill={SURFACE}
        stroke={INK}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      {/* collar: left panel over right, reads as a "y" from the front */}
      <path d="M5.8 -146.5L-9.5 -103M-5.8 -146.5L-1.2 -130" fill="none" stroke={INK} strokeWidth={1.1} strokeLinecap="round" />
      <path d="M9 -145L-6 -104" fill="none" stroke={INK} strokeWidth={0.5} opacity={0.55} />
      {/* 袴 */}
      <path d={hakama} fill={INK} fillOpacity={0.86} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d={pleats.join("")} fill="none" stroke={SURFACE} strokeWidth={0.6} opacity={0.4} />
      {wide && <path d="M0 -62L0 -11" fill="none" stroke={SURFACE} strokeWidth={0.7} opacity={0.45} />}
      <path d="M-17 -101Q0 -99 17 -101M-16.6 -97.5Q0 -95.5 16.6 -97.5" fill="none" stroke={SURFACE} strokeWidth={0.6} opacity={0.5} />
    </g>
  );
}

function bodySide(pose: ArcherPose): ReactNode {
  const f = feet(pose);
  // Seen from the target: screen x = −z, the archer's front on the left.
  const zs = [f.left.toe[2], f.left.heel[2], f.right.toe[2], f.right.heel[2]];
  const front = -Math.max(...zs) - 1.5;
  const back = -Math.min(...zs) + 1.5;
  return (
    <g>
      <ellipse cx={r1((front + back) / 2)} cy={-2.6} rx={r1((back - front) / 2)} ry={2.7} fill={SURFACE} stroke={INK} strokeWidth={1} />
      <path
        d="M-4 -147.5Q-8.5 -143 -11 -132Q-12 -116 -10.5 -98L10.5 -98Q11.8 -118 10.6 -132Q9 -141 4.5 -148Z"
        fill={SURFACE}
        stroke={INK}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <path d="M-4 -147.5Q-6.5 -140 -9.4 -128" fill="none" stroke={INK} strokeWidth={1} strokeLinecap="round" />
      {/* 袴, with the 腰板 at the back */}
      <path
        d="M-12 -102Q-17 -55 -27 -3.5Q0 -1.5 25 -3.5Q16 -55 12 -102Q0 -100 -12 -102Z"
        fill={INK}
        fillOpacity={0.86}
        stroke={INK}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <path d="M5 -101L11 -114L14.5 -113L13 -101Z" fill={INK} fillOpacity={0.86} stroke={INK} strokeWidth={1} strokeLinejoin="round" />
      <path d="M-6 -100L-14 -5M2 -100L1 -4M8 -100L16 -5" fill="none" stroke={SURFACE} strokeWidth={0.6} opacity={0.4} />
    </g>
  );
}

/** Seen from above: the hakama spreading below, the shoulders, and the head (hair, nose toward the face). */
function bodyTop(pose: ArcherPose): ReactNode {
  const hw = pose.stance === "ashibumi" ? 47 : 26;
  return (
    <path
      d={`M${-hw} 0C${-hw} -20 ${hw} -20 ${hw} 0C${hw} 22 ${-hw} 22 ${-hw} 0Z`}
      fill={INK}
      fillOpacity={0.3}
      stroke={INK}
      strokeWidth={1}
    />
  );
}

function torsoTop(): ReactNode {
  return (
    <g>
      <path d="M-21 -1C-21 -12 21 -12 21 -1C21 10 -21 10 -21 -1Z" fill={SURFACE} stroke={INK} strokeWidth={1.2} />
      <path d="M-6 7.6L0 3.5L6 7.6" fill="none" stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
    </g>
  );
}

function headTop(headYaw: number): ReactNode {
  const a = ((90 - headYaw) * Math.PI) / 180;
  const f: Pt = [Math.cos(a), Math.sin(a)];
  const deg = (Math.atan2(f[1], f[0]) * 180) / Math.PI;
  return (
    <g transform={`rotate(${r1(deg)})`}>
      <path d="M9.6 -1.6L12.2 0L9.6 1.6Z" fill={SURFACE} stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />
      <ellipse cx={0.6} cy={-8.4} rx={1.8} ry={1.3} fill={SURFACE} stroke={INK} strokeWidth={0.7} />
      <ellipse cx={0.6} cy={8.4} rx={1.8} ry={1.3} fill={SURFACE} stroke={INK} strokeWidth={0.7} />
      <ellipse cx={0} cy={0} rx={10} ry={8.4} fill={INK} />
    </g>
  );
}

/** Head with a hair cap, drawn for a turn ρ relative to the camera (0 = facing it, 90 = profile facing right). */
function head(rho: number, cx: number, cy: number): ReactNode {
  const rad = (rho * Math.PI) / 180;
  const p = Math.min(1, Math.abs(Math.sin(rad)));
  const s = Math.sin(rad) < 0 ? -1 : 1;
  const rx = SK.headRx + 1.4 * p;
  const ry = SK.headRy;
  const at = (deg: number): Pt => {
    const a = (deg * Math.PI) / 180;
    return [cx + s * rx * Math.cos(a), cy - ry * Math.sin(a)];
  };
  const a0 = -8 + 80 * p;
  const a1 = 188 + 58 * p;
  const arc: Pt[] = [];
  for (let i = 0; i <= 24; i++) arc.push(at(a0 + ((a1 - a0) * i) / 24));
  const ctrl: Pt = [cx + s * (0.5 * p), cy - (3.2 - 4.5 * p)];
  const hair = `M${arc.map(pt).join("L")}Q${pt(ctrl)} ${pt(arc[0])}Z`;
  // Eyes on a sphere, ±32° either side of the face direction.
  const eyes = [-32, 32]
    .map((o) => ((rho + o) * Math.PI) / 180)
    .filter((a) => Math.cos(a) > 0.2)
    .map((a) => cx + rx * 0.9 * Math.sin(a));
  const nose = p > 0.55 ? `M${pt([cx + s * (rx - 0.6), cy - 1])}L${pt([cx + s * (rx + 1.5), cy + 2.6])}L${pt([cx + s * (rx - 0.2), cy + 3.4])}` : null;
  const earX = cx - rx * Math.cos(rad) * s * 0.98;
  return (
    <g>
      <path d={`M-4.3 ${cy + 8}L-4.6 ${cy + 15}L4.6 ${cy + 15}L4.3 ${cy + 8}Z`} transform={`translate(${r1(cx)} 0)`} fill={SURFACE} stroke={INK} strokeWidth={1} />
      <ellipse cx={r1(cx)} cy={r1(cy)} rx={r1(rx)} ry={ry} fill={SURFACE} stroke={INK} strokeWidth={1.2} />
      {nose && <path d={nose} fill={SURFACE} stroke={INK} strokeWidth={1} strokeLinejoin="round" />}
      <path d={hair} fill={INK} />
      {p > 0.3 && <ellipse cx={r1(earX)} cy={r1(cy + 0.8)} rx={1.5} ry={2.5} fill={SURFACE} stroke={INK} strokeWidth={0.8} />}
      {eyes.map((x, i) => (
        <path key={i} d={`M${r1(x - 1.1)} ${r1(cy + 0.6)}L${r1(x + 1.1)} ${r1(cy + 0.4)}`} stroke={INK} strokeWidth={0.9} strokeLinecap="round" />
      ))}
    </g>
  );
}

// --- Arms ----------------------------------------------------------------------------------

function armItems(j: ArmJoints, side: "left" | "right", view: View): Item[] {
  const E = to2(j.elbow, view);
  const W = to2(j.wrist, view);
  const H = to2(j.hand, view);
  // Sleeve: covers the upper arm and the elbow, with the 袂 hanging a little below.
  const sleeveEnd3 = add(j.elbow, mul(j.foreDir, 5));
  const SE = to2(sleeveEnd3, view);
  // The sleeve starts a little inside the shoulder so it grows out of the 道衣 without a seam.
  const S = to2(add(j.shoulder, [side === "left" ? -3 : 3, 1, 0]), view);
  const seg = v2sub(SE, S);
  const ua = v2norm(seg);
  let n: Pt = [-ua[1], ua[0]];
  if (n[1] < 0) n = [-n[0], -n[1]]; // n points down on screen
  const r0 = 6.2;
  const rE = 5.6;
  // 袂: the loose sleeve hangs a little below the arm when the arm is raised sideways.
  const droop = view !== "top" && v2len(seg) > 12 ? 4.5 * Math.abs(ua[0]) : 0;
  const a: Pt = [SE[0] + n[0] * rE, SE[1] + n[1] * rE];
  const m: Pt = [S[0] + seg[0] * 0.45 + n[0] * r0, S[1] + seg[1] * 0.45 + n[1] * r0];
  const tamotoCurve = `C${pt([a[0] + n[0] * droop, a[1] + n[1] * droop + droop])} ${pt([m[0] + n[0] * droop * 0.8 + ua[0] * 3, m[1] + droop * 1.2])} ${pt(m)}`;
  const tamoto = droop > 1 ? `M${pt(a)}${tamotoCurve}Z` : "";
  const sleeveFill = capsule(S, SE, r0, rE) + tamoto;
  // Outline left open at the shoulder so the sleeve flows out of the 道衣.
  const sleeveLine = v2len(seg) > Math.abs(r0 - rE) + 0.5 ? openCapsule(S, SE, r0, rE) + (droop > 1 ? `M${pt(a)}${tamotoCurve}` : "") : sleeveFill;
  const dS = depth(j.shoulder, view);
  const dE = depth(j.elbow, view);
  const dW = depth(j.wrist, view);
  const dH = depth(j.hand, view);
  const items: Item[] = [
    {
      d: (dS + dE) / 2,
      key: `${side}-upper`,
      node: (
        <g>
          <path d={sleeveFill} fill={SURFACE} />
          <path d={sleeveLine} fill="none" stroke={INK} strokeWidth={1.15} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      ),
    },
    {
      d: (dE + dW) / 2 + 0.5,
      key: `${side}-fore`,
      node: <path d={capsule(E, W, 3.5, 2.7)} fill={SURFACE} stroke={INK} strokeWidth={1.05} />,
    },
  ];
  if (side === "left") {
    items.push({
      d: dH + 3,
      key: "left-hand",
      node: <path d={capsule(W, H, 2.9, 4.2)} fill={SURFACE} stroke={INK} strokeWidth={1.05} />,
    });
  } else {
    // 弽 (yugake): deerskin glove with a cuff over the wrist.
    const cuffA = to2(sub(j.wrist, mul(j.foreDir, 5)), view);
    items.push({
      d: dH + 3,
      key: "right-hand",
      node: (
        <g>
          <path d={capsule(cuffA, W, 3.6, 3.9)} fill={WOOD_SOFT} stroke={INK} strokeWidth={1} />
          <path d={capsule(W, H, 3.6, 4.7)} fill={WOOD_SOFT} stroke={INK} strokeWidth={1.05} />
        </g>
      ),
    });
  }
  return items;
}

// --- Bow and arrows --------------------------------------------------------------------------

function bowItems(g: BowGeom, view: View): Item[] {
  const up = g.upperLimb.map((p) => to2(p, view));
  const lo = g.lowerLimb.map((p) => to2(p, view));
  const limb = (pts: Pt[], key: string, d: number, wTip: number) => ({
    d,
    key,
    node: (
      <path
        d={ribbon(pts, (t) => 1.85 - (1.85 - wTip) * t)}
        fill={WOOD}
        stroke={SURFACE}
        strokeWidth={0.9}
        paintOrder="stroke"
        strokeLinejoin="round"
      />
    ),
  });
  const avg = (ps: V3[]) => ps.reduce((s, p) => s + depth(p, view), 0) / ps.length;
  // 握り革: the leather grip, mostly inside the fist.
  const gripA = to2(add(g.grip, mul(g.u, -7)), view);
  const gripB = to2(add(g.grip, mul(g.u, 8)), view);
  // 弭: the horn-capped tips.
  const capTop = [to2(g.upperLimb[g.upperLimb.length - 2], view), to2(g.tipTop, view)];
  const capBot = [to2(g.lowerLimb[g.lowerLimb.length - 2], view), to2(g.tipBottom, view)];
  const dg = depth(g.grip, view);
  return [
    limb(up, "bow-upper", avg(g.upperLimb), 1.05),
    limb(lo, "bow-lower", avg(g.lowerLimb), 1.1),
    {
      d: dg + 0.2,
      key: "bow-grip",
      node: <path d={capsule(gripA, gripB, 2.1, 2.1)} fill={INK} fillOpacity={0.75} />,
    },
    {
      d: Math.max(avg(g.upperLimb), avg(g.lowerLimb)) + 0.1,
      key: "bow-caps",
      node: <path d={`${poly(capTop)}${poly(capBot)}`} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />,
    },
  ];
}

function stringItem(g: BowGeom, drawn: boolean, view: View): Item {
  const pts = drawn ? [g.tipTop, g.nock, g.tipBottom] : [g.tipTop, g.tipBottom];
  const d = drawn ? depth(g.nock, view) - 0.4 : depth(add(g.grip, mul(g.b, -BOW.brace)), view) - 0.2;
  return {
    d,
    key: "string",
    node: <path d={poly(pts.map((p) => to2(p, view)))} fill="none" stroke={MUTED} strokeWidth={0.6} strokeLinejoin="round" />,
  };
}

/** An arrow from the nock along dirV; `from`/`to` (cm from the nock) draw only part of it. */
function arrowNode(nock: V3, dirV: V3, view: View, key: string, from = 0, to = ARROW_LEN): ReactNode {
  const tip = add(nock, mul(dirV, ARROW_LEN));
  const A = to2(nock, view);
  const B = to2(tip, view);
  if (from > 0 || to < ARROW_LEN) {
    const P = to2(add(nock, mul(dirV, from)), view);
    const Q = to2(add(nock, mul(dirV, to)), view);
    return (
      <g key={key}>
        <path d={`M${pt(P)}L${pt(Q)}`} stroke={SURFACE} strokeWidth={2} strokeLinecap="round" />
        <path d={`M${pt(P)}L${pt(Q)}`} stroke={INK} strokeWidth={0.9} strokeLinecap="round" />
        {to >= ARROW_LEN && <path d={`M${pt(to2(add(nock, mul(dirV, ARROW_LEN - 3)), view))}L${pt(B)}`} stroke={INK} strokeWidth={1.7} strokeLinecap="round" />}
      </g>
    );
  }
  const u = v2norm(v2sub(B, A));
  const l = v2len(v2sub(B, A));
  const n: Pt = [-u[1], u[0]];
  const along = (k: number): Pt => [A[0] + u[0] * k * (l / ARROW_LEN), A[1] + u[1] * k * (l / ARROW_LEN)];
  const vane = (sgn: number) => {
    const a = along(3);
    const b = along(17);
    const h = 1.7 * sgn * Math.min(1, l / 30);
    return `M${pt(a)}L${pt([a[0] + n[0] * h * 0.6, a[1] + n[1] * h * 0.6])}L${pt([b[0] + n[0] * h, b[1] + n[1] * h])}L${pt(b)}Z`;
  };
  return (
    <g key={key}>
      <path d={`M${pt(A)}L${pt(B)}`} stroke={SURFACE} strokeWidth={2} strokeLinecap="round" />
      <path d={`M${pt(A)}L${pt(B)}`} stroke={INK} strokeWidth={0.9} strokeLinecap="round" />
      <path d={`${vane(1)}${vane(-1)}`} fill={MUTED} stroke={INK} strokeWidth={0.35} />
      <path d={`M${pt(along(ARROW_LEN - 3))}L${pt(B)}`} stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
    </g>
  );
}

type Frame = { x: number; y: number; w: number; h: number };

/** Tight frame around the drawing (screen coordinates), with room for the 的 marker on the right. */
function fitFrame(pts: Pt[], marker: boolean, floor: boolean): Frame {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.floor(Math.min(...xs) - 7);
  const x1 = Math.ceil(Math.max(...xs, marker ? 58 : -Infinity) + (marker ? 40 : 7));
  const y0 = Math.floor(Math.min(...ys) - (floor ? 6 : 9));
  const y1 = floor ? 7 : Math.ceil(Math.max(...ys) + 9);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// --- Figure --------------------------------------------------------------------------------

export interface ArcherFigureProps {
  pose: PoseId | ArcherPose;
  view?: View;
  /** small thumbnail: no text labels, no guide lines */
  compact?: boolean;
  /** "fixed": the same frame for every pose (strips); "fit": cropped to the figure */
  frame?: "fixed" | "fit";
  /**
   * With frame="fit": size the SVG as (frame height × var(--archer-k)) px, so figures with
   * different frames share one scale. Set --archer-k on a parent (e.g. 0.62 on phones).
   */
  scaled?: boolean;
  /** multiplies the scale of a `scaled` figure (e.g. a small inset drawn larger) */
  zoom?: number;
  /** draw the 的 direction marker (front / top views) */
  target?: boolean;
  /** hide from assistive tech (when the surrounding link / caption already names the pose) */
  decorative?: boolean;
  className?: string;
}

export default function ArcherFigure({
  pose: poseIn,
  view = "front",
  compact = false,
  frame = "fixed",
  scaled = false,
  zoom = 1,
  target = true,
  decorative = false,
  className,
}: ArcherFigureProps) {
  const pose = typeof poseIn === "string" ? POSES[poseIn] : poseIn;
  const L = armJoints("left", pose.left);
  const R = armJoints("right", pose.right);
  const g = bowGeom(pose, L.hand);
  const drawn = pose.bow.draw > BOW.brace + 0.5;
  const rho = view === "front" ? pose.headYaw : pose.headYaw - 90;
  const front = view === "front";

  // Points that must stay inside a fitted frame.
  const extent: Pt[] = [...g.upperLimb, ...g.lowerLimb, L.hand, R.hand, L.elbow, R.elbow].map((p) => to2(p, view));
  const top = view === "top";
  const hemX = front || top ? (pose.stance === "ashibumi" ? 48 : 27) : 28;
  if (top) extent.push([-hemX, -20], [hemX, 20]);
  else extent.push([-hemX, 0], [hemX, 0], [-12, -SK.headY - SK.headRy], [12, -SK.headY - SK.headRy]);

  const items: Item[] = top
    ? [
        { d: 40, key: "body", node: bodyTop(pose) },
        { d: 130, key: "torso", node: torsoTop() },
        { d: 175, key: "head", node: headTop(pose.headYaw) },
      ]
    : [
        { d: -0.2, key: "body", node: front ? bodyFront(pose) : bodySide(pose) },
        { d: 0.2, key: "head", node: head(rho, 0, -SK.headY) },
      ];
  items.push(
    ...armItems(L, "left", view),
    ...armItems(R, "right", view),
    ...bowItems(g, view),
    stringItem(g, drawn, view),
  );

  if (pose.arrow === "nocked") {
    const nock = add(g.nock, mul(g.r, 1.2));
    items.push({ d: depth(nock, view) + 1.2, key: "arrow", node: arrowNode(nock, g.b, view, "arrow") });
    extent.push(to2(add(nock, mul(g.b, ARROW_LEN)), view));
  } else if (pose.arrow === "held") {
    // 甲矢・乙矢 in the right hand, points toward the 末弭 (the apex of the isosceles triangle).
    const apex = g.tipTop;
    const a = unit(sub(apex, R.hand));
    const side = unit([a[2], 0, -a[0]]);
    const ahead = 8;
    const nocks = [-0.9, 0.9].map((o) => add(add(R.hand, mul(a, ahead - ARROW_LEN)), mul(side, o)));
    extent.push(...nocks.map((p) => to2(p, view)));
    // Most of the shafts run back behind the hip; only the points show in front of the fist.
    const mid = add(R.hand, mul(a, (ahead - ARROW_LEN) / 2));
    items.push({ d: depth(mid, view), key: "held", node: <g>{nocks.map((nk, i) => arrowNode(nk, a, view, `held-${i}`))}</g> });
    items.push({
      d: depth(R.hand, view) + 4,
      key: "held-points",
      node: <g>{nocks.map((nk, i) => arrowNode(nk, a, view, `pt-${i}`, ARROW_LEN - ahead - 3, ARROW_LEN))}</g>,
    });
    if (!compact && front) {
      // The arrows' line extended to the 末弭: with the bow it forms the isosceles triangle.
      items.push({
        d: 999,
        key: "triangle",
        node: (
          <path
            d={`M${pt(to2(add(R.hand, mul(a, ahead + 3)), view))}L${pt(to2(apex, view))}`}
            fill="none"
            stroke={VERMILION}
            strokeWidth={0.8}
            strokeDasharray="2.5 2.5"
            opacity={0.85}
          />
        ),
      });
    }
  }

  items.sort((a, b) => a.d - b.d);

  const marker = (front || top) && target && !compact;
  const F: Frame = frame === "fixed" ? FRAMES[view] : fitFrame(extent, marker, !top);
  const label = `${pose.term}${front ? "" : top ? "（從上方看）" : "（從靶的方向看）"}`;
  const extras: ReactNode[] = [];

  // Sight line to the target.
  if (pose.gaze && front && !compact) {
    extras.push(
      <path
        key="gaze"
        d={`M${SK.headRx + 4} ${-SK.headY + 0.5}H${F.x + F.w - 6}`}
        stroke={MUTED}
        strokeWidth={0.7}
        strokeDasharray="1.2 3"
        strokeLinecap="round"
        opacity={0.8}
      />,
    );
  }

  if (pose.motion === "descend" && front) {
    const marks = [L.hand, R.hand].map((h) => to2(h, view));
    extras.push(
      <g key="descend" fill="none" stroke={VERMILION} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
        {marks.map((m, i) => (
          <path key={i} d={`M${r1(m[0] - 2.5)} ${r1(m[1] + 9)}l2.5 3l2.5 -3M${r1(m[0] - 2.5)} ${r1(m[1] + 13)}l2.5 3l2.5 -3`} />
        ))}
      </g>,
    );
  }

  if (pose.motion === "release" && front) {
    const h = to2(R.hand, view);
    const gp = to2(g.grip, view);
    extras.push(
      <g key="release" fill="none" stroke={MUTED} strokeWidth={0.8} strokeLinecap="round" opacity={0.9}>
        <path d={`M${r1(h[0] + 8)} ${r1(h[1] - 4)}h12M${r1(h[0] + 10)} ${r1(h[1] + 1)}h15M${r1(h[0] + 8)} ${r1(h[1] + 6)}h11`} />
        {/* 弓返り: the bow turning in the hand */}
        <path d={`M${r1(gp[0] - 7)} ${r1(gp[1] + 9)}A9 3.4 0 1 0 ${r1(gp[0] + 7)} ${r1(gp[1] + 9)}`} stroke={VERMILION} />
        <path d={`M${r1(gp[0] + 4.2)} ${r1(gp[1] + 11.6)}l3 -2.6l-1 3.8`} stroke={VERMILION} />
      </g>,
    );
  }

  if (top && !compact) {
    // The line through both shoulders (drawn over the body so it stays visible).
    extras.push(
      <path key="shoulders" d={`M${-SK.shoulderX - 22} 0H${SK.shoulderX + 22}`} stroke={VERMILION} strokeWidth={0.9} strokeDasharray="2.5 2.5" />,
    );
  }

  const right = F.x + F.w;
  const my = F.y + F.h - 23;
  const targetMark = marker ? (
    <g aria-hidden="true">
      <path d={`M${right - 40} ${my}h30`} stroke={VERMILION} strokeWidth={1.4} strokeLinecap="round" />
      <path d={`M${right - 15} ${my - 4.5}l5 4.5l-5 4.5`} fill="none" stroke={VERMILION} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      {!compact && !top && (
        <text x={right - 25} y={my - 8} textAnchor="middle" fontSize={18} fill={VERMILION} lang="ja">
          的
        </text>
      )}
    </g>
  ) : null;

  const svgProps = decorative ? { "aria-hidden": true as const } : { role: "img" as const, "aria-label": `${label}：${pose.alt}` };
  const style = scaled ? { height: `calc(${r1(F.h * zoom)}px * var(--archer-k, 1))`, width: "auto" } : undefined;

  return (
    <svg viewBox={`${F.x} ${F.y} ${F.w} ${F.h}`} className={className ?? (scaled ? "max-w-full" : "h-auto w-full")} style={style} {...svgProps}>
      {!decorative && <title>{`${label}：${pose.alt}`}</title>}
      <g aria-hidden="true">
        {!top && <path d={`M${-hemX - 14} 0H${hemX + 14}`} stroke={LINE} strokeWidth={1.2} strokeLinecap="round" />}
        {items.map((it) => (
          <g key={it.key}>{it.node}</g>
        ))}
        {extras}
      </g>
      {targetMark}
    </svg>
  );
}
