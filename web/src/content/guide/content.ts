// 入門指南 (/guide) content. Based on docs/research/04 ch.3–5, 7, 9 and docs/research/03 §4.
// Every claim carries a tag and sources; uncertain items are tagged "disputed".

import { ANKF, BUDOKAN, TAIWAN, IKYF } from "../common-sources";
import type { Block, LayeredSection, Point, Source, Tag } from "../types";
import { ANKF_X, CARRY, CLUB, EXAMPLES, INJURY, IKYF_X, PRICE, SHINSA_X, TW_X } from "./sources";

/* ------------------------------------------------------------------ */
/* 你的弓道第一年：練習進程                                              */
/* ------------------------------------------------------------------ */

export interface RoadStep {
  id: string;
  zh: string;
  ja?: string;
  kana?: string;
  what: string;
  /** a safety point that belongs to this stage */
  safety?: string;
  tag: Tag;
  src: Source[];
}

export const ROADMAP: RoadStep[] = [
  {
    id: "taiken",
    zh: "體驗課・見學",
    what: "先到道場看看、上體驗課。全弓連說初學者多半可以借用道場的器材，在台灣，臺灣弓道協會的弓道教室也提供公用弓、箭、弽（ゆがけ）。",
    tag: "official",
    src: [ANKF.faq, TAIWAN.class],
  },
  {
    id: "toshu",
    zh: "徒手練習",
    ja: "徒手",
    kana: "としゅ",
    what: "什麼都不拿，只用身體練射法八節的順序與姿勢。全弓連的說明就是「從徒手體操開始」。",
    safety: "徒手也絕對不對著別人做，模仿也不行。",
    tag: "official",
    src: [ANKF_X.improve, BUDOKAN.ch2],
  },
  {
    id: "gomu",
    zh: "紐弓・橡皮弓",
    ja: "紐弓・ゴム弓",
    kana: "ひもゆみ・ゴムゆみ",
    what: "紐弓是一條約 150 cm 的繩子，用來確認足踏み的寬度與射法順序；ゴム弓（橡皮筋練習弓）則確認「有阻力時還能照形拉」。上級者也會用ゴム弓檢查射形、練肌力。",
    safety: "橡皮要套在外側再拉；同樣不可對人。",
    tag: "guide",
    src: [BUDOKAN.ch4, ANKF_X.improve],
  },
  {
    id: "subiki",
    zh: "空拉",
    ja: "素引き",
    kana: "すびき",
    what: "拿真弓拉到「會」，但不搭箭、不放弦，再慢慢把弦送回去。先學手の内（てのうち：握弓的手法），再培養平衡感。",
    safety: "素引き絕不放弦。空放可能讓弦斷掉，或打到臉與左臂。",
    tag: "guide",
    src: [ANKF_X.subiki, BUDOKAN.ch2, BUDOKAN.ch4],
  },
  {
    id: "makiwara",
    zh: "近距離草靶",
    ja: "巻藁",
    kana: "まきわら",
    what: "對著一捆草靶近距離射。指導書的分段是：拉 30 cm 放 → 拉到臉放 → 拉到耳放 → 拉到「會」再放。距離約一張弓長，「和的前一樣重要」。",
    safety: "巻藁後方與左右絕對不能有人；巻藁用的箭不能拿去射的。",
    tag: "guide",
    src: [BUDOKAN.ch4, BUDOKAN.ch2],
  },
  {
    id: "matomae",
    zh: "射靶",
    ja: "的前",
    kana: "まとまえ",
    what: "站上射場射靶。指導書的順序是先 15 m，再到正式的近的 28 m。",
    safety: "沒有指導者許可，不在的前拉弓。",
    tag: "guide",
    src: [BUDOKAN.ch4, BUDOKAN.ch2],
  },
  {
    id: "shodan",
    zh: "初段審查",
    ja: "初段",
    kana: "しょだん",
    what: "第一個段位。審查規程的初段基準是「射型、體配合乎規範，達到矢所不亂的程度」，是質性描述，沒有規定要練多久。",
    tag: "official",
    src: [ANKF.probationRules, ANKF.probationStandard],
  },
];

export interface TimingExample {
  who: string;
  kind: string;
  text: string;
  src: Source[];
}

/** 「多久能上的前」的社團實例（不是標準） */
export const TIMING_EXAMPLES: TimingExample[] = [
  { who: "全日本弓道連盟", kind: "官方", text: "「個人差異很大」，沒有給具體時間。", src: [ANKF.faq] },
  { who: "北海道大學弓道部", kind: "大學社團", text: "大約 1～2 個月就能上的前；有經驗者也一樣從徒手開始。", src: [EXAMPLES.hokudai] },
  { who: "北越高校弓道部", kind: "高中社團", text: "從ゴム弓開始，「這 3～4 個月的累積最重要」；每次出席、基礎紮實的人，快的話 7 月上的前。", src: [EXAMPLES.hokuetsu] },
  { who: "千葉縣立松戶高校", kind: "高中社團", text: "4 月底入部的初學者，7 月下旬開始有人上的前（約 3 個月）；同年 5 月的審查中，有 13 名二年級生（入部約 1 年）取得初段。", src: [EXAMPLES.matsudo] },
  { who: "八王子市弓道連盟", kind: "社會人教室", text: "初心者教室每週 2 次、共 8 次，之後原則上再到連盟持續練約 5 個月。", src: [EXAMPLES.hachioji] },
];

/* ------------------------------------------------------------------ */
/* 第一次去道場                                                         */
/* ------------------------------------------------------------------ */

export interface VisitQ {
  q: string;
  points: Point[];
  link?: { href: string; label: string };
}

export const FIRST_VISIT: VisitQ[] = [
  {
    q: "要穿什麼？",
    points: [
      { text: "協會弓道教室：白色無領上衣、黑色寬鬆長褲、白襪。", tag: "local", src: [TAIWAN.class] },
      { text: "藏月弓道場的規範是上白下黑弓道服（或和服）加白足袋，不穿絲襪或其他顏色的襪子；還沒買弓道衣的人，穿有袖白上衣與過膝黑長褲。", tag: "local", src: [TAIWAN.regulations] },
      { text: "避開前面有扣子的襯衫、左胸有口袋的衣服：放箭時弦可能勾到。", tag: "official", src: [ANKF.tool] },
      { text: "臺灣弓道協會的常見問題也寫明不可穿無袖上衣。", tag: "local", src: [TW_X.qna] },
      { text: "長髮綁起來，不要用髮夾。", tag: "guide", src: [BUDOKAN.ch2] },
    ],
  },
  {
    q: "要帶什麼？要先買弓嗎？",
    points: [
      { text: "不用先買弓。協會課程提供公用弓、箭、弽；全弓連也說初學者多半能用道場的器材。", tag: "local", src: [TAIWAN.class, ANKF.faq] },
      { text: "可以先準備下がけ（したがけ：戴在弽裡面的棉布手套）、足袋或白襪。上課可以先穿白上衣、黑長褲，弓道衣等確定要繼續再買也不遲。", tag: "local", src: [TAIWAN.class, TW_X.qna, TAIWAN.regulations] },
    ],
    link: { href: "/equipment/", label: "裝備怎麼選，見〈裝備百科〉" },
  },
  {
    q: "一進門要做什麼？",
    points: [
      { text: "鞋子擺整齊；進出道場、射場、巻藁區時行禮。", tag: "local", src: [TAIWAN.regulations, BUDOKAN.ch4] },
      { text: "弓道教室集合行禮時，同時段在自主練習的人也要一起入列。", tag: "local", src: [TAIWAN.regulations] },
      { text: "不跨過放在地上的弓具。", tag: "guide", src: [BUDOKAN.ch5] },
      { text: "別人拉弓時保持安靜；有人中靶時避免喝彩。除非有安全疑慮，不主動指導別人。", tag: "local", src: [TAIWAN.regulations] },
    ],
    link: { href: "/etiquette/", label: "完整禮法，見〈禮法與體配〉" },
  },
  {
    q: "會不會很危險？",
    points: [
      { text: "弓箭本來就是有殺傷力的器具，所以每個道場都有嚴格的安全規則。最基本的三條：不對人、不擅自上的前、不進矢道。", tag: "guide", src: [BUDOKAN.ch2] },
    ],
    link: { href: "#safety", label: "看本頁的安全守則" },
  },
  {
    q: "幾歲可以學？",
    points: [
      { text: "協會弓道教室的對象是協會會員、16 歲以上。", tag: "local", src: [TAIWAN.class] },
      { text: "未滿 20 歲入會，要附監護人同意書。", tag: "local", src: [TW_X.member] },
    ],
  },
  {
    q: "要花多少錢？不喜歡可以退嗎？",
    points: [
      { text: "協會弓道教室每期 NT$4,800；第一期另繳入會費 NT$500、教材費 NT$200；之後每年常年會費 NT$1,000。", tag: "local", src: [TAIWAN.class, TW_X.member] },
      { text: "第 3 次課以前可以部分退費；入會費不退。", tag: "local", src: [TAIWAN.class] },
    ],
    link: { href: "#cost", label: "用本頁的費用試算算一年" },
  },
  {
    q: "怎麼報名？",
    points: [
      { text: "弓道教室頁面沒有寫明報名方式；可以寫信到 taiwan.kyudo@gmail.com，或透過協會 Facebook 詢問。", tag: "disputed", src: [TAIWAN.class, TW_X.contact] },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 在台灣哪裡學                                                         */
/* ------------------------------------------------------------------ */

export const ASSOC_CLASSES = [
  { code: "T", day: "週二", time: "10:00–12:00" },
  { code: "W", day: "週三", time: "19:30–21:30" },
  { code: "F", day: "週五", time: "19:30–21:30" },
  { code: "A", day: "週六", time: "10:00–12:00" },
  { code: "S", day: "週日", time: "10:00–12:00" },
];

export const ASSOC_FACTS: Point[] = [
  { text: "地址：新北市新莊區中正路 542-11 號 3 樓（藏月弓道場），捷運輔大站 1 號出口步行約 10 分鐘。", tag: "local", src: [TW_X.traffic] },
  { text: "弓道教室：協會會員、16 歲以上；每期 6 週，每班約 10～15 人；上滿 20 堂發「修業證明」。", tag: "local", src: [TAIWAN.class] },
  { text: "費用：每期 NT$4,800；第一期另加入會費 NT$500、教材費 NT$200。", tag: "local", src: [TAIWAN.class] },
  { text: "協會行事曆上，2026 年各班持續開課，下一期（115-7）從 2026-11-10 開始。", tag: "local", src: [TW_X.calendar] },
  { text: "會費：個人會員入會費 NT$500、常年會費 NT$1,000／年；連續兩年未繳視為退會。", tag: "local", src: [TW_X.member] },
  {
    text: "會員使用場地：月租 NT$2,000（學生 8 折）；小時票 NT$150／小時、NT$400／日。符合條件的非會員 NT$200／小時，要 3 天前來信，並由現役會員陪同。近的射場只限有近的行射能力的人使用。",
    tag: "local",
    src: [TW_X.program, TAIWAN.regulations],
  },
];

export type ClubStatus = "ok" | "partial" | "unknown";

export interface Club {
  name: string;
  area: string;
  kind: string;
  links: Source[];
  status: ClubStatus;
  /** 最近一次公開活動證據的日期與出處 */
  lastSeen: string;
  note?: string;
  /** 是否收外校生／非學生（依 kyudo.club.tw） */
  open?: string;
}

export const CLUBS: Club[] = [
  { name: "國立東華大學弓道部", area: "花蓮壽豐", kind: "大學社團", links: [CLUB.ndhuSite, CLUB.ndhu, SHINSA_X.toxoTaiwan], status: "ok", lastSeen: "2026-10-12（IG）", note: "「2005 年成立、台灣第一個弓道社」出自個人整理文章（Toxophilia），本站未查到一手資料。IG 寫週一、三 19:00–21:00，在多容館小鏡廳練習。" },
  { name: "政大弓道社", area: "台北文山", kind: "大學社團", links: [CLUB.nccu], status: "ok", lastSeen: "2026-10-10（IG）", open: "收外校生與非學生" },
  { name: "輔大弓道社", area: "新北新莊", kind: "大學社團", links: [CLUB.fju], status: "ok", lastSeen: "2026-10-04（IG）", open: "收外校生" },
  { name: "淡江大學弓道社", area: "新北淡水", kind: "大學社團；協會團體會員", links: [CLUB.tku], status: "ok", lastSeen: "2026-10-03（IG）", note: "IG 寫週二、四 18:50–21:00，在紹謨紀念體育館地下劍道室。" },
  { name: "北科弓道社", area: "台北大安", kind: "大學社團；協會團體會員", links: [CLUB.ntut], status: "ok", lastSeen: "2026-10-11（IG）", open: "收外校生與非學生" },
  { name: "台科弓道社", area: "台北大安", kind: "大學社團；協會團體會員", links: [CLUB.ntust], status: "ok", lastSeen: "2026-10-15（IG）" },
  { name: "師大清羽弓道社", area: "台北大安", kind: "大學社團", links: [CLUB.ntnu], status: "ok", lastSeen: "2026-09-26（IG）", note: "IG 寫每週三 19:30–21:30，在教育學院大樓地下。" },
  { name: "台大弓道社", area: "台北大安", kind: "大學社團", links: [CLUB.ntu], status: "ok", lastSeen: "2026-10-14（IG）", note: "和現代射箭的「臺大射箭協會」是不同社團。" },
  { name: "成大弓道社", area: "台南", kind: "大學社團", links: [CLUB.ncku], status: "ok", lastSeen: "2026-09-16（IG）", open: "不開放非社員參觀或體驗", note: "IG 寫週六、日 10:00–16:00，在台南女中 B1 體育館。" },
  { name: "台南女中弓道部", area: "台南", kind: "高中社團（校內）", links: [CLUB.tngs], status: "ok", lastSeen: "2026-10-15（IG）" },
  { name: "臺灣大專弓道聯賽（UKL）", area: "跨校", kind: "學生聯賽組織（新生賽、碧羽祭）", links: [CLUB.ukl], status: "ok", lastSeen: "2026-07-20（IG）" },
  { name: "岡達日本弓道社團", area: "台中", kind: "民間團體；協會團體會員", links: [CLUB.okada], status: "partial", lastSeen: "2026-08-22 月例賽（協會行事曆）", note: "Facebook 私密社團，近一個月沒有貼文。" },
  { name: "山道場", area: "新北汐止", kind: "民間道場；協會團體會員", links: [CLUB.yama], status: "partial", lastSeen: "2025-09-28 影像審查（協會行事曆）", note: "Facebook 頁面只讀得到名稱與地區。" },
  { name: "躾學弓道會（行事曆寫作「躾弓会」）", area: "台北松山", kind: "民間武道館（弓道、劍道、薙刀）；協會團體會員", links: [CLUB.shitsuke], status: "partial", lastSeen: "2025-10-18 影像審查（協會行事曆）", note: "協會列的網站已失效；地址、電話只查到第三方頁面，請以 Facebook 為準。" },
];

export const CLUB_STATUS: Record<ClubStatus, { label: string; cls: string }> = {
  ok: { label: "有近期公開活動", cls: "border-indigo/30 bg-indigo/10 text-indigo" },
  partial: { label: "部分查證", cls: "border-wood/40 bg-wood-soft/60 text-ink" },
  unknown: { label: "查無現況", cls: "border-vermilion/40 bg-vermilion/10 text-vermilion" },
};

/** 查過、但沒有找到可練習管道的地方 */
export const NOT_FOUND: Point[] = [
  { text: "清大、陽明交大、中興、中央：只查到射箭社或劍道社，沒有找到弓道社。", tag: "disputed", src: [TW_X.clubs] },
  { text: "高雄：沒有查到常態弓道課程；協會表示台北以外沒有固定課程。", tag: "disputed", src: [TW_X.qna] },
  { text: "玄奘大學（2006 年由教師發起）查無現況；竹久弓道場據個人整理文章已於 2018 年停運。", tag: "disputed", src: [SHINSA_X.toxoTaiwan] },
  { text: "協會行事曆上的「黑色會」身分與所在地不明。", tag: "disputed", src: [TW_X.calendar] },
];

/* ------------------------------------------------------------------ */
/* 安全守則                                                             */
/* ------------------------------------------------------------------ */

export interface SafetyRule {
  title: string;
  text: string;
  tag: Tag;
  src: Source[];
}

export const SAFETY_RULES: SafetyRule[] = [
  { title: "絕對不對人", text: "不論徒手、ゴム弓還是真弓，都不對著別人拉，模仿也不行。", tag: "guide", src: [BUDOKAN.ch2] },
  { title: "的前要經許可", text: "沒有指導者許可，不在的前拉弓。", tag: "guide", src: [BUDOKAN.ch2] },
  { title: "素引き不放弦", text: "不搭箭就放弦（空打ち）可能讓弦斷，或打到臉和左臂。拉完要慢慢送回。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch4] },
  { title: "不進矢道，取箭要舉旗", text: "矢取り（やとり：去靶場取箭）時互相出聲確認、掛出赤旗；赤旗掛著時射場不取懸け。口令各道場不同，以所屬道場為準。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch4, TAIWAN.regulations] },
  { title: "巻藁四周淨空", text: "巻藁後方與左右絕對不能有人；拔箭前確認後方。舊巻藁中心變硬，箭會彈回。巻藁用的箭不拿去射的。", tag: "guide", src: [BUDOKAN.ch2] },
  { title: "保持射手間距", text: "射位間距標準 180 cm，不在太窄的地方拉弓；不把自己的弓伸進前一位射手的弓與弦之間。", tag: "guide", src: [BUDOKAN.ch2, ANKF.playRules] },
  { title: "用之前先檢查弓具", text: "籐要纏好、中仕掛要和筈密合；筈或箭桿有傷的箭不用；箭要比自己的矢束（やづか：拉弓的長度）稍長。不要把弓的下端當拐杖拄地。", tag: "guide", src: [BUDOKAN.ch2] },
  { title: "箭別搭太低", text: "番箭位置太低，離れ時可能弄傷拇指。", tag: "guide", src: [BUDOKAN.ch2] },
];

export const SAFETY_NOTES: Point[] = [
  { text: "赤旗的大小：指導書寫 70 cm 見方，《弓道競技規則》第 45 條寫 50 cm 見方以上，兩種寫法並存。", tag: "disputed", src: [BUDOKAN.ch2, ANKF.playRules] },
  { text: "能不能一個人單獨在道場練習，依各道場規定；沒有找到全弓連的統一規範。", tag: "disputed" },
  { text: "錄影檢查射形時，拍攝者和器材不可進入矢道、巻藁後方或射手的弦道附近。", tag: "note" },
];

/* ------------------------------------------------------------------ */
/* 傷害預防                                                             */
/* ------------------------------------------------------------------ */

export const INJURY_SECTION: LayeredSection = {
  id: "injury-basics",
  title: "常見部位與預防原則",
  intro: [
    "弓道研究中最常見的不適部位是肩，其次是腰、手與手指、肘、頸；另一份近千人的問卷顯示，右肘是各流派共通的好發部位。經驗年數愈長、每天射數愈多，傷害愈多。",
    "有來源支持的原則很樸素：用合乎體力的弓力、練習前做準備運動、出現症狀就減量並及早看專科醫師。但要先說清楚：弓道專屬的傷害研究少、年代久，多是問卷與個案，沒有任何預防介入的隨機對照試驗。",
  ],
  introSrc: [INJURY.tomizawa1971, INJURY.ayabe1987, BUDOKAN.ch4],
  deep: [
    {
      title: "研究怎麼說（注意樣本與限制）",
      points: [
        { text: "富沢 1971：全弓連選手 122 人，約 75% 有不適；只有 25% 做準備或補助運動。年代久、自願回答、沒有對照組。", tag: "research", src: [INJURY.tomizawa1971] },
        { text: "綾部 1987：943 人問卷，傷害經驗 26%；右肘是共通好發部位；多數人帶傷繼續練。自陳資料，因果不明。", tag: "research", src: [INJURY.ayabe1987] },
        { text: "渡邉 2014：上肢障害組的肩胛骨偏位、頭部前移比例較高。障害組 8 人來自復健診所，對照組 17 人為健康選手；橫斷面研究，不能推論因果。", tag: "research", src: [INJURY.watanabe2014] },
        { text: "竹澤 2016：高中女生 20 人，傷害組的上部背肌耐力較低；作者推測背肌不足會讓人「用手拉」。", tag: "research", src: [INJURY.takezawa2016] },
        { text: "窪田 1992：一名高中生每天練 2～3 小時、約 7 個月後發生左側第 1 肋骨疲勞性骨折，作者推測和頸部習慣往靶側傾斜有關。單一個案。", tag: "research", src: [INJURY.kubota1992] },
        { text: "西洋弓的研究（肩痛最常見、慢性傷害為主）只能當參考：兩者的拉法、握弓位置與弓的構造都不同。", tag: "research", src: [INJURY.vasilis2024, INJURY.agranovich2024] },
      ],
    },
    {
      title: "膝蓋與正坐、跪坐",
      points: [
        { text: "沒有找到以弓道選手的正坐、跪坐為對象的膝關節研究。", tag: "disputed" },
        { text: "不能正坐的人，指導書建議在最後一排改行立禮，並要求指導者顧及這些學生。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
      ],
    },
    {
      title: "練習前後的範例流程",
      points: [
        { text: "以下是依上述來源整理的一般性建議，沒有弓道專屬證據證明有效。", tag: "note" },
        { text: "練習前 5～10 分鐘：輕度跑步或原地踏步 → 肩胛骨繞環、手臂畫圈 → 胸椎旋轉與伸展 → 手腕、前臂、手指的活動 → 徒手射法八節 2～3 次 → ゴム弓、素引き數次再上巻藁。", tag: "note" },
        { text: "練習後：伸展胸大肌、肩後方、前臂、腰背部與下肢。正坐或跪坐後，先活動腳踝與膝蓋再起身。", tag: "note" },
        { text: "沒有研究提出「每天射幾支以內是安全的」。", tag: "disputed", src: [INJURY.ayabe1987] },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 審查入門                                                             */
/* ------------------------------------------------------------------ */

export interface Rung {
  rank: string;
  kana: string;
  standard: string;
  note?: string;
}

/** 審查統一基準（五段以下）的的中要求，由低到高 */
export const RANKS: Rung[] = [
  { rank: "級位", kana: "きゅうい", standard: "只看行射，得票 5 成以上即合格", note: "不考學科" },
  { rank: "初段", kana: "しょだん", standard: "射型、體配合乎規範，矢所不亂", note: "矢枕落ち不問" },
  { rank: "弐段", kana: "にだん", standard: "射法・射技欄明寫「的中不問」", note: "仍不要求中靶" },
  { rank: "参段", kana: "さんだん", standard: "矢飛筆直，「的中やや確実」", note: "從這裡開始要求的中" },
  { rank: "四段", kana: "よんだん", standard: "「的中確実の域に達した者」" },
];

export const SHINSA_SECTIONS: LayeredSection[] = [
  {
    id: "shinsa-apply",
    title: "怎麼報名",
    ja: "申込",
    kana: "もうしこみ",
    intro: [
      "審查不能個人直接寄給全日本弓道連盟（全弓連）。在日本，申請書和審查料要交給所屬團體，再由都道府縣的地方連盟彙整轉送；海外則經所屬國家的協會。",
      "在台灣，就是經臺灣弓道協會報名。協會的「審查情報」頁提供申請書下載（無指定～五段、六段以上與稱號兩種）。",
    ],
    introSrc: [ANKF.probationRules, IKYF_X.shinsa, TAIWAN.shinsa],
    deep: [
      {
        title: "細節",
        points: [
          { text: "審查規程第 24 條：申請書連同審查料交給地連會長，再轉送全弓連或主辦單位。", tag: "official", src: [ANKF.probationRules] },
          { text: "IKYF 對海外會員明寫：申請書不要個別寄給全弓連；費用收訖後不退。", tag: "official", src: [IKYF_X.shinsa] },
          { text: "日本的地方審查，受審資格是「該地連的會員」；長住日本、加入當地弓道會的外國人可以受審。台灣協會會員短期赴日參加地方審查，沒有找到明文，要先向協會或 IKYF 確認。", tag: "disputed", src: [ANKF.probationRules, SHINSA_X.aichi] },
        ],
      },
    ],
  },
  {
    id: "shinsa-shodan",
    title: "初段考什麼",
    ja: "初段",
    kana: "しょだん",
    intro: [
      "實技：射一手（ひとて）2 支，就是甲矢（はや）和乙矢（おとや）。審查原則上是近的 28 m、5 人一立、坐射，用直徑 36 cm 的霞的。",
      "學科：全弓連每年公開地方審查的學科題目（2026 年版已在 1 月 30 日公布）。初段要寫出射法八節的順序、說明其中一節，再寫一篇心得題，例如「開始學弓道的動機」。很多縣連改成報名時先交報告。",
      "合格門檻：行射得票 5 成以上，而且學科 60 分以上。審查統一基準在弐段寫「的中不問」，從参段才開始要求「的中やや確実」；初段的基準是射形、體配合乎規範、矢所不亂。",
    ],
    introSrc: [ANKF.probationRules, ANKF.probationGyosha, ANKF.probationStandard, ANKF.written2026],
    deep: [
      {
        title: "細節與待查",
        points: [
          { text: "學科出題：無指定、初段是 A 群 2 題（各 25 分）加 B 群 1 題（50 分），滿分 100。", tag: "official", src: [ANKF.written2026, ANKF.probationRules] },
          { text: "縣連從題庫指定實際題目，例如神奈川 2026 年度初段 A 群考「胴造り」，B 群考「開始弓道的動機」。", tag: "local", src: [SHINSA_X.kanagawa] },
          { text: "IKYF 同步公布英文版題目；海外受審原則上以日文或英文作答。", tag: "official", src: [IKYF_X.shinsa] },
          { text: "初段、弐段若筈こぼれ（箭從弦上掉落），以剩下的 1 支評價；2 支都掉判不合格。", tag: "official", src: [ANKF.probationStandard] },
          { text: "臺灣弓道協會「審查情報」頁的題庫還是 2021 年版，和全弓連已公布的 2026 年版不同，可能尚未更新。", tag: "disputed", src: [TAIWAN.shinsa, ANKF.written2026] },
          { text: "審查時的入退場、坐射動作，見〈禮法與體配〉。", tag: "note" },
        ],
      },
    ],
  },
  {
    id: "shinsa-overseas",
    title: "台灣會員怎麼受審",
    intro: [
      "臺灣弓道協會以「Chinese Taipei」名義列在國際弓道連盟（IKYF）亞洲大洋洲區。五段以下的海外會員，一般透過 IKYF 的亞洲大洋洲講習會「特別中央審查」或錄像審查受審，證書由全弓連發給。",
      "2026 年 IKYF 依地區分梯，第 13 回（東京）是專給 Chinese Taipei 的場次：審查 I 在 2026-11-19（参段）、審查 II 在 11-27（四段・五段），前面各有講習。報名已在 7 月 1 日截止。",
    ],
    introSrc: [IKYF.members, IKYF_X.plan2026, TW_X.calendar],
    deep: [
      {
        title: "錄像審查與其他",
        points: [
          { text: "疫情期間全弓連實施過影片審查（級位、初段、弐段）；IKYF 的國際錄像審查當時只限初段、弐段（後者據個人整理文章）。", tag: "note", src: [INJURY.ict2022, SHINSA_X.toxoNagoya] },
          { text: "協會行事曆顯示 2025、2026 年仍有「影像審查」（2026 年 6/15 開始報名、7/15 截止、9/30 截止送審），但現行可考段位、費用與細則，在 IKYF 官網找不到公開頁面，請向協會確認。", tag: "disputed", src: [TW_X.calendar] },
          { text: "協會行事曆上約每 1～2 個月一次的「會內審查」性質不明，不等於全弓連的段位。", tag: "disputed", src: [TW_X.calendar] },
          { text: "六段以上與稱號可以經 IKYF 報名在東京的定期中央審查；2026 年那一場考六段～八段與教士（2026-10-29～31）。", tag: "official", src: [IKYF_X.chuo2026] },
          { text: "協會報名審查時的手續費、匯率怎麼算，官網沒有寫明。", tag: "disputed", src: [TAIWAN.shinsa] },
        ],
      },
    ],
  },
];

/** ANKF 別表 1（平成 28 年 4 月 1 日改正），日圓 */
export const SHINSA_FEES = [
  { rank: "級位", exam: 1030, reg: 1030 },
  { rank: "初段", exam: 2050, reg: 3100 },
  { rank: "弐段", exam: 3100, reg: 4100 },
  { rank: "参段", exam: 4100, reg: 5100 },
  { rank: "四段", exam: 5100, reg: 6200 },
  { rank: "五段", exam: 6200, reg: 10300 },
];

/* ------------------------------------------------------------------ */
/* 弓道 vs 現代射箭                                                     */
/* ------------------------------------------------------------------ */

export interface CompareRow {
  item: string;
  kyudo: string;
  kyudoTag: Tag;
  kyudoSrc?: Source[];
  archery: string;
}

export const VS_ARCHERY: CompareRow[] = [
  { item: "弓", kyudo: "日本弓（和弓），標準長 221 cm（七尺三寸），竹或玻璃纖維、碳纖維", kyudoTag: "official", kyudoSrc: [ANKF.playRules], archery: "反曲弓、複合弓等，短得多" },
  { item: "握把位置", kyudo: "約在弓長下方 1/3 處，上長下短", kyudoTag: "official", kyudoSrc: [ANKF.playRules], archery: "大致在弓的中段" },
  { item: "瞄準器", kyudo: "規則禁止瞄準裝置，矢摺籐上也不得刻意做記號", kyudoTag: "official", kyudoSrc: [ANKF.playRules], archery: "依組別，多數可裝" },
  { item: "箭在弓的哪一側", kyudo: "右側", kyudoTag: "note", archery: "右手射者多在左側" },
  { item: "拉弦的手", kyudo: "右手必戴鹿皮弽（ゆがけ）", kyudoTag: "official", kyudoSrc: [ANKF.playRules], archery: "指套、指片或放箭器" },
  { item: "一次射的流程", kyudo: "射法八節，包含持滿的「會」與放箭後的「残心」", kyudoTag: "official", kyudoSrc: [ANKF.syaho], archery: "以技術動作與穩定性為主" },
  { item: "禮法", kyudo: "入場、退場、坐射等體配（たいはい）是審查項目", kyudoTag: "official", kyudoSrc: [ANKF.probationStandard], archery: "比賽有規則，沒有段位制的禮法評分" },
  { item: "距離與靶", kyudo: "近的 28 m、36 cm 靶；遠的 60 m", kyudoTag: "official", kyudoSrc: [ANKF.playRules], archery: "依組別有多種距離與計分靶" },
  { item: "評價方式", kyudo: "段級審查看射形與體配；到参段才開始要求中靶", kyudoTag: "official", kyudoSrc: [ANKF.probationStandard], archery: "以分數為主" },
  { item: "台灣的組織", kyudo: "臺灣弓道協會（IKYF 會員）", kyudoTag: "local", kyudoSrc: [IKYF.members], archery: "World Archery 體系，另有各自的組織" },
];

/* ------------------------------------------------------------------ */
/* 小主題                                                               */
/* ------------------------------------------------------------------ */

export const SMALL_TOPICS: LayeredSection[] = [
  {
    id: "lefty",
    title: "左撇子可以學嗎？",
    intro: [
      "可以，而且做法和右撇子一樣：左手持弓、右手拉弦。《弓道競技規則》規定行射時右手一定要戴弽，所以弓道沒有「左手拉弦」的版本。",
      "「慣用手不影響學習」是道場常見說法；全弓連沒有針對左撇子的明文。",
    ],
    introSrc: [ANKF.playRules],
    deep: [
      {
        title: "標記",
        points: [
          { text: "右手必戴弽：《弓道競技規則》第 20 條。", tag: "official", src: [ANKF.playRules] },
          { text: "慣用手對學習快慢的影響：沒有找到研究或官方說明。", tag: "folk" },
        ],
      },
    ],
  },
  {
    id: "senior",
    title: "年長者、膝蓋不好",
    intro: [
      "正坐、跪坐有困難不代表不能學。比賽可以依《弓道競技規則》第 3 條事先申請特例；坐射有困難時，也可以依手續改立射。全弓連 2023 年的通知，也針對「因體形、骨骼等無法照傳統做動作的人」提出因應方式。",
      "審查時能不能改立射或用其他方式，要事先向所屬團體確認：沒有查到全國統一的書面規定。弓力（弓的強度）也沒有給高齡者的具體數字，請讓指導者判斷。",
    ],
    introSrc: [ANKF.playRules, ANKF_X.notice2023, ANKF.rissha],
    deep: [
      {
        title: "細節",
        points: [
          { text: "立射是正式承認的形式，全弓連公開了〈立射の作法〉；中央審查也有立射受審申請。", tag: "official", src: [ANKF.rissha, ANKF_X.documents] },
          { text: "2023 年通知舉的例子之一：入場前先綁好襷（たすき），省去射場內的動作。", tag: "official", src: [ANKF_X.notice2023] },
          { text: "地方審查與台灣受審時的處理方式：沒有查到統一規定。", tag: "disputed" },
          { text: "沒有找到高齡者弓力的建議數字；全弓連的原則是初學者從弱弓開始。", tag: "disputed", src: [ANKF.tool] },
        ],
      },
    ],
  },
  {
    id: "carry",
    title: "帶弓出門、搭飛機",
    intro: [
      "和弓超過兩公尺，又是有殺傷力的器具：平常移動時裝進弓袋，箭放進箭筒。卸了弦的弓其實很脆弱，弓師建議用約 30 cm 的竹片綁住保護上端。",
      "搭飛機時，弓通常要用運動器材額度託運，包氣泡紙或泡棉、弓的兩端加強保護；箭必須託運，不能帶上機艙。長榮航空官網的超尺寸數字新舊版本不一致，窄體機另有長度限制，訂票前一定要向航空公司確認機型。",
    ],
    introSrc: [PRICE.issuiCarry, CARRY.vocus, CARRY.eva],
    deep: [
      {
        title: "標記與待查",
        points: [
          { text: "上端用竹片保護：弓師永野一萃的建議。", tag: "shop", src: [PRICE.issuiCarry] },
          { text: "託運包裝、箭不能帶上機艙、弽與道服隨身帶：香港作者的個人經驗。", tag: "folk", src: [CARRY.vocus] },
          { text: "長榮：運動器材計入託運額度；三邊和 203～292 cm 收超尺寸費，超過 292 cm 只在貨艙放得下時受理。官網兩個版本數字不一致。", tag: "disputed", src: [CARRY.eva] },
          { text: "使用猛禽類羽毛的箭，全弓連要求製作並攜帶溯源證明。", tag: "official", src: [ANKF_X.usearrow] },
          { text: "跨國攜帶可能涉及 CITES 或台灣《野生動物保育法》，本站沒有查到明確規定；買箭宜選火雞等非保育羽。", tag: "note" },
          { text: "台北捷運、高鐵對長型器材的規定：本站沒有查證，請事先向營運單位確認。", tag: "disputed" },
        ],
      },
    ],
  },
  {
    id: "law",
    title: "在台灣帶著弓違法嗎？",
    intro: [
      "持有和弓本身不違法：《槍砲彈藥刀械管制條例》第 4 條列的「槍砲」「刀械」沒有弓。",
      "但《社會秩序維護法》第 63 條處罰「無正當理由攜帶具有殺傷力之器械」，以及「發射有殺傷力之物品而有危害他人身體或財物之虞」，可處 3 日以下拘留或新臺幣 3 萬元以下罰鍰。所以：裝袋攜帶，只在道場射。",
    ],
    introSrc: [CARRY.gunLaw, CARRY.orderLaw],
    deep: [
      {
        title: "待查",
        points: [
          { text: "沒有查到內政部或警政署對「弓」的正式函釋；網路上關於十字弓受管制的說法，也沒能用原始文件證實。", tag: "disputed" },
          { text: "這裡只是整理條文，不是法律意見。", tag: "note" },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 買弓具                                                               */
/* ------------------------------------------------------------------ */

export const BUYING: Block = {
  title: "要買弓具時",
  points: [
    { text: "起步不必急著買：協會課程有公用弓、箭、弽。", tag: "local", src: [TAIWAN.class] },
    { text: "協會的〈弓具地圖〉只列日本的弓具店；沒有找到台灣的實體弓具專賣店。", tag: "disputed", src: [TW_X.storemap] },
  ],
};
