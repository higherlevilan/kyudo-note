"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { foldText } from "@/lib/glossary";
import Cites from "@/components/content/Cites";
import { TAG_LABEL, type Faq, type Tag } from "@/content/types";

export interface HubFaq extends Faq {
  id: string;
  module: string;
  moduleLabel: string;
  moduleHref: string;
}

const TAG_STYLE: Record<Tag, string> = {
  official: "bg-indigo/15 text-indigo border-indigo/30",
  guide: "bg-wood-soft text-ink border-wood/30",
  local: "bg-surface-2 text-ink border-line",
  research: "bg-surface-2 text-ink border-indigo/30",
  shop: "bg-surface-2 text-ink border-line",
  folk: "bg-vermilion/10 text-vermilion border-vermilion/40",
  note: "bg-surface-2 text-muted border-line",
  disputed: "bg-vermilion/10 text-vermilion border-vermilion/40",
};

export default function FaqHub({ faqs, modules }: { faqs: HubFaq[]; modules: { key: string; label: string; href: string }[] }) {
  const [query, setQuery] = useState("");
  const [mod, setMod] = useState<string | null>(null);
  const [officialOnly, setOfficialOnly] = useState(false);
  const deferred = useDeferredValue(query);

  const indexed = useMemo(
    () => faqs.map((f) => ({ f, key: foldText(`${f.q}|${f.topic ?? ""}|${f.a.map((p) => p.text).join("|")}`) })),
    [faqs],
  );
  const results = useMemo(() => {
    const terms = deferred.trim().split(/\s+/).map(foldText).filter(Boolean);
    return indexed
      .filter(({ f, key }) => (!mod || f.module === mod) && terms.every((t) => key.includes(t)))
      .filter(({ f }) => !officialOnly || f.a.some((p) => p.tag === "official"))
      .map(({ f }) => f);
  }, [indexed, deferred, mod, officialOnly]);

  const chip = (on: boolean) =>
    `shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors ${on ? "border-ink bg-ink text-paper" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`;

  return (
    <div>
      <div className="sticky top-[var(--header-h)] z-20 -mx-4 border-b border-line bg-paper/95 px-4 pt-2 pb-3 backdrop-blur">
        <label htmlFor="faq-q" className="sr-only">
          搜尋問題
        </label>
        <input
          id="faq-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例如：矢尺、会、跪坐、審查費"
          autoComplete="off"
          className="w-full rounded-xl border border-field-border bg-surface px-4 py-2.5 text-base text-ink placeholder:text-muted/80 focus:border-wood focus:outline-none"
        />
        {/* Phones: one horizontally scrolling row so the sticky bar stays short. */}
        <div role="group" aria-label="篩選" className="-mx-4 mt-2.5 flex flex-nowrap gap-1.5 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <button type="button" aria-pressed={mod === null} onClick={() => setMod(null)} className={chip(mod === null)}>
            全部
          </button>
          {modules.map((m) => (
            <button key={m.key} type="button" aria-pressed={mod === m.key} onClick={() => setMod(mod === m.key ? null : m.key)} className={chip(mod === m.key)}>
              {m.label}
            </button>
          ))}
          <button type="button" aria-pressed={officialOnly} onClick={() => setOfficialOnly(!officialOnly)} className={chip(officialOnly)}>
            只看有官方依據的
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        共 {results.length} 題
      </p>

      {results.length === 0 ? (
        <p className="mt-8 text-center text-muted">找不到符合的問題，試試換個關鍵字。</p>
      ) : (
        <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
          {results.map((f) => (
            <details key={f.id} className="group p-5">
              <summary className="flex items-start justify-between gap-3">
                <span>
                  <span className="font-semibold">{f.q}</span>
                  <span className="mt-1 block text-xs text-muted">
                    {f.moduleLabel}
                    {f.topic && ` · ${f.topic}`}
                  </span>
                </span>
                <span aria-hidden="true" className="chev mt-0.5 text-wood">
                  ›
                </span>
              </summary>
              <ul className="mt-3 space-y-2 text-[15px]">
                {f.a.map((p, i) => (
                  <li key={i} className="leading-relaxed">
                    {p.tag && (
                      <span className={`mr-1.5 inline-block rounded border px-1.5 py-px align-[1px] text-[11px] leading-4 whitespace-nowrap ${TAG_STYLE[p.tag]}`}>
                        {TAG_LABEL[p.tag]}
                      </span>
                    )}
                    {p.text}
                    <Cites src={p.src} />
                  </li>
                ))}
              </ul>
              <Link href={f.moduleHref} className="mt-3 inline-block text-sm text-wood underline">
                到「{f.moduleLabel}」看完整說明 →
              </Link>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
