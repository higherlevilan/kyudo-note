"use client";

// 矢所診斷：點選箭常落的方向（可複選），列出 §2-2 的常見原因與有出處支持的部分。
// 不是診斷工具；結果全部是一般說法，另外逐項標出官方、指導書或研究的支持。

import { useState } from "react";
import Kasumi from "@/components/home/Kasumi";
import { PointList, TagBadge } from "@/components/content/Blocks";
import { FAULT_TOC } from "@/content/shaguse/faults";
import type { Direction } from "@/content/shaguse/types";
import { OTHER_FACTORS, YADOKORO_ROWS } from "@/content/shaguse/yadokoro";

const ORDER: Direction[] = ["mae", "ushiro", "ue", "shita", "chiru"];

/** Where each button sits around the target. */
const POS: Record<Exclude<Direction, "chiru">, string> = {
  ue: "top-0 left-1/2 -translate-x-1/2",
  shita: "bottom-0 left-1/2 -translate-x-1/2",
  ushiro: "left-0 top-1/2 -translate-y-1/2",
  mae: "right-0 top-1/2 -translate-y-1/2",
};

/** Example arrow marks drawn on the target for the selected directions (target radius ≈ 26). */
const DOTS: Record<Direction, [number, number][]> = {
  mae: [
    [17, -4],
    [21, 3],
    [15, 9],
  ],
  ushiro: [
    [-17, -4],
    [-21, 3],
    [-15, 9],
  ],
  ue: [
    [-4, -18],
    [4, -21],
    [1, -14],
  ],
  shita: [
    [-4, 18],
    [4, 21],
    [0, 15],
  ],
  chiru: [
    [-15, -11],
    [13, 15],
    [18, -12],
    [-9, 18],
    [4, -4],
  ],
};

const faultLabel = (id: string) => FAULT_TOC.find((f) => f.id === id)?.label ?? id;

function DirButton({ dir, on, onToggle, className = "" }: { dir: Direction; on: boolean; onToggle: (d: Direction) => void; className?: string }) {
  const row = YADOKORO_ROWS.find((r) => r.dir === dir)!;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onToggle(dir)}
      className={`flex min-h-11 min-w-14 flex-col items-center justify-center rounded-xl border px-2 py-1 leading-tight shadow-sm transition-colors motion-reduce:transition-none ${
        on ? "border-wood bg-wood text-paper" : "border-line bg-surface text-ink hover:border-wood"
      } ${className}`}
    >
      <span className="text-base font-bold">
        {on && <span aria-hidden="true">✓ </span>}
        {row.label}
      </span>
      {dir === "mae" || dir === "ushiro" ? <span className={`text-[11px] ${on ? "text-paper" : "text-muted"}`}>{dir === "mae" ? "靶的右側" : "靶的左側"}</span> : null}
    </button>
  );
}

export default function YadokoroDiagnosis() {
  const [picked, setPicked] = useState<Direction[]>([]);
  const toggle = (d: Direction) => setPicked((p) => (p.includes(d) ? p.filter((x) => x !== d) : ORDER.filter((x) => x === d || p.includes(x))));
  const rows = YADOKORO_ROWS.filter((r) => picked.includes(r.dir));
  const causeCount = rows.reduce((n, r) => n + r.causes.length, 0);

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <p className="rounded-xl border border-vermilion/50 bg-vermilion/5 px-3 py-2 text-[15px] leading-relaxed">
        <strong className="text-vermilion">不是診斷，請讓指導者看實際的射。</strong>
        這個工具只是把「矢所偏某個方向時，常聽到的原因」整理出來，方便你和指導者討論。以右射者為準，左射者左右相反。
      </p>

      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:items-start">
        <div>
          <p id="yd-help" className="mb-2 text-sm text-muted">
            點選箭常落的方向（可複選）。圖是射手看靶的視角。
          </p>
          <div role="group" aria-labelledby="yd-help" className="mx-auto w-full max-w-[20rem]">
            <div className="relative aspect-square w-full">
              <div aria-hidden="true" className="absolute top-[24%] left-[24%] w-[52%]">
                <Kasumi className="block h-auto w-full" />
              </div>
              <svg aria-hidden="true" viewBox="-50 -50 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
                {ORDER.map((d) =>
                  DOTS[d].map(([x, y], i) => (
                    <circle
                      key={`${d}-${i}`}
                      cx={x}
                      cy={y}
                      r={2.2}
                      className={`fill-vermilion stroke-[#fbf8f2] transition-opacity duration-200 motion-reduce:transition-none ${picked.includes(d) ? "opacity-100" : "opacity-0"}`}
                      strokeWidth={0.8}
                    />
                  )),
                )}
              </svg>
              {(Object.keys(POS) as (keyof typeof POS)[]).map((d) => (
                <DirButton key={d} dir={d} on={picked.includes(d)} onToggle={toggle} className={`absolute ${POS[d]}`} />
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <DirButton dir="chiru" on={picked.includes("chiru")} onToggle={toggle} className="flex-1" />
              <button
                type="button"
                onClick={() => setPicked([])}
                disabled={picked.length === 0}
                className="min-h-11 rounded-xl border border-line px-4 text-sm text-muted hover:border-wood hover:text-wood disabled:opacity-40"
              >
                清除
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            「前＝靶的右側、後＝靶的左側」是社團間的一般說法，不是官方定義。紅點只是示意，不是實際落點。
          </p>
        </div>

        <div>
          <p role="status" aria-live="polite" className="text-sm font-semibold text-ink">
            {rows.length === 0
              ? "還沒有選擇方向。"
              : `已選：${rows.map((r) => r.label).join("、")}。下面列出 ${causeCount} 項常見原因（一般說法）與有出處支持的部分。`}
          </p>

          {rows.length === 0 ? (
            <p className="mt-2 text-[15px] leading-relaxed text-muted">點選左邊（手機在上方）的「前」「後」「上」「下」或「散亂」，這裡會列出常見原因，以及哪些有官方、指導書或研究支持。</p>
          ) : (
            <div className="mt-3 space-y-4">
              {rows.map((r) => (
                <section key={r.dir} aria-labelledby={`yd-${r.dir}`} className="rounded-xl border border-line bg-paper/40 p-3 sm:p-4">
                  <h3 id={`yd-${r.dir}`} className="text-lg font-semibold">
                    <span lang={r.ja ? "ja" : undefined}>{r.label}</span>
                    {r.ja && (
                      <span lang="ja" className="ml-1.5 text-sm font-normal text-muted">
                        {r.ja}
                      </span>
                    )}
                    <span className="ml-2 text-sm font-normal text-muted">{r.where}</span>
                  </h3>
                  <h4 className="mt-2 mb-1 text-sm font-bold text-muted">
                    <TagBadge tag="folk" />
                    常見原因
                  </h4>
                  <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed">
                    {r.causes.map((c) => (
                      <li key={c.text}>
                        {c.text}
                        {c.anchor && (
                          <a href={`#${c.anchor}`} className="ml-1.5 text-sm whitespace-nowrap text-wood underline">
                            看〈{faultLabel(c.anchor)}〉
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                  <h4 className="mt-3 mb-1 text-sm font-bold text-muted">有出處支持的部分</h4>
                  <div className="text-[15px]">
                    <PointList points={r.support} />
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    證據強度：{r.strengthNote}
                  </p>
                </section>
              ))}
              <div className="text-sm text-muted">
                <PointList points={OTHER_FACTORS} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
