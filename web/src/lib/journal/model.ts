// Entry factories, derived values and validation. Pure functions, no browser APIs.

import { isValidDay } from "./date";
import {
  CULTURE_KINDS,
  CURRENCIES,
  ENTRY_TYPES,
  EQUIP_CATEGORIES,
  EQUIP_STATUSES,
  EXAM_RESULTS,
  EXPORT_APP,
  EXPORT_VERSION,
  GOAL_KINDS,
  PRACTICE_KINDS,
  SHAHO_STEPS,
  YADOKORO,
  type Entry,
  type EntryOf,
  type EntryType,
  type JournalExport,
  type Mark,
  type PracticeEntry,
} from "./types";

export const LIMITS = {
  text: 4000,
  short: 200,
  list: 100,
  arrows: 2000,
  price: 100_000_000,
  entries: 20_000,
  importBytes: 15 * 1024 * 1024,
} as const;

export function newId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** A blank entry of the given type. `date` is the local day; `now` an ISO timestamp. */
export function blankEntry<T extends EntryType>(type: T, date: string, now: string, id: string = newId()): EntryOf<T> {
  const base = { id, date, notes: "", tags: [] as string[], createdAt: now, updatedAt: now };
  let e: Entry;
  switch (type) {
    case "practice":
      e = {
        ...base,
        type,
        place: "",
        kinds: ["matomae"],
        rounds: [],
        arrows: 0,
        hits: 0,
        makiwara: 0,
        durationMin: null,
        faults: [],
        yadokoro: [],
        focusSteps: [],
        instructor: "",
        feedback: "",
        reflection: "",
        fatigue: null,
        painAreas: [],
        painNote: "",
        equipmentIds: [],
      };
      break;
    case "lesson":
      e = { ...base, type, className: "", teacher: "", place: "", keyPoints: [""], steps: [], homework: "" };
      break;
    case "exam":
      e = { ...base, type, grade: "初段", result: "pending", place: "", marks: ["", ""], questions: [""], judgeComments: "", reflection: "" };
      break;
    case "purchase":
      e = { ...base, type, item: "", category: "yumi", shop: "", price: null, currency: "TWD", specs: [], status: "active" };
      break;
    case "culture":
      e = { ...base, type, event: "", kind: "taikai", place: "", link: "" };
      break;
    case "goal":
      e = { ...base, type, title: "", kind: "exam", grade: "初段", target: null, since: date, done: false };
      break;
    default:
      throw new Error(`unknown type ${String(type)}`);
  }
  return e as EntryOf<T>;
}

export function gridCounts(rounds: Mark[][]): { arrows: number; hits: number } {
  let arrows = 0;
  let hits = 0;
  for (const r of rounds)
    for (const m of r) {
      if (m) arrows++;
      if (m === "o") hits++;
    }
  return { arrows, hits };
}

export function usesGrid(e: Pick<PracticeEntry, "rounds">): boolean {
  return e.rounds.some((r) => r.some((m) => m !== ""));
}

/** 的前 arrows/hits, taking the score sheet into account. */
export function practiceTotals(e: PracticeEntry): { arrows: number; hits: number; makiwara: number } {
  const g = usesGrid(e) ? gridCounts(e.rounds) : { arrows: e.arrows, hits: e.hits };
  return { ...g, makiwara: e.makiwara };
}

export function pct(hits: number, arrows: number): number | null {
  return arrows > 0 ? (hits / arrows) * 100 : null;
}

export function fmtPct(v: number | null, digits = 0): string {
  return v == null ? "—" : `${v.toFixed(digits)}%`;
}

/** Main display title of an entry. */
export function entryTitle(e: Entry): string {
  switch (e.type) {
    case "practice":
      return e.place ? `稽古・${e.place}` : "稽古";
    case "lesson":
      return e.className || "課程筆記";
    case "exam":
      return `${e.grade}審查`;
    case "purchase":
      return e.item || "裝備";
    case "culture":
      return e.event || "文化體驗";
    case "goal":
      return e.title || "目標";
  }
}

/** Lower-cased text blob used for search. */
export function searchText(e: Entry): string {
  const parts: string[] = [e.notes, ...e.tags, entryTitle(e)];
  switch (e.type) {
    case "practice":
      parts.push(e.place, e.instructor, e.feedback, e.reflection, e.painNote, ...e.faults, ...e.painAreas);
      break;
    case "lesson":
      parts.push(e.teacher, e.place, e.homework, ...e.keyPoints);
      break;
    case "exam":
      parts.push(e.place, e.judgeComments, e.reflection, ...e.questions);
      break;
    case "purchase":
      parts.push(e.shop, ...e.specs.flatMap((s) => [s.label, s.value]));
      break;
    case "culture":
      parts.push(e.place);
      break;
    case "goal":
      parts.push(e.grade);
      break;
  }
  return parts.join("\n").toLowerCase();
}

// ---------- validation (editor) ----------

export interface FieldError {
  field: string;
  message: string;
}

export function validateEntry(e: Entry): FieldError[] {
  const errs: FieldError[] = [];
  if (!isValidDay(e.date)) errs.push({ field: "date", message: "請填寫有效的日期" });
  switch (e.type) {
    case "practice": {
      const intOk = (n: number) => Number.isInteger(n) && n >= 0 && n <= LIMITS.arrows;
      if (!intOk(e.arrows)) errs.push({ field: "arrows", message: `射數須為 0–${LIMITS.arrows} 的整數` });
      if (!intOk(e.hits)) errs.push({ field: "hits", message: "的中數須為 0 以上的整數" });
      else if (!usesGrid(e) && e.hits > e.arrows) errs.push({ field: "hits", message: "的中數不能多於射數" });
      if (!intOk(e.makiwara)) errs.push({ field: "makiwara", message: `巻藁射數須為 0–${LIMITS.arrows} 的整數` });
      if (e.durationMin != null && !(Number.isInteger(e.durationMin) && e.durationMin > 0 && e.durationMin <= 1440))
        errs.push({ field: "durationMin", message: "練習時間須為 1–1440 分鐘" });
      break;
    }
    case "lesson":
      if (!e.className.trim() && !e.keyPoints.some((k) => k.trim())) errs.push({ field: "className", message: "請至少填寫課程名稱或一項重點" });
      break;
    case "exam":
      if (!e.grade.trim()) errs.push({ field: "grade", message: "請選擇受審段位" });
      break;
    case "purchase":
      if (!e.item.trim()) errs.push({ field: "item", message: "請填寫品項名稱" });
      if (e.price != null && !(Number.isFinite(e.price) && e.price >= 0 && e.price <= LIMITS.price))
        errs.push({ field: "price", message: "價格須為 0 以上的數字" });
      break;
    case "culture":
      if (!e.event.trim()) errs.push({ field: "event", message: "請填寫活動名稱" });
      if (e.link.trim() && !/^https?:\/\//i.test(e.link.trim())) errs.push({ field: "link", message: "連結須以 http:// 或 https:// 開頭" });
      break;
    case "goal":
      if (!e.title.trim()) errs.push({ field: "title", message: "請填寫目標名稱" });
      if ((e.kind === "arrows" || e.kind === "hitrate") && (e.target == null || !(e.target > 0)))
        errs.push({ field: "target", message: "請填寫目標數值" });
      if (e.kind === "hitrate" && e.target != null && e.target > 100) errs.push({ field: "target", message: "的中率目標不能超過 100%" });
      if (e.kind === "arrows" && !isValidDay(e.since)) errs.push({ field: "since", message: "請填寫起算日期" });
      break;
  }
  return errs;
}

/** Trim strings and drop empty list items before saving. */
export function tidyEntry(e: Entry, now: string): Entry {
  const t = (s: string) => s.trim();
  const list = (a: string[]) => a.map(t).filter(Boolean);
  const base = { ...e, notes: t(e.notes), tags: list(e.tags), updatedAt: now };
  switch (base.type) {
    case "practice": {
      const rounds = base.rounds.filter((r) => r.some((m) => m));
      const g = rounds.length ? gridCounts(rounds) : { arrows: base.arrows, hits: base.hits };
      return { ...base, rounds, ...g, place: t(base.place), instructor: t(base.instructor), feedback: t(base.feedback), reflection: t(base.reflection), painNote: t(base.painNote) };
    }
    case "lesson":
      return { ...base, className: t(base.className), teacher: t(base.teacher), place: t(base.place), keyPoints: list(base.keyPoints), homework: t(base.homework) };
    case "exam":
      return { ...base, place: t(base.place), questions: list(base.questions), judgeComments: t(base.judgeComments), reflection: t(base.reflection) };
    case "purchase":
      return { ...base, item: t(base.item), shop: t(base.shop), specs: base.specs.map((s) => ({ label: t(s.label), value: t(s.value) })).filter((s) => s.label || s.value) };
    case "culture":
      return { ...base, event: t(base.event), place: t(base.place), link: t(base.link) };
    case "goal":
      return { ...base, title: t(base.title) };
  }
}

// ---------- normalisation (import / storage) ----------

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max: number = LIMITS.text): string => (typeof v === "string" ? v.slice(0, max) : "");
const strList = (v: unknown, max: number = LIMITS.short): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, LIMITS.list).map((s) => s.slice(0, max)) : [];
const enumOf = <T extends string>(allowed: readonly T[], v: unknown, fallback: T): T => (allowed.includes(v as T) ? (v as T) : fallback);
const enumList = <T extends string>(allowed: readonly T[], v: unknown): T[] => [...new Set(strList(v).filter((x): x is T => allowed.includes(x as T)))];
const int = (v: unknown, max: number): number => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(0, Math.round(v))) : 0);
const intOrNull = (v: unknown, max: number): number | null => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(0, Math.round(v))) : null);
const numOrNull = (v: unknown, max: number): number | null => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.min(max, v) : null);
const mark = (v: unknown): Mark => (v === "o" || v === "x" ? v : "");
const iso = (v: unknown, fallback: string): string => {
  if (typeof v !== "string" || v.length > 40) return fallback;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? fallback : d.toISOString();
};
/** Ids become object keys in some backends; refuse the ones that alias Object.prototype. */
const RESERVED_IDS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Coerce an unknown value into a valid Entry, or return null if it cannot be one
 * (unknown type, missing id, invalid date). Unknown fields are dropped.
 */
export function normalizeEntry(raw: unknown, now: string = new Date().toISOString()): Entry | null {
  if (!isObj(raw)) return null;
  const type = raw.type as EntryType;
  if (!ENTRY_TYPES.includes(type)) return null;
  const id = str(raw.id, 100);
  if (!id || !/^[\w.:-]+$/.test(id) || RESERVED_IDS.has(id)) return null;
  if (!isValidDay(raw.date)) return null;
  const e = blankEntry(type, raw.date, now, id) as Entry;
  e.notes = str(raw.notes);
  e.tags = strList(raw.tags, 40);
  e.createdAt = iso(raw.createdAt, now);
  e.updatedAt = iso(raw.updatedAt, e.createdAt);
  if (raw.sample === true) e.sample = true;

  switch (e.type) {
    case "practice":
      e.place = str(raw.place, LIMITS.short);
      e.kinds = enumList(PRACTICE_KINDS, raw.kinds);
      e.rounds = Array.isArray(raw.rounds)
        ? raw.rounds
            .filter(Array.isArray)
            .slice(0, 250)
            .map((r: unknown[]) => r.slice(0, 8).map(mark))
        : [];
      e.arrows = int(raw.arrows, LIMITS.arrows);
      e.hits = Math.min(e.arrows, int(raw.hits, LIMITS.arrows));
      if (usesGrid(e)) Object.assign(e, gridCounts(e.rounds));
      e.makiwara = int(raw.makiwara, LIMITS.arrows);
      e.durationMin = intOrNull(raw.durationMin, 1440) || null;
      e.faults = [...new Set(strList(raw.faults, 60))];
      e.yadokoro = enumList(YADOKORO, raw.yadokoro);
      e.focusSteps = enumList(SHAHO_STEPS, raw.focusSteps);
      e.instructor = str(raw.instructor, LIMITS.short);
      e.feedback = str(raw.feedback);
      e.reflection = str(raw.reflection);
      e.fatigue = (() => {
        const f = intOrNull(raw.fatigue, 5);
        return f != null && f >= 1 ? f : null;
      })();
      e.painAreas = [...new Set(strList(raw.painAreas, 40))];
      e.painNote = str(raw.painNote);
      e.equipmentIds = strList(raw.equipmentIds, 100);
      break;
    case "lesson":
      e.className = str(raw.className, LIMITS.short);
      e.teacher = str(raw.teacher, LIMITS.short);
      e.place = str(raw.place, LIMITS.short);
      e.keyPoints = strList(raw.keyPoints, LIMITS.text);
      e.steps = enumList(SHAHO_STEPS, raw.steps);
      e.homework = str(raw.homework);
      break;
    case "exam":
      e.grade = str(raw.grade, 40) || "初段";
      e.result = enumOf(EXAM_RESULTS, raw.result, "pending");
      e.place = str(raw.place, LIMITS.short);
      e.marks = Array.isArray(raw.marks) ? raw.marks.slice(0, 4).map(mark) : ["", ""];
      e.questions = strList(raw.questions, LIMITS.text);
      e.judgeComments = str(raw.judgeComments);
      e.reflection = str(raw.reflection);
      break;
    case "purchase":
      e.item = str(raw.item, LIMITS.short);
      e.category = enumOf(EQUIP_CATEGORIES, raw.category, "other");
      e.shop = str(raw.shop, LIMITS.short);
      e.price = numOrNull(raw.price, LIMITS.price);
      e.currency = enumOf(CURRENCIES, raw.currency, "TWD");
      e.specs = Array.isArray(raw.specs)
        ? raw.specs
            .filter(isObj)
            .slice(0, 30)
            .map((s) => ({ label: str(s.label, 60), value: str(s.value, LIMITS.short) }))
        : [];
      e.status = enumOf(EQUIP_STATUSES, raw.status, "active");
      break;
    case "culture":
      e.event = str(raw.event, LIMITS.short);
      e.kind = enumOf(CULTURE_KINDS, raw.kind, "other");
      e.place = str(raw.place, LIMITS.short);
      e.link = (() => {
        const l = str(raw.link, 1000).trim();
        return /^https?:\/\//i.test(l) ? l : "";
      })();
      break;
    case "goal":
      e.title = str(raw.title, LIMITS.short);
      e.kind = enumOf(GOAL_KINDS, raw.kind, "custom");
      e.grade = str(raw.grade, 40);
      e.target = numOrNull(raw.target, 1_000_000);
      e.since = isValidDay(raw.since) ? raw.since : e.date;
      e.done = raw.done === true;
      break;
  }
  return e;
}

export interface ParsedImport {
  entries: Entry[];
  skipped: number;
  errors: string[];
}

/** Validate an exported JSON document (already JSON.parse'd). */
export function parseImport(data: unknown, now: string = new Date().toISOString()): ParsedImport {
  const errors: string[] = [];
  let list: unknown[];
  if (Array.isArray(data)) list = data;
  else if (isObj(data) && Array.isArray(data.entries)) {
    if (data.app !== undefined && data.app !== EXPORT_APP) errors.push("這個檔案看起來不是稽古帳的匯出檔。");
    if (typeof data.version === "number" && data.version > EXPORT_VERSION) errors.push(`檔案版本（v${data.version}）比本站支援的新，部分欄位可能會被略過。`);
    list = data.entries;
  } else {
    return { entries: [], skipped: 0, errors: ["檔案格式不正確：找不到 entries 清單。"] };
  }
  if (list.length > LIMITS.entries) {
    errors.push(`紀錄太多（${list.length} 筆），只匯入前 ${LIMITS.entries} 筆。`);
    list = list.slice(0, LIMITS.entries);
  }
  const seen = new Set<string>();
  const entries: Entry[] = [];
  let skipped = 0;
  for (const raw of list) {
    const e = normalizeEntry(raw, now);
    if (!e || seen.has(e.id)) {
      skipped++;
      continue;
    }
    seen.add(e.id);
    entries.push(e);
  }
  return { entries, skipped, errors };
}

export function buildExport(entries: Entry[], now: string = new Date().toISOString()): JournalExport {
  return { app: EXPORT_APP, version: EXPORT_VERSION, exportedAt: now, entries };
}

/** Newest first; same day → most recently created first. */
export function compareEntries(a: Entry, b: Entry): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
}
