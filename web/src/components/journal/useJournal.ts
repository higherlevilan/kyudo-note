"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { todayISO } from "@/lib/journal/date";
import { compareEntries } from "@/lib/journal/model";
import { isSample, sampleEntries } from "@/lib/journal/sample";
import { clearDrafts, createMemoryStore, openJournalStore, writeDraft, type ImportResult, type JournalStore, type StoreKind } from "@/lib/journal/store";
import { isLinked } from "@/lib/journal/sync/state";
import type { Entry, EntryType } from "@/lib/journal/types";

export interface JournalState {
  ready: boolean;
  entries: Entry[];
  today: string;
  storeKind: StoreKind | null;
  persistent: boolean;
  /** Last storage error, shown to the user. */
  error: string | null;
  save(e: Entry): Promise<boolean>;
  remove(id: string): Promise<Entry | null>;
  restore(e: Entry): Promise<void>;
  importEntries(es: Entry[], mode: "merge" | "replace"): Promise<ImportResult | null>;
  clearAll(): Promise<void>;
  loadSample(): Promise<number>;
  removeSample(): Promise<number>;
  exportAll(): Promise<Entry[]>;
  /** Increments on every local write (the sync hook debounces an upload on it). */
  localRev: number;
  /** The underlying store (sync engine only). */
  getStore(): JournalStore | null;
  /** Re-read the store after someone else (the sync engine) changed it, and tell other tabs. */
  refresh(): Promise<void>;
}

const storeOpts = { trackDeletes: isLinked };

/** BroadcastChannel other pages post "changed" on after writing to the store (e.g. 射形分析). */
export const CHANNEL = "kyudo-note-journal";

/** Owns the store and the in-memory entry list. All writes go through here. */
export function useJournal(): JournalState {
  const storeRef = useRef<JournalStore | null>(null);
  const chanRef = useRef<BroadcastChannel | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [storeKind, setStoreKind] = useState<StoreKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localRev, setLocalRev] = useState(0);
  const bump = () => setLocalRev((n) => n + 1);

  const reload = useCallback(async () => {
    const s = storeRef.current;
    if (!s) return;
    try {
      setEntries(await s.list());
    } catch {
      setError("讀取紀錄時發生錯誤。");
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      let s: JournalStore;
      try {
        s = await openJournalStore(storeOpts);
      } catch {
        s = createMemoryStore([], storeOpts);
      }
      let list: Entry[] = [];
      let loadError: string | null = null;
      try {
        list = await s.list();
      } catch {
        s = createMemoryStore([], storeOpts);
        loadError = "讀取既有紀錄失敗，目前只暫存在這個分頁。";
      }
      if (!alive) return;
      if (loadError) setError(loadError);
      storeRef.current = s;
      setStoreKind(s.kind);
      setEntries(list);
      setToday(todayISO());
      setReady(true);
    })();

    let chan: BroadcastChannel | null = null;
    try {
      chan = new BroadcastChannel(CHANNEL);
      chan.onmessage = () => void reload();
      chanRef.current = chan;
    } catch {
      /* not supported */
    }
    // Pick up a new calendar day when the tab comes back (e.g. left open overnight).
    const onVis = () => {
      if (document.visibilityState === "visible") setToday(todayISO());
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVis);
      chan?.close();
      chanRef.current = null;
    };
  }, [reload]);

  const notify = () => {
    try {
      chanRef.current?.postMessage("changed");
    } catch {
      /* ignore */
    }
  };

  const withStore = useCallback(async <T,>(fn: (s: JournalStore) => Promise<T>, msg: string): Promise<T | null> => {
    const s = storeRef.current;
    if (!s) return null;
    try {
      const r = await fn(s);
      setError(null);
      return r;
    } catch {
      setError(msg);
      return null;
    }
  }, []);

  const save = useCallback(
    async (e: Entry) => {
      const ok = await withStore((s) => s.put(e).then(() => true), "儲存失敗：瀏覽器的儲存空間可能已滿或被封鎖。請先匯出備份。");
      if (ok) {
        setEntries((cur) => [...cur.filter((x) => x.id !== e.id), e].sort(compareEntries));
        notify();
        bump();
      }
      return !!ok;
    },
    [withStore],
  );

  const remove = useCallback(
    async (id: string) => {
      const found = entries.find((e) => e.id === id) ?? null;
      const ok = await withStore((s) => s.delete(id).then(() => true), "刪除失敗。");
      if (!ok) return null;
      writeDraft(id, null); // an unsaved edit of a deleted entry must not linger
      setEntries((cur) => cur.filter((x) => x.id !== id));
      notify();
      bump();
      return found;
    },
    [entries, withStore],
  );

  const restore = useCallback(
    async (e: Entry) => {
      // A fresh timestamp makes the restored copy newer than the deletion it undoes, so the
      // undo also wins when the deletion has already been synced.
      await save({ ...e, updatedAt: new Date().toISOString() });
    },
    [save],
  );

  const importEntries = useCallback(
    async (es: Entry[], mode: "merge" | "replace") => {
      const r = await withStore((s) => s.importAll(es, mode), "匯入失敗：瀏覽器的儲存空間可能不足。");
      if (r && mode === "replace") clearDrafts();
      await reload();
      notify();
      bump();
      return r;
    },
    [withStore, reload],
  );

  const clearAll = useCallback(async () => {
    const ok = await withStore((s) => s.clear().then(() => true), "清除失敗。");
    if (ok) clearDrafts();
    await reload();
    notify();
    bump();
  }, [withStore, reload]);

  const loadSample = useCallback(async () => {
    const now = new Date().toISOString();
    const samples = sampleEntries(todayISO(), now);
    const r = await withStore((s) => s.importAll(samples, "merge"), "載入範例失敗。");
    await reload();
    notify();
    return r ? r.added + r.updated : 0;
  }, [withStore, reload]);

  const removeSample = useCallback(async () => {
    const ids = entries.filter(isSample).map((e) => e.id);
    await withStore(async (s) => {
      for (const id of ids) {
        await s.delete(id);
        writeDraft(id, null);
      }
    }, "移除範例失敗。");
    await reload();
    notify();
    return ids.length;
  }, [entries, withStore, reload]);

  const exportAll = useCallback(async () => (await withStore((s) => s.list(), "讀取資料失敗。")) ?? entries, [withStore, entries]);

  const getStore = useCallback(() => storeRef.current, []);
  const refresh = useCallback(async () => {
    await reload();
    notify();
  }, [reload]);

  return {
    ready,
    entries,
    today,
    storeKind,
    persistent: storeKind !== null && storeKind !== "memory",
    error,
    save,
    remove,
    restore,
    importEntries,
    clearAll,
    loadSample,
    removeSample,
    exportAll,
    localRev,
    getStore,
    refresh,
  };
}

// ---------- URL-driven view state (works with static export; no dynamic routes) ----------

export const TABS = ["overview", "timeline", "gear", "goals", "data"] as const;
export type Tab = (typeof TABS)[number];

export interface Route {
  tab: Tab;
  /** Editing an existing entry. */
  edit: string | null;
  /** Creating a new entry of this type. */
  create: EntryType | null;
}

const ROUTE_EVENT = "journal:route";

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(ROUTE_EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(ROUTE_EVENT, cb);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

const ENTRY_TYPE_SET = new Set<string>(["practice", "lesson", "exam", "purchase", "culture", "goal"]);

export function parseRoute(search: string): Route {
  const p = new URLSearchParams(search);
  const t = p.get("tab");
  const n = p.get("new");
  return {
    tab: (TABS as readonly string[]).includes(t ?? "") ? (t as Tab) : "overview",
    edit: p.get("id") || null,
    create: n && ENTRY_TYPE_SET.has(n) ? (n as EntryType) : null,
  };
}

export function routeSearch(r: Partial<Route>): string {
  const p = new URLSearchParams();
  if (r.tab && r.tab !== "overview") p.set("tab", r.tab);
  if (r.edit) p.set("id", r.edit);
  else if (r.create) p.set("new", r.create);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function useRoute(): [Route, (r: Partial<Route>, opts?: { replace?: boolean }) => void] {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const route = parseRoute(search);
  const navigate = useCallback((r: Partial<Route>, opts?: { replace?: boolean }) => {
    const url = `${window.location.pathname}${routeSearch(r)}`;
    try {
      if (opts?.replace) window.history.replaceState(null, "", url);
      else window.history.pushState({ journal: true }, "", url);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(ROUTE_EVENT));
  }, []);
  return [route, navigate];
}
