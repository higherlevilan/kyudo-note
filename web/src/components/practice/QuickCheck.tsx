"use client";

// 小測驗: 2–3 fixed questions at the end of a page, immediate feedback, a link to /practice.
// Data comes in as props (see src/content/practice/quickchecks.ts); no glossary, no storage.

import Link from "next/link";
import { useId, useState } from "react";
import type { QuickCheckSet } from "@/content/practice/quickchecks";
import { More, SourceLinks, TagChip, Verdict } from "./ui";

export default function QuickCheck({ set, title = "小測驗" }: { set: QuickCheckSet; title?: string }) {
  const [picked, setPicked] = useState<Record<string, number>>({});
  const uid = useId();
  const qs = set.questions;
  if (!qs.length) return null;
  const answered = qs.filter((q) => picked[q.id] !== undefined).length;
  const correct = qs.filter((q) => picked[q.id] === q.answer).length;
  const headingId = `${uid}-title`;

  return (
    <section aria-labelledby={headingId} className="mt-12 rounded-2xl border border-wood/40 bg-wood-soft/40 p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={headingId} className="text-xl font-bold">
          {title}
          <span className="ml-2 text-sm font-normal text-muted">{qs.length} 題，點一下就知道答案</span>
        </h2>
        <p className="text-sm text-muted tabular-nums" aria-live="polite">
          {answered > 0 && `答對 ${correct} / ${answered}`}
        </p>
      </div>
      <ol className="mt-4 space-y-4">
        {qs.map((q, qi) => {
          const p = picked[q.id];
          const done = p !== undefined;
          const ok = p === q.answer;
          return (
            <li key={q.id} className="rounded-xl border border-line bg-surface p-4">
              <p id={`${uid}-${q.id}`} className="font-semibold leading-relaxed">
                <span className="mr-1.5 text-wood tabular-nums">{qi + 1}.</span>
                {q.prompt}
              </p>
              <div role="group" aria-labelledby={`${uid}-${q.id}`} className="mt-3 grid gap-2">
                {q.options.map((o, i) => {
                  const isAnswer = i === q.answer;
                  const isPicked = i === p;
                  let look = "border-field-border bg-paper hover:border-wood hover:bg-surface-2";
                  if (done) {
                    if (isAnswer) look = "border-indigo bg-indigo/10";
                    else if (isPicked) look = "border-vermilion bg-vermilion/10";
                    else look = "border-line bg-paper opacity-60";
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-disabled={done}
                      aria-pressed={isPicked}
                      onClick={() => !done && setPicked((s) => ({ ...s, [q.id]: i }))}
                      className={`flex min-h-11 w-full items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-left text-[15px] transition-colors ${look}`}
                    >
                      <span lang={o.ja ? "ja" : undefined} className="flex-1">
                        {o.text}
                      </span>
                      {done && isAnswer && (
                        <span className="shrink-0 text-sm font-bold text-indigo">
                          <span aria-hidden="true">✓ </span>正解
                        </span>
                      )}
                      {done && isPicked && !isAnswer && (
                        <span className="shrink-0 text-sm font-bold text-vermilion">
                          <span aria-hidden="true">✗ </span>你選的
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {done && (
                  <div className="mt-3 border-t border-line pt-3">
                    <Verdict ok={ok} />
                    <p className="mt-1.5 text-[15px] leading-relaxed">
                      {q.tag && (
                        <span className="mr-1.5 align-[1px]">
                          <TagChip tag={q.tag} />
                        </span>
                      )}
                      {q.explain}
                    </p>
                    <SourceLinks src={q.src} />
                    <More link={q.more} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {answered === qs.length ? (
          <button type="button" onClick={() => setPicked({})} className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-wood hover:bg-surface-2">
            <span aria-hidden="true">↻</span> 重做
          </button>
        ) : (
          <span />
        )}
        <Link
          href={set.practice.href}
          className="inline-flex min-h-11 items-center rounded-xl bg-ink px-4 text-[15px] font-semibold text-paper no-underline hover:bg-ink/85"
        >
          更多練習：{set.practice.label} →
        </Link>
      </div>
    </section>
  );
}
