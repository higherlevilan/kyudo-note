// 小弓 (こゆみ): the site's Q-version (chibi) kyudo practitioner. Pure SVG, no hooks, server-safe.
// White 道衣 over a dark 袴, a 弽 on the right hand. Colours come from the --m-* tokens in
// ./mascot.css (derived from the site palette, with light / dark values), with inline fallbacks.
//
// Kyudo notes: the only time the bow appears is `focus`, in the 執弓の姿勢: a long, asymmetric
// 和弓 (grip below the middle) held upright in the LEFT hand (viewer's right), string outward.
// Never a drawing or release pose.
//
// CSS hooks: svg.mascot[data-mood] · g.mascot-body (bob) · g.mascot-head · g.mascot-look (eye
// tracking) · g.mascot-eyes (blink; open eyes only) · .mascot-sweat · .mascot-spark · .mascot-dots ·
// .mascot-yumi. Add `bob` (or the class mascot-bob on any ancestor) for the gentle float.

import type { CSSProperties, ReactNode } from "react";
import type { Mood } from "@/lib/course/types";
import "./mascot.css";

type Pt = [number, number];

const C = {
  line: "var(--m-line, #3a2e26)",
  skin: "var(--m-skin, #fbe2cc)",
  blush: "var(--m-blush, #f0a49a)",
  hair: "var(--m-hair, #2e2622)",
  gi: "var(--m-gi, #fffdf8)",
  giShade: "var(--m-gi-shade, #e6ddcd)",
  hakama: "var(--m-hakama, #262b3a)",
  hakamaLine: "var(--m-hakama-line, #4d5570)",
  glove: "var(--m-glove, #c89b67)",
  mouth: "var(--m-mouth, #b4503f)",
  sweat: "var(--m-sweat, #8cc4ea)",
  spark: "var(--m-spark, #d99a2b)",
  bow: "var(--m-bow, #9a6532)",
  grip: "var(--m-grip, #b4442b)",
  string: "var(--m-string, #6d6357)",
  shine: "var(--m-shine, #ffffff)",
};

const LW = 2.3; // outline width in viewBox units (0.74 px at 32 px, 3.7 px at 160 px)

const r1 = (n: number) => Math.round(n * 100) / 100;

/** Tapered capsule from a (radius ra) to b (radius rb). */
function capsule(a: Pt, b: Pt, ra: number, rb: number): string {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  const p = (x: number, y: number) => `${r1(x)} ${r1(y)}`;
  return (
    `M${p(a[0] + nx * ra, a[1] + ny * ra)}L${p(b[0] + nx * rb, b[1] + ny * rb)}` +
    `A${r1(rb)} ${r1(rb)} 0 0 0 ${p(b[0] - nx * rb, b[1] - ny * rb)}` +
    `L${p(a[0] - nx * ra, a[1] - ny * ra)}A${r1(ra)} ${r1(ra)} 0 0 0 ${p(a[0] + nx * ra, a[1] + ny * ra)}Z`
  );
}

interface Arm {
  /** shoulder */
  s: Pt;
  /** optional elbow for a bent arm */
  e?: Pt;
  /** hand centre */
  h: Pt;
}

interface Pose {
  /** wearer's right arm (viewer's left), wears the 弽 */
  right: Arm;
  /** wearer's left arm (viewer's right) */
  left: Arm;
  /** draw the right arm in front of the head (hand to chin) */
  rightFront?: boolean;
  head?: string;
  /** shift of the face features / fringe inside the head (looking down) */
  faceDy?: number;
}

const SHOULDER_R: Pt = [38.6, 52];
const SHOULDER_L: Pt = [61.4, 52];

const POSES: Record<Mood, Pose> = {
  happy: { right: { s: SHOULDER_R, h: [33.2, 63.6] }, left: { s: SHOULDER_L, h: [66.8, 63.6] } },
  think: {
    right: { s: SHOULDER_R, e: [31.5, 60.5], h: [40.5, 49.6] },
    left: { s: SHOULDER_L, h: [66.8, 63.6] },
    rightFront: true,
    head: "rotate(-6 50 50)",
  },
  wow: { right: { s: SHOULDER_R, h: [28.6, 57.5] }, left: { s: SHOULDER_L, h: [71.4, 57.5] } },
  oops: { right: { s: SHOULDER_R, h: [33.6, 63.8] }, left: { s: SHOULDER_L, h: [66.4, 63.8] } },
  bow: {
    right: { s: [39, 53.5], h: [44.2, 68.5] },
    left: { s: [61, 53.5], h: [55.8, 68.5] },
    head: "translate(0 5.5)",
    faceDy: 3.2,
  },
  focus: { right: { s: SHOULDER_R, h: [33.2, 63.6] }, left: { s: SHOULDER_L, h: [74.6, 61.2] } },
};

/** The 弽's wrist strap: a short line across the hand on the wrist side. */
function strap(from: Pt, hand: Pt): string {
  const dx = hand[0] - from[0];
  const dy = hand[1] - from[1];
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l;
  const uy = dy / l;
  const cx = hand[0] - ux * 1.3;
  const cy = hand[1] - uy * 1.3;
  const w = 2.6;
  return `M${r1(cx - uy * w)} ${r1(cy + ux * w)}L${r1(cx + uy * w)} ${r1(cy - ux * w)}`;
}

function ArmShape({ arm, glove }: { arm: Arm; glove?: boolean }) {
  const cuff = 3.9;
  const segs: [Pt, Pt][] = arm.e ? [[arm.s, arm.e], [arm.e, arm.h]] : [[arm.s, arm.h]];
  return (
    <g className="mascot-arm">
      {segs.map(([a, b], i) => (
        <path
          key={i}
          d={capsule(a, b, i === 0 ? 4.6 : cuff + 0.2, cuff)}
          fill={C.gi}
          stroke={C.line}
          strokeWidth={LW}
          strokeLinejoin="round"
        />
      ))}
      {arm.e && <circle cx={arm.e[0]} cy={arm.e[1]} r={cuff + 0.1} fill={C.gi} />}
      <circle cx={arm.h[0]} cy={arm.h[1]} r={3.5} fill={glove ? C.glove : C.skin} stroke={C.line} strokeWidth={LW} />
      {glove && <path d={strap(segs[segs.length - 1][0], arm.h)} fill="none" stroke={C.line} strokeWidth={1.1} strokeLinecap="round" />}
    </g>
  );
}

/** The bow in 執弓の姿勢: string straight on the outer side, the grip (wrapped) below the middle. */
function Yumi() {
  const sx = 81.6; // string line
  const top = 1.2;
  const bottom = 95;
  return (
    <g className="mascot-yumi">
      <path d={`M${sx} ${top}L${sx} ${bottom}`} stroke={C.string} strokeWidth={0.9} fill="none" />
      <path
        d={`M${sx} ${top}C76.2 22 74.2 45 74.6 61.2C75 76 77.6 87 ${sx} ${bottom}`}
        stroke={C.bow}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
      />
      {/* 握り: about two-thirds of the way down */}
      <path d="M74.5 56.4L74.6 66.2" stroke={C.grip} strokeWidth={3.6} strokeLinecap="round" fill="none" />
      {/* 末弭 / 本弭 */}
      <circle cx={sx} cy={top + 0.6} r={1.25} fill={C.line} />
      <circle cx={sx} cy={bottom - 0.6} r={1.25} fill={C.line} />
    </g>
  );
}

function Eyes({ mood, dy }: { mood: Mood; dy: number }) {
  const y = 34 + dy;
  const lx = 42.2;
  const rx = 57.8;
  if (mood === "bow") {
    // closed, calm
    return (
      <g className="mascot-eyes-closed" fill="none" stroke={C.line} strokeWidth={2.1} strokeLinecap="round">
        <path d={`M${lx - 3} ${y - 0.4}Q${lx} ${y + 2.2} ${lx + 3} ${y - 0.4}`} />
        <path d={`M${rx - 3} ${y - 0.4}Q${rx} ${y + 2.2} ${rx + 3} ${y - 0.4}`} />
      </g>
    );
  }
  if (mood === "wow") {
    return (
      <g className="mascot-eyes">
        {[lx, rx].map((x) => (
          <g key={x}>
            <circle cx={x} cy={y} r={3.9} fill={C.line} />
            <circle cx={x + 1.3} cy={y - 1.4} r={1.4} fill={C.shine} />
            <circle cx={x - 1.2} cy={y + 1.5} r={0.6} fill={C.shine} />
          </g>
        ))}
      </g>
    );
  }
  if (mood === "focus") {
    return (
      <g className="mascot-eyes">
        {[lx, rx].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={y + 0.4} rx={2.6} ry={2.7} fill={C.line} />
            <circle cx={x + 0.9} cy={y - 0.4} r={0.8} fill={C.shine} />
          </g>
        ))}
        {/* level upper lids: steady, half-lowered gaze */}
        <path
          d={`M${lx - 3.4} ${y - 1.9}L${lx + 3.2} ${y - 1.5}M${rx - 3.2} ${y - 1.5}L${rx + 3.4} ${y - 1.9}`}
          stroke={C.line}
          strokeWidth={1.9}
          strokeLinecap="round"
        />
      </g>
    );
  }
  const up = mood === "think" ? -1.6 : 0;
  const side = mood === "think" ? 0.8 : 0;
  const ry = mood === "oops" ? 3.1 : 3.5;
  return (
    <g className="mascot-eyes">
      {[lx, rx].map((x) => (
        <g key={x}>
          <ellipse cx={x + side} cy={y + up} rx={2.7} ry={ry} fill={C.line} />
          <circle cx={x + side + 0.9} cy={y + up - 1.3} r={1} fill={C.shine} />
        </g>
      ))}
    </g>
  );
}

function Brows({ mood, dy }: { mood: Mood; dy: number }) {
  const s = { fill: "none", stroke: C.line, strokeWidth: 1.8, strokeLinecap: "round" as const };
  const y = 27.6 + dy;
  switch (mood) {
    case "think":
      return (
        <g className="mascot-brows" {...s}>
          <path d={`M39 ${y + 0.4}L45.2 ${y + 0.2}`} />
          <path d={`M55.6 ${y - 0.6}Q58.8 ${y - 2.6} 62 ${y - 1.2}`} />
        </g>
      );
    case "oops":
      return (
        <g className="mascot-brows" {...s}>
          <path d={`M38.6 ${y + 0.9}L45 ${y - 0.8}`} />
          <path d={`M55 ${y - 0.8}L61.4 ${y + 0.9}`} />
        </g>
      );
    case "focus":
      return (
        <g className="mascot-brows" {...s} strokeWidth={2}>
          <path d={`M38.4 ${y - 0.4}L45.4 ${y + 0.9}`} />
          <path d={`M54.6 ${y + 0.9}L61.6 ${y - 0.4}`} />
        </g>
      );
    default:
      return null;
  }
}

function Mouth({ mood, dy }: { mood: Mood; dy: number }) {
  const y = 41.6 + dy;
  const line = { fill: "none", stroke: C.line, strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (mood) {
    case "think":
      return <path className="mascot-mouth" d={`M47.6 ${y + 0.8}Q50.2 ${y - 0.3} 52.8 ${y + 0.9}`} {...line} />;
    case "wow":
      return <ellipse className="mascot-mouth" cx={50} cy={y + 1.6} rx={2.5} ry={3} fill={C.mouth} stroke={C.line} strokeWidth={1.6} />;
    case "oops":
      return <path className="mascot-mouth" d={`M45.4 ${y + 1.2}q1.15 -1.6 2.3 0t2.3 0t2.3 0t2.3 0`} {...line} />;
    case "bow":
      return <path className="mascot-mouth" d={`M48.4 ${y + 0.6}Q50 ${y + 1.6} 51.6 ${y + 0.6}`} {...line} />;
    case "focus":
      return <path className="mascot-mouth" d={`M47.8 ${y + 0.9}L52.2 ${y + 0.9}`} {...line} />;
    default:
      return (
        <path
          className="mascot-mouth"
          d={`M46.4 ${y}Q50 ${y + 0.6} 53.6 ${y}Q53 ${y + 4.4} 50 ${y + 4.5}Q47 ${y + 4.4} 46.4 ${y}Z`}
          fill={C.mouth}
          stroke={C.line}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      );
  }
}

function Extras({ mood }: { mood: Mood }) {
  switch (mood) {
    case "think":
      return (
        <g className="mascot-dots" fill={C.gi} stroke={C.line} strokeWidth={1.4}>
          <circle cx={77} cy={15} r={1.7} />
          <circle cx={82} cy={9} r={2.4} />
          <circle cx={88.4} cy={3.6} r={3} />
        </g>
      );
    case "wow":
      return (
        <g fill={C.spark}>
          <path className="mascot-spark" d="M85 9l1.9 4.6l4.6 1.9l-4.6 1.9l-1.9 4.6l-1.9 -4.6l-4.6 -1.9l4.6 -1.9z" />
          <path className="mascot-spark mascot-spark-2" d="M15 13l1.4 3.4l3.4 1.4l-3.4 1.4l-1.4 3.4l-1.4 -3.4l-3.4 -1.4l3.4 -1.4z" />
        </g>
      );
    case "oops":
      return (
        <path
          className="mascot-sweat"
          d="M73.6 11.5C71.2 16 70.4 18 70.4 19.4a3.2 3.2 0 0 0 6.4 0C76.8 18 76 16 73.6 11.5Z"
          fill={C.sweat}
          stroke={C.line}
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
      );
    default:
      return null;
  }
}

function Head({ mood, pose }: { mood: Mood; pose: Pose }) {
  const dy = pose.faceDy ?? 0;
  return (
    <g className="mascot-head" transform={pose.head}>
      {/* back hair: a short bob */}
      <path
        d="M26.6 33C25.4 15 36.4 4.6 50 4.6C63.6 4.6 74.6 15 73.4 33C73.2 38.4 72 42.4 69.6 44.6L30.4 44.6C28 42.4 26.8 38.4 26.6 33Z"
        fill={C.hair}
        stroke={C.line}
        strokeWidth={LW}
        strokeLinejoin="round"
      />
      {/* face */}
      <ellipse cx={50} cy={31.6 + dy * 0.35} rx={20.4} ry={18.4 - dy * 0.3} fill={C.skin} stroke={C.line} strokeWidth={LW} />
      <g className="mascot-look">
        {/* blush */}
        <ellipse cx={36.6} cy={40.4 + dy} rx={3.1} ry={1.8} fill={C.blush} opacity={0.75} />
        <ellipse cx={63.4} cy={40.4 + dy} rx={3.1} ry={1.8} fill={C.blush} opacity={0.75} />
        <Eyes mood={mood} dy={dy} />
        <Brows mood={mood} dy={dy} />
        <Mouth mood={mood} dy={dy} />
      </g>
      {/* fringe */}
      <path
        transform={dy ? `translate(0 ${dy})` : undefined}
        d="M29.3 30.4C28 16 37.6 8.4 50 8.4C62.4 8.4 72 16 70.7 30.4C69.6 25.6 67.4 22.4 64.2 20.4C63 23.4 60.2 25.2 56.4 25.6C57.4 24 57.8 22.4 57.6 20.6C54.4 23.6 48.6 25.6 42.4 25.2C44 23.8 44.8 22.2 45 20.6C39.6 21.6 33 25 29.3 30.4Z"
        fill={C.hair}
        stroke={C.line}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      {/* tuft */}
      <path d="M48.6 5.4C47.6 1.6 51.4 0.2 55.2 1.6" fill="none" stroke={C.hair} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  );
}

function Body({ pose }: { pose: Pose }) {
  return (
    <g className="mascot-torso">
      {/* 足袋 */}
      <ellipse cx={43.6} cy={95.2} rx={5.4} ry={2.5} fill={C.gi} stroke={C.line} strokeWidth={LW * 0.8} />
      <ellipse cx={56.4} cy={95.2} rx={5.4} ry={2.5} fill={C.gi} stroke={C.line} strokeWidth={LW * 0.8} />
      {/* 道衣 */}
      <path d="M36.6 49.6Q50 46 63.4 49.6L65.4 62.4L34.6 62.4Z" fill={C.gi} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      {/* collar: the wearer's left panel over the right, a "y" seen from the front */}
      <path d="M57.2 48.4L45.6 62.2M42.8 48.4L49.4 55.6" fill="none" stroke={C.line} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M59.6 49L48.4 62.2" fill="none" stroke={C.giShade} strokeWidth={1.4} strokeLinecap="round" />
      {/* 袴 */}
      <path
        d="M34.8 61C33 72 30.4 84 27.6 93.4Q38.6 96.4 49 94L51 94Q61.4 96.4 72.4 93.4C69.6 84 67 72 65.2 61Z"
        fill={C.hakama}
        stroke={C.line}
        strokeWidth={LW}
        strokeLinejoin="round"
      />
      <path d="M50 75L50 93.6M41.6 63.6L37.6 92.6M58.4 63.6L62.4 92.6" fill="none" stroke={C.hakamaLine} strokeWidth={1.2} strokeLinecap="round" />
      {/* 紐 at the waist */}
      <path d="M35.2 64.2Q50 65.4 64.8 64.2" fill="none" stroke={C.hakamaLine} strokeWidth={1.3} strokeLinecap="round" />
      <ArmShape arm={pose.left} />
      {!pose.rightFront && <ArmShape arm={pose.right} glove />}
    </g>
  );
}

export interface MascotProps {
  mood?: Mood;
  /** rendered width and height in px (the drawing is square) */
  size?: number;
  className?: string;
  /** accessible name; without it the drawing is decorative (aria-hidden) */
  title?: string;
  /** gentle float animation (also on when an ancestor has the class mascot-bob) */
  bob?: boolean;
}

export default function Mascot({ mood = "happy", size = 48, className, title, bob = false }: MascotProps) {
  const pose = POSES[mood] ?? POSES.happy;
  const style = { "--mascot-blink-d": `${((size * 7) % 37) / 10}s` } as CSSProperties;
  const a11y = title ? { role: "img" as const } : { "aria-hidden": true as const };
  let front: ReactNode = null;
  if (pose.rightFront) front = <ArmShape arm={pose.right} glove />;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`mascot${bob ? " mascot-bob" : ""}${className ? ` ${className}` : ""}`}
      data-mood={mood}
      style={style}
      focusable="false"
      {...a11y}
    >
      {title && <title>{title}</title>}
      <g className="mascot-body">
        <Body pose={pose} />
        <Head mood={mood} pose={pose} />
        {front}
        {mood === "focus" && <Yumi />}
        {/* in 執弓 the left hand closes over the grip */}
        {mood === "focus" && <circle cx={pose.left.h[0]} cy={pose.left.h[1]} r={3.5} fill={C.skin} stroke={C.line} strokeWidth={LW} />}
        <Extras mood={mood} />
      </g>
    </svg>
  );
}
