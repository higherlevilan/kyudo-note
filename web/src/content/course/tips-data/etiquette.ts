// 小弓 tips for /etiquette/ (see ../tips.ts for the rules: <b>/<i>/<br> only, facts match the page).
import type { Tip } from "../tips-routes";

const TIPS: Tip[] = [
  { text: "<b>揖</b>是上半身前屈約 10 公分——官方寫的是距離，不是角度，也不是我平常點頭的幅度。", mood: "bow", href: "#intro" },
  { text: "<b>基本體</b>是 4 種姿勢加 8 種動作，審查學科也會考。", mood: "think", href: "#kihontai" },
  { text: "一手是兩支箭：先射<b>甲矢</b>，再射<b>乙矢</b>。去看看坐射一手的完整流程。", mood: "happy", href: "#flow" },
  { text: "審查的弦音接力（3 番以後）：聽前兩人的弦音起身，聽前一人的弦音取懸け。", mood: "focus", href: "#shinsa" },
  { text: "<b>矢取り</b>的口令各道場不同，同一本指導書裡就有三種版本。實際做法請以指導者為準。", mood: "think", href: "#dojo" },
  { text: "赤旗掛出時不取懸け，也絕不進矢道。實際做法請以指導者為準。", mood: "focus", href: "#safety" },
  { text: "斷弦、筈こぼれ、掉弓都算<b>失</b>，處理得好不好也是體配的一部分。實際做法請以指導者為準。", mood: "oops", href: "#safety" },
  { text: "不跨過地上的弓具。指導書沒寫理由，從安全與保護器材來理解比較穩妥。", mood: "bow", href: "#dojo" },
];

export default TIPS;
