// 矢所分析表（docs/research/04 §2-2）。表中的「常見原因」全部屬於一般指導說法；
// 有官方、指導書或研究支持的部分另列在 support，並逐項標出。

import { ANKF, BUDOKAN, STUDY, WEB } from "./sources";
import type { Point } from "@/content/types";
import type { YadokoroRow } from "./types";

export const YADOKORO_ROWS: YadokoroRow[] = [
  {
    dir: "mae",
    label: "前",
    ja: "まえ",
    where: "靶的右側（右射者）",
    causes: [
      { text: "角見沒有作用、手の内的推力弱，或被弓力壓過", anchor: "tenouchi" },
      { text: "前離れ（在靶的前方就離れ）" },
      { text: "緩み", anchor: "yurumi" },
      { text: "右手的ひねり不足", anchor: "yurumi" },
      { text: "瞄準偏前" },
    ],
    support: [
      { text: "「弓手沒有押し切る，箭會往前飛。」", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "沒有手の内的作用就放箭，箭會往瞄準點的右上方偏（力學研究，小樣本）。", tag: "research", src: [STUDY.hosoya1989, STUDY.miyakawa2026] },
      { text: "「前離れ」被指導書列為五種常見的離れ癖之一。", tag: "guide", src: [BUDOKAN.ch4] },
    ],
    strengthNote: "五個方向中支持最多的一個：有指導書與力學研究。",
  },
  {
    dir: "ushiro",
    label: "後",
    ja: "うしろ",
    where: "靶的左側（右射者）",
    causes: [
      { text: "瞄準偏後" },
      { text: "弓手過度扭轉、往後擺", anchor: "tenouchi" },
      { text: "拉太長" },
      { text: "上押し過強", anchor: "tenouchi" },
    ],
    support: [{ text: "主要來自網路文章，沒有找到指導書或研究佐證。", tag: "folk", src: [WEB.bakufu] }],
    strengthNote: "證據最薄弱：幾乎只有網路文章。",
  },
  {
    dir: "ue",
    label: "上",
    ja: "うえ",
    where: "靶的上方",
    causes: [
      { text: "弓手往上頂（突き上げ）" },
      { text: "上離れ" },
      { text: "口割り（頬付）的位置偏高" },
      { text: "瞄準偏高" },
    ],
    support: [
      { text: "「突き上げ」（弓手往上頂出）被指導書列為離れ癖。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "「上離れ：雙手或右手往上離。」是官方用語，但辭典沒有說它和矢所的關係。", tag: "official", src: [ANKF.terminology] },
    ],
    strengthNote: "只有用語與離れ癖的名稱，沒有直接說明「所以箭會往上」。",
  },
  {
    dir: "shita",
    label: "下",
    ja: "した",
    where: "靶的下方",
    causes: [
      { text: "弓手往下切（切り下げ）" },
      { text: "緩み讓箭束變短", anchor: "yurumi" },
      { text: "早気，沒有拉滿", anchor: "hayake" },
      { text: "押す力不足", anchor: "tenouchi" },
      { text: "口割り偏低" },
    ],
    support: [
      { text: "「切り下げ：離れ時雙手或單手大幅往下掉。」（官方用語）；指導書也列為離れ癖。", tag: "official", src: [ANKF.terminology, BUDOKAN.ch4] },
      { text: "早気嚴重時「連正規的矢尺都拉不到」（研究中的描述）。", tag: "research", src: [STUDY.mori1990] },
      { text: "緩み讓拉出來的箭長變短（研究文獻的定義）。", tag: "research", src: [STUDY.miyakawa2026] },
    ],
    strengthNote: "有官方用語與研究描述，但都不是「矢所」研究。",
  },
  {
    dir: "chiru",
    label: "散亂",
    where: "每一箭落點都不同",
    causes: [
      { text: "離れ的方向與大小每次不同" },
      { text: "手の内不穩定", anchor: "tenouchi" },
      { text: "右拳的偏移大", anchor: "yurumi" },
    ],
    support: [{ text: "放箭時伸展右手拇指 MP 關節，與右拳偏移較小而穩定有關（n=8，男子大學選手）。", tag: "research", src: [STUDY.miyakawa2026] }],
    strengthNote: "只有一篇 8 人的研究。",
  },
];

/** 先講清楚：「前」「後」是一般說法 */
export const MAE_USHIRO: Point[] = [
  { text: "矢所（やどころ）：射出的箭到達的落點。殘心時「放箭後姿勢不變，看矢所」。", tag: "official", src: [ANKF.terminology, ANKF.syaho] },
  {
    text: "射手站好足踏み時，身體正面朝向射場正面，靶在左手邊。「前」是射手身體正面那一側，從射手看過去是靶的右側；「後」是背後那一側，是靶的左側。左射者左右相反。",
    tag: "folk",
    src: [WEB.kyusho],
  },
  { text: "全弓連用語辭典與指導書都沒有直接寫「前＝右」的定義句，這是社團間的通用說法。", tag: "disputed" },
];

/** 表格之外也會影響矢所的因素 */
export const OTHER_FACTORS: Point[] = [
  { text: "同一個矢所可能有好幾個原因同時作用。", tag: "note" },
  { text: "瞄準（ねらい）、弓力與箭重是否搭配、羽根、風等弓具與環境因素也會影響。", tag: "note" },
];
