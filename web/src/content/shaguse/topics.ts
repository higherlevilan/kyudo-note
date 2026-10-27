// 射癖與矢所：開頭說明、錄影自我檢查（§3-1-4）、說法不一（§9）。

import type { Point } from "@/content/types";
import { ANKF, BUDOKAN, STUDY } from "./sources";

/** 射癖是什麼 */
export const WHAT_IS: Point[] = [
  { text: "射癖（しゃぐせ）：射法上各種習慣性毛病的總稱。", tag: "research", src: [STUDY.yamaguchi2010] },
  {
    text: "學會分科會的檢討指出：射癖往往是「在不知不覺中學到不符正法的方法」所造成，可能單獨出現，也可能幾種同時出現；同一種射癖在每個人身上的狀況也不同。",
    tag: "research",
    src: [STUDY.bunkakai2001],
  },
  { text: "矯正需要的時間差異很大：有的稍加注意就能改，有的「需要以 10 年為單位」。", tag: "research", src: [STUDY.bunkakai2001] },
  { text: "指導書把「離れ的毛病與矯正」放在進一步的階段，提醒要讓學習者自己思考成因，也不要因為太在意中靶，丟掉之前累積的基礎。", tag: "guide", src: [BUDOKAN.ch4] },
];

/** 指導書列出的五種離れ癖 */
export const HANARE_FAULTS: { ja: string; kana: string; text: string; anchor?: string }[] = [
  { ja: "緩み", kana: "ゆるみ", text: "往回放鬆後才放（もどして離す）", anchor: "yurumi" },
  { ja: "突き上げ", kana: "つきあげ", text: "弓手往上頂出" },
  { ja: "切り下げ", kana: "きりさげ", text: "離れ時雙手或單手大幅往下掉（弓手を切り下げて離す）" },
  { ja: "前離れ", kana: "まえばなれ", text: "在靶的前方就離れ（的より前に離す）" },
  { ja: "早気", kana: "はやけ", text: "沒有拉到「会」就放掉", anchor: "hayake" },
];

/** 為什麼要問指導者 */
export const ASK_INSTRUCTOR: Point[] = [
  { text: "目前沒有任何以隨機對照試驗（RCT）驗證弓道射癖矯正法的研究；研究多半是小樣本的問卷、個案或一頁的學會摘要。", tag: "research", src: [STUDY.bunkakai2001, STUDY.matsuo2000] },
  { text: "所以本頁的「改善法」一律是一般指導說法，除非另外標出研究。", tag: "note" },
  { text: "同一個矢所、同一種感覺，背後的原因可能完全不同。實際練習請以所屬道場指導者看過你的射之後的判斷為準。", tag: "note" },
];

/** 錄影自我檢查：證據 */
export const VIDEO_EVIDENCE: Point[] = [
  { text: "森・弘瀬 1994 用錄影找出早気射手共同的動作特徵（胸弦、頬付太早定下來、眨眼等），這些可以當作看影片時的觀察重點。", tag: "research", src: [STUDY.mori1994] },
  {
    text: "川向 1983 指出，緩み「本人常沒有自覺」是矯正上最大的問題，外在回饋有助於察覺。錄影是一種簡便的外在回饋——不過這是推論，沒有研究直接驗證錄影對弓道的效果。",
    tag: "disputed",
    src: [STUDY.kawamukai1983],
  },
  {
    text: "COVID-19 期間全弓連實施過「影片審査」（級位、初段、弐段）；也有高中社團把拉弓影片傳給遠端的外部指導者取得回饋。報告者認為「最重要的是內容，以及指導者是否可信」。",
    tag: "research",
    src: [STUDY.okazaki2022],
  },
];

/** 錄影自我檢查：怎麼拍、看什麼 */
export const VIDEO_HOW: Point[] = [
  { text: "從正面、背面、側面分別拍，並用慢動作看離れ。", tag: "folk" },
  { text: "看「会」：胸弦、頬付是不是一拉到就定住、有沒有眨眼或閉眼（早気研究觀察到的特徵）。", tag: "note", src: [STUDY.mori1994] },
  { text: "看離れ：右手有沒有往靶的方向回一下（緩み）、弓手有沒有往上頂或往下切。", tag: "note" },
  { text: "看離れ之後：弓有沒有轉（弓返り）、残心時有沒有看矢所。", tag: "note", src: [ANKF.syaho] },
  { text: "影片拿給指導者看最有用；自己看到「好像有問題」時，先記下來問，不要自己大改射形。", tag: "note" },
];

/** 錄影的安全 */
export const VIDEO_SAFETY: Point[] = [
  { text: "拍攝的人與手機、腳架都不可以進入矢道、巻藁後方，或射手的弦道附近。", tag: "note" },
  { text: "巻藁的後方與左右附近絕對不能有人；拔箭前也要確認後方沒人。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch4] },
  { text: "沒有指導者許可，不要在的前拉弓；不論徒手、ゴム弓或真弓，都不要對著人，連模仿也不行。", tag: "guide", src: [BUDOKAN.ch2] },
  { text: "能不能拍、可以站在哪裡拍，先問道場與指導者；也要尊重其他射手不想入鏡的意願。", tag: "note" },
];

/** 說法不一・待查證（§9） */
export const DISPUTES: { title: string; anchor: string; text: string }[] = [
  { title: "早気的盛行率", anchor: "hayake", text: "森 1990 原文約 79%，西尾 2021 引用同一篇時寫 60.3%，西尾自己的樣本是 53.8%。本站寫「5～8 成之間」。" },
  { title: "びく的定義", anchor: "biku", text: "全弓連辭典是「会中無意識地突然往回拉」；西尾 2021 是「上肢像要放箭般動了一下」。" },
  { title: "緩み、ゆすり、暴發、引き込み", anchor: "yurumi", text: "全弓連用語辭典都沒有獨立詞條，定義依來源而異。「引き込み」在社團間的意思也不一致，請向指導者確認。" },
  { title: "「払う」不是「被弦打到」", anchor: "harau", text: "辭典的「払う離れ」是離れ的類型；「顔を払う」是社團用語。" },
  { title: "矢所的「前」「後」", anchor: "yadokoro", text: "「前＝靶的右側」是通用說法，官方用語辭典與指導書沒有定義句。" },
  { title: "矢所表的「後」「上」", anchor: "yadokoro", text: "幾乎只有網路文章或用語辭典間接支持，證據最薄弱。" },
  { title: "手の内的流派差異", anchor: "tenouchi", text: "上押し與中押し、虎口捲多深，各流派與指導者的說法不同。" },
  { title: "《弓道教本》原文", anchor: "about", text: "本頁依據的是全弓連網頁（註明以教本為參考）與指導書，沒有直接核對教本紙本。" },
];
