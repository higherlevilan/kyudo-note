// Sources used only by the 走進道場 (/guide) module. Shared ones live in ../common-sources.ts.
// 查詢日期：2026-10-17（docs/research/04 第 10 章）。

import type { Source } from "../types";

/** All dates, prices and community info on this page were checked on this date. */
export const CHECKED_ON = "2026-10-17";

/** 臺灣銀行牌告 2026/10/17 09:25，日圓現金賣出 */
export const JPY_TWD_RATE = 0.2082;

export const ANKF_X = {
  improve: { label: "全日本弓道連盟〈上達への道。vol.01 ゴム弓練習法〉", url: "https://www.kyudo.jp/improve/", kind: "official" },
  subiki: { label: "全日本弓道連盟〈上達への道。vol.02 素引き練習〉", url: "https://www.kyudo.jp/improve/02.html", kind: "official" },
  begin: { label: "全日本弓道連盟〈弓道を始めたい方〉", url: "https://www.kyudo.jp/begin/", kind: "official" },
  notice2023: {
    label: "全日本弓道連盟 全弓連発第5-27号〈基本計画部会での検討内容の趣旨について〉（2023-07-24）",
    url: "https://www.kyudo.jp/pdf/notice/20230725_information.pdf",
    kind: "official",
  },
  documents: { label: "全日本弓道連盟〈資料・申込書〉", url: "https://www.kyudo.jp/documents/", kind: "official" },
  usearrow: { label: "全日本弓道連盟〈矢羽の使用に関する準則〉", url: "https://www.kyudo.jp/info/usearrow.html", kind: "official" },
  chuoDojo: { label: "全日本弓道連盟〈中央道場概要〉", url: "https://www.kyudo.jp/schedule/chuoshinsa/overview.html", kind: "official" },
} satisfies Record<string, Source>;

export const IKYF_X = {
  shinsa: { label: "IKYF〈Kyudo Shinsa〉（存檔，2026-05-20；官網 2026-10-28 無法連線）", url: "https://web.archive.org/web/20260520185900/https://www.ikyf.org/schedule/index.html", kind: "official" },
  plan2026: {
    label: "IKYF Event plan for FY2026（2026-04～2027-03）（存檔，2026-04-21；官網 2026-10-28 無法連線）",
    url: "https://web.archive.org/web/20260421221935/https://www.ikyf.org/pdf/2026_IKYF_Events_plan_April2026-March2027_3.pdf",
    kind: "official",
  },
  chuo2026: {
    label: "IKYF 2026 Regular Chuo Shinsa (Tokyo) Guidelines（官網 2026-10-28 無法連線，查無存檔）",
    url: "https://www.ikyf.org/pdf/2026_Regular_ChuoShinsa_Tokyo_Guidelines.pdf",
    kind: "official",
  },
} satisfies Record<string, Source>;

export const TW_X = {
  qna: { label: "臺灣弓道協會〈常見問題〉（部分內容過時）", url: "https://www.kyudo.org.tw/qna", kind: "local" },
  memberGroup: { label: "臺灣弓道協會〈團體會員〉", url: "https://www.kyudo.org.tw/about/member_g", kind: "local" },
  member: { label: "臺灣弓道協會〈會員專區〉（入會費、常年會費）", url: "https://www.kyudo.org.tw/about/member_P", kind: "local" },
  traffic: { label: "藏月弓道場〈交通資訊〉", url: "https://www.kyudo.org.tw/kyudojo/traffic", kind: "local" },
  program: { label: "藏月弓道場〈使用方案〉", url: "https://www.kyudo.org.tw/kyudojo/Program", kind: "local" },
  contact: { label: "臺灣弓道協會〈聯絡資訊〉", url: "https://www.kyudo.org.tw/about/contact", kind: "local" },
  storemap: { label: "臺灣弓道協會〈弓具地圖〉", url: "https://www.kyudo.org.tw/Intro/storemap", kind: "local" },
  calendar: {
    label: "臺灣弓道協會 公開 Google 行事曆（ICS）",
    url: "https://calendar.google.com/calendar/ical/taiwan.kyudo%40gmail.com/public/basic.ics",
    kind: "local",
  },
  clubs: { label: "台灣學生弓道社團資訊 kyudo.club.tw（最後更新 2026-03-04）", url: "https://www.kyudo.club.tw/", kind: "local" },
} satisfies Record<string, Source>;

/** 社團與民間團體的公開頁面 */
export const CLUB = {
  ndhuSite: { label: "國立東華大學弓道部 網站", url: "https://faculty.ndhu.edu.tw/~kyudo/", kind: "local" },
  ndhu: { label: "IG @ndhukyudo（東華）", url: "https://www.instagram.com/ndhukyudo/", kind: "local" },
  nccu: { label: "IG @kyudo__nccu（政大）", url: "https://www.instagram.com/kyudo__nccu/", kind: "local" },
  fju: { label: "IG @fju_kyudo（輔大）", url: "https://www.instagram.com/fju_kyudo/", kind: "local" },
  tku: { label: "IG @tkukyudo（淡江）", url: "https://www.instagram.com/tkukyudo/", kind: "local" },
  ntut: { label: "IG @ntutnicekyudo（北科）", url: "https://www.instagram.com/ntutnicekyudo/", kind: "local" },
  ntust: { label: "IG @ntust_kyudo_club（台科）", url: "https://www.instagram.com/ntust_kyudo_club/", kind: "local" },
  ntnu: { label: "IG @ntnu_kyudo（師大清羽）", url: "https://www.instagram.com/ntnu_kyudo/", kind: "local" },
  ntu: { label: "IG @ntukyudo（台大）", url: "https://www.instagram.com/ntukyudo/", kind: "local" },
  ncku: { label: "IG @ncku_kyudo（成大）", url: "https://www.instagram.com/ncku_kyudo/", kind: "local" },
  tngs: { label: "IG @tngs_kyudo（台南女中）", url: "https://www.instagram.com/tngs_kyudo/", kind: "local" },
  ukl: { label: "IG @taiwan.university_kyudo（臺灣大專弓道聯賽）", url: "https://www.instagram.com/taiwan.university_kyudo/", kind: "local" },
  okada: { label: "FB 岡達日本弓道社團", url: "https://www.facebook.com/groups/143958592605001/", kind: "local" },
  yama: { label: "FB 山道場", url: "https://www.facebook.com/yamakyudojo", kind: "local" },
  shitsuke: { label: "FB 躾學弓道會", url: "https://www.facebook.com/stkkyudojo/", kind: "local" },
} satisfies Record<string, Source>;

/** 社團、教室的「上的前」時間實例（日本） */
export const EXAMPLES = {
  hokudai: {
    label: "北海道大学弓道部〈新入生のみなさんへ〉",
    url: "https://hokudai-kyudo.jimdofree.com/%E6%96%B0%E5%85%A5%E7%94%9F%E3%81%AE%E3%81%BF%E3%81%AA%E3%81%95%E3%82%93%E3%81%B8/",
    kind: "local",
  },
  tokyotech: {
    label: "tokyotech-kyudo.com〈的前に上がるまで〉（2024-04-09）",
    url: "https://tokyotech-kyudo.com/2024/04/09/%E7%9A%84%E5%89%8D%E3%81%AB%E4%B8%8A%E3%81%8C%E3%82%8B%E3%81%BE%E3%81%A7/",
    kind: "local",
  },
  hokuetsu: { label: "北越高校弓道部〈Q＆A〉", url: "https://sites.google.com/view/hokuetsu-kyuudou/qa", kind: "local" },
  matsudo: {
    label: "千葉県立松戸高等学校 弓道部",
    url: "https://cms1.chiba-c.ed.jp/matsudo-h/9d72bb3c3667eb2d0e13fd221b97ca7c/%E9%81%8B%E5%8B%95%E7%B3%BB%E9%83%A8%E6%B4%BB%E5%8B%95/%E5%BC%93%E9%81%93%E9%83%A8/",
    kind: "local",
  },
  hachioji: {
    label: "八王子市弓道連盟〈初心者弓道教室〉",
    url: "https://sites.google.com/site/hachiojikyudo/%E5%88%9D%E5%BF%83%E8%80%85%E5%BC%93%E9%81%93%E6%95%99%E5%AE%A4",
    kind: "local",
  },
} satisfies Record<string, Source>;

/** 審查實務（日本縣連）與海外審查的個人整理 */
export const SHINSA_X = {
  kanagawa: {
    label: "神奈川県弓道連盟 令和8年度 地方審査実施要項",
    url: "https://www.kyudo-kanagawa.jp/sinsa/pdf/2026sinsa-chihou4.pdf",
    kind: "local",
  },
  aichi: { label: "愛知県弓道連盟 令和7年度 地方審査実施要項", url: "https://104ta910.1web.jp/file/67fcd17d35076.pdf", kind: "local" },
  toxoTaiwan: {
    label: "Toxophilia〈日本弓道在東亞與東南亞當代傳播概況（一）台灣〉（2023-03-22）",
    url: "https://toxophilia.substack.com/p/2e7aae05199a",
    kind: "secondary",
  },
  toxoNagoya: {
    label: "Toxophilia〈2023 名古屋講習審查（1）〉",
    url: "https://toxophilia.substack.com/p/kyudo-shinsa-nagoya-2023-1",
    kind: "secondary",
  },
} satisfies Record<string, Source>;

/** 傷害研究（J-STAGE／PubMed） */
export const INJURY = {
  tomizawa1971: {
    label: "富沢政信ほか〈弓道選手にみられる整形外科的障害〉体力科学 20(2), 1971",
    url: "https://www.jstage.jst.go.jp/article/jspfsm1949/20/2/20_2_96/_article/-char/ja",
    kind: "research",
  },
  ayabe1987: {
    label: "綾部香子ほか〈弓道選手の運動障害について〉武道学研究 20(2), 1987",
    url: "https://www.jstage.jst.go.jp/article/budo1968/20/2/20_161/_article/-char/ja",
    kind: "research",
  },
  watanabe2014: {
    label: "渡邉有香ほか〈弓道競技者に対するメディカルチェック項目とその有用性の検討〉2014",
    url: "https://www.jstage.jst.go.jp/article/ptkanbloc/33/0/33_F-002/_article/-char/ja",
    kind: "research",
  },
  takezawa2016: {
    label: "竹澤鮎美ほか〈弓道での傷害群と非傷害群における体幹機能の違い〉武道学研究 49, 2016",
    url: "https://www.jstage.jst.go.jp/article/budo/49/Supplement/49_S_90/_article/-char/ja",
    kind: "research",
  },
  kubota1992: {
    label: "窪田秀明ほか〈スポーツによる肋骨疲労骨折の2症例〉1992",
    url: "https://www.jstage.jst.go.jp/article/nishiseisai1951/41/1/41_1_281/_article/-char/ja",
    kind: "research",
  },
  vasilis2024: {
    label: "Vasilis N, et al. Injuries and Persistent Pain in Elite Adolescent Archery Athletes. Sports 2024（西洋弓）",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11054429/",
    kind: "research",
  },
  agranovich2024: {
    label: "Agranovich OE, et al. Archery injuries: A literature review. 2024（西洋弓）",
    url: "https://journals.eco-vector.com/turner/article/view/625717",
    kind: "research",
  },
  ict2022: {
    label: "岡﨑紀創ほか〈空手道・弓道における ICT 活用の新たな試みと将来展望〉武道学研究 54(2), 2022",
    url: "https://www.jstage.jst.go.jp/article/budo/54/2/54_2116/_article/-char/ja",
    kind: "research",
  },
} satisfies Record<string, Source>;

/** 價格（弓具店、銀行） */
export const PRICE = {
  bot: { label: "臺灣銀行 牌告匯率（2026/10/17 09:25，日圓現金賣出 0.2082）", url: "https://rate.bot.com.tw/xrt?Lang=zh-TW", kind: "official" },
  koyamaStrings: { label: "小山弓具 網路商店：弦", url: "https://www.koyama-kyugu.com/products/list?category_id=28", kind: "shop" },
  koyamaKake: { label: "小山弓具 網路商店：弽・下がけ", url: "https://www.koyama-kyugu.com/products/list?category_id=58", kind: "shop" },
  koyamaWear: { label: "小山弓具 網路商店：弓道衣・袴・足袋", url: "https://www.koyama-kyugu.com/products/list?category_id=6", kind: "shop" },
  koyamaBow: { label: "小山弓具 網路商店：グラス弓・アルミ矢", url: "https://www.koyama-kyugu.com/products/list?category_id=15", kind: "shop" },
  koyamaGoods: { label: "小山弓具 網路商店：弓袋・ゴム弓・粉等", url: "https://www.koyama-kyugu.com/products/list?category_id=26", kind: "shop" },
  heian: { label: "東山堂平安弓具〈初心者が持っておきたい道具〉", url: "https://www.heianyumigu.com/c/tokusyu/tokusyu004", kind: "shop" },
  suizanString: {
    label: "翠山弓具店 suizan雅〈弦の選び方〉",
    url: "https://suizanmiyabi.com/hazimete-no-kyudou/tsuru-no-erabikata.html",
    kind: "shop",
  },
  issuiString: { label: "和弓工房 永野一萃〈合成弦との上手な付き合い方〉", url: "https://www.issui.tv/?p=100", kind: "shop" },
  issuiCarry: { label: "和弓工房 永野一萃〈弓の故障・破損を防止するには？〉", url: "https://www.issui.tv/?p=79", kind: "shop" },
} satisfies Record<string, Source>;

/** 攜帶、搭機、法規 */
export const CARRY = {
  vocus: {
    label: "vocus〈日本弓道講習審查初體驗(5)〉（香港作者的弓具託運經驗）",
    url: "https://vocus.cc/article/6499443ffd89780001eb3dc0",
    kind: "secondary",
  },
  eva: {
    label: "長榮航空〈運動器材託運〉",
    url: "https://www.evaair.com/zh-tw/fly-prepare/baggage/special-baggage/sporting-equipment/",
    kind: "official",
  },
  gunLaw: {
    label: "《槍砲彈藥刀械管制條例》第 4 條",
    url: "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080047&flno=4",
    kind: "official",
  },
  orderLaw: {
    label: "《社會秩序維護法》第 63 條",
    url: "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080067&flno=63",
    kind: "official",
  },
} satisfies Record<string, Source>;
