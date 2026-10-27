// Pure progress maths over a CourseProgress snapshot. No React here, so server components can
// import it too (the store and hooks live in ./progress).

import { CHAPTERS, CHAPTER_BY_ID } from "@/content/course/chapters";
import type { ChapterDef, ChapterId, CourseProgress, QuizResult, SectionKey } from "./types";

const chapterOf = (c: ChapterId | ChapterDef) => (typeof c === "string" ? CHAPTER_BY_ID[c] : c);

export function sectionKey(chapter: ChapterId, section: string): SectionKey {
  return `${chapter}/${section}`;
}

export function isSeen(p: CourseProgress, chapter: ChapterId, section: string): boolean {
  return !!p.seen[sectionKey(chapter, section)];
}

export interface ChapterStatus {
  /** 0..1: (seen sections + quiz finished) / (sections + 1 if the chapter has a quiz) */
  fraction: number;
  seen: number;
  sections: number;
  hasQuiz: boolean;
  quiz?: QuizResult;
  /** steps still missing towards the badge */
  remaining: number;
  /** every section seen and the quiz (if any) finished */
  badge: boolean;
}

export function chapterStatus(p: CourseProgress, c: ChapterId | ChapterDef): ChapterStatus {
  const ch = chapterOf(c);
  const hasQuiz = ch.quiz.length > 0;
  const seen = ch.sections.filter((s) => p.seen[sectionKey(ch.id, s.id)]).length;
  const quiz = p.quiz[ch.id];
  const total = ch.sections.length + (hasQuiz ? 1 : 0);
  const done = seen + (hasQuiz && quiz ? 1 : 0);
  return {
    fraction: total ? done / total : 0,
    seen,
    sections: ch.sections.length,
    hasQuiz,
    quiz,
    remaining: total - done,
    badge: total > 0 && done >= total,
  };
}

export function chapterFraction(p: CourseProgress, c: ChapterId | ChapterDef): number {
  return chapterStatus(p, c).fraction;
}

/** Mean of the chapter fractions (every 關卡 weighs the same, like TechEDU). */
export function totalFraction(p: CourseProgress): number {
  return CHAPTERS.reduce((a, c) => a + chapterFraction(p, c), 0) / (CHAPTERS.length || 1);
}

export function badgeUnlocked(p: CourseProgress, c: ChapterId | ChapterDef): boolean {
  return chapterStatus(p, c).badge;
}

/** Where 「繼續」 should go: the first unseen section of the first unfinished chapter. */
export function nextStop(p: CourseProgress): { chapter: ChapterDef; href: string; label: string } | null {
  for (const ch of CHAPTERS) {
    const st = chapterStatus(p, ch);
    if (st.badge) continue;
    const s = ch.sections.find((x) => !isSeen(p, ch.id, x.id));
    if (s) return { chapter: ch, href: `${ch.href}#${s.id}`, label: s.title };
    if (st.hasQuiz && !st.quiz) return { chapter: ch, href: `${ch.href}#quiz`, label: "過關測驗" };
  }
  return null;
}

export const pct = (f: number) => Math.round(f * 100);

/** Badge name with a fallback while the chapter extras are still empty. */
export function badgeName(c: ChapterId | ChapterDef): string {
  const ch = chapterOf(c);
  return ch.badge.name.trim() || `${ch.stage}徽章`;
}
