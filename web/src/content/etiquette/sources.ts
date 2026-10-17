// Sources used only by the 禮法與體配 module. Shared ones live in ../common-sources.ts.
// Grades follow docs/research/03: T = official, B = guide, P / TW = local, S = secondary.

import type { Source } from "../types";
import { ANKF, BUDOKAN, RESEARCH, TAIWAN } from "../common-sources";

export const ET = {
  // T：全日本弓道連盟
  operation: {
    label: "全日本弓道連盟《弓道競技運営要領（運営マニュアル）》",
    url: "https://www.kyudo.jp/pdf/documents/play_direction_manual.pdf",
    kind: "official",
  },
  written2020: {
    label: "全日本弓道連盟《令和２年度版 学科試験問題》（宮崎縣中學弓道網站轉載）",
    url: "https://miyazakikyudojhs.1net.jp/file/5ecf0d5453df9.pdf",
    kind: "official",
  },
  documents: {
    label: "全日本弓道連盟〈資料・申込書〉（中央審查的立射受審申請）",
    url: "https://www.kyudo.jp/documents/",
    kind: "official",
  },
  begin: { label: "全日本弓道連盟〈弓道を始めたい方〉", url: "https://www.kyudo.jp/begin/", kind: "official" },

  // P：地方連盟、學校
  miyazaki: {
    label: "宮崎縣高體連弓道競技專門部《指導マニュアル～弓道競技～》",
    url: "https://s8440a4b7d1d4aacc.jimcontent.com/download/version/1406013198/module/9607239992/name/%E6%8C%87%E5%B0%8E%E3%83%9E%E3%83%8B%E3%83%A5%E3%82%A2%E3%83%AB(%E3%81%BE%E3%81%A8%E3%82%81%E7%89%88).pdf",
    kind: "local",
  },
  nara: {
    label: "奈良縣弓道連盟《奈弓連だより》第 270 號",
    url: "https://narakyudo.jp/wp-content/uploads/r6-08-270-4.pdf",
    kind: "local",
  },
  tokai: {
    label: "愛知縣高體連〈R4 東海総体 諸注意〉",
    url: "https://aichikenkoutairen.jp/wp-content/uploads/2022/06/R4東海総体-諸注意5.20.pdf",
    kind: "local",
  },

  // TW：台灣
  twQna: { label: "臺灣弓道協會〈常見問題〉", url: "https://www.kyudo.org.tw/qna", kind: "local" },

  // S：個人筆記與二手資料（只當線索）
  toxYatori: { label: "CY L.〈矢取り〉，《Toxophilia 習射札記》（講習會個人筆記）", url: "https://toxophilia.substack.com/p/kyudo-yatori", kind: "secondary" },
  toxShitsu: { label: "CY L.〈失〉，《Toxophilia 習射札記》", url: "https://toxophilia.substack.com/p/notes-on-kyudo-shitsu", kind: "secondary" },
  toxSharei: { label: "CY L.〈射禮簡介〉，《Toxophilia 習射札記》", url: "https://toxophilia.substack.com/p/kyudo-sharei-in-brief", kind: "secondary" },
  toxKneel: { label: "CY L.〈學弓道，要跪嗎？〉，《Toxophilia 習射札記》", url: "https://toxophilia.substack.com/p/5c12161f9442", kind: "secondary" },
  basicAction: { label: "〈弓道の基本動作10項目〉，japanesearchery.click", url: "https://japanesearchery.click/basic/basic-action-2/", kind: "secondary" },
  riron: { label: "高橋大智〈五段：「肌脱ぎ」または「袖さばき」の注意点〉，理論弓道", url: "https://rkyudo-riron.com/kaitou-12/", kind: "secondary" },
  hadanugi: { label: "〈肌脱ぎ肌入れ〉，弓道メモ", url: "https://kyudomemo.blog.jp/archives/29806360.html", kind: "secondary" },
  ikeda: { label: "池田友行（錬士五段）〈日本弓道について〉，NetIB-News", url: "https://data-max.co.jp/article/42247", kind: "secondary" },
  ikeda6: { label: "池田友行（錬士五段）〈日本弓道について〉第 6 回，NetIB-News", url: "https://data-max.co.jp/article/42424", kind: "secondary" },
  wikid: { label: "〈弓道場〉，ja.wikid.org（百科類二手資料）", url: "https://ja.wikid.org/%E5%BC%93%E9%81%93%E5%A0%B4", kind: "secondary" },
  kokushikanKendo: { label: "國士舘大學紀要（劍道的神前禮習慣；非弓道）", url: "https://kokushikan.repo.nii.ac.jp/record/7695/files/1346_194%EF%BD%98_028_02.pdf", kind: "research" },
  shinagawa: { label: "品川區〈東品川弓道場使用注意事項〉", url: "https://www.city.shinagawa.tokyo.jp/ct/other000069300/kyudotyuijikou.pdf", kind: "secondary" },
} satisfies Record<string, Source>;

/** Order of the 資料來源 list at the bottom of the page. */
export const ETIQUETTE_SOURCES: Source[] = [
  ANKF.terminology,
  ANKF.probationRules,
  ANKF.probationStandard,
  ANKF.probationGyosha,
  ANKF.rissha,
  ANKF.playRules,
  ET.operation,
  ANKF.written2026,
  ET.written2020,
  ET.documents,
  ET.begin,
  BUDOKAN.ch2,
  BUDOKAN.ch3,
  BUDOKAN.ch4,
  BUDOKAN.ch5,
  BUDOKAN.ch6,
  ET.miyazaki,
  ET.nara,
  ET.tokai,
  TAIWAN.regulations,
  ET.twQna,
  TAIWAN.shinsa,
  ET.toxYatori,
  ET.toxShitsu,
  ET.toxSharei,
  ET.toxKneel,
  ET.basicAction,
  ET.riron,
  ET.hadanugi,
  ET.ikeda,
  ET.ikeda6,
  ET.shinagawa,
  ET.wikid,
  ET.kokushikanKendo,
  RESEARCH.etiquette,
];

export { ANKF, BUDOKAN, RESEARCH, TAIWAN };
