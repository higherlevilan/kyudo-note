"use client";

// 弽（三つがけ）的部位：右手、掌心這一面的示意。形狀依店家、流派不同，這裡只標部位名稱。
// 點部位（圖上或下方按鈕）看定義；「規則要求的部位」一次標出競技規則要求的控・帽子・弦枕。
// 定義只用本頁〈弽的部位與種類〉表與詞彙庫已有的文字（全弓連用語辭典、競技規則、指導書、小山弓具）。

import { useState } from "react";
import { TagBadge } from "@/components/content/Blocks";
import { ANKF, BUDOKAN, SHOP } from "@/content/equipment/sources";
import type { Source, Tag } from "@/content/types";
import FigureFrame from "./FigureFrame";
import { r1 } from "./geom";

type PartId = "boshi" | "tsurumakura" | "hinerikawa" | "hikae" | "himo";

interface Part {
  id: PartId;
  name: string;
  kana: string;
  text: string;
  tag: Tag;
  src: Source[];
  /** 競技規則：弽要有控、帽子與弦枕 */
  required?: boolean;
}

const PARTS: Part[] = [
  { id: "boshi", name: "帽子", kana: "ぼうし", text: "覆蓋拇指的部分。堅帽子的帽子裡有木型；和帽子（柔帽子）不放木型、只用軟鹿皮疊成。", tag: "official", src: [ANKF.terminology, SHOP.koyamaKake], required: true },
  { id: "tsurumakura", name: "弦枕", kana: "つるまくら", text: "拇指內側根部掛弦的溝。弦掛在弦枕上的地方叫掛口（かけぐち）。", tag: "official", src: [ANKF.terminology], required: true },
  { id: "hinerikawa", name: "捻皮", kana: "ひねりかわ", text: "貼在弽食指根部的皮。", tag: "official", src: [ANKF.terminology] },
  { id: "hikae", name: "控え", kana: "ひかえ", text: "手腕部分；「堅帽子控え付き」的控裡有硬芯，「控え無し」的控裡沒有硬芯、比較柔軟。", tag: "shop", src: [SHOP.koyamaKake, SHOP.koyamaKakeInfo], required: true },
  { id: "himo", name: "紐", kana: "ひも", text: "把弽綁在手腕上的繩子。指導書：先戴胸當再戴弽；弽的繩子不要綁太緊。", tag: "guide", src: [BUDOKAN.ch4] },
];

// thumb: base centre B, pointing up-right
const B: [number, number] = [202, 182];
const ANG = (-55 * Math.PI) / 180;
const DIR: [number, number] = [Math.cos(ANG), Math.sin(ANG)];
const NRM: [number, number] = [-DIR[1], DIR[0]]; // points to the lower right (outer side of the thumb)
const LEN = 105;
const HALF = 20;
const at = (along: number, across: number): [number, number] => [r1(B[0] + DIR[0] * along + NRM[0] * across), r1(B[1] + DIR[1] * along + NRM[1] * across)];
const pt = (p: [number, number]) => `${p[0]},${p[1]}`;

function thumb(from: number): string {
  return `M${pt(at(from, -HALF))} L${pt(at(LEN, -HALF))} A${HALF} ${HALF} 0 0 1 ${pt(at(LEN, HALF))} L${pt(at(from, HALF))} Z`;
}

const TSURUMAKURA_A = at(30, -HALF);
const TSURUMAKURA_B = at(30, -HALF + 15);

function Lead({ x1, y1, x2, y2, hot }: { x1: number; y1: number; x2: number; y2: number; hot?: boolean }) {
  return (
    <g className={hot ? "stroke-vermilion" : "stroke-muted"} strokeWidth={hot ? 1.4 : 1}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <circle cx={x2} cy={y2} r={2} className={hot ? "fill-vermilion" : "fill-muted"} stroke="none" />
    </g>
  );
}

const HL = "fill-vermilion/45 stroke-vermilion";

export default function KakeParts() {
  const [sel, setSel] = useState<PartId | null>(null);
  const [rule, setRule] = useState(false);
  const cur = PARTS.find((p) => p.id === sel);
  const pick = (id: PartId) => setSel(sel === id ? null : id);
  /** highlighted? (selected, or one of the required parts while 「規則要求」 is on) */
  const on = (id: PartId) => sel === id || (rule && !!PARTS.find((p) => p.id === id)?.required);
  const tap = (id: PartId) => ({ onClick: () => pick(id), className: "cursor-pointer" });

  return (
    <FigureFrame
      id="kake-parts"
      title="弽（三つがけ）的部位"
      caption={
        <>
          右手、掌心朝向讀者的示意圖：三つがけ包住拇指、食指、中指。規則要求行射時右手一定要戴弽，而且要有控、帽子與弦枕；材質為鹿皮。實際形狀、硬度依店家與流派不同，不按比例。
        </>
      }
      sources={[ANKF.playRules, ANKF.terminology, SHOP.koyamaKake, SHOP.koyamaKakeInfo, BUDOKAN.ch4]}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:items-start">
        <svg viewBox="0 0 320 326" role="img" aria-label="三つがけ（右手用）的部位示意圖：帽子、弦枕、捻皮、控え、紐；可點選部位" className="mx-auto block h-auto w-full max-w-sm">
          <title>三つがけ（右手用）的部位示意圖</title>
          <desc>
            右手用的三つがけ，掌心這一面。拇指的部分是帽子；拇指根部內側扣弦的溝是弦枕；食指根部貼著捻皮；手腕的部分是控え，用紐綁住。
          </desc>
          <text x={6} y={18} fontSize={14} fontWeight={700} className="fill-ink">
            右手用・掌心這一面
          </text>

          {/* 控え and 紐 */}
          <g {...tap("hikae")} aria-hidden="true">
            <path d="M96 226 H218 V290 Q218 306 202 306 H112 Q96 306 96 290 Z" className={on("hikae") ? HL : "fill-wood-soft stroke-ink"} strokeWidth={on("hikae") ? 2 : 1.2} />
            <rect x={104} y={240} width={106} height={56} rx={6} className="fill-wood/25" />
          </g>
          <g {...tap("himo")} aria-hidden="true">
            {/* wide invisible stroke = easier to tap */}
            <g className="stroke-transparent" strokeWidth={12} fill="none">
              <path d="M94 262 Q157 270 220 262" />
              <path d="M94 276 Q157 284 220 276" />
              <path d="M220 269 Q252 276 262 300 Q268 314 292 316" />
            </g>
            <g className={on("himo") ? "stroke-vermilion" : "stroke-ink"} strokeWidth={on("himo") ? 3 : 2} fill="none" strokeLinecap="round">
              <path d="M94 262 Q157 270 220 262" />
              <path d="M94 276 Q157 284 220 276" />
              <path d="M220 269 Q252 276 262 300 Q268 314 292 316" className={on("himo") ? undefined : "stroke-ink/80"} strokeWidth={on("himo") ? 2.6 : 1.6} />
            </g>
          </g>

          {/* fingers */}
          <rect x={94} y={24} width={36} height={112} rx={17} className="fill-wood-soft stroke-ink" strokeWidth={1.2} />
          <rect x={132} y={40} width={36} height={96} rx={17} className="fill-wood-soft stroke-ink" strokeWidth={1.2} />
          {/* palm */}
          <path d="M92 126 L170 128 L186 168 L222 194 L222 236 L92 236 Z" className="fill-wood-soft stroke-ink" strokeWidth={1.2} strokeLinejoin="round" />
          {/* thumb = 帽子; hard cap shaded */}
          <g {...tap("boshi")} aria-hidden="true">
            <path d={thumb(0)} className={on("boshi") ? HL : "fill-wood-soft stroke-ink"} strokeWidth={on("boshi") ? 2 : 1.2} strokeLinejoin="round" />
            <path d={thumb(48)} className="fill-wood/55 stroke-ink" strokeWidth={1} strokeLinejoin="round" />
          </g>
          {/* 弦枕 */}
          <g {...tap("tsurumakura")} aria-hidden="true">
            <line x1={TSURUMAKURA_A[0]} y1={TSURUMAKURA_A[1]} x2={TSURUMAKURA_B[0]} y2={TSURUMAKURA_B[1]} className="stroke-transparent" strokeWidth={14} />
            <line
              x1={TSURUMAKURA_A[0]}
              y1={TSURUMAKURA_A[1]}
              x2={TSURUMAKURA_B[0]}
              y2={TSURUMAKURA_B[1]}
              className={on("tsurumakura") ? "stroke-vermilion" : "stroke-vermilion/80"}
              strokeWidth={on("tsurumakura") ? 6 : 3.4}
              strokeLinecap="round"
            />
            {on("tsurumakura") && (
              <circle cx={r1((TSURUMAKURA_A[0] + TSURUMAKURA_B[0]) / 2)} cy={r1((TSURUMAKURA_A[1] + TSURUMAKURA_B[1]) / 2)} r={13} className="fill-none stroke-vermilion" strokeWidth={1.4} strokeDasharray="3 3" />
            )}
          </g>
          {/* 捻皮 */}
          <rect x={144} y={118} width={24} height={26} rx={5} {...tap("hinerikawa")} className={`cursor-pointer ${on("hinerikawa") ? HL : "fill-surface stroke-ink"}`} strokeWidth={on("hinerikawa") ? 2 : 1} aria-hidden="true" />

          <g fontSize={13} className="fill-muted" textAnchor="middle" pointerEvents="none">
            <text x={112} y={84}>
              中指
            </text>
            <text x={150} y={96}>
              食指
            </text>
            <text x={at(72, 0)[0]} y={at(72, 0)[1] + 5}>
              拇指
            </text>
          </g>

          <g fontSize={14} fontWeight={700}>
            {(
              [
                { id: "boshi", x: 306, y: 58, end: true, lead: [290, 62, at(LEN - 4, 6)[0], at(LEN - 4, 6)[1]] },
                { id: "tsurumakura", x: 306, y: 196, end: true, lead: [276, 192, r1((TSURUMAKURA_A[0] + TSURUMAKURA_B[0]) / 2), r1((TSURUMAKURA_A[1] + TSURUMAKURA_B[1]) / 2)] },
                { id: "hinerikawa", x: 84, y: 150, end: true, lead: [88, 146, 150, 131] },
                { id: "hikae", x: 84, y: 252, end: true, lead: [88, 248, 116, 250] },
                { id: "himo", x: 306, y: 292, end: true, lead: [300, 296, 266, 306] },
              ] as const
            ).map((l) => {
              const p = PARTS.find((q) => q.id === l.id)!;
              const hot = on(l.id);
              return (
                <g key={l.id} {...tap(l.id)} aria-hidden="true">
                  <Lead x1={l.lead[0]} y1={l.lead[1]} x2={l.lead[2]} y2={l.lead[3]} hot={hot} />
                  <text lang="ja" x={l.x} y={l.y} textAnchor={l.end ? "end" : "start"} className={hot ? "fill-vermilion" : "fill-ink"}>
                    {p.name}
                  </text>
                </g>
              );
            })}
          </g>
          <g fontSize={13} className="fill-muted" pointerEvents="none">
            <text x={306} y={76} textAnchor="end">
              拇指的包覆
            </text>
            <text x={6} y={168}>
              食指根部
            </text>
            <text x={6} y={270}>
              手腕部分
            </text>
            <text x={306} y={212} textAnchor="end">
              扣弦的溝
            </text>
          </g>
        </svg>

        <div className="min-w-0">
          <p className="text-sm text-muted">點部位名稱（圖上或下面的按鈕），看它是什麼；再點一次取消。</p>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 min-[480px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
            {PARTS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={sel === p.id}
                  onClick={() => pick(p.id)}
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
                <TagBadge tag={cur.tag} />
                <span lang="ja" className="font-semibold text-vermilion">
                  {cur.name}
                </span>
                ：{cur.text}
                {cur.required && <span className="text-muted">（競技規則要求的部位）</span>}
                <span className="mt-1 block text-xs text-muted">出處：{cur.src.map((s) => s.label).join("、")}</span>
              </>
            ) : rule ? (
              <span>
                <TagBadge tag="official" />
                競技規則：行射時右手一定要戴鹿皮弽；三つ、四つ或諸弽都可以，但要有<strong>控、帽子和弦枕</strong>（圖上標紅）。中學生、高中生等初學者允許用柔帽子、和帽子，熟練後最好儘早改用有弦枕的弽。
              </span>
            ) : (
              <span className="text-muted">還沒選部位。按下面的「標出規則要求的部位」，看競技規則要求弽一定要有哪三個部位。</span>
            )}
          </div>
          <button
            type="button"
            aria-pressed={rule}
            onClick={() => setRule(!rule)}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-wood px-4 text-sm font-semibold text-wood hover:bg-wood-soft aria-pressed:bg-wood-soft"
          >
            <span aria-hidden="true">{rule ? "■" : "□"}</span>
            標出規則要求的部位
          </button>
        </div>
      </div>
    </FigureFrame>
  );
}
