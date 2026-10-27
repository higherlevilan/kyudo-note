// 關卡徽章: one code-drawn badge per chapter (shape + emblem + dye colour), after TechEDU's ux.js
// badge designs but in the 和風 palette. Locked badges are drawn in paper/line tones with a lock;
// unlocked ones take the chapter's dye. Colours come from CSS tokens, so dark mode just works.
import type { ChapterId } from "@/lib/course/types";

const CX = 50;
const CY = 50;
const pt = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(CX + r * Math.cos(a)).toFixed(1)} ${(CY + r * Math.sin(a)).toFixed(1)}`;
};

/** Polygon alternating between two radii (n points). */
function star(n: number, r1: number, r2: number) {
  let d = "";
  for (let i = 0; i < n * 2; i++) d += `${i ? "L" : "M"}${pt(i % 2 ? r2 : r1, (180 * i) / n - 90)} `;
  return `${d}Z`;
}

/** 梅 / 桜 outline: n round petals. */
function flower(n: number, r: number, petal: number) {
  const step = 360 / n;
  let d = `M${pt(r, -90 - step / 2)} `;
  for (let i = 0; i < n; i++) d += `A${petal} ${petal} 0 1 1 ${pt(r, -90 + step / 2 + i * step)} `;
  return `${d}Z`;
}

type Part = { d: string; kind: "line" | "thin" | "fill" | "soft" | "dot" | "accent" };

interface Design {
  colour: string;
  shape: string;
  emblem: Part[];
}

// Ribs of the folding fan (禮法): from radius 12 to 30 around (50, 70).
const fanRibs = [-130, -110, -90, -70, -50]
  .map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `M${(50 + 12 * Math.cos(a)).toFixed(1)} ${(70 + 12 * Math.sin(a)).toFixed(1)} L${(50 + 30 * Math.cos(a)).toFixed(1)} ${(70 + 30 * Math.sin(a)).toFixed(1)}`;
  })
  .join(" ");

export const BADGE_DESIGNS: Record<ChapterId, Design> = {
  // 序章 走進道場: scalloped seal, 鳥居-like dojo gate.
  guide: {
    colour: "var(--wood)",
    shape: star(18, 45, 41),
    emblem: [
      { d: "M26 34 Q50 27 74 34", kind: "line" },
      { d: "M32 44 H68 M37 34 V70 M63 34 V70 M50 31 V44", kind: "line" },
      { d: "M30 74 H44 M56 74 H70", kind: "thin" },
    ],
  },
  // 第一關 禮法與體配: 亀甲 hexagon, folding fan.
  etiquette: {
    colour: "var(--indigo)",
    shape: "M50 5 L89 27.5 V72.5 L50 95 L11 72.5 V27.5 Z",
    emblem: [
      { d: "M24 55 A30 30 0 0 1 76 55 L60.4 64 A12 12 0 0 0 39.6 64 Z", kind: "soft" },
      { d: fanRibs, kind: "thin" },
      { d: "M47.5 70 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0", kind: "dot" },
    ],
  },
  // 第二關 射法八節: eight-pointed star, bow and arrow.
  shaho: {
    colour: "var(--vermilion)",
    shape: star(8, 47, 37),
    emblem: [
      { d: "M43 19 C66 33 66 71 43 85", kind: "line" },
      { d: "M43 19 V85", kind: "thin" },
      { d: "M27 60 H78 M78 60 l-7 -4.5 M78 60 l-7 4.5", kind: "line" },
      { d: "M27 60 l-4 -4 M27 60 l-4 4 M32 60 l-4 -4 M32 60 l-4 4", kind: "thin" },
    ],
  },
  // 第三關 射癖與矢所: rounded square, 霞的 with an arrow that missed the centre.
  shaguse: {
    colour: "var(--moss)",
    shape: "M24 8 H76 Q92 8 92 24 V76 Q92 92 76 92 H24 Q8 92 8 76 V24 Q8 8 24 8 Z",
    emblem: [
      { d: "M28 52 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0", kind: "line" },
      { d: "M36 52 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0", kind: "thin" },
      { d: "M44 52 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0", kind: "fill" },
      { d: "M61 41 L75 27 M75 27 l-1 6 M75 27 l-6 1", kind: "line" },
      { d: "M58.5 43.5 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0", kind: "accent" },
    ],
  },
  // 第四關 弓具: 菱 diamond, three fanned arrows.
  equipment: {
    colour: "var(--yamabuki)",
    shape: "M50 3 L97 50 L50 97 L3 50 Z",
    emblem: [
      { d: "M50 76 V30 M44 76 L36 33 M56 76 L64 33", kind: "line" },
      { d: "M50 24 l-4 8 h8 Z M35 27 l-2.6 8.6 l7.8 -1.4 Z M65 27 l-5.2 7.2 l7.8 1.4 Z", kind: "fill" },
      { d: "M46 70 l4 -4 l4 4 M40 70 l3.2 -4.6 l4.4 3 M60 70 l-3.2 -4.6 l-4.4 3", kind: "thin" },
    ],
  },
  // 第五關 文化與哲學: 梅 flower, 円相 brush circle with a small seal.
  culture: {
    colour: "var(--murasaki)",
    shape: flower(5, 28, 17),
    emblem: [
      { d: "M62 30 A23 23 0 1 0 72 47", kind: "line" },
      { d: "M65 33 A20 20 0 0 1 70 41", kind: "thin" },
      { d: "M58 58 h10 v10 h-10 Z", kind: "accent" },
    ],
  },
};

// Shared look per part kind, locked vs unlocked.
function partStyle(kind: Part["kind"], on: boolean, c: string) {
  const stroke = on ? `color-mix(in srgb, ${c} 82%, var(--ink))` : "var(--line)";
  switch (kind) {
    case "line":
      return { fill: "none", stroke, strokeWidth: 4 };
    case "thin":
      return { fill: "none", stroke, strokeWidth: 2.2 };
    case "fill":
      return { fill: on ? c : "var(--line)", stroke, strokeWidth: 2 };
    case "soft":
      return { fill: on ? `color-mix(in srgb, ${c} 35%, var(--surface))` : "var(--surface-2)", stroke, strokeWidth: 2.6 };
    case "dot":
      return { fill: stroke, stroke: "none" };
    case "accent":
      return { fill: on ? "var(--vermilion)" : "var(--line)", stroke: "none" };
  }
}

export default function BadgeArt({
  chapter,
  tag,
  on,
  className = "",
}: {
  chapter: ChapterId;
  /** two-character tag on the ribbon */
  tag: string;
  on: boolean;
  className?: string;
}) {
  const d = BADGE_DESIGNS[chapter];
  const c = d.colour;
  const inner = `translate(${CX} ${CY}) scale(.82) translate(${-CX} ${-CY})`;
  return (
    <svg viewBox="0 0 100 112" aria-hidden="true" className={`overflow-visible ${className}`}>
      <path
        d={d.shape}
        strokeLinejoin="round"
        style={{
          fill: on ? c : "var(--surface-2)",
          stroke: on ? `color-mix(in srgb, ${c} 70%, var(--ink))` : "var(--line)",
          strokeWidth: 2.5,
        }}
      />
      <path
        d={d.shape}
        transform={inner}
        strokeLinejoin="round"
        style={{
          fill: on ? `color-mix(in srgb, ${c} 14%, var(--surface))` : "var(--surface)",
          stroke: on ? `color-mix(in srgb, ${c} 55%, var(--surface))` : "var(--line)",
          strokeWidth: 1.5,
          strokeDasharray: on ? undefined : "3 3",
        }}
      />
      <g strokeLinecap="round" strokeLinejoin="round">
        {d.emblem.map((p, i) => (
          <path key={i} d={p.d} style={partStyle(p.kind, on, c)} />
        ))}
      </g>
      <path
        d="M20 90 H80 L74 99.5 L80 109 H20 L26 99.5 Z"
        style={{
          fill: on ? `color-mix(in srgb, ${c} 80%, var(--ink))` : "var(--surface-2)",
          stroke: on ? "none" : "var(--line)",
          strokeWidth: 1.5,
        }}
      />
      <text
        x="50"
        y="103.5"
        textAnchor="middle"
        style={{ fill: on ? "var(--surface)" : "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}
      >
        {tag}
      </text>
      {!on && (
        <g transform="translate(80 78)">
          <circle r="10" style={{ fill: "var(--surface)", stroke: "var(--line)", strokeWidth: 1.5 }} />
          <path d="M-3.5 -1 V-4 a3.5 3.5 0 0 1 7 0 V-1" style={{ fill: "none", stroke: "var(--muted)", strokeWidth: 1.6 }} />
          <rect x="-5.5" y="-1" width="11" height="8" rx="1.5" style={{ fill: "var(--muted)" }} />
        </g>
      )}
    </svg>
  );
}
