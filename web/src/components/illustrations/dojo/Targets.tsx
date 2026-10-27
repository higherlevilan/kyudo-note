// 的：近的・遠的的設置側面圖；霞的、星的、遠的得点的的靶面在 ./TargetFaces.tsx（client component）。
// 數字依《弓道競技規則》：第 23・24・26 條（近的）、第 31・32・36・37 條（遠的）。
// 線條用網站的色彩變數。

import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import { r1, rad } from "@/components/illustrations/gear/geom";
import { ANKF } from "@/content/common-sources";

// 靶面（可切換、可點選）在 ./TargetFaces.tsx。
export { TargetFaces } from "./TargetFaces";

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
