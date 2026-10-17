// Dashboard computations. Pure functions over the entry list; `today` is a local YYYY-MM-DD.

import { addDays, dayNum, daysBetween, monthKey, weekStart, yearKey } from "./date";
import { pct, practiceTotals } from "./model";
import type { Currency, Entry, GoalEntry, PracticeEntry, PurchaseEntry } from "./types";

export const isPractice = (e: Entry): e is PracticeEntry => e.type === "practice";
export const isPurchase = (e: Entry): e is PurchaseEntry => e.type === "purchase";

export interface PeriodTotals {
  sessions: number;
  days: number;
  arrows: number;
  hits: number;
  makiwara: number;
  rate: number | null;
}

export function totalsFor(entries: Entry[], match: (day: string) => boolean): PeriodTotals {
  const t: PeriodTotals = { sessions: 0, days: 0, arrows: 0, hits: 0, makiwara: 0, rate: null };
  const days = new Set<string>();
  for (const e of entries) {
    if (!isPractice(e) || !match(e.date)) continue;
    const p = practiceTotals(e);
    t.sessions++;
    days.add(e.date);
    t.arrows += p.arrows;
    t.hits += p.hits;
    t.makiwara += p.makiwara;
  }
  t.days = days.size;
  t.rate = pct(t.hits, t.arrows);
  return t;
}

export const monthTotals = (entries: Entry[], today: string) => totalsFor(entries, (d) => monthKey(d) === monthKey(today));
export const yearTotals = (entries: Entry[], today: string) => totalsFor(entries, (d) => yearKey(d) === yearKey(today));

export interface WeekPoint {
  week: string;
  arrows: number;
  hits: number;
  rate: number | null;
}

/** 的中率 per Monday-start week, oldest first, ending with the current week. */
export function weeklyHitRate(entries: Entry[], today: string, weeks = 12): WeekPoint[] {
  const end = weekStart(today);
  const pts: WeekPoint[] = [];
  const idx = new Map<string, WeekPoint>();
  for (let i = weeks - 1; i >= 0; i--) {
    const w = addDays(end, -7 * i);
    const p = { week: w, arrows: 0, hits: 0, rate: null };
    pts.push(p);
    idx.set(w, p);
  }
  for (const e of entries) {
    if (!isPractice(e)) continue;
    const p = idx.get(weekStart(e.date));
    if (!p) continue;
    const t = practiceTotals(e);
    p.arrows += t.arrows;
    p.hits += t.hits;
  }
  for (const p of pts) p.rate = pct(p.hits, p.arrows);
  return pts;
}

export interface HeatDay {
  day: string;
  arrows: number;
  sessions: number;
  future: boolean;
}

/** `weeks` columns × 7 rows (Mon–Sun), oldest week first, ending with the current week. */
export function heatmap(entries: Entry[], today: string, weeks = 26): HeatDay[][] {
  const byDay = new Map<string, { arrows: number; sessions: number }>();
  for (const e of entries) {
    if (!isPractice(e)) continue;
    const t = practiceTotals(e);
    const cur = byDay.get(e.date) ?? { arrows: 0, sessions: 0 };
    cur.arrows += t.arrows + t.makiwara;
    cur.sessions++;
    byDay.set(e.date, cur);
  }
  const start = addDays(weekStart(today), -7 * (weeks - 1));
  const tn = dayNum(today);
  const cols: HeatDay[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: HeatDay[] = [];
    for (let d = 0; d < 7; d++) {
      const day = addDays(start, w * 7 + d);
      const v = byDay.get(day);
      col.push({ day, arrows: v?.arrows ?? 0, sessions: v?.sessions ?? 0, future: dayNum(day) > tn });
    }
    cols.push(col);
  }
  return cols;
}

export interface Streak {
  /** Consecutive weeks (ending this week, or last week if nothing yet this week) with at least one practice. */
  weeks: number;
  daysSinceLast: number | null;
  lastDay: string | null;
}

export function practiceStreak(entries: Entry[], today: string): Streak {
  const days = entries.filter(isPractice).map((e) => e.date).filter((d) => d <= today);
  if (!days.length) return { weeks: 0, daysSinceLast: null, lastDay: null };
  const weeksSet = new Set(days.map(weekStart));
  const lastDay = days.reduce((a, b) => (a > b ? a : b));
  let w = weekStart(today);
  if (!weeksSet.has(w)) w = addDays(w, -7);
  let n = 0;
  while (weeksSet.has(w)) {
    n++;
    w = addDays(w, -7);
  }
  return { weeks: n, daysSinceLast: daysBetween(lastDay, today), lastDay };
}

export interface CountRow {
  key: string;
  count: number;
}

/** Most recent N practice sessions (newest first). */
export function recentPractices(entries: Entry[], n: number, today?: string): PracticeEntry[] {
  return entries
    .filter(isPractice)
    .filter((e) => !today || e.date <= today)
    .sort((a, b) => (a.date === b.date ? (a.createdAt < b.createdAt ? 1 : -1) : a.date < b.date ? 1 : -1))
    .slice(0, n);
}

function countValues(lists: string[][]): CountRow[] {
  const m = new Map<string, number>();
  for (const l of lists) for (const k of new Set(l)) m.set(k, (m.get(k) ?? 0) + 1);
  return [...m.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

export const faultCounts = (sessions: PracticeEntry[]) => countValues(sessions.map((s) => s.faults));
export const yadokoroCounts = (sessions: PracticeEntry[]) => countValues(sessions.map((s) => s.yadokoro));

/** Pain areas reported in at least `min` of the last `of` sessions. */
export function persistentPain(entries: Entry[], today: string, min = 3, of = 5): string[] {
  return countValues(recentPractices(entries, of, today).map((s) => s.painAreas))
    .filter((r) => r.count >= min)
    .map((r) => r.key);
}

export type Spend = Record<Currency, { year: number; all: number; items: number }>;

export function equipmentSpend(entries: Entry[], today: string): Spend {
  const s: Spend = { TWD: { year: 0, all: 0, items: 0 }, JPY: { year: 0, all: 0, items: 0 } };
  for (const e of entries) {
    if (!isPurchase(e) || e.price == null) continue;
    const c = s[e.currency];
    c.all += e.price;
    c.items++;
    if (yearKey(e.date) === yearKey(today)) c.year += e.price;
  }
  return s;
}

export interface GoalProgress {
  /** 0–1, null when not measurable. */
  ratio: number | null;
  label: string;
  daysLeft: number;
}

export function goalProgress(g: GoalEntry, entries: Entry[], today: string): GoalProgress {
  const daysLeft = daysBetween(today, g.date);
  if (g.kind === "arrows" && g.target) {
    const t = totalsFor(entries, (d) => d >= g.since && d <= g.date);
    const n = t.arrows + t.makiwara;
    return { ratio: Math.min(1, n / g.target), label: `${n.toLocaleString()} / ${g.target.toLocaleString()} 射`, daysLeft };
  }
  if (g.kind === "hitrate" && g.target) {
    const recent = recentPractices(entries, 10, today);
    let a = 0;
    let h = 0;
    for (const s of recent) {
      const t = practiceTotals(s);
      a += t.arrows;
      h += t.hits;
    }
    const r = pct(h, a);
    return { ratio: r == null ? null : Math.min(1, r / g.target), label: r == null ? "尚無的前紀錄" : `最近 ${recent.length} 次 ${r.toFixed(0)}%（目標 ${g.target}%）`, daysLeft };
  }
  return { ratio: g.done ? 1 : null, label: g.done ? "已完成" : "", daysLeft };
}

/** Purchases as an equipment inventory, grouped in category order; retired items last. */
export function inventory(entries: Entry[]): PurchaseEntry[] {
  const order = { active: 0, spare: 1, repair: 2, retired: 3 } as const;
  return entries.filter(isPurchase).sort((a, b) => order[a.status] - order[b.status] || (a.date < b.date ? 1 : -1));
}
