// 文化與哲學 page content. Paraphrased from docs/research/01 (fact-checked; ⚠️ items kept as
// tag "disputed" or 「說法不一」). Only short phrases are quoted from sources.

import type { LayeredSection, Point, Source } from "../types";
import { ANKF, IKYF, RESEARCH, TAIWAN } from "../common-sources";
import { CS } from "./sources";
import { SHOP } from "../equipment/sources";

/* ------------------------------------------------------------------ 入門 */

export const WHAT_IS: LayeredSection = {
  id: "what-is",
  title: "弓道是什麼",
  ja: "弓道",
  kana: "きゅうどう",
  intro: [
    "弓道是日本的傳統弓射武道：用長度超過兩公尺、握把偏下的和弓（わきゅう），依照「射法八節」的固定步驟射箭；最常見的近的（きんてき）是在 28 公尺外射直徑 36 公分的靶。",
    "它同時是運動、禮法和修養。全日本弓道連盟（簡稱全弓連）把「真・善・美」當作最高目標，強調用正確的射法射出正確的箭，而不是只追求命中。",
    "弓道和奧運的現代射箭（World Archery 系統）是不同的體系，弓道也不是奧運項目。",
  ],
  introSrc: [ANKF.mind, ANKF.syaho, ANKF.playRules, CS.jaWiki],
  deep: [
    {
      title: "名稱的由來",
      points: [
        {
          text: "明治以前多稱「弓術（きゅうじゅつ）」。1919 年大日本弓術會改名大日本弓道會，理由是「弓術」只指技術、意思太窄，弓術只是弓道的一部分。",
          src: [CS.goka2018],
        },
        {
          text: "同年武德會也把「武術」改稱「武道」。日本武道館教材寫成 1895 年就已改名，與學術研究不同，本站採 1919 年。",
          tag: "disputed",
          src: [CS.goka2018, CS.jaWiki, CS.budokanJr1],
        },
        {
          text: "「弓道」一詞在江戶時代的文獻中可能已經出現，1919 年是正式或制度上的改名；具體出處待查證。",
          tag: "disputed",
        },
      ],
    },
    {
      title: "現況",
      points: [
        {
          text: "全弓連會員 143,759 人，加盟團體為 47 個都道府縣連盟（2025 年 3 月 31 日）。",
          tag: "official",
          src: [ANKF.overview],
        },
        {
          text: "國際弓道連盟（IKYF）會員名單列出 36 個組織（2026-10-17 查詢）；About 頁寫 35、英文維基百科寫 32，數字會隨時間變動。",
          tag: "disputed",
          src: [IKYF.members, CS.ikyfAbout, CS.enWikiIkyf],
        },
      ],
    },
  ],
};

/** 3 分鐘歷史：六個停靠站。 */
export const QUICK_HISTORY: { when: string; title: string; text: string; src: Source[] }[] = [
  {
    when: "繩文～3 世紀",
    title: "狩獵之弓",
    text: "出土木弓與石鏃；3 世紀的《魏志倭人傳》已記載「木弓短下長上」，握把偏下的特徵很早就出現。",
    src: [CS.yamada],
  },
  {
    when: "古代～平安",
    title: "宮廷之禮",
    text: "《禮記・射義》等射禮思想傳入，宮廷有射礼、賭弓等儀式；拉響弓弦的「鳴弦」用來驅邪。",
    src: [ANKF.history, CS.kbJarai, CS.kbMeigen],
  },
  {
    when: "鎌倉～戰國",
    title: "武士之弓",
    text: "「弓馬之道」是武士之道的代稱。小笠原流重禮法與騎射；室町時代起，日置流等實戰流派陸續出現。",
    src: [ANKF.history, CS.yamada],
  },
  {
    when: "戰國～江戶",
    title: "太平之道",
    text: "戰國時代鐵砲傳入後，弓逐漸從主力武器轉為身心鍛鍊；江戶的長期和平中出現三十三間堂「通し矢」等競技。",
    src: [ANKF.history, CS.kyotoArchive],
  },
  {
    when: "明治～戰前",
    title: "衰退與重建",
    text: "武士階級消失後弓術一度衰退、娛樂化；武德會與民間團體重建組織，1919 年「弓術」改稱「弓道」。",
    src: [CS.yamada, CS.goka2018],
  },
  {
    when: "戰後～現在",
    title: "現代弓道",
    text: "占領期學校禁止武道；1947 年前身成立，1949 年 5 月 22 日全弓連正式設立，1953 年《弓道教本》確立射法八節，2006 年國際弓道連盟成立。",
    src: [ANKF.history, ANKF.overview, CS.ikyfAbout],
  },
];

/* ------------------------------------------------------------ 歷史專題 */

export const HISTORY_TOPICS: LayeredSection[] = [
  {
    id: "wakyu",
    title: "和弓：很長，握把在下",
    ja: "和弓",
    kana: "わきゅう",
    intro: [
      "和弓有兩個特徵：長度超過兩公尺，而且握把（握り／にぎり）在弓身中心點以下，大約在下方三分之一處。後者在世界上相當少見。",
      "為什麼握把偏下？目前有多種假說，學界沒有定論。日本武道館的出版物直接寫明，真正的理由至今仍不清楚。",
    ],
    introSrc: [CS.yamada, CS.budokanBow],
    deep: [
      {
        title: "四種假說（都只是推測）",
        points: [
          { text: "材料說：未充分加工的天然木材，根部（下段）強、梢部（上段）弱，握把下移才能讓上下力量平衡。", tag: "research", src: [CS.budokanBow] },
          { text: "姿勢／操作說：跪坐或蹲姿射擊時下段短比較方便；之後的騎射也同樣有利。", tag: "research", src: [CS.budokanBow] },
          { text: "彈力說：握在下段可增加反彈力，讓箭略微朝上、飛得更遠。", tag: "research", src: [CS.budokanBow] },
          { text: "振動節點說：弓身中央是振動的「腹」，握在接近「節」的位置，傳到手上的衝擊比較小。", tag: "research", src: [CS.budokanBow] },
          {
            text: "實測上下弦長比約 1:1.616，接近黃金比例；但同一份資料指出這是偶然的一致，不能當作成因。",
            src: [CS.budokanBow],
          },
        ],
      },
      {
        title: "弓的長度與材料",
        points: [
          {
            text: "全弓連《弓道競技規則》第 20 條以七尺三寸（221 公分，稱「並寸／なみすん」）為標準長度，並允許若干長短。",
            tag: "official",
            src: [ANKF.playRules],
          },
          {
            text: "規則沒有依矢束選弓長的對照表；弓具店一般建議再依矢束（やづか）選「二寸伸」等規格，各店分界不同。",
            tag: "shop",
            src: [SHOP.suizanYumi, SHOP.sambuQA, SHOP.yokoyama],
          },
          { text: "丸木弓（單一木材）→ 伏竹弓（10 世紀中葉，外側貼竹）→ 三枚打弓（12 世紀後半，木芯前後貼竹）。", src: [ANKF.history] },
          { text: "四方竹弓的年代本站未查到可靠資料；以竹籤為芯的弓胎弓（ひごゆみ）一般說是戰國末～江戶初期，待查證。", tag: "disputed" },
        ],
      },
    ],
  },
  {
    id: "ritual",
    title: "宮廷射禮與驅邪之弓",
    ja: "射礼・鳴弦",
    kana: "じゃらい・めいげん",
    intro: [
      "古代起，弓矢就被當作權威的象徵。4～5 世紀以後，《周禮》《禮記・射義》等射禮思想傳入日本，現行《弓道教本》的開頭仍引用〈射義〉。",
      "平安宮廷每年正月 17 日舉行射礼（又稱大射），次日舉行分隊比賽的賭弓（のりゆみ）。不搭箭、只拉響弓弦的鳴弦（めいげん），則用聲音驅除邪氣。",
    ],
    introSrc: [ANKF.history, CS.kbJarai, CS.kbMeigen],
    deep: [
      {
        title: "宮廷射儀",
        points: [
          { text: "射礼：天皇出席，親王以下五位以上官人及六衛府官人演射，結束後賜宴賜祿。", src: [CS.kbJarai] },
          { text: "手結（てつがい）：射礼、賭弓之前的配對與預賽。", src: [CS.kbJarai] },
          { text: "騎射（うまゆみ）：宮廷騎馬射箭儀式，一般記載在端午前後，本站未查到一手出處。", tag: "disputed" },
        ],
      },
      {
        title: "驅邪與神事",
        points: [
          { text: "鳴弦用於入浴、生病、生產、打雷等場合；最早的用例見於《御堂關白記》寬弘五年（1008）。", src: [CS.kbMeigen] },
          { text: "蟇目（ひきめ）：射出會發出高音的鏑矢驅邪，是鳴弦的後世發展形式。", src: [CS.kbMeigen] },
          { text: "百手式（ももてしき）：各地神社年初的弓射神事，例如岡山縣矢掛町御崎神社每年 2 月 1 日的「百手講神事」。", src: [CS.misaki] },
          { text: "矢渡し（やわたし）：現代射會開幕時的儀式射。", src: [TAIWAN.home] },
        ],
      },
      {
        title: "寫作提醒",
        points: [
          {
            text: "神道儀式中的弓、《禮記》的儒家射禮、武家禮法是不同的源流，在現代弓道中交織在一起。「弓道起源於神道」這種單一敘事並不準確。",
            tag: "note",
            src: [RESEARCH.history],
          },
        ],
      },
    ],
  },
  {
    id: "bushi",
    title: "弓馬之道與流鏑馬",
    ja: "弓馬の道",
    kana: "きゅうばのみち",
    intro: [
      "12 世紀鎌倉幕府成立後，「弓馬之道」成為武士之道的代稱，武士倫理把騎射的修練和精神修養連在一起。",
      "騎射三物是流鏑馬（やぶさめ，奔馳中依序射三個靶）、笠懸（かさがけ，射遠距離的靶）與犬追物（いぬおうもの，用鈍箭追射犬隻）。",
    ],
    introSrc: [ANKF.history, CS.yamada],
    deep: [
      {
        title: "鶴岡八幡宮的流鏑馬",
        points: [
          { text: "依《吾妻鏡》，文治 3 年（1187）放生會時開始舉行，至今仍延續，現在多在 9 月 16 日例大祭舉行。", src: [ANKF.history, CS.tsurugaoka] },
          { text: "1187 年是這項神事的起點，不是流鏑馬本身的起源；流鏑馬更早就已存在。", tag: "note" },
        ],
      },
    ],
  },
  {
    id: "toshiya",
    title: "三十三間堂「通し矢」",
    ja: "通し矢",
    kana: "とおしや",
    intro: [
      "江戶時代的長期和平，讓弓射同時被當作「術」與「道」來研究。最有名的競技是京都三十三間堂的通し矢：從西側外廊南端射到北端，比射「通」全長的箭數，而不是射靶。",
      "外廊約 120 公尺長、屋簷下只有約 5 公尺高，所以需要低彈道、省力的特殊技法。日置流竹林派與雪荷派是主力。",
    ],
    introSrc: [CS.yamada],
    deep: [
      {
        title: "著名紀錄（大矢數，一晝夜）",
        points: [
          { text: "1669 年：尾張藩星野勘左衛門，總射 10,542 本、通 8,000 本。", src: [CS.kyotoArchive] },
          { text: "1686 年：紀州藩和佐大八郎，總射 13,053 本、通 8,133 本，至今的最高紀錄。", src: [CS.kyotoArchive, ANKF.history] },
          { text: "1606 年淺岡平兵衛通 51 本，全弓連列為早期紀錄；細節待查證。", tag: "disputed", src: [ANKF.history] },
        ],
      },
      {
        title: "影響與傳說",
        points: [
          { text: "競技壓力推動了弽（ゆがけ，射箭手套）的改良，「堅帽子」形式的鹿皮手套就在這時成形，是現代弽的原型。", src: [ANKF.history] },
          {
            text: "「和佐的父親紀錄被星野打破後自盡」這類情節出自 1945 年電影等創作，應視為虛構。",
            src: [CS.jaWiki],
          },
          { text: "1862 年講武所以「不實用」為由，把弓術排除在訓練科目之外。", src: [ANKF.history, CS.jaWiki] },
          { text: "現在每年 1 月的「大的大會」是在 60 公尺距離射大靶，和江戶的通し矢不同。", src: [CS.oomato] },
        ],
      },
    ],
  },
  {
    id: "modern",
    title: "近代：從衰退到「弓道要則」",
    intro: [
      "明治維新後武士階級消失、通し矢停辦，弓術一度衰退，很多人只把弓當作體育或娛樂；當時甚至有向客人收費射箭的「矢場」。",
      "重建靠兩股力量：1895 年在京都成立的大日本武德會，以及本多利實的門下團體（例如 1909 年成立的大日本弓術會）。本多的門下弟子後來分成大日本弓道會、弓道館等多個團體，各自積極推廣，結果使正面打起し普及到全國。",
    ],
    introSrc: [CS.yamada, CS.goka2018, CS.goka2022, ANKF.history],
    deep: [
      {
        title: "統一射法的失敗：弓道要則",
        points: [
          {
            text: "1933 年武德會設立弓道型調查委員會。射禮部分有共識，但正面打起し與斜面打起し兩派互不相讓，最後創出折衷的「中間打起し」。",
            src: [CS.goka2018],
          },
          { text: "1934 年 12 月發表《弓道要則》，逐漸帶有強制力，不照要則演武的人在升段審查中處於不利。", src: [CS.goka2018] },
          {
            text: "大日本弓道會強烈反對；陸軍軍醫也提出「要則在醫學上不合理」的研究，但該研究的科學性後來被質疑。1942 年武德會改組時，要則被廢止。",
            src: [CS.goka2018],
          },
        ],
      },
      {
        title: "戰時",
        points: [{ text: "1941 年文部省把弓道列為體練科武道的必修科目，弓道再度和戰鬥訓練掛鉤。", src: [ANKF.history] }],
      },
    ],
  },
  {
    id: "postwar",
    title: "戰後重建與射法八節",
    ja: "射法八節",
    kana: "しゃほうはっせつ",
    intro: [
      "1945 年 11 月，學校禁止武道課程；1946 年大日本武德會解散。弓道界在 1949 年 5 月 22 日成立日本弓道連盟（全弓連的官方設立日），1957 年改名為全日本弓道連盟。",
      "1953 年 8 月出版的《弓道教本 第一卷》確立了射法八節，廢除要則的中間打起し，改為正面與斜面兩種打起し並列。射法八節是為了整合各流派而建立的現代基準，不是古代流傳下來的。",
    ],
    introSrc: [ANKF.history, ANKF.overview, CS.ankfPlan, CS.jaWikiShaho],
    deep: [
      {
        title: "全弓連的成立經過",
        points: [
          { text: "1947 年：前身以「全日本弓道連盟」之名成立。", src: [CS.ankfPlan] },
          {
            text: "1949 年：因被指出與戰爭有關，對外宣布解散，實際上改組成立「日本弓道連盟」。日文維基百科寫成 4 月 3 日，本站以官方的 5 月 22 日為準。",
            tag: "official",
            src: [ANKF.overview, CS.ankfPlan, CS.jaWiki],
          },
          { text: "1953 年登記為財團法人；1957 年改名；1989 年加入 JOC；2011 年認定為公益財團法人。", src: [CS.ankfPlan] },
          { text: "學校弓道：1951 年 7 月准許開授，1967 年成為高中正課。", src: [ANKF.history] },
          {
            text: "占領時期禁止武道的背景，一般說是 GHQ 認為武道曾被用來鼓吹軍國主義；細節依教育史二手資料，待進一步查證。",
            tag: "disputed",
          },
        ],
      },
      {
        title: "正面打起し與斜面打起し",
        points: [
          {
            text: "正面打起し（しょうめんうちおこし）：弓在身體正前方舉起。主要見於小笠原流（禮射系）與本多流。",
            src: [CS.goka2018, CS.jaWikiShaho],
          },
          {
            text: "斜面打起し（しゃめんうちおこし）：先在身體左前方完成手之內，再斜向舉起。主要見於日置流諸派（武射系）。",
            src: [CS.goka2018, CS.jaWikiShaho],
          },
          { text: "現行《弓道教本》兩者都採用（據日文維基百科，本站未查證教本原文）。", tag: "note", src: [CS.jaWikiShaho] },
          {
            text: "本多利實為什麼由斜面改為正面？有說法認為入江康平主張「並非出於利實的創意，技法上也沒有確切理由」，也有反對意見；這是二手轉述，待查證原書。",
            tag: "disputed",
            src: [CS.irieSecondary],
          },
          { text: "射法八節的制定委員名單，本站未查到一手資料，因此不寫成「由某某人統一」。", tag: "note" },
        ],
      },
    ],
  },
  {
    id: "intl",
    title: "走向世界",
    intro: [
      "國際弓道連盟（IKYF）在 2006 年 5 月 2 日成立，宗旨同樣是追求「真・善・美」，並以弓道精神促進會員之間的信任與友誼。",
      "世界弓道大會：第 1 回 2010 年東京、第 2 回 2014 年巴黎、第 3 回 2018 年東京、第 4 回 2024 年名古屋；第 5 回預定 2028 年在日本舉行。",
    ],
    introSrc: [CS.ikyfAbout, CS.aichi, CS.enWikiIkyf],
    deep: [
      {
        title: "細節",
        points: [
          { text: "IKYF 的前身是由約 15 國組成的歐洲弓道連盟（EKF）。", src: [CS.enWikiIkyf] },
          { text: "第 4 回大會有 25 個國家和地區、約 157 人參加。", src: [CS.aichi] },
          {
            text: "英文維基百科把第 4 回寫成「2022 年東京」，與 IKYF 官方不符；原訂 2022 年可能因疫情延期，待查證。",
            tag: "disputed",
            src: [CS.enWikiIkyf, CS.ikyfAbout],
          },
        ],
      },
    ],
  },
];

/* --------------------------------------------------------------- 思想 */

export const SHINZENBI: { char: string; kana: string; text: string }[] = [
  { char: "真", kana: "しん", text: "箭不會說謊。每一射都在追求正確的射法，射得對不對，靶會給出答案。" },
  { char: "善", kana: "ぜん", text: "基礎是平常心（へいじょうしん）。真正的敵人是自己動搖的心；同時重視對他人的禮節與敬意。" },
  { char: "美", kana: "び", text: "全弓連的說法是「美是真與善的結晶」——真與善具備時，射自然呈現美。" },
];
export const SHINZENBI_SRC: Source[] = [ANKF.mind, CS.ikyfAbout];
export const SHINZENBI_NOTE: Point = {
  text: "「真善美」是現代弓道組織提出的理念框架；它最早何時寫進《弓道教本》，本站尚未取得教本原文，待查證。",
  tag: "disputed",
};

export const THOUGHT: LayeredSection[] = [
  {
    id: "seisha",
    title: "正射必中",
    ja: "正射必中",
    kana: "せいしゃひっちゅう",
    intro: [
      "用正確的射法射出的箭，必然命中。所以練習的目標是「正射」，命中是隨之而來的結果。",
      "這常被誤解成「弓道不在乎中不中」。比較準確的說法是：命中是正射的檢驗，而不是目的本身。",
    ],
    introSrc: [ANKF.mind],
    deep: [
      {
        title: "審查基準怎麼寫命中",
        points: [
          { text: "参段的資格基準寫「的中やや確実」（命中稍確實），四段寫「的中確実」（命中確實）。", tag: "official", src: [ANKF.probationRules] },
          {
            text: "《審查統一基準（五段以下）》只在弐段一欄的「射法・射技」寫「的中不問」（不問命中）；参段起才出現命中要求。",
            tag: "official",
            src: [ANKF.probationStandard],
          },
        ],
      },
      {
        title: "相關說法",
        points: [
          { text: "也有「正射正中（せいしゃせいちゅう）」的說法，或把「正」字拆成「一＋止」來解釋；這些多是道場內的詮釋，沒有權威出處。", tag: "folk" },
        ],
      },
    ],
  },
  {
    id: "shasoku",
    title: "射即人生",
    ja: "射即人生",
    kana: "しゃそくじんせい",
    intro: [
      "日本武道館的教材提到，弓道有「射即人生」「射即生活」「射は立禅（射即立禪）」等說法：透過弓射讓人生更深、更高，讓生活更豐富。",
      "這些是弓道界流傳的箴言，本站沒有找到最早的使用者或典籍，因此不歸給特定人物。",
    ],
    introSrc: [CS.budokanJr3],
    deep: [
      {
        title: "怎麼理解「射は立禅」",
        points: [
          {
            text: "可以理解為一種比喻：站著的、專注於呼吸與動作的修練。它不代表弓道等於禪宗修行（見下方「弓道與禪」）。",
            tag: "note",
            src: [RESEARCH.history],
          },
          { text: "「射即人生」的最早出處不明。", tag: "disputed" },
        ],
      },
    ],
  },
  {
    id: "rei",
    title: "始於禮，終於禮",
    ja: "礼に始まり礼に終わる",
    kana: "れいにはじまりれいにおわる",
    intro: [
      "這是現代日本武道共通的標語，文部科學省的武道教育資料也使用。對弓道來說，它可以連結〈射義〉的「進退周還必中禮」，以及小笠原流的禮法傳統。",
      "不過這句話不是弓道獨有，也不是古典原文，最早的出處並不清楚。",
    ],
    introSrc: [CS.reiNi],
    deep: [
      {
        title: "出處問題",
        points: [
          { text: "入江康平指出，這句話最早出自誰、從何時開始使用，並不確定。", tag: "research", src: [CS.reiNi] },
          { text: "船越義珍〈空手二十箇條〉第一條有類似文字；也有人指出明治 40 年（1907）內藤高治的用例。", tag: "disputed", src: [CS.reiNi] },
        ],
      },
    ],
  },
];

/** 《禮記・射義》逐句。 */
export const SHAGI_ROWS: { zh: string; ja: string; plain: string }[] = [
  { zh: "射者，進退周還必中禮", ja: "射は進退周還必ず礼に中り", plain: "射箭時的進退轉身，都必須合乎禮。" },
  { zh: "內志正，外體直", ja: "内志正しく外体直くして", plain: "內心志向端正，外在身體正直。" },
  { zh: "然後持弓矢審固", ja: "然る後に弓矢を持ること審固なり", plain: "然後才能穩固確實地持弓矢。" },
  { zh: "持弓矢審固，然後可以言中", ja: "然る後に以て中ると言うべし", plain: "這樣才談得上命中。" },
  { zh: "此可以觀德行矣", ja: "此れ以て徳行を観るべし", plain: "由此可以看出一個人的德行。" },
  { zh: "射者，仁之道也", ja: "射は仁の道なり", plain: "射，是實踐仁的途徑。" },
  { zh: "射求正諸己", ja: "射は正しきを己に求む", plain: "射箭是向自己要求端正。" },
  { zh: "己正而後發", ja: "己正しくして而る後発す", plain: "先端正自己，然後才放箭。" },
  { zh: "發而不中，則不怨勝己者", ja: "発して中らざるときは則ち己に勝つ者を怨みず", plain: "射不中時，不怨恨勝過自己的人。" },
  { zh: "反求諸己而已矣", ja: "反ってこれを己に求むるのみ", plain: "只是反過來從自己身上找原因。" },
];
export const SHAGI_SRC: Source[] = [CS.wikisource, TAIWAN.home, ANKF.history];

export const SHAGI_DEEP: Point[] = [
  {
    text: "日文訓讀依版本與道場習慣略有不同（例如「己を正しうして而して後発す」）；要逐字引用《弓道教本》時，請以教本原書為準。",
    tag: "disputed",
  },
  {
    text: "《孟子・公孫丑上》有幾乎相同的一段：「仁者如射：射者正己而後發；發而不中，不怨勝己者，反求諸己而已矣。」日文常見的「己を正しうして」比較接近孟子「正己」的語序。",
    src: [RESEARCH.history],
  },
  {
    text: "〈射義〉也引用《論語・八佾》：「君子無所爭，必也射乎！揖讓而升，下而飲。其爭也君子。」",
    src: [CS.wikisource],
  },
  { text: "〈射義〉又說「射之為言者，繹也」：射，就是各自抽繹、呈現自己的心志。", src: [CS.wikisource] },
];

/** 《射法訓》 — 吉見順正。 */
export const SHAHOKUN = {
  ja: "射法は弓を射ずして骨を射ること最も肝要なり。心を総体の中央に置き、而して弓手三分の二弦を推し、妻手三分の一弓を引き、而して心を納むる是れ和合なり。然して後胸の中筋に従い宜しく左右に分るる如く之を離つべし。書に曰く鉄石相剋して火の出ずること急なり。即ち金体白色、西半月の位なり。",
  plain: [
    "射法的關鍵不在「用弓射」，而在「用骨骼射」。",
    "把心放在全身的中央；弓手（左手）推弦三分之二，妻手（右手）拉弓三分之一，心收斂其中，這就是「和合」。",
    "然後順著胸的中線，像向左右分開一樣放箭——就像鐵與石相擊，瞬間迸出火花。",
  ],
  src: [TAIWAN.home] as Source[],
  deep: [
    { text: "作者是紀州藩的吉見順正（よしみじゅんせい），屬日置流竹林派系統；生卒年與流派歸屬本站只查到二手資料。", tag: "disputed" },
    { text: "上方原文是一般流傳的版本，與臺灣弓道協會網站的節錄一致；逐字仍以《弓道教本》為準。", tag: "disputed", src: [TAIWAN.home] },
    { text: "最後一句「金体白色、西半月の位」涉及五行與方位的比喻，各家解釋不同，本站不做定論。", tag: "note" },
  ] as Point[],
};

/* ----------------------------------------------------------- 弓道與禪 */

export const ZEN_FACTS: { k: string; v: string; src: Source[] }[] = [
  {
    k: "作者",
    v: "奧伊根・海瑞格（Eugen Herrigel，1884–1955），德國新康德學派哲學家，學生時代就著迷於神秘主義。",
    src: [CS.yamada],
  },
  { k: "在日期間", v: "1924–1929 年在東北帝國大學（仙台）任教。", src: [CS.yamada, CS.enWikiHerrigel] },
  {
    k: "老師",
    v: "阿波研造（あわ けんぞう，1880–1939）。先學日置流雪荷派，1910 年起再隨本多利實學竹林派。",
    src: [CS.yamada],
  },
  { k: "翻譯", v: "同事小町谷操三（1893–1979），曾跟阿波學弓，後來成為東北大學國際法教授。", src: [CS.yamada] },
  { k: "著作", v: "1936 年德文論文 → 1948 年擴寫成書 → 1953 年英譯 → 1956 年日譯《弓と禅》。", src: [CS.yamada] },
];

export const ZEN_FLOW: { who: string; what: string }[] = [
  { who: "阿波研造", what: "以日語教學，有時說出前後矛盾的話" },
  { who: "小町谷操三", what: "翻譯；自承有時「壓下不翻」或意譯帶過" },
  { who: "Herrigel", what: "以追求禪的強烈願望理解所見所聞" },
  { who: "1936／1948", what: "德文論文、德文專書" },
  { who: "1953", what: "英譯本，在西方廣為流傳" },
  { who: "1956", what: "日譯本《弓と禅》，形象回流日本" },
];

export const ZEN: LayeredSection = {
  id: "zen-yamada",
  title: "山田奨治的研究說了什麼",
  intro: [
    "日本學者山田奨治在 2001 年的論文〈The Myth of Zen in the Art of Archery〉（日文原版 1999）中指出：弓道「特別」和禪掛鉤，主要是二戰後、尤其是 1956 年《弓與禪》日譯本出版以後的現象；戰前的弓術書籍，除了少數宗教性團體，幾乎沒有談弓與禪的親和性。",
    "他的結論是：「弓與禪的神話」由語言障礙、翻譯者的意譯、偶然事件被賦予意義，加上 Herrigel 本人追求禪的強烈願望一起造成。",
  ],
  introSrc: [CS.yamada],
  deep: [
    {
      title: "阿波研造是怎樣的老師",
      points: [
        {
          text: "依櫻井保之助的傳記（1981），找不到阿波曾隨禪僧修行的證據；他雖用「弓禪一味」等說法，但沒有把弓道說成通往禪的路。",
          tag: "research",
          src: [CS.yamada],
        },
        { text: "網路上有「阿波曾在瑞巖寺修禪」的說法，與櫻井、山田的結論矛盾，屬未經證實。", tag: "disputed", src: [CS.scrapboxAwa] },
        {
          text: "1927 年他不顧學生反對，創立宗教性的「大射道教」，把巡迴指導稱為「布教」；當時弓術界把他視為異類。書中的「Great Doctrine（大道）」指的其實是大射道教，不是禪。",
          tag: "research",
          src: [CS.yamada],
        },
      ],
    },
    {
      title: "「暗中之靶」",
      points: [
        { text: "書中描寫阿波在黑暗中連射兩箭，第二箭劈開第一箭的箭筈（やはず）。", src: [CS.yamada] },
        {
          text: "當晚沒有翻譯在場。小町谷在 1940 年說，他問過阿波，阿波笑著說「那是偶然」；阿波對大弟子也說只是偶然。",
          tag: "research",
          src: [CS.yamada],
        },
        { text: "在弓術界，射壞自己的箭筈通常被看作應該感到羞恥的失誤，不是值得誇耀的事。", tag: "research", src: [CS.yamada] },
      ],
    },
    {
      title: "「それが射る（It shoots）」",
      points: [
        {
          text: "山田支持德國弓道連盟前會長 Feliks Hoff 的假說：阿波可能只是在 Herrigel 射得好時說了「それでした」（就是這樣），翻譯成德文後，「es」被理解成超越自我的「它」。",
          tag: "research",
          src: [CS.yamada],
        },
        {
          text: "山田也指出，這句稱讚第一次出現時，Herrigel 還在對卷藁（まきわら）練習，連正式射靶的資格都還沒有。",
          tag: "research",
          src: [CS.yamada],
        },
        {
          text: "學者的自我修正：山田原本認為 1936 年論文沒有「It」的概念，英譯修訂時更正——德文原文其實有兩處提到「es」，只是沒有發揮。",
          tag: "research",
          src: [CS.yamada],
        },
      ],
    },
    {
      title: "延伸閱讀",
      points: [
        {
          text: "山田奨治《禅という名の日本丸》（2005）／英譯《Shots in the Dark》（2009）：把《弓與禪》和龍安寺石庭並列，分析「日本文化＝禪」的形象如何在戰後被建構。",
          src: [CS.shotsInDark],
        },
        { text: "山田另有論文探討 Herrigel 回國後與納粹的關係。", src: [CS.yamada] },
      ],
    },
  ],
};

export const ISSHA: LayeredSection = {
  id: "issha",
  title: "「一射絶命」從哪裡來",
  ja: "一射絶命",
  kana: "いっしゃぜつめい",
  intro: [
    "這個詞常被解釋成「每一射都傾注一生的全力」。根據山田奨治引用的傳記研究，它是阿波研造在一次神秘體驗之後提出的核心教義，與「射裡見性（しゃりけんしょう）」並列。",
    "所以它出自阿波研造與他的「大射道教」，不是《弓道教本》或全弓連的官方標語，也不是古傳流派的共同教義。這種專注的精神本身可以欣賞，只是要知道它的來歷。",
  ],
  introSrc: [CS.yamada],
  deep: [
    {
      title: "當時的批評",
      points: [
        { text: "同門前輩大平善藏批評，叫人「一直撐到倒下為止」很愚蠢。", tag: "research", src: [CS.yamada] },
        { text: "本多利實的孫子、後來的本多流宗家本多利時，也批評阿波的射法隨心情而動。", tag: "research", src: [CS.yamada] },
        { text: "小町谷操三自承，遇到難以翻譯的話時，會用「一射絶命、百發聖射」之類的說法帶過。", tag: "research", src: [CS.yamada] },
      ],
    },
    {
      title: "今天的用法",
      points: [{ text: "部分道場把它當作通用的弓道精神，這是後來擴散的用法。", tag: "note" }],
    },
  ],
};

export const ZEN_BALANCE: Point[] = [
  { text: "戰前也有少數團體提倡「射禪」，例如 1923 年大平善藏創立的大日本射覺院；竹林派的流祖也是真言宗僧侶。所以說弓與佛教「完全無關」也過頭了。", src: [CS.yamada] },
  { text: "1983 年對西德 131 名弓道修練者的調查中，約 49% 是讀了 Herrigel 的書才開始學。這本書確實把很多人帶進了弓道。", tag: "research", src: [CS.yamada] },
  {
    text: "現代全弓連弓道的理念主軸，是〈射義〉的「禮」與「反求諸己」、射法八節，以及真善美。",
    tag: "note",
    src: [ANKF.mind, ANKF.history],
  },
];

/* --------------------------------------------------------------- 台灣 */

export const TW_COLONIAL: { when: string; text: string; src: Source[] }[] = [
  { when: "1896 年 1 月", text: "淺井守敏在台北府前街開設「大弓場」，被視為台灣第一座弓道場；同年 8～9 月台北新起街開設「清樂軒大弓場」。", src: [CS.goka2022] },
  { when: "1898", text: "報紙報導大弓流行。大弓場有會員制的鍛鍊型，也有收費的「矢場營業」娛樂型。", src: [CS.goka2022] },
  { when: "1900 年 8 月", text: "武德會台灣支部的前身「地方委員部」在台北、台中、台南設立；1901 年台北設弓術部。", src: [CS.goka2022] },
  { when: "1903", text: "以總督兒玉源太郎捐款的一部分，在台北武德殿設置弓道場。", src: [CS.goka2022] },
  { when: "1915–1916", text: "大日本弓道會設立打狗（高雄）支部、台南支部。", src: [CS.goka2022] },
  { when: "1924", text: "大日本弓道會會長根矢鹿兒與師範大泉成功訪台 33 天，在鐵道部、製糖工廠、學校（台中一中、高雄中學、台北高商等）講演演武；大泉之後定居嘉義推廣。", src: [CS.goka2022] },
  { when: "1933", text: "大日本射覺院進入台北，但難以和大日本弓道會抗衡。", src: [CS.goka2022] },
  { when: "1934", text: "川島堯（1883–1957）成為台灣第一位武德會弓道範士，以台南為據點，在台南第二高等女學校等校教授弓道。", src: [CS.goka2022] },
];

export const TW_COLONIAL_DEEP: Point[] = [
  { text: "弓道會遍及全島，包括西部都市、東部、中央山地與離島；其中大日本弓道會系統約占三成，在全台設有 46 個支部。", tag: "research", src: [CS.goka2022] },
  { text: "南部有大量製糖會社附屬的弓道會。", tag: "research", src: [CS.goka2022] },
  { text: "台南武德殿設有與日本內地相同的「6 人立」弓道場。", tag: "research", src: [CS.goka2022] },
  { text: "武德會台灣支部的弓道是否擴展到地方，目前還無法明確確認。", tag: "disputed", src: [CS.goka2022] },
  { text: "臺灣弓道協會官網提到，日治時期的嘉義女中、嘉義中學都有弓道部。", tag: "local", src: [TAIWAN.home] },
  { text: "部落格「台灣弓道文史研究室」收集了台南第二高女、彰化高女、台中一中等校的弓道照片；資料待與原始史料核對。", tag: "disputed", src: [CS.twBlog] },
  { text: "戰後：多數資料認為弓道活動隨日治結束而消失，「完全中斷」的程度仍待查證。", tag: "disputed", src: [CS.toxophilia, CS.twBlog] },
];

export const TW_TODAY: LayeredSection = {
  id: "tka",
  title: "臺灣弓道協會",
  ja: "Taiwan Kyudo Association",
  intro: [
    "臺灣弓道協會是依《人民團體法》設立的非營利社會團體，主管機關是內政部；章程寫明本會為國際弓道連盟（IKYF）的會員。",
    "在 IKYF 會員名單上，台灣列為「Chinese Taipei：Taiwan Kyudo Association」——這是國際體育組織常見的命名方式，台灣是正式會員。",
    "協會的會館道場是新北市新莊區的藏月弓道場；2019 年協會主辦「第七回亞洲大洋洲弓道講習會暨交流射會」，是該活動第一次在日本以外舉辦。",
  ],
  introSrc: [CS.twOrg, IKYF.members, TAIWAN.home],
  deep: [
    {
      title: "待確認的資訊",
      points: [
        { text: "成立年份（2009）與加入 IKYF 的年份（2014）只出現在個人整理的文章中，協會官網章程頁沒有寫。", tag: "disputed", src: [CS.toxophilia] },
        { text: "藏月弓道場的地址與開放時間，請以協會官網最新公告為準。", tag: "local", src: [TAIWAN.class, TAIWAN.regulations] },
        { text: "台灣會員的審查途徑另有規定，請見協會「審查情報」頁面。", tag: "local", src: [TAIWAN.shinsa] },
      ],
    },
    {
      title: "其他團體（依個人整理的文章，現況未查證）",
      points: [
        { text: "大學社團：東華大學弓道社（2005，被稱為台灣第一個弓道社）、政治大學弓道社（2006）、玄奘大學、淡江大學弓道社等。", tag: "disputed", src: [CS.toxophilia, CS.tkuTimes] },
        { text: "民間道場：岡達弓道社（台中）、山道場（台北）、躾弓會等；竹久弓道場（新北）已停運。", tag: "disputed", src: [CS.toxophilia] },
      ],
    },
  ],
};
