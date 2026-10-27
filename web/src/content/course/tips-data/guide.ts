// 小弓 tips for /guide/ (see ../tips.ts for the rules: <b>/<i>/<br> only, facts match the page).
import type { Tip } from "../tips-routes";

const TIPS: Tip[] = [
  { text: "弓道不是第一天就射靶：先徒手，再ゴム弓、素引き、巻藁，最後才站上的前。", mood: "think", href: "#first-year" },
  { text: "第一次去道場不用先買弓。協會的弓道教室有公用的弓、箭、弽。", mood: "happy", href: "#first-visit" },
  { text: "最基本的三條：不對人、不擅自上的前、不進矢道。徒手練習也不對著人。實際做法請以指導者為準。", mood: "focus", href: "#safety" },
  { text: "<b>素引き</b>絕不放弦：空放可能讓弦斷掉，或打到臉與左臂。實際做法請以指導者為準。", mood: "oops", href: "#safety" },
  { text: "射場前方的<b>矢道</b>，盡頭的土堆叫<b>安土</b>，靶就立在安土前。去看看射場的俯視圖。", mood: "wow", href: "#dojo-layout" },
  { text: "第一年大概花多少？「費用試算」可以勾選、改單價，總額即時更新。", mood: "happy", href: "#cost" },
  { text: "審查的初段、弐段看射形與體配，到<b>参段</b>才開始要求中靶。", mood: "wow", href: "#shinsa" },
  { text: "弓道的傷害研究少又舊。身體不適請找醫師；練習量怎麼調整，請以指導者為準。", mood: "think", href: "#injury" },
];

export default TIPS;
