// 裝備百科 content. Paraphrased from docs/research/04 第 1 章、第 9 章；每一條都標來源與性質。
// 練習、審查、台灣購買管道屬於 /guide，這裡只放和器材本身有關的內容。

import type { Point } from "@/content/types";
import type { EqTable, EqTopic } from "./types";
import { ANKF, BUDOKAN, BUDOKAN_EQ, FOLK, RULES, SHOP, TAIWAN, TAIWAN_EQ } from "./sources";

/* ───────────────────────── 入門：先借再買 ───────────────────────── */

export const BORROW_FIRST: Point[] = [
  { text: "全弓連說，初學者多半可以使用道場的器材，基本上不用花錢，進步之後再慢慢備齊。", tag: "official", src: [ANKF.faq] },
  {
    text: "臺灣弓道協會的弓道教室提供公用的弓、箭、弽（ゆがけ）；學員先自備弽裡面的布手套下がけ（したがけ）、足袋和弓道衣即可。",
    tag: "local",
    src: [TAIWAN.class, TAIWAN_EQ.qna],
  },
  { text: "翠山弓具店也建議：在知道自己適合的弓力之前，先借道場的弓。", tag: "shop", src: [SHOP.suizanPrice, SHOP.suizanBeginnerYumi] },
];

export const BUYING_ORDER = {
  suizan: {
    who: "翠山弓具店",
    src: [SHOP.suizanOrder, SHOP.suizanPrice],
    steps: [
      { title: "弓道衣、弽", text: "鹿皮弽需要時間磨合，早買早適應。" },
      { title: "矢", text: "開始對靶練習（的前）時買。射壞借來的箭可能要賠，自己買通常比較省。" },
      { title: "弓", text: "大約學 1 年後再買，也有人借 2〜3 年。" },
    ],
  },
  heian: {
    who: "東山堂平安弓具",
    src: [SHOP.heianBeginner],
    steps: [
      { title: "道衣", text: "最先買。" },
      { title: "弽", text: "開始學「數ヶ月〜半年」後再買。保養得好，用 10 年以上也不稀奇。" },
      { title: "弓、矢", text: "等射形穩定後再買。" },
    ],
  },
};

export const BEFORE_BUYING: Point[] = [
  { text: "弓力寧弱勿強：全弓連說初學者要從弱的弓開始。", tag: "official", src: [ANKF.faq, ANKF.tool] },
  { text: "先量矢束，再決定箭長和弓長（下方計算器）。不可以選比自己拉距短的弓。", tag: "shop", src: [SHOP.suizanYumi, SHOP.sambuQA] },
  { text: "箭是依指定長度切割、裝上箭頭的，買了通常不能退換。", tag: "shop", src: [SHOP.sambuYa] },
  { text: "兩家店對「弽什麼時候買」的建議不同（翠山：最先；平安：幾個月後）。請以所屬道場指導者的意見為準。", tag: "note" },
];

/* ───────────────────────── 量矢束 ───────────────────────── */

export const MEASURE_STEPS: Point[] = [
  { text: "站直，左臂抬到與肩同高，水平伸直。", tag: "shop", src: [SHOP.suizanYa, SHOP.heian1913] },
  { text: "從喉嚨中心（喉の中心）量到左手中指的指尖。全弓連寫的是「自分の喉もとからまっすぐに伸ばした左腕の、中指の指先まで」。", tag: "official", src: [ANKF.tool] },
  { text: "全弓連與《弓道教本》（經指導書引用）都說矢束由手臂長度決定，不是由身高決定。", tag: "official", src: [ANKF.tool, BUDOKAN.ch3] },
  { text: "山武弓具店英文頁有一處寫成量到「身體中心」，起點和其他來源不同。", tag: "disputed", src: [SHOP.sambuQA, SHOP.sambuVocab] },
  { text: "量的時候請別人拿捲尺，自己保持姿勢，比較準。", tag: "note" },
];

/* ───────────────────────── 弓 ───────────────────────── */

export const BOW_TYPES_TABLE: EqTable = {
  caption: "弓的長度種類",
  head: ["名稱", "尺寸", "約 cm"],
  rows: [
    { cells: ["三寸詰（さんずんづまり）", "七尺", "212"], tag: "shop", src: [SHOP.koyamaSeiho, SHOP.suizanYumi, SHOP.ikeda, SHOP.sambuQA] },
    { cells: ["並寸（なみすん）", "七尺三寸", "221（規則的標準）"], tag: "official", src: [ANKF.playRules, ANKF.tool] },
    { cells: ["二寸伸（にすんのび）", "七尺五寸", "227"], tag: "shop", src: [SHOP.suizanYumi, SHOP.ikeda] },
    { cells: ["三寸伸（さんずんのび）", "七尺六寸", "230（只有翠山列出）"], tag: "shop", src: [SHOP.suizanYumi] },
    { cells: ["四寸伸（よんすんのび）", "七尺七寸", "233"], tag: "shop", src: [SHOP.suizanYumi, SHOP.ikeda] },
    { cells: ["六寸伸（ろくすんのび）", "七尺九寸", "約 239（依 1 寸≈3.03cm 推算，未找到店家標示）"], tag: "disputed", src: [SHOP.koyamaSeiho] },
  ],
  notes: [{ text: "1 尺＝10 寸，1 寸≈3.03cm：二寸伸約 +6cm、四寸伸約 +12cm、三寸詰約 −9cm，和全弓連頁面寫的「3寸詰まり：約9cm短／4寸伸び：約12cm伸び」一致。", tag: "official", src: [ANKF.tool] }],
};

export const BOW_POWER_TABLE: EqTable = {
  caption: "弓力的數字（弓具店與坊間）",
  head: ["對象", "數值"],
  rows: [
    { cells: ["初學者（未滿 1 年）男", "11〜12kg"], tag: "shop", src: [SHOP.suizanMatch] },
    { cells: ["初學者（未滿 1 年）女", "8〜10kg"], tag: "shop", src: [SHOP.suizanMatch] },
    { cells: ["初學者（不分性別）", "約 6〜10kg 起步，基本穩定後升到 10kg 以上"], tag: "shop", src: [SHOP.sambuQA] },
    { cells: ["高中男生", "10〜14kg"], tag: "shop", src: [SHOP.suizanMatch] },
    { cells: ["高中女生", "10〜12kg"], tag: "shop", src: [SHOP.suizanMatch] },
    { cells: ["初學者", "12〜14kg；「拉 10 次就累」代表太強"], tag: "folk" },
    { cells: ["中學生、高齡者", "沒有查到具體數字"], tag: "disputed" },
  ],
};

export const MATERIAL_TABLE: EqTable = {
  caption: "竹弓、グラス弓、カーボン弓比較",
  head: ["項目", "グラス弓（玻璃纖維弓）", "カーボン弓（碳纖維弓）", "竹弓（たけゆみ）／カーボン入り竹弓"],
  rows: [
    {
      cells: ["構造", "木芯外貼玻璃纖維", "多為玻纖＋碳纖；例如直心Ⅱカーボン是在三層木芯外包三層碳纖維片", "竹約佔七成、側面用木材；也有用碳纖維當芯材的カーボン入り"],
      tag: "shop",
      src: [SHOP.suizanTypes, SHOP.koyamaCarbon, SHOP.suizanYumi],
    },
    {
      cells: ["優點", "能量產、耐久、保養簡單；不怕溫濕度變化；弓力基本上不會掉", "比玻纖更有彈力、箭飛得更遠，本體較輕", "全天然材料的傳統弓；越用越貼合射手（「育てて頂いた程、射手に馴染みます」）"],
      tag: "shop",
      src: [SHOP.suizanBeginnerYumi, SHOP.suizanTypes, SHOP.yokoyama],
    },
    {
      cells: ["缺點", "從玻纖改用竹弓時，有人不容易適應", "價格比玻纖高", "個體差異大、弓力隨季節變化（愛用者常備 4〜5 張輪替）；怕濕、怕熱，需要張り込み"],
      tag: "shop",
      src: [SHOP.suizanTypes, SHOP.suizanBeginnerYumi, SHOP.yamaguchiCare, SHOP.yokoyama],
    },
    {
      cells: ["店家建議的對象", "初學者", "學生、中級者（小山把直心Ⅱカーボン定位為上級者向け）", "準備升段的人；常見是 3〜4 段才買竹弓"],
      tag: "shop",
      src: [SHOP.suizanBeginnerYumi, SHOP.suizanOrder, SHOP.koyamaCarbon, SHOP.suizanTypes],
    },
    {
      cells: ["價格帶（日幣含稅起價）", "翠山行情 3〜4 萬；山武 2〜5 萬（27,500 起）；小山 練心 30,800〜、直心Ⅰ 40,700〜、直心Ⅱ 51,700〜", "山武 5〜10 萬（56,100 起）；小山 直心Ⅱカーボン 62,700〜、鵠心 アーチカーボン 99,000〜", "山武 10 萬以上；小山 清芳 前焦竹 119,900〜、清芳 前煤竹 139,700〜（一覽頁沒有逐一註明材質 ⚠️）"],
      tag: "shop",
      src: [SHOP.suizanPrice, SHOP.sambuQA, SHOP.koyamaBows],
    },
  ],
  notes: [{ text: "價格是 2026-10-17 店家網頁上的含稅起價，會隨弓力、選配與時間變動。", tag: "note" }],
};

export const BOW_RULES_TABLE: EqTable = {
  caption: "比賽與審查能不能用合成弓",
  head: ["場合", "規定"],
  rows: [
    { cells: ["全弓連競技（一般大會）", "競技規則第 20 條明文允許竹、木或新素材（玻纖、碳纖等）；各競技可在大會要項另行規定"], tag: "official", src: [ANKF.playRules] },
    { cells: ["高體連大會", "第 13 條同樣允許新素材"], tag: "official", src: [RULES.koutairen] },
    { cells: ["段位、稱號審查", "《審査規程》全文檢索沒有找到弓材質的規定；第 28 條只規定服裝。「沒有限制」是依檢索結果推論"], tag: "disputed", src: [ANKF.probationRules] },
    { cells: ["天皇盃・皇后盃", "大會要項規定使用竹弓、竹矢"], tag: "official", src: [RULES.tennohai] },
    { cells: ["全日本遠的選手権", "大會要項規定「弓は竹弓とする」"], tag: "official", src: [RULES.enteki] },
    { cells: ["坊間觀念", "翠山：教本的基準以竹弓為前提，想升段最好早點習慣竹弓；山武：碳纖弓適合審查與大會。屬觀念，不是條文"], tag: "disputed", src: [SHOP.suizanTypes, SHOP.sambuQA] },
  ],
};

export const YUMI_TOPICS: EqTopic[] = [
  {
    id: "yumi-length",
    title: "弓長",
    ja: "並寸・伸寸・詰",
    kana: "なみすん・のびすん・つまり",
    intro: [
      {
        text: "《弓道競技規則》只說弓長「以 221cm（七尺三寸，並寸）為標準，允許若干長短」，沒有給身高或矢束的對照表。比並寸長的叫伸寸（のびすん），短的叫詰（つまり）。",
        tag: "official",
        src: [ANKF.playRules, ANKF.tool],
      },
      { text: "依矢束選弓長的對照表全部來自弓具店，各店分界不同——上方計算器把它們並列。", tag: "shop", src: [SHOP.suizanYumi, SHOP.yokoyama, SHOP.sambuQA] },
    ],
    introTables: [BOW_TYPES_TABLE],
    deep: [
      {
        title: "規則的細節",
        points: [
          { text: "第 20 條旁註舉出現在有「6cm〜18cm 伸」與「3cm〜12cm 詰」的弓，所以允許長短。另規定握把約在從本弭（もとはず，弓下端）算起 1/3 處、矢摺籐 6cm 以上、不得有瞄準裝置或刻意記號。", tag: "official", src: [ANKF.playRules] },
          { text: "旁註也希望弓、箭桿、羽、弦、弽的顏色維持傳統、不要花俏。", tag: "official", src: [ANKF.playRules] },
        ],
      },
      {
        title: "為什麼不能隨便選",
        points: [
          { text: "弓太長，箭勢會受影響；弓太短，可能把弓拉壞。", tag: "shop", src: [SHOP.suizanYumi, SHOP.sambuQA] },
          { text: "不搭箭就把弓拉到接近矢束再放手（空放），弓可能損壞。素引き之後要慢慢放回。", tag: "official", src: [ANKF.tool, BUDOKAN.ch2] },
          { text: "宮川弓具（只讀到搜尋摘要）：矢束 90cm 以上大致選伸弓；グラス・カーボン弓就算矢束稍長，用並寸也可以。", tag: "disputed" },
          { text: "比較網站常以「身高 170cm」作並寸／伸寸的分界，也有「155 以下三寸詰、180 以上四寸伸」的說法，出處都是搜尋摘要。", tag: "folk" },
        ],
      },
    ],
  },
  {
    id: "yumi-power",
    title: "弓力",
    ja: "弓力",
    kana: "きゅうりょく",
    intro: [
      {
        text: "全弓連的原則：適合自己的弓力，是自己能肩入れ（かたいれ：不搭箭拉弓測弓力、或暖肩時拉弓）的弓力的 1/2；初學時用 1/3〜1/4。",
        tag: "official",
        src: [ANKF.tool, ANKF.terminology],
      },
      { text: "例：勉強能肩入れ 30kg 的人，標準約 15kg，初學時約 7.5〜10kg。不過「能肩入れ的最大弓力」怎麼測，官方沒有說明，實務上多由指導者判斷。", tag: "note", src: [ANKF.tool] },
      { text: "弓具店另有具體數字（下表），但這些是店家建議，不是規則。", tag: "shop" },
    ],
    introTables: [BOW_POWER_TABLE],
    deep: [
      {
        title: "店家的估算公式（不宜直接拿來買弓）",
        points: [
          { text: "翠山：體重 × 1/3 × 70〜80%，或握力 × 1/2 × 70〜80%，店家自稱「只是粗略的目標」。", tag: "shop", src: [SHOP.suizanMatch] },
          { text: "以體重 60kg 或握力 40kg 算，都得到 14〜16kg，明顯高於同一家店給初學男性的 11〜12kg，比較像有經驗者的上限。", tag: "disputed", src: [SHOP.suizanMatch] },
          { text: "翠山也提醒：指導者的標準常以天天練習的人為前提，不一定適合每週練 1〜2 次的人。", tag: "shop", src: [SHOP.suizanMatch] },
        ],
      },
      {
        title: "弓上的 kg 是在幾 cm 量的",
        points: [
          { text: "小山弓具：「七尺・並寸は85cm、二寸伸は90cm、四寸伸は95cm、六寸伸は100cm引き」的弓力表示。弓師永野一萃的箭重表也用同樣前提。", tag: "shop", src: [SHOP.koyamaCarbon, SHOP.koyamaSeiho, SHOP.issuiWeight] },
          { text: "所以實際拉得比標準短，感受到的負荷會比標示輕；拉得長則更重。弓師舉例：標 15kg 的二寸伸，用並寸的矢束拉只有不到 14kg。每 1cm 差多少因弓而異，沒有通用數字。", tag: "shop", src: [SHOP.issuiLength] },
          { text: "全弓連只說「以 kg 表示」，沒有規定測定拉距；85／90／95cm 是否全業界統一，只確認了兩家。", tag: "disputed", src: [ANKF.tool] },
        ],
      },
      {
        title: "公差與衰減",
        points: [
          { text: "訂製公差：小山的玻纖、碳纖弓為訂購弓力 −0.5〜+1.5kg；碳芯竹弓 −1〜+1.5kg。", tag: "shop", src: [SHOP.koyamaJikishin2, SHOP.koyamaCarbon, SHOP.koyamaSeiho] },
          { text: "使用後衰減：竹弓約 1〜2kg、合成弓約 0.5kg（翠山）；橫山黎明說竹弓開始用後約弱 1kg，建議選比目標強 1〜2kg 的，也有因環境衰減 3kg 以上的例子。", tag: "shop", src: [SHOP.suizanYumi, SHOP.yokoyama] },
          { text: "小山部分弓款：並寸 19kg 以上、二寸伸／四寸伸 21kg 以上，定價加 2 成。", tag: "shop", src: [SHOP.koyamaCarbon, SHOP.koyamaJikishin2] },
          { text: "舊式竹弓有用弓身厚度「分・厘」表示強度的說法，但部落格與論壇的例子互相矛盾，無法換算成 kg，只當歷史上的表示法。", tag: "folk" },
        ],
      },
      {
        title: "買弓前",
        points: [
          { text: "先量自己現在用的弓的弓力再買；拉起來的手感（引き心地）最重要，最好試素引き（すびき：不搭箭空拉）。", tag: "shop", src: [SHOP.suizanYumi, SHOP.yokoyama] },
        ],
      },
    ],
  },
  {
    id: "yumi-material",
    title: "弓材",
    ja: "竹弓・グラス・カーボン",
    intro: [
      { text: "初學者的弓，店家普遍建議グラス弓（玻璃纖維弓）或カーボン弓（碳纖維弓）：保養簡單、不怕溫濕度變化。竹弓留到升段、熟練後再考慮。", tag: "shop", src: [SHOP.suizanBeginnerYumi, SHOP.suizanTypes, SHOP.sambuQA] },
      { text: "競技規則允許合成弓參加一般大會；但天皇盃、遠的選手権等個別大會要項規定要用竹弓。", tag: "official", src: [ANKF.playRules, RULES.tennohai, RULES.enteki] },
      { text: "審查方面，《審査規程》檢索不到弓材質的規定，所以「審查沒有材質限制」是推論；「升段要用竹弓」是傳統觀念，不是條文。", tag: "disputed", src: [ANKF.probationRules] },
    ],
    introTables: [MATERIAL_TABLE],
    deep: [
      { title: "比賽與審查", table: BOW_RULES_TABLE },
      {
        title: "品牌補充",
        points: [
          { text: "直心（じきしん）是小山弓具的品牌，有Ⅰ、Ⅱ、Ⅲ等型號；Ⅰ代カーボン已停產。「直心Ⅲバンブー」從名稱看不出是竹弓還是竹紋外觀的合成弓，待查。", tag: "disputed", src: [SHOP.koyamaBows] },
        ],
      },
    ],
  },
];

/* ───────────────────────── 矢 ───────────────────────── */

export const SHAFT_TABLE: EqTable = {
  caption: "ジュラルミン（硬鋁）箭桿規格 × 適用弓力（各店並列）",
  head: ["規格", "外徑", "重量（每 100cm 桿身）", "山武 近的", "山武 遠的", "やまぐち 參考", "平安", "翠山"],
  rows: [
    { cells: ["1813", "7.15mm", "約 20.0g", "9kg 以下", "12kg 以下", "11kg 以下", "—", "—"], tag: "shop", src: [SHOP.sambuYa, SHOP.yamaguchiShaft] },
    { cells: ["1913", "7.5mm", "約 21.2g（平安 22.0）", "10〜13kg", "13〜16kg", "11〜14kg", "10〜13kg（初級）", "8〜13kg／約 8〜12kg／14kg 以下"], tag: "shop", src: [SHOP.sambuYa, SHOP.yamaguchiShaft, SHOP.heian1913, SHOP.suizanYa, SHOP.suizanEn, SHOP.suizanBeginnerYa] },
    { cells: ["1914", "7.5mm", "約 23.0g", "12〜15kg", "14〜16kg", "—", "—", "—"], tag: "shop", src: [SHOP.sambuYa] },
    { cells: ["2014", "8.0mm", "約 23.7g（平安 24.5）", "13〜16kg", "16kg 以上", "13〜16kg", "14〜16kg（中級）", "—"], tag: "shop", src: [SHOP.sambuYa, SHOP.yamaguchiShaft, SHOP.heian1913] },
    { cells: ["2015", "8.0mm", "約 25.7g（平安 25.5）", "13〜18kg", "18kg 以上", "15〜19kg", "16〜20kg（上級）", "約 12〜17kg；有段者、男性"], tag: "shop", src: [SHOP.sambuYa, SHOP.yamaguchiShaft, SHOP.heian1913, SHOP.suizanEn, SHOP.suizanYa] },
    { cells: ["2114", "8.35mm", "約 25.0g", "15kg 以上", "—", "—", "—", "—"], tag: "shop", src: [SHOP.sambuYa] },
    { cells: ["2115", "8.35mm", "約 27.0g（やまぐち 25）⚠️", "16kg 以上", "—", "18〜21kg", "—", "—"], tag: "shop", src: [SHOP.sambuYa, SHOP.yamaguchiShaft] },
    { cells: ["2117", "8.5mm", "約 30.5g", "20kg 以上", "—", "—", "—", "—"], tag: "shop", src: [SHOP.sambuYa] },
  ],
  notes: [
    { text: "同一規格各店的適用弓力差了好幾公斤（例如 2015：山武 13〜18、翠山約 12〜17、平安 16〜20）。請以你購買的店家表格為準。", tag: "disputed" },
    { text: "やまぐち：參考弓力依矢尺不同而異，成品箭要再加約 5g。平安：長度每增減 5cm，重量約 ±1〜2g；裝上羽、筈、箭頭約 +4g。", tag: "shop", src: [SHOP.yamaguchiShaft, SHOP.heian1913] },
  ],
};

export const ARROW_WEIGHT_TABLE: EqTable = {
  caption: "成品箭重量 × 弓力",
  head: ["弓力", "翠山（近的 28m 參考）", "永野一萃（一翠弓、吟翠弓用）"],
  rows: [
    { cells: ["10kg", "10〜11kg：約 23g", "22g"] },
    { cells: ["12kg", "12〜14kg：約 25g", "24g"] },
    { cells: ["14kg", "（同上）", "26g"] },
    { cells: ["15kg", "15〜17kg：約 28g", "27g"] },
    { cells: ["16〜17kg", "（同上）", "28g"] },
    { cells: ["18kg", "18〜20kg：約 30g", "30g（8 匁）"] },
    { cells: ["20kg", "（同上）", "31g"] },
    { cells: ["21〜23kg", "—", "33g"] },
    { cells: ["24kg", "—", "36g"] },
    { cells: ["25kg 以上", "33g 以上", "—"] },
  ].map((r) => ({ ...r, tag: "shop" as const, src: [SHOP.suizanYa, SHOP.issuiWeight] })),
  notes: [
    { text: "匁（もんめ）是日本傳統重量單位，1 匁＝3.75g。永野一萃的表以並寸 85、二寸伸 90、四寸伸 95cm 的矢束為前提。", tag: "shop", src: [SHOP.issuiWeight] },
  ],
};

export const FEATHER_RULE_TABLE: EqTable = {
  caption: "全弓連〈羽根の使用等に関する早見表〉重點",
  head: ["羽", "持有", "比賽、審查使用", "轉讓、受讓"],
  rows: [
    { cells: ["國內的 オオタカ（蒼鷹）、イヌワシ（金鵰）、クマタカ（鷹鵰）、カンムリワシ（大冠鷲）、オガサワラノスリ", "可", "可（要記入證明書）", "不可"] },
    { cells: ["進口的 オオタカ、イヌワシ、クマタカ、カンムリワシ", "可", "可", "可"] },
    { cells: ["オジロワシ（白尾海鵰）、オオワシ（虎頭海鵰），國內與進口", "可", "不可", "不可"] },
    { cells: ["表上沒有列出的鳥（例如ターキー：火雞）", "可", "可（不必記入證明書）", "可"] },
  ].map((r) => ({ ...r, tag: "official" as const, src: [RULES.feathersChart] })),
};

export const FEATHER_TYPES_TABLE: EqTable = {
  caption: "常見的羽",
  head: ["羽", "說法"],
  rows: [
    { cells: ["ターキー（七面鳥，火雞）", "最便宜，初學者第一組箭幾乎都是它；羽較脆、易損"], tag: "folk", src: [FOLK.chiebukuroFeathers] },
    { cells: ["ターキー（七面鳥，火雞）", "硬鋁箭 6 支一組約 13,000 日圓起"], tag: "shop", src: [SHOP.suizanPrice] },
    { cells: ["黒鷲（くろわし）", "便宜耐用，大學生和射數多的人愛用；回答者說實際是禿鷲類、不屬華盛頓公約對象（物種歸屬待查 ⚠️）。翠山標價 6 支約 22,000 日圓"], tag: "disputed", src: [FOLK.chiebukuroFeathers, SHOP.suizanPrice] },
    { cells: ["白鳥（はくちょう）", "便宜、耐用、羽高低、空氣阻力小，說遠的箭多半用它；白色也適合禮射（是否真為天鵝羽待查 ⚠️）"], tag: "folk", src: [FOLK.chiebukuroFeathers] },
    { cells: ["花白鳥、グース（鵝）", "便宜，但羽軟、耐久性低"], tag: "folk", src: [FOLK.chiebukuroFeathers] },
    { cells: ["猛禽類（鷲、鷹）", "最受喜愛但昂貴，華盛頓公約後流通量大減"], tag: "folk", src: [FOLK.chiebukuroFeathers] },
    { cells: ["猛禽類（鷲、鷹）", "部分種類受全弓連《矢羽の使用に関する準則》管制"], tag: "official", src: [RULES.feathers] },
  ],
};

export const YA_TOPICS: EqTopic[] = [
  {
    id: "ya-rules",
    title: "箭的規定",
    ja: "矢",
    kana: "や",
    intro: [
      { text: "比矢束短、或剛好等於矢束的箭，全弓連禁止在的前（まとまえ：對靶練習）使用。", tag: "official", src: [ANKF.tool] },
      { text: "常見的解釋是：箭太短，拉滿時箭頭會被拉進弓的內側（引き込み：ひきこみ），放箭時可能撞到弓或傷到左手。", tag: "folk", src: [FOLK.datamax] },
      { text: "競技規則：箭長依各自矢束取安全長度；箭桿（箆：の）直徑 6mm 以上；用 3 片鳥羽，並區分甲矢（はや）與乙矢（おとや）。", tag: "official", src: [ANKF.playRules] },
      { text: "一組 4 支（比賽另備預備矢 2 支）；初學時先準備一支打草靶用的巻藁矢（まきわらや）。", tag: "official", src: [ANKF.tool] },
      { text: "弓具店的硬鋁箭通常 6 支一組賣，竹箭 4 支一組。", tag: "shop", src: [SHOP.suizanEn] },
    ],
    deep: [
      {
        title: "的前禁止使用的箭（全弓連）",
        points: [
          { text: "比矢束短或剛好等長的箭。", tag: "official", src: [ANKF.tool] },
          { text: "沒有羽的箭（巻藁用箭，或掉了任何一片羽的箭）。", tag: "official", src: [ANKF.tool] },
          { text: "箭桿裂開或折斷的箭；箭頭（板付：いたつき）脫落的箭。指導書也說箭筈或箭桿有傷的不要用，巻藁用和的前用要分開。", tag: "official", src: [ANKF.tool, BUDOKAN.ch2] },
        ],
      },
      {
        title: "競技規則的其他尺寸",
        points: [
          { text: "羽丈（はたけ，羽長）：近的 13〜15cm、遠的 9〜15cm；羽山（はやま，羽高）5mm 以上；要有本矧、末矧與筈巻。", tag: "official", src: [ANKF.playRules] },
          { text: "筈為埋入式、有筈溝，不得有螢光、發光等功能；板付限平題形、椎実形或圓錐形；不得有標示拉入位置的記號。", tag: "official", src: [ANKF.playRules] },
        ],
      },
      {
        title: "甲矢、乙矢、一手",
        points: [
          { text: "甲矢：先射的箭，羽的正面朝外；乙矢：一手中後射的箭，搭弦時羽的正面朝內；兩支合起來叫一手（ひとて）。", tag: "official", src: [ANKF.terminology] },
          { text: "有些資料用「羽順時針／逆時針旋轉」說明，但從哪一端看各資料寫法不同。本站以全弓連「羽根の表が外向き／内側」的定義為準。", tag: "disputed", src: [SHOP.suizanYa] },
        ],
      },
    ],
  },
  {
    id: "ya-shaft",
    title: "箭桿",
    ja: "箆",
    kana: "の",
    intro: [
      { text: "初學者首選ジュラルミン（硬鋁）箭：耐用、不受溫度影響、便宜。箭是最常耗損的用品，初學者不建議買貴的。", tag: "shop", src: [SHOP.suizanBeginnerYa] },
      { text: "1913 和 2015 要依弓力和矢尺選，不是依性別選：例如拉 14kg 的女性用 2015、矢尺短且弓力約 10kg 的男性用 1913。", tag: "shop", src: [SHOP.suizanYa] },
    ],
    introTables: [SHAFT_TABLE],
    deep: [
      {
        title: "材質",
        points: [
          { text: "カーボン矢（碳纖維箭）：山武的規格號碼，前兩碼大致是外觀粗細（mm×10）、後兩碼大致是重量（g），例如 SST80-24 是 8.0mm、約 23.0g（號碼規則依表格推斷）。", tag: "disputed", src: [SHOP.sambuYa] },
          { text: "竹矢（たけや）：重量和粗細可以自由設定；通常 4 支一組。", tag: "shop", src: [SHOP.suizanEn] },
          { text: "竹矢每支都有個體差。", tag: "folk" },
        ],
      },
      {
        title: "規格號碼怎麼讀",
        points: [
          { text: "美式慣例是「前兩碼＝外徑（1/64 英寸）、後兩碼＝管壁厚度（1/1000 英寸）」，例如 2015＝約 7.94mm、0.38mm，和平安標示的 8.0mm、0.38mm 吻合；但沒有找到 Easton 官方說明，另有「後兩碼是重量」的矛盾說法。", tag: "disputed", src: [SHOP.heian1913] },
          { text: "2016、2018 等規格，這次查詢的店家表格都沒有列出。", tag: "disputed" },
        ],
      },
    ],
  },
  {
    id: "ya-weight",
    title: "箭的重量",
    ja: "矢の重さ",
    kana: "やのおもさ",
    intro: [
      { text: "大致是弓力 10kg 配 22〜23g、15kg 配 27〜28g、18kg 配約 30g（8 匁）。兩份表的數字很接近，但仍是店家與弓師的建議。", tag: "shop", src: [SHOP.suizanYa, SHOP.issuiWeight] },
    ],
    introTables: [ARROW_WEIGHT_TABLE],
    deep: [
      {
        title: "弓師永野一萃（一翠弓、吟翠弓）的主張",
        points: [
          { text: "箭比弓力重，對弓沒有壞處；太輕是弓故障的重要原因。在箭飛得順的範圍內，盡量用重一點的箭。", tag: "shop", src: [SHOP.issuiWeight] },
          { text: "用麻弦時箭重差 1〜2 匁，弦的耐用度就差很多；遠的常用較輕的組合，比較容易出現笄（こうがい：外竹裂開）或弓反轉。", tag: "shop", src: [SHOP.issuiWeight] },
          { text: "論壇常見「箭重（g）≈ 弓力（kg）＋8〜10」的速算法，沒有出處。", tag: "folk" },
        ],
      },
    ],
  },
  {
    id: "ya-hane",
    title: "羽與合法來源",
    ja: "矢羽",
    kana: "やばね",
    intro: [
      { text: "規則要求用鳥羽 3 片，禁用非法捕獲的鳥羽。全弓連《矢羽の使用に関する準則》依日本「種の保存法」與華盛頓公約制定：買或用可能屬於管制稀有動物羽的箭，要確認來源並製作矢羽合法取得證明書（トレーサビリティ証明書），在全弓連及其加盟團體主辦的比賽、審查使用時必須隨身攜帶。", tag: "official", src: [ANKF.playRules, RULES.feathers] },
      { text: "初學者的第一組箭多半是ターキー（火雞）羽。", tag: "folk", src: [FOLK.chiebukuroFeathers] },
      { text: "ターキー羽價格便宜，也不在管制表上。", tag: "shop", src: [SHOP.suizanPrice, RULES.feathersChart] },
    ],
    introTables: [FEATHER_RULE_TABLE],
    deep: [
      { title: "羽的種類（多為坊間說法）", table: FEATHER_TYPES_TABLE },
      {
        title: "跨國攜帶",
        points: [
          { text: "猛禽羽的箭跨國攜帶可能涉及 CITES 或台灣《野生動物保育法》，本研究沒有查到明確規定；買箭宜選火雞等非保育羽。搭機與寄送見入門指南。", tag: "disputed" },
        ],
      },
    ],
  },
];

/* ───────────────────────── 弦 ───────────────────────── */

export const STRING_COMPARE_TABLE: EqTable = {
  caption: "合成弦 vs 麻弦",
  head: ["項目", "合成弦（ごうせいげん）", "麻弦（あさづる）"],
  rows: [
    { cells: ["材質", "ザイロン（Zylon）、テクノーラ（Technora）、アラミド、ケブラー等", "天然麻"], tag: "shop", src: [SHOP.koyamaStrings, SHOP.suizanTsuru] },
    { cells: ["適用的弓", "グラス弓、カーボン弓，部分竹弓（翠山：竹弓請用「合成弦対応構造」的）", "「主に竹弓用」"], tag: "shop", src: [SHOP.koyamaStrings, SHOP.suizanTsuru] },
    { cells: ["對弓的負擔", "弓師永野一萃：吸收不了放箭的衝擊，弓翻轉時弦不斷，衝擊全由弓承受，可能首折れ", "弓力合適的麻弦在弓翻轉時會先斷，能緩衝"], tag: "shop", src: [SHOP.issuiDamage, SHOP.issuiSynth] },
    { cells: ["價格（小山，日幣含稅）", "初音弦 660〜、吟 特作 1,210〜、直心弦 2 條組 1,760〜", "桂 麻弦 2,800、直心麻弦 2 條組 4,620"], tag: "shop", src: [SHOP.koyamaStrings] },
    { cells: ["季節", "—", "冬天等乾燥時期容易斷，建議選稍粗一點的"], tag: "shop", src: [SHOP.koyamaStrings] },
  ],
};

export const STRING_MODELS_TABLE: EqTable = {
  caption: "常見合成弦的粗細與對應弓力（店家標示「僅供參考」）",
  head: ["名稱", "材質", "粗細與弓力", "價格（日幣）"],
  rows: [
    { cells: ["吟 特作", "ザイロン", "1號 〜13kg／2號 14〜17kg／3號 18kg〜", "1,210〜／1 條"], tag: "shop", src: [SHOP.koyamaStrings] },
    { cells: ["響（ひびき）", "合成纖維（偏硬、弦音高）", "翠山：細 〜14kg／太 13〜18kg；山武只標 13kg 以上", "翠山 並寸 2 條 1,870；山武 六寸伸 2 條 2,720"], tag: "shop", src: [SHOP.suizanHibiki, SHOP.sambuHibiki] },
    { cells: ["飛翔弦", "アラミド", "0號 〜12kg／1號 13kg〜／2號 17kg〜／3號 20kg〜", "1,980〜／2 條組"], tag: "shop", src: [SHOP.koyamaStrings] },
    { cells: ["正鵠弦", "ザイロン＋聚酯系化纖", "1號 〜13kg／2號 14〜18kg／3號 19〜22kg／4號 23kg〜", "1,650〜"], tag: "shop", src: [SHOP.koyamaStrings] },
    { cells: ["直心弦", "テクノーラ", "1號 〜11kg／2號 12〜14kg／3號 15〜17kg／4號 18kg〜", "1,760〜／2 條組"], tag: "shop", src: [SHOP.koyamaStrings] },
    { cells: ["直心Ⅱ・R・令和弦", "ザイロン", "細 〜14kg／太 15kg〜", "1,210〜2,310"], tag: "shop", src: [SHOP.koyamaStrings] },
    { cells: ["天弓弦 翠", "高強度アラミド", "0號 〜12kg／1號 13kg〜／2號 17kg〜／3號 20kg〜", "1,650〜"], tag: "shop", src: [SHOP.koyamaStrings] },
    { cells: ["初音弦", "ケブラー", "不分粗細（店家說適合第一次買弦或道場公用）", "660〜"], tag: "shop", src: [SHOP.koyamaStrings] },
  ],
  notes: [
    { text: "同樣叫「2號」，不同品牌對應的弓力不一樣（直心弦 2號 12〜14kg、吟 2號 14〜17kg）。合成弦用「號」、麻弦用「匁」標示，數字越大越粗越重。", tag: "shop", src: [SHOP.koyamaStrings, SHOP.zkChoose] },
  ],
};

export const STRING_LIFE_TABLE: EqTable = {
  caption: "什麼時候換弦（說法差很多）",
  head: ["來源", "說法"],
  rows: [
    { cells: ["翠山（弓具店）", "合成弦不要等斷了才換，一般 600〜700 射換；比賽、審查前換新弦，先拉約 100 射再上場；戶外練習受紫外線影響較易斷"], tag: "shop", src: [SHOP.suizanTsuru] },
    { cells: ["永野一萃（弓師）", "麻弦能拉 200〜300 射就算好弦；合成弦拉 1000 射也不斷，但為保護弓，合成弦也以 200〜300 射為準更換"], tag: "shop", src: [SHOP.issuiSynth, SHOP.issuiSynth2] },
    { cells: ["部落格", "學生練得多，約 3 週〜1 個月換一次"], tag: "folk", src: [FOLK.kyudosuki] },
    { cells: ["問答網站（只看了搜尋摘要）", "合成弦壽命 1000〜3000 射"], tag: "folk", src: [FOLK.chiebukuroTsuru] },
  ],
  notes: [{ text: "沒有官方數字。本站建議：看射數，也看外觀——起毛、變細、弦輪變硬就該換。", tag: "note" }],
};

export const NAKAJIKAKE_TABLE: EqTable = {
  caption: "中仕掛的做法：官方與弓具店",
  head: ["項目", "全弓連官網／指導書", "弓具店"],
  rows: [
    { cells: ["麻與黏著劑", "用まぐすね把麻弦摩擦，讓くすね（松脂加油製成的補強材）滲入；用約 15cm 的麻", "合成弦一般用フエキ糊、木工ボンド；弓師建議用乾了還有彈性的黏著劑，防止筈割れ"], tag: "official", src: [ANKF.tool, BUDOKAN_EQ.ch7, SHOP.suizanTsuru, SHOP.issuiSynth2] },
    { cells: ["位置", "從搭箭位置往上 1〜1.5cm 處開始做；搭箭位置太低會傷到左手拇指", "翠山：定在箭與弦呈 90 度的位置"], tag: "official", src: [ANKF.tool, BUDOKAN_EQ.ch7, BUDOKAN.ch2, SHOP.suizanTsuru] },
    { cells: ["長度、形狀", "要纏到和箭筈貼合；指導書圖上標「8〜10㎝」，看不出指哪一段 ⚠️", "翠山：5cm 左右，上粗下細，防止筈こぼれ"], tag: "disputed", src: [BUDOKAN.ch2, BUDOKAN_EQ.ch7, SHOP.suizanTsuru] },
    { cells: ["收尾", "用道宝（どうほう）纏緊", "小山 道宝 660 日圓；七つ道具セット 5,500 日圓"], tag: "official", src: [ANKF.tool, SHOP.koyamaGoods] },
  ],
};

export const TSURU_TOPICS: EqTopic[] = [
  {
    id: "tsuru",
    title: "弦",
    ja: "弦",
    kana: "つる",
    intro: [
      { text: "規則只要求弦撚成一條，材質「麻または新素材などでもよい」，合成弦不被禁止。", tag: "official", src: [ANKF.playRules] },
      { text: "弦長跟弓一致：並寸弓配並寸弦，「並寸用の弦は二寸伸などの弓には合いません」。粗細依弓力選，而且各牌的「號」不同。", tag: "shop", src: [ANKF.tool, SHOP.suizanTsuru] },
      { text: "用玻纖、碳纖弓的初學者用合成弦即可；麻弦主要配竹弓。", tag: "shop", src: [SHOP.koyamaStrings] },
      { text: "預想弦會斷，一定要先做好替弦（かえづる：備用弦），拉過幾射後收進弦巻（つるまき）。", tag: "official", src: [ANKF.tool, ANKF.terminology] },
    ],
    introTables: [STRING_COMPARE_TABLE],
    deep: [
      { title: "常見合成弦", table: STRING_MODELS_TABLE },
      {
        title: "竹弓與合成弦",
        points: [
          { text: "猪飼弓具店建議竹弓用麻弦或偏軟的合成弦，偶爾用麻弦，弦斷時能讓弓恢復彈性。", tag: "shop", src: [SHOP.ikaiTake] },
          { text: "全日本弓道具協會與多位弓師 2025-12-09 聯名：不建議竹弓使用ループ弦（洋弓式固定環弦），造成的損壞不在保固、修理範圍內。", tag: "shop", src: [SHOP.zkLoop] },
        ],
      },
      { title: "換弦時機", table: STRING_LIFE_TABLE },
      {
        title: "弦輪、弓把",
        points: [
          { text: "弓把（ゆみづか：握把到弦的距離）以 15cm 為基準，並調整弦長讓上関板不碰到弦。", tag: "guide", src: [BUDOKAN.ch2] },
          { text: "弦輪（つるわ）有一重結び、二重結び；常常重做弦輪，弦就容易斷；弦輪太小易斷、太大不穩。", tag: "official", src: [ANKF.tool, BUDOKAN_EQ.ch7] },
          { text: "新合成弦容易伸長，弦輪先做短一點、弓把先張高一點；先空拉幾次再做中仕掛，可以少重做。猪飼：関板與弦的間隔要 5mm 以上，太低弓會翻轉。", tag: "shop", src: [SHOP.suizanTsuru, SHOP.ikaiTake] },
          { text: "弦師：弦輪要依弓的特性（入木、出木、弓形）和射手自己做，扭轉方向會對弓施加反方向的力。", tag: "shop", src: [SHOP.zkTsuru] },
        ],
      },
      { title: "中仕掛（なかじかけ）", table: NAKAJIKAKE_TABLE },
    ],
  },
];

/* ───────────────────────── 弽 ───────────────────────── */

export const KAKE_TERMS_TABLE: EqTable = {
  caption: "弽的部位與種類",
  head: ["日文", "中文解釋"],
  rows: [
    { cells: ["帽子（ぼうし）", "覆蓋拇指的部分"], tag: "official", src: [ANKF.terminology] },
    { cells: ["控え（ひかえ）", "手腕部分；「堅帽子控え付き」的控裡有硬芯"], tag: "shop", src: [SHOP.koyamaKake, SHOP.koyamaKakeInfo] },
    { cells: ["弦枕（つるまくら）", "拇指內側根部掛弦的溝"], tag: "official", src: [ANKF.terminology] },
    { cells: ["三つ弽／四つ弽／諸弽（みつがけ／よつがけ／もろがけ）", "三指／四指／五指弽"], tag: "official", src: [ANKF.terminology] },
    { cells: ["堅帽子（かたぼうし）", "帽子裡有木型；小山說從初學者到上級者大多數人用這型"], tag: "shop", src: [SHOP.koyamaKake, SHOP.koyamaKakeInfo] },
    { cells: ["控え無し", "帽子有木型、控裡沒有硬芯，比較柔軟；小山說適合初學者、弓力弱的人"], tag: "shop", src: [SHOP.koyamaKake] },
    { cells: ["和帽子（柔帽子）", "帽子不放木型、只用軟鹿皮疊成；新品沒有弦道，用久自然形成"], tag: "shop", src: [SHOP.koyamaKake, SHOP.koyamaKakeInfo] },
  ],
  notes: [{ text: "坊間常說「四つがけ適合強弓」，這次沒有查到弓具店的正式說明；全日本弓道具協會只說仕様依流派不同。", tag: "disputed", src: [SHOP.zkChoose] }],
};

export const KAKE_SIZE_TABLE: EqTable = {
  caption: "宮川弓具的弽尺寸參考（cm，約數）",
  head: ["號數", "2號（女）", "3號（女）", "4號", "5號", "6號（男）", "7號（男）", "8號（男）"],
  rows: [
    { cells: ["① 拇指", "5.0", "5.2", "5.5", "5.7", "5.8", "6.0", "6.1"] },
    { cells: ["② 拇指根到食指尖", "10.0", "10.3", "10.8", "11.2", "11.5", "12.0", "13.0"] },
    { cells: ["③ 中指", "6.8", "7.2", "7.5", "7.8", "8.2", "8.5", "9.5"] },
  ].map((r) => ({ ...r, tag: "shop" as const, src: [SHOP.miyakawaKake] })),
  notes: [{ text: "宮川說女性一般 3〜4 號、男性一般 5〜6 號；手工弽同一號數也會有差，一定要試戴。", tag: "shop", src: [SHOP.miyakawaKake, SHOP.zkChoose] }],
};

export const KAKE_PRICE_TABLE: EqTable = {
  caption: "三つ弽、四つ弽的價格帶（日幣含稅，2026-10-17）",
  head: ["品項", "日幣", "約台幣"],
  rows: [
    { cells: ["山武「三本カケR 練習用 體驗用」", "10,000", "2,082"], src: [SHOP.sambuKake] },
    { cells: ["小山 三ツカケ 控え無し", "17,600", "3,664"], src: [SHOP.koyamaKake] },
    { cells: ["山武 堅帽子 三ツカケ 控えなし（庫存出清）", "18,400", "3,831"], src: [SHOP.sambuKake] },
    { cells: ["小山 三ツカケ 和帽子", "19,800", "4,122"], src: [SHOP.koyamaKake] },
    { cells: ["山武 翔鳳 堅帽子 並 三ツカケ（成品）", "24,800", "5,163"], src: [SHOP.sambuSet, SHOP.sambuKake] },
    { cells: ["小山 三ツカケ 中唐（堅帽子控え付き）", "28,600", "5,955"], src: [SHOP.koyamaKake] },
    { cells: ["山武 翔鳳 堅帽子 上 三ツカケ／並 四ツカケ（成品）", "30,300", "6,308"], src: [SHOP.sambuKake] },
    { cells: ["小山 三ツカケ 小唐", "38,500", "8,016"], src: [SHOP.koyamaKake] },
    { cells: ["山武 翔鳳 堅帽子 上 四ツカケ（全訂製）", "43,300", "9,015"], src: [SHOP.sambuKake] },
    { cells: ["山武 正澄 特級品 四指（全訂製，最高價）", "312,000", "64,958"], src: [SHOP.sambuKake] },
  ].map((r) => ({ ...r, tag: "shop" as const })),
  notes: [
    { text: "平安弓具說弽的行情約 3 萬日圓。日幣含稅價，台幣以 0.2082 換算；不含運費、國際運費與台灣關稅。諸弽的價格這次沒有查到。", tag: "note", src: [SHOP.heianBeginner] },
  ],
};

export const KAKE_TOPICS: EqTopic[] = [
  {
    id: "kake",
    title: "弽",
    ja: "弽",
    kana: "ゆがけ／かけ",
    intro: [
      { text: "規則：行射時右手一定要戴鹿皮弽；三つ、四つ或諸弽都可以，但要有控、帽子和弦枕。中學生、高中生等初學者允許用柔帽子、和帽子，熟練後最好儘早改用有弦枕的弽。", tag: "official", src: [ANKF.playRules] },
      { text: "初學者最常見的是堅帽子（控え付き）三つがけ；控え無し、和帽子比較軟，適合弓力弱的人。", tag: "shop", src: [SHOP.koyamaKake, SHOP.koyamaKakeInfo] },
      { text: "弽怕濕氣：一定要在裡面戴木棉的下がけ。戴弽的規矩是跪坐或正坐著戴。", tag: "official", src: [ANKF.tool] },
    ],
    introTables: [KAKE_TERMS_TABLE],
    deep: [
      {
        title: "怎麼量、怎麼選",
        points: [
          { text: "翠山的三個數字：① 食指尖到拇指根（最重要）、② 拇指長、③ 中指長。手張開時食指尖和拇指根都要碰到弽本體；做出取懸手勢後，食指尖應略有剩餘。", tag: "shop", src: [SHOP.suizanKake] },
          { text: "初學者常挑偏小、剛好貼手的弽，結果會時右手不圓、手腕折、筈こぼれ；皮吸汗會縮，大約半年就縮了，所以要留餘裕。", tag: "shop", src: [SHOP.suizanKake] },
          { text: "全日本弓道具協會另要求量關節粗細與手背圍。小山的弽原則上不在網路販售，要到店試戴，遠地可郵寄手型。", tag: "shop", src: [SHOP.zkChoose, SHOP.koyamaKake] },
        ],
      },
      { title: "尺寸參考", table: KAKE_SIZE_TABLE },
      { title: "價格帶", table: KAKE_PRICE_TABLE },
      {
        title: "下がけ、ぎり粉、筆粉、押手弽",
        points: [
          { text: "下がけ（したがけ）：戴在弽下面的布手套，防汗。易流汗或夏天練習要勤換。小山 300〜600 日圓。", tag: "official", src: [ANKF.terminology, SHOP.koyamaKake] },
          { text: "ぎり粉（ぎりこ）：弽拇指的止滑粉，樹脂熬煮去油製成；塗太多會讓弽變黏變黑，要極少量。", tag: "official", src: [ANKF.terminology, BUDOKAN_EQ.ch7, SHOP.koyamaGoods] },
          { text: "筆粉（ふでこ）：左手（弓手）握把的止滑粉。成分說法不一，沒有查到廠商正式資料。", tag: "official", src: [ANKF.terminology, BUDOKAN_EQ.ch7] },
          { text: "押手弽（おしでがけ）：左手用的弽，規則承認是傳統押手輔具；除此之外押手只能戴保護傷處的繃帶、貼紮。小山簡易型 1,100 日圓〜。", tag: "official", src: [ANKF.playRules, SHOP.koyamaKake] },
          { text: "指導書：先戴胸當再戴弽；弽的繩子不要綁太緊；弽皮打滑可能走火（暴発）。", tag: "guide", src: [BUDOKAN.ch4] },
        ],
      },
    ],
  },
];

/* ───────────────────────── 服裝 ───────────────────────── */

export const WEAR_RULES_TABLE: EqTable = {
  caption: "服裝的官方規定",
  head: ["情境", "規定"],
  rows: [
    { cells: ["一般練習", "原則上弓道衣（白筒袖）＋袴＋白足袋。初學者可以穿好活動、乾淨的運動服；左胸有口袋、前面有釦子的上衣不適合（可能被弦打到）"], tag: "official", src: [ANKF.tool] },
    { cells: ["比賽（競技規則第 21 條）", "弓道衣（筒袖、袴、白足袋）或和服（著物、袴、白足袋）；大會要項可另行規定"], tag: "official", src: [ANKF.playRules] },
    { cells: ["全國大賽（選手権、國民運動會成年組等）", "男女都穿白筒袖、黑袴、白足袋"], tag: "official", src: [ANKF.playRules] },
    { cells: ["規則解說", "筒袖袖長最好到肘附近；內衣要素色、有領或高領不好；初學者的運動服避開前排扣、前拉鍊；「行燈袴は好ましくない」；標誌各 1 處、10cm 以內"], tag: "official", src: [ANKF.playRules] },
    { cells: ["審查", "審查規程第 28 條：教士、錬士與五段以上穿和服，其他人原則穿弓道衣。和服行射時男子肌脱ぎ、女子襷さばき"], tag: "official", src: [ANKF.probationRules, ANKF.probationGyosha] },
    { cells: ["女子胸当て", "女子要準備胸當（むねあて），從胸部右上方戴到左腋下，保護胸部不被弦打到"], tag: "official", src: [ANKF.tool, ANKF.terminology] },
  ],
};

export const WEAR_ITEMS_TABLE: EqTable = {
  caption: "服裝品項與尺寸（弓具店建議，小山日幣含稅價）",
  head: ["品項", "怎麼挑", "價格"],
  rows: [
    { cells: ["弓道衣（きゅうどうい）", "肩膀要有餘裕；男款腋下開口、女款閉合", "棉聚酯 4,000〜、聚酯 4,500〜、夏用 5,500〜、冬用 7,000〜"] },
    { cells: ["袴（はかま）", "全日本弓道具協會：女性從胸下、男性從肚臍下量起，袴襬落在腳踝中心附近；小山以「前紐下」表示，3cm 一級", "黑袴聚酯 8,000、夏用 9,000、楊柳馬乘 15,400"] },
    { cells: ["馬乗り袴 vs 行燈袴", "馬乗り（うまのり）是褲裙式，行燈（あんどん）是裙式。全日本弓道具協會：男女都以馬乗り為標準，女性也有行燈", "—"] },
    { cells: ["角帯（かくおび）", "男約 4m、女約 3m", "素面 2,000〜"] },
    { cells: ["足袋（たび）", "比平常的鞋小 0.5〜1.0cm；腳背高或腳寬選有彈性的", "棉 1,500〜、尼龍 1,700〜"] },
    { cells: ["胸当て", "貼身、不鬆", "660〜"] },
    { cells: ["著物（審查用）", "依段位；審查和講習會一般穿黑紋付加袴", "聚酯著物＋襦袢組 26,000〜"] },
  ].map((r) => ({ ...r, tag: "shop" as const, src: [SHOP.zkChoose, SHOP.koyamaWear] })),
  notes: [{ text: "套組：山武 男用 5 件組 12,200 日圓、女用 6 件組（含胸當）12,500 日圓；平安說 1 萬日圓左右。", tag: "shop", src: [SHOP.sambuSet, SHOP.heianBeginner] }],
};

export const WEAR_TOPICS: EqTopic[] = [
  {
    id: "wear",
    title: "服裝",
    ja: "弓道衣・袴",
    kana: "きゅうどうい・はかま",
    intro: [
      { text: "原則是弓道衣（白筒袖）、袴、白足袋。初學者和學校課程可以穿好活動、乾淨的運動服，但要避開左胸口袋、前排扣和前拉鍊——放箭時可能被弦勾到。", tag: "official", src: [ANKF.tool, ANKF.playRules] },
      { text: "審查時，教士、錬士與五段以上穿和服，其他人原則穿弓道衣。女子要戴胸当て。", tag: "official", src: [ANKF.probationRules, ANKF.tool] },
    ],
    introTables: [WEAR_RULES_TABLE],
    deep: [
      { title: "品項與尺寸", table: WEAR_ITEMS_TABLE },
      {
        title: "行燈袴（說法不一）",
        points: [
          { text: "競技規則解說寫「行燈袴は好ましくない」（不建議穿行燈袴），袴襬在足踏み姿勢時最好不碰地。", tag: "official", src: [ANKF.playRules] },
          { text: "但小山等弓具店仍賣女用行燈袴；全日本弓道具協會也說女性有行燈袴可選。一般練習能不能穿，沒有官方明文。", tag: "disputed", src: [SHOP.koyamaWear, SHOP.zkChoose] },
          { text: "本站建議：比賽、審查選馬乗り袴；平常練習請問所屬道場。", tag: "note" },
        ],
      },
    ],
  },
];

/* ───────────────────────── 其他用品 ───────────────────────── */

export const GOODS_TABLE: EqTable = {
  caption: "其他用品（官方定義與參考價）",
  head: ["用品", "是什麼", "參考價（日幣含稅）"],
  rows: [
    { cells: ["弓袋（ゆぶくろ）", "收弓的袋子", "小山 筒型附繩 1,650〜；平安 弓內袋 770"], tag: "shop", src: [ANKF.terminology, SHOP.koyamaGoods, SHOP.heianBeginner] },
    { cells: ["弓巻（ゆまき）", "纏在弓上收納的布帶", "小山 2,200"], tag: "shop", src: [ANKF.terminology, SHOP.koyamaGoods] },
    { cells: ["矢筒（やづつ）", "箭筒", "小山 肩背式 直徑 6cm 4,800、8cm 5,500"], tag: "shop", src: [ANKF.terminology, SHOP.koyamaGoods] },
    { cells: ["弦巻（つるまき）", "捲收替弦的器具", "素面 900、和紙 2,000、籐製 4,400〜"], tag: "shop", src: [ANKF.terminology, SHOP.koyamaGoods] },
    { cells: ["カケ袋／ゆがけ筒", "收弽的袋子或筒", "山武 ゆがけ筒 3,400；桐箱 4 件組 4,640〜"], tag: "shop", src: [SHOP.sambuKake] },
    { cells: ["握り革（にぎりかわ）", "纏在握把上的皮，讓押手不打滑、不受傷", "合成皮 660、鹿皮 990〜1,650"], tag: "shop", src: [BUDOKAN_EQ.ch7, SHOP.koyamaGoods] },
    { cells: ["ゴム弓（ごむゆみ）", "橡皮筋練習弓；全弓連說最適合練射型，拉的時候橡皮一定要在外側", "座右弓 2,640、塑膠製 2,860"], tag: "official", src: [ANKF.tool, SHOP.koyamaGoods] },
    { cells: ["巻藁矢（まきわらや）", "打巻藁用的箭（多半沒有羽）；巻藁要保持弓一杖（約 2m）的距離", "鋁製棒矢 2,090、附羽 3,850"], tag: "official", src: [ANKF.tool, SHOP.koyamaGoods] },
    { cells: ["弓立て（ゆみたて）", "立弓的架子，多為道場設備", "個人用價格沒查到"], tag: "official", src: [ANKF.terminology] },
  ],
  notes: [
    { text: "弓師永野一萃：卸了弦的弓結構很脆弱，帶出門時用約 30cm 的竹片綁住上關板一帶保護。", tag: "shop", src: [SHOP.issuiDamage] },
  ],
};

/* ───────────────────────── 預算：其他店 ───────────────────────── */

export const OTHER_BUDGETS_TABLE: EqTable = {
  caption: "其他店的套組與估算（並列）",
  head: ["來源", "內容", "日幣", "約台幣"],
  rows: [
    { cells: ["猪飼弓具店「弓道スターターセット」", "鋁合金箭、初學者用堅帽子三ツ（附控、カケ袋、下がけ 2 枚）、道衣、袴、帶、足袋；不含弓；只寄日本國內", "48,000〜56,000（折扣價）", "9,994〜11,659"], tag: "shop", src: [SHOP.ikaiSet] },
    { cells: ["山武弓具店", "近的矢 3 件組（鋁合金箭 6 支、矢筒、巻藁棒矢）25,300〜；男用道衣 5 件組 12,200；翔鳳 並 三ツカケ 24,800", "—", "—"], tag: "shop", src: [SHOP.sambuSet] },
    { cells: ["東山堂平安弓具", "玻纖、碳纖弓 3〜5 萬；箭 6 支 1〜2 萬；弽約 3 萬；道衣組約 1 萬；「10万円ほどあれば一通りのものが揃います」", "約 100,000", "約 20,820"], tag: "shop", src: [SHOP.heianBeginner] },
    { cells: ["翠山弓具店", "玻纖弓 3〜4 萬；硬鋁箭 6 支（火雞羽）1.3 萬起；弓道衣套組 1〜1.2 萬；三つ弽約 3 萬（店家沒有給總額）", "—", "—"], tag: "shop", src: [SHOP.suizanPrice] },
  ],
};

export const SHIPPING_NOTES: Point[] = [
  { text: "試算不含運費、國際運費、台灣關稅與進口稅。翠山的海外站說關稅與進口稅另計、約 3〜10%，海外寄送不退不換。", tag: "shop", src: [SHOP.globalSuizan] },
  { text: "翠山海外站：六寸伸的弓因出口限制不寄海外；有弓的訂單整筆走 TNT。", tag: "shop", src: [SHOP.globalSuizan] },
  { text: "猪飼的入門套組只寄日本國內；全長約 2.2m 的弓寄國際包裹的難度和費用，這次沒有查證。", tag: "disputed", src: [SHOP.ikaiSet] },
  { text: "小山註明網路價可能和店頭價不同；小山的海外寄送政策沒有找到。", tag: "shop", src: [SHOP.koyamaStrings] },
];

/* ───────────────────────── 保養 ───────────────────────── */

export const BAMBOO_CARE_TABLE: EqTable = {
  caption: "竹弓保管",
  head: ["主題", "說法"],
  rows: [
    { cells: ["高溫", "夏天車內可能到 70℃，膠合面會剝離；張著弦放在高溫處會扭曲、弓力下降"], tag: "shop", src: [SHOP.issuiNew] },
    { cells: ["鰾（にべ）弓", "用鹿皮熬的膠黏合；梅雨到夏天高溫期，尤其新弓，弓形容易跑掉"], tag: "shop", src: [SHOP.zkNibe] },
    { cells: ["雨袋", "不要長時間放在防水雨袋裡；淋濕用乾的軟布擦，乾了、涼了再用；遠離暖氣"], tag: "shop", src: [SHOP.yamaguchiCare] },
    { cells: ["裏反り（うらぞり）", "卸弦時的反向彎曲超過 15cm 就張著放、不到 15cm 就卸弦休息，直到回到約 15cm；籐和握革約每年換一次"], tag: "shop", src: [SHOP.yokoyama] },
    { cells: ["四季", "春秋最穩定；氣溫差 10 度弓力差將近 1kg，冬夏可能差 3kg；冬天材料變硬易出笄。玻璃纖維弓不在此限"], tag: "shop", src: [SHOP.issuiSeasons] },
    { cells: ["濕度數字", "「50〜60%」「40〜60%、20℃前後」等只出現在部落格"], tag: "folk" },
  ],
};

export const STRUNG_STORAGE_TABLE: EqTable = {
  caption: "要不要張著弦保存？（說法不一）",
  head: ["對象", "說法"],
  rows: [
    { cells: ["新竹弓", "一定要張著弦帶回家，用到充分熟成前都張著"], tag: "shop", src: [SHOP.issuiNew] },
    { cells: ["新竹弓", "頭一個月保管時也張著；1〜1.5 個月內每天 10 射以內、每週約 30 射"], tag: "shop", src: [SHOP.ikaiTake] },
    { cells: ["竹弓（一般）", "裏反變低了就卸弦休息幾天；一直張著可能胴抜け、弓形變形"], tag: "folk", src: [FOLK.kyudosuki] },
    { cells: ["玻纖、碳纖弓", "張著「ほとんど」沒問題 vs 轉述「大廠建議每天卸弦」（沒寫哪家）"], tag: "disputed", src: [FOLK.kyuudouq] },
    { cells: ["官方", "全弓連、指導書都沒有規定要不要張弦保存；只說竹弓要早點張好，等弓形穩定"], tag: "official", src: [ANKF.tool] },
  ],
};

export const KAKE_CARE_TABLE: EqTable = {
  caption: "弽的保養",
  head: ["該做", "不該做"],
  rows: [
    { cells: ["通風、陰乾，不要悶著濕氣", "曬太陽；用吹風機等過度乾燥（皮會變硬）"], tag: "shop", src: [SHOP.zkYugake] },
    { cells: ["一定戴下がけ、勤換，放在通風陰涼處，可和乾燥劑一起保管", "—"], tag: "shop", src: [SHOP.miyakawaKake] },
    { cells: ["輪流用幾個弽，主力出事有備品", "只操一個弽，操到修不了"], tag: "shop", src: [SHOP.zkYugake] },
    { cells: ["ぎり粉極少量", "塗太多（油分附著，變黏變黑）"], tag: "shop", src: [SHOP.koyamaGoods] },
  ],
  notes: [
    { text: "全日本弓道具協會：汗裡的水分和鹽分會傷皮。", tag: "shop", src: [SHOP.zkYugake] },
    { text: "乾燥劑長期過度使用會讓皮變硬（只看了搜尋摘要）。", tag: "folk" },
  ],
};

export const CARE_TOPICS: EqTopic[] = [
  {
    id: "care-yumi",
    title: "弓的保養",
    ja: "弓の手入れ",
    kana: "ゆみのていれ",
    intro: [
      { text: "グラス、カーボン弓保養簡單，但也要避開高溫、高濕和直射陽光；用完卸弦、收進弓袋。", tag: "shop", src: [SHOP.suizanBeginnerYumi, SHOP.sambuQA] },
      { text: "竹弓「本当に繊細」：怕濕怕熱，不要放在車內，不要長時間悶在防水袋裡。新弓依「半引き → 素引き → 巻藁 → 的前」逐步磨合，不要一買就射。", tag: "shop", src: [SHOP.yamaguchiCare, SHOP.yokoyama] },
      { text: "張弓：末弭頂在受板（うけいた）上張；沒有受板不可以頂牆或地板，要兩人一組。竹弓尤其要等弓形穩定，練習、比賽一開始就先張弓。", tag: "official", src: [ANKF.tool] },
    ],
    introTables: [BAMBOO_CARE_TABLE],
    deep: [
      { title: "張弦保存", table: STRUNG_STORAGE_TABLE },
      {
        title: "張好之後",
        points: [
          { text: "弓師：張好不要馬上用，先確認弦輪位置、弓把高度、弓的側面形狀，再做約矢束八成的空拉 2〜3 次；「目一杯の素引きは百害あって一利なし」。", tag: "shop", src: [SHOP.issuiStringing] },
          { text: "不要把本弭當拐杖拄地，在水泥地上會磨損。", tag: "guide", src: [BUDOKAN.ch2] },
          { text: "指導書：不要用極端的出木弓（弓扭曲）。入木（いりき）、出木（でき）的精確左右定義，全弓連辭典沒有收錄，請向指導者確認。", tag: "disputed", src: [BUDOKAN.ch2, BUDOKAN_EQ.ch7, SHOP.issuiStringing] },
          { text: "合成弦造成的弦輪附近縱向裂痕，弓師建議發現就早點注入瞬間膠防止擴大。", tag: "shop", src: [SHOP.issuiSynth2] },
        ],
      },
    ],
  },
  {
    id: "care-kake",
    title: "弽的保養",
    ja: "弽の手入れ",
    intro: [
      { text: "保養的關鍵字是「濕氣」。弽怕汗和濕氣：用後陰乾，不要曬太陽，也不要用吹風機。", tag: "shop", src: [SHOP.zkYugake, SHOP.zkChoose] },
      { text: "全弓連：弽怕濕氣，保管要注意；一定要戴下がけ。", tag: "official", src: [ANKF.tool] },
    ],
    introTables: [KAKE_CARE_TABLE],
  },
  {
    id: "care-ya",
    title: "箭的保養",
    ja: "矢の手入れ",
    intro: [
      { text: "箭筈或箭桿有傷、沒有箭頭的箭不要用。", tag: "guide", src: [BUDOKAN.ch2, ANKF.tool] },
      { text: "用後用乾布擦箭桿、清掉根部的土；羽亂了可以用蒸氣稍微整理，但膠怕濕，時間要很短；竹箭受潮會再彎，要放乾燥處。", tag: "folk", src: [FOLK.careBlog] },
      { text: "鋁合金箭彎了怎麼矯正，沒有查到弓具店的正式說明——交給弓具店。", tag: "note" },
    ],
  },
];

export const TAIWAN_CARE: Point[] = [
  { text: "這次用中文、日文搜尋，都沒有找到台灣弓道團體或台灣店家的正式保養資料。以下只是把日本來源推到台灣情境。", tag: "disputed" },
  { text: "竹弓、鰾弓在日本梅雨到夏天就容易出問題，台灣高溫季節更長；初學者用玻纖、碳纖弓比較省事（小山說玻纖＋碳纖弓不需要麻煩的保養；弓師說玻纖弓不受季節弓力變化影響）。", tag: "note", src: [SHOP.zkNibe, SHOP.issuiNew, SHOP.koyamaYumiInfo, SHOP.issuiSeasons] },
  { text: "不要把弓放在夏天的車裡，不要長時間悶在防水袋裡。", tag: "note", src: [SHOP.issuiNew, SHOP.yamaguchiCare] },
  { text: "弽：勤換下がけ、陰乾、通風，可以放乾燥劑但不要過度乾燥。能不能放進相機用的電子防潮箱、濕度設多少，都沒有來源。", tag: "note", src: [SHOP.miyakawaKake, SHOP.zkYugake] },
  { text: "麻弦在乾燥時容易斷；台灣潮濕對麻弦、くすね的影響，沒有來源。", tag: "note", src: [SHOP.koyamaStrings] },
  { text: "如果你是有經驗的會員或指導者，歡迎補充台灣本地的做法。", tag: "note" },
];

/* ───────────────────────── 說法不一總覽 ───────────────────────── */

export const DISPUTES: { title: string; text: string; anchor: string }[] = [
  { title: "矢尺要加幾 cm", text: "ANKF +5 以上（初學 +10）、教本 +5〜10、弓具店 +10〜15、池田 +3〜5（而且池田的矢束指實際拉距）。本站：初學者以 +10cm 以上為宜，請依指導者判斷。", anchor: "calc" },
  { title: "弓長的分界", text: "四寸伸的矢束上限：翠山 100、橫山與山武 95；三寸伸只有翠山列出；全日本弓道具協會用身高 170 分界，弓師主張看矢束。", anchor: "calc" },
  { title: "弓力的空白", text: "中學生、高齡者沒有具體數字；「能肩入れ的弓力」怎麼測沒有說明；弓力標示的拉距是否全業界統一，只確認了兩家。", anchor: "yumi-power" },
  { title: "箭桿適用弓力", text: "同一規格各店差好幾公斤；Easton 規格號碼的讀法沒有官方出處。", anchor: "ya-shaft" },
  { title: "審查用竹弓", text: "審查規程沒有找到弓材規定；天皇盃、遠的選手権的要項則規定竹弓。", anchor: "yumi-material" },
  { title: "換弦時機", text: "弓師 200〜300 射、弓具店 600〜700 射、問答網站 1000〜3000 射，沒有官方數字。", anchor: "tsuru" },
  { title: "行燈袴", text: "競技規則解說寫「好ましくない」，但弓具店照賣女用行燈袴；一般練習能不能穿沒有官方明文。", anchor: "wear" },
  { title: "合成弓要不要張弦保存", text: "沒有廠商正式說法，只有部落格轉述。", anchor: "care-yumi" },
  { title: "台灣高溫多濕的保養", text: "完全沒有台灣本地來源；防潮箱濕度設定沒有依據。", anchor: "taiwan-care" },
];
