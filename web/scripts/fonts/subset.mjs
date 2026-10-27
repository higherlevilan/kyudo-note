#!/usr/bin/env node
// Build the subset Japanese serif web font used for :lang(ja) text.
//
//   npm run fonts
//
// Outputs (commit them; next/font/local reads them at build time, so the Next.js build needs no network):
//   src/app/fonts/NotoSerifJP-400.woff2
//   src/app/fonts/NotoSerifJP-600.woff2
//
// The glyph set is every character in src/**/*.{ts,tsx,json} (content, glossary, UI strings) plus printable
// ASCII, CJK punctuation, kana and full-width forms, so text that is only assembled at runtime (glossary search,
// journal entries) is still covered. Re-run this script after adding content with new characters; a glyph that
// is missing falls back to the system Mincho in the --font-jp stack (globals.css), it does not break.
//
// Source fonts: the static Noto Serif JP TrueType instances (SIL OFL 1.1) from the Google Fonts CSS2 API, i.e.
// the same source scripts/og/generate.mjs uses. They are cached in node_modules/.cache/kyudo-fonts/, so only the
// first run needs network. Subsetting and WOFF2 compression use the subset-font package (harfbuzz + woff2, wasm).

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cacheDir = resolve(root, "node_modules/.cache/kyudo-fonts");
const outDir = resolve(root, "src/app/fonts");

const FAMILY = "Noto Serif JP";
const WEIGHTS = [400, 600];

// ---------- glyph set ----------

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx?|json)$/.test(name)) files.push(p);
  }
  return files;
}

const range = (from, to) => String.fromCodePoint(...Array.from({ length: to - from + 1 }, (_, i) => from + i));

const chars = new Set(
  range(0x20, 0x7e) + // ASCII
    range(0x3000, 0x303f) + // CJK symbols and punctuation (、。「」・〜 々 …)
    range(0x3041, 0x309f) + // hiragana
    range(0x30a0, 0x30ff) + // katakana
    range(0x31f0, 0x31ff) + // katakana phonetic extensions
    range(0xff01, 0xff5e), // full-width ASCII forms (（）：～ …)
);
const files = walk(resolve(root, "src"));
for (const f of files) for (const ch of readFileSync(f, "utf8")) if (ch.codePointAt(0) >= 0x20) chars.add(ch);
const text = [...chars].join("");

// ---------- source fonts ----------

async function sourceFont(weight) {
  const cached = join(cacheDir, `NotoSerifJP-${weight}.ttf`);
  if (existsSync(cached)) return readFileSync(cached);
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(FAMILY)}:wght@${weight}`;
  // No browser User-Agent → the API answers with one complete static TrueType file per weight.
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!src) throw new Error(`No TrueType font in Google Fonts response for ${FAMILY} ${weight}:\n${css}`);
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Font download failed (${res.status}) for ${FAMILY} ${weight}`);
  const data = Buffer.from(await res.arrayBuffer());
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cached, data);
  return data;
}

// ---------- main ----------

console.log(`${files.length} source files → ${chars.size} characters`);
mkdirSync(outDir, { recursive: true });
for (const weight of WEIGHTS) {
  const subset = await subsetFont(await sourceFont(weight), text, { targetFormat: "woff2" });
  const path = join(outDir, `NotoSerifJP-${weight}.woff2`);
  writeFileSync(path, subset);
  console.log(`  ${relative(root, path)} (${(subset.length / 1024).toFixed(1)} KB)`);
}
