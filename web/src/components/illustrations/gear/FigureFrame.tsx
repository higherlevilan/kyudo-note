// Shared <figure> wrapper for the programmatic diagrams (gear/ and dojo/).
// Same look as components/etiquette/Diagrams.tsx: a soft box, the drawing, then caption + source line.

import type { ReactNode } from "react";
import type { Source } from "@/content/types";

export default function FigureFrame({
  id,
  title,
  caption,
  sources,
  children,
  className = "",
}: {
  id?: string;
  /** Short bold lead-in of the caption. */
  title: string;
  caption?: ReactNode;
  /** Printed as the 「依據」 line under the caption. */
  sources?: readonly Source[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure id={id} className={`scroll-mt-20 rounded-xl border border-line bg-surface-2/50 p-3 sm:p-4 ${className}`}>
      {children}
      <figcaption className="mt-3 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-ink">{title}</span>
        {caption && <span className="ml-1">{caption}</span>}
        <span className="mt-1 block">
          {sources && sources.length > 0 && (
            <>
              依據：
              {sources.map((s, i) => (
                <span key={s.url + i}>
                  {i > 0 && "、"}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line hover:text-wood">
                    {s.label}
                  </a>
                </span>
              ))}
              。
            </>
          )}
          本站以程式繪製的示意圖。
        </span>
      </figcaption>
    </figure>
  );
}
