// Local-calendar date helpers. Entries store plain "YYYY-MM-DD" days; arithmetic is done in UTC
// on those day numbers so DST and time-zone offsets never shift a day.

export const DEFAULT_TZ = "Asia/Taipei";

const DAY_MS = 86_400_000;
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The viewer's time zone, falling back to Asia/Taipei. */
export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TZ;
  } catch {
    return DEFAULT_TZ;
  }
}

/** Today's calendar day in the given (default: viewer's) time zone. */
export function todayISO(now: Date = new Date(), tz: string = localTimeZone()): string {
  try {
    // en-CA formats as YYYY-MM-DD.
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  } catch {
    return new Intl.DateTimeFormat("en-CA", { timeZone: DEFAULT_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  }
}

export function isValidDay(s: unknown): s is string {
  if (typeof s !== "string") return false;
  const m = ISO_DAY.exec(s);
  if (!m) return false;
  const y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  if (y < 1900 || y > 2200 || mo < 1 || mo > 12 || d < 1) return false;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/** Day number (days since 1970-01-01) of a YYYY-MM-DD string. */
export function dayNum(s: string): number {
  const m = ISO_DAY.exec(s);
  if (!m) return NaN;
  return Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY_MS);
}

export function fromDayNum(n: number): string {
  const d = new Date(n * DAY_MS);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function addDays(s: string, n: number): string {
  return fromDayNum(dayNum(s) + n);
}

export function daysBetween(a: string, b: string): number {
  return dayNum(b) - dayNum(a);
}

/** 0 = Monday … 6 = Sunday. */
export function weekday(s: string): number {
  // 1970-01-01 was a Thursday (index 3 when Monday = 0).
  return (((dayNum(s) + 3) % 7) + 7) % 7;
}

/** Monday of the week containing `s`. */
export function weekStart(s: string): string {
  return addDays(s, -weekday(s));
}

export const monthKey = (s: string) => s.slice(0, 7);
export const yearKey = (s: string) => s.slice(0, 4);

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

/** 「10月18日（六）」 */
export function formatDay(s: string, withYear = false): string {
  if (!isValidDay(s)) return s;
  const [y, m, d] = s.split("-").map(Number);
  return `${withYear ? `${y}年` : ""}${m}月${d}日（${WEEKDAYS[weekday(s)]}）`;
}

export function formatMonth(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return `${y}年${m}月`;
}

export function shortDay(s: string): string {
  const [, m, d] = s.split("-").map(Number);
  return `${m}/${d}`;
}

/** Local clock time "HH:MM" for an ISO timestamp. */
export function formatTime(iso: string, tz: string = localTimeZone()): string {
  try {
    return new Intl.DateTimeFormat("zh-TW", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
  } catch {
    return "";
  }
}
