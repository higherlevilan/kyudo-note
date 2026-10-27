"use client";

// Home page pieces that read progress (TechEDU buildHome): the hero CTA + total progress,
// the 修煉路線圖 (metro map of the 關卡) and the 徽章牆. Prerendered with empty progress;
// the rings fill in right after hydration. 「繼續」 goes to the last visited 小節 while its chapter
// is unfinished (nextStop). Links don't prefetch: on phones scrolling the map would otherwise
// fetch every chapter.

import Link from "next/link";
import { useId } from "react";
import BadgeArt from "@/components/course/BadgeArt";
import Ring from "@/components/course/Ring";
import { CHAPTERS } from "@/content/course/registry";
import { badgeName, chapterStatus, nextStop, pct, totalFraction, useCourseProgress } from "@/lib/course/progress";

export function HeroCta() {
  const p = useCourseProgress();
  const total = pct(totalFraction(p));
  const stop = nextStop(p);
  const started = Object.keys(p.seen).length > 0 || Object.keys(p.quiz).length > 0 || !!p.last;
  const badges = CHAPTERS.filter((c) => chapterStatus(p, c).badge).length;
  const id = useId();
  const primary = "inline-flex min-h-12 items-center gap-1.5 rounded-xl bg-ink px-5 text-base font-semibold text-paper no-underline hover:bg-ink/85";
  const secondary =
    "inline-flex min-h-12 items-center rounded-xl border border-field-border bg-surface px-5 text-base font-semibold text-ink no-underline hover:bg-surface-2";

  return (
    <div className="mt-7 flex flex-col items-start gap-5">
      <div className="flex flex-wrap gap-3">
        {!started || !stop ? (
          <Link href={stop ? "/guide/" : "/#badges"} prefetch={false} className={primary}>
            {stop ? "從序章開始" : "全部完成！看徽章牆"} <span aria-hidden="true">▶</span>
          </Link>
        ) : (
          <>
            <Link href={stop.href} prefetch={false} className={primary}>
              繼續：{stop.chapter.tag} {stop.chapter.title}・{stop.label} <span aria-hidden="true">▶</span>
            </Link>
            <Link href="/guide/" prefetch={false} className={secondary}>
              從序章開始
            </Link>
          </>
        )}
      </div>
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm text-muted">
          <span id={id}>你的總進度</span>
          <span
            role="progressbar"
            aria-labelledby={id}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={total}
            className="h-2.5 overflow-hidden rounded-full bg-surface-2"
          >
            <span className="block h-full rounded-full bg-wood motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${total}%` }} />
          </span>
          <b className="font-semibold text-ink tabular-nums">{total}%</b>
        </div>
        <p className="mt-1.5 text-xs text-muted">
          已解鎖 {badges} / {CHAPTERS.length} 枚徽章・進度只記在這台瀏覽器
        </p>
      </div>
    </div>
  );
}

export function Roadmap() {
  const p = useCourseProgress();
  return (
    <ol className="relative">
      {CHAPTERS.map((ch, k) => {
        const st = chapterStatus(p, ch);
        const n = pct(st.fraction);
        const status = st.badge ? "已完成" : n > 0 ? `進行中 ${n}%` : "未開始";
        const last = k === CHAPTERS.length - 1;
        return (
          <li key={ch.id} className="relative flex gap-3 pb-4 last:pb-0 sm:gap-4">
            {/* the metro line to the next station */}
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute top-14 bottom-0 left-[1.6rem] w-1 -translate-x-1/2 rounded-full ${st.badge ? "bg-vermilion/70" : "bg-line"}`}
              />
            )}
            <span className="relative z-10 self-start rounded-full bg-paper p-0.5">
              <Ring fraction={st.fraction} size="lg">
                {ch.tag}
              </Ring>
            </span>
            <Link
              href={ch.href}
              prefetch={false}
              className="group block min-w-0 flex-1 rounded-2xl border border-line bg-surface p-4 text-ink no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-wood hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5"
            >
              <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-xs tracking-[0.15em] text-wood">
                  {ch.stage}・<span lang="ja">{ch.ja}</span>
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    st.badge ? "bg-vermilion/10 text-vermilion" : n > 0 ? "bg-wood-soft text-ink" : "bg-surface-2 text-muted"
                  }`}
                >
                  {st.badge && <span aria-hidden="true">✓ </span>}
                  {status}
                </span>
              </span>
              <span className="mt-1 block text-lg font-bold group-hover:text-wood">{ch.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{ch.blurb}</span>
              <span className="mt-2 block text-xs font-semibold text-wood">
                {ch.sections.length} 個小節{ch.quizCount > 0 && ` · 測驗 ${ch.quizCount} 題`}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function BadgeWall() {
  const p = useCourseProgress();
  return (
    <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
      {CHAPTERS.map((ch) => {
        const st = chapterStatus(p, ch);
        return (
          <li key={ch.id}>
            <Link
              href={ch.href}
              prefetch={false}
              title={st.badge ? ch.badge.line || badgeName(ch) : "讀完這一關的所有小節並通過測驗（答對 60%）即可解鎖"}
              className={`flex h-full flex-col items-center gap-1 rounded-2xl border px-1.5 py-3 text-center text-ink no-underline transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                st.badge ? "border-vermilion/40 bg-vermilion/5 hover:border-vermilion" : "border-line bg-surface hover:border-wood"
              }`}
            >
              <BadgeArt chapter={ch.id} tag={ch.tag} on={st.badge} className="h-auto w-16 sm:w-[4.5rem]" />
              <b className="text-[13px] leading-snug font-semibold">{badgeName(ch)}</b>
              <small className={`text-[11px] tabular-nums ${st.badge ? "font-semibold text-vermilion" : "text-muted"}`}>
                {st.badge ? "已解鎖" : `${pct(st.fraction)}%`}
                {!st.badge && <span className="sr-only">，尚未解鎖</span>}
              </small>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
