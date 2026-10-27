// 小弓 tips for /equipment/ (see ../tips.ts for the rules: <b>/<i>/<br> only, facts match the page).
import type { Tip } from "../tips-routes";

const TIPS: Tip[] = [
  { text: "初學者最重要的一句話：<b>先借再買</b>。", mood: "happy", href: "#start" },
  { text: "<b>矢尺・弓長計算器</b>：輸入矢束（身高選填），並列各來源的建議範圍，不給「唯一官方數字」。", mood: "think", href: "#calc" },
  { text: "矢束的官方量法：從喉嚨中央量到水平伸直的左手中指指尖。請別人拿捲尺比較準。", mood: "happy", href: "#calc" },
  { text: "箭一定要比矢束長，全弓連的底線是長 5 公分以上。實際箭長請以指導者為準。", mood: "focus", href: "#calc" },
  { text: "弓力寧弱勿強：全弓連說初學者要從弱的弓開始。選弓前請以指導者的意見為準。", mood: "think", href: "#start" },
  { text: "我的弓比我高很多，這很正常——和弓的標準長度是 221 公分（七尺三寸，並寸）。", mood: "wow", href: "#bow" },
  { text: "保養的關鍵字是「濕氣」：竹弓怕高溫高濕，弽怕汗。", mood: "think", href: "#care" },
  { text: "預算試算可以切換「最低限」「標準」。那是買齊一套的估算，不是入門必要的花費。", mood: "happy", href: "#budget" },
];

export default TIPS;
