// Storage abstraction for the journal.
//
// The UI only talks to `JournalStore`. Today there are three local backends
// (IndexedDB → localStorage → in-memory, picked by `openJournalStore()`); a later
// Supabase backend implements the same interface (list = select by user, put = upsert,
// delete = delete or tombstone) and can be swapped in without touching components.
// Nothing here ever makes a network request.

import { buildExport, compareEntries, normalizeEntry } from "./model";
import type { Entry, JournalExport } from "./types";

export type StoreKind = "indexeddb" | "localstorage" | "memory";

export interface ImportResult {
  added: number;
  updated: number;
  unchanged: number;
}

export interface JournalStore {
  readonly kind: StoreKind;
  /** True when data survives a reload. */
  readonly persistent: boolean;
  list(): Promise<Entry[]>;
  get(id: string): Promise<Entry | undefined>;
  put(entry: Entry): Promise<void>;
  delete(id: string): Promise<void>;
  /** Remove every entry. */
  clear(): Promise<void>;
  exportAll(): Promise<JournalExport>;
  /**
   * merge: add new ids, replace existing ids only when the imported copy is newer (updatedAt).
   * replace: swap the whole collection for `entries` atomically (old data survives a failure).
   */
  importAll(entries: Entry[], mode: "merge" | "replace"): Promise<ImportResult>;
}

/** Minimal key–value backend; `createStore` adds the journal semantics on top. */
interface Backend {
  kind: StoreKind;
  persistent: boolean;
  getAll(): Promise<unknown[]>;
  get(id: string): Promise<unknown>;
  putMany(entries: Entry[]): Promise<void>;
  delete(ids: string[]): Promise<void>;
  clear(): Promise<void>;
  /** Atomically swap the whole collection: either every entry is replaced or nothing changes. */
  replaceAll(entries: Entry[]): Promise<void>;
}

function createStore(b: Backend): JournalStore {
  const list = async () => {
    const now = new Date().toISOString();
    const out: Entry[] = [];
    for (const raw of await b.getAll()) {
      const e = normalizeEntry(raw, now);
      if (e) out.push(e);
    }
    return out.sort(compareEntries);
  };
  return {
    kind: b.kind,
    persistent: b.persistent,
    list,
    async get(id) {
      return normalizeEntry(await b.get(id)) ?? undefined;
    },
    put: (e) => b.putMany([e]),
    delete: (id) => b.delete([id]),
    clear: () => b.clear(),
    async exportAll() {
      return buildExport(await list());
    },
    async importAll(entries, mode) {
      if (mode === "replace") {
        await b.replaceAll(entries);
        return { added: entries.length, updated: 0, unchanged: 0 };
      }
      const existing = new Map((await list()).map((e) => [e.id, e]));
      const toPut: Entry[] = [];
      const res: ImportResult = { added: 0, updated: 0, unchanged: 0 };
      for (const e of entries) {
        const cur = existing.get(e.id);
        if (!cur) {
          res.added++;
          toPut.push(e);
        } else if (e.updatedAt > cur.updatedAt) {
          res.updated++;
          toPut.push(e);
        } else res.unchanged++;
      }
      await b.putMany(toPut);
      return res;
    },
  };
}

// ---------- in-memory ----------

export function memoryBackend(seed: unknown[] = []): Backend {
  const map = new Map<string, unknown>();
  for (const r of seed) {
    const id = (r as { id?: unknown })?.id;
    if (typeof id === "string") map.set(id, r);
  }
  const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
  return {
    kind: "memory",
    persistent: false,
    getAll: async () => [...map.values()].map(clone),
    get: async (id) => (map.has(id) ? clone(map.get(id)) : undefined),
    putMany: async (es) => {
      for (const e of es) map.set(e.id, clone(e));
    },
    delete: async (ids) => {
      for (const id of ids) map.delete(id);
    },
    clear: async () => map.clear(),
    replaceAll: async (es) => {
      const next = new Map<string, unknown>();
      for (const e of es) next.set(e.id, clone(e));
      map.clear();
      for (const [k, v] of next) map.set(k, v);
    },
  };
}

export function createMemoryStore(seed: unknown[] = []): JournalStore {
  return createStore(memoryBackend(seed));
}

// ---------- localStorage ----------

const LS_KEY = "kyudo-note:journal:v1";

function localStorageBackend(): Backend | null {
  try {
    const ls = window.localStorage;
    const probe = `${LS_KEY}:probe`;
    ls.setItem(probe, "1");
    ls.removeItem(probe);
    // Null-prototype maps so ids such as "__proto__" can never touch Object.prototype.
    const emptyMap = (): Record<string, unknown> => Object.create(null) as Record<string, unknown>;
    const read = (): Record<string, unknown> => {
      try {
        const v = JSON.parse(ls.getItem(LS_KEY) ?? "{}") as unknown;
        return typeof v === "object" && v && !Array.isArray(v) ? Object.assign(emptyMap(), v) : emptyMap();
      } catch {
        return emptyMap();
      }
    };
    const write = (m: Record<string, unknown>) => ls.setItem(LS_KEY, JSON.stringify(m));
    return {
      kind: "localstorage",
      persistent: true,
      getAll: async () => Object.values(read()),
      get: async (id) => read()[id],
      putMany: async (es) => {
        const m = read();
        for (const e of es) m[e.id] = e;
        write(m);
      },
      delete: async (ids) => {
        const m = read();
        for (const id of ids) delete m[id];
        write(m);
      },
      clear: async () => ls.removeItem(LS_KEY),
      replaceAll: async (es) => {
        // Build the new map and write it in one setItem: a quota error leaves the old data intact.
        const m = emptyMap();
        for (const e of es) m[e.id] = e;
        write(m);
      },
    };
  } catch {
    return null;
  }
}

/**
 * If an earlier session had to fall back to localStorage (e.g. IndexedDB was slow or blocked),
 * fold those entries into IndexedDB so data is never split between two backends.
 */
async function migrateLocalStorageInto(target: Backend): Promise<void> {
  try {
    const ls = localStorageBackend();
    if (!ls) return;
    const raw = await ls.getAll();
    if (!raw.length) return;
    const store = createStore(target);
    const now = new Date().toISOString();
    const entries = raw.map((r) => normalizeEntry(r, now)).filter((e): e is Entry => e !== null);
    await store.importAll(entries, "merge");
    await ls.clear();
  } catch {
    /* keep localStorage copy; try again next time */
  }
}

// ---------- IndexedDB ----------

const DB_NAME = "kyudo-note-journal";
const DB_VERSION = 1;
const STORE = "entries";

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("transaction aborted"));
  });
}

function openDb(timeoutMs = 10_000): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      settled = true;
      reject(new Error("IndexedDB open timed out"));
    }, timeoutMs);
    try {
      const r = indexedDB.open(DB_NAME, DB_VERSION);
      r.onupgradeneeded = () => {
        const db = r.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const s = db.createObjectStore(STORE, { keyPath: "id" });
          s.createIndex("date", "date");
          s.createIndex("type", "type");
        }
      };
      r.onsuccess = () => {
        clearTimeout(timer);
        if (settled) r.result.close();
        else resolve(r.result);
      };
      r.onerror = () => {
        clearTimeout(timer);
        if (!settled) reject(r.error);
      };
      r.onblocked = () => {
        /* another tab holds an old version; onsuccess follows once it closes */
      };
    } catch (err) {
      clearTimeout(timer);
      reject(err);
    }
  });
}

async function indexedDbBackend(): Promise<Backend | null> {
  try {
    if (typeof indexedDB === "undefined") return null;
    const db = await openDb();
    // Probe a read so broken implementations fail here rather than later.
    await req(db.transaction(STORE, "readonly").objectStore(STORE).count());
    const run = async (mode: IDBTransactionMode, fn: (s: IDBObjectStore) => void) => {
      const tx = db.transaction(STORE, mode);
      fn(tx.objectStore(STORE));
      await done(tx);
    };
    return {
      kind: "indexeddb",
      persistent: true,
      getAll: () => req(db.transaction(STORE, "readonly").objectStore(STORE).getAll()),
      get: (id) => req(db.transaction(STORE, "readonly").objectStore(STORE).get(id)),
      putMany: (es) => run("readwrite", (s) => es.forEach((e) => s.put(e))),
      delete: (ids) => run("readwrite", (s) => ids.forEach((id) => s.delete(id))),
      clear: () => run("readwrite", (s) => s.clear()),
      // One readwrite transaction: if any put fails the clear is rolled back too.
      replaceAll: (es) =>
        run("readwrite", (s) => {
          s.clear();
          es.forEach((e) => s.put(e));
        }),
    };
  } catch {
    return null;
  }
}

/**
 * Open the best available local store. Never throws: falls back to memory
 * (data lost on reload) when the browser blocks storage, e.g. some private modes.
 */
export async function openJournalStore(): Promise<JournalStore> {
  if (typeof window === "undefined") return createMemoryStore();
  const idb = await indexedDbBackend();
  if (idb) {
    await migrateLocalStorageInto(idb);
    return createStore(idb);
  }
  return createStore(localStorageBackend() ?? memoryBackend());
}

// ---------- small per-device preferences & drafts (localStorage, best effort) ----------

const memPrefs = new Map<string, string>();

export function readPref(key: string): string | null {
  try {
    return window.localStorage.getItem(`kyudo-note:${key}`);
  } catch {
    return memPrefs.get(key) ?? null;
  }
}

export function writePref(key: string, value: string | null): void {
  try {
    if (value == null) window.localStorage.removeItem(`kyudo-note:${key}`);
    else window.localStorage.setItem(`kyudo-note:${key}`, value);
  } catch {
    if (value == null) memPrefs.delete(key);
    else memPrefs.set(key, value);
  }
}

export interface Draft {
  savedAt: string;
  entry: Entry;
}

const draftKey = (key: string) => `journal:draft:${key}`;

export function readDraft(key: string): Draft | null {
  const raw = readPref(draftKey(key));
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as { savedAt?: unknown; entry?: unknown };
    const entry = normalizeEntry(d.entry);
    if (!entry || typeof d.savedAt !== "string") return null;
    return { savedAt: d.savedAt, entry };
  } catch {
    return null;
  }
}

export function writeDraft(key: string, entry: Entry | null): void {
  writePref(draftKey(key), entry ? JSON.stringify({ savedAt: new Date().toISOString(), entry }) : null);
}

/** Remove every editor draft (after "clear all" or a replace-import) so deleted data cannot come back. */
export function clearDrafts(): void {
  const prefix = `kyudo-note:${draftKey("")}`;
  try {
    const ls = window.localStorage;
    const keys: string[] = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (k?.startsWith(prefix)) keys.push(k);
    }
    for (const k of keys) ls.removeItem(k);
  } catch {
    /* storage blocked: only the in-memory fallback holds drafts */
  }
  for (const k of [...memPrefs.keys()]) if (k.startsWith(draftKey(""))) memPrefs.delete(k);
}

/** Ask the browser not to evict our storage under pressure (best effort). */
export async function requestPersistence(): Promise<boolean | null> {
  try {
    if (!navigator.storage?.persist) return null;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

export async function isPersisted(): Promise<boolean | null> {
  try {
    return navigator.storage?.persisted ? await navigator.storage.persisted() : null;
  } catch {
    return null;
  }
}
