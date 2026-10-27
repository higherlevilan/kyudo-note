// 修煉路線 progress: seen 小節, 過關測驗 results, awarded badges and the last visited 小節,
// kept in this browser only.
// One small external store read through useSyncExternalStore. The server snapshot is always the
// empty progress, so prerendered HTML matches the first client render; the real numbers appear
// right after hydration. Every storage access is guarded: with storage blocked (private mode,
// previews) progress still works for the current page view, it just isn't remembered.

import { useCallback, useSyncExternalStore } from "react";
import { CHAPTER_BY_ID } from "@/content/course/registry";
import { badgeUnlocked, sectionKey } from "./status";
import type { ChapterId, CourseProgress, LastVisit, QuizResult } from "./types";

export * from "./status";

export const PROGRESS_KEY = "kyudo-course-v1";

const EMPTY: CourseProgress = Object.freeze({ v: 1, seen: {}, quiz: {}, awarded: {} }) as CourseProgress;

/** What happened, for toasts, the companion and other listeners. */
export type CourseEvent =
  | { type: "seen"; chapter: ChapterId; section: string }
  | { type: "quiz"; chapter: ChapterId; result: QuizResult }
  | { type: "badge"; chapter: ChapterId }
  | { type: "reset" };

let state: CourseProgress | null = null;
const listeners = new Set<() => void>();
const eventListeners = new Set<(e: CourseEvent) => void>();

function parse(raw: string | null): CourseProgress {
  if (!raw) return EMPTY;
  try {
    const v = JSON.parse(raw) as Partial<CourseProgress> | null;
    if (!v || typeof v !== "object" || v.v !== 1) return EMPTY;
    const obj = (x: unknown) => (x && typeof x === "object" && !Array.isArray(x) ? x : {});
    const l = v.last as Partial<LastVisit> | undefined;
    const last = l && typeof l.chapter === "string" && typeof l.section === "string" ? { chapter: l.chapter, section: l.section } : undefined;
    return { v: 1, seen: obj(v.seen), quiz: obj(v.quiz), awarded: obj(v.awarded), ...(last && { last }) } as CourseProgress;
  } catch {
    return EMPTY;
  }
}

function load(): CourseProgress {
  try {
    return parse(localStorage.getItem(PROGRESS_KEY));
  } catch {
    return EMPTY;
  }
}

function current(): CourseProgress {
  if (state === null) state = typeof window === "undefined" ? EMPTY : load();
  return state;
}

function commit(next: CourseProgress) {
  state = next;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep it in memory for this page view */
  }
  listeners.forEach((l) => l());
}

function emit(e: CourseEvent) {
  eventListeners.forEach((l) => {
    try {
      l(e);
    } catch (err) {
      console.error(err);
    }
  });
  // Also DOM events, so code outside React can react: "course:progress" with the event itself, and
  // the per-type events the mascot companion listens to (course:seen / course:quiz / course:badge).
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("course:progress", { detail: e }));
  if (e.type === "seen") window.dispatchEvent(new CustomEvent("course:seen", { detail: { chapter: e.chapter, section: e.section } }));
  else if (e.type === "quiz")
    window.dispatchEvent(new CustomEvent("course:quiz", { detail: { chapter: e.chapter, correct: e.result.correct, total: e.result.total } }));
  else if (e.type === "badge") window.dispatchEvent(new CustomEvent("course:badge", { detail: { chapter: e.chapter } }));
}

// Another tab changed progress: reload and re-render.
function onStorage(e: StorageEvent) {
  if (e.key !== null && e.key !== PROGRESS_KEY) return;
  state = load();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

const getServerSnapshot = () => EMPTY;

/** The whole progress object; empty during prerender and hydration. */
export function useCourseProgress(): CourseProgress {
  return useSyncExternalStore(subscribe, current, getServerSnapshot);
}

/** Current snapshot, outside React (event handlers, effects). */
export function getProgress(): CourseProgress {
  return current();
}

// The last visited 小節 as it was when a chapter page was entered, so 「從上次的地方繼續」 doesn't
// follow the reader around while they scroll. Forgotten when the page's hint unmounts.
const entry = new Map<ChapterId, LastVisit | null>();

function entryVisit(chapter: ChapterId): LastVisit | null {
  if (!entry.has(chapter)) {
    const l = current().last;
    entry.set(chapter, l && l.chapter === chapter ? l : null);
  }
  return entry.get(chapter) ?? null;
}

/** The stored last visit in `chapter` at the time this chapter page was entered (null on the server). */
export function useEntryVisit(chapter: ChapterId): LastVisit | null {
  const sub = useCallback(
    (cb: () => void) => {
      const off = subscribe(cb);
      return () => {
        off();
        entry.delete(chapter);
      };
    },
    [chapter],
  );
  return useSyncExternalStore(
    sub,
    () => entryVisit(chapter),
    () => null,
  );
}

/** Listen to progress events (seen / quiz / badge / reset). Returns an unsubscribe function. */
export function onCourseEvent(fn: (e: CourseEvent) => void): () => void {
  eventListeners.add(fn);
  return () => {
    eventListeners.delete(fn);
  };
}

/* ---------------- writes ---------------- */

// Award a badge when this change completes its chapter. Judged on the transition rather than on
// `awarded`, so a chapter whose old sub-60% result no longer counts still celebrates once it passes.
function award(prev: CourseProgress, next: CourseProgress, chapter: ChapterId): boolean {
  if (badgeUnlocked(prev, chapter) || !badgeUnlocked(next, chapter)) return false;
  next.awarded = { ...next.awarded, [chapter]: 1 };
  return true;
}

const hasSection = (chapter: ChapterId, section: string) => !!CHAPTER_BY_ID[chapter]?.sections.some((s) => s.id === section);
const sameVisit = (a: LastVisit | undefined, chapter: ChapterId, section: string) => a?.chapter === chapter && a.section === section;

export function markSeen(chapter: ChapterId, section: string) {
  const p = current();
  const key = sectionKey(chapter, section);
  if (p.seen[key] || !hasSection(chapter, section)) return;
  const next: CourseProgress = { ...p, seen: { ...p.seen, [key]: 1 }, last: { chapter, section } };
  const won = award(p, next, chapter);
  commit(next);
  emit({ type: "seen", chapter, section });
  if (won) emit({ type: "badge", chapter });
}

/** Remember the 小節 the reader is on (scrolled to the reading line). Silent: no event. */
export function markVisited(chapter: ChapterId, section: string) {
  const p = current();
  if (sameVisit(p.last, chapter, section) || !hasSection(chapter, section)) return;
  commit({ ...p, last: { chapter, section } });
}

/** Save a finished 過關測驗 attempt (keeps the best score in `best`). */
export function saveQuiz(chapter: ChapterId, correct: number, total: number) {
  const p = current();
  const prev = p.quiz[chapter];
  const result: QuizResult = { correct, total, at: new Date().toISOString(), best: Math.max(correct, prev?.best ?? prev?.correct ?? 0) };
  const next: CourseProgress = { ...p, quiz: { ...p.quiz, [chapter]: result } };
  const won = award(p, next, chapter);
  commit(next);
  emit({ type: "quiz", chapter, result });
  if (won) emit({ type: "badge", chapter });
}

/** Forget everything (seen sections, quiz results, badges, last visit). */
export function resetProgress() {
  commit({ v: 1, seen: {}, quiz: {}, awarded: {} });
  emit({ type: "reset" });
}
