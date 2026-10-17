// Shared content types for the module pages (文化與哲學、入門指南、禮法、裝備、問題研究中心).
// Every claim can carry a tag (how authoritative it is) and its sources.

export type SourceKind = "official" | "guide" | "local" | "research" | "shop" | "secondary" | "site";

export interface Source {
  label: string;
  url: string;
  kind: SourceKind;
}

/**
 * official = 全弓連等官方規定／說明；guide = 日本武道協議會《少年少女武道指導書 弓道》；local = 地方連盟、學校、台灣協會；
 * research = 學術研究；shop = 弓具店、弓師；folk = 坊間常見說法（無官方出處）；note = 本站整理；
 * disputed = 說法不一／待查證
 */
export type Tag = "official" | "guide" | "local" | "research" | "shop" | "folk" | "note" | "disputed";

export const TAG_LABEL: Record<Tag, string> = {
  official: "官方",
  guide: "指導書",
  local: "地方／協會",
  research: "研究",
  shop: "弓具店",
  folk: "坊間常見說法",
  note: "本站整理",
  disputed: "說法不一",
};

export const KIND_LABEL: Record<SourceKind, string> = {
  official: "官方",
  guide: "指導書",
  local: "地方／協會",
  research: "研究",
  shop: "弓具店",
  secondary: "二手資料",
  site: "本站整理",
};

export interface Point {
  text: string;
  tag?: Tag;
  src?: Source[];
}

export interface Block {
  title: string;
  points: Point[];
}

/** A topic with a 入門 layer (expanded by default) and an optional 深入 layer. */
export interface LayeredSection {
  id: string;
  title: string;
  /** Japanese term, if the topic has one */
  ja?: string;
  kana?: string;
  intro: string[];
  introSrc?: Source[];
  deep?: Block[];
}

export interface Faq {
  q: string;
  a: Point[];
  /** short topic label for filtering in 問題研究中心 */
  topic?: string;
}
