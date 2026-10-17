"use client";

// ○× 記錄表: tap 「○ 中」/「× 未中」 to append arrows (rows of 4 = 一立 or 2 = 一手),
// or tap any recorded arrow to cycle it ○ → × → (未射).

import { useState } from "react";
import { fmtPct, gridCounts, pct } from "@/lib/journal/model";
import type { Mark } from "@/lib/journal/types";
import { MarkGlyph } from "./ui";

const next = (m: Mark): Mark => (m === "o" ? "x" : m === "x" ? "" : "o");
const markName = (m: Mark) => (m === "o" ? "中" : m === "x" ? "未中" : "未射");

export default function ScoreSheet({ rounds, onChange }: { rounds: Mark[][]; onChange: (r: Mark[][]) => void }) {
  const [size, setSize] = useState<2 | 4>(() => (rounds[0]?.length === 2 ? 2 : 4));
  const { arrows, hits } = gridCounts(rounds);

  const append = (m: Mark) => {
    const rs = rounds.map((r) => [...r]);
    const last = rs[rs.length - 1];
    const slot = last ? last.indexOf("") : -1;
    if (last && slot >= 0) last[slot] = m;
    else {
      const row: Mark[] = Array.from({ length: size }, () => "");
      row[0] = m;
      rs.push(row);
    }
    onChange(rs);
  };

  const undo = () => {
    const rs = rounds.map((r) => [...r]);
    for (let i = rs.length - 1; i >= 0; i--) {
      const j = rs[i].map((m) => m !== "").lastIndexOf(true);
      if (j >= 0) {
        rs[i][j] = "";
        if (rs[i].every((m) => !m)) rs.splice(i, 1);
        onChange(rs);
        return;
      }
      rs.splice(i, 1);
    }
    onChange(rs);
  };

  const cycle = (i: number, j: number) => onChange(rounds.map((r, a) => (a === i ? r.map((m, b) => (b === j ? next(m) : m)) : r)));
  const removeRow = (i: number) => onChange(rounds.filter((_, a) => a !== i));
  const unit = size === 4 ? "立" : "手";

  return (
    <div className="rounded-xl border border-line bg-paper/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <fieldset className="flex items-center gap-1 text-sm">
          <legend className="sr-only">每列射數</legend>
          {([4, 2] as const).map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-lg border border-line px-2.5 py-1 has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-wood"
            >
              <input type="radio" name="sheet-size" className="sr-only" checked={size === n} onChange={() => setSize(n)} />
              {n === 4 ? "一立 4 射" : "一手 2 射"}
            </label>
          ))}
        </fieldset>
        <p className="text-sm tabular-nums" aria-live="polite">
          {arrows} 射 {hits} 中 <span className="text-muted">（{fmtPct(pct(hits, arrows))}）</span>
        </p>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
        <button
          type="button"
          onClick={() => append("o")}
          className="min-h-14 rounded-xl border border-vermilion/50 bg-vermilion/10 text-2xl font-semibold text-vermilion active:scale-[0.98] motion-reduce:active:scale-100"
        >
          ○ <span className="text-base">中</span>
        </button>
        <button
          type="button"
          onClick={() => append("x")}
          className="min-h-14 rounded-xl border border-line bg-surface text-2xl font-semibold text-muted active:scale-[0.98] motion-reduce:active:scale-100"
        >
          × <span className="text-base">未中</span>
        </button>
        <button type="button" onClick={undo} disabled={!arrows} className="min-h-14 rounded-xl border border-line bg-surface px-3 text-sm text-ink disabled:opacity-40">
          復原
        </button>
      </div>

      {rounds.length > 0 && (
        <ol className="mt-3 space-y-1.5">
          {rounds.map((r, i) => {
            const c = gridCounts([r]);
            return (
              <li key={i} className="flex items-center gap-2">
                <span className="w-10 shrink-0 text-sm text-muted">
                  第{i + 1}
                  {unit}
                </span>
                <div className="flex gap-1">
                  {r.map((m, j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => cycle(i, j)}
                      aria-label={`第${i + 1}${unit}第${j + 1}射：${markName(m)}，點一下切換`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-xl hover:bg-surface-2"
                    >
                      <MarkGlyph m={m} />
                    </button>
                  ))}
                </div>
                <span className="ml-auto hidden text-sm text-muted tabular-nums min-[400px]:inline">
                  {c.hits}/{c.arrows}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  aria-label={`刪除第${i + 1}${unit}`}
                  className="ml-auto flex h-10 w-8 min-[400px]:ml-0 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-vermilion"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
