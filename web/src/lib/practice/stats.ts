// Streak and best scores for 互動練習, kept in localStorage only.

import type { PracticeMode } from "./types";
import { dayKey, readJSON, useStored, writeJSON } from "./storage";

export interface ModeBest {
  correct: number;
  total: number;
}

export interface PracticeStats {
  /** consecutive days with at least one finished session, ending on lastDay */
  streak: number;
  bestStreak: number;
  lastDay: string | null;
  sessions: number;
  best: Partial<Record<PracticeMode, ModeBest>>;
}

const KEY = "stats";
const MODES: PracticeMode[] = ["order", "which", "cards", "myths", "scenario", "written"];

export const EMPTY_STATS: PracticeStats = { streak: 0, bestStreak: 0, lastDay: null, sessions: 0, best: {} };

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);

export function parseStats(v: unknown): PracticeStats {
  if (!v || typeof v !== "object") return EMPTY_STATS;
  const o = v as Record<string, unknown>;
  const best: PracticeStats["best"] = {};
  if (o.best && typeof o.best === "object") {
    const b = o.best as Record<string, unknown>;
    for (const m of MODES) {
      const e = b[m] as Record<string, unknown> | undefined;
      if (e && typeof e === "object" && num(e.total) > 0) best[m] = { correct: Math.min(num(e.correct), num(e.total)), total: num(e.total) };
    }
  }
  return {
    streak: num(o.streak),
    bestStreak: num(o.bestStreak),
    lastDay: typeof o.lastDay === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.lastDay) ? o.lastDay : null,
    sessions: num(o.sessions),
    best,
  };
}

function yesterdayKey(today: Date): string {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

/** Streak still alive today (practised today or yesterday), else 0. */
export function liveStreak(s: PracticeStats, today: string): number {
  if (!s.lastDay || !today) return 0;
  const [y, m, d] = today.split("-").map(Number);
  const yesterday = yesterdayKey(new Date(y, m - 1, d));
  return s.lastDay === today || s.lastDay === yesterday ? s.streak : 0;
}

const ratio = (b: ModeBest) => (b.total ? b.correct / b.total : 0);

export interface SessionResult {
  stats: PracticeStats;
  newBest: boolean;
  previousBest?: ModeBest;
}

/** Record a finished session. total = 0 records the streak only (no score). */
export function recordSession(mode: PracticeMode, correct: number, total: number): SessionResult {
  const s = readJSON(KEY, parseStats);
  const now = new Date();
  const today = dayKey(now);
  let streak = s.streak;
  if (s.lastDay !== today) streak = s.lastDay === yesterdayKey(now) ? s.streak + 1 : 1;
  const prev = s.best[mode];
  const cur = { correct, total };
  const newBest = total > 0 && (!prev || ratio(cur) > ratio(prev) || (ratio(cur) === ratio(prev) && total > prev.total));
  const next: PracticeStats = {
    streak,
    bestStreak: Math.max(s.bestStreak, streak),
    lastDay: today,
    sessions: s.sessions + 1,
    best: newBest ? { ...s.best, [mode]: cur } : s.best,
  };
  writeJSON(KEY, next);
  return { stats: next, newBest: newBest && !!prev, previousBest: prev };
}

export function usePracticeStats(): PracticeStats {
  return useStored(KEY, parseStats, EMPTY_STATS);
}
