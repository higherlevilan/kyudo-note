// 小弓 tips for * (see ../tips.ts for the rules: <b>/<i>/<br> only, facts match the page).
import type { Tip } from "../tips-routes";

const TIPS: Tip[] = [
  { text: "長文章頁右下角有「目錄」：跳到各段、全部展開「深入」、調整文字大小。", mood: "happy" },
  { text: "標籤小抄：「官方」是全弓連，「指導書」是武道指導書，「坊間常見說法」沒有官方出處。", mood: "think" },
  { text: "看到不熟的日文詞，可以到日文詞彙庫查。", mood: "happy", href: "/glossary/" },
  { text: "本站是查資料整理的筆記，不是指導。實際做法請以所屬道場與指導者為準。", mood: "bow" },
  { text: "迷路了嗎？回首頁的「修煉路線圖」，從序章開始走。", mood: "oops", href: "/#roadmap" },
];

export default TIPS;
