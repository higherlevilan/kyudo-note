// The cloud side of sync, behind a tiny interface so the engine can be tested with a fake.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PushRow, RemoteRow } from "./merge";

export interface PullAfter {
  at: string;
  id: string;
}

export interface RemoteApi {
  /** Rows with server_updated_at ≥ since (or after the keyset `after`), oldest first, at most `limit`. */
  pull(since: string | null, after: PullAfter | null, limit: number): Promise<RemoteRow[]>;
  /** Upsert rows; resolves to the rows the server actually stored (older versions are skipped by trigger). */
  push(rows: PushRow[]): Promise<RemoteRow[]>;
  /** Current cloud rows for these ids. */
  fetch(ids: string[]): Promise<RemoteRow[]>;
}

export type SyncErrorKind = "network" | "auth" | "schema" | "permission" | "other";

export class SyncError extends Error {
  constructor(
    readonly kind: SyncErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "SyncError";
  }
}

const TABLE = "journal_entries";
const COLS = "id,type,date,data,created_at,updated_at,deleted,server_updated_at";

interface ApiError {
  message?: string;
  code?: string;
}

function toSyncError(error: ApiError | null, status: number): SyncError {
  const msg = error?.message ?? "unknown error";
  const code = error?.code ?? "";
  if (status === 0 || /fetch|network|load failed/i.test(msg)) return new SyncError("network", msg);
  if (status === 401 || code === "PGRST301" || code === "PGRST303" || /jwt/i.test(msg)) return new SyncError("auth", msg);
  if (code === "42P01" || code === "PGRST205" || code === "42703" || status === 404) return new SyncError("schema", msg);
  if (code === "42501" || status === 403) return new SyncError("permission", msg);
  return new SyncError("other", msg);
}

/** Supabase (PostgREST) implementation. Row Level Security limits every query to the signed-in user. */
export function supabaseRemote(client: SupabaseClient, uid: string): RemoteApi {
  const table = () => client.from(TABLE);
  const unwrap = <T>(r: { data: T | null; error: ApiError | null; status: number }): T => {
    if (r.error) throw toSyncError(r.error, r.status);
    return (r.data ?? []) as T;
  };
  return {
    async pull(since, after, limit) {
      let q = table().select(COLS).eq("user_id", uid);
      // Keyset pagination on (server_updated_at, id). Values are quoted for PostgREST's
      // logic-tree syntax; ids only ever contain [A-Za-z0-9_.:-].
      if (after) q = q.or(`server_updated_at.gt."${after.at}",and(server_updated_at.eq."${after.at}",id.gt."${after.id}")`);
      else if (since) q = q.gte("server_updated_at", since);
      return unwrap<RemoteRow[]>(await q.order("server_updated_at", { ascending: true }).order("id", { ascending: true }).limit(limit));
    },
    async push(rows) {
      if (!rows.length) return [];
      const r = await table()
        .upsert(
          rows.map((row) => ({ ...row, user_id: uid })),
          { onConflict: "user_id,id" },
        )
        .select(COLS);
      return unwrap<RemoteRow[]>(r);
    },
    async fetch(ids) {
      if (!ids.length) return [];
      return unwrap<RemoteRow[]>(await table().select(COLS).eq("user_id", uid).in("id", ids));
    },
  };
}
