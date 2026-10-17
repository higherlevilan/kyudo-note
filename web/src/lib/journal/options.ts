// Labels and option lists for the journal UI. Japanese terms carry `ja` so the UI can mark them lang="ja".

import type { CultureKind, Currency, EntryType, EquipCategory, EquipStatus, ExamResult, GoalKind, PracticeKind, ShahoStep, Yadokoro } from "./types";

export interface Opt<K extends string = string> {
  key: K;
  label: string;
  /** Japanese form (rendered with lang="ja"). */
  ja?: string;
  hint?: string;
}

export const TYPE_META: Record<EntryType, { label: string; ja: string; short: string; dot: string; badge: string }> = {
  practice: { label: "練習", ja: "稽古", short: "練", dot: "bg-wood", badge: "border-wood/40 bg-wood-soft text-ink" },
  lesson: { label: "課程筆記", ja: "講習", short: "課", dot: "bg-indigo", badge: "border-indigo/30 bg-indigo/10 text-indigo" },
  exam: { label: "審查", ja: "審査", short: "審", dot: "bg-vermilion", badge: "border-vermilion/40 bg-vermilion/10 text-vermilion" },
  purchase: { label: "裝備採購", ja: "弓具", short: "具", dot: "bg-muted", badge: "border-line bg-surface-2 text-ink" },
  culture: { label: "文化體驗", ja: "文化", short: "文", dot: "bg-ink", badge: "border-ink/30 bg-surface-2 text-ink" },
  goal: { label: "目標", ja: "目標", short: "標", dot: "bg-wood", badge: "border-wood/40 bg-surface text-wood" },
};

export const LOG_TYPES: EntryType[] = ["practice", "lesson", "exam", "purchase", "culture"];

export const PRACTICE_KIND_OPTS: Opt<PracticeKind>[] = [
  { key: "toshu", label: "徒手", ja: "徒手" },
  { key: "gomuyumi", label: "ゴム弓", ja: "ゴム弓" },
  { key: "subiki", label: "素引き", ja: "素引き" },
  { key: "makiwara", label: "巻藁", ja: "巻藁" },
  { key: "matomae", label: "的前", ja: "的前" },
  { key: "shakai", label: "射會", ja: "射会" },
];

/** Common 射癖. Free-text faults are allowed too. */
export const FAULTS: Opt[] = [
  { key: "hayake", label: "早気", ja: "早気", hint: "未達會就放" },
  { key: "motare", label: "もたれ", ja: "もたれ", hint: "會過久、離不出去" },
  { key: "yurumi", label: "緩み", ja: "緩み", hint: "離時往前鬆回" },
  { key: "biku", label: "びく", ja: "びく", hint: "會中無意識地突然往回拉" },
  { key: "hikitarazu", label: "引き不足", ja: "引き不足", hint: "未引滿矢束" },
  { key: "yugaeri", label: "弓返り不成", ja: "弓返り", hint: "離後弓沒有轉" },
  { key: "hazukobore", label: "筈こぼれ", ja: "筈こぼれ", hint: "箭筈脫弦" },
  { key: "tsuru-face", label: "弦打到臉／耳" },
  { key: "tsuru-arm", label: "弦打到手臂" },
  { key: "oshide", label: "弓手が負ける", ja: "弓手が負ける", hint: "押手被弓推回、手腕下垂" },
  { key: "katasaki", label: "肩上がり", ja: "肩上がり", hint: "肩膀聳起" },
];

export const YADOKORO_OPTS: Opt<Yadokoro>[] = [
  { key: "center", label: "集中", hint: "落點集中" },
  { key: "mae", label: "前", ja: "前", hint: "射手看靶時偏右" },
  { key: "ushiro", label: "後", ja: "後ろ", hint: "射手看靶時偏左" },
  { key: "ue", label: "上", ja: "上", hint: "偏高" },
  { key: "shita", label: "下", ja: "下", hint: "偏低" },
  { key: "chiru", label: "散", hint: "落點分散" },
];

export const SHAHO_STEP_OPTS: Opt<ShahoStep>[] = [
  { key: "torimi", label: "執弓姿勢", ja: "執弓の姿勢" },
  { key: "ashibumi", label: "足踏", ja: "足踏み" },
  { key: "dozukuri", label: "胴造", ja: "胴造り" },
  { key: "yugamae", label: "弓構", ja: "弓構え" },
  { key: "uchiokoshi", label: "打起", ja: "打起し" },
  { key: "hikiwake", label: "引分", ja: "引分け" },
  { key: "kai", label: "會", ja: "会" },
  { key: "hanare", label: "離", ja: "離れ" },
  { key: "zanshin", label: "殘心", ja: "残心" },
  { key: "yudaoshi", label: "弓倒", ja: "弓倒し" },
];

export const PAIN_AREAS: string[] = ["弓手肩（左）", "妻手肩（右）", "弓手肘", "妻手肘", "手腕", "拇指／手指", "頸部", "背部", "腰", "膝"];

export const FATIGUE_OPTS: Opt[] = [
  { key: "1", label: "很有精神" },
  { key: "2", label: "還不錯" },
  { key: "3", label: "普通" },
  { key: "4", label: "有點累" },
  { key: "5", label: "非常疲勞" },
];

export const GRADES: string[] = ["級位", "初段", "弐段", "参段", "四段", "五段", "六段", "七段", "八段", "錬士", "教士", "範士"];

export const EXAM_RESULT_OPTS: Opt<ExamResult>[] = [
  { key: "pending", label: "待公布" },
  { key: "pass", label: "合格" },
  { key: "fail", label: "不合格" },
];

export const EQUIP_CATEGORY_OPTS: Opt<EquipCategory>[] = [
  { key: "yumi", label: "弓", ja: "弓" },
  { key: "ya", label: "矢", ja: "矢" },
  { key: "kake", label: "弽（ゆがけ）", ja: "弽" },
  { key: "tsuru", label: "弦", ja: "弦" },
  { key: "muneate", label: "胸当て", ja: "胸当て" },
  { key: "dougi", label: "弓道衣・袴" },
  { key: "case", label: "弓袋・矢筒" },
  { key: "other", label: "其他" },
];

/** Suggested spec labels per category (shown as quick-add chips). */
export const SPEC_PRESETS: Record<EquipCategory, string[]> = {
  yumi: ["弓長（並寸／伸寸）", "弓力（kg）", "材質", "製作者"],
  ya: ["矢尺（cm）", "支數", "材質", "羽根", "重量（g）"],
  kake: ["指數（三つ／四つ）", "尺寸", "製作者"],
  tsuru: ["材質", "適用弓長", "條數"],
  muneate: ["尺寸"],
  dougi: ["尺寸", "顏色"],
  case: ["長度"],
  other: [],
};

export const EQUIP_STATUS_OPTS: Opt<EquipStatus>[] = [
  { key: "active", label: "使用中" },
  { key: "spare", label: "備用" },
  { key: "repair", label: "修理中" },
  { key: "retired", label: "已退役／售出" },
];

export const CURRENCY_OPTS: Opt<Currency>[] = [
  { key: "TWD", label: "新臺幣 TWD" },
  { key: "JPY", label: "日圓 JPY" },
];

export const CULTURE_KIND_OPTS: Opt<CultureKind>[] = [
  { key: "taikai", label: "射會・大會" },
  { key: "yabusame", label: "流鏑馬", ja: "流鏑馬" },
  { key: "dojo", label: "道場參訪" },
  { key: "shrine", label: "神社・奉納" },
  { key: "seminar", label: "講習會・演講" },
  { key: "other", label: "其他" },
];

export const GOAL_KIND_OPTS: Opt<GoalKind>[] = [
  { key: "exam", label: "審查", hint: "例如「下次審查：初段」" },
  { key: "arrows", label: "累積射數", hint: "期間內的的前＋巻藁射數" },
  { key: "hitrate", label: "的中率", hint: "最近 10 次的前練習" },
  { key: "custom", label: "其他", hint: "自行勾選完成" },
];

export function optLabel<K extends string>(opts: readonly Opt<K>[], key: string): string {
  return opts.find((o) => o.key === key)?.label ?? key;
}

export function faultLabel(key: string): string {
  return FAULTS.find((f) => f.key === key)?.label ?? key;
}

export function faultOpt(key: string): Opt | undefined {
  return FAULTS.find((f) => f.key === key);
}
