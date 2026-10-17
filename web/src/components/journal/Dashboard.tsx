"use client";

import { useMemo, useState, type ReactNode } from "react";
import { formatDay, formatMonth, monthKey, yearKey } from "@/lib/journal/date";
import { fmtPct } from "@/lib/journal/model";
import { faultOpt, optLabel, YADOKORO_OPTS } from "@/lib/journal/options";
import {
  equipmentSpend,
  faultCounts,
  goalProgress,
  monthTotals,
  persistentPain,
  practiceStreak,
  recentPractices,
  weeklyHitRate,
  yadokoroCounts,
  yearTotals,
} from "@/lib/journal/stats";
import type { Entry, EntryType, GoalEntry } from "@/lib/journal/types";
import { BarList, HitRateChart, PracticeHeatmap } from "./Charts";
import { money } from "./EntryCard";
import { GoalCard } from "./GoalsView";
import { btn, cardCls } from "./ui";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-3.5 shadow-sm sm:p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs leading-snug text-muted">{sub}</p>}
    </div>
  );
}

function Card({ id, title, action, children }: { id: string; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={cardCls}>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 id={id} className="text-lg font-bold">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

const N_OPTIONS = [5, 10, 20] as const;

export function EmptyGuide({ onNew, onLoadSample }: { onNew: (t: EntryType) => void; onLoadSample: () => void }) {
  return (
    <section aria-labelledby="empty-title" className={`${cardCls} text-[15px] leading-relaxed`}>
      <h3 id="empty-title" className="text-xl font-bold">
        開始你的<span lang="ja">稽古帳</span>
      </h3>
      <p className="mt-2 text-muted">練習完趁記憶還新鮮，花一分鐘記下來。累積幾週後，這一頁會長出你的的中率曲線、練習月曆和最常出現的射癖。</p>
      <ol className="mt-4 space-y-2.5">
        <li className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wood-soft text-sm font-bold text-wood">1</span>
          <span>
            <strong>練習紀錄</strong>：射數、的中，或用 ○× 記錄表逐射記；勾選今天出現的射癖、矢所與老師的指導。
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wood-soft text-sm font-bold text-wood">2</span>
          <span>
            <strong>課程筆記・審查・文化體驗</strong>：講習學到的重點可以連到射法八節；審查記下學科題目與講評。
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wood-soft text-sm font-bold text-wood">3</span>
          <span>
            <strong>裝備與目標</strong>：記下買的弓、矢、弽與規格，設定「下次審查：初段」之類的目標並倒數。
          </span>
        </li>
      </ol>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className={btn.primary} onClick={() => onNew("practice")}>
          ＋ 記錄第一次練習
        </button>
        <button type="button" className={btn.secondary} onClick={onLoadSample}>
          載入範例資料
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">範例資料是虛構的，標有「範例」，可在「資料」分頁一鍵移除，不會影響你自己的紀錄。</p>
    </section>
  );
}

export default function Dashboard({
  entries,
  today,
  onEdit,
  onToggleGoal,
  goTab,
}: {
  entries: Entry[];
  today: string;
  onEdit: (id: string) => void;
  onToggleGoal: (g: GoalEntry) => void;
  goTab: (t: "timeline" | "gear" | "goals" | "data") => void;
}) {
  const [n, setN] = useState<(typeof N_OPTIONS)[number]>(10);
  const month = useMemo(() => monthTotals(entries, today), [entries, today]);
  const year = useMemo(() => yearTotals(entries, today), [entries, today]);
  const streak = useMemo(() => practiceStreak(entries, today), [entries, today]);
  const weeks = useMemo(() => weeklyHitRate(entries, today, 12), [entries, today]);
  const recent = useMemo(() => recentPractices(entries, n, today), [entries, n, today]);
  const faults = useMemo(() => faultCounts(recent).slice(0, 6), [recent]);
  const yado = useMemo(() => yadokoroCounts(recent), [recent]);
  const pain = useMemo(() => persistentPain(entries, today), [entries, today]);
  const spend = useMemo(() => equipmentSpend(entries, today), [entries, today]);
  const goals = useMemo(
    () =>
      entries
        .filter((e): e is GoalEntry => e.type === "goal" && !e.done)
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .slice(0, 2),
    [entries],
  );
  const hasPractice = entries.some((e) => e.type === "practice");

  const streakSub =
    streak.daysSinceLast == null ? "還沒有練習紀錄" : streak.daysSinceLast === 0 ? "今天有練習" : `上次練習是 ${streak.daysSinceLast} 天前`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={`${formatMonth(monthKey(today))}射數`} value={(month.arrows + month.makiwara).toLocaleString()} sub={`的前 ${month.arrows}・巻藁 ${month.makiwara}・${month.days} 天`} />
        <Stat label="本月的中率" value={fmtPct(month.rate)} sub={month.arrows ? `${month.hits} / ${month.arrows} 中` : "本月還沒有的前紀錄"} />
        <Stat label={`${yearKey(today)} 年射數`} value={(year.arrows + year.makiwara).toLocaleString()} sub={`練習 ${year.days} 天・的中率 ${fmtPct(year.rate)}`} />
        <Stat label="連續練習" value={`${streak.weeks} 週`} sub={streakSub} />
      </div>

      {pain.length > 0 && (
        <aside role="note" className="rounded-2xl border border-vermilion/40 bg-vermilion/5 p-4 text-[15px] leading-relaxed">
          <p className="font-bold">身體提醒</p>
          <p className="mt-1">
            最近幾次練習都記錄到「{pain.join("、")}」不適。持續或反覆的疼痛請先休息，並諮詢醫師或物理治療師；也可以和指導老師討論是否調整弓力或射形。
          </p>
        </aside>
      )}

      {goals.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {goals.map((g) => (
            <GoalCard key={g.id} g={g} progress={goalProgress(g, entries, today)} onEdit={onEdit} onToggle={onToggleGoal} compact />
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card id="dash-trend" title="的中率趨勢">
          <HitRateChart points={weeks} caption="最近 12 週的前的中率（每週合計）" />
        </Card>
        <Card id="dash-cal" title="練習月曆">
          <PracticeHeatmap entries={entries} today={today} />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          id="dash-faults"
          title="常見射癖"
          action={
            <label className="flex items-center gap-1 text-sm text-muted">
              <span>最近</span>
              <select value={n} onChange={(e) => setN(Number(e.target.value) as (typeof N_OPTIONS)[number])} className="rounded-lg border border-field-border bg-surface px-1.5 py-1 text-sm text-ink">
                {N_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span>次</span>
            </label>
          }
        >
          <BarList
            rows={faults.map((f) => {
              const o = faultOpt(f.key);
              return { key: f.key, label: o?.label ?? f.key, ja: !!o?.ja && o.ja === o.label, count: f.count };
            })}
            total={recent.length}
            empty={hasPractice ? "最近的練習沒有勾選射癖。" : "記錄練習並勾選射癖後，這裡會列出最常出現的項目。"}
          />
          {yado.length > 0 && (
            <div className="mt-4 border-t border-line pt-3">
              <h4 className="mb-2 text-sm font-semibold text-muted">矢所傾向</h4>
              <BarList rows={yado.map((r) => ({ key: r.key, label: optLabel(YADOKORO_OPTS, r.key), count: r.count }))} total={recent.length} empty="" />
            </div>
          )}
        </Card>

        <Card
          id="dash-gear"
          title="裝備花費"
          action={
            <button type="button" className={btn.ghost} onClick={() => goTab("gear")}>
              裝備清單 ›
            </button>
          }
        >
          {spend.TWD.items + spend.JPY.items === 0 ? (
            <p className="text-sm text-muted">在「裝備」記下購買的弓具與價格，這裡會合計花費（新臺幣與日圓分開計算，不換匯）。</p>
          ) : (
            <dl className="grid grid-cols-2 gap-3">
              {(["TWD", "JPY"] as const)
                .filter((c) => spend[c].items > 0)
                .map((c) => (
                  <div key={c}>
                    <dt className="text-xs text-muted">{c === "TWD" ? "新臺幣" : "日圓"}（{spend[c].items} 件）</dt>
                    <dd className="mt-0.5 text-xl font-bold tabular-nums">{money(spend[c].all, c)}</dd>
                    <dd className="text-xs text-muted">今年 {money(spend[c].year, c)}</dd>
                  </div>
                ))}
            </dl>
          )}
        </Card>
      </div>

      {streak.lastDay && (
        <p className="text-center text-sm text-muted">
          最後一次練習：{formatDay(streak.lastDay, true)}・
          <button type="button" className="text-wood underline" onClick={() => goTab("timeline")}>
            查看全部紀錄
          </button>
        </p>
      )}
    </div>
  );
}
