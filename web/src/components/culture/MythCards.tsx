"use client";

// 迷思 ↔ 事實 flip cards. Only the active face is displayed (the other stays in the HTML
// with display:none); the incoming face fades in via @starting-style when motion is allowed.

import { useState } from "react";
import { Cites } from "@/components/content/Blocks";
import { MYTHS } from "@/content/culture/myths";

export default function MythCards() {
  const [flipped, setFlipped] = useState<ReadonlySet<string>>(() => new Set());
  const allOpen = flipped.size === MYTHS.length;

  const toggle = (id: string) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const face =
    "motion-safe:transition-[opacity,translate] motion-safe:duration-300 motion-safe:starting:translate-y-1 motion-safe:starting:opacity-0";

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setFlipped(allOpen ? new Set() : new Set(MYTHS.map((m) => m.id)))}
          className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink hover:bg-surface-2"
        >
          {allOpen ? "全部翻回迷思" : "全部翻到事實"}
        </button>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {MYTHS.map((m, i) => {
          const on = flipped.has(m.id);
          const factId = `myth-${m.id}-fact`;
          return (
            <li
              key={m.id}
              className={`flex flex-col rounded-2xl border shadow-sm ${on ? "border-indigo/30 bg-indigo/5" : "border-line bg-surface"}`}
            >
              <div className="flex-1 p-4 sm:p-5">
                <div className={`${face} ${on ? "hidden" : ""}`}>
                  <p className="text-xs font-semibold tracking-widest text-vermilion">迷思 {i + 1}</p>
                  <p className="mt-2 text-[17px] leading-relaxed font-semibold">「{m.myth}」</p>
                </div>
                <div id={factId} className={`${face} ${on ? "" : "hidden"}`}>
                  <p className="text-xs leading-relaxed text-muted">
                    <span className="font-semibold text-vermilion">迷思 {i + 1}</span>「{m.myth}」
                  </p>
                  <p className="mt-2 text-xs font-semibold tracking-widest text-indigo">事實</p>
                  <p className="mt-2 text-[15px] leading-relaxed">
                    {m.fact}
                    <Cites src={m.src} />
                  </p>
                </div>
              </div>
              <div className={`border-t px-4 py-2 sm:px-5 ${on ? "border-indigo/20" : "border-line"}`}>
                <button
                  type="button"
                  aria-controls={factId}
                  aria-expanded={on}
                  onClick={() => toggle(m.id)}
                  className="inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-wood"
                >
                  <span aria-hidden="true">↻</span>
                  {on ? "翻回迷思" : "看事實"}
                  <span className="sr-only">：{m.myth}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
