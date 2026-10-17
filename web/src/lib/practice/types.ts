// Shared shapes for the 互動練習 modes. Every question carries the sources its answer comes from.

import type { Source, Tag } from "@/content/types";

export type { Source, Tag };

/** In-site link shown after an answer ("看原文"). href is a route without basePath. */
export interface MoreLink {
  href: string;
  label: string;
}

export interface ChoiceOption {
  text: string;
  /** small second line, e.g. the 中文 name under a Japanese term */
  sub?: string;
  /** mark Japanese text so it gets lang="ja" */
  ja?: boolean;
}

/** A multiple-choice question ready to render (options already in display order). */
export interface ChoiceQuestion {
  id: string;
  /** short topic label shown above the prompt */
  topic?: string;
  prompt: string;
  /** statement or cue shown as a quote under the prompt */
  quote?: string;
  options: ChoiceOption[];
  answer: number;
  explain: string;
  tag?: Tag;
  src: Source[];
  more?: MoreLink;
}

/** A 是非題 item. */
export interface TrueFalseItem {
  id: string;
  statement: string;
  isTrue: boolean;
  explain: string;
  tag?: Tag;
  /** label shown when there is no tag */
  kindLabel?: string;
  src: Source[];
  more?: MoreLink;
}

export type PracticeMode = "order" | "which" | "cards" | "myths" | "scenario" | "written";
