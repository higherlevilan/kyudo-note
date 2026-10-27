// Data for the 矢尺・弓長 calculator. Every number comes from a named source; nothing here is an "official" single value.

import type { Source, Tag } from "@/content/types";
import { ANKF, BUDOKAN, FOLK, SHOP } from "./sources";

/** 矢尺 = 矢束 + margin (cm). max undefined = open-ended (「以上」). */
export interface MarginRule {
  id: string;
  who: string;
  scope: string;
  min: number;
  max?: number;
  /** a single approximate value (「約 +10」) */
  approx?: boolean;
  tag: Tag;
  src: Source[];
  note?: string;
}

export const MARGIN_RULES: MarginRule[] = [
  {
    id: "ankf-floor",
    who: "ANKF 底線",
    scope: "所有人",
    min: 5,
    tag: "official",
    src: [ANKF.tool],
    note: "「矢束より5cm以上長い矢」，約 3 指寬以上。比矢束短或剛好等長的箭，的前禁止使用。",
  },
  {
    id: "ankf-beginner",
    who: "ANKF 初學者",
    scope: "射形還沒定下來的初學者",
    min: 10,
    max: 10,
    approx: true,
    tag: "official",
    src: [ANKF.tool],
    note: "「10cm位長い矢が適当」。",
  },
  {
    id: "kyohon",
    who: "《弓道教本》",
    scope: "一般（經指導書引用）",
    min: 5,
    max: 10,
    tag: "official",
    src: [BUDOKAN.ch3],
    note: "「安全のため5～10cmの長さを加える」。",
  },
  {
    id: "sambu",
    who: "山武弓具店",
    scope: "初學者",
    min: 10,
    max: 10,
    approx: true,
    tag: "shop",
    src: [SHOP.sambuQA, SHOP.sambuVocab],
  },
  {
    id: "suizan-beginner",
    who: "翠山弓具店",
    scope: "初學者、高中生",
    min: 12,
    max: 15,
    tag: "shop",
    src: [SHOP.suizanYa, SHOP.suizanBeginnerYa],
    note: "英文頁另寫初學者 +10～12（同頁又寫 10～15），同一家店寫法不一。",
  },
  {
    id: "heian-beginner",
    who: "平安弓具",
    scope: "初學者",
    min: 12,
    max: 15,
    tag: "shop",
    src: [SHOP.heian1913],
    note: "店家標的箭長不含箭頭；算進箭頭要再多約 1cm。",
  },
  {
    id: "shop-general",
    who: "翠山・平安",
    scope: "一般",
    min: 10,
    max: 15,
    tag: "shop",
    src: [SHOP.suizanBeginnerYa, SHOP.heian1913],
  },
  {
    id: "suizan-advanced",
    who: "翠山弓具店",
    scope: "高段者、射形穩定之後",
    min: 5,
    max: 6,
    tag: "shop",
    src: [SHOP.suizanYa],
    note: "熟練後才縮短；初學者不要直接套用。",
  },
  {
    id: "ikeda",
    who: "池田弓具",
    scope: "（矢束＝實際拉開的長度）",
    min: 3,
    max: 5,
    tag: "disputed",
    src: [SHOP.ikeda],
    note: "下限低於 ANKF 的「5cm 以上」；而且池田的「矢束」指實際拉距，基準和其他來源不同，不能直接拿來比。",
  },
];

export type BowId = "tsumari3" | "nami" | "nobi2" | "nobi3" | "nobi4" | "nobi6";

export interface BowType {
  id: BowId;
  name: string;
  kana: string;
  shaku: string;
  cm: string;
  /** 小山弓具標示弓力時的拉距 */
  ratedDraw?: number;
}

export const BOWS: BowType[] = [
  { id: "tsumari3", name: "三寸詰", kana: "さんずんづまり", shaku: "七尺", cm: "212", ratedDraw: 85 },
  { id: "nami", name: "並寸", kana: "なみすん", shaku: "七尺三寸", cm: "221", ratedDraw: 85 },
  { id: "nobi2", name: "二寸伸", kana: "にすんのび", shaku: "七尺五寸", cm: "227", ratedDraw: 90 },
  { id: "nobi3", name: "三寸伸", kana: "さんずんのび", shaku: "七尺六寸", cm: "230" },
  { id: "nobi4", name: "四寸伸", kana: "よんすんのび", shaku: "七尺七寸", cm: "233", ratedDraw: 95 },
  { id: "nobi6", name: "六寸伸", kana: "ろくすんのび", shaku: "七尺九寸", cm: "約 239 ⚠️", ratedDraw: 100 },
];

/** One shop's bow-length chart. Bands are checked in order: value ≤ max (or ≥ min for the last open band). */
export interface BowChart {
  id: string;
  who: string;
  basis: "矢束" | "引き尺" | "身高";
  tag: Tag;
  src: Source[];
  note?: string;
  bands: { bow: BowId; label: string; min?: number; max?: number }[];
}

export const DRAW_CHARTS: BowChart[] = [
  {
    id: "suizan",
    who: "翠山",
    basis: "矢束",
    tag: "shop",
    src: [SHOP.suizanYumi],
    bands: [
      { bow: "tsumari3", label: "80 以下", max: 80 },
      { bow: "nami", label: "85 以內", max: 85 },
      { bow: "nobi2", label: "90 以內", max: 90 },
      { bow: "nobi3", label: "95 以內", max: 95 },
      { bow: "nobi4", label: "100 以內", max: 100 },
    ],
  },
  {
    id: "yokoyama",
    who: "横山黎明",
    basis: "矢束",
    tag: "shop",
    src: [SHOP.yokoyama],
    bands: [
      { bow: "nami", label: "85 以內", max: 85 },
      { bow: "nobi2", label: "90 以內", max: 90 },
      { bow: "nobi4", label: "95 以內", max: 95 },
    ],
  },
  {
    id: "sambu",
    who: "山武",
    basis: "引き尺",
    tag: "shop",
    src: [SHOP.sambuQA],
    note: "山武用「引き尺」（實際拉開的長度），表上每種弓只寫一個數字；本站把它當作上限來比對 ⚠️。",
    bands: [
      { bow: "tsumari3", label: "80", max: 80 },
      { bow: "nami", label: "85", max: 85 },
      { bow: "nobi2", label: "90", max: 90 },
      { bow: "nobi4", label: "95", max: 95 },
    ],
  },
  {
    id: "issui",
    who: "永野一萃（用麻弦時）",
    basis: "矢束",
    tag: "shop",
    src: [SHOP.issuiLength],
    note: "弓師的說法：用麻弦時並寸到 85、二寸伸到 93，再長用四寸伸以上；合成弦對弓負擔較大，要用較長、較重的箭。",
    bands: [
      { bow: "nami", label: "85 以內", max: 85 },
      { bow: "nobi2", label: "93 以內", max: 93 },
      { bow: "nobi4", label: "93 以上（四寸伸以上）", min: 93 },
    ],
  },
];

export const HEIGHT_CHARTS: BowChart[] = [
  {
    id: "suizan-h",
    who: "翠山",
    basis: "身高",
    tag: "shop",
    src: [SHOP.suizanYumi],
    bands: [
      { bow: "tsumari3", label: "145～155", min: 145, max: 155 },
      { bow: "nami", label: "155～165", max: 165 },
      { bow: "nobi2", label: "165～175", max: 175 },
      { bow: "nobi3", label: "175～180", max: 180 },
      { bow: "nobi4", label: "180 以上", min: 180 },
    ],
  },
  {
    id: "ikeda-h",
    who: "池田",
    basis: "身高",
    tag: "shop",
    src: [SHOP.ikeda],
    bands: [
      { bow: "tsumari3", label: "145～155", min: 145, max: 155 },
      { bow: "nami", label: "155～165", max: 165 },
      { bow: "nobi2", label: "165～175", max: 175 },
      { bow: "nobi4", label: "175 以上", min: 175 },
    ],
  },
  {
    id: "zenkyugu-h",
    who: "全日本弓道具協會",
    basis: "身高",
    tag: "shop",
    src: [SHOP.zkChoose],
    note: "全日本弓道具協會把二寸伸寫成「身高 170 以上；矢束 90 以上」。弓師永野一萃則說以前用身高分，現在要看矢束。",
    bands: [
      { bow: "nami", label: "170 以下", max: 170 },
      { bow: "nobi2", label: "170 以上", min: 170 },
    ],
  },
];

/** 坊間的身高估算法 — 只能粗估 */
export const HEIGHT_ESTIMATES = [
  { id: "half", label: "身高 × 1/2", factor: 0.5, note: "論壇裡就有人說是「以前的說法」" },
  { id: "male055", label: "身高 × 0.55（男性）", factor: 0.55, note: "討論串稱「教科書公式」，書名不明" },
] as const;

export const HEIGHT_ESTIMATE_SRC: Source[] = [FOLK.bbsYazuka];

/** Find which band a value falls in. Returns band index, or -1 if outside the chart. */
export function matchBand(chart: BowChart, v: number): number {
  for (let i = 0; i < chart.bands.length; i++) {
    const b = chart.bands[i];
    if (b.min != null && v < b.min) return -1;
    if (b.max != null && v <= b.max) return i;
    if (b.max == null && b.min != null && v >= b.min) return i;
  }
  return -1;
}

/** True when the value sits on (±0.5cm of) a chart boundary. */
export function onBoundary(chart: BowChart, v: number): boolean {
  return chart.bands.some((b) => (b.max != null && Math.abs(v - b.max) <= 0.5) || (b.min != null && Math.abs(v - b.min) <= 0.5));
}
