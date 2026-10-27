"use client";

// Client bits of a 關卡 page that depend on progress: the chapter progress card, the
// 「從上次的地方繼續」 link and the numbered table of contents with seen marks (TechEDU .ch-toc).

import { CHAPTER_BY_ID } from "@/content/course/registry";
import { chapterStatus, isSeen, pct, useCourseProgress, useEntryVisit } from "@/lib/course/progress";
import type { ChapterId } from "@/lib/course/types";
import Ring from "./Ring";

export function ChapterProgress({ chapter, className = "" }: { chapter: ChapterId; className?: string }) {
  const ch = CHAPTER_BY_ID[chapter];
  const st = chapterStatus(useCourseProgress(), ch);
  const n = pct(st.fraction);
  return (
    <div className={`flex items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-2 ${className}`}>
      <Ring fraction={st.fraction} size="lg" label={st.badge ? "本關已完成" : `本關完成 ${n}%`}>
        {st.badge ? "✓" : `${n}%`}
      </Ring>
      <div className="text-sm leading-snug">
        <p className="font-semibold">{st.badge ? "本關完成" : "本關進度"}</p>
        <p className="text-muted tabular-nums">
          已讀 {st.seen} / {st.sections}
          {st.hasQuiz && <> · 測驗 {st.quizPassed ? "已過關" : st.quiz ? "未過關" : "未作答"}</>}
        </p>
      </div>
    </div>
  );
}

/** 「從上次的地方繼續：…」 when the last visited 小節 (as of entering this page) is in this chapter. */
export function ResumeHint({ chapter, className = "" }: { chapter: ChapterId; className?: string }) {
  const ch = CHAPTER_BY_ID[chapter];
  const visit = useEntryVisit(chapter);
  const s = visit && ch.sections.find((x) => x.id === visit.section);
  if (!s) return null;
  return (
    <p className={className}>
      <a
        href={`#${s.id}`}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-wood/50 bg-wood-soft/50 px-4 text-[15px] font-semibold text-ink no-underline hover:bg-wood-soft"
      >
        從上次的地方繼續：<span lang={s.ja && s.ja === s.title ? "ja" : undefined}>{s.title}</span> <span aria-hidden="true">▶</span>
      </a>
    </p>
  );
}

export function ChapterToc({ chapter }: { chapter: ChapterId }) {
  const ch = CHAPTER_BY_ID[chapter];
  const p = useCourseProgress();
  const st = chapterStatus(p, ch);
  const item = "flex min-h-11 items-baseline gap-2.5 border-b border-dashed border-line py-2 text-[15px] text-ink no-underline hover:text-wood";
  return (
    <nav aria-label="本關小節" className="mt-6">
      <ol className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {ch.sections.map((s, k) => {
          const seen = isSeen(p, ch.id, s.id);
          return (
            <li key={s.id}>
              <a href={`#${s.id}`} className={item}>
                <span className={`w-5 shrink-0 text-xs tabular-nums ${seen ? "font-semibold text-wood" : "text-muted"}`}>{String(k + 1).padStart(2, "0")}</span>
                <span lang={s.ja && s.ja === s.title ? "ja" : undefined} className="min-w-0 flex-1">
                  {s.title}
                </span>
                {seen && (
                  <span className="shrink-0 text-xs text-wood">
                    <span aria-hidden="true">✓</span>
                    <span className="sr-only">已讀</span>
                  </span>
                )}
              </a>
            </li>
          );
        })}
        {st.hasQuiz && (
          <li>
            <a href="#quiz" className={item}>
              <span aria-hidden="true" className="w-5 shrink-0 text-xs font-semibold text-vermilion">
                測
              </span>
              <span className="min-w-0 flex-1">過關測驗</span>
              {st.quiz && (
                <span className={`shrink-0 text-xs tabular-nums ${st.quizPassed ? "text-wood" : "text-muted"}`}>
                  {st.quiz.correct}/{st.quiz.total}
                  <span className="sr-only">{st.quizPassed ? "（已過關）" : "（未過關）"}</span>
                </span>
              )}
            </a>
          </li>
        )}
      </ol>
    </nav>
  );
}
