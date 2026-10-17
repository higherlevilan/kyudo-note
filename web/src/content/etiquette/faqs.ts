// 禮法與體配的常見問題。也會被「問題研究中心」(/faq/) 匯入，所以每題都有 topic。

import type { Faq } from "../types";
import { ANKF, BUDOKAN, ET, TAIWAN } from "./sources";

export const ETIQUETTE_FAQS: Faq[] = [
  {
    topic: "禮法",
    q: "揖和禮差在哪裡？",
    a: [
      { text: "揖（ゆう）是輕禮：上半身前屈約 10 公分。射場進退與本座最常用。", tag: "official", src: [ANKF.terminology] },
      { text: "禮是深禮：立禮約前屈 45 度、雙手指尖到膝頭。競技時 1 番在入場口行礼，2 番以後行揖。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5, ANKF.playRules] },
      { text: "常聽到的「揖約 15 度」沒有官方出處。", tag: "folk" },
    ],
  },
  {
    topic: "禮法",
    q: "膝蓋不好、沒辦法正坐或跪坐，還能學弓道嗎？",
    a: [
      { text: "可以。指導書建議無法正坐的人站在最後一排改行立禮，並要求指導者顧及這些學生。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
      { text: "坐射有困難時，競技可依手續改用立射；全弓連的中央審查也有立射受審申請。", tag: "official", src: [ANKF.playRules, ET.documents] },
      { text: "具體怎麼調整，請先跟道場的老師說明自己的狀況。", tag: "note" },
    ],
  },
  {
    topic: "審查",
    q: "審查時，我什麼時候該站起來、什麼時候扣弦？",
    a: [
      { text: "5 人立的口訣：聽前兩人的弦音起身，聽前一人的弦音取懸け。1 番不間斷直接行射；2 番在 1 番胴造り快結束時起身。", tag: "official", src: [ANKF.probationGyosha] },
      { text: "本頁的「審查」段落有完整的表，可以選自己的位置查看每一個信號。", tag: "note" },
    ],
  },
  {
    topic: "審查",
    q: "審查是怎麼評體配的？有扣分表嗎？",
    a: [
      { text: "審查統一基準在每個段級都有體配欄，例如弐段要求「執弓の姿勢、矢番え、足の運び」幾乎確實，四段包含「失的處理」。", tag: "official", src: [ANKF.probationStandard] },
      { text: "審查是依這些項目綜合評價，沒有公開的扣分表。網路上流傳的「扣分項目」是指導經驗，不是官方規定。", tag: "official", src: [ANKF.probationStandard] },
    ],
  },
  {
    topic: "道場禮儀",
    q: "取箭（矢取り）要喊什麼？",
    a: [
      { text: "最常見的核心用語是射場喊「矢取り（お願いします）」、靶場回「入ります」，再掛出赤旗。", tag: "guide", src: [BUDOKAN.ch2] },
      { text: "完整的對答各道場不同；臺灣藏月弓道場有自己的流程。請以所屬道場的規定為準。", tag: "local", src: [TAIWAN.regulations] },
    ],
  },
  {
    topic: "道場禮儀",
    q: "為什麼不能跨過地上的弓？",
    a: [
      { text: "「不跨越弓具」寫在指導書的安全注意事項裡，但沒有寫理由。", tag: "guide", src: [BUDOKAN.ch5] },
      { text: "「弓有靈性、跨弓不敬」屬坊間說法；從避免踩到、絆倒、損壞弓來理解比較穩妥。", tag: "folk" },
    ],
  },
  {
    topic: "道場禮儀",
    q: "神棚要怎麼拜？要拍手嗎？",
    a: [
      { text: "指導書寫「拝礼の仕方は各道場の作法による」：依各道場的作法，沒有統一規定。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "二禮二拍手一拜是神社或部分道場的做法，不是弓道的規定。", tag: "disputed" },
    ],
  },
  {
    topic: "服裝",
    q: "第一次去上課要穿什麼？",
    a: [
      { text: "臺灣弓道協會的弓道教室：初級可穿深色運動長褲、白色或淺色上衣；不可穿無袖上衣與有扣子的襯衫。", tag: "local", src: [ET.twQna] },
      { text: "全弓連：體驗、見學時穿運動服、襪子或足袋，方便活動即可。", tag: "official", src: [ET.begin] },
      { text: "長髮綁起，不用髮夾。", tag: "guide", src: [BUDOKAN.ch2] },
    ],
  },
  {
    topic: "服裝",
    q: "幾段開始要穿和服審查？",
    a: [
      { text: "審查規程：教士、錬士與五段以上穿和服，其他原則上穿弓道衣。", tag: "official", src: [ANKF.probationRules] },
      { text: "五段的體配基準也包含「和服着用、肌脱ぎ又は襷さばき（坐射）の実施」。", tag: "official", src: [ANKF.probationStandard] },
    ],
  },
  {
    topic: "基本體",
    q: "武射系和禮射系該選哪一種？",
    a: [
      { text: "兩種持箭方式指導書都有寫，沒有優劣；差別在持箭、足踏み（二足／一足）與送箭（二度送り／一度送り）。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "宮崎縣手冊明寫「哪一種都可以，但不能混用」。請照所屬道場的教法。", tag: "local", src: [ET.miyazaki] },
    ],
  },
  {
    topic: "安全",
    q: "射的時候箭掉了，怎麼辦？",
    a: [
      { text: "甲矢掉落：當場跪坐撿起，與乙矢對齊，回到射位後向正面揖表示歉意，把箭放在右膝旁。乙矢掉落：撿起回到射位，揖後退場。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "搭好箭之後筈脫落就算「失」，不重射。本頁的「安全與失」有完整的處理表。", tag: "guide", src: [BUDOKAN.ch4] },
    ],
  },
  {
    topic: "安全",
    q: "看到紅旗（赤旗）要做什麼？",
    a: [
      { text: "赤旗代表有人在靶前或矢道上。競技規則規定行射中掛出赤旗時，必須安全而迅速地中斷行射；赤旗掛出期間不得行射。", tag: "official", src: [ANKF.playRules] },
      { text: "指導書：赤旗掛出期間不得取懸け。", tag: "guide", src: [BUDOKAN.ch4] },
    ],
  },
];
