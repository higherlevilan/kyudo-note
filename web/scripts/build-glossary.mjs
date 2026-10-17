#!/usr/bin/env node
// Convert docs/research/05-glossary.md (markdown tables) into src/content/glossary.json.
//
//   node scripts/build-glossary.mjs [path/to/05-glossary.md] [path/to/glossary.json]
//
// Section headings ("## 1. 射法…") become categories. Numbered rows (# column) get ids
// "001"…; the supplementary 思想 table (no # column) gets "s01"…. The 出典 cell is split
// into source codes (A/K/R/B/—) and a ⚠️ note.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const input = resolve(process.argv[2] ?? resolve(here, "../../docs/research/05-glossary.md"));
const output = resolve(process.argv[3] ?? resolve(here, "../src/content/glossary.json"));

// Section number → category shown on the site.
const CATEGORIES = {
  1: "射法",
  2: "體配",
  3: "弓具",
  4: "道場",
  5: "審查與競技",
  6: "思想與歷史",
};

const MACRONS = { ā: "a", ē: "e", ī: "i", ō: "o", ū: "u", Ā: "A", Ē: "E", Ī: "I", Ō: "O", Ū: "U", â: "a", ô: "o", û: "u" };
const plain = (s) => s.replace(/[āēīōūĀĒĪŌŪâôû]/g, (c) => MACRONS[c]);
const clean = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").trim();

function parseSource(cell) {
  const [codesPart, ...rest] = cell.split("⚠️");
  const codes = codesPart
    .split(/[,，、]/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => (c === "—" || c === "-" ? "—" : c));
  const disputed = cell.includes("⚠️");
  const note = rest.join("⚠️").trim();
  return { codes, disputed, note };
}

const lines = readFileSync(input, "utf8").split("\n");
const entries = [];
let section = 0;
let supplementary = 0;

for (const line of lines) {
  const h = line.match(/^##\s+(\d+)\./);
  if (h) {
    section = Number(h[1]);
    continue;
  }
  if (/^##\s/.test(line)) {
    section = 0; // e.g. "## 7. 轉成網站資料時的建議" is matched above; other headings end tables
    continue;
  }
  if (!CATEGORIES[section] || !line.startsWith("|")) continue;
  const cells = line.split("|").slice(1, -1).map((c) => c.trim());
  if (cells.every((c) => /^-*$/.test(c))) continue; // separator row

  let num, kanji, kana, romaji, zh, src;
  if (cells.length === 6 && /^\d+$/.test(cells[0])) {
    [num, kanji, kana, romaji, zh, src] = cells;
  } else if (cells.length === 5 && section === 6 && cells[0] !== "漢字") {
    [kanji, kana, romaji, zh, src] = cells;
  } else {
    continue; // header rows
  }

  const { codes, disputed, note } = parseSource(src);
  const id = num ? num.padStart(3, "0") : `s${String(++supplementary).padStart(2, "0")}`;
  const r = clean(romaji);
  entries.push({
    id,
    kanji: clean(kanji),
    kana: clean(kana),
    romaji: r,
    romaji_plain: plain(r),
    zh: clean(zh),
    category: CATEGORIES[section],
    source: codes,
    disputed,
    note: disputed && !note ? "讀音或定義各來源不同，或尚未確認" : note,
  });
}

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify(entries, null, 2) + "\n");

const byCat = entries.reduce((m, e) => ((m[e.category] = (m[e.category] ?? 0) + 1), m), {});
console.log(`wrote ${output}: ${entries.length} entries`, byCat);
