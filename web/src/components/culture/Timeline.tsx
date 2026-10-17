"use client";

// Interactive history timeline: filter by 日本／台灣, optionally show only 說法不一 entries.

import { useId, useState } from "react";
import { Cites, TagBadge } from "@/components/content/Blocks";
import { ERAS, TIMELINE, type Track } from "@/content/culture/timeline";

type Filter = "all" | Track;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "jp", label: "日本" },
  { id: "tw", label: "台灣" },
];

const TRACK_LABEL: Record<Track, string> = { jp: "日本", tw: "台灣" };

export default function Timeline() {
  const [filter, setFilter] = useState<Filter>("all");
  const [onlyDisputed, setOnlyDisputed] = useState(false);
  const uid = useId();

  const events = TIMELINE.filter((e) => (filter === "all" || e.track === filter) && (!onlyDisputed || e.disputed));
  const groups = ERAS.map((era) => ({ era, items: events.filter((e) => e.era === era.id) })).filter((g) => g.items.length > 0);

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div role="group" aria-label="依地區篩選" className="inline-flex rounded-full border border-line bg-surface-2 p-0.5 text-sm">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3.5 py-1.5 transition-colors motion-reduce:transition-none ${
                  active ? "bg-surface font-semibold text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <label htmlFor={`${uid}-disputed`} className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            id={`${uid}-disputed`}
            type="checkbox"
            checked={onlyDisputed}
            onChange={(e) => setOnlyDisputed(e.target.checked)}
            className="h-4 w-4 accent-[var(--vermilion)]"
          />
          只看「說法不一」
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-wood" />
          日本
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-indigo" />
          台灣
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-vermilion bg-surface" />
          說法不一／待查證
        </span>
        <span aria-live="polite" className="ml-auto">
          共 {events.length} 則
        </span>
      </div>

      {groups.length > 1 && (
        <nav aria-label="跳到時代" className="mt-4 flex flex-wrap gap-1.5 text-xs">
          {groups.map(({ era }) => (
            <a
              key={era.id}
              href={`#tl-${era.id}`}
              className="rounded-full border border-line px-2.5 py-1 text-ink no-underline hover:bg-surface-2"
            >
              {era.label}
            </a>
          ))}
        </nav>
      )}

      {groups.length === 0 && <p className="mt-6 text-sm text-muted">目前的篩選條件下沒有事件。</p>}

      <div className="mt-5 space-y-6">
        {groups.map(({ era, items }) => (
          <section key={era.id} id={`tl-${era.id}`} aria-labelledby={`tl-${era.id}-h`} className="scroll-mt-20">
            <h3 id={`tl-${era.id}-h`} className="mb-3 flex items-baseline gap-2">
              <span className="text-lg font-bold">{era.label}</span>
              <span className="text-xs text-muted">{era.range}</span>
            </h3>
            <ol className="ml-1.5 border-l-2 border-line">
              {items.map((e) => {
                const dot = e.disputed
                  ? "border-2 border-dashed border-vermilion bg-surface"
                  : e.track === "tw"
                    ? "bg-indigo"
                    : "bg-wood";
                return (
                  <li key={e.id} className="relative pb-5 pl-5 last:pb-1">
                    <span aria-hidden="true" className={`absolute top-1.5 -left-[7px] h-3 w-3 rounded-full ${dot}`} />
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-semibold text-wood tabular-nums">{e.when}</span>
                      <span
                        className={`rounded px-1.5 py-px text-[11px] leading-4 ${
                          e.track === "tw" ? "bg-indigo/15 text-indigo" : "bg-wood-soft text-ink"
                        }`}
                      >
                        {TRACK_LABEL[e.track]}
                      </span>
                      {e.disputed && <TagBadge tag="disputed" />}
                    </div>
                    <p className="mt-1 font-semibold leading-snug">{e.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">
                      {e.meaning}
                      <Cites src={e.src} />
                    </p>
                    {e.note && (
                      <p
                        className={`mt-1.5 rounded-lg px-3 py-1.5 text-sm leading-relaxed ${
                          e.disputed ? "bg-vermilion/5 text-ink" : "bg-surface-2 text-muted"
                        }`}
                      >
                        <span className="font-semibold">註：</span>
                        {e.note}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
