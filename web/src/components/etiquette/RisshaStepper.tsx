"use client";

// 立射者怎麼配合坐射者：共用的步驟播放器＋俯視位置圖，兩個圓盤分別是坐射者與立射者。
// 每一步的文字就是全弓連〈立射の作法〉的七點（RISSHA_MATCH），圖只畫那一點寫到的位置與姿勢；
// 沒寫到的（例如本座開き足轉向哪邊、坐射者在立射者退回本座時做什麼）不畫，改用文字指向坐射流程。
// 兩人的左右順序只是示意。符號沿用 ZashaStepper：實線圓＝站著，虛線圓＝跪坐，三角形＝面向。

import Link from "next/link";
import Stepper from "@/components/course/Stepper";
import { Cites, TagBadge } from "@/components/content/Blocks";
import { ANKF } from "@/content/etiquette/sources";
import type { Point } from "@/content/types";

type Spot = "honza" | "shai";

interface Puck {
  at: Spot;
  /** 0 = facing the target (的正面), 90 = facing 脇正面, null = not stated → no triangle */
  face: 0 | 90 | null;
  kneel: boolean;
  lines: [string, string];
  /** small offset behind the line (立射者 before 「對齊隊列」) */
  back?: boolean;
  /** not described by 〈立射の作法〉 at this point */
  dim?: boolean;
  /** waits for a 弦音 */
  listen?: boolean;
}

interface MatchStep {
  title: string;
  z: Puck;
  r: Puck;
}

const DIM: Puck = { at: "shai", face: 90, kneel: false, lines: ["坐射者的動作", "見坐射流程"], dim: true };

/** One entry per RISSHA_MATCH point, same order. */
const STEPS: MatchStep[] = [
  {
    title: "本座：坐射者肌脫（或襷）的開き足",
    z: { at: "honza", face: null, kneel: true, lines: ["跪坐", "開き足（肌脫・襷）"] },
    r: { at: "honza", face: 0, kneel: false, lines: ["不看靶・打開腳", "雙手把弓立在正面"], back: true },
  },
  {
    title: "本座：坐射者起身",
    z: { at: "honza", face: null, kneel: false, lines: ["腰を切る", "起身"] },
    r: { at: "honza", face: 0, kneel: false, lines: ["稍微前移", "對齊隊列"] },
  },
  {
    title: "射位：轉向脇正面",
    z: { at: "shai", face: 90, kneel: true, lines: ["跪坐", "開き足轉向脇正面"] },
    r: { at: "shai", face: 90, kneel: false, lines: ["看靶", "做足踏み"] },
  },
  {
    title: "矢番え",
    z: { at: "shai", face: 90, kneel: true, lines: ["跪坐", "矢番え"] },
    r: { at: "shai", face: 90, kneel: false, lines: ["在肩的高度矢番え", "本弭放在左膝頭"] },
  },
  {
    title: "坐射者起身，立射者取懸け",
    z: { at: "shai", face: 90, kneel: false, lines: ["起身", ""] },
    r: { at: "shai", face: 90, kneel: false, lines: ["取矢（乙矢時弦調べ）", "聽前一人的弦音取懸け"], listen: true },
  },
  {
    title: "甲矢之後：立射者退回本座",
    z: DIM,
    r: { at: "honza", face: 0, kneel: false, lines: ["轉向的正面・合上足踏み", "退回本座，末弭不碰地"] },
  },
  {
    title: "乙矢：聽落的弦音再進射位",
    z: DIM,
    r: { at: "shai", face: 90, kneel: false, lines: ["聽落的弦音", "進射位射乙矢 → 退場"], listen: true },
  },
];

const Y: Record<Spot, number> = { honza: 186, shai: 116 };
const X = { z: 104, r: 236 } as const;

function PuckG({ p, x, name }: { p: Puck; x: number; name: string }) {
  const y = Y[p.at] + (p.back ? 14 : 0);
  return (
    <g
      className="motion-safe:transition-[transform,opacity] motion-safe:duration-700 motion-safe:ease-in-out"
      style={{ transform: `translate(${x}px, ${y}px)` }}
      opacity={p.dim ? 0.45 : 1}
    >
      <text y={-26} textAnchor="middle" className="fill-ink" fontSize={11} fontWeight={700}>
        {name}
      </text>
      {p.face != null && (
        <g className="motion-safe:transition-transform motion-safe:duration-500" style={{ transform: `rotate(${p.face}deg)` }}>
          <path d="M-5 -12 L0 -20 L5 -12 Z" className="fill-ink" />
        </g>
      )}
      <circle r={11} className={p.kneel ? "fill-wood-soft stroke-wood" : "fill-surface stroke-ink"} strokeWidth={2.5} strokeDasharray={p.kneel ? "4 2.5" : p.dim ? "2 3" : undefined} />
      {p.listen && (
        <text x={16} y={-14} className="fill-vermilion" fontSize={10.5} fontWeight={700}>
          ♪ 弦音
        </text>
      )}
      <text y={28} textAnchor="middle" className="fill-ink" fontSize={10.5} fontWeight={700}>
        {p.lines[0]}
      </text>
      {p.lines[1] && (
        <text y={42} textAnchor="middle" className="fill-muted" fontSize={10.5}>
          {p.lines[1]}
        </text>
      )}
    </g>
  );
}

function MatchMap({ step }: { step: MatchStep }) {
  const side = step.z.face === 90 || step.r.face === 90;
  return (
    <svg viewBox="0 0 340 280" role="img" aria-label={`立射者配合坐射者的俯視位置圖：${step.title}`} className="mx-auto block h-auto w-full max-w-md">
      <g fontSize={11.5}>
        {/* 安土・的 */}
        <rect x={20} y={8} width={300} height={28} rx={6} className="fill-wood-soft stroke-line" />
        <circle cx={170} cy={22} r={10} className="fill-surface stroke-ink" strokeWidth={2} />
        <circle cx={170} cy={22} r={4} className="fill-ink" />
        <text x={28} y={26} className="fill-ink">
          安土・的（的正面）
        </text>
        <text x={170} y={62} textAnchor="middle" className="fill-muted" fontSize={10.5}>
          矢道（不按比例）
        </text>

        {/* 射位・本座 */}
        <line x1={20} y1={116} x2={320} y2={116} className="stroke-indigo" strokeWidth={2} />
        <text x={20} y={108} className="fill-indigo" fontWeight={700}>
          射位
        </text>
        <line x1={20} y1={186} x2={320} y2={186} className="stroke-wood" strokeWidth={2} />
        <text x={20} y={202} className="fill-wood" fontWeight={700}>
          本座
        </text>

        {/* 脇正面 */}
        <path d="M330 96 h-36" className={side ? "stroke-ink" : "stroke-line"} strokeWidth={1.5} strokeDasharray={side ? undefined : "3 4"} />
        <path d="M336 96 l-9 -5 v10 z" className={side ? "fill-ink" : "fill-line"} />
        <text x={334} y={86} textAnchor="end" className={side ? "fill-ink" : "fill-muted"} fontWeight={side ? 700 : 400} fontSize={10.5}>
          脇正面
        </text>

        <PuckG p={step.z} x={X.z} name="坐射者" />
        <PuckG p={step.r} x={X.r} name="立射者" />

        {/* legend */}
        <g fontSize={10}>
          <circle cx={26} cy={266} r={6} className="fill-surface stroke-ink" strokeWidth={1.8} />
          <text x={36} y={270} className="fill-muted">
            站著
          </text>
          <circle cx={80} cy={266} r={6} className="fill-wood-soft stroke-wood" strokeWidth={1.8} strokeDasharray="3 2" />
          <text x={90} y={270} className="fill-muted">
            跪坐
          </text>
          <path d="M136 270 l5 -9 l5 9 z" className="fill-ink" />
          <text x={150} y={270} className="fill-muted">
            面向（沒寫到的不畫）
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function RisshaStepper({ points }: { points: Point[] }) {
  // the steps above are written against RISSHA_MATCH; if the content changes, fall back to the plain list
  if (points.length !== STEPS.length) return null;
  return (
    <div className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <p className="mb-3 text-sm text-muted">同一組裡有坐射也有立射時，立射者要配合坐射者。跟著播放器看兩人在同一時間各做什麼。</p>
      <Stepper
        steps={STEPS.map((s, i) => ({
          title: s.title,
          text: (
            <>
              {points[i].tag && <TagBadge tag={points[i].tag} />}
              {points[i].text}
              <Cites src={points[i].src} />
            </>
          ),
        }))}
        label="立射者配合坐射者的步驟"
        autoplayMs={4200}
      >
        {(i) => (
          <figure className="ill-plate rounded-xl p-2 sm:p-3">
            <MatchMap step={STEPS[i]} />
            <figcaption className="mt-1 px-1 text-xs leading-relaxed text-muted">
              俯視示意，不按比例；兩人的左右順序只是示意。圖只畫〈立射の作法〉這一點寫到的位置、姿勢與面向，沒寫到的不畫；坐射者其餘的動作見
              <Link href="#flow" className="mx-1 underline decoration-line hover:text-wood">
                〈坐射一手的完整流程〉
              </Link>
              。依據：
              <a href={ANKF.rissha.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line hover:text-wood">
                {ANKF.rissha.label}
              </a>
              、
              <a href={ANKF.terminology.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line hover:text-wood">
                {ANKF.terminology.label}
              </a>
              。本站以程式繪製的示意圖。
            </figcaption>
          </figure>
        )}
      </Stepper>
    </div>
  );
}
