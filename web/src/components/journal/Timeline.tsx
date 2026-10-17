"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { formatMonth, monthKey } from "@/lib/journal/date";
import { fmtPct, pct, searchText } from "@/lib/journal/model";
import { LOG_TYPES, TYPE_META } from "@/lib/journal/options";
import { totalsFor } from "@/lib/journal/stats";
import type { Entry, EntryType } from "@/lib/journal/types";
import EntryCard from "./EntryCard";
import { inputCls } from "./ui";

const PAGE = 40;

export default function Timeline({ entries, onEdit, gearName }: { entries: Entry[]; onEdit: (id: string) => void; gearName: (id: string) => string | undefined }) {
  const [types, setTypes] = useState<EntryType[]>([]);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const q = useDeferredValue(query.trim().toLowerCase());

  const logs = useMemo(() => entries.filter((e) => e.type !== "goal"), [entries]);
  const indexed = useMemo(() => logs.map((e) => ({ e, text: searchText(e) })), [logs]);
  const byQuery = useMemo(() => (q ? indexed.filter((x) => q.split(/\s+/).every((w) => x.text.includes(w))).map((x) => x.e) : logs), [indexed, logs, q]);
  const results = useMemo(() => (types.length ? byQuery.filter((e) => types.includes(e.type)) : byQuery), [byQuery, types]);
  const counts = useMemo(() => {
    const m: Partial<Record<EntryType, number>> = {};
    for (const e of byQuery) m[e.type] = (m[e.type] ?? 0) + 1;
    return m;
  }, [byQuery]);

  // Month totals come from every filtered result; only the cards are paginated.
  const monthTotals = useMemo(() => {
    const byMonth = new Map<string, Entry[]>();
    for (const e of results) {
      const m = monthKey(e.date);
      const list = byMonth.get(m);
      if (list) list.push(e);
      else byMonth.set(m, [e]);
    }
    return new Map([...byMonth].map(([m, items]) => [m, totalsFor(items, () => true)]));
  }, [results]);

  const groups = useMemo(() => {
    const g: { month: string; items: Entry[] }[] = [];
    for (const e of results.slice(0, limit)) {
      const m = monthKey(e.date);
      if (g[g.length - 1]?.month !== m) g.push({ month: m, items: [] });
      g[g.length - 1].items.push(e);
    }
    return g;
  }, [results, limit]);

  const chip = (on: boolean) =>
    `inline-flex min-h-10 items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors motion-reduce:transition-none ${on ? "border-ink bg-ink text-paper" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`;
  const toggle = (t: EntryType) => {
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
    setLimit(PAGE);
  };

  return (
    <div>
      <div className="space-y-2.5">
        <label htmlFor="journal-q" className="sr-only">
          搜尋紀錄
        </label>
        <input
          id="journal-q"
          type="search"
          value={query}
          onChange={(ev) => {
            setQuery(ev.target.value);
            setLimit(PAGE);
          }}
          placeholder="搜尋道場、射癖、老師的話、品項…"
          autoComplete="off"
          className={inputCls}
        />
        <div role="group" aria-label="依類型篩選" className="flex flex-wrap gap-1.5">
          <button type="button" aria-pressed={types.length === 0} onClick={() => setTypes([])} className={chip(types.length === 0)}>
            全部 <span className="text-xs opacity-70">{byQuery.length}</span>
          </button>
          {LOG_TYPES.map((t) => (
            <button key={t} type="button" aria-pressed={types.includes(t)} onClick={() => toggle(t)} className={chip(types.includes(t))}>
              {TYPE_META[t].label} <span className="text-xs opacity-70">{counts[t] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {results.length === logs.length ? `共 ${logs.length} 筆紀錄` : `符合 ${results.length} 筆（共 ${logs.length} 筆）`}
      </p>

      {results.length === 0 ? (
        <p className="mt-8 text-center text-muted">{logs.length ? "找不到符合的紀錄，換個關鍵字或類型試試。" : "還沒有任何紀錄。"}</p>
      ) : (
        <div className="mt-3 space-y-6">
          {groups.map((g) => {
            const t = monthTotals.get(g.month) ?? totalsFor(g.items, () => true);
            return (
              <section key={g.month} aria-labelledby={`m-${g.month}`}>
                <h3 id={`m-${g.month}`} className="sticky top-[var(--header-h)] z-10 -mx-4 flex flex-wrap items-baseline gap-x-3 bg-paper/95 px-4 py-2 backdrop-blur">
                  <span className="text-base font-bold">{formatMonth(g.month)}</span>
                  {t.sessions > 0 && (
                    <span className="text-xs text-muted">
                      練習 {t.sessions} 次・的前 {t.arrows} 射・{fmtPct(pct(t.hits, t.arrows))}
                    </span>
                  )}
                </h3>
                <ol className="mt-1 space-y-3">
                  {g.items.map((e) => (
                    <li key={e.id}>
                      <EntryCard e={e} onEdit={onEdit} gearName={gearName} />
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      )}

      {results.length > limit && (
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="min-h-11 rounded-xl border border-line bg-surface px-5 text-[15px] hover:bg-surface-2">
            顯示更多（還有 {results.length - limit} 筆）
          </button>
        </div>
      )}
    </div>
  );
}
