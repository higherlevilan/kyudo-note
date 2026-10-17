// Per-device link between the local journal and one cloud account (localStorage, best effort).
// The pull cursor lives here too, so switching accounts always starts with a full pull.

import { readPref, writePref } from "../store";
import { SYNC_ENABLED } from "./config";

export interface SyncLink {
  uid: string;
  email: string;
  /** server_updated_at of the last row pulled (raw string from the API), null = full pull. */
  cursor: string | null;
  /** ISO time of the last completed sync. */
  lastSyncAt: string | null;
}

const KEY = "journal:sync:link";

export function readLink(): SyncLink | null {
  if (!SYNC_ENABLED) return null;
  try {
    const v = JSON.parse(readPref(KEY) ?? "null") as Partial<SyncLink> | null;
    if (!v || typeof v.uid !== "string" || !v.uid) return null;
    return {
      uid: v.uid,
      email: typeof v.email === "string" ? v.email : "",
      cursor: typeof v.cursor === "string" ? v.cursor : null,
      lastSyncAt: typeof v.lastSyncAt === "string" ? v.lastSyncAt : null,
    };
  } catch {
    return null;
  }
}

export function writeLink(link: SyncLink | null): void {
  writePref(KEY, link ? JSON.stringify(link) : null);
}

export function updateLink(patch: Partial<SyncLink>): SyncLink | null {
  const cur = readLink();
  if (!cur) return null;
  const next = { ...cur, ...patch };
  writeLink(next);
  return next;
}

/** True while this device's journal belongs to a cloud account: deletions must leave tombstones. */
export const isLinked = () => readLink() !== null;
