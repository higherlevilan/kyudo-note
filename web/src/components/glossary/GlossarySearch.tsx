"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { indexEntries, matches, SOURCE_LABEL, TERMINOLOGY_URL, type GlossaryEntry } from "@/lib/glossary";

/**
 * Phone search bars (詞彙庫, 問題研究中心): only the search field is sticky. The filter chips are one
 * horizontally scrolling row that hangs under it (absolutely positioned over an in-flow spacer of the
 * same height, so hiding it never shifts the page). Once the bar is stuck, scrolling down tucks the
 * chips away and scrolling up brings them back; they stay while a chip has keyboard focus.
 * Returns true while the chips should be hidden. sm+ keeps the chips in flow and always visible.
 */
export function useTuckFilters(bar: RefObject<HTMLElement | null>, spacer: RefObject<HTMLElement | null>, focusIn: boolean) {
  const [tucked, setTucked] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 639.98px)");
    let last = scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = scrollY;
      const b = bar.current;
      const sp = spacer.current;
      const stuck = !!b && !!sp && sp.getBoundingClientRect().top < b.getBoundingClientRect().bottom - 1;
      if (!mq.matches || !stuck) {
        setTucked(false);
        last = y;
        return;
      }
      if (Math.abs(y - last) < 8) return;
      setTucked(y > last);
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onScroll);
    };
  }, [bar, spacer]);
  return tucked && !focusIn;
}

/** Classes for the sticky bar, the chip row and the spacer; see useTuckFilters. */
export const TUCK = {
  bar: "sticky top-[var(--header-h)] z-20 -mx-4 border-b border-line bg-paper/95 px-4 py-2 backdrop-blur sm:pb-3",
  row: (tucked: boolean) =>
    `max-sm:absolute max-sm:inset-x-0 max-sm:top-full max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:border-b max-sm:border-line max-sm:bg-paper/95 max-sm:px-4 max-sm:py-1.5 max-sm:backdrop-blur max-sm:transition-[opacity,transform] max-sm:duration-200 flex gap-1.5 sm:mt-2.5 sm:flex-wrap ${
      tucked ? "max-sm:invisible max-sm:-translate-y-1 max-sm:opacity-0" : ""
    }`,
  /** chip row height on phones: py-1.5 + one min-h-10 chip + the 1px border */
  spacer: "h-[calc(3.25rem+1px)] sm:hidden",
  chip: (on: boolean) =>
    `inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-sm transition-colors ${
      on ? "border-ink bg-ink text-paper" : "border-field-border bg-surface text-ink hover:bg-surface-2"
    }`,
  input:
    "w-full rounded-xl border border-field-border bg-surface px-4 py-2 text-base text-ink placeholder:text-muted/80 focus:border-wood focus:outline-none",
};

export default function GlossarySearch({ entries, categories }: { entries: GlossaryEntry[]; categories: string[] }) {
  const indexed = useMemo(() => indexEntries(entries), [entries]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const deferred = useDeferredValue(query);

  const byQuery = useMemo(() => indexed.filter((e) => matches(e, deferred)), [indexed, deferred]);
  const results = useMemo(() => (category ? byQuery.filter((e) => e.category === category) : byQuery), [byQuery, category]);
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of byQuery) m[e.category] = (m[e.category] ?? 0) + 1;
    return m;
  }, [byQuery]);

  const chip = TUCK.chip;
  const bar = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const [focusIn, setFocusIn] = useState(false);
  const tucked = useTuckFilters(bar, spacer, focusIn);

  return (
    <div>
      <div ref={bar} className={TUCK.bar}>
        <label htmlFor="glossary-q" className="sr-only">
          搜尋詞彙
        </label>
        <input
          id="glossary-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="漢字、假名、羅馬拼音或中文"
          autoComplete="off"
          spellCheck={false}
          className={TUCK.input}
        />
        <div
          role="group"
          aria-label="分類"
          onFocus={() => setFocusIn(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setFocusIn(false)}
          className={TUCK.row(tucked)}
        >
          <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)} className={chip(category === null)}>
            全部 <span className="text-xs opacity-70">{byQuery.length}</span>
          </button>
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(category === c ? null : c)} className={chip(category === c)}>
              {c} <span className="text-xs opacity-70">{counts[c] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
      <div ref={spacer} aria-hidden="true" className={TUCK.spacer} />

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        共 {results.length} 條{deferred.trim() && `符合「${deferred.trim()}」`}
      </p>

      {results.length === 0 ? (
        <p className="mt-8 text-center text-muted">找不到符合的詞彙。可以試試只輸入一部分，或改用假名、羅馬拼音。</p>
      ) : (
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {results.map((e) => (
            <li key={e.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span lang="ja" className="text-xl font-semibold break-all">
                  {e.kanji}
                </span>
                <span lang="ja" className="text-sm text-muted">
                  {e.kana}
                </span>
                <span className="text-sm text-muted">{e.romaji}</span>
              </div>
              <p className="mt-2 leading-relaxed">{e.zh}</p>
              {e.disputed && (
                <p className="mt-2 rounded-md bg-vermilion/10 px-2 py-1 text-xs text-vermilion">說法不一或待查證：{e.note}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                <span className="rounded border border-line px-1.5 py-px">{e.category}</span>
                {e.source.map((s) =>
                  s === "A" ? (
                    <a
                      key={s}
                      href={TERMINOLOGY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={SOURCE_LABEL[s]}
                      className="rounded border border-indigo/30 bg-indigo/10 px-1.5 py-px text-indigo no-underline hover:underline"
                    >
                      出典：官方辭典
                    </a>
                  ) : (
                    <span key={s} title={SOURCE_LABEL[s] ?? s} className="rounded border border-line px-1.5 py-px">
                      出典：{SOURCE_LABEL[s] ?? s}
                    </span>
                  ),
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
