// 坐射一手（甲矢＋乙矢）的完整流程，給互動步驟器使用。
// 依 docs/research/03 §2.4、§2.5、§3.2、§6.13。呼吸節奏只有入退場口與本座的揖有官方息數；
// 其餘【製】的秒數與息數一律標為「本站整理」，不是規定。

import type { Point } from "../types";
import { ANKF, BUDOKAN, ET } from "./sources";

export interface FlowStep {
  id: string;
  title: string;
  ja: string;
  kana?: string;
  /** 要做什麼 */
  actions: Point[];
  /** 呼吸與節奏 */
  breath: Point;
  /** 審查（5 人立）時的時機 */
  cue?: Point;
  /** 常見問題 */
  watch?: string[];
  link?: { href: string; label: string };
}

export const ZASHA_FLOW: FlowStep[] = [
  {
    id: "nyujo",
    title: "入場口：留意上座，行禮",
    ja: "入場",
    kana: "にゅうじょう",
    actions: [
      { text: "在入場口一定要「上座に意を注ぎ」（留意上座的方向）。", tag: "official", src: [ANKF.playRules, ANKF.probationGyosha] },
      { text: "競技規則：1 番（大前）行礼，2 番以後行揖。", tag: "official", src: [ANKF.playRules] },
      { text: "宮崎縣手冊（1 番）：左腳先入場，右腳朝上座踏出、左腳併攏後行深禮，再朝的正面直走；2 番以後入場後行揖。", tag: "local", src: [ET.miyazaki] },
      { text: "上座不在一般位置時（例如在出入口那一側），入退場路線也會跟著改變。", tag: "local", src: [ET.tokai] },
      { text: "1 番的礼，指導書補充為三息；競技規則沒寫息數。", tag: "guide", src: [BUDOKAN.ch4] },
    ],
    breath: { text: "揖為二息（競技規則）；1 番的礼的息數見上方指導書的補充。", tag: "official", src: [ANKF.playRules] },
    cue: { text: "下一組（次の控え）在 3 番的乙矢弦音時入場。", tag: "official", src: [ANKF.probationGyosha] },
  },
  {
    id: "to-honza",
    title: "以すり足走到本座",
    ja: "本座へ",
    kana: "ほんざへ",
    actions: [
      { text: "保持執弓の姿勢，腳底貼地滑步（すり足），不讓後方看到腳底，以腰為軸。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "末弭離地約 10 公分，走路時不上下晃動。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
      { text: "宮崎縣手冊：1 番在本座前直角轉彎；2 番以後用「元禄」（分兩次各轉 45 度）跟上前一人。", tag: "local", src: [ET.miyazaki] },
    ],
    breath: { text: "宮崎縣手冊：入場到本座用「吸氣 2 步、吐氣 2 步」。這是地方做法，全弓連規程沒有寫。", tag: "local", src: [ET.miyazaki] },
    watch: ["腳跟先著地、腳底翻起", "身體上下起伏", "末弭晃動或碰地"],
  },
  {
    id: "honza",
    title: "本座：跪坐，全員一起揖",
    ja: "本座で揃って揖",
    kana: "ほんざでそろってゆう",
    actions: [
      { text: "右腳後退半足，垂直沉下，膝頭對齊本座線跪坐。", tag: "guide", src: [BUDOKAN.ch4, ET.miyazaki] },
      { text: "全員一起揖（揃って揖），然後起身前往射位。", tag: "official", src: [ANKF.playRules, ANKF.probationGyosha] },
      { text: "穿和服受審時：揖後用開き足轉向脇正面，男子肌脫（はだぬぎ，脫下左袖）、女子襷さばき（たすきさばき，以襷綁起袖子），再轉回的正面前往射位。", tag: "official", src: [ANKF.probationGyosha, ANKF.terminology] },
    ],
    breath: { text: "本座的「揃って揖」為三息。", tag: "official", src: [ANKF.playRules] },
    cue: { text: "審查：前一組 5 番（落）的弦音時一起揖；前一組最後的射手後退時，前往射位。", tag: "official", src: [ANKF.probationGyosha] },
    watch: ["揖的時機沒有對齊", "跪坐時臀部懸空或腳背貼地"],
  },
  {
    id: "to-shai",
    title: "起身，三步進到射位",
    ja: "射位へ",
    kana: "しゃいへ",
    actions: [
      { text: "腰を切って起身，左腳先出。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "坐射從本座到射位是 3 步；近的競技的標準距離為 2.0 公尺。", tag: "official", src: [ANKF.terminology, ANKF.playRules] },
      { text: "宮崎縣手冊：第 1 步左腳大步踏出，第 2、3 步跟上，膝頭對齊射位線跪坐。", tag: "local", src: [ET.miyazaki] },
    ],
    breath: { text: "宮崎縣手冊：本座到射位「讓步伐配合呼吸」，沒有規定幾步一息。", tag: "local", src: [ET.miyazaki] },
    watch: ["用手撐膝起身", "不要把「3 步」硬套成固定的公分數"],
  },
  {
    id: "hirakiashi",
    title: "開き足：轉向脇正面",
    ja: "開き足",
    kana: "ひらきあし",
    actions: [
      { text: "在射位跪坐，用開き足轉 90 度，從面向靶（的正面）轉成面向脇正面。", tag: "official", src: [ANKF.terminology, ANKF.probationGyosha] },
      { text: "轉完後，靶在自己的左側。", tag: "note" },
      { text: "腳步細節（先動哪隻腳、膝蓋何時離地）沒有可引用的一手文字，請跟老師學。", tag: "disputed" },
    ],
    breath: { text: "約一息完成。（本站整理，不是規定）", tag: "note" },
    watch: ["轉超過或不到 90 度", "身體高度大起大落", "轉完膝頭沒對齊射位線"],
  },
  {
    id: "yatsugae",
    title: "立弓・矢番え（甲矢）",
    ja: "弓を立て、矢を番える",
    kana: "ゆみをたて、やをつがえる",
    actions: [
      { text: "弓立在身體中央（此時弦在左側），把弦轉到右側。弓立在中央時，弦對著鼻樑的線。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "拿箭的右手從弓的外側疊到左手稍左處，分辨甲矢、乙矢（指導書稱為「組む・見る・取る」）。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "甲矢（はや）夾在左手食指與中指之間，送箭後把筈搭上弦；乙矢（おとや）留在右手，稱為取矢（とりや）。", tag: "guide", src: [BUDOKAN.ch4, ANKF.terminology] },
      { text: "甲矢與乙矢平行、箭與弦成直角，右手放回腰部。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "送箭方式依持箭系統而不同（一度送り／二度送り），選定一種就不要混用。", tag: "local", src: [ET.miyazaki] },
    ],
    breath: { text: "沒有官方息數。本站粗估每個小動作約一息，整段約 6 息。（本站整理，不是規定）", tag: "note" },
    watch: ["搭箭位置太低（離れ時可能傷到拇指）", "甲矢、乙矢的羽毛方向弄反", "弓沒有立在身體中央"],
  },
  {
    id: "tatsu",
    title: "起身（箭與眼同高）",
    ja: "立つ",
    kana: "たつ",
    actions: [
      { text: "右手護住已搭上的箭的筈，一邊腰を切る一邊起身，弓保持在箭與眼同高的位置。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "站起後進入射法八節的足踏み。", tag: "note" },
    ],
    breath: { text: "指導書：立ち方要配合呼吸（息合い）。秒數沒有規定。", tag: "guide", src: [BUDOKAN.ch6] },
    cue: { text: "審查（甲矢）：1 番不間斷直接行射；2 番在 1 番胴造り快結束時起身；3 番以後聽「前兩人」的弦音起身。", tag: "official", src: [ANKF.probationGyosha] },
    watch: ["起身前上半身前傾", "弓先往上抬或晃動"],
  },
  {
    id: "haya",
    title: "射甲矢（射法八節）",
    ja: "甲矢の行射",
    kana: "はやのぎょうしゃ",
    actions: [
      { text: "依射法八節行射：足踏み、胴造り、弓構え、打起し、引分け、会、離れ、残心。", tag: "official", src: [ANKF.syaho] },
      { text: "團體行射時，前後動作不要刻意拖延（間延び）。", tag: "official", src: [ANKF.probationGyosha, ANKF.playRules] },
    ],
    breath: { text: "射法本身的呼吸請見射法八節頁。", tag: "note" },
    cue: { text: "審查：2 番以後聽「前一人」的弦音取懸け（扣弦）、打起し。", tag: "official", src: [ANKF.probationGyosha] },
    link: { href: "/shaho/", label: "射法八節的圖解" },
  },
  {
    id: "yudaoshi",
    title: "弓倒し → 物見返し → 足閉じ → 跪坐",
    ja: "弓倒し・物見返し",
    kana: "ゆだおし・ものみがえし",
    actions: [
      { text: "弓倒し：離れ之後回到執弓の姿勢。", tag: "official", src: [ANKF.terminology] },
      { text: "宮崎縣手冊：雙拳以最短的直線，同時回到腰骨；末弭不落地。", tag: "local", src: [ET.miyazaki] },
      { text: "物見返し：把朝向靶的臉轉回來。之後合上足踏み，跪坐。", tag: "official", src: [ANKF.terminology] },
      { text: "審查統一基準（初段）列有「弓倒し後の崩れのない姿勢」（弓倒後姿勢不鬆垮）。", tag: "official", src: [ANKF.probationStandard] },
      { text: "足閉じ先動哪隻腳，各來源說法不一。", tag: "disputed" },
    ],
    breath: { text: "沒有官方息數。本站粗估弓倒し一息、物見返し半息到一息、足閉じ一息。（本站整理，不是規定）", tag: "note" },
    watch: ["末弭落地", "雙拳不同時回腰", "弓倒時弓往前大弧度揮出，打到前方射手"],
  },
  {
    id: "otoya",
    title: "乙矢：矢番え → 起身 → 行射",
    ja: "乙矢",
    kana: "おとや",
    actions: [
      { text: "跪坐中搭上乙矢，起身，以同樣方式射乙矢、弓倒し、足閉じ。", tag: "official", src: [ANKF.playRules, ANKF.probationGyosha] },
      { text: "乙矢射完就不再跪坐，準備退場。", tag: "note" },
    ],
    breath: { text: "與甲矢相同，依各人呼吸，不搶不拖。", tag: "note" },
    cue: {
      text: "審查：1～3 番聽 4 番的弦音、4 番聽 5 番的弦音開始搭乙矢，5 番射完甲矢立刻搭；1 番聽 5 番的弦音起身，之後同樣「前兩人起身、前一人取懸け」。",
      tag: "official",
      src: [ANKF.probationGyosha],
    },
  },
  {
    id: "taijo",
    title: "退場：留意上座，行揖",
    ja: "退場",
    kana: "たいじょう",
    actions: [
      { text: "射完後，從 1 番開始依序退場。", tag: "official", src: [ANKF.probationGyosha, ANKF.playRules] },
      { text: "宮崎縣手冊：1～4 番射完不行揖、礼，直接往右斜前方退出，不走在射位線上，也不讓袴碰到下一組 1 番的弓。", tag: "local", src: [ET.miyazaki] },
      { text: "在退場口一定要留意上座，行揖。", tag: "official", src: [ANKF.playRules, ANKF.probationGyosha] },
    ],
    breath: { text: "退場口的揖為二息。", tag: "official", src: [ANKF.playRules] },
  },
];
