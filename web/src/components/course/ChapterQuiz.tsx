// 過關測驗 for a 關卡 (TechEDU HC.quiz). Server component: reads the chapter's extras (which only
// this chapter's page needs), puts each question's options in its fixed per-id shuffled order
// (lib/course/shuffle, so the prerendered HTML and the client agree), and hands just that quiz to
// the client panel. Renders nothing while the chapter has no questions.

import { CHAPTER_BY_ID } from "@/content/course/chapters";
import { shuffleQuestion } from "@/lib/course/shuffle";
import type { ChapterId } from "@/lib/course/types";
import ChapterQuizPanel from "./ChapterQuizPanel";

export default function ChapterQuiz({ chapter, title = "過關測驗" }: { chapter: ChapterId; title?: string }) {
  const questions = CHAPTER_BY_ID[chapter].quiz.map(shuffleQuestion);
  if (!questions.length) return null;
  return <ChapterQuizPanel chapter={chapter} title={title} questions={questions} />;
}
