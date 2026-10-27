// 修煉路線, full form: the light registry (./registry) merged with each chapter's extras
// (mascot lines, 過關測驗). The extras are heavy, so import this module from SERVER components
// only (ChapterHero, ChapterQuiz, CourseSection, pages); client components use ./registry.
// Mascot lines and quiz live in ./<chapterId>.ts, badges in the registry.

import type { ChapterDef, ChapterExtras, ChapterId } from "@/lib/course/types";
import { CHAPTERS as META } from "./registry";
import { EXTRAS as GUIDE } from "./guide";
import { EXTRAS as ETIQUETTE } from "./etiquette";
import { EXTRAS as SHAHO } from "./shaho";
import { EXTRAS as SHAGUSE } from "./shaguse";
import { EXTRAS as EQUIPMENT } from "./equipment";
import { EXTRAS as CULTURE } from "./culture";

export { TOOLS, sectionKicker, nextChapter } from "./registry";

export const EXTRAS_BY_ID: Record<ChapterId, ChapterExtras> = {
  guide: GUIDE,
  etiquette: ETIQUETTE,
  shaho: SHAHO,
  shaguse: SHAGUSE,
  equipment: EQUIPMENT,
  culture: CULTURE,
};

export const CHAPTERS: ChapterDef[] = META.map((m) => ({ ...EXTRAS_BY_ID[m.id], ...m }));

export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c])) as Record<ChapterId, ChapterDef>;

if (process.env.NODE_ENV !== "production") {
  for (const c of CHAPTERS)
    if (c.quizCount !== c.quiz.length) console.warn(`[course] ${c.id}: registry quizCount ${c.quizCount} ≠ ${c.quiz.length} questions`);
}
