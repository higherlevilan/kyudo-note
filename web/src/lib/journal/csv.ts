// CSV export of practice entries (UTF-8 with BOM so Excel opens Chinese correctly).

import { faultLabel, optLabel, PRACTICE_KIND_OPTS, SHAHO_STEP_OPTS, YADOKORO_OPTS } from "./options";
import { pct, practiceTotals } from "./model";
import type { Entry, PracticeEntry } from "./types";

/** Quote a CSV cell; neutralise spreadsheet formula injection (=, +, -, @ at the start). */
export function csvCell(v: string | number | null | undefined): string {
  if (v == null) return "";
  let s = String(v);
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const HEADER = [
  "日期",
  "道場",
  "練習種類",
  "的前射數",
  "的中",
  "的中率%",
  "巻藁射數",
  "練習分鐘",
  "射癖",
  "矢所",
  "練習重點（八節）",
  "記錄表",
  "指導者",
  "指導意見",
  "自我反省",
  "疲勞度(1-5)",
  "疼痛部位",
  "身體備註",
  "備註",
  "標籤",
];

function row(e: PracticeEntry): (string | number | null)[] {
  const t = practiceTotals(e);
  const r = pct(t.hits, t.arrows);
  return [
    e.date,
    e.place,
    e.kinds.map((k) => optLabel(PRACTICE_KIND_OPTS, k)).join("、"),
    t.arrows,
    t.hits,
    r == null ? null : Math.round(r * 10) / 10,
    t.makiwara,
    e.durationMin,
    e.faults.map(faultLabel).join("、"),
    e.yadokoro.map((k) => optLabel(YADOKORO_OPTS, k)).join("、"),
    e.focusSteps.map((k) => optLabel(SHAHO_STEP_OPTS, k)).join("、"),
    e.rounds.map((rd) => rd.map((m) => (m === "o" ? "○" : m === "x" ? "×" : "・")).join("")).join(" "),
    e.instructor,
    e.feedback,
    e.reflection,
    e.fatigue,
    e.painAreas.join("、"),
    e.painNote,
    e.notes,
    e.tags.join("、"),
  ];
}

export function practiceCsv(entries: Entry[]): string {
  const rows = entries
    .filter((e): e is PracticeEntry => e.type === "practice")
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .map(row);
  return "﻿" + [HEADER, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
