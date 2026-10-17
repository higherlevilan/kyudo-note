"use client";

// 射法八節排序: tap the shuffled cards in order (tap-only, no drag), fix mistakes with
// ↑ ↓ ✕, then check. The result shows the correct order with a one-line explanation
// from each section's intro and a link to /shaho/#<id>.

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ORDER_CARDS, SHAHO_SOURCES, type OrderCard } from "@/content/practice/shaho";
import { THUMB_POSE } from "@/content/illustrations/archer/poses";
import ArcherFigure from "@/components/illustrations/archer/ArcherFigure";
import { shuffle } from "@/lib/practice/random";
import { recordSession, type SessionResult } from "@/lib/practice/stats";
import { Btn, Panel, SourceLinks, Verdict } from "./ui";

const byId = new Map(ORDER_CARDS.map((c) => [c.id, c]));

function freshPool(): string[] {
  let p = shuffle(ORDER_CARDS.map((c) => c.id));
  // Never start already in order.
  while (p.every((id, i) => id === ORDER_CARDS[i].id)) p = shuffle(p);
  return p;
}

export default function OrderGame({ onExit }: { onExit: () => void }) {
  const [pool, setPool] = useState(freshPool);
  const [placed, setPlaced] = useState<string[]>([]);
  const [showZh, setShowZh] = useState(true);
  const [checked, setChecked] = useState<{ result: SessionResult | null } | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  // Element to focus after a tap removes or moves the focused button.
  const [focusTarget, setFocus] = useState<{ el: string; n: number } | null>(null);
  const setFocusTarget = (el: string | null) => setFocus((f) => (el ? { el, n: (f?.n ?? 0) + 1 } : null));
  const total = ORDER_CARDS.length;
  const remaining = pool.filter((id) => !placed.includes(id));

  useEffect(() => {
    if (checked) resultRef.current?.focus();
  }, [checked]);
  useEffect(() => {
    if (focusTarget) document.getElementById(`${uid}-${focusTarget.el}`)?.focus();
  }, [focusTarget, uid]);

  const add = (id: string) => {
    const rest = remaining.filter((x) => x !== id);
    const at = remaining.indexOf(id);
    const nextId = rest[Math.min(at, rest.length - 1)];
    setPlaced((p) => (p.includes(id) ? p : [...p, id]));
    setFocusTarget(nextId ? `pool-${nextId}` : "check");
  };
  const remove = (id: string) => {
    setPlaced((p) => p.filter((x) => x !== id));
    setFocusTarget(`pool-${id}`);
  };
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= placed.length) return;
    const a = placed.slice();
    [a[i], a[j]] = [a[j], a[i]];
    setPlaced(a);
    // Keep focus on the moved card's arrow; use the other arrow once it reaches an end.
    const atEnd = d === -1 ? j === 0 : j === a.length - 1;
    const same = d === -1 ? "up" : "down";
    const other = d === -1 ? "down" : "up";
    setFocusTarget(`${atEnd ? other : same}-${a[j]}`);
  };

  const correctCount = placed.filter((id, i) => ORDER_CARDS[i]?.id === id).length;

  const check = () => {
    let result: SessionResult | null = null;
    try {
      result = recordSession("order", correctCount, total);
    } catch {
      result = null;
    }
    setChecked({ result });
  };

  const restart = () => {
    setPool(freshPool());
    setPlaced([]);
    setChecked(null);
    setFocusTarget(null);
  };

  const label = (c: OrderCard) => (
    <span className="min-w-0 flex-1">
      <span lang="ja" className="block text-lg leading-tight font-semibold">
        {c.term}
      </span>
      <span lang="ja" className="block text-xs text-muted">
        {c.kana}
      </span>
      {showZh && <span className="block text-xs text-muted">{c.zh}</span>}
    </span>
  );

  if (checked) {
    const perfect = correctCount === total;
    return (
      <Panel>
        <h3 ref={resultRef} tabIndex={-1} className="text-xl font-bold outline-none">
          排序結果
        </h3>
        <div role="status" className="mt-2">
          <Verdict ok={perfect}>{perfect ? `全對！${total} 節都在正確的位置。` : `${correctCount} / ${total} 節在正確的位置`}</Verdict>
          {checked.result?.newBest && <p className="mt-1 font-semibold text-wood">新的最佳成績！</p>}
          {checked.result && <p className="mt-1 text-sm text-muted">連續練習 {checked.result.stats.streak} 天</p>}
        </div>
        <ol className="mt-4 space-y-2">
          {ORDER_CARDS.map((c, i) => {
            const yours = byId.get(placed[i] ?? "");
            const ok = yours?.id === c.id;
            return (
              <li key={c.id} className={`rounded-xl border-2 p-3 ${ok ? "border-indigo/40 bg-indigo/5" : "border-vermilion/40 bg-vermilion/5"}`}>
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wood-soft font-bold text-wood tabular-nums">{c.no}</span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span lang="ja" className="text-lg font-semibold">
                        {c.term}
                      </span>
                      <span lang="ja" className="text-xs text-muted">
                        {c.kana}
                      </span>
                      <span className="text-sm text-muted">{c.zh}</span>
                    </p>
                    <p className={`mt-0.5 text-sm font-semibold ${ok ? "text-indigo" : "text-vermilion"}`}>
                      <span aria-hidden="true">{ok ? "✓ " : "✗ "}</span>
                      {ok ? "位置正確" : (
                        <>
                          你放的是「<span lang="ja">{yours?.term ?? "—"}</span>」
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed">{c.line}</p>
                    <Link href={`/shaho/#${c.id}`} className="inline-flex min-h-11 items-center text-sm text-wood underline">
                      看「<span lang="ja">{c.term}</span>」的說明 →
                    </Link>
                  </div>
                  {THUMB_POSE[c.id] && (
                    <ArcherFigure pose={THUMB_POSE[c.id]} compact decorative className="h-24 w-auto shrink-0 sm:h-28" />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <SourceLinks src={SHAHO_SOURCES} />
        <div className="mt-6 flex flex-wrap gap-2">
          <Btn variant="primary" onClick={restart} className="flex-1 sm:flex-none">
            <span aria-hidden="true">↻</span> 再來一次
          </Btn>
          <Btn onClick={onExit} className="flex-1 sm:flex-none">
            回到練習選單
          </Btn>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <p className="text-[15px] leading-relaxed">從第 1 節開始，依序點選下面的卡片。放錯了可以用 ↑ ↓ 調整，或按 ✕ 拿回來。</p>
      <label className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={showZh} onChange={(e) => setShowZh(e.target.checked)} className="h-5 w-5 accent-[var(--wood)]" />
        顯示中文提示
      </label>

      <h3 className="mt-3 text-sm font-bold text-muted" id="order-yours">
        你的順序（{placed.length} / {total}）
      </h3>
      <ol aria-labelledby="order-yours" className="mt-2 space-y-1.5">
        {Array.from({ length: total }, (_, i) => {
          const c = byId.get(placed[i] ?? "");
          // Only the next empty slot is shown, so the cards to tap stay within reach on a phone.
          if (!c && i > placed.length) return null;
          if (!c) {
            return (
              <li key={`empty-${i}`} className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-dashed border-line px-3 text-muted">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-sm tabular-nums">{i + 1}</span>
                <span className="text-sm">{i === placed.length ? "← 點下面的卡片放到這裡" : ""}</span>
              </li>
            );
          }
          return (
            <li key={c.id} className="flex min-h-12 items-center gap-2 rounded-xl border-2 border-wood/40 bg-paper py-1 pr-1 pl-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wood-soft text-sm font-bold text-wood tabular-nums">{i + 1}</span>
              {label(c)}
              <span className="flex shrink-0 gap-0.5">
                <button
                  id={`${uid}-up-${c.id}`}
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`把 ${c.term} 往前移`}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-lg text-ink hover:bg-surface-2 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  id={`${uid}-down-${c.id}`}
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === placed.length - 1}
                  aria-label={`把 ${c.term} 往後移`}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-lg text-ink hover:bg-surface-2 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label={`把 ${c.term} 拿回去`}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-lg text-vermilion hover:bg-surface-2"
                >
                  ✕
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      {remaining.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-bold text-muted" id="order-pool">
            還沒放的卡片
          </h3>
          <ul aria-labelledby="order-pool" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {remaining.map((id) => {
              const c = byId.get(id) as OrderCard;
              return (
                <li key={id}>
                  <button
                    id={`${uid}-pool-${id}`}
                    type="button"
                    onClick={() => add(id)}
                    aria-label={`第 ${placed.length + 1} 節放「${c.term}」`}
                    className="flex min-h-16 w-full items-center rounded-xl border-2 border-field-border bg-surface px-3 py-2 text-left hover:border-wood hover:bg-surface-2"
                  >
                    {label(c)}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p aria-live="polite" className="sr-only">
        {placed.length > 0 ? `已放 ${placed.length} 節，最後一節是 ${byId.get(placed[placed.length - 1])?.term ?? ""}` : ""}
      </p>

      <div className="sticky bottom-0 -mx-4 mt-5 flex gap-2 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Btn onClick={() => setPlaced([])} disabled={!placed.length}>
          清除
        </Btn>
        <Btn id={`${uid}-check`} variant="primary" onClick={check} disabled={placed.length < total} className="flex-1">
          {placed.length < total ? `還差 ${total - placed.length} 節` : "檢查順序"}
        </Btn>
      </div>
    </Panel>
  );
}
