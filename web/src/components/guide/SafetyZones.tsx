"use client";

// 〈安全守則〉的找找看：俯視示意圖上有幾個「?」，點開看那裡為什麼不能進、不能站。
// 每一區的說明直接取自本頁的 SAFETY_RULES / SAFETY_NOTES 與指導書第Ⅴ章的安全清單；沒有寫成規則的地方不標「安全」。
// 圖只是示意：巻藁區與射場的相對位置依道場而不同，矢道不按比例。

import { useState } from "react";
import { Cites, TagBadge } from "@/components/content/Blocks";
import { ANKF, BUDOKAN } from "@/content/common-sources";
import { SAFETY_NOTES, SAFETY_RULES } from "@/content/guide/content";
import type { Point } from "@/content/types";

type ZoneId = "yamichi" | "makiwara-back" | "makiwara-side" | "near" | "gap";

interface Zone {
  id: ZoneId;
  name: string;
  /** false = 不能進／不能站；true = 一條間距的規則（不是「安全區」） */
  info?: boolean;
  points: Point[];
  /** "?" marker position */
  q: [number, number];
}

function rule(title: string): Point[] {
  const r = SAFETY_RULES.find((x) => x.title === title);
  return r ? [{ text: r.text, tag: r.tag, src: r.src }] : [];
}
const FILMING = SAFETY_NOTES.filter((p) => p.text.startsWith("錄影"));

const ZONES: Zone[] = [
  { id: "yamichi", name: "矢道", points: rule("不進矢道，取箭要舉旗"), q: [120, 112] },
  { id: "makiwara-back", name: "巻藁的後方", points: rule("巻藁四周淨空"), q: [284, 70] },
  { id: "makiwara-side", name: "巻藁的左右", points: rule("巻藁四周淨空"), q: [253, 112] },
  {
    id: "near",
    name: "正在拉弓的人身旁",
    points: [{ text: "不靠近正在拉弓的人。", tag: "guide", src: [BUDOKAN.ch5] }, ...FILMING],
    q: [214, 182],
  },
  { id: "gap", name: "射位的間隔", info: true, points: rule("保持射手間距"), q: [85, 222] },
];
const DANGER = ZONES.filter((z) => !z.info).length;

function Q({ x, y, open, info }: { x: number; y: number; open: boolean; info?: boolean }) {
  if (open) {
    return (
      <g className="course-pop" style={{ transformOrigin: `${x}px ${y}px` }}>
        <circle cx={x} cy={y} r={10} className={info ? "fill-indigo" : "fill-vermilion"} />
        <text x={x} y={y + 4.5} textAnchor="middle" className="fill-surface" fontSize={13} fontWeight={700}>
          {info ? "i" : "✕"}
        </text>
      </g>
    );
  }
  return (
    <g>
      <circle cx={x} cy={y} r={10} className="fill-surface stroke-wood" strokeWidth={1.8} />
      <text x={x} y={y + 4.5} textAnchor="middle" className="fill-wood" fontSize={13} fontWeight={700}>
        ?
      </text>
    </g>
  );
}

export default function SafetyZones() {
  const [seen, setSeen] = useState<Set<ZoneId>>(() => new Set());
  const [cur, setCur] = useState<ZoneId | null>(null);
  const zone = ZONES.find((z) => z.id === cur);
  const found = ZONES.filter((z) => !z.info && seen.has(z.id)).length;

  const open = (id: ZoneId) => {
    setCur(id);
    setSeen((s) => new Set(s).add(id));
  };
  const is = (id: ZoneId) => seen.has(id);
  const hot = (id: ZoneId) => cur === id;
  const zoneCls = (id: ZoneId, info?: boolean) =>
    `cursor-pointer ${is(id) ? (info ? "fill-indigo/10 stroke-indigo" : "fill-vermilion/15 stroke-vermilion") : "fill-transparent stroke-wood/60"}`;
  const tap = (id: ZoneId) => ({ onClick: () => open(id), "aria-hidden": true as const });

  return (
    <figure className="my-4 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <p className="mb-3 text-[15px] font-semibold">
        找找看：圖上哪裡不能進、不能站？
        <span className="ml-2 text-sm font-normal text-muted">點「?」或下面的按鈕。</span>
      </p>
      <div className="grid gap-4 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-start">
        <div className="ill-plate rounded-xl p-2 sm:p-3">
          <svg viewBox="0 0 340 262" role="img" aria-label="射場、矢道與巻藁區的俯視示意圖，標出不能進、不能站的地方" className="mx-auto block h-auto w-full">
            <g fontSize={11}>
              {/* 安土・的 */}
              <rect x={14} y={8} width={210} height={26} rx={6} className="fill-wood-soft stroke-line" />
              <text x={218} y={25} textAnchor="end" className="fill-ink">
                安土・的
              </text>
              {[50, 120, 190].map((x) => (
                <g key={x}>
                  <circle cx={x} cy={44} r={8} className="fill-surface stroke-ink" strokeWidth={1.8} />
                  <circle cx={x} cy={44} r={3} className="fill-ink" />
                </g>
              ))}

              {/* 矢道 */}
              <rect x={14} y={58} width={210} height={112} {...tap("yamichi")} className={zoneCls("yamichi")} strokeWidth={hot("yamichi") ? 2.4 : 1.4} strokeDasharray="5 4" />
              <text x={160} y={150} textAnchor="middle" className="fill-muted" pointerEvents="none">
                矢道（不按比例）
              </text>

              {/* 射場・射位 */}
              <rect x={14} y={176} width={210} height={64} rx={6} className="fill-surface-2 stroke-line" />
              <line x1={14} y1={196} x2={224} y2={196} className="stroke-indigo" strokeWidth={1.6} />
              <text x={20} y={254} className="fill-indigo" fontWeight={700}>
                射場・射位
              </text>
              {/* spacing between two 射位 */}
              <g {...tap("gap")} className="cursor-pointer">
                <rect x={50} y={204} width={70} height={30} className={zoneCls("gap", true)} strokeWidth={hot("gap") ? 2.2 : 1.2} strokeDasharray="4 3" />
                <path d="M50 228 H120 M50 223 v10 M120 223 v10" className={is("gap") ? "stroke-indigo" : "stroke-muted"} strokeWidth={1.2} />
                {is("gap") && (
                  <text x={85} y={222} textAnchor="middle" className="fill-indigo course-pop" fontSize={10.5} fontWeight={700}>
                    標準 180 cm
                  </text>
                )}
              </g>
              {/* the one drawing the bow, with the area around them */}
              <circle cx={190} cy={196} r={30} {...tap("near")} className={zoneCls("near")} strokeWidth={hot("near") ? 2.4 : 1.4} strokeDasharray="5 4" />
              {[50, 120, 190].map((x) => (
                <circle key={x} cx={x} cy={196} r={9} className={x === 190 ? "fill-wood-soft stroke-ink" : "fill-surface stroke-ink"} strokeWidth={2} pointerEvents="none" />
              ))}
              <text x={190} y={234} textAnchor="middle" className="fill-muted" fontSize={10} pointerEvents="none">
                拉弓中
              </text>

              {/* 巻藁區 */}
              <rect x={236} y={8} width={96} height={232} rx={8} className="fill-none stroke-line" strokeDasharray="2 3" />
              <text x={284} y={254} textAnchor="middle" className="fill-wood" fontWeight={700}>
                巻藁區（示意）
              </text>
              <rect x={244} y={50} width={80} height={36} rx={4} {...tap("makiwara-back")} className={zoneCls("makiwara-back")} strokeWidth={hot("makiwara-back") ? 2.4 : 1.4} strokeDasharray="5 4" />
              <g {...tap("makiwara-side")} className="cursor-pointer">
                <rect x={240} y={94} width={26} height={36} rx={4} className={zoneCls("makiwara-side")} strokeWidth={hot("makiwara-side") ? 2.4 : 1.4} strokeDasharray="5 4" />
                <rect x={302} y={94} width={26} height={36} rx={4} className={zoneCls("makiwara-side")} strokeWidth={hot("makiwara-side") ? 2.4 : 1.4} strokeDasharray="5 4" />
              </g>
              {/* 巻藁 on its stand, archer in front facing it */}
              <rect x={272} y={98} width={24} height={28} rx={4} className="fill-wood stroke-ink" strokeWidth={1.2} pointerEvents="none" />
              <text x={284} y={142} textAnchor="middle" className="fill-ink" fontSize={10} pointerEvents="none">
                巻藁
              </text>
              <line x1={284} y1={196} x2={284} y2={130} className="stroke-muted" strokeWidth={1.2} strokeDasharray="3 4" pointerEvents="none" />
              <circle cx={284} cy={206} r={9} className="fill-wood-soft stroke-ink" strokeWidth={2} pointerEvents="none" />
              <path d="M279 195 L284 187 L289 195 Z" className="fill-ink" pointerEvents="none" />

              {/* question marks */}
              {ZONES.map((z) => (
                <g key={z.id} {...tap(z.id)} className="cursor-pointer">
                  {/* the spacing shows its number instead of a marker once opened */}
                  {!(z.info && is(z.id)) && <Q x={z.q[0]} y={z.q[1]} open={is(z.id)} info={z.info} />}
                  {z.id === "makiwara-side" && <Q x={315} y={112} open={is(z.id)} />}
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="min-w-0">
          <ul className="flex flex-wrap gap-1.5">
            {ZONES.map((z) => (
              <li key={z.id}>
                <button
                  type="button"
                  aria-pressed={cur === z.id}
                  onClick={() => open(z.id)}
                  className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-2.5 text-sm hover:border-wood ${
                    cur === z.id ? (z.info ? "border-indigo bg-indigo/10" : "border-vermilion bg-vermilion/10") : "border-line bg-surface"
                  }`}
                >
                  <span aria-hidden="true" className={is(z.id) ? (z.info ? "text-indigo" : "text-vermilion") : "text-wood"}>
                    {is(z.id) ? (z.info ? "i" : "✕") : "?"}
                  </span>
                  {z.name}
                </button>
              </li>
            ))}
          </ul>
          <div aria-live="polite" className="mt-3 min-h-24 rounded-lg bg-surface-2/60 px-3 py-2 text-[15px] leading-relaxed">
            {zone ? (
              <>
                <p className={`font-semibold ${zone.info ? "text-indigo" : "text-vermilion"}`}>
                  {zone.name}：{zone.info ? "要保持間距" : "不能進、不能站"}
                </p>
                <ul className="mt-1 space-y-1">
                  {zone.points.map((p) => (
                    <li key={p.text}>
                      {p.tag && <TagBadge tag={p.tag} />}
                      {p.text}
                      <Cites src={p.src} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-muted">圖上有 {DANGER} 個不能進、不能站的地方，和 1 條間距的規則。</p>
            )}
            <p className="mt-2 text-sm text-muted tabular-nums">
              已找到 {found}/{DANGER} 個{found === DANGER ? "：全部找到了。沒有標出來的地方，不代表就安全。" : "。"}
            </p>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-xs leading-relaxed text-muted">
        俯視示意，不按比例；巻藁區與射場的相對位置依道場而不同，圓盤代表射手。圖只標出本頁規則寫到的地方，沒標的地方不代表安全，請聽指導者的指示。依據：
        {[BUDOKAN.ch2, BUDOKAN.ch4, BUDOKAN.ch5, ANKF.playRules].map((s, k) => (
          <span key={s.url}>
            {k > 0 && "、"}
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line hover:text-wood">
              {s.label}
            </a>
          </span>
        ))}
        。本站以程式繪製的示意圖。
      </figcaption>
    </figure>
  );
}
