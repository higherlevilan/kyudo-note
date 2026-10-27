"use client";

// 課程目錄 (TechEDU buildNav): brand, total progress, the ordered 關卡 with progress rings, the
// current chapter expanded to its numbered 小節 (seen dots, current one highlighted), then 工具.
// Rendered in the lg+ sidebar and inside the mobile drawer.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import Mascot from "@/components/mascot/Mascot";
import { CHAPTERS, TOOLS } from "@/content/course/registry";
import { chapterStatus, isSeen, pct, totalFraction, useCourseProgress } from "@/lib/course/progress";
import type { ChapterMeta } from "@/lib/course/types";
import Ring from "./Ring";
import ResetProgress from "./ResetProgress";

const trim = (p: string) => p.replace(/\/+$/, "") || "/";

export function useCurrentChapter(): ChapterMeta | undefined {
  const pathname = trim(usePathname() ?? "/");
  return CHAPTERS.find((c) => trim(c.href) === pathname);
}

/** The section of the current page nearest the top of the viewport. */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    const els = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((x): x is HTMLElement => !!x);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return active;
}

export function TotalProgress({ className = "" }: { className?: string }) {
  const p = useCourseProgress();
  const total = pct(totalFraction(p));
  const id = useId();
  return (
    <div className={`grid grid-cols-[auto_1fr_auto] items-center gap-2.5 text-xs text-muted ${className}`}>
      <span id={id}>總進度</span>
      <span
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={total}
        className="h-2 overflow-hidden rounded-full bg-surface-2"
      >
        <span className="block h-full rounded-full bg-wood motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${total}%` }} />
      </span>
      <b className="font-semibold text-ink tabular-nums">{total}%</b>
    </div>
  );
}

export default function CourseNav({ onNavigate }: { onNavigate?: () => void }) {
  const p = useCourseProgress();
  const current = useCurrentChapter();
  const pathname = trim(usePathname() ?? "/");
  const ids = current ? [...current.sections.map((s) => s.id), ...(current.quizCount ? ["quiz"] : [])] : [];
  const active = useActiveSection(ids);

  return (
    <div className="flex min-h-full flex-col gap-4 px-3.5 pt-5 pb-6">
      <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 text-ink no-underline hover:bg-surface-2">
        <Mascot mood="happy" size={40} />
        <span className="min-w-0 leading-tight">
          <b className="block text-[17px] font-bold tracking-wide">弓道學習筆記</b>
          <small className="text-xs text-muted">Kyudo Note・修煉路線</small>
        </span>
      </Link>

      <TotalProgress className="px-1.5" />

      <nav aria-label="修煉路線">
        <p className="px-1.5 pb-1 text-xs tracking-[0.2em] text-muted">修煉路線</p>
        <ol className="flex flex-col gap-0.5">
          {CHAPTERS.map((ch) => {
            const st = chapterStatus(p, ch);
            const open = current?.id === ch.id;
            return (
              <li key={ch.id}>
                <Link
                  href={ch.href}
                  onClick={onNavigate}
                  aria-current={open ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-ink no-underline ${open ? "bg-wood-soft" : "hover:bg-surface-2"}`}
                >
                  <Ring fraction={st.fraction} label={st.badge ? "已完成" : `完成 ${pct(st.fraction)}%`}>
                    {ch.tag}
                  </Ring>
                  <span className="flex min-w-0 flex-col leading-snug">
                    <small className="text-[11px] text-muted">{ch.stage}</small>
                    <b className="truncate text-[14.5px] font-semibold">{ch.title}</b>
                  </span>
                </Link>
                {open && (
                  <ol className="mt-1 mb-2 ml-[1.35rem] border-l border-line pl-3">
                    {ch.sections.map((s, k) => {
                      const seen = isSeen(p, ch.id, s.id);
                      const here = active === s.id;
                      return (
                        <li key={s.id}>
                          <Link
                            href={`${ch.href}#${s.id}`}
                            onClick={onNavigate}
                            aria-current={here ? "location" : undefined}
                            className={`relative flex min-h-10 items-center gap-2 rounded-lg px-2 py-1 text-[13px] leading-snug no-underline ${
                              here ? "bg-surface-2 font-semibold text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`absolute top-1/2 -left-[1.03rem] h-2 w-2 -translate-y-1/2 rounded-full ${seen ? "bg-wood" : "border border-line bg-surface"}`}
                            />
                            <span className="w-5 shrink-0 text-[11px] text-muted tabular-nums">{String(k + 1).padStart(2, "0")}</span>
                            <span lang={s.ja && s.ja === s.title ? "ja" : undefined} className="min-w-0 flex-1">
                              {s.title}
                            </span>
                            {seen && (
                              <span className="shrink-0 text-[11px] text-wood">
                                <span aria-hidden="true">✓</span>
                                <span className="sr-only">（已讀）</span>
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                    {ch.quizCount > 0 && (
                      <li>
                        <Link
                          href={`${ch.href}#quiz`}
                          onClick={onNavigate}
                          aria-current={active === "quiz" ? "location" : undefined}
                          className={`relative flex min-h-10 items-center gap-2 rounded-lg px-2 py-1 text-[13px] no-underline ${
                            active === "quiz" ? "bg-surface-2 font-semibold text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`absolute top-1/2 -left-[1.03rem] h-2 w-2 -translate-y-1/2 rotate-45 ${st.quizPassed ? "bg-vermilion" : "border border-line bg-surface"}`}
                          />
                          <span aria-hidden="true" className="w-5 shrink-0 text-[11px] text-vermilion">
                            測
                          </span>
                          <span className="flex-1">過關測驗</span>
                          {st.quiz && (
                            <span className={`shrink-0 text-[11px] tabular-nums ${st.quizPassed ? "text-wood" : "text-muted"}`}>
                              {st.quiz.correct}/{st.quiz.total}
                              <span className="sr-only">{st.quizPassed ? "（已過關）" : "（未過關）"}</span>
                            </span>
                          )}
                        </Link>
                      </li>
                    )}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <nav aria-label="工具">
        <p className="px-1.5 pb-1 text-xs tracking-[0.2em] text-muted">工具</p>
        <ul className="flex flex-col gap-0.5">
          {TOOLS.map((t) => {
            const here = pathname === trim(t.href);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  onClick={onNavigate}
                  aria-current={here ? "page" : undefined}
                  className={`flex min-h-10 items-baseline justify-between gap-2 rounded-xl px-2.5 py-1.5 text-[14px] no-underline ${
                    here ? "bg-wood-soft text-ink" : "text-ink hover:bg-surface-2"
                  }`}
                >
                  <span>{t.label}</span>
                  <small lang="ja" className="truncate text-[11px] text-muted">
                    {t.ja}
                  </small>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-line pt-3">
        <p className="px-1.5 text-xs leading-relaxed text-muted">進度只記在這台瀏覽器，換裝置不會跟著走。</p>
        <ResetProgress className="mt-1" />
      </div>
    </div>
  );
}
