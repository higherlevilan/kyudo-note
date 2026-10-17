// Plain self-checks for the journal's pure logic (no test framework). Not imported by the app.
// `runJournalSelfChecks()` returns a list of failure messages; an empty list means all passed.
// Relative imports keep it runnable outside the Next bundler.

import { practiceCsv, csvCell } from "./csv";
import { addDays, dayNum, isValidDay, todayISO, weekStart, weekday } from "./date";
import { blankEntry, gridCounts, normalizeEntry, parseImport, practiceTotals, tidyEntry, validateEntry } from "./model";
import { sampleEntries } from "./sample";
import { faultCounts, heatmap, practiceStreak, weeklyHitRate } from "./stats";
import { createMemoryStore } from "./store";
import type { PracticeEntry } from "./types";

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

  return fails;
}
