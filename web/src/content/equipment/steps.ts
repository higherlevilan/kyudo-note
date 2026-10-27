// 裝備百科的兩個步驟播放器：量矢束 → 決定箭長；弦的準備與更換。
// 要點全部取自本頁既有的內容（topics.ts、calc.ts、faqs.ts），附同樣的出處；
// 沒有官方數字的地方照原文標成弓具店、坊間或本站整理。

import type { Point } from "@/content/types";
import { ANKF, BUDOKAN, FOLK, SHOP } from "./sources";
import { MEASURE_STEPS } from "./topics";

export interface GearStep {
  id: string;
  title: string;
  text: string;
  points: Point[];
}

const measure = (starts: string): Point[] => MEASURE_STEPS.filter((p) => p.text.startsWith(starts));

/** 量矢束 → 箭要比矢束長多少。step index drives components/equipment/YazukaSteps.tsx. */
export const YAZUKA_STEPS: GearStep[] = [
  {
    id: "arm",
    title: "站直，左臂抬到與肩同高",
    text: "左臂水平伸直；量的時候請別人拿捲尺。",
    points: [...measure("站直"), ...measure("量的時候")],
  },
  {
    id: "measure",
    title: "喉嚨中心 → 左手中指指尖",
    text: "這段長度就是矢束（やづか）。",
    points: [...measure("從喉嚨中心"), ...measure("山武弓具店")],
  },
  {
    id: "not-height",
    title: "看手臂，不看身高",
    text: "「身高 ÷ 2」只能粗估，請實際量。",
    points: [
      ...measure("全弓連與《弓道教本》"),
      { text: "論壇也有人指出「身高 ÷ 2」是舊說法；用 ÷2 和 ×0.55 算，身高 170cm 會差將近 9cm。請實際量。", tag: "folk", src: [FOLK.bbsYazuka] },
    ],
  },
  {
    id: "floor",
    title: "箭長＝矢束＋餘裕：至少 +5 cm",
    text: "全弓連的底線：比矢束長 5 cm 以上（約 3 指寬）。",
    points: [{ text: "全弓連：箭至少要比矢束長 5cm（約 3 指寬）；《弓道教本》寫「為了安全加上 5〜10cm」。", tag: "official", src: [ANKF.tool, BUDOKAN.ch3] }],
  },
  {
    id: "beginner",
    title: "初學者：約 +10 cm 以上",
    text: "射形還沒定下來，箭留長一點。",
    points: [
      { text: "全弓連：射形還沒定下來的初學者，「10cm位長い矢が適当」。", tag: "official", src: [ANKF.tool] },
      { text: "弓具店給初學者、高中生的建議更保守：+12〜15cm。", tag: "shop", src: [SHOP.suizanYa, SHOP.heian1913] },
      { text: "沒有單一的「正確」數字；初學者以 +10cm 以上為宜，請和指導者確認。", tag: "note" },
    ],
  },
  {
    id: "too-short",
    title: "等長或更短：的前禁止",
    text: "比矢束短、或剛好等於矢束的箭，不能拿來射靶。",
    points: [
      { text: "比矢束短、或剛好等於矢束的箭，全弓連禁止在的前（對靶練習）使用。", tag: "official", src: [ANKF.tool] },
      { text: "常見的解釋是：拉滿時箭頭可能被拉進弓的內側（引き込み），放箭時撞到弓或傷到左手。", tag: "folk", src: [FOLK.datamax] },
      { text: "實際買多長，請讓指導者看過你的射再決定；箭是依指定長度切割的，買了通常不能退換。", tag: "note" },
    ],
  },
];

/** 弦：選弦 → 替弦 → 弓把 → 中仕掛 → 換弦時機. Drives components/equipment/TsuruSteps.tsx. */
export const TSURU_STEPS: GearStep[] = [
  {
    id: "choose",
    title: "選弦：長度跟弓，粗細看弓力",
    text: "並寸弓配並寸弦；各牌的「號」不一樣。",
    points: [
      { text: "弦長跟弓一致：並寸弓配並寸弦，「並寸用の弦は二寸伸などの弓には合いません」。粗細依弓力選，而且各牌的「號」不同。", tag: "shop", src: [ANKF.tool, SHOP.suizanTsuru] },
      { text: "規則只要求弦撚成一條，麻或合成材質都可以。用玻纖、碳纖弓的初學者用合成弦即可；麻弦主要配竹弓。", tag: "official", src: [ANKF.playRules, SHOP.koyamaStrings] },
    ],
  },
  {
    id: "kaezuru",
    title: "先備好替弦",
    text: "預想弦會斷：替弦拉過幾射後，收進弦巻。",
    points: [{ text: "預想弦會斷，一定要先做好替弦（かえづる：備用弦），拉過幾射後收進弦巻（つるまき）。", tag: "official", src: [ANKF.tool, ANKF.terminology] }],
  },
  {
    id: "yuzuka",
    title: "弓把：握把到弦約 15 cm",
    text: "調整弦長，讓上関板不碰到弦。",
    points: [
      { text: "弓把（ゆみづか：握把到弦的距離）以 15cm 為基準，並調整弦長讓上関板不碰到弦。", tag: "guide", src: [BUDOKAN.ch2] },
      { text: "新合成弦容易伸長，弦輪先做短一點、弓把先張高一點。", tag: "shop", src: [SHOP.suizanTsuru] },
    ],
  },
  {
    id: "nakajikake",
    title: "中仕掛：箭筈扣住的地方",
    text: "搭箭位置太低，離れ時可能傷到左手拇指。",
    points: [
      { text: "中仕掛從搭箭位置往上 1〜1.5cm 處開始做，要纏到和箭筈貼合，用道宝收尾。", tag: "official", src: [ANKF.tool] },
      { text: "翠山：搭箭位置定在箭與弦呈 90 度的地方。", tag: "shop", src: [SHOP.suizanTsuru] },
      { text: "搭箭位置太低，離れ時可能傷到拇指。", tag: "guide", src: [BUDOKAN.ch2] },
    ],
  },
  {
    id: "replace",
    title: "什麼時候換：沒有官方數字",
    text: "看射數，也看外觀：起毛、變細、弦輪變硬就該換。",
    points: [
      { text: "說法差很多：弓師以 200〜300 射為準，弓具店說合成弦一般 600〜700 射換，問答網站有 1000〜3000 射的說法。", tag: "disputed", src: [SHOP.issuiSynth, SHOP.suizanTsuru] },
      { text: "比賽、審查前換新弦，先拉約 100 射再上場。", tag: "shop", src: [SHOP.suizanTsuru] },
      { text: "本站建議：看射數，也看外觀——起毛、變細、弦輪變硬就該換。弦輪、中仕掛第一次自己做時，請指導者或弓具店看過。", tag: "note" },
    ],
  },
];
