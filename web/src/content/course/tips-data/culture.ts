// 小弓 tips for /culture/ (see ../tips.ts for the rules: <b>/<i>/<br> only, facts match the page).
import type { Tip } from "../tips-routes";

const TIPS: Tip[] = [
  { text: "射法八節是 1953 年《弓道教本》確立的現代基準，不是古代流傳下來的。", mood: "wow", href: "#myths" },
  { text: "「弓道＝禪」的強烈印象，主要是 1956 年《弓與禪》日譯本出版後才形成的。", mood: "think", href: "#zen" },
  { text: "三十三間堂的<b>通し矢</b>比的是從外廊一端射「通」到另一端的箭數，不是射靶。", mood: "wow", href: "#history" },
  { text: "互動年表可以只看日本或台灣的事件；紅色虛線圓點表示說法不一。", mood: "happy", href: "#timeline" },
  { text: "迷思澄清的卡片，正面是常見說法，按「看事實」翻面。", mood: "happy", href: "#myths" },
  { text: "段位之外，還有<b>錬士・教士・範士</b>三個稱號。", mood: "bow", href: "#ranks" },
  { text: "台灣的協會正式名稱是<b>臺灣弓道協會</b>，是國際弓道連盟（IKYF）的正式會員。", mood: "happy", href: "#taiwan" },
  { text: "和弓的握把為什麼偏下？沒有定論。3 世紀的《魏志倭人傳》已經記載「短下長上」。", mood: "think", href: "#myths" },
];

export default TIPS;
