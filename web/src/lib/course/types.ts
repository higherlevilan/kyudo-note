// 修煉路線 (course mode) — shared shapes. The site is a path of 關卡 (chapters); each chapter is one
// existing module page, split into 小節 (sections) whose ids are anchors on that page.
// Progress (seen sections, quiz results, badges) lives only in the viewer's browser.

import type { ChoiceQuestion } from "@/lib/practice/types";

/** Mascot (小弓) expressions. */
export type Mood = "happy" | "think" | "wow" | "oops" | "bow" | "focus";

export type ChapterId = "guide" | "etiquette" | "shaho" | "shaguse" | "equipment" | "culture";

export interface CourseSectionDef {
  /** anchor id on the chapter page (unique within the chapter) */
  id: string;
  /** title shown in the sidebar, chapter table of contents and section kicker */
  title: string;
  /** Japanese term, rendered with lang="ja" next to the title */
  ja?: string;
}

export interface BadgeDef {
  /** badge name, e.g. 「初入道場」 */
  name: string;
  /** one line shown under the badge when unlocked */
  line: string;
}

/** Per-chapter extras, written in src/content/course/<chapterId>.ts. */
export interface ChapterExtras {
  /** mascot bubble at the top of the chapter (may contain <b>, plain text otherwise) */
  intro: string;
  introMood?: Mood;
  /** optional mascot quips keyed by section id, shown by <CourseSection quip> or the companion */
  quips?: Partial<Record<string, { text: string; mood?: Mood }>>;
  /** 過關測驗: 8–12 questions, each with explanation and sources */
  quiz: ChoiceQuestion[];
  badge: BadgeDef;
}

export interface ChapterDef extends ChapterExtras {
  id: ChapterId;
  /** two-character tag shown in rings and kickers: "00".."05" */
  tag: string;
  /** e.g. 「第一關」 */
  stage: string;
  title: string;
  /** Japanese subtitle, lang="ja" */
  ja: string;
  /** route with trailing slash, e.g. "/guide/" */
  href: string;
  /** one-sentence description on the 修煉路線圖 */
  blurb: string;
  sections: CourseSectionDef[];
}

/** Section key used in progress storage: `${chapterId}/${sectionId}`. */
export type SectionKey = `${ChapterId}/${string}`;

export interface QuizResult {
  correct: number;
  total: number;
  /** ISO timestamp of the last finished attempt */
  at: string;
  /** best `correct` over all attempts */
  best?: number;
}

export interface CourseProgress {
  v: 1;
  seen: Partial<Record<SectionKey, 1>>;
  quiz: Partial<Record<ChapterId, QuizResult>>;
  /** chapters whose badge-unlock toast was already shown */
  awarded: Partial<Record<ChapterId, 1>>;
}
