// 初段學科練習: the public 無指定・初段 prompt types (as summarised on the 入門指南 page) and
// 「可以提到的重點」 built from the 射法八節 content. Real grading is by the examiners.

import { ANKF, TAIWAN } from "@/content/common-sources";
import { IKYF_X, SHINSA_X } from "@/content/guide/sources";
import { CUES, SECTIONS } from "@/content/shaho";
import { SOURCES } from "@/content/sources";
import type { Source } from "@/lib/practice/types";

export interface WrittenPrompt {
  id: "order" | "explain" | "motive";
  group: "A 群" | "B 群";
  points: string;
  prompt: string;
  hint: string;
}

export const WRITTEN_PROMPTS: WrittenPrompt[] = [
  {
    id: "order",
    group: "A 群",
    points: "25 分",
    prompt: "寫出射法八節的順序。",
    hint: "用日文漢字（例如「足踏み」）寫，也可以加上讀音或中文。",
  },
  {
    id: "explain",
    group: "A 群",
    points: "25 分",
    prompt: "選一節，說明它的要點。",
    hint: "縣連會從題庫指定實際的節，例如神奈川 2026 年度初段 A 群考「胴造り」。",
  },
  {
    id: "motive",
    group: "B 群",
    points: "50 分",
    prompt: "開始學弓道的動機。",
    hint: "心得題，沒有標準答案。寫你自己的經驗。",
  },
];

/** Facts about the 學科 itself, quoted from the 入門指南 content. */
export const WRITTEN_FACTS: { text: string; src: Source[] }[] = [
  { text: "無指定、初段的學科是 A 群 2 題（各 25 分）加 B 群 1 題（50 分），滿分 100；合格要 60 分以上，並且行射得票 5 成以上。", src: [ANKF.written2026, ANKF.probationRules] },
  { text: "全弓連每年公開地方審查的學科題目；實際考哪一題由縣連從題庫指定，很多縣連改成報名時先交報告。", src: [ANKF.written2026, SHINSA_X.kanagawa] },
  { text: "台灣：臺灣弓道協會說明每次學科從 A 表、B 表各選一題作答；協會頁面上的題庫還是 2021 年版，請以協會最新公告為準。", src: [TAIWAN.shinsa] },
];

export interface OrderTerm {
  id: string;
  no: number;
  term: string;
  kana: string;
  zh: string;
  /** spellings to look for in the learner's answer (kanji stems, kana, traditional forms) */
  match: string[];
}

/** Kanji stems without okurigana, plus common alternative spellings, for the rough order check. */
const EXTRA_MATCH: Record<string, string[]> = {
  ashibumi: ["足踏", "踏足"],
  dozukuri: ["胴造", "胴作"],
  yugamae: ["弓構", "弓搆"],
  uchiokoshi: ["打起", "打越"],
  hikiwake: ["引分"],
  kai: ["会", "會"],
  hanare: ["離"],
  zanshin: ["残心", "殘心", "残身", "殘身"],
};

export const ORDER_TERMS: OrderTerm[] = SECTIONS.filter((s) => s.no != null).map((s) => ({
  id: s.id,
  no: s.no ?? 0,
  term: s.term,
  kana: s.kana,
  zh: s.zh,
  match: [s.term, s.kana, ...(EXTRA_MATCH[s.id] ?? [])],
}));

export interface OrderCheck {
  found: { id: string; term: string; at: number }[];
  missing: string[];
  inOrder: boolean;
}

/**
 * Rough self-check for the 順序 answer: where each 節 first appears in the text.
 * 「会」「離」 are single characters, so the check looks for them only after the
 * previous 節 was found. It is a helper, not grading.
 */
export function checkOrder(text: string): OrderCheck {
  const found: OrderCheck["found"] = [];
  const missing: string[] = [];
  let from = 0;
  let inOrder = true;
  for (const t of ORDER_TERMS) {
    const hits = (start: number) =>
      t.match.map((m) => text.indexOf(m, start)).filter((i) => i >= 0);
    let at = Math.min(...hits(from));
    if (!Number.isFinite(at)) {
      // Present but before the previous 節 → out of order.
      const anywhere = Math.min(...hits(0));
      if (Number.isFinite(anywhere)) {
        inOrder = false;
        at = anywhere;
      }
    }
    if (Number.isFinite(at)) {
      found.push({ id: t.id, term: t.term, at });
      if (at >= from) from = at + 1;
    } else missing.push(t.term);
  }
  return { found, missing, inOrder: inOrder && missing.length === 0 };
}

export interface ExplainPoints {
  id: string;
  term: string;
  kana: string;
  zh: string;
  no: number;
  intro: string[];
  cues: string[];
  src: Source[];
}

export const EXPLAIN_POINTS: ExplainPoints[] = SECTIONS.filter((s) => s.no != null).map((s) => ({
  id: s.id,
  term: s.term,
  kana: s.kana,
  zh: s.zh,
  no: s.no ?? 0,
  intro: s.intro,
  cues: CUES[s.id] ?? [],
  src: s.introSrc.map((k) => SOURCES[k]),
}));

/** Writing tips for the 心得題 (本站建議, not an official rubric). */
export const MOTIVE_TIPS: string[] = [
  "沒有標準答案，審查員看的是你自己的經驗與想法，用自己的話寫。",
  "可以寫：怎麼認識弓道、第一次練習或第一次去道場的感受、練習中注意到的改變、接下來想努力的地方。",
  "如果提到弓道的理念，例如全弓連的「正射必中」，用自己的理解說明，不要只抄口號。",
  "依考場規定的語言作答；海外受審原則上以日文或英文作答。",
];

export const MOTIVE_SRC: Source[] = [ANKF.mind, ANKF.written2026, IKYF_X.shinsa];
