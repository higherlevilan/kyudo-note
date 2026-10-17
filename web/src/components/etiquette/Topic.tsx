// A LayeredCard variant with slots for tables or diagrams inside the 入門 / 深入 layers.
// Same visual language as components/content/Blocks.tsx#LayeredCard.

import type { ReactNode } from "react";
import type { LayeredSection } from "@/content/types";
import { Cites, PointList } from "@/components/content/Blocks";

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current text-wood">
      <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
    </svg>
  );
}

export default function Topic({
  s,
  introExtra,
  deepExtra,
  deepLabel = "深入",
}: {
  s: LayeredSection;
  /** shown inside the open 入門 layer, after the intro paragraphs */
  introExtra?: ReactNode;
  /** shown inside the collapsed 深入 layer, before the deep blocks */
  deepExtra?: ReactNode;
  deepLabel?: string;
}) {
  const hasDeep = Boolean(deepExtra) || (s.deep?.length ?? 0) > 0;
  return (
    <article id={s.id} className="scroll-mt-20 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl font-semibold">{s.title}</h3>
        {s.ja && s.ja !== s.title && (
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
        {introExtra && <div className="mt-4">{introExtra}</div>}
      </details>
      {hasDeep && (
        <details data-layer="deep" className="mt-3 border-t border-line pt-3">
          <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
            <Chevron />
            {deepLabel}
          </summary>
          <div className="mt-3 space-y-4 text-[15px]">
            {deepExtra}
            {s.deep?.map((b) => (
              <div key={b.title}>
                <h4 className="mb-1.5 text-sm font-bold text-muted">{b.title}</h4>
                <PointList points={b.points} />
              </div>
            ))}
          </div>
        </details>
      )}
    </article>
  );
}

/** Horizontally scrollable container so wide tables never push the page wider than the viewport. */
export function ScrollTable({ label, children, hint = true }: { label: string; children: ReactNode; hint?: boolean }) {
  return (
    <div>
      <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto rounded-xl border border-line bg-surface">
        {children}
      </div>
      {hint && <p className="mt-1 text-xs text-muted sm:hidden">表格可左右滑動。</p>}
    </div>
  );
}
