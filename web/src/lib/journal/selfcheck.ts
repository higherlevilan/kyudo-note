// Plain self-checks for the journal's pure logic (no test framework). Not imported by the app.
// `runJournalSelfChecks()` returns a list of failure messages; an empty list means all passed.
// Relative imports keep it runnable outside the Next bundler.

import { practiceCsv, csvCell } from "./csv";
import { addDays, dayNum, isValidDay, todayISO, weekStart, weekday } from "./date";
import { blankEntry, gridCounts, normalizeEntry, parseImport, practiceTotals, tidyEntry, validateEntry } from "./model";
import { sampleEntries } from "./sample";
import { faultCounts, heatmap, practiceStreak, weeklyHitRate } from "./stats";
import { createMemoryStore, type JournalStore } from "./store";
import { countPending, PULL_PAGE, syncOnce } from "./sync/engine";
import {
  ackPushed,
  fromRemoteRow,
  isoMs,
  isTombstone,
  needsPush,
  resolveRemote,
  syncMark,
  toPushRow,
  tombstoneFor,
  type PushRow,
  type RemoteRow,
  type StoredRecord,
} from "./sync/merge";
import type { RemoteApi } from "./sync/remote";
import type { PracticeEntry } from "./types";

/**
 * In-memory stand-in for the `journal_entries` table + its BEFORE INSERT/UPDATE trigger
 * (supabase/migrations/0001_journal.sql): tombstones lose their content, older or equal
 * versions are skipped (a deletion wins a tie), accepted writes get a fresh server timestamp.
 */
export function fakeRemote(): { api: RemoteApi; rows: Map<string, RemoteRow> } {
  const rows = new Map<string, RemoteRow>();
  let clock = Date.parse("2030-01-01T00:00:00.000Z");
  // Postgres-style microsecond timestamps, to exercise the client's parsing. Each write moves
  // the clock 10 minutes so the pull-overlap window does not hide the refused-push path.
  const tick = () => new Date((clock += 600_000)).toISOString().replace("Z", "123+00:00");
  const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
  const order = (a: RemoteRow, b: RemoteRow) => isoMs(a.server_updated_at) - isoMs(b.server_updated_at) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const api: RemoteApi = {
    async pull(since, after, limit) {
      return [...rows.values()]
        .filter((r) => {
          const t = isoMs(r.server_updated_at);
          if (after) return t > isoMs(after.at) || (t === isoMs(after.at) && r.id > after.id);
          return since ? t >= isoMs(since) : true;
        })
        .sort(order)
        .slice(0, limit)
        .map(clone);
    },
    async push(batch: PushRow[]) {
      const out: RemoteRow[] = [];
      for (const row of batch) {
        const next: RemoteRow = { ...clone(row), server_updated_at: "" };
        if (next.deleted) Object.assign(next, { type: null, date: null, data: {} });
        const old = rows.get(row.id);
        if (old) {
          const n = isoMs(next.updated_at);
          const o = isoMs(old.updated_at);
          if (n < o || (n === o && !(next.deleted && !old.deleted))) continue;
        }
        next.server_updated_at = tick();
        rows.set(row.id, next);
        out.push(clone(next));
      }
      return out;
    },
    async fetch(ids) {
      return ids.flatMap((id) => (rows.has(id) ? [clone(rows.get(id)!)] : []));
    },
  };
  return { api, rows };
}

/** One simulated device: a linked local store plus its pull cursor. */
function device(uid: string) {
  const store: JournalStore = createMemoryStore([], { trackDeletes: () => true });
  let cursor: string | null = null;
  return {
    store,
    async sync(api: RemoteApi) {
      const r = await syncOnce(store, api, uid, cursor);
      cursor = r.cursor;
      return r;
    },
  };
}

async function runSyncSelfChecks(ok: (cond: unknown, msg: string) => void, now: string): Promise<void> {
  const uid = "user-a";
  const at = (min: number) => new Date(Date.parse(now) + min * 60_000).toISOString();
  const entry = (id: string, min: number, notes = "") => {
    const e = blankEntry("practice", "2026-10-18", at(0), id);
    e.updatedAt = at(min);
    e.notes = notes;
    return e;
  };

  // ---- pure merge rules ----
  const e1 = entry("e1", 1, "local");
  const remoteNewer = { ...entry("e1", 2, "remote") };
  ok(resolveRemote(undefined, remoteNewer, uid).kind === "put", "unknown remote entry is added");
  const rn = resolveRemote(e1, remoteNewer, uid);
  ok(rn.kind === "put" && rn.value._sync === syncMark(uid, remoteNewer.updatedAt), "newer remote wins and is marked synced");
  ok(resolveRemote(entry("e1", 3), remoteNewer, uid).kind === "keep", "newer local is kept");
  const dead: StoredRecord = { id: "e1", deleted: true, updatedAt: at(2) };
  ok(resolveRemote(e1, dead, uid).kind === "delete", "newer remote deletion removes local copy");
  ok(resolveRemote(undefined, dead, uid).kind === "keep", "remote tombstone for unknown id stores nothing");
  ok(resolveRemote({ id: "e1", deleted: true, updatedAt: at(2) }, entry("e1", 2), uid).kind === "keep", "tie: local deletion beats live remote");
  ok(resolveRemote(entry("e1", 2, "x"), entry("e1", 2, "y"), uid).kind === "put", "tie: cloud copy wins over unsynced local");
  const synced = { ...entry("e1", 2), _sync: syncMark(uid, at(2)) };
  ok(resolveRemote(synced, entry("e1", 2), uid).kind === "keep", "echo of our own push is a no-op");
  ok(!needsPush(synced, uid) && needsPush(synced, "user-b"), "sync marker is per account");
  ok(needsPush(e1, uid) && !needsPush({ ...e1, sample: true }, uid) && !needsPush(entry("sample-001", 1), uid), "samples never pushed");
  const tb = tombstoneFor(entry("e9", 600), at(0)); // device clock behind the entry
  ok(isTombstone(tb) && isoMs(tb.updatedAt) > isoMs(at(600)), "tombstone is always newer than what it deletes");
  const row = { ...toPushRow({ ...e1, tags: ["a"] }), server_updated_at: at(5) };
  const back = fromRemoteRow({ ...row, updated_at: row.updated_at.replace("Z", "000+00:00") });
  ok(back && !isTombstone(back) && JSON.stringify(back) === JSON.stringify({ ...e1, tags: ["a"] }), "push row ↔ remote row round trip");
  ok(!("sample" in (toPushRow({ ...e1, sample: true }).data as object)) && !("_sync" in (toPushRow(synced).data as object)), "push row carries no sample flag / marker");
  ok(fromRemoteRow({ ...row, id: "sample-000" }) === null && fromRemoteRow({ ...row, type: "evil" }) === null, "junk / sample rows from cloud ignored");
  ok(isTombstone(fromRemoteRow({ ...row, deleted: true })), "remote deletion parsed as tombstone");
  const ack = ackPushed(e1, e1.updatedAt, { ...e1, updatedAt: at(0) }, uid);
  ok(ack.kind === "put" && ack.value.updatedAt === at(0) && !needsPush(ack.value, uid), "ack adopts server timestamp (clamped clocks)");
  ok(ackPushed(entry("e1", 9), e1.updatedAt, e1, uid).kind === "keep", "ack ignored when edited during push");
  ok(ackPushed(dead, dead.updatedAt, dead, uid).kind === "delete", "pushed tombstone is dropped locally");

  // ---- local store with tombstones ----
  const ls = createMemoryStore([], { trackDeletes: () => true });
  await ls.put(entry("k1", 1));
  await ls.put({ ...entry("sample-000", 1), sample: true });
  await ls.delete("k1");
  await ls.delete("sample-000");
  const recs = await ls.records();
  ok(recs.length === 1 && isTombstone(recs[0]), "linked delete leaves a tombstone; sample delete is hard");
  ok((await ls.list()).length === 0 && (await ls.get("k1")) === undefined && (await ls.exportAll()).entries.length === 0, "tombstones invisible to list/get/export");
  await ls.put(entry("k1", 0)); // undo with an *old* timestamp would lose; UI bumps it — here just check overwrite
  ok((await ls.list()).length === 1, "put over a tombstone restores the entry");
  await ls.clear();
  ok((await ls.records()).every(isTombstone) && (await ls.list()).length === 0, "linked clear tombstones everything");
  const plain = createMemoryStore();
  await plain.put(entry("p1", 1));
  await plain.delete("p1");
  ok((await plain.records()).length === 0, "unlinked delete is a hard delete");

  // ---- end-to-end: two devices, one account ----
  const { api, rows } = fakeRemote();
  const A = device(uid);
  const B = device(uid);
  await A.store.importAll([entry("x1", 1, "a"), entry("x2", 1, "a"), { ...entry("sample-005", 1), sample: true }], "merge");
  let r = await A.sync(api);
  ok(r.pushed === 2 && rows.size === 2 && !rows.has("sample-005"), "first sync uploads real entries, not samples");
  ok((await countPending(A.store, uid)) === 0, "nothing pending after sync");
  r = await B.sync(api);
  ok((await B.store.list()).length === 2, "second device pulls everything");

  // B edits x1 and deletes x2; A picks both up.
  await B.store.put(entry("x1", 5, "b-edit"));
  await B.store.delete("x2");
  r = await B.sync(api);
  ok(r.pushed === 2 && rows.get("x2")?.deleted === true && (await B.store.records()).length === 1, "edit + delete pushed; tombstone dropped after push");
  ok(JSON.stringify(rows.get("x2")?.data) === "{}", "cloud tombstone holds no content");
  await A.sync(api);
  const aList = await A.store.list();
  ok(aList.length === 2 && aList.some((e) => e.id === "x1" && e.notes === "b-edit") && !aList.some((e) => e.id === "x2"), "edit and deletion reach the other device");
  ok(aList.some((e) => e.id === "sample-005"), "local samples untouched by sync");

  // Concurrent edits: newer updatedAt wins regardless of who syncs first.
  await A.store.put(entry("x1", 20, "a-newer"));
  await B.store.put(entry("x1", 10, "b-older"));
  await B.sync(api);
  await A.sync(api);
  await B.sync(api);
  const pick = async (d: ReturnType<typeof device>) => (await d.store.get("x1"))?.notes;
  ok((await pick(A)) === "a-newer" && (await pick(B)) === "a-newer" && (await countPending(B.store, uid)) === 0, "last writer wins and both converge");

  // A stale local copy (e.g. old backup imported) is refused by the server and replaced.
  await A.store.put(entry("z1", 1));
  await A.sync(api);
  await B.sync(api); // cursor now well past x1's server timestamp
  await B.store.put(entry("x1", 15, "stale"));
  r = await B.sync(api);
  ok(r.rejected === 1 && (await pick(B)) === "a-newer", "refused push is resolved from the cloud copy");

  // Deletion on one device vs older edit on another: deletion wins.
  await A.store.delete("x1");
  const tomb = (await A.store.records()).find((x) => x.id === "x1")!;
  await B.store.put({ ...entry("x1", 0, "b-edit-before-delete"), updatedAt: new Date(isoMs(tomb.updatedAt) - 1).toISOString() });
  await A.sync(api);
  await B.sync(api);
  ok((await A.store.get("x1")) === undefined && (await B.store.get("x1")) === undefined, "newer deletion beats older edit");

  // Offline: a failing remote leaves local data and pending changes intact.
  await A.store.put(entry("y1", 30, "offline"));
  const broken: RemoteApi = { ...api, pull: async () => Promise.reject(new Error("Failed to fetch")) };
  let failed = false;
  try {
    await syncOnce(A.store, broken, uid, null);
  } catch {
    failed = true;
  }
  ok(failed && (await A.store.get("y1"))?.notes === "offline" && (await countPending(A.store, uid)) === 1, "offline sync keeps local change pending");
  await A.sync(api);
  ok(rows.get("y1")?.deleted === false, "pending change uploaded once back online");

  // Paging: more rows than one pull page.
  const many = Array.from({ length: PULL_PAGE * 2 + 3 }, (_, i) => entry(`m${i}`, 40));
  await A.store.importAll(many, "merge");
  await A.sync(api);
  const C = device(uid);
  await C.sync(api);
  ok((await C.store.list()).length === many.length + 2, "full pull pages through every row"); // + y1, z1
  ok((await C.sync(api)).changed === 0, "repeat sync changes nothing");

  // Another account: every record is pending again (markers are per user).
  ok((await countPending(C.store, "user-b")) === many.length + 2, "switching account re-uploads");
}

export async function runJournalSelfChecks(): Promise<string[]> {
  const fails: string[] = [];
  const ok = (cond: unknown, msg: string) => {
    if (!cond) fails.push(msg);
  };
  const now = "2026-10-18T03:00:00.000Z";

  // dates
  ok(isValidDay("2024-02-29") && !isValidDay("2023-02-29") && !isValidDay("2026-13-01"), "isValidDay leap/month");
  ok(addDays("2026-12-31", 1) === "2027-01-01", "addDays year rollover");
  ok(weekday("2026-10-19") === 0 && weekStart("2026-10-18") === "2026-10-12", "Monday-based weeks");
  ok(dayNum("1970-01-02") === 1, "dayNum epoch");
  // 2026-10-17T17:30Z is already the 18th in Taipei (UTC+8).
  ok(todayISO(new Date("2026-10-17T17:30:00Z"), "Asia/Taipei") === "2026-10-18", "todayISO uses Asia/Taipei local day");

  // practice totals
  const p = blankEntry("practice", "2026-10-18", now, "p1");
  p.rounds = [["o", "x", "o", "o"], ["x", "", "", ""]];
  p.arrows = 99;
  ok(practiceTotals(p).arrows === 5 && practiceTotals(p).hits === 3, "grid overrides manual counts");
  ok(gridCounts([["", ""]]).arrows === 0, "empty grid counts zero");
  const t = tidyEntry(p, now) as PracticeEntry;
  ok(t.arrows === 5 && t.hits === 3, "tidy derives counts from grid");

  // validation
  const bad = blankEntry("practice", "2026-10-18", now, "p2");
  bad.arrows = 4;
  bad.hits = 5;
  ok(validateEntry(bad).some((e) => e.field === "hits"), "hits > arrows rejected");
  const pur = blankEntry("purchase", "2026-10-18", now, "b1");
  ok(validateEntry(pur).some((e) => e.field === "item"), "purchase needs item");

  // normalisation / import
  ok(normalizeEntry({ id: "x", type: "nope", date: "2026-01-01" }) === null, "unknown type dropped");
  ok(normalizeEntry({ id: "x", type: "practice", date: "bad" }) === null, "invalid date dropped");
  const n = normalizeEntry({ id: "x", type: "practice", date: "2026-01-01", arrows: 10, hits: 50, kinds: ["matomae", "evil"], evil: 1 }) as PracticeEntry;
  ok(n && n.hits === 10 && n.kinds.length === 1 && !("evil" in n), "normalize clamps and strips");
  const c = normalizeEntry({ id: "c", type: "culture", date: "2026-01-01", event: "e", link: "javascript:alert(1)" });
  ok(c?.type === "culture" && c.link === "", "non-http links dropped");
  const imp = parseImport({ app: "kyudo-note-journal", version: 1, entries: [{ id: "a", type: "lesson", date: "2026-01-01" }, { id: "a", type: "lesson", date: "2026-01-01" }, 5] });
  ok(imp.entries.length === 1 && imp.skipped === 2, "import dedupes and skips junk");
  ok(parseImport({ foo: 1 }).errors.length === 1, "import rejects non-export");

  // csv
  ok(csvCell("=SUM(A1)") === "'=SUM(A1)" && csvCell('a,"b"') === '"a,""b"""', "csv escaping + formula guard");
  ok(practiceCsv([t]).startsWith("﻿日期,"), "csv has BOM + header");

  // stats on sample data
  const sample = sampleEntries("2026-10-18", now);
  ok(sample.every((e) => e.sample && e.id.startsWith("sample-")), "sample entries flagged");
  ok(sample.every((e) => normalizeEntry(e) !== null), "sample entries are valid");
  const weeks = weeklyHitRate(sample, "2026-10-18", 12);
  ok(weeks.length === 12 && weeks[11].week === "2026-10-12", "weekly series ends this week");
  ok(heatmap(sample, "2026-10-18", 10).length === 10, "heatmap columns");
  ok(practiceStreak(sample, "2026-10-18").weeks >= 1, "streak from sample");
  ok(faultCounts(sample.filter((e): e is PracticeEntry => e.type === "practice")).length > 0, "fault counts");

  // store round trip
  const store = createMemoryStore();
  await store.importAll(sample, "merge");
  const older = { ...sample[0], updatedAt: "2000-01-01T00:00:00.000Z" };
  const r = await store.importAll([older], "merge");
  ok(r.unchanged === 1 && r.updated === 0, "merge keeps newer copy");
  ok((await store.list()).length === sample.length, "store lists all");
  const exp = await store.exportAll();
  ok(parseImport(JSON.parse(JSON.stringify(exp))).entries.length === sample.length, "export → import round trip");

  await runSyncSelfChecks(ok, now);

  return fails;
}
