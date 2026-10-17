// Building blocks for the module pages. Server components; no client JS needed.

import type { ReactNode } from "react";
import { KIND_LABEL, TAG_LABEL, type Faq, type LayeredSection, type Point, type Source, type Tag } from "@/content/types";
import Cites from "./Cites";

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

export function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span className={`mr-1.5 inline-block rounded border px-1.5 py-px align-[1px] text-[11px] leading-4 whitespace-nowrap ${TAG_STYLE[tag]}`}>
      {TAG_LABEL[tag]}
    </span>
  );
}

export { default as Cites } from "./Cites";

export function PointList({ points }: { points: readonly Point[] }) {
  return (
    <ul className="space-y-2">
      {points.map((p, i) => (
        <li key={i} className="leading-relaxed">
          {p.tag && <TagBadge tag={p.tag} />}
          {p.text}
          <Cites src={p.src} />
        </li>
      ))}
    </ul>
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current text-wood">
      <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
    </svg>
  );
}

/** Page header shared by the module pages. */
export function PageHeader({ kicker, title, ja, children }: { kicker: string; title: string; ja?: string; children?: ReactNode }) {
  return (
    <header className="pt-10 pb-6">
      <p className="text-sm text-wood">{kicker}</p>
      <h1 className="mt-1 text-3xl font-bold">
        {title}
        {ja && (
          <span lang="ja" className="ml-2 text-xl font-normal text-muted">
            {ja}
          </span>
        )}
      </h1>
      {children && <div className="mt-3 max-w-3xl leading-relaxed text-muted">{children}</div>}
    </header>
  );
}

/** In-page table of contents chips. */
export function TocChips({ items }: { items: readonly { id: string; label: string }[] }) {
  return (
    <nav aria-label="本頁目錄" className="-mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 pb-1 text-sm whitespace-nowrap sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {items.map((s) => (
        <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full border border-line bg-surface px-3 py-1 text-ink no-underline hover:bg-surface-2">
          {s.label}
        </a>
      ))}
    </nav>
  );
}

/** A topic card with 入門 (open) and 深入 (collapsed) layers. `figure` sits between the two layers. */
export function LayeredCard({ s, figure, children }: { s: LayeredSection; figure?: ReactNode; children?: ReactNode }) {
  return (
    <article id={s.id} className="scroll-mt-20 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl font-semibold">{s.title}</h3>
        {s.ja && (
          <span lang="ja" className="text-base text-ink">
            {s.ja}
          </span>
        )}
        {s.kana && (
          <span lang="ja" className="text-sm text-muted">
            {s.kana}
          </span>
        )}
      </header>
      <details open className="group mt-4">
        <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
          <Chevron />
          入門
        </summary>
        <div className="mt-2 space-y-2 text-[15px] leading-relaxed">
          {s.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {s.introSrc && (
            <p>
              <Cites src={s.introSrc} />
            </p>
          )}
        </div>
      </details>
      {figure && <div className="mt-4 space-y-4">{figure}</div>}
      {s.deep && s.deep.length > 0 && (
        <details data-layer="deep" className="mt-3 border-t border-line pt-3">
          <summary className="flex min-h-11 items-center gap-1.5 text-sm font-semibold text-wood">
            <Chevron />
            深入
          </summary>
          <div className="mt-3 space-y-4 text-[15px]">
            {s.deep.map((b) => (
              <div key={b.title}>
                <h4 className="mb-1.5 text-sm font-bold text-muted">{b.title}</h4>
                <PointList points={b.points} />
              </div>
            ))}
          </div>
        </details>
      )}
      {children}
    </article>
  );
}

/** A titled group of sections. */
export function Section({ id, title, lead, children }: { id: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-12 scroll-mt-20">
      <h2 id={`${id}-title`} className="mb-2 text-2xl font-bold">
        {title}
      </h2>
      {lead && <div className="mb-4 max-w-3xl leading-relaxed text-muted">{lead}</div>}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/** 問題研究中心 block: collapsible questions with tagged, sourced answers. */
export function FaqList({ faqs, id = "faq", title = "常見問題" }: { faqs: readonly Faq[]; id?: string; title?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-12 scroll-mt-20">
      <h2 id={`${id}-title`} className="mb-4 text-2xl font-bold">
        {title}
      </h2>
      <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="flex items-start justify-between gap-3 font-semibold">
              <span>{f.q}</span>
              <span aria-hidden="true" className="chev mt-0.5 text-wood">
                ›
              </span>
            </summary>
            <div className="mt-3 text-[15px]">
              <PointList points={f.a} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Highlighted note box. tone: info (default) / warn. */
export function Callout({ title, tone = "info", children }: { title?: string; tone?: "info" | "warn"; children: ReactNode }) {
  const box = tone === "warn" ? "border-vermilion/40 bg-vermilion/5" : "border-wood/40 bg-wood-soft/40";
  return (
    <aside className={`rounded-2xl border p-4 text-[15px] leading-relaxed sm:p-5 ${box}`}>
      {title && <p className="mb-1 font-bold">{title}</p>}
      {children}
    </aside>
  );
}

/** Numbered source list for the bottom of a page (deduplicated by URL). */
export function SourceList({ sources, note }: { sources: readonly Source[]; note?: ReactNode }) {
  const seen = new Set<string>();
  const unique = sources.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
  return (
    <section aria-labelledby="sources" className="mt-12">
      <h2 id="sources" className="mb-3 text-xl font-bold">
        資料來源
      </h2>
      {note && <p className="mb-3 text-sm leading-relaxed text-muted">{note}</p>}
      <ol className="list-decimal space-y-1.5 pl-5 text-sm">
        {unique.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-wood underline">
              {s.label}
            </a>
            <span className="ml-2 text-xs text-muted">{KIND_LABEL[s.kind]}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
