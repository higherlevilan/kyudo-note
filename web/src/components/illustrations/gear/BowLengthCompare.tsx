// 弓長比較：三寸詰〜四寸伸五種長度按比例並排，旁邊一個人形（預設身高 170 cm，可傳入）。
// 1 cm = 1 單位。可傳入 highlight 標出計算器結果。沒有 hooks，可在 server 或 client component 裡用。

import type { ReactNode } from "react";
import { ANKF, SHOP } from "@/content/equipment/sources";
import FigureFrame from "./FigureFrame";

export const BOW_LENGTHS = [
  { id: "tsumari3", name: "三寸詰", cm: 212 },
  { id: "nami", name: "並寸", cm: 221 },
  { id: "nobi2", name: "二寸伸", cm: 227 },
  { id: "nobi3", name: "三寸伸", cm: 230 },
  { id: "nobi4", name: "四寸伸", cm: 233 },
] as const;

const BASE = 270; // floor y
const X0 = 104;
const PITCH = 46;
const HUMAN_X = 44;

function Human({ h }: { h: number }) {
  const top = BASE - h;
  const head = h * 0.066;
  const neck = top + head * 2 + h * 0.012;
  const shoulder = neck + h * 0.03;
  const hip = BASE - h * 0.48;
  const sw = h * 0.12; // half shoulder width
  const hw = h * 0.07;
  return (
    <g className="stroke-ink" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx={HUMAN_X} cy={top + head} r={head} />
      <line x1={HUMAN_X} y1={top + head * 2} x2={HUMAN_X} y2={shoulder} />
      <path d={`M${HUMAN_X - sw} ${shoulder} L${HUMAN_X + sw} ${shoulder} L${HUMAN_X + hw} ${hip} L${HUMAN_X - hw} ${hip} Z`} />
      <path d={`M${HUMAN_X - sw} ${shoulder} L${HUMAN_X - sw - 3} ${hip + h * 0.08}`} />
      <path d={`M${HUMAN_X + sw} ${shoulder} L${HUMAN_X + sw + 3} ${hip + h * 0.08}`} />
      <path d={`M${HUMAN_X - hw + 3} ${hip} L${HUMAN_X - hw + 1} ${BASE}`} />
      <path d={`M${HUMAN_X + hw - 3} ${hip} L${HUMAN_X + hw - 1} ${BASE}`} />
    </g>
  );
}

export default function BowLengthCompare({
  highlight,
  heightCm,
  id,
  title = "弓長比較（按比例）",
  caption,
}: {
  /** bow ids to emphasise (e.g. the calculator's matches) */
  highlight?: readonly string[];
  /** human outline height in cm (120–210); default 170 */
  heightCm?: number | null;
  id?: string;
  title?: string;
  caption?: ReactNode;
}) {
  const h = Math.min(210, Math.max(120, Math.round(heightCm ?? 170)));
  const hl = new Set(highlight ?? []);
  const any = hl.size > 0;
  const label = `弓長比較：${BOW_LENGTHS.map((b) => `${b.name} ${b.cm} 公分`).join("、")}，旁邊是身高 ${h} 公分的人形${
    any ? `；標出 ${BOW_LENGTHS.filter((b) => hl.has(b.id)).map((b) => b.name).join("、")}` : ""
  }。`;

  return (
    <FigureFrame
      id={id}
      title={title}
      caption={
        caption ?? (
          <>
            五種弓長與身高 {h} cm 的人形以同一比例畫。並寸 221 cm 是規則的標準；其他長度的 cm 數取自弓具店的標示。每支弓上的深色小方塊是握的位置（約從下端算起 1/3）。
            六寸伸（約 239 cm）沒有找到店家標示的 cm 值，沒有畫。
          </>
        )
      }
      sources={[ANKF.playRules, ANKF.tool, SHOP.suizanYumi, SHOP.ikeda]}
    >
      <svg viewBox="0 0 320 296" role="img" aria-label={label} className="mx-auto block h-auto w-full max-w-md">
        <title>{label}</title>
        {/* floor */}
        <line x1={6} y1={BASE} x2={314} y2={BASE} className="stroke-line" strokeWidth={2} />
        {/* human height guide */}
        <line x1={HUMAN_X + 18} y1={BASE - h} x2={314} y2={BASE - h} className="stroke-muted" strokeWidth={0.9} strokeDasharray="3 4" />
        <Human h={h} />
        <text x={HUMAN_X} y={BASE - h - 7} textAnchor="middle" fontSize={13} className="fill-muted">
          身高 {h}
        </text>
        {/* 221 guide */}
        <line x1={X0 - 16} y1={BASE - 221} x2={314} y2={BASE - 221} className="stroke-indigo/50" strokeWidth={0.9} strokeDasharray="1 3" />

        {BOW_LENGTHS.map((b, i) => {
          const x = X0 + i * PITCH;
          const on = hl.has(b.id);
          const fill = on ? "fill-vermilion" : any ? "fill-wood/45" : "fill-wood";
          return (
            <g key={b.id}>
              <rect x={x - 5} y={BASE - b.cm} width={10} height={b.cm} rx={5} className={fill} />
              <rect x={x - 6.5} y={BASE - b.cm / 3 - 7} width={13} height={14} rx={2} className="fill-ink/75" />
              <text x={x} y={BASE - b.cm - 7} textAnchor="middle" fontSize={13} fontWeight={on || b.id === "nami" ? 700 : 400} className={on ? "fill-vermilion" : "fill-ink"}>
                {b.cm}
              </text>
              <text lang="ja" x={x} y={BASE + 18} textAnchor="middle" fontSize={13} fontWeight={on ? 700 : 400} className={on ? "fill-vermilion" : "fill-ink"}>
                {b.name}
              </text>
            </g>
          );
        })}
        <text x={6} y={14} fontSize={13} className="fill-muted">
          單位 cm
        </text>
      </svg>
    </FigureFrame>
  );
}
