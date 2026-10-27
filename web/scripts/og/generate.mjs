#!/usr/bin/env node
// Generate the site's share images and icons from code, with the 霞的 target motif.
//
//   node scripts/og/generate.mjs
//
// Outputs (commit them; the Next.js build never runs this script, so deploys need no network):
//   public/og/<key>.png          1200×630 Open Graph / Twitter card per section (see SECTIONS)
//   public/og/icon-192.png       web app manifest icons
//   public/og/icon-512.png
//   public/og/icon-maskable-512.png
//   src/app/icon.svg             favicon (vector)
//   src/app/favicon.ico          favicon fallback (16/32/48 px, PNG-in-ICO)
//   src/app/apple-icon.png       180×180 apple-touch-icon
//
// Rendering uses the satori + resvg engine bundled with Next.js (next/dist/compiled/@vercel/og), so no
// extra dependency is needed. CJK text needs real font files: the script downloads *subsets* of Noto Sans TC
// (400/700) and Noto Serif JP (600) from the Google Fonts CSS2 API containing only the glyphs used below,
// so it needs network access when you run it (not at build time).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const out = (p) => resolve(root, p);

// Palette: src/app/globals.css (light) tokens.
const C = {
  paper: "#f6f1e7",
  surface: "#fffbf3",
  ink: "#2a2520",
  muted: "#6d6357",
  line: "#ddd1bd",
  wood: "#8a5a2e",
  vermilion: "#b4442b",
  // Kasumi.tsx ring colours
  black: "#1f1b17",
  white: "#fbf8f2",
};

const SITE_NAME = "弓道學習筆記";
const SITE_LATIN = "Kyudo Note";
const SITE_HOST = "higherlevilan.github.io/kyudo-note";

// Keep keys in sync with OG_IMAGES in src/lib/seo.ts.
const SECTIONS = [
  { key: "home", title: "弓道學習筆記", ja: "きゅうどう", desc: "繁體中文弓道學習路線：走進道場、禮法、射法八節、射癖、弓具與文化。" },
  { key: "guide", title: "走進道場", ja: "はじめに", desc: "第一次去道場、在台灣哪裡學、練習進程、安全、費用與審查。" },
  { key: "shaho", title: "射法八節", ja: "しゃほうはっせつ", desc: "足踏み到残心的八個步驟，每一節分入門與深入兩層。" },
  { key: "shaguse", title: "射癖與矢所", ja: "しゃぐせ・やどころ", desc: "常見射癖與矢所的樣子、可能成因與修正方向，請與指導者一起確認。" },
  { key: "etiquette", title: "禮法與體配", ja: "体配", desc: "基本姿勢與動作、坐射與立射流程、矢取り、道場禮儀。" },
  { key: "equipment", title: "弓具", ja: "きゅうぐ", desc: "弓、矢、弽、弦、服裝與保養，附矢尺計算與預算試算。" },
  { key: "culture", title: "文化與哲學", ja: "射の心", desc: "歷史年表、流派系譜、射義與真善美、弓與禪的真相。" },
  { key: "glossary", title: "日文詞彙庫", ja: "用語", desc: "弓道術語的漢字、假名、羅馬拼音與中文解釋，都能搜尋。" },
  { key: "faq", title: "問題研究中心", ja: "問答", desc: "各單元的常見問題集中整理，每一題都附資料來源。" },
  { key: "practice", title: "練習場", ja: "稽古の合間に", desc: "八節排序、詞彙閃卡、迷思是非題、體配情境題與初段學科練習。" },
  { key: "formcheck", title: "射形分析（實驗）", ja: "射形を見る", desc: "用手機鏡頭在瀏覽器裡估計姿勢，影像不離開你的裝置；結果僅供參考。" },
  { key: "journal", title: "稽古帳", ja: "けいこちょう", desc: "記錄每次練習的射數、的中與射癖，資料只存在你的瀏覽器。" },
];

// 霞的 proportions from src/components/home/Kasumi.tsx (ANKF 競技規則 第26条, radii in cm).
const RINGS = [
  [18, C.black],
  [14.7, C.white],
  [11.7, C.black],
  [10.2, C.white],
  [7.2, C.black],
  [3.6, C.white],
];

/** The target as an SVG string. `rim` is the wood rim radius (Kasumi.tsx uses 18.6); `bg` fills the square. */
function kasumiSvg({ size, rim = 18.6, pad = 0.4, bg } = {}) {
  const half = rim + pad;
  const circles = RINGS.map(([r, fill]) => `<circle r="${r}" fill="${fill}"/>`).join("");
  const back = bg ? `<rect x="${-half}" y="${-half}" width="${half * 2}" height="${half * 2}" fill="${bg}"/>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-half} ${-half} ${half * 2} ${half * 2}"` +
    (size ? ` width="${size}" height="${size}"` : "") +
    `>${back}<circle r="${rim}" fill="${C.wood}"/>${circles}</svg>`
  );
}

const svgDataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

// ---------- fonts (Google Fonts CSS2 API subsets, TrueType) ----------

async function fetchFont(family, weight, text) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  // No browser User-Agent → the API answers with a TrueType src (satori can't read woff2).
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!src) throw new Error(`No TrueType font in Google Fonts response for ${family} ${weight}:\n${css}`);
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Font download failed (${res.status}) for ${family} ${weight}`);
  return res.arrayBuffer();
}

const uniq = (s) => [...new Set(s)].join("");

// ---------- OG card ----------

function card({ title, ja, desc }) {
  const target = 470;
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: C.paper,
        fontFamily: "Noto Sans TC",
        color: C.ink,
      },
    },
    // Inset hairline frame, like a mounted print.
    h("div", {
      style: { position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: `2px solid ${C.line}`, borderRadius: 18 },
    }),
    // 霞的, bleeding off the right edge slightly.
    h("img", {
      src: svgDataUri(kasumiSvg()),
      width: target,
      height: target,
      style: { position: "absolute", right: 70, top: (630 - target) / 2 },
    }),
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "84px 0 76px 96px",
          width: 640,
          height: "100%",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h(
          "div",
          { style: { display: "flex", fontFamily: "Noto Serif JP", fontSize: 30, color: C.wood, letterSpacing: 6 } },
          ja,
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              marginTop: 14,
              // Title column is ~540 px wide: shrink long titles so they stay on one line.
              fontSize: Math.min(104, Math.floor(540 / (title.length * 1.05))),
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: 4,
            },
          },
          title,
        ),
        h("div", { style: { display: "flex", width: 72, height: 6, marginTop: 30, background: C.vermilion, borderRadius: 3 } }),
        h("div", { style: { display: "flex", marginTop: 30, fontSize: 32, lineHeight: 1.55, color: C.muted } }, desc),
      ),
      h(
        "div",
        { style: { display: "flex", alignItems: "baseline" } },
        h("div", { style: { display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: 2 } }, SITE_NAME),
        h(
          "div",
          { style: { display: "flex", marginLeft: 16, fontSize: 22, color: C.muted, letterSpacing: 5, textTransform: "uppercase" } },
          SITE_LATIN,
        ),
      ),
    ),
    h(
      "div",
      { style: { position: "absolute", right: 64, bottom: 44, display: "flex", fontSize: 20, color: C.muted, letterSpacing: 1 } },
      SITE_HOST,
    ),
  );
}

// ---------- icons ----------

/** Square icon: the target on a paper ground. `scale` is the target diameter as a fraction of the side. */
function iconSquare(side, scale) {
  const d = Math.round(side * scale);
  return h(
    "div",
    { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: C.paper } },
    h("img", { src: svgDataUri(kasumiSvg({ pad: 0 })), width: d, height: d }),
  );
}

/** Transparent icon: just the target, full bleed. */
function iconBare(side) {
  return h(
    "div",
    { style: { width: "100%", height: "100%", display: "flex" } },
    h("img", { src: svgDataUri(kasumiSvg({ pad: 0 })), width: side, height: side }),
  );
}

async function png(element, width, height, fonts) {
  const res = new ImageResponse(element, { width, height, fonts });
  return Buffer.from(await res.arrayBuffer());
}

/** Pack PNG images into a .ico (PNG-compressed entries are valid since Windows Vista and in all browsers). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

function write(path, data) {
  mkdirSync(dirname(out(path)), { recursive: true });
  writeFileSync(out(path), data);
  console.log(`  ${path} (${(data.length / 1024).toFixed(1)} KB)`);
}

// ---------- main ----------

const sansText = uniq(SECTIONS.map((s) => s.title + s.desc).join("") + SITE_NAME + SITE_LATIN + SITE_LATIN.toUpperCase() + SITE_HOST);
const serifText = uniq(SECTIONS.map((s) => s.ja).join(""));

console.log("Fetching font subsets…");
const [sans400, sans700, serif600] = await Promise.all([
  fetchFont("Noto Sans TC", 400, sansText),
  fetchFont("Noto Sans TC", 700, sansText),
  fetchFont("Noto Serif JP", 600, serifText),
]);
const fonts = [
  { name: "Noto Sans TC", data: sans400, weight: 400, style: "normal" },
  { name: "Noto Sans TC", data: sans700, weight: 700, style: "normal" },
  { name: "Noto Serif JP", data: serif600, weight: 600, style: "normal" },
];

console.log("Open Graph images:");
for (const s of SECTIONS) write(`public/og/${s.key}.png`, await png(card(s), 1200, 630, fonts));

console.log("Icons:");
write("src/app/icon.svg", Buffer.from(kasumiSvg({ pad: 0 }) + "\n"));
write(
  "src/app/favicon.ico",
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(iconBare(size), size, size, fonts) })))),
);
write("src/app/apple-icon.png", await png(iconSquare(180, 0.78), 180, 180, fonts));
write("public/og/icon-192.png", await png(iconSquare(192, 0.84), 192, 192, fonts));
write("public/og/icon-512.png", await png(iconSquare(512, 0.84), 512, 512, fonts));
// Maskable: keep the target inside the 80 % safe zone.
write("public/og/icon-maskable-512.png", await png(iconSquare(512, 0.66), 512, 512, fonts));
