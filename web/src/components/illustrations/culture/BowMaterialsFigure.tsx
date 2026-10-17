// 弓的材料演進：五種構造的簡化橫切面（木・竹・ひご）。
// Facts: docs/research/01 §1.1「弓的材料演進」。伏竹弓、三枚打弓的年代出自全弓連〈弓道の歴史〉；
// 四方竹弓、弓胎弓的年代在研究筆記中標 ⚠️，這裡同樣標「說法不一」。

import type { ReactNode } from "react";
import { TagBadge } from "@/components/content/Blocks";
import { ANKF, RESEARCH } from "@/content/common-sources";
import { FigureFrame } from "./FigureFrame";

// Section box (viewBox 0 0 100 72): wider than thick, like a limb cut across.
const X0 = 14;
const X1 = 86;
const Y0 = 14;
const Y1 = 58;
const W = X1 - X0;
const B = 9; // bamboo layer thickness

function Wood({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const lines = [];
  for (let gy = y + 6; gy < y + h - 2; gy += 7) {
    lines.push(<path key={gy} d={`M${x} ${gy}q${w / 4} -2.5 ${w / 2} 0t${w / 2} 0`} className="fill-none stroke-wood" strokeWidth={0.7} opacity={0.45} />);
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="fill-wood-soft" />
      {lines}
    </g>
  );
}

/** Bamboo strip; `skin` is the side carrying the hard outer skin (drawn as a darker edge). */
function Bamboo({ x, y, w, h, skin }: { x: number; y: number; w: number; h: number; skin: "top" | "bottom" | "left" | "right" }) {
  const edge = {
    top: `M${x} ${y + 1}h${w}`,
    bottom: `M${x} ${y + h - 1}h${w}`,
    left: `M${x + 1} ${y}v${h}`,
    right: `M${x + w - 1} ${y}v${h}`,
  }[skin];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="fill-wood" opacity={0.55} />
      <path d={edge} className="stroke-wood" strokeWidth={2.5} />
    </g>
  );
}

function Higo({ x, y, w, h, n }: { x: number; y: number; w: number; h: number; n: number }) {
  const sw = w / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x + i * sw} y={y} width={sw} height={h} className="fill-ink stroke-surface" strokeWidth={0.8} opacity={i % 2 ? 0.5 : 0.65} />
      ))}
    </g>
  );
}

type Item = { key: string; ja: string; kana: string; zh: string; extra?: string; when: string; disputed?: boolean; draw: ReactNode };

const ITEMS: Item[] = [
  {
    key: "maruki",
    ja: "丸木弓",
    kana: "まるきゆみ",
    zh: "單一木材",
    when: "繩文～古代",
    draw: (
      <g>
        <ellipse cx={50} cy={36} rx={25} ry={22} className="fill-wood-soft stroke-wood" strokeWidth={1.2} />
        {[16, 10, 4.5].map((r) => (
          <ellipse key={r} cx={50} cy={37} rx={r * 1.1} ry={r} className="fill-none stroke-wood" strokeWidth={0.7} opacity={0.5} />
        ))}
      </g>
    ),
  },
  {
    key: "fusedake",
    ja: "伏竹弓",
    kana: "ふせだけゆみ",
    zh: "木材外側貼竹片",
    when: "10 世紀中葉",
    draw: (
      <>
        <Wood x={X0} y={Y0 + B} w={W} h={Y1 - Y0 - B} />
        <Bamboo x={X0} y={Y0} w={W} h={B} skin="top" />
      </>
    ),
  },
  {
    key: "sanmai",
    ja: "三枚打弓",
    kana: "さんまいうちゆみ",
    zh: "木芯前後貼竹",
    when: "12 世紀後半",
    draw: (
      <>
        <Wood x={X0} y={Y0 + B} w={W} h={Y1 - Y0 - 2 * B} />
        <Bamboo x={X0} y={Y0} w={W} h={B} skin="top" />
        <Bamboo x={X0} y={Y1 - B} w={W} h={B} skin="bottom" />
      </>
    ),
  },
  {
    key: "shiho",
    ja: "四方竹弓",
    kana: "しほうちくゆみ",
    zh: "木芯四面包竹",
    when: "年代未查到可靠資料",
    disputed: true,
    draw: (
      <>
        <Wood x={X0 + B} y={Y0 + B} w={W - 2 * B} h={Y1 - Y0 - 2 * B} />
        <Bamboo x={X0} y={Y0 + B} w={B} h={Y1 - Y0 - 2 * B} skin="left" />
        <Bamboo x={X1 - B} y={Y0 + B} w={B} h={Y1 - Y0 - 2 * B} skin="right" />
        <Bamboo x={X0} y={Y0} w={W} h={B} skin="top" />
        <Bamboo x={X0} y={Y1 - B} w={W} h={B} skin="bottom" />
      </>
    ),
  },
  {
    key: "higo",
    ja: "弓胎弓",
    kana: "ひごゆみ",
    zh: "竹籤為芯、外貼竹片",
    extra: "現代竹弓的基本構造",
    when: "一般說戰國末～江戶初期，待查證",
    disputed: true,
    draw: (
      <>
        <Higo x={X0} y={Y0 + B} w={W} h={Y1 - Y0 - 2 * B} n={6} />
        <Bamboo x={X0} y={Y0} w={W} h={B} skin="top" />
        <Bamboo x={X0} y={Y1 - B} w={W} h={B} skin="bottom" />
      </>
    ),
  },
];

function Swatch({ children, label }: { children: ReactNode; label: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg aria-hidden="true" viewBox="0 0 20 14" className="h-3.5 w-5">
        {children}
      </svg>
      <span>{label}</span>
    </span>
  );
}

export default function BowMaterialsFigure() {
  return (
    <FigureFrame
      id="fig-bow-materials"
      title="弓的材料演進（橫切面）"
      caption={
        <>
          簡化的橫切面示意，不依比例，只表示木、竹、ひご（竹籤）的相對位置：上方是弓的外側（朝靶的一面），下方是內側（弦側）。伏竹弓與三枚打弓的年代依全弓連〈弓道の歴史〉，該文也說明這些技術受到中國製弓技術的影響；標「說法不一」的兩項，年代本站尚未查到可靠資料。實際弓的細部構造各家不同，這裡省略。
        </>
      }
      sources={[ANKF.history, RESEARCH.history]}
    >
      <ol className="grid grid-cols-2 gap-x-3 gap-y-4 min-[400px]:grid-cols-3 md:grid-cols-5">
        {ITEMS.map((it, i) => (
          <li key={it.key} className="text-center">
            <svg viewBox="0 0 100 72" role="img" aria-label={`${it.ja}的橫切面：${it.zh}`} className="mx-auto block h-auto w-full max-w-[8.5rem]">
              <title>{`${it.ja}的橫切面：${it.zh}`}</title>
              <defs>
                <clipPath id={`mat-${it.key}`}>
                  <rect x={X0} y={Y0} width={W} height={Y1 - Y0} rx={6} />
                </clipPath>
              </defs>
              {it.key === "maruki" ? (
                it.draw
              ) : (
                <>
                  <g clipPath={`url(#mat-${it.key})`}>{it.draw}</g>
                  <rect x={X0} y={Y0} width={W} height={Y1 - Y0} rx={6} className="fill-none stroke-ink" strokeWidth={1} opacity={0.6} />
                </>
              )}
            </svg>
            <p className="mt-1 text-sm font-semibold">
              <span className="mr-1 text-xs font-normal text-muted">{i + 1}</span>
              <span lang="ja">{it.ja}</span>
            </p>
            <p lang="ja" className="text-[11px] text-muted">
              {it.kana}
            </p>
            <p className="mt-1 text-xs leading-snug">{it.zh}</p>
            {it.extra && <p className="text-xs leading-snug">{it.extra}</p>}
            <p className="mt-1 text-xs leading-snug text-muted">
              {it.disputed && <TagBadge tag="disputed" />}
              {it.when}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted">
        <Swatch label="木">
          <rect x={1} y={1} width={18} height={12} className="fill-wood-soft stroke-wood" strokeWidth={0.6} />
        </Swatch>
        <Swatch label="竹（粗線為竹皮側）">
          <rect x={1} y={1} width={18} height={12} className="fill-wood" opacity={0.55} />
          <path d="M1 2h18" className="stroke-wood" strokeWidth={2.5} />
        </Swatch>
        <Swatch
          label={
            <>
              <span lang="ja">ひご</span>（竹籤）
            </>
          }
        >
          <rect x={1} y={1} width={6} height={12} className="fill-ink" opacity={0.65} />
          <rect x={7} y={1} width={6} height={12} className="fill-ink" opacity={0.5} />
          <rect x={13} y={1} width={6} height={12} className="fill-ink" opacity={0.65} />
        </Swatch>
        <span>上＝外側（朝靶）・下＝內側（弦側）</span>
      </p>
    </FigureFrame>
  );
}
