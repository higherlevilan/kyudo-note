// A simple Leitner-box schedule for 詞彙閃卡, stored locally per glossary id.
// Box 1–5; 「記得」 moves a card up one box, 「不熟」 sends it back to box 1.
// A card in box n comes back after INTERVAL_DAYS[n - 1] days.

import { dayNumber, readJSON, useStored, writeJSON } from "./storage";

export const MAX_BOX = 5;
export const INTERVAL_DAYS = [0, 1, 3, 7, 14] as const;
/** box at or above this counts as 已熟 */
export const MASTERED_BOX = 4;

export interface CardState {
  /** box 1–5 */
  b: number;
  /** day number (local) when the card is due again */
  d: number;
}

export type CardMap = Readonly<Record<string, CardState>>;

const KEY = "cards";
const EMPTY: CardMap = {};

export function parseCards(v: unknown): CardMap {
  if (!v || typeof v !== "object" || Array.isArray(v)) return EMPTY;
  const out: Record<string, CardState> = {};
  for (const [id, raw] of Object.entries(v as Record<string, unknown>)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const b = typeof r.b === "number" ? Math.min(MAX_BOX, Math.max(1, Math.round(r.b))) : 0;
    const d = typeof r.d === "number" && Number.isFinite(r.d) ? Math.round(r.d) : 0;
    if (b) out[id] = { b, d };
  }
  return out;
}

export function useCards(): CardMap {
  return useStored(KEY, parseCards, EMPTY);
}

export function grade(id: string, remembered: boolean): CardState {
  const all = readJSON(KEY, parseCards);
  const cur = all[id];
  const b = remembered ? Math.min(MAX_BOX, (cur?.b ?? 1) + 1) : 1;
  const next = { b, d: dayNumber() + INTERVAL_DAYS[b - 1] };
  writeJSON(KEY, { ...all, [id]: next });
  return next;
}

export function resetCards(ids: readonly string[]) {
  const all = { ...readJSON(KEY, parseCards) };
  for (const id of ids) delete all[id];
  writeJSON(KEY, all);
}

export type CardStatus = "new" | "learning" | "mastered";

export function statusOf(s: CardState | undefined): CardStatus {
  if (!s) return "new";
  return s.b >= MASTERED_BOX ? "mastered" : "learning";
}

/**
 * Build a session deck: cards that are due (lowest box first), then new cards in their
 * original order (the glossary starts with the basics). When nothing is due and every
 * card has been seen, `ahead` lets the learner review the soonest-due cards early.
 */
export function buildDeck(ids: readonly string[], cards: CardMap, size: number, today: number, ahead = false): string[] {
  const seen = ids.filter((id) => cards[id]);
  const due = seen.filter((id) => cards[id].d <= today).sort((a, b) => cards[a].b - cards[b].b || cards[a].d - cards[b].d);
  const fresh = ids.filter((id) => !cards[id]);
  let deck = [...due, ...fresh].slice(0, size);
  if (!deck.length && ahead) deck = seen.slice().sort((a, b) => cards[a].d - cards[b].d || cards[a].b - cards[b].b).slice(0, size);
  return deck;
}
