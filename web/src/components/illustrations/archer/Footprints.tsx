// 足踏み seen from above: big-toe tips on the line to the target, about one 矢束 apart,
// the feet opened to about 60°. Same convention as the figures: the target is on the right
// (the archer's left), the archer faces the bottom of the picture.

import { feet } from "./geometry";
import { POSES } from "@/content/illustrations/archer/poses";

type Pt = [number, number];

const INK = "var(--ink)";
const SURFACE = "var(--surface)";
const MUTED = "var(--muted)";
const WOOD = "var(--wood)";
const VERMILION = "var(--vermilion)";

/** Tabi sole in foot coordinates: u from heel (0) to big-toe tip (24), v outward from the big-toe tip. */
const SOLE: Pt[] = [
  [1.6, 0.9], [9, 0.6], [16.5, -1.1], [21, -1.1], [23.5, -0.3], [24, 1.2], [23.2, 2.6], [21.3, 3.1],
  [22, 4.4], [21.8, 6.4], [20.4, 8.1], [17.5, 9.2], [12, 8.4], [6, 7.2], [2.2, 6.6], [0.1, 5.2], [-0.4, 3.2],
];

function sole(toe: Pt, heel: Pt, outward: 1 | -1): string {
  const ax: Pt = [toe[0] - heel[0], toe[1] - heel[1]];
  const l = Math.hypot(ax[0], ax[1]);
  const u: Pt = [ax[0] / l, ax[1] / l];
  // lateral direction, pointing away from the body centre
  let v: Pt = [u[1], -u[0]];
  if (Math.sign(v[0]) !== outward) v = [-v[0], -v[1]];
  const p = SOLE.map(([a, b]): Pt => [toe[0] + u[0] * (a - 24) + v[0] * b, toe[1] + u[1] * (a - 24) + v[1] * b]);
  const r = (n: number) => Math.round(n * 10) / 10;
  return `M${p.map(([x, y]) => `${r(x)} ${r(y)}`).join("L")}Z`;
}

export default function Footprints({ className }: { className?: string }) {
  const f = feet(POSES.ashibumi);
  // Top view: screen x = world x, screen y = world z (forward = down).
  const L = { toe: [f.left.toe[0], f.left.toe[2]] as Pt, heel: [f.left.heel[0], f.left.heel[2]] as Pt };
  const R = { toe: [f.right.toe[0], f.right.toe[2]] as Pt, heel: [f.right.heel[0], f.right.heel[2]] as Pt };
  const y0 = L.toe[1];
  // The two foot axes meet behind the heels; with 60° between them the triangle is equilateral.
  const axis = (p: { toe: Pt; heel: Pt }) => [p.toe[0] - p.heel[0], p.toe[1] - p.heel[1]];
  const [ax, ay] = axis(L);
  const k = L.toe[0] / ax;
  const apex: Pt = [0, y0 - ay * k];
  const arcR = 15;
  const al = Math.hypot(ax, ay);
  const ux = ax / al;
  const uy = ay / al;
  const arcA: Pt = [apex[0] - ux * arcR, apex[1] + uy * arcR];
  const arcB: Pt = [apex[0] + ux * arcR, apex[1] + uy * arcR];
  const half = L.toe[0];
  const dimY = y0 + 11;
  const tx = 158;

  return (
    <svg
      viewBox={`-64 ${Math.floor(apex[1] - 10)} 244 ${Math.ceil(dimY + 22 - (apex[1] - 10))}`}
      className={className ?? "h-auto w-full"}
      role="img"
      aria-label="足踏み的腳位（從上方看）：兩腳拇趾尖與靶心連成一直線，兩腳尖的距離約一個矢束，兩腳張開約 60 度。"
    >
      <title>足踏み的腳位（從上方看）：兩腳拇趾尖與靶心連成一直線，兩腳尖的距離約一個矢束，兩腳張開約 60 度。</title>
      <g aria-hidden="true">
        {/* foot axes, extended back to where they meet */}
        <path
          d={`M${apex[0]} ${apex[1]}L${L.toe[0]} ${L.toe[1]}M${apex[0]} ${apex[1]}L${R.toe[0]} ${R.toe[1]}`}
          stroke={MUTED}
          strokeWidth={0.7}
          strokeDasharray="2 2.5"
          fill="none"
        />
        <path d={`M${arcA[0]} ${arcA[1]}A${arcR} ${arcR} 0 0 0 ${arcB[0]} ${arcB[1]}`} stroke={WOOD} strokeWidth={1.4} fill="none" />
        {/* line through the big-toe tips to the target */}
        <path d={`M-58 ${y0}H${tx - 9}`} stroke={VERMILION} strokeWidth={0.9} strokeDasharray="4 3" fill="none" />
        <circle cx={tx} cy={y0} r={8} fill={SURFACE} stroke={VERMILION} strokeWidth={1.3} />
        <circle cx={tx} cy={y0} r={4.2} fill="none" stroke={VERMILION} strokeWidth={1.3} />
        <circle cx={tx} cy={y0} r={1.3} fill={VERMILION} />
        <path d={sole(L.toe, L.heel, 1)} fill={SURFACE} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
        <path d={sole(R.toe, R.heel, -1)} fill={SURFACE} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
        <circle cx={L.toe[0]} cy={y0} r={1.6} fill={VERMILION} />
        <circle cx={R.toe[0]} cy={y0} r={1.6} fill={VERMILION} />
        {/* width: about one 矢束 between the big-toe tips */}
        <g stroke={WOOD} strokeWidth={1.1} fill="none" strokeLinecap="round">
          <path d={`M${-half} ${y0 + 3}V${dimY + 3}M${half} ${y0 + 3}V${dimY + 3}`} strokeWidth={0.6} />
          <path d={`M${-half + 1} ${dimY}H${half - 1}`} />
          <path d={`M${-half + 5} ${dimY - 3}l-4 3l4 3M${half - 5} ${dimY - 3}l4 3l-4 3`} strokeLinejoin="round" />
        </g>
      </g>
      <text x={0} y={dimY + 15} textAnchor="middle" fontSize={12} fill={WOOD} fontWeight={700}>
        約<tspan lang="ja">矢束</tspan>
      </text>
      <text x={0} y={apex[1] + arcR + 13} textAnchor="middle" fontSize={12} fill={WOOD} fontWeight={700}>
        約 60°
      </text>
      <text x={tx} y={y0 - 13} textAnchor="middle" fontSize={13} fill={VERMILION} lang="ja">
        的
      </text>
      <text x={L.heel[0] + 14} y={L.heel[1] - 2} textAnchor="middle" fontSize={11} fill={MUTED}>
        左腳
      </text>
      <text x={R.heel[0] - 14} y={R.heel[1] - 2} textAnchor="middle" fontSize={11} fill={MUTED}>
        右腳
      </text>
    </svg>
  );
}
