// 禮法與體配頁的各主題（入門／深入兩層）與表格資料。依 docs/research/03。

import type { LayeredSection, Point, Source, Tag } from "../types";
import { ANKF, BUDOKAN, ET, TAIWAN } from "./sources";

/* ───────────── 入門總覽 ───────────── */

export const OVERVIEW: LayeredSection = {
  id: "what-is-taihai",
  title: "什麼是體配",
  ja: "体配",
  kana: "たいはい",
  intro: [
    "體配（たいはい）指射法八節以外的一切舉止：怎麼站、怎麼坐、怎麼走、怎麼行禮，以及從入場到退場的整套進退。射箭之前與之後的每一步，都屬於體配。",
    "它不只是禮貌。全弓連的審查統一基準，在每一個段級都有一欄專門寫「體配」的要求，審查時與射技一起綜合評價。換句話說，走路、坐下、行禮也是考試的一部分。",
    "體配的基礎是「基本體」：4 種基本姿勢與 8 種基本動作。先把這 12 項做穩，再學坐射一手的完整流程，最後才是審查與射禮的細節。",
  ],
  introSrc: [ANKF.terminology, ANKF.probationStandard],
  deep: [
    {
      title: "審查會考什麼",
      points: [
        { text: "審查統一基準的體配欄：初段要求「合乎基本型的姿勢與動作」，弐段要求「執弓の姿勢、矢番え、足の運び」幾乎確實，参段要求「配合呼吸」，四段要求「體配內化、與呼吸協調」，五段要求「合乎規矩的起居進退」並穿和服實施肌脫或襷さばき。", tag: "official", src: [ANKF.probationStandard] },
        { text: "審查是依這些項目「綜合評價」，沒有公開的扣分表。", tag: "official", src: [ANKF.probationStandard] },
        { text: "學科試題也考體配：令和 8 年版四段考「基本体とその動作の注意点」，五段考「基本体の必要性」。", tag: "official", src: [ANKF.written2026] },
      ],
    },
    {
      title: "不要搞混的兩個詞",
      points: [
        { text: "基本体（きほんたい）＝ 4 種基本姿勢＋8 種基本動作，屬於體配。", tag: "official", src: [ANKF.terminology] },
        { text: "基本体型（きほんたいけい）＝「縦横十文字」與「五重十文字」的身體架構，屬於射技。", tag: "official", src: [ANKF.terminology] },
      ],
    },
    {
      title: "這一頁的寫法",
      points: [
        { text: "本站沒有取得《弓道教本》第一卷原文；凡是「教本怎麼寫」，只從全弓連的學科試題與全弓連參與編寫的指導書間接確認。", tag: "note" },
        { text: "每一點都標了來源等級：「官方」是全弓連的規程與用語辭典；「指導書」是全弓連參與編寫的教材，不等於規程條文；「地方／協會」是某地連盟、學校或臺灣弓道協會的做法。", tag: "note" },
        { text: "各道場做法不同時，請以所屬道場與老師的教法為準。", tag: "note" },
      ],
    },
  ],
};

/* ───────────── 執弓の姿勢與持箭 ───────────── */

export const TORIYUMI: LayeredSection = {
  id: "toriyumi-shisei",
  title: "執弓の姿勢",
  ja: "執弓の姿勢",
  kana: "とりゆみのしせい",
  intro: [
    "拿著弓與箭時的正確姿勢。左手持弓、右手持箭，兩個拳頭輕放在腰骨上，雙肘向兩側微微撐開。",
    "弓的上端（末弭 うらはず）放在身體正前方中央、離地約 10 公分；箭尖朝向末弭的方向。從正面看，弓與箭的延長線形成一個二等邊三角形。",
    "審查統一基準在弐段的體配欄，第一項就是「執弓の姿勢」。走路、轉向、坐下時都要保持這個姿勢不散。",
  ],
  introSrc: [ANKF.terminology, BUDOKAN.ch4, BUDOKAN.ch5, ANKF.probationStandard],
  deep: [
    {
      title: "逐項檢查",
      points: [
        { text: "兩腳間距男子約 3 公分、女子併攏；視線約 4 公尺前方。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
        { text: "雙拳放在腰骨的位置。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
        { text: "雙肘向兩側撐開，不要跑到身體側線的後方。", tag: "guide", src: [BUDOKAN.ch5, ET.miyazaki] },
        { text: "末弭在身體前方中央、離地約 10 公分，行進中不上下晃動。宮崎縣手冊寫成「約一個拳頭」。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6, ET.miyazaki] },
        { text: "從側面看，弓與箭在同一個平面上；站姿與坐姿時弓與箭的夾角不同。", tag: "local", src: [ET.miyazaki] },
        { text: "末弭可以著地的時機：坐下（正坐、跪坐、坐椅子）時，以及返弦時。", tag: "local", src: [ET.miyazaki] },
      ],
    },
    {
      title: "常見問題（對應弐段的基準）",
      points: [
        { text: "末弭晃動或碰地；雙拳離開腰骨；手肘夾太緊；弓與箭不在同一平面。這些是指導現場常見的提醒，不是官方扣分表。", tag: "note", src: [ANKF.probationStandard, ET.miyazaki] },
      ],
    },
  ],
};

export interface YaHoldRow {
  item: string;
  bu: string;
  rei: string;
}

/** 持箭的兩種方式（與足踏み、矢番え連動）。 */
export const YA_HOLD: YaHoldRow[] = [
  { item: "持箭", bu: "小指與無名指握住、拇指食指輕壓，箭頭（板付）不露出", rei: "握在箭頭後方約 10 公分（射付節 いつけぶし）附近，箭頭露在前方" },
  { item: "足踏み", bu: "二足（分兩步踏開）", rei: "一足（一步踏開）" },
  { item: "矢番え的送箭", bu: "二度送り：先握箭中段送到弦，再握筈送一次", rei: "一度送り：右手沿箭滑到筈，一次送到弦" },
  { item: "乙矢夾的位置", bu: "中指與無名指之間", rei: "無名指與小指之間" },
];

export const YA_HOLD_NOTES: Point[] = [
  { text: "指導書只寫「持箭方式不同 → 足踏み二足／一足」，沒有用「武射系／禮射系」這兩個名稱。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
  { text: "「武射系／禮射系」的名稱出自宮崎縣手冊，並寫明「哪一種都可以，但不能混用」。", tag: "local", src: [ET.miyazaki] },
  { text: "常聽說禮射系承自小笠原流、武射系承自日置流；本站沒有找到一手來源確認這種對應。", tag: "disputed" },
  { text: "實際用哪一種，請照所屬道場的教法，並從頭到尾保持一致。", tag: "note" },
];

/* ───────────── 立射與坐射 ───────────── */

export interface CompareRow {
  item: string;
  a: string;
  b: string;
  tag?: Tag;
  src?: Source[];
}

export const ZASHA_VS_RISSHA: CompareRow[] = [
  { item: "定義", a: "在本座坐下行禮，起身走到射位，跪坐搭箭，站起來射", b: "站著進入射位、站著搭箭、站著拉弓", tag: "official", src: [ANKF.terminology] },
  { item: "本座到射位", a: "3 步（近的標準 2.0 m）", b: "2 步", tag: "official", src: [ANKF.terminology, ANKF.playRules] },
  { item: "本座的揖", a: "跪坐，全員一起揖（三息）", b: "站著，全員一起揖（三息）", tag: "official", src: [ANKF.playRules] },
  { item: "射位", a: "跪坐 → 開き足轉向脇正面 → 立弓、搭箭", b: "轉向脇正面 → 起弓、搭箭", tag: "official", src: [ANKF.playRules] },
  { item: "前一組還在射時", a: "在本座跪坐等候", b: "在本座前一步站著等（可用椅子）", tag: "official", src: [ANKF.playRules] },
  { item: "何時使用", a: "審查與近的競技的原則", b: "坐射有困難時可依手續改立射；中央審查也有立射受審申請", tag: "official", src: [ANKF.probationRules, ANKF.playRules, ET.documents] },
];

export const RISSHA_MATCH: Point[] = [
  { text: "在本座，坐射者為了肌脫（或襷）做開き足時，立射者不看靶，同時打開腳，雙手把弓立在正面。", tag: "official", src: [ANKF.rissha] },
  { text: "坐射者在本座「腰を切る」起身時，立射者稍微前移，對齊隊列。", tag: "official", src: [ANKF.rissha] },
  { text: "坐射者在射位用開き足轉向脇正面時，立射者看靶做足踏み。", tag: "official", src: [ANKF.rissha] },
  { text: "坐射者矢番え時，立射者在肩的高度矢番え（臉在弓與弦之間），之後把本弭放在左膝頭。", tag: "official", src: [ANKF.rissha] },
  { text: "坐射者起身時，立射者做取矢（乙矢時做弦調べ），聽前一人的弦音取懸け。", tag: "official", src: [ANKF.rissha] },
  { text: "甲矢射完、物見返し後，一邊轉向的正面一邊合上足踏み，退回本座；末弭不碰地，換手拿箭。", tag: "official", src: [ANKF.rissha] },
  { text: "聽落（最後一位）的弦音再進射位射乙矢，然後退場。", tag: "official", src: [ANKF.rissha] },
];

export const RISSHA: LayeredSection = {
  id: "rissha-zasha",
  title: "立射與坐射",
  ja: "立射・坐射",
  kana: "りっしゃ・ざしゃ",
  intro: [
    "坐射（ざしゃ）在本座與射位都要跪坐，搭箭也在跪坐中完成；立射（りっしゃ）全程站著。審查與近的競技以坐射為原則。",
    "膝蓋或身體不便、坐射有困難的人，可以依手續改用立射。立射是正式承認的形式，不是「偷懶版」。",
    "同一組裡有立射也有坐射時，規則很清楚：「立射的射手要配合坐射射手的動作」。",
  ],
  introSrc: [ANKF.terminology, ANKF.probationRules, ANKF.probationGyosha, ANKF.rissha],
  deep: [
    {
      title: "立射版流程的不同處（競技規則）",
      points: [
        { text: "本座「站著全員一起揖」；前一組還在射時，在本座前一步站著等（可用椅子）。", tag: "official", src: [ANKF.playRules] },
        { text: "射位「轉向脇正面、起弓、搭箭」；射完後「搭好箭等候」。", tag: "official", src: [ANKF.playRules] },
        { text: "運營要領：立射時聽「起立」從椅子起身到本座，聽「始め」揖後前往射位。", tag: "official", src: [ET.operation] },
      ],
    },
    {
      title: "立射進射位的步法：說法不同",
      points: [
        { text: "宮崎縣手冊：腳尖對齊本座線，第 1 步左腳大步，第 2 步右腳到射位，第 3 步左腳踏到足踏み位置，再定右腳；身體面向脇正面與足踏み完成同時。", tag: "local", src: [ET.miyazaki] },
        { text: "指導書（學校授業）：本座揖後左、右腳進到射位，左腳朝脇正面踏出半步，看著右腳腳下再踏開半步。", tag: "guide", src: [BUDOKAN.ch5] },
        { text: "兩者的步數細節不同，請以所屬道場的教法為準。", tag: "disputed" },
      ],
    },
  ],
};

/* ───────────── 審查 ───────────── */

export const SHINSA: LayeredSection = {
  id: "shinsa-basics",
  title: "審查的射場與規定",
  ja: "審査",
  kana: "しんさ",
  intro: [
    "審查的射場是近的、5 人一組（5 人立）、以坐射為原則，用直徑 36 公分的霞的。",
    "整組 5 人的動作靠「弦音（つるね）」接力：前面的人放箭的弦聲，就是後面的人起身、扣弦的信號。記住一句話：聽前兩人的弦音起身，聽前一人的弦音取懸け。",
    "服裝：教士、錬士與五段以上穿和服；其他原則上穿弓道衣。",
  ],
  introSrc: [ANKF.probationRules, ANKF.probationGyosha],
  deep: [
    {
      title: "審查規程的其他規定",
      points: [
        { text: "每個射場的行射審查委員 5 名（目前可為 3 名），學科審查委員 1 名以上。", tag: "official", src: [ANKF.probationRules] },
        { text: "六段到初段依行射與學科綜合判定；級位只看行射。", tag: "official", src: [ANKF.probationRules] },
        { text: "及格：六段、五段要行射 7 成以上得票＋學科 60 分以上；四段以下行射 5 成以上＋學科 60 分以上；級位行射 5 成以上。", tag: "official", src: [ANKF.probationRules] },
        { text: "受付時間遲到或叫號不應，視為棄權，審查費不退。", tag: "official", src: [ANKF.probationRules] },
      ],
    },
    {
      title: "行射要領的注意事項",
      points: [
        { text: "入退場時一定要留意上座，依序行禮（揖）。", tag: "official", src: [ANKF.probationGyosha] },
        { text: "下一組在 3 番的乙矢弦音時入場，進本座跪坐；5 番的弦音時一起揖；最後的射手後退時前往射位。", tag: "official", src: [ANKF.probationGyosha] },
        { text: "行射前後的動作不要刻意拖延（殊更に間延びしない）。", tag: "official", src: [ANKF.probationGyosha] },
        { text: "和服受審：本座揖後轉向脇正面，男子肌脫、女子襷さばき，再轉回的正面前往射位。", tag: "official", src: [ANKF.probationGyosha] },
      ],
    },
    {
      title: "學科也考體配",
      points: [
        { text: "地方與連合審查的學科題目事先公開；令和 8 年版（2026）四段考「基本体とその動作の注意点」，五段考「基本体の必要性」「基本体型について」。", tag: "official", src: [ANKF.written2026] },
        { text: "令和 2 年版還出過：基本姿勢與動作（無指定・初段）、執弓の姿勢與坐射／立射的矢番え（弐段）、取り矢的方法（参段）、失的處理三原則（四段）、肌脫或襷さばき的注意點與持弓矢的坐禮（五段）。", tag: "official", src: [ET.written2020] },
        { text: "台灣：臺灣弓道協會說明每次學科從 A 表、B 表各選一題作答。", tag: "local", src: [TAIWAN.shinsa] },
      ],
    },
  ],
};

/** 5 人立 行射要領（審查規程別表 2）：每一格是「信號」。 */
export interface GyoshaRow {
  phase: string;
  cells: [string, string, string, string, string];
}

export const GYOSHA: GyoshaRow[] = [
  { phase: "甲矢・起身", cells: ["不間斷，直接行射", "1 番胴造り快結束時", "1 番的弦音", "2 番的弦音", "3 番的弦音"] },
  { phase: "甲矢・取懸け", cells: ["—", "1 番的弦音（取懸け、打起し）", "2 番的弦音", "3 番的弦音", "4 番的弦音"] },
  { phase: "乙矢・立弓搭箭", cells: ["4 番的弦音", "4 番的弦音", "4 番的弦音", "5 番的弦音", "射完甲矢立刻"] },
  { phase: "乙矢・起身", cells: ["5 番的弦音，不間斷行射", "1 番胴造り快結束時", "1 番的弦音", "2 番的弦音", "3 番的弦音"] },
  { phase: "乙矢・取懸け", cells: ["—", "1 番的弦音", "2 番的弦音", "3 番的弦音", "4 番的弦音"] },
];

export const POSITIONS = ["1 番（大前）", "2 番", "3 番", "4 番", "5 番（落）"] as const;

export interface StandardRow {
  grade: string;
  ja: string;
  zh: string;
  note?: string;
}

/** 審查統一基準（五段以下）的體配欄。 */
export const STANDARD: StandardRow[] = [
  { grade: "五段", ja: "規矩に適った起居進退身につき、落ち着きある容儀、態度。和服着用、肌脱ぎ又は襷さばき（坐射）の実施。", zh: "合乎規矩的起居進退已經內化，儀容態度沉穩；穿和服，實施肌脫或襷さばき（坐射）。", note: "射技欄另有「與體配相輔相成的品位與格調」。" },
  { grade: "四段", ja: "体配身につき、息合いとの協応。適正な行射の運行（審査の要領、射手相互の間、失の処理など）。", zh: "體配已經內化，與呼吸協調；行射運行適當（審查要領、射手之間的間合、失的處理等）。" },
  { grade: "参段", ja: "呼吸に合せた基本の姿勢・動作の実施。落ち着きある態度。目づかい。審査の要領に則った行射。", zh: "配合呼吸做基本姿勢與動作；態度沉穩；目づかい（視線的運用）；依審查要領行射。" },
  { grade: "弐段", ja: "執弓の姿勢、矢番え、足の運びなど基本の姿勢・動作のほぼ確実な実施。", zh: "執弓姿勢、搭箭、步法等基本姿勢與動作幾乎確實。", note: "射技欄末有「的中不問」（不問中靶與否）。備考：筈こぼれ以剩下 1 射評價，2 射都掉則不合格（弐段～初段共通）。" },
  { grade: "初段", ja: "基本の型に適った姿勢、動作。節度ある態度。", zh: "合乎基本型的姿勢與動作；有節度的態度。", note: "射技欄有「弓倒し後の崩れのない姿勢」「矢枕落ち不問」。" },
  { grade: "一級", ja: "概ね基本の型に適った姿勢、動作。弓矢の取扱い。", zh: "大致合乎基本型的姿勢與動作；弓矢的處理。" },
  { grade: "二級", ja: "三級に比し相当進歩した姿勢、動作。", zh: "姿勢與動作比三級明顯進步。", note: "備考：筈こぼれ以剩下 1 射判定；2 射都掉再射 1 射，3 次則不合格（級位共通）。" },
  { grade: "三級", ja: "基本動作や弓矢の扱い方が指導に従って概ねできること。", zh: "能依指導大致做到基本動作與弓矢的處理。" },
  { grade: "四級", ja: "道場内の行動や弓矢の扱い方に進歩が見られること。矢を安全に飛ばすことができること。", zh: "道場內的舉止與弓矢處理有進步；能安全地把箭射出。" },
];

export const SHAREI: LayeredSection = {
  id: "sharei",
  title: "射禮",
  ja: "射礼",
  kana: "しゃれい",
  intro: [
    "射禮是把射的基本態度、動作與射技，以儀式的形式呈現。射會開始時最先進行的射禮叫「矢渡（やわたし）」。",
    "高段的審查也會用到射禮：教士與七段的第二次審查原則上用「一つ的射礼」（一個靶由數人輪流射），錬士則原則上用「持的射礼」（每位射手各有自己的靶）。",
  ],
  introSrc: [ANKF.terminology, ANKF.probationRules],
  deep: [
    {
      title: "本站目前只寫到這裡",
      points: [
        { text: "介添え（かいぞえ）：射禮時輔助射手的人。", tag: "official", src: [ANKF.terminology] },
        { text: "矢渡通常由 1 名射手與 2 名介添進行，介添協助肌脫或襷，並取回箭；這是個人筆記的說法，本站未見官方原文。", tag: "folk", src: [ET.toxSharei] },
        { text: "射禮的完整流程（定めの座、介添的動作、矢渡的口令）只寫在《弓道教本》與《弓礼・弓法問答集》，本站沒有取得原文，所以不寫步驟。", tag: "disputed" },
      ],
    },
  ],
};

/* ───────────── 道場禮儀 ───────────── */

export const DOJO_ENTER: LayeredSection = {
  id: "dojo-enter",
  title: "進出道場、上座與神棚",
  ja: "上座・神棚",
  kana: "かみざ・かみだな",
  intro: [
    "進出道場、射場時行禮；鞋子脫下後排整齊。上課開始與結束時問候。",
    "射場的進退一定要「留意上座」——這是規程裡唯一明寫、一定要做的上座禮意。上座在哪一側，每個道場的配置不同，第一次去時先問清楚。",
    "向神棚怎麼行禮（立禮、坐禮、拍不拍手），指導書明寫「依各道場的作法」，沒有全國統一的規定。",
  ],
  introSrc: [BUDOKAN.ch4, BUDOKAN.ch6, ANKF.playRules, ANKF.probationGyosha],
  deep: [
    {
      title: "各方的寫法",
      points: [
        { text: "指導書：把鞋子排好；進出射場、行射開始與結束時問候。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
        { text: "臺灣藏月弓道場：進出道場、射場與卷藁區時應確實行禮；弓道教室集合行禮時，同時段自主練習的人也要一起入列。", tag: "local", src: [TAIWAN.regulations] },
        { text: "錬士五段池田友行：進道場時一禮、把鞋排好，「以禮始，以禮終」（礼に始まり礼に終わる）；禮的意思是向道場、老師、弓友說「請多指教」。", tag: "folk", src: [ET.ikeda] },
        { text: "上座常被說是神棚或國旗所在的一側，射場的脇正面一般就是上座；這是百科類網站的說法，各道場配置不同。", tag: "folk", src: [ET.wikid] },
        { text: "「二禮二拍手一拜」是神社或部分道場的做法，不能寫成弓道的規定；劍道方面的研究提到，道場向神前行禮有立禮、坐禮、神道式等多種形式。", tag: "note", src: [ET.kokushikanKendo] },
      ],
    },
  ],
};

export const DOJO_OTHERS: LayeredSection = {
  id: "dojo-others",
  title: "對老師、對其他射手",
  intro: [
    "不要隨便指導別人。藏月弓道場的規範寫明：除非有緊急的安全疑慮，不應主動指導或教學，以免影響行射者。",
    "有人正在拉弓時保持安靜。藏月弓道場也提醒，有人中靶時避免喝彩，以尊重行射者。",
  ],
  introSrc: [TAIWAN.regulations, ANKF.playRules],
  deep: [
    {
      title: "規程與指導書怎麼說",
      points: [
        { text: "全弓連規程沒有成文的「對先輩」禮節。指導書寫的是指導倫理：絕對不可性騷擾、權勢騷擾或暴力；指導時要碰觸學生身體，須先取得本人同意。", tag: "guide", src: [BUDOKAN.ch2] },
        { text: "競技規則：選手在射場不能求取或接受建議，不能發出不必要的聲音；觀眾只能聲援與拍手，射手進入「会」時要保持安靜。", tag: "official", src: [ANKF.playRules] },
        { text: "日本有些道場會在中靶時喊「よし」，本站未查證，各地不同。", tag: "disputed" },
      ],
    },
  ],
};

export interface YatoriLine {
  who: "射場" | "看的" | "安土區" | "指導者" | "學生" | "動作";
  text: string;
  ja?: boolean;
}

export interface YatoriVersion {
  id: string;
  title: string;
  tag: Tag;
  src: Source[];
  lines: YatoriLine[];
  note?: string;
}

export const YATORI: YatoriVersion[] = [
  {
    id: "guide2",
    title: "指導書第Ⅱ章〈危險防止與安全對策〉",
    tag: "guide",
    src: [BUDOKAN.ch2],
    lines: [
      { who: "射場", text: "矢取り、お願いします", ja: true },
      { who: "看的", text: "矢取り入ります", ja: true },
      { who: "動作", text: "掛出赤旗" },
      { who: "射場", text: "お願いします", ja: true },
      { who: "動作", text: "取箭 → 收赤旗" },
      { who: "射場", text: "以「始め」的口令重新開始行射" },
    ],
    note: "同一本指導書第Ⅳ章（町道場）的第 4 步寫成「矢取りしてください」。",
  },
  {
    id: "guide5",
    title: "指導書第Ⅴ章（學校授業）",
    tag: "guide",
    src: [BUDOKAN.ch5],
    lines: [
      { who: "指導者", text: "矢取りお願いします", ja: true },
      { who: "動作", text: "掛出赤旗" },
      { who: "學生", text: "矢取りします", ja: true },
      { who: "指導者", text: "お願いします", ja: true },
    ],
    note: "授業版由指導者發起；同章另一段的順序是先「お願いします」再「矢取りします」。",
  },
  {
    id: "zogetsu",
    title: "臺灣藏月弓道場",
    tag: "local",
    src: [TAIWAN.regulations],
    lines: [
      { who: "射場", text: "yatori（矢取り）" },
      { who: "安土區", text: "拍手兩下後「放下紅旗」" },
      { who: "射場", text: "onegaishimasu（お願いします）" },
      { who: "安土區", text: "視線向射場確認後，才開始取箭" },
    ],
    note: "取箭者 2～3 人同行，在安土區外等候；建議每個靶約 6 支箭時就準備取箭；課堂上要把箭全部取回。原文「放下紅旗」可能是「把紅旗放出來」的意思，語意請向協會確認。",
  },
  {
    id: "aichi",
    title: "愛知縣武道館講習會（個人筆記）",
    tag: "folk",
    src: [ET.toxYatori],
    lines: [
      { who: "看的", text: "等候者拍手兩下" },
      { who: "指導者", text: "矢取り、お願いします！", ja: true },
      { who: "看的", text: "入ります。", ja: true },
      { who: "動作", text: "舉紅旗進入，全員取完一起回來" },
      { who: "看的", text: "最後一人放下紅旗：「どうぞ！」", ja: true },
    ],
    note: "指導者確認沒有人在矢道上，才重新開始。",
  },
];

export const YATORI_SECTION: LayeredSection = {
  id: "yatori",
  title: "矢取り：取箭的對答",
  ja: "矢取り",
  kana: "やとり",
  intro: [
    "到靶前取箭叫矢取り。射場與靶場（看的）之間一定要「出聲、確認、掛紅旗」，因為一旦有人在矢道或靶前，射場絕對不能有人放箭。",
    "「矢取り（お願いします）」「入ります」是最常見的核心用語，但完整的對答各道場不同，連同一本指導書裡就有三種版本。下面列出幾個版本當範例，請以所屬道場的規定為準。",
  ],
  introSrc: [BUDOKAN.ch2, BUDOKAN.ch4, BUDOKAN.ch5, TAIWAN.regulations],
  deep: [
    {
      title: "拔箭的方法（指導書）",
      points: [
        { text: "先確認周圍安全。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
        { text: "中靶的箭：左手按住靶，右手握住箭的根部，沿著箭的方向（矢筋）拔出。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
        { text: "拔出的箭羽毛朝前，換到左手拿；拔完後右手拿箭頭部分、左手拿箭的中段退出，並擦掉箭上的土。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
        { text: "回程時羽毛朝矢道方向。", tag: "guide", src: [BUDOKAN.ch4] },
      ],
    },
    {
      title: "禁止事項",
      points: [
        { text: "在看的所不要探頭看射場。", tag: "guide", src: [BUDOKAN.ch4] },
        { text: "赤旗掛出期間，射場不得取懸け。", tag: "guide", src: [BUDOKAN.ch4] },
        { text: "競技會：的前人員先掛赤旗、確認安全，才能進入的前與矢道；矢取り結束、安全確保後才撤旗。", tag: "official", src: [ANKF.playRules, ET.operation] },
      ],
    },
  ],
};

export const DOJO_YUMI: LayeredSection = {
  id: "yumi-matagu",
  title: "不可跨弓與弓具的擺放",
  ja: "弓具をまたがない",
  kana: "きゅうぐをまたがない",
  intro: [
    "不要跨過放在地上的弓具。這一條寫在指導書（學校授業）的安全注意事項裡。",
    "指導書只列出規則，沒有寫理由。網路上「弓有靈性，跨弓不敬」之類的精神性解釋屬坊間說法；從安全與器材保護（踩到、絆倒、弓受損）來理解比較穩妥。",
  ],
  introSrc: [BUDOKAN.ch5],
  deep: [
    {
      title: "同一份清單的其他項目",
      points: [
        { text: "愛護弓具；不嬉鬧、不大聲；箭尖不朝人；沒有通報不進的前；在指導者之下練習；不靠近正在拉弓的人。", tag: "guide", src: [BUDOKAN.ch5] },
        { text: "不要把本弭當拐杖拄地，會磨損而掛不住弦。", tag: "guide", src: [BUDOKAN.ch2] },
        { text: "弓立て（ゆみたて）：立弓用的器具。", tag: "official", src: [ANKF.terminology] },
      ],
    },
  ],
};

export interface DressRow {
  item: string;
  text: string;
  tag: Tag;
  src?: Source[];
}

export const DRESS: DressRow[] = [
  { item: "競技", text: "弓道衣（筒袖、袴、白足袋）或和服（着物、袴、白足袋）", tag: "official", src: [ANKF.playRules] },
  { item: "審查", text: "教士、錬士與五段以上穿和服；其他原則上弓道衣", tag: "official", src: [ANKF.probationRules] },
  { item: "筒袖與內衣", text: "筒袖長度以到手肘左右為宜；內衣無花紋，有領或高領不理想", tag: "official", src: [ANKF.playRules] },
  { item: "袴", text: "男子一般有腰板、女子一般沒有；行燈袴不理想；袴擺最好在足踏み時不碰地", tag: "official", src: [ANKF.playRules] },
  { item: "初學者（競技規則）", text: "可穿運動服，但避免前排扣、前拉鍊", tag: "official", src: [ANKF.playRules] },
  { item: "體驗、見學", text: "運動服、襪子或足袋，方便活動即可", tag: "official", src: [ET.begin] },
  { item: "頭髮", text: "長髮綁起，不用髮夾", tag: "guide", src: [BUDOKAN.ch2] },
  { item: "台灣・藏月弓道場", text: "上白下黑的弓道服（或和服）與白足袋，勿穿絲襪或其他顏色的襪子；還沒買衣服的人穿有袖白上衣與過膝黑長褲", tag: "local", src: [TAIWAN.regulations] },
  { item: "台灣・弓道教室", text: "初級可穿深色運動長褲、白色或淺色上衣；不可穿無袖上衣與有扣子的襯衫", tag: "local", src: [ET.twQna] },
];

export const DRESS_SECTION: LayeredSection = {
  id: "dress",
  title: "服裝",
  ja: "服装",
  kana: "ふくそう",
  intro: [
    "基本是白色上衣（筒袖）、黑色袴、白足袋。剛開始上課通常不必馬上買道衣，穿方便活動、沒有前排扣的衣服即可，細節依道場或課程規定。",
    "有些日本道場明文禁止赤腳、要穿足袋；臺灣藏月弓道場也要求白足袋。",
  ],
  introSrc: [ANKF.playRules, TAIWAN.regulations, ET.twQna, ET.ikeda, ET.shinagawa],
  deep: [
    {
      title: "還沒寫的部分",
      points: [
        { text: "袴紐的打法（男子十文字、女子蝶結び等）與和服的穿法屬於著裝技術，本站沒有找到全弓連文件，目前不寫。", tag: "disputed" },
      ],
    },
  ],
};

/* ───────────── 安全與失 ───────────── */

export const SAFETY: LayeredSection = {
  id: "safety-rules",
  title: "安全規則",
  ja: "危険防止",
  kana: "きけんぼうし",
  intro: [
    "弓道用的是真的箭，安全規則沒有例外：絕對不朝人拉弓（徒手練習、橡皮弓也一樣）；不進矢道；赤旗掛出時立刻停止行射。",
    "全弓連沒有一份獨立的「安全指南」，可以引用的規定散見於競技規則第 45 條與指導書〈危險防止與安全對策〉。",
  ],
  introSrc: [ANKF.playRules, BUDOKAN.ch2],
  deep: [
    {
      title: "競技規則第 45 條（危險防止）",
      points: [
        { text: "要掛出 50 公分見方以上的赤旗以確保安全。", tag: "official", src: [ANKF.playRules] },
        { text: "行射中靶前掛出赤旗時，選手必須安全而迅速地中斷行射；赤旗掛出期間不得讓選手行射。", tag: "official", src: [ANKF.playRules] },
        { text: "射場審判委員看到危險的行射，要提醒選手。", tag: "official", src: [ANKF.playRules] },
      ],
    },
    {
      title: "指導書：行射與器材",
      points: [
        { text: "沒有指導者許可，不在的前拉弓；射位間距以 180 公分為標準，不在太窄的地方拉弓。", tag: "guide", src: [BUDOKAN.ch2] },
        { text: "素引き（空拉）後不放弦，慢慢收回；不搭箭就放弦會斷弦，或打到臉與左臂。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch6] },
        { text: "不要把自己的弓伸進前一人的弓與弦之間；不拿巻藁用的箭上的前。", tag: "guide", src: [BUDOKAN.ch2] },
        { text: "巻藁後方與左右近處絕對不可有人；舊巻藁中心變硬，箭會彈回，近距離射很危險。", tag: "guide", src: [BUDOKAN.ch2] },
        { text: "搭箭不要搭太低，離れ時可能傷到拇指。", tag: "guide", src: [BUDOKAN.ch2] },
        { text: "筈或箭桿有傷、沒有箭頭的箭不用；箭的長度用自己的矢束再加一點。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch3] },
      ],
    },
  ],
};

export const SHITSU: LayeredSection = {
  id: "shitsu",
  title: "「失」的處理",
  ja: "失",
  kana: "しつ",
  intro: [
    "失（しつ）指斷弦、筈こぼれ（搭好的箭從弦上脫落）、掉弓等失態。審查的四段基準就寫了「失的處理」，處理得好不好也是體配的一部分。",
    "原則是：依場合合乎禮法地處理、迅速不拖延；指導書寫的是處理完回到射位，向正面揖表示歉意。",
  ],
  introSrc: [ANKF.terminology, ANKF.probationStandard, BUDOKAN.ch4],
  deep: [
    {
      title: "失的處理三原則（轉述）",
      points: [
        { text: "① 依時間、場所、位置，合乎禮法地適當處理；② 迅速處理，不給他人造成困擾；③ 處理後回到射位揖，表示歉意（轉述寫「轉向脇正面」，指導書寫「向正面」）。這三點出自《弓礼・弓法問答集》，本站只見到個人筆記的中文轉述，日文原文待查。", tag: "disputed", src: [ET.toxShitsu] },
        { text: "多件物品掉落時的撿拾順序「弓＞矢＞弦」、距離不同時從近的開始，同樣只見轉述。", tag: "disputed", src: [ET.toxShitsu] },
        { text: "全弓連學科（四段）考過「失の処理の三原則」。", tag: "official", src: [ET.written2020] },
      ],
    },
    {
      title: "弓返り不是失",
      points: [
        { text: "審查統一基準把「正確的弓返り」列為四段的射技要求。", tag: "official", src: [ANKF.probationStandard] },
        { text: "弓返り時弓脫手掉落，才算弓落とし（失）。", tag: "note" },
      ],
    },
  ],
};

export interface ShitsuRow {
  case: string;
  handle: string;
  tag: Tag;
  src: Source[];
}

export const SHITSU_TABLE: ShitsuRow[] = [
  { case: "搭好箭（右手放回腰）後筈脫落", handle: "算「失」，不重射；競技中這支箭無效，算未中", tag: "official", src: [BUDOKAN.ch4, ANKF.playRules] },
  { case: "取懸け後筈脫落", handle: "不重射", tag: "guide", src: [BUDOKAN.ch4] },
  { case: "甲矢掉落", handle: "當場（遠則走近）跪坐，乙矢換到左手，右手撿起甲矢與乙矢對齊後換回右手；回到射位向正面揖表示歉意，箭頭朝靶的方向放在右膝旁", tag: "guide", src: [BUDOKAN.ch4] },
  { case: "乙矢掉落", handle: "撿起，回到射位，揖後退場", tag: "guide", src: [BUDOKAN.ch4] },
  { case: "筈こぼれ（競技）", handle: "跪坐撿起放在右前方，由進行委員迅速來收；若是該組最後一支箭，自己拿著退場", tag: "local", src: [ET.miyazaki, ET.operation] },
  { case: "弦切れ（斷弦）", handle: "箭換到左手，右手撿起斷弦繞在左手指上，與弓一起拿，箭換回右手，回到射位", tag: "guide", src: [BUDOKAN.ch4, ET.miyazaki] },
  { case: "弦飛到場外", handle: "弓搆得到時走到適當位置跪坐，用末弭把弦勾回；試一次拿不到就退回射位；太遠不用去撿", tag: "local", src: [ET.miyazaki] },
  { case: "弓落とし（掉弓）", handle: "走近弓、跪坐，把弦轉到外側再拿起", tag: "guide", src: [BUDOKAN.ch4] },
  { case: "走向掉落物", handle: "遠離物品那一腳靠到另一腳，跪坐或膝行撿；遠的走過去再跪坐", tag: "local", src: [ET.miyazaki] },
  { case: "審查中的筈こぼれ", handle: "弐段～初段：以剩下 1 射評價，2 射都掉則不合格。級位：剩 1 射判定，2 射都掉再射 1 射，3 次則不合格", tag: "official", src: [ANKF.probationStandard] },
  { case: "有時間限制的競技", handle: "失不會延長時間，要在制限時間內處理完", tag: "official", src: [ANKF.playRules] },
];
