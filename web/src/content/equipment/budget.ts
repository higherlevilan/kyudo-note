// Beginner-kit budget builder data: 小山弓具網路商店 2026-10-17 含稅標價（日幣）。不含運費、國際運費、台灣進口稅費。

import type { Source } from "@/content/types";
import { SHOP } from "./sources";

export interface BudgetOption {
  name: string;
  ja?: string;
  price: number;
}

export interface BudgetItem {
  id: string;
  label: string;
  ja?: string;
  options: BudgetOption[];
  src: Source;
  note?: string;
  /** [option index, quantity] for each preset */
  presets: { min: [number, number]; std: [number, number] };
  maxQty: number;
}

export const BUDGET_ITEMS: BudgetItem[] = [
  {
    id: "yumi",
    label: "弓",
    ja: "弓",
    options: [
      { name: "練心（初級者用グラス弓，附弦 1 條、附繩弓袋）", ja: "練心", price: 30800 },
      { name: "直心Ⅰ（グラス弓，附吟 特作弦、附繩弓袋、保固 1 年）", ja: "直心Ⅰ", price: 40700 },
    ],
    src: SHOP.koyamaGlass,
    note: "小山部分弓款：並寸 19kg 以上、二寸伸／四寸伸 21kg 以上定價加 2 成。",
    presets: { min: [0, 1], std: [1, 1] },
    maxQty: 2,
  },
  {
    id: "ya",
    label: "矢（6 支組）",
    options: [{ name: "七面鳥アルミ矢 1913（火雞羽、鋁合金箭桿）", price: 19800 }],
    src: SHOP.koyamaGlass,
    note: "箭依指定長度切割，買了不能退換（山武的說明）。",
    presets: { min: [0, 1], std: [0, 1] },
    maxQty: 2,
  },
  {
    id: "makiwaraya",
    label: "巻藁矢",
    ja: "巻藁矢",
    options: [{ name: "鋁製棒矢", price: 2090 }],
    src: SHOP.koyamaGoods,
    presets: { min: [0, 0], std: [0, 1] },
    maxQty: 2,
  },
  {
    id: "yazutsu",
    label: "矢筒",
    ja: "矢筒",
    options: [{ name: "肩背式 直徑 6cm", price: 4800 }],
    src: SHOP.koyamaGoods,
    presets: { min: [0, 0], std: [0, 1] },
    maxQty: 1,
  },
  {
    id: "kake",
    label: "弽",
    ja: "弽",
    options: [
      { name: "三ツカケ 控え無し（較軟，適合初學者、弓力弱的人）", price: 17600 },
      { name: "三ツカケ 中唐（堅帽子控え付き）", price: 28600 },
    ],
    src: SHOP.koyamaKake,
    note: "小山的弽原則上不在網路販售，要到店試戴或郵寄手型。",
    presets: { min: [0, 1], std: [1, 1] },
    maxQty: 1,
  },
  {
    id: "shitagake",
    label: "下がけ",
    ja: "下がけ",
    options: [{ name: "三ツ用 素面", price: 300 }],
    src: SHOP.koyamaKake,
    presets: { min: [0, 2], std: [0, 4] },
    maxQty: 10,
  },
  {
    id: "dougi",
    label: "弓道衣",
    ja: "弓道衣",
    options: [
      { name: "白 棉聚酯混紡", price: 4000 },
      { name: "白 聚酯", price: 4500 },
    ],
    src: SHOP.koyamaWear,
    presets: { min: [0, 1], std: [1, 1] },
    maxQty: 2,
  },
  {
    id: "hakama",
    label: "袴",
    ja: "袴",
    options: [{ name: "黑袴 聚酯", price: 8000 }],
    src: SHOP.koyamaWear,
    presets: { min: [0, 1], std: [0, 1] },
    maxQty: 1,
  },
  {
    id: "obi",
    label: "角帯",
    ja: "角帯",
    options: [{ name: "素面", price: 2000 }],
    src: SHOP.koyamaWear,
    presets: { min: [0, 1], std: [0, 1] },
    maxQty: 1,
  },
  {
    id: "tabi",
    label: "足袋",
    ja: "足袋",
    options: [{ name: "棉足袋", price: 1500 }],
    src: SHOP.koyamaWear,
    presets: { min: [0, 1], std: [0, 2] },
    maxQty: 4,
  },
  {
    id: "muneate",
    label: "胸当て（女性另加）",
    options: [{ name: "PVC 皮革或網布", price: 660 }],
    src: SHOP.koyamaWear,
    presets: { min: [0, 0], std: [0, 0] },
    maxQty: 1,
  },
  {
    id: "kaezuru",
    label: "替弦",
    ja: "替弦",
    options: [
      { name: "初音弦（Kevlar，適合第一次買弦）", price: 660 },
      { name: "吟 特作（Zylon）", price: 1210 },
    ],
    src: SHOP.koyamaStrings,
    note: "弦長要和弓一致，粗細依弓力選。",
    presets: { min: [0, 1], std: [1, 2] },
    maxQty: 4,
  },
  {
    id: "tsurumaki",
    label: "弦巻",
    ja: "弦巻",
    options: [{ name: "素面", price: 900 }],
    src: SHOP.koyamaGoods,
    presets: { min: [0, 1], std: [0, 1] },
    maxQty: 1,
  },
  {
    id: "giriko",
    label: "ぎり粉",
    ja: "ぎり粉",
    options: [{ name: "標準", price: 220 }],
    src: SHOP.koyamaGoods,
    presets: { min: [0, 1], std: [0, 1] },
    maxQty: 2,
  },
  {
    id: "fudeko",
    label: "筆粉",
    ja: "筆粉",
    options: [{ name: "標準", price: 220 }],
    src: SHOP.koyamaGoods,
    presets: { min: [0, 0], std: [0, 1] },
    maxQty: 2,
  },
  {
    id: "tools",
    label: "弓道七つ道具セット",
    options: [{ name: "中定規、道宝、口入、剪刀、木工膠、麻、收納盒", price: 5500 }],
    src: SHOP.koyamaGoods,
    presets: { min: [0, 0], std: [0, 1] },
    maxQty: 1,
  },
];

/** Reference totals from the research (for sanity / display). */
export const PRESET_TOTALS = { min: 86080, std: 123950 } as const;
