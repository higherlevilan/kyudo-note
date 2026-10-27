// Top of a 關卡 page (TechEDU .ch-hero): stage + ja eyebrow, tag chip + title, 小弓's intro bubble
// (from the extras; skipped while empty), extra intro `children`, the chapter progress card and
// the numbered table of contents with seen marks.
import type { ReactNode } from "react";
import Say from "@/components/mascot/Say";
import { CHAPTER_BY_ID } from "@/content/course/chapters";
import type { ChapterId } from "@/lib/course/types";
import { ChapterProgress, ChapterToc } from "./ChapterParts";

export default function ChapterHero({
  chapter,
  children,
  toc = true,
}: {
  chapter: ChapterId;
  /** intro paragraphs under the bubble */
  children?: ReactNode;
  /** show the numbered 小節 list (default true) */
  toc?: boolean;
}) {
  const ch = CHAPTER_BY_ID[chapter];
  return (
    <header className="pt-8 pb-6 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          <p className="text-sm tracking-[0.2em] text-wood">
            {ch.stage}・<span lang="ja">{ch.ja}</span>
          </p>
          <h1 className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-3xl leading-tight font-bold sm:text-4xl">
            <span className="rounded-lg bg-wood px-2 py-1 text-[0.45em] leading-none font-bold tracking-wider text-paper tabular-nums">
              <span className="sr-only">關卡 </span>
              {ch.tag}
            </span>
            {ch.title}
          </h1>
        </div>
        <ChapterProgress chapter={chapter} />
      </div>
      {ch.intro.trim() && <Say mood={ch.introMood ?? "happy"} html={ch.intro} className="mt-6" />}
      {children && <div className="mt-5 max-w-3xl space-y-3 leading-relaxed text-muted">{children}</div>}
      {toc && <ChapterToc chapter={chapter} />}
    </header>
  );
}
