"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { indexEntries, matches, SOURCE_LABEL, TERMINOLOGY_URL, type GlossaryEntry } from "@/lib/glossary";

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

  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${on ? "border-ink bg-ink text-paper" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`;

  return (
    <div>
      <div className="sticky top-[var(--header-h)] z-20 -mx-4 border-b border-line bg-paper/95 px-4 pt-2 pb-3 backdrop-blur">
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
          className="w-full rounded-xl border border-field-border bg-surface px-4 py-2.5 text-base text-ink placeholder:text-muted/80 focus:border-wood focus:outline-none"
        />
        <div role="group" aria-label="分類" className="mt-2.5 flex flex-wrap gap-1.5">
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
