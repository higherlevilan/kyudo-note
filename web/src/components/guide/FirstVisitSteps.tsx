"use client";

// 〈第一次去道場〉的步驟播放器：示意的道場平面圖上，一個小人從出門走到離開，
// 每一步亮起所在的區域，下方列出這一步的要點（取自本頁內容，附出處）。
// 平面圖只是示意：玄關、練習區、巻藁、射場的相對位置依道場而不同。

import Stepper from "@/components/course/Stepper";
import { PointList } from "@/components/content/Blocks";
import type { VisitStation, VisitStep } from "@/content/guide/visit-steps";

type Zone = "home" | "genkan" | "practice" | "makiwara" | "shajo" | "yamichi" | "bow";

const LIT: Record<VisitStation, Zone[]> = {
  home: ["home"],
  genkan: ["genkan"],
  dojo: ["bow"],
  practice: ["practice"],
  shajo: ["shajo", "yamichi"],
  exit: ["genkan"],
};

/** where the visitor stands, per station (svg units) */
const AT: Record<VisitStation, [number, number]> = {
  home: [37, 176],
  genkan: [109, 176],
  dojo: [236, 178],
  practice: [214, 122],
  shajo: [252, 70],
  exit: [109, 176],
};

function zoneCls(on: boolean) {
  return on ? "fill-wood-soft stroke-wood" : "fill-surface stroke-line";
}

function Visitor({ x, y }: { x: number; y: number }) {
  return (
    <g className="motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-in-out" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <ellipse cx={0} cy={13} rx={9} ry={2.5} className="fill-ink/15" />
      <path d="M-6 12 Q-6 -1 0 -1 Q6 -1 6 12 Z" className="fill-vermilion" />
      <circle cx={0} cy={-7} r={5.5} className="fill-surface stroke-ink" strokeWidth={1.6} />
    </g>
  );
}

function MapSvg({ step }: { step: VisitStep }) {
  const lit = new Set(LIT[step.station]);
  const on = (z: Zone) => lit.has(z);
  const [x, y] = AT[step.station];
  return (
    <svg viewBox="0 0 360 212" role="img" aria-label={`道場平面示意圖：現在在「${step.title}」這一步`} className="mx-auto block h-auto w-full max-w-xl">
      <g fontSize={11.5}>
        {/* note box */}
        <rect x={6} y={10} width={134} height={98} rx={10} className="fill-surface stroke-line" strokeDasharray="4 4" />
        <text x={16} y={30} className="fill-muted" fontSize={11}>
          這一步記住
        </text>
        {step.chips.map((c, i) => (
          <g key={c}>
            <rect x={14} y={40 + i * 21} width={118} height={17} rx={8.5} className="fill-wood-soft" />
            <text x={73} y={52.5 + i * 21} textAnchor="middle" className="fill-ink" fontWeight={700}>
              {c}
            </text>
          </g>
        ))}

        {/* home */}
        <rect x={6} y={124} width={62} height={80} rx={8} className={`${zoneCls(on("home"))} motion-safe:transition-colors`} strokeWidth={1.5} />
        <path d="M20 152 L37 138 L54 152 V160 H20 Z" className="fill-none stroke-muted" strokeWidth={1.4} />
        <text x={37} y={200} textAnchor="middle" className="fill-ink">
          出門前
        </text>

        {/* genkan */}
        <rect x={78} y={124} width={62} height={80} rx={8} className={`${zoneCls(on("genkan"))} motion-safe:transition-colors`} strokeWidth={1.5} />
        <g className="fill-muted">
          <rect x={95} y={140} width={7} height={15} rx={3.5} />
          <rect x={104} y={140} width={7} height={15} rx={3.5} />
          <rect x={115} y={140} width={7} height={15} rx={3.5} />
          <rect x={124} y={140} width={7} height={15} rx={3.5} />
        </g>
        <text lang="ja" x={109} y={200} textAnchor="middle" className="fill-ink">
          玄關
        </text>

        {/* dojo floor */}
        <rect x={150} y={10} width={204} height={194} rx={10} className="fill-surface-2 stroke-line" strokeWidth={1.5} />
        <text x={158} y={198} className="fill-muted">
          道場（示意）
        </text>

        {/* 矢道 edge */}
        <line x1={160} y1={18} x2={344} y2={18} className={on("yamichi") ? "stroke-vermilion" : "stroke-line"} strokeWidth={3} strokeDasharray="6 5" />
        <text x={252} y={34} textAnchor="middle" className={on("yamichi") ? "fill-vermilion" : "fill-muted"} fontWeight={on("yamichi") ? 700 : 400}>
          ↑ 矢道・的：不進入
        </text>

        {/* 射場 */}
        <rect x={160} y={42} width={184} height={46} rx={6} className={`${zoneCls(on("shajo"))} motion-safe:transition-colors`} strokeWidth={1.5} />
        <text lang="ja" x={168} y={58} className="fill-ink">
          射場
        </text>

        {/* 練習區 */}
        <rect x={160} y={96} width={108} height={46} rx={6} className={`${zoneCls(on("practice"))} motion-safe:transition-colors`} strokeWidth={1.5} />
        <text x={168} y={112} className="fill-ink">
          練習區
        </text>

        {/* 巻藁 */}
        <rect x={276} y={96} width={68} height={46} rx={6} className={`${zoneCls(on("makiwara"))}`} strokeWidth={1.5} />
        <circle cx={310} cy={124} r={8} className="fill-wood-soft stroke-wood" strokeWidth={1.2} />
        <text lang="ja" x={310} y={112} textAnchor="middle" className="fill-ink">
          巻藁
        </text>

        {/* 放在地上的弓 */}
        <g className={on("bow") ? "stroke-wood" : "stroke-muted"} fill="none" strokeLinecap="round">
          <path d="M262 178 Q300 164 338 178" strokeWidth={2.4} />
          <line x1={262} y1={178} x2={338} y2={178} strokeWidth={0.9} />
        </g>
        {on("bow") && (
          <g className="stroke-vermilion" strokeWidth={2.2} strokeLinecap="round">
            <line x1={294} y1={182} x2={306} y2={194} />
            <line x1={306} y1={182} x2={294} y2={194} />
          </g>
        )}
        <text x={300} y={160} textAnchor="middle" className={on("bow") ? "fill-ink" : "fill-muted"}>
          地上的弓具
        </text>

        <Visitor x={x} y={y} />
      </g>
    </svg>
  );
}

export default function FirstVisitSteps({ steps }: { steps: VisitStep[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <Stepper steps={steps.map((s) => ({ title: s.title, text: s.text }))} label="第一次去道場的步驟" autoplayMs={4000}>
        {(i) => (
          <div className="space-y-4">
            <figure className="ill-plate rounded-xl p-2 sm:p-3">
              <MapSvg step={steps[i]} />
              <figcaption className="mt-1 px-1 text-xs leading-relaxed text-muted">
                示意圖，不按比例。玄關、練習區、巻藁與射場的位置依道場而不同。
              </figcaption>
            </figure>
            {/* every step's points stay in the HTML; inactive ones are hidden */}
            {steps.map((s, n) => (
              <div key={s.id} hidden={n !== i} className="text-[15px]">
                <PointList points={s.points} />
              </div>
            ))}
          </div>
        )}
      </Stepper>
    </div>
  );
}
