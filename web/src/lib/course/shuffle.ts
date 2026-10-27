// Deterministic option order for the 過關測驗. Each question's options are shuffled with a small
// PRNG seeded by the question id, so the order is the same on the server, in the prerendered
// HTML and on every client, yet the correct option is not always in the same slot.
// Pure functions, no randomness: safe to call during render on server or client.

import type { ChoiceQuestion } from "@/lib/practice/types";

/** FNV-1a 32-bit hash of a string (UTF-16 code units). */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: tiny seeded PRNG returning floats in [0, 1). */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A permutation of 0..n-1 fixed by `seed`: display slot k shows source option order[k]. */
export function seededOrder(n: number, seed: string): number[] {
  const rand = mulberry32(hash(seed));
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** The question with its options in display order and `answer` remapped to match. */
export function shuffleQuestion(q: ChoiceQuestion): ChoiceQuestion {
  const order = seededOrder(q.options.length, q.id);
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
}
