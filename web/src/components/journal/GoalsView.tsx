"use client";

import { useMemo } from "react";
import { formatDay } from "@/lib/journal/date";
import { optLabel, GOAL_KIND_OPTS } from "@/lib/journal/options";
import { isSample } from "@/lib/journal/sample";
import { goalProgress, type GoalProgress } from "@/lib/journal/stats";
import type { Entry, GoalEntry } from "@/lib/journal/types";
import { btn, SampleBadge } from "./ui";

function countdown(days: number): string {
  if (days === 0) return "就是今天";
  return days > 0 ? `還有 ${days} 天` : `已過 ${-days} 天`;
}

export function GoalCard({
  g,
  progress,
  onEdit,
  onToggle,
  compact,
}: {
  g: GoalEntry;
  progress: GoalProgress;
  onEdit: (id: string) => void;
  onToggle: (g: GoalEntry) => void;
  compact?: boolean;
}) {
  const pctNum = progress.ratio == null ? null : Math.round(progress.ratio * 100);
  const titleId = `goal-${g.id}`;
  return (
    <article aria-labelledby={titleId} className={`rounded-2xl border bg-surface p-4 shadow-sm ${g.done ? "border-line opacity-75" : "border-wood/40"}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span lang="ja" className="text-wood">
              目標
            </span>
            <span>{optLabel(GOAL_KIND_OPTS, g.kind)}</span>
            {isSample(g) && <SampleBadge />}
          </p>
          <h3 id={titleId} className={`mt-0.5 text-lg font-semibold break-words ${g.done ? "line-through decoration-muted" : ""}`}>
            {g.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            {formatDay(g.date, true)}・<span className={!g.done && progress.daysLeft < 0 ? "text-vermilion" : "text-ink"}>{g.done ? "已達成" : countdown(progress.daysLeft)}</span>
          </p>
        </div>
        {!g.done && progress.daysLeft >= 0 && (
          <p className="shrink-0 text-right">
            <span className="block text-3xl leading-none font-bold tabular-nums text-wood">{progress.daysLeft}</span>
            <span className="text-xs text-muted">天</span>
          </p>
        )}
      </div>
      {pctNum != null && g.kind !== "custom" && g.kind !== "exam" && (
        <div className="mt-3">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pctNum}
            aria-label={`${g.title} 進度`}
            aria-valuetext={progress.label}
            className="h-2 rounded-full bg-surface-2"
          >
            <div className="h-2 rounded-full bg-wood" style={{ width: `${Math.max(2, pctNum)}%` }} />
          </div>
          <p className="mt-1 text-sm text-muted tabular-nums">{progress.label}</p>
        </div>
      )}
      {pctNum == null && progress.label && <p className="mt-2 text-sm text-muted">{progress.label}</p>}
      {!compact && g.notes && <p className="mt-2 text-[15px] leading-relaxed whitespace-pre-wrap">{g.notes}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={btn.ghost} onClick={() => onToggle(g)}>
          {g.done ? "標為未完成" : "✓ 標為已達成"}
        </button>
        <button type="button" className={btn.ghost} onClick={() => onEdit(g.id)} aria-label={`編輯目標「${g.title}」`}>
          編輯
        </button>
      </div>
    </article>
  );
}

export default function GoalsView({
  entries,
  today,
  onNew,
  onEdit,
  onToggle,
}: {
  entries: Entry[];
  today: string;
  onNew: () => void;
  onEdit: (id: string) => void;
  onToggle: (g: GoalEntry) => void;
}) {
  const goals = useMemo(() => entries.filter((e): e is GoalEntry => e.type === "goal"), [entries]);
  const open = goals.filter((g) => !g.done).sort((a, b) => (a.date < b.date ? -1 : 1));
  const done = goals.filter((g) => g.done).sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[15px] text-muted">設定一個看得見的目標：下次審查、累積射數、或想穩定的的中率。</p>
        <button type="button" className={btn.primary} onClick={onNew}>
          ＋ 新增目標
        </button>
      </div>
      {goals.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">
          還沒有目標。例如「下次審查：初段」並填入審查日期，就會在總覽頁倒數。
        </p>
      )}
      {open.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {open.map((g) => (
            <GoalCard key={g.id} g={g} progress={goalProgress(g, entries, today)} onEdit={onEdit} onToggle={onToggle} />
          ))}
        </div>
      )}
      {done.length > 0 && (
        <section aria-labelledby="goals-done">
          <h3 id="goals-done" className="mt-6 mb-2 text-base font-bold text-muted">
            已達成
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {done.map((g) => (
              <GoalCard key={g.id} g={g} progress={goalProgress(g, entries, today)} onEdit={onEdit} onToggle={onToggle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
