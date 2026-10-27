"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { foldText } from "@/lib/glossary";
import Cites from "@/components/content/Cites";
import { TUCK, useTuckFilters } from "@/components/glossary/GlossarySearch";
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

/** Open and scroll to the pending deep-linked question, if it is on the page. */
function reveal(target: { current: string | null }) {
  const el = target.current ? document.getElementById(target.current) : null;
  if (!(el instanceof HTMLDetailsElement)) return;
  target.current = null;
  el.open = true;
  el.scrollIntoView({ block: "start" });
}

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

  // Deep links from the chapter pages: /faq/#<module> filters to that chapter; /faq/#<module>-<n>
  // also opens that question and scrolls to it (ids are `${key}-${index}`, see app/faq/page.tsx).
  const openTarget = useRef<string | null>(null);
  useEffect(() => {
    const keys = new Set(modules.map((m) => m.key));
    const apply = () => {
      let h = "";
      try {
        h = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      if (keys.has(h)) return setMod(h);
      const m = /^(.+)-(\d+)$/.exec(h);
      if (!m || !keys.has(m[1])) return;
      setQuery("");
      setOfficialOnly(false);
      setMod(m[1]);
      openTarget.current = h;
      reveal(openTarget);
    };
    const r = requestAnimationFrame(apply);
    addEventListener("hashchange", apply);
    return () => {
      cancelAnimationFrame(r);
      removeEventListener("hashchange", apply);
    };
  }, [modules]);
  // Runs after every render, so it also catches the question once the new filter has rendered it.
  useEffect(() => reveal(openTarget));

  const chip = TUCK.chip;
  const bar = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const [focusIn, setFocusIn] = useState(false);
  const tucked = useTuckFilters(bar, spacer, focusIn);

  return (
    <div>
      <div ref={bar} className={TUCK.bar}>
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
          className={TUCK.input}
        />
        {/* Phones: one horizontally scrolling row under the sticky search field, tucked away while scrolling down. */}
        <div
          role="group"
          aria-label="篩選"
          onFocus={() => setFocusIn(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setFocusIn(false)}
          className={TUCK.row(tucked)}
        >
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
      <div ref={spacer} aria-hidden="true" className={TUCK.spacer} />

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        共 {results.length} 題
      </p>

      {results.length === 0 ? (
        <p className="mt-8 text-center text-muted">找不到符合的問題，試試換個關鍵字。</p>
      ) : (
        <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
          {results.map((f) => (
            <details key={f.id} id={f.id} className="group scroll-mt-44 p-5">
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
