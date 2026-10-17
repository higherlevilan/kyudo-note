export interface GlossaryEntry {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  romaji_plain: string;
  zh: string;
  category: string;
  source: string[];
  disputed: boolean;
  note: string;
}

export const SOURCE_LABEL: Record<string, string> = {
  A: "全弓連〈弓道用語辞典〉",
  K: "全弓連官網其他頁面",
  R: "全弓連《審査規程》或《弓道競技規則》",
  B: "日本武道協議會《少年少女武道指導書 弓道》",
  "—": "一般通用讀法（未逐條查一手出處）",
};

export const TERMINOLOGY_URL = "https://www.kyudo.jp/howto/terminology.html";

/** Katakana → hiragana so either script matches. */
export function toHiragana(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

const MACRONS: Record<string, string> = { ā: "a", ē: "e", ī: "i", ō: "o", ū: "u", â: "a", ê: "e", î: "i", ô: "o", û: "u" };

/**
 * Romaji folded for matching: lower case, no macrons, no spaces / hyphens / apostrophes,
 * and long vowels written out (ou, oo, uu, oh) collapsed so "dōzukuri", "dozukuri" and
 * "douzukuri" all match.
 */
export function foldRomaji(s: string): string {
  return s
    .toLowerCase()
    .replace(/[āēīōūâêîôû]/g, (c) => MACRONS[c])
    .replace(/[\s\-'’・/／()（）]/g, "")
    .replace(/ou/g, "o")
    .replace(/oo/g, "o")
    .replace(/uu/g, "u")
    .replace(/oh(?=[^aeiou]|$)/g, "o");
}

/** Text folded for kanji / kana / 中文 matching. */
export function foldText(s: string): string {
  return toHiragana(s.toLowerCase()).replace(/[\s・／/（）()「」〈〉、，。]/g, "");
}

export interface IndexedEntry extends GlossaryEntry {
  textKey: string;
  romajiKey: string;
}

export function indexEntries(entries: GlossaryEntry[]): IndexedEntry[] {
  return entries.map((e) => ({
    ...e,
    textKey: foldText(`${e.kanji}|${e.kana}|${e.zh}|${e.note}`),
    romajiKey: foldRomaji(`${e.romaji}|${e.romaji_plain}`.replace(/\|/g, " ")),
  }));
}

export function matches(e: IndexedEntry, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  // Every whitespace-separated term must match somewhere.
  return q.split(/\s+/).every((term) => {
    const t = foldText(term);
    if (t && e.textKey.includes(t)) return true;
    const r = foldRomaji(term);
    return r.length > 0 && /^[a-z]+$/.test(r) && e.romajiKey.includes(r);
  });
}
