// 射法八節 practice data, derived from src/content/shaho.ts (SECTIONS, CUES) — no new facts.

import { CUES, SECTIONS } from "@/content/shaho";
import { SOURCES } from "@/content/sources";
import { sample, sampleBalanced, shuffle } from "@/lib/practice/random";
import type { ChoiceQuestion, Source } from "@/lib/practice/types";

export interface OrderCard {
  id: string;
  no: number;
  term: string;
  kana: string;
  zh: string;
  /** one-line explanation: the first sentence of the section intro */
  line: string;
  src: Source[];
}

/** First sentence of the intro, without the leading 「第N節，」. */
function firstLine(intro: string): string {
  const s = intro.replace(/^第[一二三四五六七八]節，/, "");
  const i = s.indexOf("。");
  return i > 0 ? s.slice(0, i + 1) : s;
}

export const ORDER_CARDS: OrderCard[] = SECTIONS.filter((s) => s.no != null)
  .sort((a, b) => (a.no ?? 0) - (b.no ?? 0))
  .map((s) => ({
    id: s.id,
    no: s.no ?? 0,
    term: s.term,
    kana: s.kana,
    zh: s.zh,
    line: firstLine(s.intro[0] ?? ""),
    src: s.introSrc.map((k) => SOURCES[k]),
  }));

export const SHAHO_SOURCES: Source[] = [SOURCES.syaho, SOURCES.terminology];

/**
 * Cues that fit more than one 節 (e.g. "shoulders relaxed") are left out of 「這是哪一節？」
 * so every question has exactly one fair answer. Keyed by segment id → cue index.
 */
const AMBIGUOUS: Record<string, number[]> = {
  yugamae: [2],
  uchiokoshi: [2],
  daisan: [2],
  hanare: [1],
  zanshin: [1],
};

/** Motion segments that belong to a 節 (大三 is part of 引分け). */
const SEGMENT_TO_SECTION: Record<string, string> = { daisan: "hikiwake" };

export interface CueItem {
  id: string;
  sectionId: string;
  cue: string;
}

export const CUE_ITEMS: CueItem[] = Object.entries(CUES).flatMap(([seg, cues]) => {
  const sectionId = SEGMENT_TO_SECTION[seg] ?? seg;
  if (!ORDER_CARDS.some((c) => c.id === sectionId)) return [];
  return cues.filter((_, i) => !AMBIGUOUS[seg]?.includes(i)).map((cue, i) => ({ id: `${seg}-${i}`, sectionId, cue }));
});

/** Build a 「這是哪一節？」 session: each cue with the right 節 and 3 other 節 as choices. */
export function buildWhichSession(n: number): ChoiceQuestion[] {
  return sampleBalanced(CUE_ITEMS, n, (c) => c.sectionId, 1).map((item) => {
    const correct = ORDER_CARDS.find((c) => c.id === item.sectionId) as OrderCard;
    const shown = shuffle([correct, ...sample(ORDER_CARDS.filter((c) => c.id !== correct.id), 3)]);
    return {
      id: item.id,
      topic: "這是哪一節？",
      prompt: "這句提醒說的是哪一節？",
      quote: item.cue,
      options: shown.map((c) => ({ text: c.term, sub: `第 ${c.no} 節・${c.zh}`, ja: true })),
      answer: shown.indexOf(correct),
      explain: `第 ${correct.no} 節「${correct.term}」：${correct.line}`,
      tag: "note" as const,
      src: correct.src,
      more: { href: `/shaho/#${correct.id}`, label: `看「${correct.term}」的說明` },
    };
  });
}
