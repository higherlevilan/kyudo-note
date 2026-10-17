// 近的射場的俯視圖（5 人立）。射場部分依《弓道競技規則》的標準尺寸按比例（1 m = 22.2 單位）；
// 28 m 的矢道用斷線省略，不按比例。上座、看的所的位置依道場不同，只是一例。

import { ANKF } from "@/content/common-sources";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";

const M = 22.2; // units per metre
const XS = [96, 96 + 1.8 * M, 96 + 3.6 * M, 96 + 5.4 * M, 96 + 7.2 * M].map((v) => Math.round(v * 10) / 10);
const Y_SHAI = 300;
const Y_HONZA = Math.round((Y_SHAI + 2.0 * M) * 10) / 10;
const Y_TARGET = 66;
const FLOOR = { x1: 58, x2: 276, y1: 256, y2: 384 };
const BREAK_Y = 150;

function zigPts(y: number): string[] {
  const pts: string[] = [];
  for (let x = FLOOR.x1, i = 0; x <= FLOOR.x2; x += 8, i++) pts.push(`${x},${y + (i % 2 ? -4 : 4)}`);
  return pts;
}
const zigzag = (y: number) => `M${zigPts(y).join("L")}`;
const BREAK_FILL = `M${zigPts(BREAK_Y).join("L")}L${zigPts(BREAK_Y + 10).reverse().join("L")}Z`;

function Archer({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} className="fill-surface stroke-ink" strokeWidth={2.2} />
      <path d={`M${x + 9} ${y - 4.5} L${x + 16} ${y} L${x + 9} ${y + 4.5} Z`} className="fill-ink" />
    </g>
  );
}

export default function ShajoLayout() {
  return (
    <FigureFrame
      id="shajo-layout"
      title="近的射場的俯視圖（5 人立）"
      caption={
        <>
          藍色數字出自《弓道競技規則》近的的標準：射距離 28 m（第 22 條）、射位間隔 1.8 m、本座到射位 2.0 m。步數出自全弓連用語辭典：本座在射位後方，坐射 3 步、立射 2 步。
          射場部分按比例，矢道不按比例。射手在射位面向脇正面（審判席方向），靶在左手邊。上座的位置依道場而不同，圖以「上座在脇正面這一側」為例；看的所的位置也依道場。
        </>
      }
      sources={[ANKF.playRules, ANKF.terminology]}
    >
      <svg viewBox="0 0 320 396" role="img" aria-label="近的射場俯視示意圖：射場、本座、射位、矢道 28 公尺、安土與的、看的所" className="mx-auto block h-auto w-full max-w-md">
        <title>近的射場俯視示意圖</title>
        <desc>
          由下往上：射場地板上有本座線與射位線，相距 2.0 公尺；五個射位間隔 1.8 公尺，射手面向右方的脇正面。前方是 28 公尺的矢道（圖中斷開表示不按比例），盡頭是安土，五個的分別對著五個射位；看的所在安土左前方。上座在右側、下座在左側只是一例。
        </desc>

        {/* 安土 */}
        <path d={`M${FLOOR.x1 - 4} 22 H${FLOOR.x2 + 4} V58 H${FLOOR.x1 - 4} Z`} className="fill-wood-soft stroke-wood" strokeWidth={1} />
        <g className="stroke-wood/50" strokeWidth={0.8}>
          {Array.from({ length: 27 }, (_, i) => FLOOR.x1 + i * 8).map((x) => (
            <line key={x} x1={x} y1={26} x2={x + 6} y2={54} />
          ))}
        </g>
        {/* 矢道 */}
        <rect x={FLOOR.x1} y={58} width={FLOOR.x2 - FLOOR.x1} height={FLOOR.y1 - 58} className="fill-surface-2" />
        {/* shooting lines */}
        <g className="stroke-muted/70" strokeWidth={0.9} strokeDasharray="2 4">
          {XS.map((x) => (
            <line key={x} x1={x} y1={Y_SHAI - 12} x2={x} y2={Y_TARGET + 8} />
          ))}
        </g>
        {/* targets */}
        {XS.map((x) => (
          <g key={x}>
            <circle cx={x} cy={Y_TARGET} r={7} className="fill-surface stroke-ink" strokeWidth={1.6} />
            <circle cx={x} cy={Y_TARGET} r={2.6} className="fill-ink" />
          </g>
        ))}
        {/* 看的所 */}
        <rect x={4} y={72} width={50} height={32} rx={3} className="fill-surface stroke-ink" strokeWidth={1.2} />

        {/* break */}
        <path d={BREAK_FILL} className="fill-surface" />
        <path d={zigzag(BREAK_Y)} className="stroke-ink" strokeWidth={1} fill="none" />
        <path d={zigzag(BREAK_Y + 10)} className="stroke-ink" strokeWidth={1} fill="none" />

        {/* floor */}
        <rect x={FLOOR.x1} y={FLOOR.y1} width={FLOOR.x2 - FLOOR.x1} height={FLOOR.y2 - FLOOR.y1} className="fill-surface stroke-ink/60" strokeWidth={1.2} />
        <line x1={FLOOR.x1} y1={Y_SHAI} x2={FLOOR.x2} y2={Y_SHAI} className="stroke-indigo" strokeWidth={2} />
        <line x1={FLOOR.x1} y1={Y_HONZA} x2={FLOOR.x2} y2={Y_HONZA} className="stroke-wood" strokeWidth={2} />
        {XS.map((x) => (
          <Archer key={x} x={x} y={Y_SHAI} />
        ))}

        <g fontSize={13}>
          {/* top labels */}
          <text lang="ja" x={FLOOR.x1 + 2} y={45} className="fill-ink" fontWeight={700}>
            安土（垜）
          </text>
          <text lang="ja" x={XS[4] + 12} y={Y_TARGET + 5} className="fill-ink">
            的
          </text>
          <text lang="ja" x={29} y={93} textAnchor="middle" className="fill-ink">
            看的所
          </text>
          <text lang="ja" x={FLOOR.x1 + 6} y={FLOOR.y1 - 10} className="fill-ink" fontWeight={700}>
            矢道
          </text>

          {/* 28 m */}
          <g className="stroke-indigo" strokeWidth={1.1}>
            <line x1={116} y1={Y_TARGET} x2={116} y2={BREAK_Y - 5} />
            <line x1={116} y1={BREAK_Y + 15} x2={116} y2={Y_SHAI} />
            <line x1={110} y1={Y_TARGET} x2={122} y2={Y_TARGET} />
          </g>
          <text x={122} y={128} className="fill-indigo stroke-surface-2" strokeWidth={4} paintOrder="stroke" fontSize={15} fontWeight={700}>
            28 m
          </text>
          <text x={122} y={190} className="fill-muted stroke-surface-2" strokeWidth={4} paintOrder="stroke">
            矢道不按比例
          </text>

          {/* left column */}
          <text lang="ja" x={6} y={Y_SHAI + 5} className="fill-indigo" fontWeight={700}>
            射位
          </text>
          <text lang="ja" x={6} y={Y_HONZA + 5} className="fill-wood" fontWeight={700}>
            本座
          </text>
          <g className="stroke-indigo" strokeWidth={1.1}>
            <line x1={50} y1={Y_SHAI} x2={50} y2={Y_HONZA} />
            <line x1={45} y1={Y_SHAI} x2={55} y2={Y_SHAI} />
            <line x1={45} y1={Y_HONZA} x2={55} y2={Y_HONZA} />
          </g>
          <text x={46} y={Y_SHAI + 27} textAnchor="end" className="fill-indigo" fontWeight={700}>
            2.0 m
          </text>
          <text x={FLOOR.x1 + 6} y={Y_SHAI + 27} className="fill-muted">
            坐射 3 步・立射 2 步
          </text>

          {/* 1.8 m */}
          <g className="stroke-indigo" strokeWidth={1.1}>
            <line x1={XS[3]} y1={Y_SHAI + 14} x2={XS[4]} y2={Y_SHAI + 14} />
            <line x1={XS[3]} y1={Y_SHAI + 10} x2={XS[3]} y2={Y_SHAI + 18} />
            <line x1={XS[4]} y1={Y_SHAI + 10} x2={XS[4]} y2={Y_SHAI + 18} />
          </g>
          <text x={(XS[3] + XS[4]) / 2} y={Y_SHAI + 31} textAnchor="middle" className="fill-indigo" fontWeight={700}>
            1.8 m
          </text>

          {/* directions */}
          <g className="stroke-ink" strokeWidth={1.6}>
            <line x1={268} y1={Y_SHAI} x2={310} y2={Y_SHAI} />
            <line x1={296} y1={250} x2={296} y2={206} />
          </g>
          <path d={`M316 ${Y_SHAI} l-9 -5 v10 z`} className="fill-ink" />
          <path d={`M296 200 l-5 9 h10 z`} className="fill-ink" />
          <text lang="ja" x={296} y={Y_SHAI - 10} textAnchor="middle" className="fill-ink" fontWeight={700}>
            脇正面
          </text>
          <text lang="ja" x={296} y={194} textAnchor="middle" className="fill-ink" fontWeight={700}>
            的正面
          </text>

          {/* 上座・下座, floor */}
          <text lang="ja" x={298} y={Y_HONZA + 24} textAnchor="middle" className="fill-ink">
            上座
          </text>
          <text x={298} y={Y_HONZA + 40} textAnchor="middle" className="fill-muted">
            （例）
          </text>
          <text lang="ja" x={29} y={Y_HONZA + 24} textAnchor="middle" className="fill-ink">
            下座
          </text>
          <text x={29} y={Y_HONZA + 40} textAnchor="middle" className="fill-muted">
            （例）
          </text>
          <text lang="ja" x={FLOOR.x2 - 6} y={FLOOR.y2 - 10} textAnchor="end" className="fill-muted" fontWeight={700}>
            射場
          </text>
        </g>
      </svg>
    </FigureFrame>
  );
}
