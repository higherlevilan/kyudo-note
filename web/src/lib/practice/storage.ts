// Local-only persistence for 互動練習: localStorage when available, an in-memory map
// otherwise (private mode, blocked storage). Every access is wrapped in try/catch.
// Nothing here is ever sent anywhere.

import { useSyncExternalStore } from "react";

const PREFIX = "kyudo-practice:";
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function rawGet(key: string): string | null {
  try {
    const v = window.localStorage.getItem(PREFIX + key);
    if (v !== null) return v;
  } catch {
    /* storage blocked: fall through to memory */
  }
  return memory.get(key) ?? null;
}

function rawSet(key: string, value: string | null) {
  if (value === null) memory.delete(key);
  else memory.set(key, value);
  try {
    if (value === null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, value);
  } catch {
    /* quota / blocked: the memory copy keeps this session working */
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key.startsWith(PREFIX)) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function readJSON<T>(key: string, parse: (v: unknown) => T): T {
  const raw = rawGet(key);
  let v: unknown = null;
  if (raw !== null) {
    try {
      v = JSON.parse(raw);
    } catch {
      v = null;
    }
  }
  return parse(v);
}

export function writeJSON(key: string, value: unknown) {
  rawSet(key, value === undefined ? null : JSON.stringify(value));
  emit();
}

const cache = new Map<string, { raw: string | null; value: unknown }>();

/**
 * Subscribe a component to one stored value. `parse` must be a stable (module-level)
 * function; the parsed value is cached per raw string so snapshots stay referentially stable.
 * The server snapshot is `fallback`, so prerendered HTML never depends on storage.
 */
export function useStored<T>(key: string, parse: (v: unknown) => T, fallback: T): T {
  const getSnapshot = () => {
    const raw = rawGet(key);
    const hit = cache.get(key);
    if (hit && hit.raw === raw) return hit.value as T;
    const value = readJSON(key, parse);
    cache.set(key, { raw, value });
    return value;
  };
  return useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}

/* ───────────── dates ───────────── */

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Whole local days since the epoch, for the flashcard schedule. */
export function dayNumber(d = new Date()): number {
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60_000) / 86_400_000);
}

const noop = () => () => {};
/** Today's key, read on the client only (server snapshot is ""). */
export function useToday(): string {
  return useSyncExternalStore(noop, () => dayKey(), () => "");
}
