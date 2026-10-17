// Content shapes specific to 裝備百科. Builds on the shared Point / Source / Tag types.

import type { Point, Source, Tag } from "@/content/types";

/** A comparison table. The last column 「來源」 is rendered from each row's tag + src. */
export interface EqTable {
  caption: string;
  head: string[];
  rows: { cells: string[]; tag?: Tag; src?: Source[] }[];
  /** Notes printed under the table. */
  notes?: Point[];
}

export type EqBlock = { title: string; points: Point[]; table?: undefined } | { title: string; table: EqTable; points?: Point[] };

/** A topic card: 入門 layer (open) and 深入 layer (collapsed). */
export interface EqTopic {
  id: string;
  title: string;
  ja?: string;
  kana?: string;
  /** 入門 paragraphs, each optionally tagged and sourced. */
  intro: Point[];
  /** Tables shown in the 入門 layer. */
  introTables?: EqTable[];
  deep?: EqBlock[];
}
