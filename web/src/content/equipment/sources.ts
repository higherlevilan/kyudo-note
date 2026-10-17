// Sources used only by 裝備百科 (/equipment). Shared ANKF / 指導書 / 台灣協會 sources come from common-sources.
// 查詢日期：除另註外都是 2026-10-17（見 docs/research/04 第 10 章）。

import type { Source } from "@/content/types";

export { ANKF, BUDOKAN, TAIWAN, RESEARCH } from "@/content/common-sources";

/** 全弓連、高體連的其他規定與大會要項 */
export const RULES = {
  feathers: { label: "全日本弓道連盟《矢羽の使用に関する準則》", url: "https://www.kyudo.jp/pdf/info/usearrow_2.pdf", kind: "official" },
  feathersChart: { label: "全日本弓道連盟〈羽根の使用等に関する早見表〉", url: "https://www.kyudo.jp/pdf/info/usearrow_3.pdf", kind: "official" },
  koutairen: { label: "全國高等學校體育連盟《弓道競技規則》第13條", url: "https://kyudo-zenkoku.com/04-kisoku/pdf/20220805kisoku.pdf", kind: "official" },
  tennohai: { label: "天皇盃・皇后盃 全日本弓道選手権大会 実施要項（2026）", url: "https://www.kyudo.jp/pdf/schedule/taikai/20260919_guidance.pdf", kind: "official" },
  enteki: { label: "全日本弓道遠的選手権大会 実施要項（2026）", url: "https://www.kyudo.jp/pdf/schedule/taikai/20261023_guidance.pdf", kind: "official" },
} satisfies Record<string, Source>;

export const BUDOKAN_EQ = {
  ch7: { label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅶ章（資料：弦輪・中仕掛）", url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-07.pdf", kind: "guide" },
} satisfies Record<string, Source>;

export const TAIWAN_EQ = {
  qna: { label: "臺灣弓道協會〈常見問題〉（部分內容過時）", url: "https://www.kyudo.org.tw/qna", kind: "local" },
} satisfies Record<string, Source>;

/** 弓具店、弓師、業界團體 */
export const SHOP = {
  // 小山弓具（東京神田）
  koyamaBows: { label: "小山弓具 網路商店〈弓 商品一覽〉", url: "https://www.koyama-kyugu.com/products/list?category_id=1", kind: "shop" },
  koyamaCarbon: { label: "小山弓具〈直心Ⅱカーボン〉商品頁", url: "https://www.koyama-kyugu.com/products/detail/18", kind: "shop" },
  koyamaJikishin2: { label: "小山弓具〈直心Ⅱ〉商品頁", url: "https://www.koyama-kyugu.com/products/detail/15", kind: "shop" },
  koyamaSeiho: { label: "小山弓具〈清芳 前焦竹〉商品頁", url: "https://www.koyama-kyugu.com/products/detail/6", kind: "shop" },
  koyamaStrings: { label: "小山弓具 網路商店〈合成弦・麻弦〉", url: "https://www.koyama-kyugu.com/products/list?category_id=28", kind: "shop" },
  koyamaKake: { label: "小山弓具 網路商店〈三ツカケ・下カケ・押手カケ〉", url: "https://www.koyama-kyugu.com/products/list?category_id=58", kind: "shop" },
  koyamaWear: { label: "小山弓具 網路商店〈弓道衣・袴・帯・足袋・胸当て〉", url: "https://www.koyama-kyugu.com/products/list?category_id=6", kind: "shop" },
  koyamaGlass: { label: "小山弓具 網路商店〈グラス弓・アルミ矢〉", url: "https://www.koyama-kyugu.com/products/list?category_id=15", kind: "shop" },
  koyamaGoods: { label: "小山弓具 網路商店〈弓袋・弦巻・矢筒・お手入れ用品〉", url: "https://www.koyama-kyugu.com/products/list?category_id=26", kind: "shop" },
  koyamaKakeInfo: { label: "小山弓具 官網〈弽〉", url: "https://koyama-kyugu.co.jp/products/kake.html", kind: "shop" },
  koyamaYumiInfo: { label: "小山弓具 官網〈弓〉", url: "https://koyama-kyugu.co.jp/products/yumi.html", kind: "shop" },

  // 翠山弓具店
  suizanYumi: { label: "翠山弓具店〈弓の選び方〉", url: "https://suizanmiyabi.com/hpgen/HPB/entries/4.html", kind: "shop" },
  suizanYa: { label: "翠山弓具店〈矢の選び方〉", url: "https://suizanmiyabi.com/hpgen/HPB/entries/2.html", kind: "shop" },
  suizanMatch: { label: "翠山弓具店〈自分に合った弓具を見つけるには？〉", url: "https://suizanmiyabi.com/kyugucolumn/kyudougu03_11.html", kind: "shop" },
  suizanPrice: { label: "翠山弓具店〈初心者の弓具の相場は？〉", url: "https://suizanmiyabi.com/kyugucolumn/kyudougu04_02.html", kind: "shop" },
  suizanBeginnerYumi: { label: "翠山弓具店〈初心者におすすめの弓具～弓編～〉", url: "https://suizanmiyabi.com/kyugucolumn/kyudougu03_01.html", kind: "shop" },
  suizanBeginnerYa: { label: "翠山弓具店〈初心者におすすめの弓具～矢編～〉", url: "https://suizanmiyabi.com/kyugucolumn/kyudougu03_03.html", kind: "shop" },
  suizanTypes: { label: "翠山弓具店〈弓の種類と特徴〉", url: "https://suizanmiyabi.com/kyugucolumn/kyudougu02_04.html", kind: "shop" },
  suizanOrder: { label: "翠山弓具店〈弓具はどんな順番で選べばいい？〉", url: "https://suizanmiyabi.com/kyugucolumn/kyudougu03_12.html", kind: "shop" },
  suizanEn: { label: "翠山弓具店 英文選購頁（Yumi／Ya）", url: "https://suizanmiyabi.com/hpgen/HPB/entries/19.html", kind: "shop" },
  suizanKake: { label: "翠山 SUIZAN〈弽〉（手型採寸）", url: "https://www.suizan.co.jp/kake/", kind: "shop" },
  suizanTsuru: { label: "翠山弓具店〈弦の選び方と弦輪と中仕掛けの作り方〉", url: "https://suizanmiyabi.com/hazimete-no-kyudou/tsuru-no-erabikata.html", kind: "shop" },
  suizanHibiki: { label: "翠山弓具店〈合成弦 響 並寸2本入〉", url: "https://suizanmiyabi.com/SHOP/40203.html", kind: "shop" },
  globalSuizan: { label: "Global Suizan〈FAQ〉（海外寄送）", url: "https://global-suizan.com/pages/faq", kind: "shop" },

  // 山武弓具店
  sambuYa: { label: "山武弓具店〈矢の対応弓力表〉", url: "https://www.sambu.jp/hpgen/HPB/entries/10.html", kind: "shop" },
  sambuVocab: { label: "山武弓具店 Kyudo Vocabulary", url: "https://sambu-kyugu.com/pages/kyudo-vocabulary", kind: "shop" },
  sambuQA: { label: "山武弓具店 Kyudo Q&A – Comprehensive Guide", url: "https://sambu-kyugu.com/pages/kyudo-q-a-comprehensive-guide", kind: "shop" },
  sambuSet: { label: "山武弓具店〈初心者向けお買い得セット〉", url: "https://www.sambu.jp/SHOP/928965/list.html", kind: "shop" },
  sambuKake: { label: "山武弓具店〈ユガケ〉一覽", url: "https://www.sambu.jp/SHOP/201254/list.html", kind: "shop" },
  sambuHibiki: { label: "山武弓具店〈響 六寸伸〉", url: "https://www.sambu.jp/SHOP/C-010.html", kind: "shop" },

  // 其他弓具店
  yamaguchiShaft: { label: "やまぐち弓具〈ジュラルミン矢 シャフト詳細〉", url: "https://www.e-yumiya.com/index.php?dispatch=pages.view&page_id=11", kind: "shop" },
  yamaguchiCare: {
    label: "弓ナビコラム〈竹弓の取り扱い方〉（推定為 やまぐち弓具）",
    url: "https://www.e-yumiya.com/column/post/%E8%B2%B4%E6%96%B9%E6%AC%A1%E7%AC%AC%E3%81%A7%E5%BC%93%E3%81%AF%E5%A4%89%E3%82%8F%E3%82%8B%E7%AB%B9%E5%BC%93%E3%81%AE%E5%8F%96%E3%82%8A%E6%89%B1%E3%81%84%E6%96%B9/",
    kind: "shop",
  },
  heian1913: { label: "平安弓具〈ジュラルミン 1913 近的矢 ターキー〉", url: "https://www.heianyumigu.com/c/ya/gr54/507-CE1913", kind: "shop" },
  heianBeginner: { label: "東山堂平安弓具〈初心者が持っておきたい道具〉", url: "https://www.heianyumigu.com/c/tokusyu/tokusyu004", kind: "shop" },
  ikeda: { label: "池田弓具（宮崎）〈弓具の選び方1〉", url: "https://ikeda-kyugu.com/pages/%E5%BC%93%E5%85%B7%E3%81%AE%E9%81%B8%E3%81%B3%E6%96%B9", kind: "shop" },
  miyakawaKake: { label: "宮川弓具〈カケの選び方〉", url: "http://www.miyakyu.jp/about_kake.html", kind: "shop" },
  ikaiSet: { label: "猪飼弓具店〈弓道スターターセット〉", url: "https://ikai-kyugu.jp/?mode=grp&gid=3161470", kind: "shop" },
  ikaiTake: { label: "猪飼弓具店〈竹弓〉（新弓的使用注意）", url: "https://ikai-kyugu.jp/?mode=grp&gid=1551849", kind: "shop" },

  // 弓師
  yokoyama: { label: "横山黎明（弓師）〈よくある質問〉", url: "https://yokoyama-reimei.com/pages/faq/", kind: "shop" },
  issuiWeight: { label: "永野一萃 和弓工房〈弓力と矢の重さの組み合わせ〉", url: "https://www.issui.tv/?p=16", kind: "shop" },
  issuiStringing: { label: "永野一萃 和弓工房 Q1〈弦の張り方・外し方と弓形の調整〉", url: "https://www.issui.tv/?p=14", kind: "shop" },
  issuiNew: { label: "永野一萃 和弓工房 Q3〈新弓の取り扱いと育て方〉", url: "https://www.issui.tv/?p=62", kind: "shop" },
  issuiDamage: { label: "永野一萃 和弓工房 Q4〈弓の故障・破損を防止するには？〉", url: "https://www.issui.tv/?p=79", kind: "shop" },
  issuiSynth: { label: "永野一萃 和弓工房 Q5〈合成弦の長所と短所〉", url: "https://www.issui.tv/?p=96", kind: "shop" },
  issuiSynth2: { label: "永野一萃 和弓工房 Q6〈合成弦との上手な付き合い方〉", url: "https://www.issui.tv/?p=100", kind: "shop" },
  issuiLength: { label: "永野一萃 和弓工房 Q8〈最適な弓の長さ〉", url: "https://www.issui.tv/?p=104", kind: "shop" },
  issuiSeasons: { label: "永野一萃 和弓工房〈弓の四季〉", url: "https://www.issui.tv/?p=206", kind: "shop" },

  // 全日本弓道具協会（業界團體）
  zkChoose: { label: "全日本弓道具協会〈弓道具の選び方〉", url: "https://kyudogu.jp/choose", kind: "shop" },
  zkTsuru: { label: "全日本弓道具協会〈弦について〉（弦師）", url: "https://kyudogu.jp/tsuru/3979.html", kind: "shop" },
  zkLoop: { label: "全日本弓道具協会〈ループ弦の使用についてのご注意〉（2025-12-09，弓師聯名）", url: "https://kyudogu.jp/tsuru/4047.html", kind: "shop" },
  zkYugake: { label: "全日本弓道具協会〈ゆがけの製作について（3）〉", url: "https://kyudogu.jp/yugake/3546.html", kind: "shop" },
  zkNibe: { label: "全日本弓道具協会〈ニベ弓について〉（南崎寿宝）", url: "https://kyudogu.jp/yumi/3524.html", kind: "shop" },
} satisfies Record<string, Source>;

/** 論壇、問答網站、部落格、二手報導 */
export const FOLK = {
  chiebukuroFeathers: { label: "Yahoo!知恵袋「弓道の矢羽根の種類とその特徴」（2017）", url: "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q10172399120", kind: "secondary" },
  bbsYazuka: { label: "弓道掲示板「矢束は身長の半分です(?)」討論串（2005）", url: "http://ecoecoman.com/kyudo/bbs200906oth/2005111300103389.html", kind: "secondary" },
  datamax: { label: "Data Max（NetIB-News）福岡弓具店報導（只讀到搜尋摘要）", url: "https://data-max.co.jp/article/41779", kind: "secondary" },
  kyuudouq: { label: "弓道9〈グラス・カーボン弓の弦は張りっぱなしでも問題ないか？〉", url: "https://kyuudouq.com/tsuruharippanasi/", kind: "secondary" },
  kyudosuki: { label: "KYUDO LIFE〈竹弓を張りっぱなしにする効果とリスク回避法〉", url: "https://kyudosuki.com/no67/", kind: "secondary" },
  careBlog: { label: "弓道が上達する練習方法〈弓道に使用する道具の手入れのやり方〉", url: "https://japanesearchery.click/tool/care/", kind: "secondary" },
  chiebukuroTsuru: { label: "Yahoo!知恵袋〈弓道飛翔弦の交換目安は何射くらい〉（只看了搜尋摘要）", url: "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q14202421239", kind: "secondary" },
} satisfies Record<string, Source>;

export const BOT: Source = {
  label: "臺灣銀行 牌告匯率（2026/10/17 09:25：日圓現金賣出 0.2082、即期賣出 0.2072）",
  url: "https://rate.bot.com.tw/xrt?Lang=zh-TW",
  kind: "official",
};

/** 價格、匯率的查詢日期 */
export const PRICE_DATE = "2026-10-17";
export const DEFAULT_RATE = 0.2082;
