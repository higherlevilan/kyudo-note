// Sources cited across modules. Module-specific sources live next to each module's content.

import type { Source } from "./types";

export const ANKF = {
  syaho: { label: "全日本弓道連盟〈射法について〉", url: "https://www.kyudo.jp/howto/syaho.html", kind: "official" },
  history: { label: "全日本弓道連盟〈弓道の歴史〉", url: "https://www.kyudo.jp/howto/history.html", kind: "official" },
  mind: { label: "全日本弓道連盟〈弓道の心〉", url: "https://www.kyudo.jp/howto/", kind: "official" },
  terminology: { label: "全日本弓道連盟〈弓道用語辞典〉", url: "https://www.kyudo.jp/howto/terminology.html", kind: "official" },
  tool: { label: "全日本弓道連盟〈道具について〉", url: "https://www.kyudo.jp/begin/tool.html", kind: "official" },
  faq: { label: "全日本弓道連盟〈よくある質問〉", url: "https://www.kyudo.jp/begin/faq.html", kind: "official" },
  overview: { label: "全日本弓道連盟〈概要〉", url: "https://www.kyudo.jp/aboutus/overview.html", kind: "official" },
  playRules: { label: "全日本弓道連盟《弓道競技規則》", url: "https://www.kyudo.jp/pdf/documents/play_rules.pdf", kind: "official" },
  probationRules: { label: "全日本弓道連盟《審査規程および内規》", url: "https://www.kyudo.jp/pdf/documents/probation_rules.pdf", kind: "official" },
  probationStandard: { label: "全日本弓道連盟《審査統一基準（五段以下）》", url: "https://www.kyudo.jp/pdf/documents/probation_standard.pdf", kind: "official" },
  probationGyosha: { label: "全日本弓道連盟〈審査における行射の要領〉", url: "https://www.kyudo.jp/pdf/documents/probation_gyosha.pdf", kind: "official" },
  probationFee: { label: "全日本弓道連盟 審査料・登録料（別表1）", url: "https://www.kyudo.jp/pdf/documents/probation_fee.pdf", kind: "official" },
  written2026: { label: "全日本弓道連盟《令和８年度版 学科試験問題》", url: "https://www.kyudo.jp/pdf/documents/written_examination_2026.pdf", kind: "official" },
  rissha: { label: "全日本弓道連盟〈立射の作法〉", url: "https://www.kyudo.jp/pdf/documents/rules_rissha.pdf", kind: "official" },
} satisfies Record<string, Source>;

export const BUDOKAN = {
  ch2: { label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅱ章（安全）", url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-02.pdf", kind: "guide" },
  ch3: { label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅲ章", url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-03.pdf", kind: "guide" },
  ch4: { label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅳ章", url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-04.pdf", kind: "guide" },
  ch5: { label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅴ章", url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-05.pdf", kind: "guide" },
  ch6: { label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅵ章", url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-06.pdf", kind: "guide" },
} satisfies Record<string, Source>;

export const TAIWAN = {
  home: { label: "臺灣弓道協會", url: "https://www.kyudo.org.tw/", kind: "local" },
  class: { label: "臺灣弓道協會〈弓道教室〉", url: "https://www.kyudo.org.tw/about/class", kind: "local" },
  shinsa: { label: "臺灣弓道協會〈審查情報〉", url: "https://www.kyudo.org.tw/shinsa", kind: "local" },
  regulations: { label: "藏月弓道場〈使用規範〉", url: "https://www.kyudo.org.tw/kyudojo/regulations", kind: "local" },
} satisfies Record<string, Source>;

export const IKYF = {
  members: { label: "國際弓道連盟 IKYF〈Member Organizations〉（存檔，2026-05-15；官網 2026-10-28 無法連線）", url: "https://web.archive.org/web/20260515051801/https://ikyf.org/ikyf_members.html", kind: "official" },
} satisfies Record<string, Source>;

const repo = "https://github.com/higherlevilan/kyudo-note/blob/main/docs/research";
export const RESEARCH = {
  history: { label: "本站研究筆記 01〈弓道的歷史由來與意義〉", url: `${repo}/01-kyudo-history-and-philosophy.md`, kind: "site" },
  etiquette: { label: "本站研究筆記 03〈禮儀與體配〉", url: `${repo}/03-etiquette-taihai.md`, kind: "site" },
  equipment: { label: "本站研究筆記 04〈裝備、射癖、練習、審查、台灣〉", url: `${repo}/04-equipment-practice-and-topics.md`, kind: "site" },
  glossary: { label: "本站研究筆記 05〈詞彙表〉", url: `${repo}/05-glossary.md`, kind: "site" },
} satisfies Record<string, Source>;
