// Storage abstraction for the journal.
//
// The UI only talks to `JournalStore`. There are three local backends (IndexedDB →
// localStorage → in-memory, picked by `openJournalStore()`). The local store is always the
// source the UI reads; optional cloud sync (./sync/) reconciles it with Supabase through the
// record-level methods at the bottom of the interface. Nothing here makes a network request.
//
// While this device is linked to a cloud account (`trackDeletes()` is true), deleting an
// entry leaves a tombstone record under the same id so the deletion can reach the cloud
// later (e.g. after being offline). Tombstones are invisible to list/get/export.

import { buildExport, compareEntries, normalizeEntry } from "./model";
import {
  asStoredRecord,
  isSyncableId,
  isTombstone,
  newerRecord,
  tombstoneFor,
  type Resolution,
  type StoredRecord,
} from "./sync/merge";
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

  // ---- record level, for the sync engine only ----
  /** Every stored record, including tombstones and private sync markers. */
  records(): Promise<StoredRecord[]>;
  /** Atomic read-modify-write per id; returns how many records changed. */
  updateRecords(ids: string[], fn: (id: string, cur: StoredRecord | undefined) => Resolution): Promise<number>;
  /** Hard-delete everything (no tombstones): this device forgets the journal, the cloud is untouched. */
  wipe(): Promise<void>;
}

export interface StoreOptions {
  /** Record tombstones for deletions (true while this device is linked to a cloud account). */
  trackDeletes?: () => boolean;
}

type RawRecord = { id: string };

/** Minimal key–value backend; `createStore` adds the journal semantics on top. */
interface Backend {
  kind: StoreKind;
  persistent: boolean;
  getAll(): Promise<unknown[]>;
  get(id: string): Promise<unknown>;
  putMany(records: RawRecord[]): Promise<void>;
  delete(ids: string[]): Promise<void>;
  clear(): Promise<void>;
  /** Atomically swap the whole collection: either every record is replaced or nothing changes. */
  replaceAll(records: RawRecord[]): Promise<void>;
  /**
   * Atomic read-modify-write: `fn` sees the current raw value of each id and returns the new
   * value, `null` to delete, or `undefined` to leave it. Resolves to the number of changes.
   */
  update(ids: string[], fn: (id: string, raw: unknown) => unknown): Promise<number>;
}

const laterIso = (a: string, b: string) => (Date.parse(a) >= Date.parse(b) ? a : b);

function createStore(b: Backend, opts: StoreOptions = {}): JournalStore {
  const track = () => {
    try {
      return opts.trackDeletes?.() === true;
    } catch {
      return false;
    }
  };
  const records = async () => {
    const now = new Date().toISOString();
    const out: StoredRecord[] = [];
    for (const raw of await b.getAll()) {
      const r = asStoredRecord(raw, now);
      if (r) out.push(r);
    }
    return out;
  };
  const list = async () => {
    const now = new Date().toISOString();
    const out: Entry[] = [];
    for (const raw of await b.getAll()) {
      if (isTombstone(raw)) continue;
      const e = normalizeEntry(raw, now);
      if (e) out.push(e);
    }
    return out.sort(compareEntries);
  };
  /** Live entries that must leave a tombstone when removed while linked. */
  const needsTombstone = (r: StoredRecord) => !isTombstone(r) && !r.sample && isSyncableId(r.id);
  return {
    kind: b.kind,
    persistent: b.persistent,
    list,
    async get(id) {
      const raw = await b.get(id);
      return isTombstone(raw) ? undefined : (normalizeEntry(raw) ?? undefined);
    },
    put: (e) => b.putMany([e]),
    async delete(id) {
      if (!track()) return b.delete([id]);
      const now = new Date().toISOString();
      await b.update([id], (_id, raw) => {
        if (raw === undefined) return undefined;
        const cur = asStoredRecord(raw, now);
        if (!cur) return null;
        if (isTombstone(cur)) return undefined;
        return needsTombstone(cur) ? tombstoneFor(cur, now) : null;
      });
    },
    async clear() {
      if (!track()) return b.clear();
      const now = new Date().toISOString();
      const next: StoredRecord[] = [];
      for (const r of await records()) {
        if (isTombstone(r)) next.push(r);
        else if (needsTombstone(r)) next.push(tombstoneFor(r, now));
      }
      await b.replaceAll(next);
    },
    async exportAll() {
      return buildExport(await list());
    },
    async importAll(entries, mode) {
      if (mode === "replace") {
        if (!track()) {
          await b.replaceAll(entries);
          return { added: entries.length, updated: 0, unchanged: 0 };
        }
        // Linked to the cloud: the file becomes the truth everywhere. Bump timestamps so the
        // imported versions win, and leave tombstones for entries the file does not contain.
        const now = new Date().toISOString();
        const incoming = entries.map((e) => (e.sample ? e : { ...e, updatedAt: laterIso(e.updatedAt, now) }));
        const ids = new Set(incoming.map((e) => e.id));
        const next: StoredRecord[] = [...incoming];
        for (const r of await records()) {
          if (ids.has(r.id)) continue;
          if (isTombstone(r)) next.push(r);
          else if (needsTombstone(r)) next.push(tombstoneFor(r, now));
        }
        await b.replaceAll(next);
        return { added: entries.length, updated: 0, unchanged: 0 };
      }
      const existing = new Map((await records()).map((r) => [r.id, r]));
      const toPut: Entry[] = [];
      const res: ImportResult = { added: 0, updated: 0, unchanged: 0 };
      for (const e of entries) {
        const cur = existing.get(e.id);
        const newer = cur ? Date.parse(e.updatedAt) > Date.parse(cur.updatedAt) : true;
        if (!cur) {
          res.added++;
          toPut.push(e);
        } else if (!newer) res.unchanged++;
        else {
          if (isTombstone(cur)) res.added++;
          else res.updated++;
          toPut.push(e);
        }
      }
      await b.putMany(toPut);
      return res;
    },
    records,
    updateRecords(ids, fn) {
      const now = new Date().toISOString();
      return b.update(ids, (id, raw) => {
        const cur = asStoredRecord(raw, now) ?? undefined;
        const r = fn(id, cur);
        return r.kind === "put" ? r.value : r.kind === "delete" ? (raw === undefined ? undefined : null) : undefined;
      });
    },
    wipe: () => b.clear(),
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
    update: async (ids, fn) => {
      let n = 0;
      for (const id of ids) {
        const r = fn(id, map.has(id) ? clone(map.get(id)) : undefined);
        if (r === undefined) continue;
        if (r === null) map.delete(id);
        else map.set(id, clone(r));
        n++;
      }
      return n;
    },
  };
}

export function createMemoryStore(seed: unknown[] = [], opts: StoreOptions = {}): JournalStore {
  return createStore(memoryBackend(seed), opts);
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
      update: async (ids, fn) => {
        const m = read();
        let n = 0;
        for (const id of ids) {
          const r = fn(id, m[id]);
          if (r === undefined) continue;
          if (r === null) delete m[id];
          else m[id] = r;
          n++;
        }
        if (n) write(m);
        return n;
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
    const now = new Date().toISOString();
    // Raw records (tombstones and sync markers included); the newer copy of each id wins.
    const incoming = new Map<string, StoredRecord>();
    for (const r of raw) {
      const rec = asStoredRecord(r, now);
      if (rec) incoming.set(rec.id, rec);
    }
    await target.update([...incoming.keys()], (id, cur) => {
      const local = asStoredRecord(cur, now) ?? undefined;
      const inc = incoming.get(id)!;
      return newerRecord(local, inc) === local ? undefined : inc;
    });
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
      // get → decide → put/delete inside one transaction, so a concurrent write cannot interleave.
      update: async (ids, fn) => {
        let n = 0;
        await run("readwrite", (s) => {
          for (const id of ids) {
            const g = s.get(id);
            g.onsuccess = () => {
              const r = fn(id, g.result);
              if (r === undefined) return;
              if (r === null) s.delete(id);
              else s.put(r);
              n++;
            };
          }
        });
        return n;
      },
    };
  } catch {
    return null;
  }
}

/**
 * Open the best available local store. Never throws: falls back to memory
 * (data lost on reload) when the browser blocks storage, e.g. some private modes.
 */
export async function openJournalStore(opts: StoreOptions = {}): Promise<JournalStore> {
  if (typeof window === "undefined") return createMemoryStore([], opts);
  const idb = await indexedDbBackend();
  if (idb) {
    await migrateLocalStorageInto(idb);
    return createStore(idb, opts);
  }
  return createStore(localStorageBackend() ?? memoryBackend(), opts);
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
