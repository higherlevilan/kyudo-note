"use client";

// 和弓各部位：張弦後的側面圖。縱向 1 cm = 2.6 單位，弓長以並寸 221 cm 計；弓的厚度放大 1.5 倍以便看清層次。
// 握在從本弭算起約 1/3 處（競技規則第 20 條），弓把約 15 cm（指導書）。弓身曲線是示意，不是某一把弓的實測。

import { useState } from "react";
import { ANKF, BUDOKAN } from "@/content/common-sources";
import FigureFrame from "./FigureFrame";
import { monotone, r1, range } from "./geom";

export const L = 221; // 並寸 cm
const S = 2.6; // svg units per cm
const TOP = 26;
const XS = 200; // string x
export const GRIP_C = L / 3; // 握 at about 1/3 from 本弭
const Y = (cm: number) => r1(TOP + (L - cm) * S);
const X = (d: number) => r1(XS - d * S);

/** distance (cm) from the string to the belly (内竹 face), by height above the 本弭 tip */
export const belly = monotone([
  [0, 0.5],
  [3, 0],
  [8, 1.0],
  [15, 2.9],
  [30, 7.0],
  [48, 11.4],
  [66, 14.6],
  [GRIP_C, 15.0],
  [81, 14.8],
  [95, 14.0],
  [120, 12.2],
  [150, 9.0],
  [172, 6.0],
  [186, 3.8],
  [197, 2.4],
  [206, 1.5],
  [212, 1.1],
  [217, 0],
  [221, 0.5],
]);
/** limb thickness (cm), exaggerated ×1.5 when drawn */
export const thick = monotone([
  [0, 1.2],
  [20, 1.9],
  [GRIP_C, 3.0],
  [130, 2.4],
  [200, 1.6],
  [221, 1.1],
]);
const T = (cm: number) => thick(cm) * 1.5;

/** Closed band between two offsets (cm from the string, as fractions of the limb thickness) over y1..y2 cm. */
function band(y1: number, y2: number, f1: number, f2: number, pad = 0): string {
  const ys = range(y1, y2, 0.5);
  const a = ys.map((y) => `${X(belly(y) + T(y) * f1 - pad)},${Y(y)}`);
  const b = ys.reverse().map((y) => `${X(belly(y) + T(y) * f2 + pad)},${Y(y)}`);
  return `M${a.join("L")}L${b.join("L")}Z`;
}

const BOW = band(0, L, 0, 1);
const LAYERS = {
  uchi: band(0.5, L - 0.5, 0, 1 / 3),
  soba: band(0.5, L - 0.5, 1 / 3, 2 / 3),
  to: band(0.5, L - 0.5, 2 / 3, 1),
};
const GRIP = band(66, 81, 0, 1, 0.45);
const YAZURI = band(81, 93, 0, 1, 0.25);
/** 関板: a thin plate glued on the belly near each tip */
const sekiita = (y1: number, y2: number) => {
  const ys = range(y1, y2, 0.5);
  const a = ys.map((y) => `${X(belly(y) - 0.45)},${Y(y)}`);
  const b = ys.reverse().map((y) => `${X(belly(y) + 0.05)},${Y(y)}`);
  return `M${a.join("L")}L${b.join("L")}Z`;
};
const SEKI_UP = sekiita(207, 215);
const SEKI_DN = sekiita(5, 11);

export type PartId = "urahazu" | "uwaseki" | "himezori" | "toriuchi" | "yazuri" | "togashira" | "nigiri" | "shimoseki" | "motohazu" | "tsuru" | "naka" | "tsuruwa";

interface Part {
  id: PartId;
  name: string;
  kana: string;
  text: string;
  side: "L" | "R";
  /** label baseline y (svg units) */
  ly: number;
  /** anchor point the leader points at */
  at: [number, number];
  /** highlight shapes */
  hl: string[];
}

const backAt = (cm: number): [number, number] => [X(belly(cm) + T(cm)), Y(cm)];
const bellyAt = (cm: number): [number, number] => [X(belly(cm)), Y(cm)];

export const N_LO = 78;
export const N_HI = 86;

export const PARTS: Part[] = [
  { id: "urahazu", name: "末弭（上弭）", kana: "うらはず（うわはず）", text: "弓的上端，掛弦輪的地方。", side: "L", ly: 36, at: backAt(219.5), hl: [band(216, L, 0, 1, 0.3)] },
  { id: "uwaseki", name: "上関板", kana: "うわせきいた", text: "黏在弓上端內竹側（靠弦那一面）的木片。指導書：調整弦長，讓上関板不碰到弦。", side: "R", ly: 60, at: bellyAt(211), hl: [SEKI_UP] },
  { id: "himezori", name: "姫反り", kana: "ひめぞり", text: "上切詰籐以下、彎曲變緩的一段。", side: "L", ly: 92, at: backAt(197), hl: [band(188, 205, 0, 1, 0.3)] },
  { id: "toriuchi", name: "鳥打", kana: "とりうち", text: "姫反り下方的部位。立射配合坐射時，右手扶在弓的鳥打附近（全弓連〈立射の作法〉）。", side: "L", ly: 131, at: backAt(182), hl: [band(177, 188, 0, 1, 0.3)] },
  { id: "yazuri", name: "矢摺籐", kana: "やずりどう", text: "纏在握把上方的籐，箭從這裡擦過。規則：從籐頭算起 6 cm 以上，上面不得有刻意的記號。", side: "L", ly: 358, at: backAt(89), hl: [band(81, 93, 0, 1, 0.5)] },
  { id: "togashira", name: "籐頭", kana: "とうがしら", text: "握把與矢摺籐交接的地方。", side: "L", ly: 386, at: backAt(81), hl: [band(80.4, 81.6, 0, 1, 1.2)] },
  { id: "nigiri", name: "握", kana: "にぎり", text: "握把。規則：約在從本弭（下端）算起 1/3 處，所以上半部約是下半部的 2 倍長。", side: "L", ly: 412, at: [X(belly(GRIP_C) + T(GRIP_C) + 0.45), Y(GRIP_C)], hl: [band(66, 81, 0, 1, 0.6)] },
  { id: "shimoseki", name: "下関板", kana: "しもせきいた", text: "黏在弓下端內竹側的木片。", side: "R", ly: 574, at: bellyAt(8), hl: [SEKI_DN] },
  { id: "motohazu", name: "本弭（下弭）", kana: "もとはず（しもはず）", text: "弓的下端，掛弦輪的地方。", side: "L", ly: 598, at: backAt(1.5), hl: [band(0, 4, 0, 1, 0.3)] },
  { id: "tsuru", name: "弦", kana: "つる", text: "規則只要求撚成一條，麻或合成材質都可以。並寸弓配並寸弦。", side: "R", ly: 240, at: [XS, Y(140)], hl: [`M${XS - 1.6},${Y(217)}H${XS + 1.6}V${Y(3)}H${XS - 1.6}Z`] },
  { id: "naka", name: "中仕掛け", kana: "なかじかけ", text: "弦上搭箭處纏麻補強的一段，箭筈就扣在這裡。", side: "R", ly: 392, at: [XS + 2, Y(83)], hl: [`M${XS - 3.5},${Y(N_HI + 1)}H${XS + 3.5}V${Y(N_LO - 1)}H${XS - 3.5}Z`] },
  { id: "tsuruwa", name: "弦輪", kana: "つるわ", text: "弦兩端掛在弭上的圈。用語辭典：上面的弦輪是紅色、下面是白色。", side: "R", ly: 38, at: [XS + 2, Y(217)], hl: [band(216.2, 217.8, -0.5, 1.4), band(2.2, 3.8, -0.5, 1.4)] },
];

const LAYER_INFO = [
  { id: "to", name: "外竹", kana: "とだけ", text: "張弦後弓外側（離弦較遠）的竹", ly: 206, at: 150, f: 5 / 6, cls: "fill-indigo" },
  { id: "soba", name: "側木", kana: "そばき", text: "夾在外竹與內竹兩側的木條，從側面看得到", ly: 232, at: 140, f: 1 / 2, cls: "fill-wood-soft" },
  { id: "uchi", name: "内竹", kana: "うちだけ", text: "靠弦那一側的竹，又稱前竹", ly: 258, at: 130, f: 1 / 6, cls: "fill-vermilion" },
] as const;

const LX = 122; // left labels end here
const RX = 212; // right labels start here

function Leader({ from, to, on }: { from: [number, number]; to: [number, number]; on: boolean }) {
  return (
    <g className={on ? "stroke-vermilion" : "stroke-muted"} strokeWidth={on ? 1.4 : 0.9} fill="none">
      <polyline points={`${from[0]},${from[1]} ${to[0]},${to[1]}`} />
      <circle cx={to[0]} cy={to[1]} r={1.8} className={on ? "fill-vermilion" : "fill-muted"} stroke="none" />
    </g>
  );
}

export default function YumiParts() {
  const [sel, setSel] = useState<PartId | null>(null);
  const [layers, setLayers] = useState(false);
  const cur = PARTS.find((p) => p.id === sel);

  return (
    <FigureFrame
      id="yumi-parts"
      title="和弓各部位（側面，張弦後）"
      caption={
        <>
          弓長以並寸 221 cm 按比例畫，握在從本弭算起約 1/3 處；弓身的彎曲是示意，厚度放大 1.5 倍。上切詰籐、下切詰籐等更細的部位沒有畫。
          「外竹・内竹」是竹弓的構造。
        </>
      }
      sources={[ANKF.playRules, ANKF.terminology, BUDOKAN.ch2, ANKF.rissha]}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:items-start">
        <svg viewBox="0 0 320 624" role="img" aria-label="和弓各部位的側面示意圖" className="mx-auto block h-auto w-full max-w-sm">
          <title>和弓各部位的側面示意圖</title>
          <desc>
            張弦後的和弓側面。由上而下：末弭（上弭）、上関板、姫反り、鳥打、矢摺籐、籐頭、握、下関板、本弭（下弭）。弦兩端以弦輪掛在弭上，搭箭處有中仕掛け。全長
            221 公分（並寸），握在從下端算起約三分之一處，弓把約 15 公分。
          </desc>

          {/* bow body */}
          <path d={BOW} className="fill-wood stroke-ink" strokeWidth={0.8} strokeLinejoin="round" />
          {layers && (
            <g strokeWidth={0.4} className="stroke-ink/50">
              {LAYER_INFO.map((l) => (
                <path key={l.id} d={LAYERS[l.id]} className={l.cls} />
              ))}
            </g>
          )}
          {/* 関板 */}
          <path d={SEKI_UP} className="fill-wood-soft stroke-ink" strokeWidth={0.6} />
          <path d={SEKI_DN} className="fill-wood-soft stroke-ink" strokeWidth={0.6} />
          {/* 握 (grip leather) and 矢摺籐 (rattan wrap) */}
          <path d={YAZURI} className="fill-wood-soft stroke-ink" strokeWidth={0.6} />
          <g className="stroke-wood" strokeWidth={0.9}>
            {range(82, 92.5, 1.3).map((y) => (
              <line key={y} x1={X(belly(y) - 0.25)} y1={Y(y)} x2={X(belly(y) + T(y) + 0.25)} y2={Y(y + 0.5)} />
            ))}
          </g>
          <path d={GRIP} className="fill-ink/80 stroke-ink" strokeWidth={0.6} />

          {/* string, loops, 中仕掛け */}
          <line x1={XS} y1={Y(217)} x2={XS} y2={Y(3)} className="stroke-ink" strokeWidth={1.3} />
          <path d={band(216.4, 217.6, -0.35, 1.25)} className="fill-vermilion stroke-ink" strokeWidth={0.5} />
          <path d={band(2.4, 3.6, -0.35, 1.25)} className="fill-surface stroke-ink" strokeWidth={0.7} />
          <rect x={XS - 1.9} y={Y(N_HI)} width={3.8} height={r1((N_HI - N_LO) * S)} rx={1.2} className="fill-ink" />

          {/* highlight */}
          {cur && (
            <g className="fill-vermilion/45 stroke-vermilion" strokeWidth={1.6} strokeLinejoin="round">
              {cur.hl.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          )}

          {/* labels */}
          <g fontSize={13}>
            {PARTS.map((p) => {
              const on = sel === p.id;
              const from: [number, number] = p.side === "L" ? [LX + 3, p.ly - 4.5] : [RX - 3, p.ly - 4.5];
              return (
                <g key={p.id}>
                  <Leader from={from} to={p.at} on={on} />
                  {p.id === "tsuruwa" && <Leader from={[RX - 3, 594]} to={[XS + 2, Y(3)]} on={on} />}
                  <text
                    lang="ja"
                    x={p.side === "L" ? LX : RX}
                    y={p.ly}
                    textAnchor={p.side === "L" ? "end" : "start"}
                    className={on ? "fill-vermilion" : "fill-ink"}
                    fontWeight={on ? 700 : 400}
                  >
                    {p.name}
                  </text>
                  {p.id === "tsuruwa" && (
                    <text lang="ja" x={RX} y={598} className={on ? "fill-vermilion" : "fill-ink"} fontWeight={on ? 700 : 400}>
                      弦輪
                    </text>
                  )}
                </g>
              );
            })}
            {layers &&
              LAYER_INFO.map((l) => {
                const to: [number, number] = [X(belly(l.at) + T(l.at) * l.f), Y(l.at)];
                return (
                  <g key={l.id}>
                    <Leader from={[LX + 3, l.ly - 4.5]} to={to} on={false} />
                    <text lang="ja" x={LX} y={l.ly} textAnchor="end" className="fill-ink" fontWeight={700}>
                      {l.name}
                    </text>
                  </g>
                );
              })}

            {/* 弓把 */}
            <g className="stroke-muted" strokeWidth={0.9}>
              <line x1={X(belly(GRIP_C) - 0.45)} y1={Y(GRIP_C) + 22} x2={XS} y2={Y(GRIP_C) + 22} />
              <line x1={X(belly(GRIP_C) - 0.45)} y1={Y(GRIP_C) + 17} x2={X(belly(GRIP_C) - 0.45)} y2={Y(GRIP_C) + 27} />
            </g>
            <text x={RX} y={Y(GRIP_C) + 20} className="fill-muted">
              弓把
            </text>
            <text x={RX} y={Y(GRIP_C) + 36} className="fill-muted">
              約 15 cm
            </text>

            {/* dimensions: 1/3 + 2/3, and the overall length */}
            <g className="stroke-indigo" strokeWidth={1}>
              <line x1={292} y1={Y(L)} x2={292} y2={Y(0)} />
              {[L, GRIP_C, 0].map((c) => (
                <line key={c} x1={287} y1={Y(c)} x2={297} y2={Y(c)} />
              ))}
              <line x1={313} y1={Y(L)} x2={313} y2={Y(0)} />
              <line x1={308} y1={Y(L)} x2={318} y2={Y(L)} />
              <line x1={308} y1={Y(0)} x2={318} y2={Y(0)} />
              <line x1={XS + 4} y1={Y(GRIP_C)} x2={286} y2={Y(GRIP_C)} strokeDasharray="2 3" className="stroke-indigo/60" />
            </g>
            <g className="fill-indigo">
              <text transform={`translate(287 ${Y((GRIP_C + L) / 2)}) rotate(-90)`} textAnchor="middle">
                上半部 約 2/3（≈ 147 cm）
              </text>
              <text transform={`translate(287 ${Y(GRIP_C / 2)}) rotate(-90)`} textAnchor="middle">
                約 1/3（≈ 74 cm）
              </text>
              <text transform={`translate(309 ${Y(L / 2)}) rotate(-90)`} textAnchor="middle">
                全長 221 cm（並寸・七尺三寸）
              </text>
            </g>
          </g>
        </svg>

        <div>
          <p className="text-sm text-muted">點部位名稱，圖上會標出位置；再點一次取消。</p>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 min-[480px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
            {PARTS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={sel === p.id}
                  onClick={() => setSel(sel === p.id ? null : p.id)}
                  className="flex min-h-11 w-full flex-col items-start rounded-lg border border-line bg-surface px-2.5 py-1.5 text-left text-sm leading-snug hover:border-wood aria-pressed:border-vermilion aria-pressed:bg-vermilion/10"
                >
                  <span lang="ja" className="font-semibold">
                    {p.name}
                  </span>
                  <span lang="ja" className="text-xs text-muted">
                    {p.kana}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div aria-live="polite" className="mt-3 min-h-16 rounded-lg bg-surface px-3 py-2 text-sm leading-relaxed">
            {cur ? (
              <>
                <span lang="ja" className="font-semibold text-vermilion">
                  {cur.name}
                </span>
                ：{cur.text}
              </>
            ) : (
              <span className="text-muted">還沒選部位。藍色尺寸線：全長 221 cm（並寸），握到本弭約 1/3。</span>
            )}
          </div>
          <button
            type="button"
            aria-pressed={layers}
            onClick={() => setLayers(!layers)}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-wood px-4 text-sm font-semibold text-wood hover:bg-wood-soft aria-pressed:bg-wood-soft"
          >
            <span aria-hidden="true">{layers ? "■" : "□"}</span>
            標出竹弓的外竹・側木・内竹
          </button>
          {layers && (
            <ul className="mt-2 space-y-1 text-sm">
              {LAYER_INFO.map((l) => (
                <li key={l.id} className="flex items-baseline gap-2">
                  <svg aria-hidden="true" viewBox="0 0 10 10" className="h-3 w-3 shrink-0">
                    <rect width="10" height="10" rx="2" className={`${l.cls} stroke-ink/50`} />
                  </svg>
                  <span>
                    <span lang="ja" className="font-semibold">
                      {l.name}
                    </span>
                    <span lang="ja" className="ml-1 text-xs text-muted">
                      {l.kana}
                    </span>
                    ：{l.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </FigureFrame>
  );
}
