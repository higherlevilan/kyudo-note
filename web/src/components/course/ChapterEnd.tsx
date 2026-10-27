"use client";

// End of a 關卡 (TechEDU .ch-next + badge): the chapter's badge with progress towards it, then
// previous / next chapter buttons (「下一關：… ▶」, or 「全部完成！回到路線圖 ▶」 after the last one).

import Link from "next/link";
import { CHAPTERS, CHAPTER_BY_ID } from "@/content/course/chapters";
import { badgeName, chapterStatus, pct, useCourseProgress } from "@/lib/course/progress";
import type { ChapterId } from "@/lib/course/types";
import BadgeArt from "./BadgeArt";

export default function ChapterEnd({ chapter }: { chapter: ChapterId }) {
  const ch = CHAPTER_BY_ID[chapter];
  const idx = CHAPTERS.indexOf(ch);
  const prev = CHAPTERS[idx - 1];
  const next = CHAPTERS[idx + 1];
  const st = chapterStatus(useCourseProgress(), ch);
  const n = pct(st.fraction);
  const missing = [
    st.seen < st.sections && `還有 ${st.sections - st.seen} 個小節沒讀`,
    st.hasQuiz && !st.quiz && "過關測驗還沒作答",
  ].filter(Boolean);

  return (
    <div className="mt-16 print:hidden">
      <section
        aria-label="本關徽章"
        className={`flex flex-col items-center gap-4 rounded-2xl border p-5 text-center sm:flex-row sm:text-left ${
          st.badge ? "border-vermilion/50 bg-vermilion/5" : "border-line bg-surface"
        }`}
      >
        <BadgeArt chapter={chapter} tag={ch.tag} on={st.badge} className="h-auto w-24 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-[0.2em] text-wood">{st.badge ? "已解鎖徽章" : "本關徽章"}</p>
          <p className="mt-0.5 text-xl font-bold">{badgeName(ch)}</p>
          {st.badge ? (
            <p className="mt-1 text-[15px] leading-relaxed text-muted">{ch.badge.line || `「${ch.title}」的小節和測驗都完成了。`}</p>
          ) : (
            <>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">
                讀完所有小節{st.hasQuiz && "、完成過關測驗"}就能解鎖。{missing.length > 0 && `${missing.join("，")}。`}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div
                  role="progressbar"
                  aria-label="徽章進度"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={n}
                  className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"
                >
                  <div className="h-full rounded-full bg-wood motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${n}%` }} />
                </div>
                <span className="text-sm text-muted tabular-nums">{n}%</span>
              </div>
            </>
          )}
        </div>
      </section>

      <nav aria-label="上一關與下一關" className="mt-6 flex flex-wrap justify-between gap-3">
        <Link
          href={prev ? prev.href : "/"}
          className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-field-border bg-surface px-4 text-[15px] font-semibold text-ink no-underline hover:bg-surface-2"
        >
          <span aria-hidden="true">◀</span> {prev ? `上一關：${prev.title}` : "回到路線圖"}
        </Link>
        <Link
          href={next ? next.href : "/#roadmap"}
          className="inline-flex min-h-12 items-center gap-1.5 rounded-xl bg-ink px-5 text-[15px] font-semibold text-paper no-underline hover:bg-ink/85"
        >
          {next ? `下一關：${next.title}` : "全部完成！回到路線圖"} <span aria-hidden="true">▶</span>
        </Link>
      </nav>
    </div>
  );
}
