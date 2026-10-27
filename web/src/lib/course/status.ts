// Pure progress maths over a CourseProgress snapshot. No React here, so server components can
// import it too (the store and hooks live in ./progress). Uses the light registry only.

import { CHAPTERS, CHAPTER_BY_ID } from "@/content/course/registry";
import type { ChapterId, ChapterMeta, CourseProgress, QuizResult, SectionKey } from "./types";

const chapterOf = (c: ChapterId | ChapterMeta) => (typeof c === "string" ? CHAPTER_BY_ID[c] : c);

export function sectionKey(chapter: ChapterId, section: string): SectionKey {
  return `${chapter}/${section}`;
}

export function isSeen(p: CourseProgress, chapter: ChapterId, section: string): boolean {
  return !!p.seen[sectionKey(chapter, section)];
}

/** 過關: at least 60% correct. */
export const PASS_RATIO = 0.6;

/** Correct answers needed to pass a quiz of `total` questions (integer maths: ceil(total × 3/5)). */
export function passScore(total: number): number {
  return Math.ceil((total * 3) / 5);
}

/** Best score over all attempts (older stored results may lack `best`). */
export function bestScore(r: QuizResult): number {
  return Math.max(r.best ?? 0, r.correct);
}

/** Whether a stored result counts towards the badge. Results saved before the threshold existed
 *  are kept as they are and simply judged by it here. */
export function quizPassed(r: QuizResult | undefined): boolean {
  return !!r && r.total > 0 && bestScore(r) >= passScore(r.total);
}

export interface ChapterStatus {
  /** 0..1: (seen sections + quiz passed) / (sections + 1 if the chapter has a quiz) */
  fraction: number;
  seen: number;
  sections: number;
  hasQuiz: boolean;
  /** last finished attempt (passed or not) */
  quiz?: QuizResult;
  /** best score reached the pass mark */
  quizPassed: boolean;
  /** steps still missing towards the badge */
  remaining: number;
  /** every section seen and the quiz (if any) passed */
  badge: boolean;
}

export function chapterStatus(p: CourseProgress, c: ChapterId | ChapterMeta): ChapterStatus {
  const ch = chapterOf(c);
  const hasQuiz = ch.quizCount > 0;
  const seen = ch.sections.filter((s) => p.seen[sectionKey(ch.id, s.id)]).length;
  const quiz = p.quiz[ch.id];
  const passed = hasQuiz && quizPassed(quiz);
  const total = ch.sections.length + (hasQuiz ? 1 : 0);
  const done = seen + (passed ? 1 : 0);
  return {
    fraction: total ? done / total : 0,
    seen,
    sections: ch.sections.length,
    hasQuiz,
    quiz,
    quizPassed: passed,
    remaining: total - done,
    badge: total > 0 && done >= total,
  };
}

export function chapterFraction(p: CourseProgress, c: ChapterId | ChapterMeta): number {
  return chapterStatus(p, c).fraction;
}

/** Mean of the chapter fractions (every 關卡 weighs the same, like TechEDU). */
export function totalFraction(p: CourseProgress): number {
  return CHAPTERS.reduce((a, c) => a + chapterFraction(p, c), 0) / (CHAPTERS.length || 1);
}

export function badgeUnlocked(p: CourseProgress, c: ChapterId | ChapterMeta): boolean {
  return chapterStatus(p, c).badge;
}

/** The last visited 小節, if it still exists in the registry. */
export function lastVisit(p: CourseProgress): { chapter: ChapterMeta; section: { id: string; title: string } } | null {
  const l = p.last;
  const ch = l && CHAPTER_BY_ID[l.chapter];
  const s = ch && ch.sections.find((x) => x.id === l.section);
  return ch && s ? { chapter: ch, section: s } : null;
}

/**
 * Where 「繼續」 should go: the last visited 小節 while its chapter is unfinished; otherwise the
 * first unseen section (or the unpassed quiz) of the first unfinished chapter.
 */
export function nextStop(p: CourseProgress): { chapter: ChapterMeta; href: string; label: string } | null {
  const lv = lastVisit(p);
  if (lv && !chapterStatus(p, lv.chapter).badge) return { chapter: lv.chapter, href: `${lv.chapter.href}#${lv.section.id}`, label: lv.section.title };
  for (const ch of CHAPTERS) {
    const st = chapterStatus(p, ch);
    if (st.badge) continue;
    const s = ch.sections.find((x) => !isSeen(p, ch.id, x.id));
    if (s) return { chapter: ch, href: `${ch.href}#${s.id}`, label: s.title };
    if (st.hasQuiz && !st.quizPassed) return { chapter: ch, href: `${ch.href}#quiz`, label: "過關測驗" };
  }
  return null;
}

export const pct = (f: number) => Math.round(f * 100);

/** Badge name with a fallback while the registry entry is still empty. */
export function badgeName(c: ChapterId | ChapterMeta): string {
  const ch = chapterOf(c);
  return ch.badge.name.trim() || `${ch.stage}徽章`;
}
