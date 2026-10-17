// Types for 射癖與矢所 (/shaguse).

import type { LayeredSection, Point, Source } from "@/content/types";

/** One study in a fault's evidence list. Sample size and limits are always shown. */
export interface Study {
  /** e.g. 「森ほか 1990」 */
  who: string;
  /** e.g. 「n=237」; free text when the design has no single n */
  n: string;
  /** design and subjects, e.g. 「問卷；大學生與社會人」 */
  method: string;
  findings: string[];
  limits: string;
  src: Source[];
}

export interface Fault {
  /** 入門 layer: id is the page anchor. */
  section: LayeredSection;
  /** Definitions with their authority (shown between 入門 and 深入). */
  defs: Point[];
  studies: Study[];
  /** Shown when `studies` is empty. */
  noStudyNote?: string;
  /** Extra notes on the evidence (說法不一 etc). */
  evidenceNotes?: Point[];
  /** Common advice for improvement. Folk unless a study is cited. */
  tips: Point[];
  /** When to stop and ask someone. */
  help: Point[];
}

export type Direction = "mae" | "ushiro" | "ue" | "shita" | "chiru";

export interface YadokoroRow {
  dir: Direction;
  label: string;
  /** Japanese reading of the label */
  ja?: string;
  /** where on the target (右射者) */
  where: string;
  /** Common causes: all 一般說法 */
  causes: { text: string; anchor?: string }[];
  /** Parts with official / guide / research backing */
  support: Point[];
  /** One-line summary of how well the row is backed */
  strengthNote: string;
}
