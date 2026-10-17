// Shared frame for the /culture figures: title row, drawing, caption and a source line.
// Server component. Drawings are inline SVG coloured only through the theme tokens.

import type { ReactNode } from "react";
import { KIND_LABEL, type Source } from "@/content/types";

export function FigureFrame({
  id,
  title,
  badge,
  caption,
  sources,
  children,
}: {
  id: string;
  title: string;
  /** Short warning shown next to the title, e.g. 「假說，沒有定論」. */
  badge?: string;
  caption: ReactNode;
  sources: readonly Source[];
  children: ReactNode;
}) {
  return (
    <figure id={id} aria-labelledby={`${id}-cap`} className="mt-5 scroll-mt-20 rounded-xl border border-line bg-paper/60 p-3 sm:p-5">
      <p className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold">
        <span className="text-wood">圖解</span>
        <span>{title}</span>
        {badge && (
          <span className="rounded border border-vermilion/50 bg-vermilion/10 px-1.5 py-px text-xs font-semibold text-vermilion">{badge}</span>
        )}
      </p>
      {children}
      <figcaption id={`${id}-cap`} className="mt-3 text-sm leading-relaxed text-muted">
        {caption}
      </figcaption>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        資料：
        {sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && "；"}
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line hover:text-wood">
              {s.label}
            </a>
            <span className="ml-1 text-[11px]">（{KIND_LABEL[s.kind]}）</span>
          </span>
        ))}
      </p>
    </figure>
  );
}

/** Numbered marker used inside the SVGs and in the legends under them. */
export function Num({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-vermilion text-[11px] font-bold leading-none text-vermilion ${className}`}
    >
      {n}
    </span>
  );
}
