"use client";

// Lightweight inline-SVG charts (no chart library). Each chart has a text summary,
// a hover/keyboard readout, and a table fallback.

import { useCallback, useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";
import { addDays, formatDay, monthKey, shortDay } from "@/lib/journal/date";
import { fmtPct } from "@/lib/journal/model";
import { heatmap, type WeekPoint } from "@/lib/journal/stats";
import type { Entry } from "@/lib/journal/types";

function useWidth(initial = 288): [(el: HTMLElement | null) => (() => void) | undefined, number] {
  const [w, setW] = useState(initial);
  const ref = useCallback((el: HTMLElement | null) => {
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver((items) => {
      const cw = Math.round(items[0]?.contentRect.width ?? 0);
      if (cw > 0) setW(cw);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

// ---------- 的中率 trend ----------

export function HitRateChart({ points, caption }: { points: WeekPoint[]; caption: string }) {
  const [ref, width] = useWidth();
  const [active, setActive] = useState<number | null>(null);
  const H = 210;
  const m = { l: 50, r: 14, t: 14, b: 40 };
  const pw = Math.max(80, width - m.l - m.r);
  const ph = H - m.t - m.b;
  const n = points.length;
  const x = (i: number) => m.l + (n <= 1 ? pw / 2 : (i / (n - 1)) * pw);
  const y = (v: number) => m.t + ph - (v / 100) * ph;
  const every = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(pw / 52))));

  let path = "";
  let pen = false;
  points.forEach((p, i) => {
    if (p.rate == null) {
      pen = false;
      return;
    }
    path += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(p.rate).toFixed(1)}`;
    pen = true;
  });

  const withData = points.map((p, i) => ({ p, i })).filter((d) => d.p.rate != null);
  const last = withData[withData.length - 1];
  const avg = (() => {
    const a = points.reduce((s, p) => s + p.arrows, 0);
    const h = points.reduce((s, p) => s + p.hits, 0);
    return a ? (h / a) * 100 : null;
  })();
  const summary = withData.length
    ? `${caption}。${withData.length} 週有的前紀錄，整體平均 ${fmtPct(avg)}，最近一週 ${fmtPct(last.p.rate)}。`
    : `${caption}：這段期間還沒有的前紀錄。`;

  const pick = (ev: PointerEvent<SVGSVGElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const px = ev.clientX - rect.left;
    const i = Math.round(((px - m.l) / pw) * (n - 1));
    setActive(Math.min(n - 1, Math.max(0, i)));
  };
  const onKey = (ev: KeyboardEvent<SVGSVGElement>) => {
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight" && ev.key !== "Home" && ev.key !== "End") return;
    ev.preventDefault();
    setActive((cur) => {
      if (ev.key === "Home") return 0;
      if (ev.key === "End") return n - 1;
      const c = cur ?? n - 1;
      return Math.min(n - 1, Math.max(0, c + (ev.key === "ArrowRight" ? 1 : -1)));
    });
  };
  const ap = active != null ? points[active] : null;

  return (
    <figure>
      <div ref={ref} className="w-full">
        <p className="min-h-5 text-sm tabular-nums" aria-live="polite">
          {ap ? (
            <>
              {shortDay(ap.week)} 那週：{ap.arrows ? `${ap.arrows} 射 ${ap.hits} 中・${fmtPct(ap.rate)}` : "沒有的前紀錄"}
            </>
          ) : (
            <span className="text-muted">滑過或用方向鍵查看各週數值</span>
          )}
        </p>
        <svg
          width={width}
          height={H}
          viewBox={`0 0 ${width} ${H}`}
          role="img"
          aria-label={summary}
          tabIndex={0}
          onKeyDown={onKey}
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          className="block h-auto max-w-full touch-pan-y rounded-lg focus-visible:outline-2 focus-visible:outline-wood"
        >
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={m.l} x2={m.l + pw} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth={1} strokeDasharray={v === 0 ? undefined : "2 4"} />
              <text x={m.l - 6} y={y(v)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--muted)">
                {v}%
              </text>
            </g>
          ))}
          {points.map((p, i) =>
            i % every === (n - 1) % every ? (
              <text key={p.week} x={x(i)} y={m.t + ph + 16} textAnchor="middle" fontSize={11} fill="var(--muted)">
                {shortDay(p.week)}
              </text>
            ) : null,
          )}
          <text x={m.l + pw / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="var(--muted)">
            週（以週一日期標示）
          </text>
          <text x={9} y={m.t + ph / 2} textAnchor="middle" fontSize={11} fill="var(--muted)" transform={`rotate(-90 9 ${m.t + ph / 2})`}>
            的中率
          </text>
          {ap && <line x1={x(active!)} x2={x(active!)} y1={m.t} y2={m.t + ph} stroke="var(--muted)" strokeWidth={1} />}
          <path d={path} fill="none" stroke="var(--wood)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {withData.map(({ p, i }) => (
            <circle key={p.week} cx={x(i)} cy={y(p.rate!)} r={active === i ? 5.5 : 4} fill="var(--wood)" stroke="var(--surface)" strokeWidth={2} />
          ))}
          {last && active == null && (
            <text x={Math.min(x(last.i), m.l + pw - 2)} y={y(last.p.rate!) - 10} textAnchor="end" fontSize={12} fontWeight={600} fill="var(--ink)" stroke="var(--surface)" strokeWidth={3} paintOrder="stroke">
              {fmtPct(last.p.rate)}
            </text>
          )}
        </svg>
      </div>
      <figcaption className="sr-only">{summary}</figcaption>
      <details className="mt-2 text-sm">
        <summary className="text-wood underline">以表格檢視</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full text-left tabular-nums">
            <caption className="sr-only">{caption}</caption>
            <thead className="text-muted">
              <tr>
                <th scope="col" className="py-1 font-normal">
                  週（週一）
                </th>
                <th scope="col" className="py-1 text-right font-normal">
                  射數
                </th>
                <th scope="col" className="py-1 text-right font-normal">
                  的中
                </th>
                <th scope="col" className="py-1 text-right font-normal">
                  的中率
                </th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((p) => (
                <tr key={p.week} className="border-t border-line">
                  <th scope="row" className="py-1 font-normal">
                    {shortDay(p.week)}
                  </th>
                  <td className="py-1 text-right">{p.arrows}</td>
                  <td className="py-1 text-right">{p.hits}</td>
                  <td className="py-1 text-right">{fmtPct(p.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

// ---------- practice calendar heatmap ----------

const LEVELS = [0, 1, 12, 24, 40];
const levelOf = (arrows: number, sessions: number) => {
  if (!sessions) return 0;
  let l = 1;
  for (let i = 1; i < LEVELS.length; i++) if (arrows >= LEVELS[i]) l = i;
  return l;
};
const LEVEL_OPACITY = [0, 0.28, 0.5, 0.75, 1];
const ROW_LABELS = ["一", "", "三", "", "五", "", "日"];

export function PracticeHeatmap({ entries, today }: { entries: Entry[]; today: string }) {
  const [ref, width] = useWidth();
  const [active, setActive] = useState<string | null>(null);
  const cell = 12;
  const gap = 3;
  const left = 18;
  const top = 16;
  const weeks = Math.max(8, Math.min(26, Math.floor((width - left) / (cell + gap))));
  const cols = useMemo(() => heatmap(entries, today, weeks), [entries, today, weeks]);
  const flat = cols.flat();
  const practiced = flat.filter((d) => d.sessions > 0);
  const totalArrows = practiced.reduce((s, d) => s + d.arrows, 0);
  const summary = `最近 ${weeks} 週練習 ${practiced.length} 天，共 ${totalArrows} 射（含巻藁）。`;
  const H = top + 7 * (cell + gap);
  const W = left + weeks * (cell + gap);
  const act = active ? flat.find((d) => d.day === active) : null;

  return (
    <figure>
      <div ref={ref} className="w-full">
        <p className="min-h-5 text-sm tabular-nums" aria-live="polite">
          {act ? (
            <>
              {formatDay(act.day)}：{act.sessions ? `練習 ${act.sessions} 次・${act.arrows} 射` : "沒有練習"}
            </>
          ) : (
            <span className="text-muted">{summary}</span>
          )}
        </p>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} className="mt-1 block h-auto max-w-full" onPointerLeave={() => setActive(null)}>
          {ROW_LABELS.map((l, r) =>
            l ? (
              <text key={r} x={0} y={top + r * (cell + gap) + cell / 2} dy="0.35em" fontSize={10} fill="var(--muted)">
                {l}
              </text>
            ) : null,
          )}
          {cols.map((col, c) => {
            const first = col[0].day;
            const showMonth = c === 0 ? false : monthKey(first) !== monthKey(addDays(first, -7));
            return (
              <g key={first}>
                {showMonth && (
                  <text x={left + c * (cell + gap)} y={10} fontSize={10} fill="var(--muted)">
                    {Number(first.slice(5, 7))}月
                  </text>
                )}
                {col.map((d, r) => {
                  if (d.future) return null;
                  const lv = levelOf(d.arrows, d.sessions);
                  return (
                    <rect
                      key={d.day}
                      x={left + c * (cell + gap)}
                      y={top + r * (cell + gap)}
                      width={cell}
                      height={cell}
                      rx={2.5}
                      fill={lv ? "var(--wood)" : "var(--surface-2)"}
                      fillOpacity={lv ? LEVEL_OPACITY[lv] : 1}
                      stroke={d.day === today ? "var(--ink)" : active === d.day ? "var(--muted)" : "none"}
                      strokeWidth={1.5}
                      onPointerEnter={() => setActive(d.day)}
                      onPointerDown={() => setActive(d.day)}
                    >
                      <title>{`${formatDay(d.day)}：${d.sessions ? `${d.arrows} 射` : "沒有練習"}`}</title>
                    </rect>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <span>少</span>
        {LEVEL_OPACITY.map((o, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block h-3 w-3 rounded-[3px]"
            style={{ background: i ? "var(--wood)" : "var(--surface-2)", opacity: i ? o : 1 }}
          />
        ))}
        <span>多</span>
        <span className="ml-2">（框線＝今天）</span>
      </figcaption>
    </figure>
  );
}

// ---------- horizontal bars ----------

export interface BarRow {
  key: string;
  label: string;
  ja?: boolean;
  count: number;
}

export function BarList({ rows, total, unit = "次", empty }: { rows: BarRow[]; total: number; unit?: string; empty: string }) {
  if (!rows.length || !total) return <p className="text-sm text-muted">{empty}</p>;
  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const ratio = r.count / total;
        return (
          <li key={r.key}>
            <div className="flex items-baseline justify-between gap-2 text-[15px]">
              <span lang={r.ja ? "ja" : undefined} className="min-w-0 truncate">
                {r.label}
              </span>
              <span className="shrink-0 text-sm text-muted tabular-nums">
                {r.count}/{total} {unit}
              </span>
            </div>
            <div aria-hidden="true" className="mt-1 h-2 rounded-full bg-surface-2">
              <div className="h-2 rounded-full bg-wood" style={{ width: `${Math.max(4, ratio * 100)}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
