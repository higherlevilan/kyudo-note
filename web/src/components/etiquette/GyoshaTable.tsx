"use client";

import { useState } from "react";
import type { GyoshaRow } from "@/content/etiquette/sections";

/** 審查 5 人立的行射要領表；選一個位置後，該欄會被標示，並列出「你的信號」。 */
export default function GyoshaTable({ rows, positions }: { rows: GyoshaRow[]; positions: readonly string[] }) {
  const [pos, setPos] = useState<number | null>(null);

  const chip = (on: boolean) =>
    `min-h-9 rounded-full border px-3 py-1 text-sm ${on ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:bg-surface-2"}`;

  return (
    <div className="space-y-4">
      <div role="group" aria-label="選擇你的位置" className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm text-muted">我站在：</span>
        {positions.map((p, n) => (
          <button key={p} type="button" aria-pressed={pos === n} onClick={() => setPos(pos === n ? null : n)} className={chip(pos === n)}>
            {p}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {pos !== null && (
          <div className="rounded-xl border border-wood/40 bg-wood-soft/40 p-4">
            <p className="mb-2 font-bold">{positions[pos]}的信號</p>
            <ol className="space-y-1.5 text-[15px]">
              <li>
                <span className="text-muted">入場：</span>前一組 3 番的乙矢弦音時，整組入場、本座跪坐；前一組 5 番的弦音時一起揖；前一組最後的射手後退時，進到射位。
              </li>
              {rows.map((r) => (
                <li key={r.phase}>
                  <span className="text-muted">{r.phase}：</span>
                  {r.cells[pos]}
                </li>
              ))}
              <li>
                <span className="text-muted">退場：</span>射完後從 1 番開始依序退場。
              </li>
            </ol>
          </div>
        )}
      </div>

      <div>
        <div role="region" aria-label="審查 5 人立的行射要領表" tabIndex={0} className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="sr-only">審查 5 人立：各位置起身、取懸け與搭乙矢的信號</caption>
            <thead>
              <tr className="bg-surface-2">
                <th scope="col" className="px-3 py-2 text-left font-semibold">
                  時機
                </th>
                {positions.map((p, n) => (
                  <th key={p} scope="col" className={`px-3 py-2 text-left font-semibold ${pos === n ? "bg-wood-soft" : ""}`}>
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.phase} className="border-t border-line align-top">
                  <th scope="row" className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                    {r.phase}
                  </th>
                  {r.cells.map((c, n) => (
                    <td key={n} className={`px-3 py-2 leading-relaxed ${pos === n ? "bg-wood-soft/70 font-medium" : ""}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-1 text-xs text-muted sm:hidden">表格可左右滑動。</p>
      </div>
    </div>
  );
}
