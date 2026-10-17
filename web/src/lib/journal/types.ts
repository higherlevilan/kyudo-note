// Data model for 稽古帳 (the personal practice journal).
//
// Every record is one `Entry`, discriminated by `type`. All entries share the same
// base fields so the whole journal maps onto a single table later (Supabase:
// `journal_entries(id uuid, user_id, type text, date date, data jsonb, created_at,
// updated_at)`), with the type-specific fields living in `data`.
//
// Dates are local calendar days ("YYYY-MM-DD", no time zone); timestamps are ISO-8601 UTC.

export const ENTRY_TYPES = ["practice", "lesson", "exam", "purchase", "culture", "goal"] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

/** One arrow on the score sheet: hit (○), miss (×), or not yet shot. */
export type Mark = "o" | "x" | "";

export const SHAHO_STEPS = ["torimi", "ashibumi", "dozukuri", "yugamae", "uchiokoshi", "hikiwake", "kai", "hanare", "zanshin", "yudaoshi"] as const;
export type ShahoStep = (typeof SHAHO_STEPS)[number];

export const PRACTICE_KINDS = ["toshu", "gomuyumi", "subiki", "makiwara", "matomae", "shakai"] as const;
export type PracticeKind = (typeof PRACTICE_KINDS)[number];

export const YADOKORO = ["center", "mae", "ushiro", "ue", "shita", "chiru"] as const;
export type Yadokoro = (typeof YADOKORO)[number];

export const CURRENCIES = ["TWD", "JPY"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const EQUIP_CATEGORIES = ["yumi", "ya", "kake", "tsuru", "muneate", "dougi", "case", "other"] as const;
export type EquipCategory = (typeof EQUIP_CATEGORIES)[number];

export const EQUIP_STATUSES = ["active", "spare", "repair", "retired"] as const;
export type EquipStatus = (typeof EQUIP_STATUSES)[number];

export const EXAM_RESULTS = ["pass", "fail", "pending"] as const;
export type ExamResult = (typeof EXAM_RESULTS)[number];

export const CULTURE_KINDS = ["taikai", "yabusame", "dojo", "shrine", "seminar", "other"] as const;
export type CultureKind = (typeof CULTURE_KINDS)[number];

export const GOAL_KINDS = ["exam", "arrows", "hitrate", "custom"] as const;
export type GoalKind = (typeof GOAL_KINDS)[number];

export interface BaseEntry {
  id: string;
  type: EntryType;
  /** Local calendar day, YYYY-MM-DD. For goals: the target date. */
  date: string;
  /** Free-form notes. */
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  /** True for 「載入範例資料」 records, so they can be removed in one go. */
  sample?: boolean;
}

export interface PracticeEntry extends BaseEntry {
  type: "practice";
  place: string;
  kinds: PracticeKind[];
  /** Optional ○× score sheet; each row is one 一手 (2) or 立 (4). When any mark is set, arrows/hits are derived from it. */
  rounds: Mark[][];
  /** 的前 arrows shot (counts toward 的中率). */
  arrows: number;
  hits: number;
  /** 巻藁 arrows (not counted in 的中率). */
  makiwara: number;
  durationMin: number | null;
  /** Preset fault keys (see FAULTS) or free text. */
  faults: string[];
  yadokoro: Yadokoro[];
  focusSteps: ShahoStep[];
  instructor: string;
  feedback: string;
  reflection: string;
  /** 1 (很有精神) – 5 (非常疲勞); null = not recorded. */
  fatigue: number | null;
  painAreas: string[];
  painNote: string;
  /** Purchase-entry ids of the gear used. */
  equipmentIds: string[];
}

export interface LessonEntry extends BaseEntry {
  type: "lesson";
  className: string;
  teacher: string;
  place: string;
  keyPoints: string[];
  steps: ShahoStep[];
  homework: string;
}

export interface ExamEntry extends BaseEntry {
  type: "exam";
  grade: string;
  result: ExamResult;
  place: string;
  /** 甲矢・乙矢 */
  marks: Mark[];
  questions: string[];
  judgeComments: string;
  reflection: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface PurchaseEntry extends BaseEntry {
  type: "purchase";
  item: string;
  category: EquipCategory;
  shop: string;
  price: number | null;
  currency: Currency;
  specs: Spec[];
  status: EquipStatus;
}

export interface CultureEntry extends BaseEntry {
  type: "culture";
  event: string;
  kind: CultureKind;
  place: string;
  link: string;
}

export interface GoalEntry extends BaseEntry {
  type: "goal";
  title: string;
  kind: GoalKind;
  /** Exam goals: the grade. */
  grade: string;
  /** arrows: total arrow count; hitrate: percentage (0–100). */
  target: number | null;
  /** Start of the counting window for arrow goals (YYYY-MM-DD). */
  since: string;
  done: boolean;
}

export type Entry = PracticeEntry | LessonEntry | ExamEntry | PurchaseEntry | CultureEntry | GoalEntry;
export type EntryOf<T extends EntryType> = Extract<Entry, { type: T }>;

export const EXPORT_APP = "kyudo-note-journal";
export const EXPORT_VERSION = 1;

export interface JournalExport {
  app: typeof EXPORT_APP;
  version: number;
  exportedAt: string;
  entries: Entry[];
}
