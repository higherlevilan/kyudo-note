// Sources cited on the site. kind decides the badge shown next to a claim.

export type SourceKind = "official" | "guide" | "local" | "research" | "site";

export interface Source {
  label: string;
  url: string;
  kind: SourceKind;
}

export const SOURCES = {
  syaho: {
    label: "全日本弓道連盟〈射法について〉",
    url: "https://www.kyudo.jp/howto/syaho.html",
    kind: "official",
  },
  terminology: {
    label: "全日本弓道連盟〈弓道用語辞典〉",
    url: "https://www.kyudo.jp/howto/terminology.html",
    kind: "official",
  },
  tool: {
    label: "全日本弓道連盟〈道具について〉",
    url: "https://www.kyudo.jp/begin/tool.html",
    kind: "official",
  },
  improve02: {
    label: "全日本弓道連盟〈上達への道。vol.02〉",
    url: "https://www.kyudo.jp/improve/02.html",
    kind: "official",
  },
  b4: {
    label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅳ章",
    url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-04.pdf",
    kind: "guide",
  },
  b5: {
    label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅴ章",
    url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-05.pdf",
    kind: "guide",
  },
  b6: {
    label: "日本武道協議會《少年少女武道指導書 弓道》第Ⅵ章",
    url: "https://www.nipponbudokan.or.jp/pdf/shidosho/kyudo/Kyudo-06.pdf",
    kind: "guide",
  },
  miyazaki: {
    label: "宮崎縣高體連弓道專門部《指導マニュアル》",
    url: "https://s8440a4b7d1d4aacc.jimcontent.com/download/version/1406013198/module/9607239992/name/%E6%8C%87%E5%B0%8E%E3%83%9E%E3%83%8B%E3%83%A5%E3%82%A2%E3%83%AB(%E3%81%BE%E3%81%A8%E3%82%81%E7%89%88).pdf",
    kind: "local",
  },
  twkyudo: {
    label: "臺灣弓道協會〈射法八節〉",
    url: "https://www.kyudo.org.tw/Intro/%E5%B0%84%E6%B3%95%E5%85%AB%E7%AF%80",
    kind: "local",
  },
  demo: {
    label: "本站研究筆記〈射法八節 骨架分析：第一次試做〉",
    url: "https://github.com/higherlevilan/kyudo-note/blob/main/docs/research/02-shaho-hassetsu-pose-analysis.md",
    kind: "site",
  },
  research04: {
    label: "本站研究筆記〈裝備、射癖、練習、審查〉第 2 章（射癖研究整理）",
    url: "https://github.com/higherlevilan/kyudo-note/blob/main/docs/research/04-equipment-practice-and-topics.md",
    kind: "site",
  },
} as const satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;

export const KIND_LABEL: Record<SourceKind, string> = {
  official: "ANKF 官方",
  guide: "指導書",
  local: "地方／協會",
  research: "研究",
  site: "本站整理",
};
