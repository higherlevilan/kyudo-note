// Sources used only by the 文化與哲學 module (docs/research/01 §7).
// Shared ones (ANKF, BUDOKAN, TAIWAN, IKYF, RESEARCH) live in ../common-sources.ts.

import type { Source } from "../types";

export const CS = {
  // 官方
  ankfPlan: {
    label: "全日本弓道連盟《中期計画 2023–2029》組織沿革",
    url: "https://www.kyudo.jp/img/aboutus/plan_20240327.pdf",
    kind: "official",
  },
  ankfReport2025: {
    label: "全日本弓道連盟《令和7年度 事業報告書》〈地連別登録人口一覧〉（令和8年3月31日現在）",
    url: "https://www.kyudo.jp/pdf/aboutus/r07_jigyouhoukoku_202607.pdf",
    kind: "official",
  },
  ikyfAbout: { label: "國際弓道連盟 IKYF〈About IKYF〉（存檔，2026-05-01；官網 2026-10-28 無法連線）", url: "https://web.archive.org/web/20260501095222/https://www.ikyf.org/about_ikyf.html", kind: "official" },
  aichi: { label: "愛知スポーツコミッション〈Achievements〉：The 4th World Kyudo Championships", url: "https://aichi-sc.jp/en/achievements/", kind: "official" },
  twOrg: { label: "臺灣弓道協會〈組織架構與章程〉", url: "https://www.kyudo.org.tw/about/organization", kind: "local" },

  // 日本武道館
  budokanBow: {
    label: "日本武道館出版物 第 2 章〈日本の弓矢と弓術〉",
    url: "https://www.nipponbudokan.or.jp/CDFy5t/wp-content/uploads/2016/03/tankoubon40.pdf",
    kind: "guide",
  },
  budokanJr1: {
    label: "日本武道館 中學武道指導資料〈弓道〉1（歷史）",
    url: "https://www.nipponbudokan.or.jp/pdf/shinkoujigyou/202503/junior_shidou/kyudo_01.pdf",
    kind: "guide",
  },
  budokanJr3: {
    label: "日本武道館 中學武道指導資料〈弓道〉3",
    url: "https://www.nipponbudokan.or.jp/pdf/shinkoujigyou/202503/junior_shidou/kyudo_03.pdf",
    kind: "guide",
  },

  // 學術
  yamada: {
    label: "山田奨治〈The Myth of Zen in the Art of Archery〉JJRS 28（2001）",
    url: "https://nirc.nanzan-u.ac.jp/journal/6/article/1043/pdf/download",
    kind: "research",
  },
  goka2018: {
    label: "五賀、李〈大日本弓道会の成立・展開と組織形態〉（2018）",
    url: "https://tsukuba.repo.nii.ac.jp/record/48778/files/JJEP_63-121.pdf",
    kind: "research",
  },
  goka2022: {
    label: "五賀、洪、松尾〈日本統治下台湾における弓道の導入と普及実態〉《武道学研究》（2022）",
    url: "https://www.jstage.jst.go.jp/article/budo/54/2/54_2107/_pdf",
    kind: "research",
  },
  reiNi: {
    label: "中谷〈武道における「礼に始まり、礼に終わる」の発生と受容ならびにその解釈〉中央大學論集",
    url: "https://chuo-u.repo.nii.ac.jp/record/16000/files/0910-4046_40_23-38.pdf",
    kind: "research",
  },
  shotsInDark: {
    label: "Yamada Shoji, Shots in the Dark: Japan, Zen, and the West（University of Chicago Press, 2009）",
    url: "https://chicagoreference.com/ucp/books/book/chicago/S/bo6512379.html",
    kind: "research",
  },
  kyotoArchive: {
    label: "京都學・歷彩館 通し矢關連資料（引《寛政御免大成矢數年代記》）",
    url: "https://www.pref.kyoto.jp/rekisaikan/documents/shiryosyokai2112s_1.pdf",
    kind: "research",
  },

  // 辭典、經典與二手資料
  kbHeki: { label: "コトバンク〈日置流〉", url: "https://kotobank.jp/word/日置流-129199", kind: "secondary" },
  kbJarai: { label: "コトバンク〈射礼〉", url: "https://kotobank.jp/word/射礼-76339", kind: "secondary" },
  kbMeigen: { label: "コトバンク〈鳴弦〉", url: "https://kotobank.jp/word/鳴弦-142047", kind: "secondary" },
  jaWiki: { label: "日文維基百科〈弓道〉", url: "https://ja.wikipedia.org/wiki/弓道", kind: "secondary" },
  jaWikiShaho: { label: "日文維基百科〈射法八節〉", url: "https://ja.wikipedia.org/wiki/射法八節", kind: "secondary" },
  jaWikiHanshi: { label: "日文維基百科〈範士〉（條目缺少出處）", url: "https://ja.wikipedia.org/wiki/範士", kind: "secondary" },
  irieSecondary: {
    label: "〈射法八節〉個人網頁（入江康平說的二手轉述）",
    url: "https://www.ne.jp/asahi/kk/asaarasi/3-1-0.html",
    kind: "secondary",
  },
  keio: {
    label: "慶應義塾《三田評論》小笠原家相關文章",
    url: "https://www.keio.ac.jp/ja/about/public-relations/mita-hyoron/shachu/20251219-1/",
    kind: "secondary",
  },
  tsurugaoka: { label: "鶴岡八幡宮流鏑馬介紹（GLTJP）", url: "https://www.gltjp.com/ja/directory/item/14518/", kind: "secondary" },
  wikisource: { label: "維基文庫《禮記・射義》", url: "https://zh.wikisource.org/wiki/禮記/射義", kind: "secondary" },
  enWikiHerrigel: { label: "英文維基百科〈Eugen Herrigel〉", url: "https://en.wikipedia.org/wiki/Eugen_Herrigel", kind: "secondary" },
  enWikiIkyf: {
    label: "英文維基百科〈International Kyudo Federation〉",
    url: "https://en.wikipedia.org/wiki/International_Kyudo_Federation",
    kind: "secondary",
  },
  scrapboxAwa: { label: "scrapbox〈阿波研造〉（瑞巖寺修禪說，未證實）", url: "https://scrapbox.io/hitorigakusai/阿波研造", kind: "secondary" },
  misaki: {
    label: "岡山縣矢掛町〈御崎神社の百手講神事〉",
    url: "https://kids.takahashiryuiki.com/wp-content/uploads/3御崎神社の百手講神事.pdf",
    kind: "local",
  },
  butokukaiDir: { label: "Ryukyu Bugei〈The Dai Nippon Butokukai Name Directory〉", url: "https://ryukyu-bugei.com/?p=7840", kind: "secondary" },
  toxophilia: {
    label: "toxophilia（個人整理）〈日本弓道在東亞與東南亞當代傳播概況・台灣〉",
    url: "https://toxophilia.substack.com/p/2e7aae05199a",
    kind: "secondary",
  },
  twBlog: { label: "部落格「台灣弓道文史研究室」", url: "https://kyokyudo.blog/tag/台灣弓道文史研究室/", kind: "secondary" },
  tkuTimes: { label: "《淡江時報》弓道社報導", url: "https://tkutimes.az.tku.edu.tw/fpdf/55271.pdf", kind: "secondary" },
  oomato: { label: "三十三間堂「大的大會」介紹（tabi-mag）", url: "https://tabi-mag.jp/ky0313/", kind: "secondary" },
} satisfies Record<string, Source>;
