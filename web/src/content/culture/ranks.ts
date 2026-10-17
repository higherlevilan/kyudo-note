// 段位與稱號 (docs/research/01 §3). Criteria: 全弓連《審査規程および内規》第 8 條（原文節錄＋中譯）.

import type { Point, Source } from "../types";
import { ANKF, TAIWAN } from "../common-sources";
import { CS } from "./sources";

export type RankBand = "kyu" | "dan" | "senko";

export interface Rank {
  id: string;
  name: string;
  kana: string;
  band: RankBand;
  /** 審查會層級 */
  level?: string;
  /** 第 8 條原文（短句節錄） */
  ja?: string;
  zh?: string;
  /** 命中要求的提示 */
  hit?: string;
}

/** Ascending order: 五級 → 十段. */
export const RANKS: Rank[] = [
  { id: "5kyu", name: "五級", kana: "ごきゅう", band: "kyu", level: "地方", ja: "弓道修練の初歩的階層にある者", zh: "處於弓道修練的初步階段" },
  { id: "4kyu", name: "四級", kana: "よんきゅう", band: "kyu", level: "地方" },
  { id: "3kyu", name: "三級", kana: "さんきゅう", band: "kyu", level: "地方" },
  { id: "2kyu", name: "二級", kana: "にきゅう", band: "kyu", level: "地方" },
  { id: "1kyu", name: "一級", kana: "いっきゅう", band: "kyu", level: "地方", ja: "射型・体配概ね正しいものと認められる者", zh: "射型、體配大致正確" },
  { id: "1dan", name: "初段", kana: "しょだん", band: "dan", level: "地方", ja: "射型・体配型に適って、矢所の乱れぬ程度に達した者", zh: "射型、體配合乎型，箭著點不亂" },
  {
    id: "2dan",
    name: "弐段",
    kana: "にだん",
    band: "dan",
    level: "地方",
    ja: "射型・体配共に整い、射術の運用に気力充実し、矢所の乱れぬ者",
    zh: "射型、體配整齊，氣力充實，箭著點不亂",
    hit: "統一基準：的中不問",
  },
  {
    id: "3dan",
    name: "参段",
    kana: "さんだん",
    band: "dan",
    level: "地方",
    ja: "…矢飛び直く、的中やや確実な者",
    zh: "射形已定、體配沉穩，箭飛直，命中稍確實",
    hit: "的中やや確実",
  },
  {
    id: "4dan",
    name: "四段",
    kana: "よんだん",
    band: "dan",
    level: "地方",
    ja: "…離れ鋭く、的中確実の域に達した者",
    zh: "射形已定、體配沉穩、呼吸正確，離れ銳利，命中確實",
    hit: "的中確実",
  },
  {
    id: "5dan",
    name: "五段",
    kana: "ごだん",
    band: "dan",
    level: "連合",
    ja: "射形・射術・体配共に法に適って射品現われ、精励の功特に認められる者",
    zh: "三者合乎法度、射品顯現，精勵之功特受肯定",
  },
  {
    id: "6dan",
    name: "六段",
    kana: "ろくだん",
    band: "dan",
    level: "中央",
    ja: "射形・射術・体配共に優秀にして射品高く、精錬の功顕著な者",
    zh: "三者皆優秀、射品高，精錬之功顯著",
  },
  {
    id: "7dan",
    name: "七段",
    kana: "ななだん",
    band: "dan",
    level: "中央（行射＋論文）",
    ja: "射形・射術・体配自から備わり、射品高く、錬達の域に達した者",
    zh: "射形、射術、體配自然具備，射品高，達到練達境界",
  },
  {
    id: "8dan",
    name: "八段",
    kana: "はちだん",
    band: "dan",
    level: "中央（行射＋論文）",
    ja: "技能円熟、射品高雅、射芸の妙を体得した者",
    zh: "技能圓熟、射品高雅，體得射藝之妙",
  },
  { id: "9dan", name: "九段", kana: "きゅうだん", band: "senko", level: "審議會選考", ja: "弓道の真体に透徹した者", zh: "透徹弓道本質" },
  { id: "10dan", name: "十段", kana: "じゅうだん", band: "senko", level: "審議會選考" },
];

export interface Title {
  id: string;
  name: string;
  kana: string;
  /** 受審條件 */
  needs: string;
  how: string;
  /** 資格（第 5 條，中文摘要） */
  quality: string;
  count: string;
}

/** Ascending order: 錬士 → 範士. */
export const TITLES: Title[] = [
  {
    id: "renshi",
    name: "錬士",
    kana: "れんし",
    needs: "持有五段以上，且取得五段後滿 1 年",
    how: "行射＋面試＋學科",
    quality: "志操堅實，具弓道指導實力，精錬之功顯著。",
    count: "4,704 人",
  },
  {
    id: "kyoshi",
    name: "教士",
    kana: "きょうし",
    needs: "持有錬士，取得錬士後滿 2 年，且取得六段後滿 1 年",
    how: "行射＋面試＋論文",
    quality: "人格、技能、識見兼備，具備指導所需的學識、教養與實力，功績顯著。",
    count: "1,940 人",
  },
  {
    id: "hanshi",
    name: "範士",
    kana: "はんし",
    needs: "持有教士",
    how: "由審議會選考，不考試",
    quality: "德操高潔、技能圓熟、識見高邁，特別能作為弓界的模範。",
    count: "63 人",
  },
];

export const RANK_SRC: Source[] = [ANKF.probationRules, ANKF.probationStandard, ANKF.overview];

export const RANK_RULES: Point[] = [
  { text: "級位五級～一級共 5 階，段位初段～十段共 10 階；稱號分錬士、教士、範士 3 階。", tag: "official", src: [ANKF.probationRules] },
  { text: "受審間隔（內規）：五段以下須取得現段位後 5 個月；六段以上須 1 年。", tag: "official", src: [ANKF.probationRules] },
  {
    text: "審查會層級：地方審查（四段以下）、連合審查（五段以下）、中央審查（六段以上、錬士、教士）；另有外國審查會（錬士與六段以下）。九段以上由審議會選考。",
    tag: "official",
    src: [ANKF.probationRules],
  },
  { text: "稱號者人數為 2025 年 3 月 31 日的官方統計。", tag: "official", src: [ANKF.overview] },
  { text: "外國人（包括台灣會員）的審查另有規定；實際途徑請以臺灣弓道協會「審查情報」為準。", tag: "local", src: [TAIWAN.shinsa] },
];

export const RANK_HISTORY: Point[] = [
  { text: "1895 年大日本武德會設立「精錬證」，表彰各武術的優秀者。", src: [CS.jaWikiHanshi] },
  { text: "1902 年依武德會「武術家優遇例」設立「範士」「教士」稱號。", src: [CS.jaWikiHanshi] },
  { text: "1914 年制定精錬證授與例（選拔基準）；依二手資料。", tag: "disputed", src: [CS.butokukaiDir] },
  {
    text: "「錬士」設立的確切年份說法不一：常見說法是 1934 年取代精錬證，但本站沒有查到一手資料；日文維基百科〈弓道〉另有 1943 年的記述。",
    tag: "disputed",
    src: [CS.jaWiki],
  },
  {
    text: "戰前大日本弓道會等民間團體也自行授予段級與稱號，與武德會並存；「段位＝全國統一制度」是戰後才有的狀態。",
    src: [CS.goka2018, CS.goka2022],
  },
  { text: "1946 年武德會解散，戰後由各武道連盟繼續授予稱號。", src: [CS.jaWikiHanshi] },
];
