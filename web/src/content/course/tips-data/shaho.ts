// 小弓 tips for /shaho/ (see ../tips.ts for the rules: <b>/<i>/<br> only, facts match the page).
import type { Tip } from "../tips-routes";

const TIPS: Tip[] = [
  { text: "足踏み、胴造り、弓構え、打起し、引分け、会、離れ、残心。我背這串背了很久。", mood: "happy", href: "#torimi" },
  { text: "每一節都分「入門」與「深入」兩層。想一次全打開，按右下角「目錄」裡的<b>全部展開</b>。", mood: "happy" },
  { text: "足踏み的寬度以自己的<b>矢束</b>為標準、約 60 度；「肩寬 1.5 倍」是坊間說法。", mood: "think", href: "#ashibumi" },
  { text: "打起し，官方只說舉到「比額頭的線稍高」；常聽到的「45 度」沒有官方出處。", mood: "think", href: "#uchiokoshi" },
  { text: "<b>会</b>是整個射法的核心。「要撐 5～7 秒」常聽到，但全弓連沒有規定秒數。", mood: "focus", href: "#kai" },
  { text: "時機成熟、自然發生的離れ，官方辭典稱為<b>自然の離れ</b>。", mood: "focus", href: "#hanare" },
  { text: "離れ之後還沒結束：<b>残心</b>時視線停在矢所，身心都不鬆懈。也寫作残身。", mood: "focus", href: "#zanshin" },
  { text: "最後弓倒し、物見返し、足閉じ，一射才算結束。這頁是幫助理解，實際怎麼做照指導者教的。", mood: "bow", href: "#yudaoshi" },
];

export default TIPS;
