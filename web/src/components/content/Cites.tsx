"use client";

import { useId, useState } from "react";
import { KIND_LABEL, type Source } from "@/content/types";

/**
 * Compact citation: a small 「出處」 chip that expands to the full source list.
 * Long source labels used to wrap over two lines after every point on phones.
 * The list stays in the HTML (hidden) so it is still there without JavaScript.
 */
export default function Cites({ src }: { src?: readonly Source[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  if (!src?.length) return null;
  return (
    <span className="ml-1">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="inline-flex min-h-6 items-center gap-0.5 rounded-full border border-line px-2 align-[1px] text-[11px] leading-5 text-muted transition-colors hover:border-wood hover:text-wood"
      >
        出處{src.length > 1 && <span className="tabular-nums"> {src.length}</span>}
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      <span id={id} hidden={!open} className="mt-1.5 block rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted">
        {src.map((s, i) => (
          <span key={s.url + i} className="block">
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-line hover:text-wood">
              {s.label}
            </a>
            <span className="ml-1.5 text-[11px]">{KIND_LABEL[s.kind]}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
