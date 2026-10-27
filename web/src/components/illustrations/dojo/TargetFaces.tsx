"use client";

// 的（靶）的種類：切換霞的、星的、遠的得点的，點靶上的一圈（或下面的按鈕）看名稱與尺寸。
// 數字依《弓道競技規則》第 26 條（霞的各圈半徑）與本站原本的靶面圖說明；每種靶面各自按比例畫，彼此大小不按比例。
// 靶面的黑、白、黃、赤、青是實物的顏色，所以直接寫色碼（和 home/Kasumi.tsx 一樣），深色模式下也不反轉。

import { useState } from "react";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import { r1 } from "@/components/illustrations/gear/geom";
import { ANKF } from "@/content/common-sources";

const C = { black: "#1f1b17", white: "#fbf8f2", gold: "#e2b33c", red: "#c23b2a", blue: "#2e5e9e" } as const;

type FaceId = "kasumi" | "hoshi" | "tokuten";

interface Ring {
  key: string;
  name: string;
  /** inner / outer radius in cm */
  r0: number;
  r: number;
  fill: string;
  ink: string;
  detail: string;
}

/* ── 霞的 radii (第 26 條) ── */
const KASUMI: { r: number; name: string; c: "black" | "white" }[] = [
  { r: 3.6, name: "中白", c: "white" },
  { r: 7.2, name: "一の黒", c: "black" },
  { r: 10.2, name: "二の白", c: "white" },
  { r: 11.7, name: "二の黒", c: "black" },
  { r: 14.7, name: "三の白", c: "white" },
  { r: 18, name: "三の黒", c: "black" },
];

const TOKUTEN = [
  { r: 10, pts: 10, name: "黃", fill: C.gold, ink: C.black },
  { r: 20, pts: 9, name: "赤", fill: C.red, ink: C.white },
  { r: 30, pts: 7, name: "青", fill: C.blue, ink: C.white },
  { r: 40, pts: 5, name: "黑", fill: C.black, ink: C.white },
  { r: 50, pts: 3, name: "白", fill: C.white, ink: C.black },
];

const RINGS: Record<FaceId, Ring[]> = {
  kasumi: KASUMI.map((k, i) => {
    const r0 = i === 0 ? 0 : KASUMI[i - 1].r;
    return {
      key: k.name,
      name: k.name,
      r0,
      r: k.r,
      fill: C[k.c],
      ink: k.c === "black" ? C.white : C.black,
      detail: i === 0 ? `正中央的白圓，半徑 ${k.r} cm。` : `從中心算起半徑 ${r0}～${k.r} cm 的一圈（寬 ${r1(k.r - r0)} cm）。`,
    };
  }),
  hoshi: [
    { key: "black", name: "中央黑圓", r0: 0, r: 6, fill: C.black, ink: C.white, detail: "黑圓的直徑是靶徑的 1/3：36 cm 的靶，黑圓直徑 12 cm。" },
    { key: "white", name: "白底", r0: 6, r: 18, fill: C.white, ink: C.black, detail: "黑圓以外都是白底。24 cm 的星的比例相同。" },
  ],
  tokuten: TOKUTEN.map((t, i) => ({
    key: t.name,
    name: `${t.name}（${t.pts} 分）`,
    r0: i === 0 ? 0 : TOKUTEN[i - 1].r,
    r: t.r,
    fill: t.fill,
    ink: t.ink,
    detail: `${t.name}區 ${t.pts} 分：半徑 ${i === 0 ? 0 : TOKUTEN[i - 1].r}～${t.r} cm，每區寬 10 cm。箭壓在兩區的線上時，取高的分數。`,
  })),
};

const FACES: { id: FaceId; name: string; kana: string; size: string; outer: number; use: string }[] = [
  { id: "kasumi", name: "霞的", kana: "かすみまと", size: "36 cm", outer: 18, use: "近的用直徑 36 cm 的霞的或星的；審查用 36 cm 霞的。遠的另有 100／79／50 cm 的霞的，圈的比例和近的不同。" },
  { id: "hoshi", name: "星的", kana: "ほしまと", size: "36 cm", outer: 18, use: "近的可以用 36 cm 的星的，也可以用 24 cm（比例相同）。" },
  { id: "tokuten", name: "遠的得点的", kana: "とくてんまと", size: "100 cm", outer: 50, use: "只用在遠的的得点制：直徑 100 cm，由中心起黃 10、赤 9、青 7、黑 5、白 3 分。" },
];

/** circle as a path, centred on the origin */
const circ = (r: number) => (r <= 0 ? "" : `M${-r},0a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`);

function Face({ face, sel, onPick }: { face: (typeof FACES)[number]; sel: string | null; onPick: (k: string) => void }) {
  const rings = RINGS[face.id];
  const R = face.outer;
  const pad = R * 0.06;
  const vb = R + pad + 0.6;
  const cur = rings.find((r) => r.key === sel);
  return (
    <svg viewBox={`${-vb} ${-vb} ${2 * vb} ${2 * vb}`} role="img" aria-label={`${face.name}（直徑 ${face.size}）的靶面，可點選各區`} className="mx-auto block h-auto w-full max-w-[15rem]">
      <title>{`${face.name}（直徑 ${face.size}）`}</title>
      <circle r={R + pad} className="fill-wood/70" />
      {/* outer → inner so the inner circles sit on top (and catch the taps) */}
      {[...rings].reverse().map((g) => (
        <circle
          key={g.key}
          r={g.r}
          fill={g.fill}
          className="cursor-pointer stroke-ink/40"
          strokeWidth={R * 0.006}
          onClick={() => onPick(g.key)}
          aria-hidden="true"
        />
      ))}
      {face.id === "tokuten" && (
        <g fontSize={R * 0.12} fontWeight={700} textAnchor="middle" pointerEvents="none">
          {TOKUTEN.map((t) => (
            <text key={t.r} x={t.r === 10 ? 0 : t.r - 5} y={R * 0.045} fill={t.ink}>
              {t.pts}
            </text>
          ))}
        </g>
      )}
      {cur && (
        <path
          d={`${circ(cur.r)}${circ(cur.r0)}`}
          fillRule="evenodd"
          className="fill-vermilion/50 stroke-vermilion"
          strokeWidth={R * 0.02}
          pointerEvents="none"
        />
      )}
    </svg>
  );
}

/* ── 霞的 radius ruler (same numbers, laid out flat) ── */
const RX0 = 18;
const RS = 15.6;
const rx = (r: number) => r1(RX0 + r * RS);

function KasumiRuler({ sel }: { sel: string | null }) {
  return (
    <svg viewBox="0 0 320 98" role="img" aria-label="霞的各圈的半徑：中白 3.6、一の黒到 7.2、二の白到 10.2、二の黒到 11.7、三の白到 14.7、三の黒到 18 公分" className="block h-auto w-full">
      <title>霞的各圈的半徑（公分）</title>
      {KASUMI.map((k, i) => {
        const r0 = i === 0 ? 0 : KASUMI[i - 1].r;
        const on = sel === k.name;
        return (
          <rect
            key={k.r}
            x={rx(r0)}
            y={34}
            width={r1((k.r - r0) * RS)}
            height={18}
            fill={C[k.c]}
            className={on ? "stroke-vermilion" : "stroke-ink"}
            strokeWidth={on ? 2.4 : 0.8}
          />
        );
      })}
      <g fontSize={13} textAnchor="middle" className="fill-ink">
        {[0, ...KASUMI.map((k) => k.r)].map((r) => (
          <g key={r}>
            <line x1={rx(r)} y1={29} x2={rx(r)} y2={34} className="stroke-ink" strokeWidth={0.8} />
            <text x={rx(r) + (r === 10.2 ? -3 : r === 11.7 ? 3 : 0)} y={25} textAnchor={r === 10.2 ? "end" : r === 11.7 ? "start" : "middle"}>
              {r}
            </text>
          </g>
        ))}
        {KASUMI.map((k, i) => {
          const r0 = i === 0 ? 0 : KASUMI[i - 1].r;
          const mid = rx((r0 + k.r) / 2);
          const low = k.name === "二の黒";
          return (
            <g key={k.name}>
              {low && <line x1={mid} y1={55} x2={mid} y2={78} className="stroke-muted" strokeWidth={0.9} />}
              <text lang="ja" x={mid} y={low ? 92 : 70} className={sel === k.name ? "fill-vermilion" : undefined} fontWeight={sel === k.name ? 700 : 400}>
                {k.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

const chip = (on: boolean) =>
  `inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm font-semibold transition-colors ${
    on ? "border-wood bg-wood-soft text-ink" : "border-field-border bg-surface text-ink hover:bg-surface-2"
  }`;

export function TargetFaces() {
  const [faceId, setFaceId] = useState<FaceId>("kasumi");
  const [sel, setSel] = useState<string | null>(null);
  const face = FACES.find((f) => f.id === faceId)!;
  const rings = RINGS[faceId];
  const cur = rings.find((r) => r.key === sel);
  const pick = (k: string) => setSel(sel === k ? null : k);

  return (
    <FigureFrame
      id="targets"
      title="的（靶）的種類"
      caption={
        <>
          每種靶面各自按規則的比例畫，但三種靶面彼此的大小不按比例（得点的的直徑約是近的的 2.8 倍）。近的用直徑 36 cm 的霞的或星的（星的也可用 24 cm，比例相同）；審查用 36 cm 霞的。遠的另有 100／79／50 cm 的霞的，圈的比例和近的不同；得点的只用在遠的的得点制，壓線取高分。
        </>
      }
      sources={[ANKF.playRules, ANKF.probationRules]}
    >
      <div role="group" aria-label="選擇靶面" className="mb-4 flex flex-wrap gap-2">
        {FACES.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={faceId === f.id}
            onClick={() => {
              setFaceId(f.id);
              setSel(null);
            }}
            className={chip(faceId === f.id)}
          >
            <span lang="ja">{f.name}</span>
            <span className="ml-1 font-normal text-muted">{f.size}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:items-start">
        <div>
          <Face face={face} sel={sel} onPick={pick} />
          <p className="mt-2 text-center text-xs text-muted">
            <span lang="ja">{face.name}</span>（{face.kana}）直徑 {face.size}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted">點靶上的一圈，或下面的按鈕，看這一區的名稱與尺寸；再點一次取消。</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {rings.map((g) => (
              <li key={g.key}>
                <button
                  type="button"
                  aria-pressed={sel === g.key}
                  onClick={() => pick(g.key)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-sm hover:border-wood aria-pressed:border-vermilion aria-pressed:bg-vermilion/10"
                >
                  <span aria-hidden="true" className="inline-block h-3 w-3 shrink-0 rounded-full border border-ink/40" style={{ background: g.fill }} />
                  <span lang={faceId === "kasumi" ? "ja" : undefined}>{g.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div aria-live="polite" className="mt-3 min-h-16 rounded-lg bg-surface px-3 py-2 text-sm leading-relaxed">
            {cur ? (
              <>
                <span lang={faceId === "kasumi" ? "ja" : undefined} className="font-semibold text-vermilion">
                  {cur.name}
                </span>
                ：{cur.detail}
              </>
            ) : (
              <span className="text-muted">{face.use}</span>
            )}
          </div>
          {faceId === "kasumi" && (
            <div className="mt-3">
              <p className="mb-1 text-xs text-muted">由中心往外的半徑（cm），第 26 條：</p>
              <KasumiRuler sel={sel} />
            </div>
          )}
        </div>
      </div>
    </FigureFrame>
  );
}
