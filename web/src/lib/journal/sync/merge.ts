// Pure record-level sync logic shared by the local store and the sync engine.
// No browser APIs, no network: everything here is covered by selfcheck.ts.
//
// Local storage keeps one record per id, either a live `Entry` or a `Tombstone`
// (a deletion that still has to reach the cloud). Records may carry a private `_sync`
// marker "<userId>|<updatedAt>" meaning "this exact version is already in that user's
// cloud copy". Any local write replaces the whole record and so drops the marker: a record
// without a matching marker is, by definition, waiting to be pushed. `normalizeEntry` strips
// unknown fields, so neither markers nor tombstones ever reach the UI, exports or CSV.
//
// Conflicts are last-writer-wins on `updatedAt`. On an exact tie the cloud copy wins, except
// that a deletion beats a live copy — the same rule the database trigger applies, so every
// device converges on the same version.

import { isValidEntryId, normalizeEntry } from "../model";
import { SAMPLE_PREFIX } from "../sample";
import type { Entry } from "../types";

export interface Tombstone {
  id: string;
  deleted: true;
  /** When the entry was deleted (always later than the deleted version's updatedAt). */
  updatedAt: string;
  _sync?: string;
}

export type LiveRecord = Entry & { _sync?: string };
export type StoredRecord = LiveRecord | Tombstone;

/** A row of `journal_entries` as returned by the API (user_id omitted). */
export interface RemoteRow {
  id: string;
  type: string | null;
  date: string | null;
  data: unknown;
  created_at: string | null;
  updated_at: string;
  deleted: boolean;
  /** Server clock, set by trigger on every accepted write; used as the pull cursor. */
  server_updated_at: string;
}

/** What we upload; the server fills user_id (RLS-checked) and server_updated_at. */
export type PushRow = Omit<RemoteRow, "server_updated_at">;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Milliseconds since epoch for an ISO timestamp, NaN if invalid. Postgres returns microseconds
 * ("…:00.123456+00:00"); trim to milliseconds first so every JS engine parses it the same way.
 */
export function isoMs(v: unknown): number {
  if (typeof v !== "string" || v.length > 40) return NaN;
  return Date.parse(v.replace(/(\.\d{3})\d+/, "$1"));
}

/** Canonical "…Z" ISO string, or null when invalid. */
export function canonicalIso(v: unknown): string | null {
  const t = isoMs(v);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

export const isTombstone = (r: unknown): r is Tombstone => isObj(r) && r.deleted === true;

/** Samples (「載入範例資料」) are never uploaded nor accepted from the cloud. */
export const isSyncableId = (id: string) => isValidEntryId(id) && !id.startsWith(SAMPLE_PREFIX);

export function syncMark(uid: string, updatedAt: string): string {
  return `${uid}|${canonicalIso(updatedAt) ?? updatedAt}`;
}

export function isSynced(r: StoredRecord, uid: string): boolean {
  return r._sync === syncMark(uid, r.updatedAt);
}

/** True when this record should be uploaded to `uid`'s cloud copy. */
export function needsPush(r: StoredRecord, uid: string): boolean {
  if (!isSyncableId(r.id)) return false;
  if (!isTombstone(r) && r.sample) return false;
  return !isSynced(r, uid);
}

/** Read a raw backend value as a stored record (validated), or null if it is junk. */
export function asStoredRecord(raw: unknown, now?: string): StoredRecord | null {
  if (!isObj(raw)) return null;
  const sync = typeof raw._sync === "string" ? raw._sync : undefined;
  if (isTombstone(raw)) {
    const updatedAt = canonicalIso(raw.updatedAt);
    if (!isValidEntryId(raw.id) || !updatedAt) return null;
    return sync ? { id: raw.id, deleted: true, updatedAt, _sync: sync } : { id: raw.id, deleted: true, updatedAt };
  }
  const e = normalizeEntry(raw, now);
  if (!e) return null;
  return sync ? { ...e, _sync: sync } : e;
}

/** Strip the private marker: a plain Entry for the UI. */
export function toEntry(r: LiveRecord): Entry {
  const { _sync, ...e } = r;
  void _sync;
  return e as Entry;
}

/** A tombstone for `cur`, timestamped strictly after it so it wins last-writer-wins. */
export function tombstoneFor(cur: StoredRecord, nowIso: string): Tombstone {
  const now = isoMs(nowIso);
  const prev = isoMs(cur.updatedAt);
  const t = Number.isNaN(prev) || now > prev ? now : prev + 1;
  return { id: cur.id, deleted: true, updatedAt: new Date(t).toISOString() };
}

export function toPushRow(r: StoredRecord): PushRow {
  if (isTombstone(r)) return { id: r.id, type: null, date: null, data: {}, created_at: null, updated_at: r.updatedAt, deleted: true };
  const { id, type, date, createdAt, updatedAt, sample, _sync, ...data } = r;
  void sample;
  void _sync;
  return { id, type, date, data, created_at: createdAt, updated_at: updatedAt, deleted: false };
}

/** Validate a row from the cloud; null when it must be ignored (bad shape, sample id, unknown type…). */
export function fromRemoteRow(row: unknown): StoredRecord | null {
  if (!isObj(row) || typeof row.id !== "string" || !isSyncableId(row.id)) return null;
  const updatedAt = canonicalIso(row.updated_at);
  if (!updatedAt) return null;
  if (row.deleted === true) return { id: row.id, deleted: true, updatedAt };
  const data = isObj(row.data) ? row.data : {};
  const createdAt = canonicalIso(row.created_at) ?? updatedAt;
  const e = normalizeEntry({ ...data, id: row.id, type: row.type, date: row.date, createdAt, updatedAt }, updatedAt);
  if (!e) return null;
  delete e.sample;
  return e;
}

/** Result of reconciling one id: write `value`, delete the local record, or leave it alone. */
export type Resolution = { kind: "put"; value: StoredRecord } | { kind: "delete" } | { kind: "keep" };

/**
 * Apply a cloud version (`remote`, from `fromRemoteRow`) to the local record `local`.
 * Remote tombstones are not stored locally: a deletion that already reached the cloud only
 * needs to remove the local copy.
 */
export function resolveRemote(local: StoredRecord | undefined, remote: StoredRecord, uid: string): Resolution {
  const marked = (): Resolution => ({ kind: "put", value: { ...remote, _sync: syncMark(uid, remote.updatedAt) } });
  const remoteDead = isTombstone(remote);
  if (!local) return remoteDead ? { kind: "keep" } : marked();
  const l = isoMs(local.updatedAt);
  const r = isoMs(remote.updatedAt);
  const localDead = isTombstone(local);
  if (r > l || Number.isNaN(l)) return remoteDead ? { kind: "delete" } : marked();
  if (r < l) return { kind: "keep" }; // ours is newer; it is (or will be) pushed
  // Tie on updatedAt.
  if (localDead && !remoteDead) return { kind: "keep" }; // deletion wins; our push will be accepted
  if (remoteDead) return { kind: "delete" };
  if (isSynced(local, uid)) return { kind: "keep" }; // our own write echoed back
  return marked(); // cloud copy wins ties
}

/**
 * After the server accepted a push: if the local record is still the version we sent, mark it
 * synced (adopting the server's updated_at, which the trigger may have clamped) or, for a
 * tombstone, drop it — the deletion now lives in the cloud.
 */
export function ackPushed(cur: StoredRecord | undefined, pushedUpdatedAt: string, stored: StoredRecord, uid: string): Resolution {
  if (!cur || isoMs(cur.updatedAt) !== isoMs(pushedUpdatedAt) || isTombstone(cur) !== isTombstone(stored)) return { kind: "keep" };
  if (isTombstone(cur)) return { kind: "delete" };
  return { kind: "put", value: { ...cur, updatedAt: stored.updatedAt, _sync: syncMark(uid, stored.updatedAt) } };
}

/** The newer of two local copies of one id (migration between local backends). */
export function newerRecord(a: StoredRecord | undefined, b: StoredRecord): StoredRecord {
  if (!a) return b;
  const ta = isoMs(a.updatedAt);
  const tb = isoMs(b.updatedAt);
  if (tb > ta) return b;
  if (tb < ta) return a;
  return isTombstone(b) && !isTombstone(a) ? b : a;
}
