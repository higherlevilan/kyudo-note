"use client";

import { useEffect, useRef } from "react";
import type { SessionResult } from "@/lib/practice/stats";
import { Btn, Panel } from "./ui";

export interface ReviewItem {
  id: string;
  prompt: string;
  ok: boolean;
  answer: string;
}

function cheer(ratio: number): string {
  if (ratio === 1) return "全對！動作已經記在身上了。";
  if (ratio >= 0.8) return "很穩，再練一輪就更熟了。";
  if (ratio >= 0.5) return "一半以上都對了。看一下錯的題目，再來一次。";
  return "剛開始都是這樣。看完解說再試一次，會進步很快。";
}

/** End-of-session card: score, best, streak, the missed questions, 「再來一次」. */
export default function Summary({
  correct,
  total,
  result,
  review,
  unit = "題",
  onRestart,
  onExit,
}: {
  correct: number;
  total: number;
  result: SessionResult | null;
  review?: ReviewItem[];
  unit?: string;
  onRestart: () => void;
  onExit: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const missed = review?.filter((r) => !r.ok) ?? [];
  return (
    <Panel>
      <h3 ref={heading} tabIndex={-1} className="text-xl font-bold outline-none">
        這一輪結束
      </h3>
      <div role="status" className="mt-3">
        <p className="text-4xl font-bold tabular-nums">
          {correct}
          <span className="text-xl font-normal text-muted"> / {total} {unit}</span>
        </p>
        <p className="mt-2 leading-relaxed">{cheer(total ? correct / total : 0)}</p>
        {result?.newBest && <p className="mt-1 font-semibold text-wood">新的最佳成績！</p>}
      </div>
      {result && (
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-surface-2 px-3 py-2">
            <dt className="text-muted">連續練習</dt>
            <dd className="text-lg font-semibold tabular-nums">{result.stats.streak} 天</dd>
          </div>
          <div className="rounded-xl bg-surface-2 px-3 py-2">
            <dt className="text-muted">累計完成</dt>
            <dd className="text-lg font-semibold tabular-nums">{result.stats.sessions} 輪</dd>
          </div>
          {result.previousBest && !result.newBest && (
            <div className="col-span-2 rounded-xl bg-surface-2 px-3 py-2">
              <dt className="text-muted">這個練習的最佳</dt>
              <dd className="font-semibold tabular-nums">
                {result.previousBest.correct} / {result.previousBest.total}
              </dd>
            </div>
          )}
        </dl>
      )}
      {missed.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-bold text-muted">再看一次答錯的</h4>
          <ul className="mt-2 space-y-2">
            {missed.map((r) => (
              <li key={r.id} className="rounded-xl border border-line bg-paper px-3 py-2 text-[15px] leading-relaxed">
                <span className="block text-muted">{r.prompt}</span>
                <span className="font-semibold">答案：{r.answer}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <Btn variant="primary" onClick={onRestart} className="flex-1 sm:flex-none">
          <span aria-hidden="true">↻</span> 再來一次
        </Btn>
        <Btn onClick={onExit} className="flex-1 sm:flex-none">
          回到練習選單
        </Btn>
      </div>
      <p className="mt-4 text-xs text-muted">成績只存在這台裝置的瀏覽器裡，不會傳到任何地方。</p>
    </Panel>
  );
}
