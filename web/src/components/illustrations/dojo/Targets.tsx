// 的：霞的（重用 home/Kasumi.tsx）、星的、遠的得点的，以及近的・遠的的設置側面圖。
// 數字依《弓道競技規則》：第 23・24・26 條（近的）、第 31・32・36・37 條（遠的）。
// 靶面的黑、白、黃、赤、青是實物的顏色，所以直接寫色碼（和 Kasumi.tsx 一樣），深色模式下也不反轉；其餘線條用網站的色彩變數。

import Kasumi from "@/components/home/Kasumi";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import { r1, rad } from "@/components/illustrations/gear/geom";
import { ANKF } from "@/content/common-sources";

const C = { black: "#1f1b17", white: "#fbf8f2", gold: "#e2b33c", red: "#c23b2a", blue: "#2e5e9e" } as const;

/* ── 霞的 radius ruler ── */
const KASUMI: { r: number; name: string; c: "black" | "white" }[] = [
  { r: 3.6, name: "中白", c: "white" },
  { r: 7.2, name: "一の黒", c: "black" },
  { r: 10.2, name: "二の白", c: "white" },
  { r: 11.7, name: "二の黒", c: "black" },
  { r: 14.7, name: "三の白", c: "white" },
  { r: 18, name: "三の黒", c: "black" },
];
const RX0 = 18;
const RS = 15.6;
const rx = (r: number) => r1(RX0 + r * RS);

function KasumiRuler() {
  return (
    <svg viewBox="0 0 320 98" role="img" aria-label="霞的各圈的半徑：中白 3.6、一の黒到 7.2、二の白到 10.2、二の黒到 11.7、三の白到 14.7、三の黒到 18 公分" className="block h-auto w-full">
      <title>霞的各圈的半徑（公分）</title>
      {KASUMI.map((k, i) => {
        const r0 = i === 0 ? 0 : KASUMI[i - 1].r;
        return <rect key={k.r} x={rx(r0)} y={34} width={r1((k.r - r0) * RS)} height={18} fill={C[k.c]} className="stroke-ink" strokeWidth={0.8} />;
      })}
      <g fontSize={13} textAnchor="middle" className="fill-ink">
        {[0, ...KASUMI.map((k) => k.r)].map((r) => (
          <g key={r}>
            <line x1={rx(r)} y1={29} x2={rx(r)} y2={34} className="stroke-ink" strokeWidth={0.8} />
            <text x={rx(r) + (r === 10.2 ? -3 : r === 11.7 ? 3 : 0)} y={25} textAnchor={r === 10.2 ? "end" : r === 11.7 ? "start" : "middle"}>
              {r}
            </text>
          </g>
        ))}
        {KASUMI.map((k, i) => {
          const r0 = i === 0 ? 0 : KASUMI[i - 1].r;
          const mid = rx((r0 + k.r) / 2);
          const low = k.name === "二の黒";
          return (
            <g key={k.name}>
              {low && <line x1={mid} y1={55} x2={mid} y2={78} className="stroke-muted" strokeWidth={0.9} />}
              <text lang="ja" x={mid} y={low ? 92 : 70}>
                {k.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function Hoshi() {
  return (
    <svg viewBox="0 0 320 214" role="img" aria-label="星的：白底，中心的黑圓直徑是靶徑的三分之一（36 公分靶為 12 公分）" className="block h-auto w-full">
      <title>星的</title>
      <circle cx={112} cy={107} r={99} className="fill-wood/70" />
      <circle cx={112} cy={107} r={96} fill={C.white} />
      <circle cx={112} cy={107} r={32} fill={C.black} />
      <g className="stroke-muted" strokeWidth={0.9}>
        <line x1={226} y1={86} x2={140} y2={96} />
        <circle cx={140} cy={96} r={2} className="fill-muted" stroke="none" />
      </g>
      <g fontSize={13} className="fill-ink">
        <text x={228} y={66}>黑圓直徑</text>
        <text x={228} y={84}>＝靶徑的 1/3</text>
        <text x={228} y={122} className="fill-muted">
          36 cm 靶
        </text>
        <text x={228} y={140} className="fill-muted">
          → 黑圓 12 cm
        </text>
      </g>
    </svg>
  );
}

const TOKUTEN = [
  { r: 10, pts: 10, name: "黃", fill: C.gold, ink: C.black },
  { r: 20, pts: 9, name: "赤", fill: C.red, ink: C.white },
  { r: 30, pts: 7, name: "青", fill: C.blue, ink: C.white },
  { r: 40, pts: 5, name: "黑", fill: C.black, ink: C.white },
  { r: 50, pts: 3, name: "白", fill: C.white, ink: C.black },
];

function Tokuten() {
  const s = 1.95; // units per cm
  return (
    <svg viewBox="0 0 320 214" role="img" aria-label="遠的得点的：直徑 100 公分，由中心起黃 10 分、赤 9 分、青 7 分、黑 5 分、白 3 分，每區寬 10 公分" className="block h-auto w-full">
      <title>遠的得点的（100 cm）</title>
      <circle cx={108} cy={107} r={50 * s + 3} className="fill-wood/70" />
      {[...TOKUTEN].reverse().map((t) => (
        <circle key={t.r} cx={108} cy={107} r={t.r * s} fill={t.fill} className="stroke-ink/40" strokeWidth={0.6} />
      ))}
      <g fontSize={13} fontWeight={700} textAnchor="middle">
        {TOKUTEN.map((t) => (
          <text key={t.r} x={108 + (t.r === 10 ? 0 : (t.r - 5) * s)} y={112} fill={t.ink}>
            {t.pts}
          </text>
        ))}
      </g>
      <g fontSize={13} className="fill-ink">
        {TOKUTEN.map((t, i) => (
          <g key={t.r}>
            <rect x={230} y={40 + i * 20} width={12} height={12} rx={2} fill={t.fill} className="stroke-ink" strokeWidth={0.6} />
            <text x={248} y={51 + i * 20}>
              {t.name} {t.pts} 分
            </text>
          </g>
        ))}
        <text x={230} y={160} className="fill-muted">
          每區寬 10 cm
        </text>
        <text x={230} y={178} className="fill-muted">
          直徑 100 cm
        </text>
      </g>
    </svg>
  );
}

export function TargetFaces() {
  return (
    <FigureFrame
      id="targets"
      title="的（靶）的種類"
      caption={
        <>
          三個靶面不按彼此的大小比例畫。近的用直徑 36 cm 的霞的或星的（星的也可用 24 cm，比例相同）；審查用 36 cm 霞的。遠的另有 100／79／50 cm 的霞的，圈的比例和近的不同；得点的只用在遠的的得点制，壓線取高分。
        </>
      }
      sources={[ANKF.playRules, ANKF.probationRules]}
    >
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <p className="mb-2 text-sm font-semibold">
            <span lang="ja">霞的</span>（かすみまと）36 cm
          </p>
          <Kasumi className="mx-auto block h-auto w-full max-w-[13rem]" />
          <p className="mt-2 text-xs text-muted">由中心往外的半徑（cm），第 26 條：</p>
          <KasumiRuler />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">
            <span lang="ja">星的</span>（ほしまと）36 cm
          </p>
          <Hoshi />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">
            遠的<span lang="ja">得点的</span>（とくてんまと）100 cm
          </p>
          <Tokuten />
        </div>
      </div>
    </FigureFrame>
  );
}

/* ── side view of the set-up ── */

function mount(cx: number, cy: number, half: number, tiltDeg: number, depth: number) {
  const t = rad(tiltDeg);
  const top: [number, number] = [r1(cx + half * Math.sin(t)), r1(cy - half * Math.cos(t))];
  const bot: [number, number] = [r1(cx - half * Math.sin(t)), r1(cy + half * Math.cos(t))];
  const back: [number, number] = [r1(depth * Math.cos(t)), r1(depth * Math.sin(t))];
  return { top, bot, back };
}

export function TargetMount() {
  // 近的: 1 cm = 2.6 units; 遠的: 1 cm = 1.15 units
  const G = 210;
  const kS = 2.6;
  const k = mount(72, G - 27 * kS, 18 * kS, 5, 10.5 * kS);
  const eS = 1.15;
  const e = mount(252, G - 97 * eS, 50 * eS, 15, 3);
  const arc = (x: number, y: number, r: number, deg: number) => `M${x},${r1(y - r)} A${r} ${r} 0 0 1 ${r1(x + r * Math.sin(rad(deg)))},${r1(y - r * Math.cos(rad(deg)))}`;

  return (
    <FigureFrame
      id="target-mount"
      title="的的設置（側面）"
      caption={
        <>
          近的：靶心距垜敷（あづちしき，安土前的地面）27 cm，靶面向後傾 5 度，用侯串（ごぐし）固定（第 24 條）。遠的：靶心距射場地板的高度 97 cm，向後傾 15 度，以三腳或四腳架支撐（第 32 條）。
          左右兩圖比例不同；遠的的高度是從射場床面量起，圖中把靶下的地面畫成同高只是簡化。
        </>
      }
      sources={[ANKF.playRules]}
    >
      <svg viewBox="0 0 320 236" role="img" aria-label="近的與遠的靶的設置側面圖：近的靶心距垜敷 27 公分、後傾 5 度；遠的靶心距射場床面 97 公分、後傾 15 度" className="mx-auto block h-auto w-full max-w-xl">
        <title>近的與遠的靶的設置側面圖</title>
        <line x1={160} y1={30} x2={160} y2={230} className="stroke-line" strokeWidth={1} />
        <g fontSize={13} fontWeight={700} className="fill-ink">
          <text x={6} y={18}>
            近的（36 cm）
          </text>
          <text x={166} y={18}>
            遠的（100 cm）
          </text>
        </g>

        {/* 近的 */}
        <path d={`M104 ${G} L156 ${G} L156 50 L146 50 Z`} className="fill-wood-soft stroke-wood" strokeWidth={1} />
        <text lang="ja" x={150} y={44} textAnchor="end" fontSize={13} className="fill-wood">
          安土
        </text>
        <line x1={4} y1={G} x2={104} y2={G} className="stroke-ink" strokeWidth={1.6} />
        {/* 侯串 */}
        <line x1={k.bot[0] + k.back[0] - 6} y1={k.bot[1] - 30} x2={k.bot[0] + k.back[0] + 2} y2={G + 6} className="stroke-ink/70" strokeWidth={2} />
        <path
          d={`M${k.top[0]},${k.top[1]} L${k.top[0] + k.back[0]},${k.top[1] + k.back[1]} L${k.bot[0] + k.back[0]},${k.bot[1] + k.back[1]} L${k.bot[0]},${k.bot[1]} Z`}
          className="fill-wood-soft stroke-ink"
          strokeWidth={1}
        />
        <line x1={k.top[0]} y1={k.top[1]} x2={k.bot[0]} y2={k.bot[1]} className="stroke-ink" strokeWidth={3.5} />
        {/* reference + angle */}
        <line x1={k.bot[0]} y1={k.bot[1]} x2={k.bot[0]} y2={k.top[1] - 10} className="stroke-muted" strokeWidth={0.9} strokeDasharray="3 3" />
        <path d={arc(k.bot[0], k.bot[1], 82, 5)} className="stroke-vermilion" strokeWidth={1.4} fill="none" />
        <text x={k.bot[0] - 4} y={k.top[1] - 2} textAnchor="end" fontSize={13} fontWeight={700} className="fill-vermilion">
          後傾 5°
        </text>
        {/* 27 cm */}
        <line x1={34} y1={G - 27 * kS} x2={72} y2={G - 27 * kS} className="stroke-muted" strokeWidth={0.9} strokeDasharray="3 3" />
        <g className="stroke-indigo" strokeWidth={1.1}>
          <line x1={40} y1={G} x2={40} y2={G - 27 * kS} />
          <line x1={35} y1={G - 27 * kS} x2={45} y2={G - 27 * kS} />
        </g>
        <text x={36} y={G - 13.5 * kS + 5} textAnchor="end" fontSize={13} fontWeight={700} className="fill-indigo">
          27
        </text>
        <text x={36} y={G - 13.5 * kS + 20} textAnchor="end" fontSize={13} className="fill-indigo">
          cm
        </text>
        <text lang="ja" x={54} y={G + 18} textAnchor="middle" fontSize={13} className="fill-ink">
          垜敷
        </text>
        <text x={6} y={44} fontSize={13} className="fill-muted">
          ← 射場
        </text>

        {/* 遠的 */}
        <line x1={166} y1={G} x2={316} y2={G} className="stroke-ink" strokeWidth={1.2} strokeDasharray="5 3" />
        <g className="stroke-ink/70" strokeWidth={2} strokeLinecap="round">
          <line x1={e.top[0] - 6} y1={(e.top[1] + e.bot[1]) / 2 + 6} x2={e.bot[0] - 14} y2={G} />
          <line x1={e.top[0] - 4} y1={(e.top[1] + e.bot[1]) / 2 + 6} x2={e.top[0] + 34} y2={G} />
        </g>
        <line x1={e.top[0]} y1={e.top[1]} x2={e.bot[0]} y2={e.bot[1]} className="stroke-ink" strokeWidth={4} />
        <line x1={e.bot[0]} y1={e.bot[1]} x2={e.bot[0]} y2={e.top[1] - 6} className="stroke-muted" strokeWidth={0.9} strokeDasharray="3 3" />
        <path d={arc(e.bot[0], e.bot[1], 70, 15)} className="stroke-vermilion" strokeWidth={1.4} fill="none" />
        <text x={316} y={e.top[1] + 28} textAnchor="end" fontSize={13} fontWeight={700} className="fill-vermilion">
          後傾 15°
        </text>
        <line x1={196} y1={G - 97 * eS} x2={252} y2={G - 97 * eS} className="stroke-muted" strokeWidth={0.9} strokeDasharray="3 3" />
        <g className="stroke-indigo" strokeWidth={1.1}>
          <line x1={202} y1={G} x2={202} y2={G - 97 * eS} />
          <line x1={197} y1={G - 97 * eS} x2={207} y2={G - 97 * eS} />
        </g>
        <text x={198} y={G - 48.5 * eS + 5} textAnchor="end" fontSize={13} fontWeight={700} className="fill-indigo">
          97
        </text>
        <text x={198} y={G - 48.5 * eS + 20} textAnchor="end" fontSize={13} className="fill-indigo">
          cm
        </text>
        <text x={241} y={G + 18} textAnchor="middle" fontSize={13} className="fill-ink">
          射場床面的高度
        </text>
      </svg>
    </FigureFrame>
  );
}
