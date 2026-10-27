// 小弓 tips for / (see ../tips.ts for the rules: <b>/<i>/<br> only, facts match the page).
import type { Tip } from "../tips-routes";

const TIPS: Tip[] = [
  { text: "嗨，我是<b>小弓</b>！點我一下，我會說一句和這一頁有關的小提醒。", mood: "happy" },
  { text: "還沒碰過弓？先看「修煉路線圖」，照順序走最順，也可以直接跳到想看的關卡。", mood: "happy", href: "#roadmap" },
  { text: "首頁這個靶叫<b>霞的</b>，直徑 36 公分。近的比賽是從 28 公尺外射它。", mood: "wow" },
  { text: "<b>今日の一語</b>每天換一個詞，台灣時間午夜更新。一天記一個，不貪心。", mood: "happy" },
  { text: "本站的技術與禮法以全弓連公開資料為準，每個說法都標出依據：官方、指導書，還是坊間說法。", mood: "think" },
  { text: "〈射義〉說：射不中，不怨勝過自己的人，回頭找自己的原因。我射歪時也努力這樣想。", mood: "bow" },
  { text: "我叫小弓，但我不負責教你射箭——那是你和指導者的事，我只負責在角落提醒。", mood: "happy" },
];

export default TIPS;
