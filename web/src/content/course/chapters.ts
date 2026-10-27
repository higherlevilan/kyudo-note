// 修煉路線: the ordered 關卡 and their 小節. Section ids are anchors on each chapter page;
// keep them in sync when a page's sections change. Mascot lines, quiz and badge live in
// ./<chapterId>.ts.

import type { ChapterDef, ChapterId } from "@/lib/course/types";
import { EXTRAS as GUIDE } from "./guide";
import { EXTRAS as ETIQUETTE } from "./etiquette";
import { EXTRAS as SHAHO } from "./shaho";
import { EXTRAS as SHAGUSE } from "./shaguse";
import { EXTRAS as EQUIPMENT } from "./equipment";
import { EXTRAS as CULTURE } from "./culture";

export const CHAPTERS: ChapterDef[] = [
  {
    ...GUIDE,
    id: "guide",
    tag: "00",
    stage: "序章",
    title: "走進道場",
    ja: "はじめに",
    href: "/guide/",
    blurb: "第一次去道場要準備什麼、在台灣哪裡學、安全守則、費用與審查入門。",
    sections: [
      { id: "first-year", title: "第一年會學什麼" },
      { id: "first-visit", title: "第一次去道場" },
      { id: "dojo-layout", title: "射場長什麼樣" },
      { id: "taiwan", title: "在台灣哪裡學" },
      { id: "safety", title: "安全守則" },
      { id: "injury", title: "傷害預防" },
      { id: "cost", title: "費用試算" },
      { id: "shinsa", title: "審查入門" },
      { id: "vs-archery", title: "弓道與射箭" },
      { id: "topics", title: "其他常見疑問" },
    ],
  },
  {
    ...ETIQUETTE,
    id: "etiquette",
    tag: "01",
    stage: "第一關",
    title: "禮法與體配",
    ja: "体配",
    href: "/etiquette/",
    blurb: "基本體、執弓與持箭、坐射一手的流程、立射與坐射、道場禮儀與安全。",
    sections: [
      { id: "intro", title: "什麼是體配" },
      { id: "kihontai", title: "基本體" },
      { id: "toriyumi", title: "執弓與持箭" },
      { id: "flow", title: "坐射一手" },
      { id: "rissha", title: "立射與坐射" },
      { id: "shinsa", title: "審查時的體配" },
      { id: "dojo", title: "道場禮儀" },
      { id: "safety", title: "安全與「失」" },
      { id: "myths", title: "說法不一" },
    ],
  },
  {
    ...SHAHO,
    id: "shaho",
    tag: "02",
    stage: "第二關",
    title: "射法八節",
    ja: "しゃほうはっせつ",
    href: "/shaho/",
    blurb: "從足踏み到残心，射一支箭的八個步驟，每一節分入門與深入。",
    sections: [
      { id: "torimi", title: "執弓の姿勢", ja: "執弓の姿勢" },
      { id: "ashibumi", title: "足踏み", ja: "足踏み" },
      { id: "dozukuri", title: "胴造り", ja: "胴造り" },
      { id: "yugamae", title: "弓構え", ja: "弓構え" },
      { id: "uchiokoshi", title: "打起し", ja: "打起し" },
      { id: "hikiwake", title: "引分け", ja: "引分け" },
      { id: "kai", title: "会", ja: "会" },
      { id: "hanare", title: "離れ", ja: "離れ" },
      { id: "zanshin", title: "残心", ja: "残心" },
      { id: "yudaoshi", title: "弓倒し", ja: "弓倒し" },
    ],
  },
  {
    ...SHAGUSE,
    id: "shaguse",
    tag: "03",
    stage: "第三關",
    title: "射癖與矢所",
    ja: "しゃぐせ・やどころ",
    href: "/shaguse/",
    blurb: "早気、もたれ、緩み等九種常見射癖，研究證據有多少，以及箭落在哪裡代表什麼。",
    sections: [
      { id: "about", title: "先讀這裡" },
      { id: "hayake", title: "早気", ja: "早気" },
      { id: "motare", title: "もたれ", ja: "もたれ" },
      { id: "biku", title: "びく", ja: "びく" },
      { id: "yusuri", title: "ゆすり", ja: "ゆすり" },
      { id: "yurumi", title: "緩み", ja: "緩み" },
      { id: "yugaeri", title: "弓返り", ja: "弓返り" },
      { id: "hazukobore", title: "筈こぼれ・暴發", ja: "筈こぼれ" },
      { id: "harau", title: "弦打到臉或手臂" },
      { id: "tenouchi", title: "手の内", ja: "手の内" },
      { id: "yadokoro", title: "矢所診斷" },
      { id: "video", title: "錄影自我檢查" },
      { id: "disputes", title: "說法不一" },
    ],
  },
  {
    ...EQUIPMENT,
    id: "equipment",
    tag: "04",
    stage: "第四關",
    title: "弓具",
    ja: "弓具",
    href: "/equipment/",
    blurb: "先借再買：弓、矢、弦、弽、服裝與保養，附矢尺計算器與預算試算。",
    sections: [
      { id: "start", title: "先借再買" },
      { id: "calc", title: "矢尺・弓長計算器" },
      { id: "bow", title: "弓" },
      { id: "arrow", title: "矢" },
      { id: "string", title: "弦" },
      { id: "glove", title: "弽" },
      { id: "dress", title: "服裝" },
      { id: "goods", title: "其他用品" },
      { id: "budget", title: "預算試算" },
      { id: "care", title: "保養" },
      { id: "disputes", title: "說法不一" },
    ],
  },
  {
    ...CULTURE,
    id: "culture",
    tag: "05",
    stage: "第五關",
    title: "文化與哲學",
    ja: "射の心",
    href: "/culture/",
    blurb: "歷史年表、流派系譜、射義與真善美、弓與禪的真相、段位稱號與台灣的弓道。",
    sections: [
      { id: "intro", title: "弓道是什麼" },
      { id: "timeline", title: "年表" },
      { id: "history", title: "歷史專題" },
      { id: "lineage", title: "流派系譜" },
      { id: "thought", title: "思想" },
      { id: "zen", title: "弓道與禪" },
      { id: "ranks", title: "段位與稱號" },
      { id: "taiwan", title: "台灣與弓道" },
      { id: "myths", title: "迷思澄清" },
    ],
  },
];

export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c])) as Record<ChapterId, ChapterDef>;

/** Tools that sit outside the path (sidebar 「工具」 group). */
export const TOOLS = [
  { href: "/glossary/", label: "日文詞彙庫", ja: "用語" },
  { href: "/faq/", label: "問題研究中心", ja: "問答" },
  { href: "/practice/", label: "練習場", ja: "稽古の合間に" },
  { href: "/journal/", label: "稽古帳", ja: "けいこちょう" },
  { href: "/form-check/", label: "射形分析（實驗）", ja: "射形を見る" },
] as const;

/** The section's 1-based number inside its chapter, e.g. "02 · 05". */
export function sectionKicker(chapterId: ChapterId, sectionId: string): string {
  const ch = CHAPTER_BY_ID[chapterId];
  const n = ch.sections.findIndex((s) => s.id === sectionId);
  return n < 0 ? ch.tag : `${ch.tag} · ${String(n + 1).padStart(2, "0")}`;
}
