// Topic card with 入門 (open) and 深入 (collapsed) layers; same look as the shared LayeredCard,
// but each layer can also hold comparison tables.

import type { ReactNode } from "react";
import { Cites, PointList, TagBadge } from "@/components/content/Blocks";
import type { EqTopic } from "@/content/equipment/types";
import DataTable from "./DataTable";

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current text-wood">
      <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
    </svg>
  );
}

/** `figure` is shown in the 入門 layer, after the intro paragraphs and before the tables. */
export default function TopicCard({ t, figure }: { t: EqTopic; figure?: ReactNode }) {
  return (
    <article id={t.id} className="scroll-mt-20 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl font-semibold">{t.title}</h3>
        {t.ja && (
          <span lang="ja" className="text-base text-ink">
            {t.ja}
          </span>
        )}
        {t.kana && (
          <span lang="ja" className="text-sm text-muted">
            {t.kana}
          </span>
        )}
      </header>
      <details open className="group mt-4">
        <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
          <Chevron />
          入門
        </summary>
        <div className="mt-2 space-y-2 text-[15px] leading-relaxed">
          {t.intro.map((p, i) => (
            <p key={i}>
              {p.tag && <TagBadge tag={p.tag} />}
              {p.text}
              <Cites src={p.src} />
            </p>
          ))}
          {figure && <div className="pt-2">{figure}</div>}
          {t.introTables?.map((tb) => (
            <DataTable key={tb.caption} t={tb} />
          ))}
        </div>
      </details>
      {t.deep && t.deep.length > 0 && (
        <details data-layer="deep" className="mt-3 border-t border-line pt-3">
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
            <Chevron />
            深入
          </summary>
          <div className="mt-3 space-y-5 text-[15px]">
            {t.deep.map((b) => (
              <div key={b.title}>
                <h4 className="mb-1.5 text-sm font-bold text-muted">{b.title}</h4>
                {b.points && <PointList points={b.points} />}
                {b.table && <DataTable t={b.table} />}
              </div>
            ))}
          </div>
        </details>
      )}
    </article>
  );
}
