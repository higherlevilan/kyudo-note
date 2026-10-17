// Server component: filters the glossary at build time and ships only the four fields the
// card needs, instead of the whole glossary.json, to the client.

import glossary from "@/content/glossary.json";
import type { GlossaryEntry } from "@/lib/glossary";
import WordOfDayClient, { type DailyWord } from "./WordOfDayClient";

const words: DailyWord[] = (glossary as GlossaryEntry[])
  .filter((e) => !e.disputed && e.category !== "思想與歷史")
  .map(({ kanji, kana, romaji, zh }) => ({ kanji, kana, romaji, zh }));

export default function WordOfDay() {
  return <WordOfDayClient words={words} />;
}
