// Two-way sync between the local store and the cloud, one pass at a time:
//
//   1. pull  — rows whose server_updated_at ≥ cursor − overlap, page by page (keyset), each
//              reconciled into the local store with last-writer-wins (resolveRemote).
//   2. push  — every local record without a matching sync marker (new, edited, imported or
//              deleted-while-linked; never samples), in batches. Accepted rows are marked
//              synced (tombstones are dropped); rows the server refused because it already
//              had a newer version are fetched back and applied locally.
//
// The cursor is the server's clock, not the device's, so a device with a wrong clock or one
// that was offline for weeks still has its changes seen by everyone. The overlap re-reads a
// short window to cover transactions that committed out of order; re-applying a row is a no-op.
// Nothing here ever deletes local data except by applying a newer cloud deletion.

import type { JournalStore } from "../store";
import { ackPushed, fromRemoteRow, needsPush, resolveRemote, toPushRow, isoMs, type RemoteRow, type StoredRecord } from "./merge";
import type { RemoteApi } from "./remote";

export const PULL_PAGE = 500;
export const PUSH_BATCH = 100;
export const CURSOR_OVERLAP_MS = 2 * 60 * 1000;

export interface SyncResult {
  cursor: string | null;
  pulled: number;
  pushed: number;
  /** Local records changed by cloud data (the UI should reload when > 0). */
  changed: number;
  /** Pushes the server refused because it held a newer version. */
  rejected: number;
}

function sinceFromCursor(cursor: string | null): string | null {
  if (!cursor) return null;
  const t = isoMs(cursor);
  return Number.isNaN(t) ? null : new Date(t - CURSOR_OVERLAP_MS).toISOString();
}

async function applyRows(store: JournalStore, rows: RemoteRow[], uid: string): Promise<number> {
  const byId = new Map<string, StoredRecord>();
  for (const row of rows) {
    const rec = fromRemoteRow(row);
    if (rec) byId.set(rec.id, rec);
  }
  if (!byId.size) return 0;
  return store.updateRecords([...byId.keys()], (id, cur) => resolveRemote(cur, byId.get(id)!, uid));
}

export async function countPending(store: JournalStore, uid: string): Promise<number> {
  return (await store.records()).filter((r) => needsPush(r, uid)).length;
}

export async function syncOnce(
  store: JournalStore,
  remote: RemoteApi,
  uid: string,
  cursor: string | null,
  onCursor?: (cursor: string) => void,
): Promise<SyncResult> {
  const res: SyncResult = { cursor, pulled: 0, pushed: 0, changed: 0, rejected: 0 };

  // ---- pull ----
  const since = sinceFromCursor(cursor);
  let after: { at: string; id: string } | null = null;
  for (;;) {
    const rows = await remote.pull(since, after, PULL_PAGE);
    if (!rows.length) break;
    res.pulled += rows.length;
    res.changed += await applyRows(store, rows, uid);
    const last = rows[rows.length - 1];
    after = { at: last.server_updated_at, id: last.id };
    // Never move the cursor backwards (the overlap window re-reads older rows).
    if (!res.cursor || isoMs(last.server_updated_at) >= isoMs(res.cursor)) res.cursor = last.server_updated_at;
    if (rows.length < PULL_PAGE) break;
  }
  if (res.cursor && res.cursor !== cursor) onCursor?.(res.cursor);

  // ---- push ----
  const dirty = (await store.records()).filter((r) => needsPush(r, uid));
  for (let i = 0; i < dirty.length; i += PUSH_BATCH) {
    const batch = dirty.slice(i, i + PUSH_BATCH);
    const accepted = new Map<string, StoredRecord>();
    for (const row of await remote.push(batch.map(toPushRow))) {
      const rec = fromRemoteRow(row);
      if (rec) accepted.set(rec.id, rec);
    }
    const sent = new Map(batch.map((r) => [r.id, r]));
    const ok = batch.filter((r) => accepted.has(r.id)).map((r) => r.id);
    res.pushed += ok.length;
    if (ok.length) await store.updateRecords(ok, (id, cur) => ackPushed(cur, sent.get(id)!.updatedAt, accepted.get(id)!, uid));
    const refused = batch.filter((r) => !accepted.has(r.id)).map((r) => r.id);
    if (refused.length) {
      res.rejected += refused.length;
      res.changed += await applyRows(store, await remote.fetch(refused), uid);
    }
  }
  return res;
}
