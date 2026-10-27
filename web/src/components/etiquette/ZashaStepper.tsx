"use client";

// 坐射一手的步驟器：共用的步驟播放器（components/course/Stepper）＋單人俯視的位置圖。
// 位置圖只畫有出處的東西：本座與射位（坐射 3 步，近的 2.0 m）、開き足轉 90 度面向脇正面、靶在左側。
// 入退場的路線依上座位置而不同，所以只畫一個「入退場口」區塊，不畫路線。

import Link from "next/link";
import { useState } from "react";
import Stepper from "@/components/course/Stepper";
import { Cites, PointList, TagBadge } from "@/components/content/Blocks";
import type { FlowStep } from "@/content/etiquette/flow";

function StepBody({ step }: { step: FlowStep }) {
  return (
    <div className="space-y-4 text-[15px]">
      <div>
        <h4 className="mb-1.5 text-sm font-bold text-muted">要做什麼</h4>
        <PointList points={step.actions} />
      </div>
      <div className="rounded-xl border border-line bg-surface-2/60 p-3">
        <h4 className="mb-1 text-sm font-bold text-muted">呼吸與節奏</h4>
        <p className="leading-relaxed">
          {step.breath.tag && <TagBadge tag={step.breath.tag} />}
          {step.breath.text}
          <Cites src={step.breath.src} />
        </p>
      </div>
      {step.cue && (
        <div className="rounded-xl border border-indigo/30 bg-indigo/5 p-3">
          <h4 className="mb-1 text-sm font-bold text-indigo">審查・5 人立時</h4>
          <p className="leading-relaxed">
            {step.cue.tag && <TagBadge tag={step.cue.tag} />}
            {step.cue.text}
            <Cites src={step.cue.src} />
          </p>
        </div>
      )}
      {step.watch && (
        <div>
          <h4 className="mb-1.5 text-sm font-bold text-muted">
            常見問題 <span className="font-normal">（指導現場常見的提醒，不是官方扣分表）</span>
          </h4>
          <ul className="flex flex-wrap gap-1.5">
            {step.watch.map((w) => (
              <li key={w} className="rounded-full border border-line px-2.5 py-0.5 text-sm text-muted">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
      {step.link && (
        <p>
          <Link href={step.link.href} className="text-wood underline">
            {step.link.label} →
          </Link>
        </p>
      )}
    </div>
  );
}

function StepTitle({ step, n }: { step: FlowStep; n: number }) {
  return (
    <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-lg font-semibold">
      <span className="text-sm font-normal text-wood">第 {n} 步</span>
      <span>{step.title}</span>
      <StepJa step={step} />
    </h3>
  );
}

function StepJa({ step }: { step: FlowStep }) {
  return (
    <span lang="ja" className="text-sm font-normal text-muted">
      {step.ja}
      {step.kana && step.kana !== step.ja ? `（${step.kana}）` : ""}
    </span>
  );
}

/* ───────────── 俯視位置圖 ───────────── */

type Spot = "gate" | "honza" | "shai";

interface MapState {
  at: Spot;
  /** 0 = facing the target (的正面), 90 = facing 脇正面 */
  face: 0 | 90;
  kneel: boolean;
  /** two short lines for the readout box */
  label: [string, string];
  walk?: "in" | "steps" | "out";
  arc?: boolean;
  shoot?: boolean;
}

const SPOT: Record<Spot, [number, number]> = { gate: [170, 246], honza: [170, 186], shai: [170, 116] };

const STATES: Record<string, MapState> = {
  nyujo: { at: "gate", face: 0, kneel: false, label: ["入場口", "留意上座・行禮"] },
  "to-honza": { at: "honza", face: 0, kneel: false, label: ["すり足", "末弭離地約 10 cm"], walk: "in" },
  honza: { at: "honza", face: 0, kneel: true, label: ["本座：跪坐", "揃って揖・三息"] },
  "to-shai": { at: "shai", face: 0, kneel: false, label: ["左腳先出", "3 步到射位"], walk: "steps" },
  hirakiashi: { at: "shai", face: 90, kneel: true, label: ["開き足", "轉 90 度"], arc: true },
  yatsugae: { at: "shai", face: 90, kneel: true, label: ["立弓", "矢番え（甲矢）"] },
  tatsu: { at: "shai", face: 90, kneel: false, label: ["起身", "箭與眼同高"] },
  haya: { at: "shai", face: 90, kneel: false, label: ["射甲矢", "射法八節"], shoot: true },
  yudaoshi: { at: "shai", face: 90, kneel: true, label: ["弓倒し・物見返し", "足閉じ → 跪坐"] },
  otoya: { at: "shai", face: 90, kneel: false, label: ["乙矢", "搭箭・起身・行射"], shoot: true },
  taijo: { at: "gate", face: 0, kneel: false, label: ["退場口", "留意上座・揖"], walk: "out" },
};
const FALLBACK: MapState = { at: "shai", face: 0, kneel: false, label: ["", ""] };

function ZashaMap({ step }: { step: FlowStep }) {
  const s = STATES[step.id] ?? FALLBACK;
  const [x, y] = SPOT[s.at];
  const side = s.face === 90;
  return (
    <svg viewBox="0 0 340 272" role="img" aria-label={`坐射一手的俯視位置圖：${step.title}`} className="mx-auto block h-auto w-full max-w-md">
      <style>{`@keyframes zs-fly{to{stroke-dashoffset:-22}}@media (prefers-reduced-motion:no-preference){.zs-fly{animation:zs-fly .9s linear infinite}}`}</style>
      <g fontSize={11.5}>
        {/* 安土・的 */}
        <rect x={20} y={8} width={300} height={28} rx={6} className="fill-wood-soft stroke-line" />
        <circle cx={170} cy={22} r={10} className="fill-surface stroke-ink" strokeWidth={2} />
        <circle cx={170} cy={22} r={4} className="fill-ink" />
        <text x={28} y={26} className="fill-ink">
          安土・的（的正面）
        </text>

        <text x={252} y={72} textAnchor="middle" className="fill-muted" fontSize={10.5}>
          矢道（近的 28 m，不按比例）
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

        {/* 入退場口：位置依道場，不畫路線 */}
        <rect x={106} y={224} width={128} height={44} rx={8} className={s.at === "gate" ? "fill-wood-soft stroke-wood" : "fill-none stroke-line"} strokeDasharray="5 4" strokeWidth={1.4} />
        <text x={242} y={242} className="fill-muted" fontSize={10.5}>
          入退場口
        </text>
        <text x={242} y={256} className="fill-muted" fontSize={10.5}>
          （位置依道場）
        </text>

        {/* 脇正面 */}
        <g className={side ? "stroke-ink" : "stroke-line"} strokeWidth={1.5}>
          <line x1={196} y1={116} x2={312} y2={116} strokeDasharray={side ? undefined : "3 4"} />
        </g>
        <path d="M320 116 l-9 -5 v10 z" className={side ? "fill-ink" : "fill-line"} />
        <text x={316} y={134} textAnchor="end" className={side ? "fill-ink" : "fill-muted"} fontWeight={side ? 700 : 400}>
          脇正面
        </text>

        {/* walking hints */}
        {s.walk === "in" && <line x1={170} y1={232} x2={170} y2={200} className="stroke-muted" strokeWidth={1.5} strokeDasharray="3 4" />}
        {s.walk === "out" && <line x1={170} y1={130} x2={170} y2={232} className="stroke-muted" strokeWidth={1.5} strokeDasharray="3 4" />}
        {s.walk === "steps" && (
          <g>
            <g className="fill-wood/70">
              <ellipse cx={163} cy={166} rx={4} ry={7} />
              <ellipse cx={178} cy={148} rx={4} ry={7} />
              <ellipse cx={163} cy={130} rx={4} ry={7} />
            </g>
            <text x={186} y={170} className="fill-muted" fontSize={10}>
              ① 左
            </text>
            <text x={186} y={152} className="fill-muted" fontSize={10}>
              ② 右
            </text>
            <text x={186} y={134} className="fill-muted" fontSize={10}>
              ③ 左
            </text>
          </g>
        )}

        {/* the arrow's flight */}
        {s.shoot && <line x1={170} y1={100} x2={170} y2={36} className="zs-fly stroke-vermilion" strokeWidth={2.2} strokeDasharray="7 4" />}

        {/* readout */}
        <rect x={40} y={128} width={108} height={46} rx={8} className="fill-surface stroke-line" />
        <text x={94} y={147} textAnchor="middle" className="fill-ink" fontWeight={700}>
          {s.label[0]}
        </text>
        <text x={94} y={164} textAnchor="middle" className="fill-muted" fontSize={10.5}>
          {s.label[1]}
        </text>

        {/* the archer */}
        <g className="motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-in-out" style={{ transform: `translate(${x}px, ${y}px)` }}>
          {s.arc && (
            <g>
              <path d="M0 -24 A24 24 0 0 1 24 0" className="stroke-vermilion" strokeWidth={1.8} fill="none" />
              <path d="M24 0 l-4.5 -7 l7 1 z" className="fill-vermilion" />
              <text x={22} y={-20} className="fill-vermilion" fontSize={11} fontWeight={700}>
                90°
              </text>
            </g>
          )}
          <g className="motion-safe:transition-transform motion-safe:duration-500" style={{ transform: `rotate(${s.face}deg)` }}>
            <circle r={11} className={s.kneel ? "fill-wood-soft stroke-wood" : "fill-surface stroke-ink"} strokeWidth={2.5} strokeDasharray={s.kneel ? "4 2.5" : undefined} />
            <path d="M-5 -12 L0 -20 L5 -12 Z" className="fill-ink" />
          </g>
        </g>

        {/* legend */}
        <g fontSize={10}>
          <circle cx={26} cy={236} r={6} className="fill-surface stroke-ink" strokeWidth={1.8} />
          <text x={36} y={240} className="fill-muted">
            站著
          </text>
          <circle cx={26} cy={256} r={6} className="fill-wood-soft stroke-wood" strokeWidth={1.8} strokeDasharray="3 2" />
          <text x={36} y={260} className="fill-muted">
            跪坐
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function ZashaStepper({ steps }: { steps: FlowStep[] }) {
  const [all, setAll] = useState(false);

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">以審查的 5 人立、弓道衣、坐射為例的一手（甲矢＋乙矢）。</p>
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          className="min-h-11 rounded-full border border-line px-3 py-1 text-sm text-ink hover:bg-surface-2"
        >
          {all ? "改回逐步播放" : "一次看全部步驟"}
        </button>
      </div>

      {all ? (
        <ol className="space-y-6">
          {steps.map((s, n) => (
            <li key={s.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
              <StepTitle step={s} n={n + 1} />
              <div className="mt-3">
                <StepBody step={s} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <Stepper steps={steps.map((s) => ({ title: s.title }))} label="坐射一手的流程" autoplayMs={4500}>
          {(i) => (
            <div className="space-y-4">
              <figure className="ill-plate rounded-xl p-2 sm:p-3">
                <ZashaMap step={steps[i]} />
                <figcaption className="mt-1 px-1 text-xs leading-relaxed text-muted">
                  單人俯視示意（不按比例）。坐射在射位轉向脇正面後，靶在射手的左側；入退場路線依上座位置而不同，這裡不畫。
                </figcaption>
              </figure>
              {/* Every step stays in the HTML (readable without JS / by search); inactive ones are hidden. */}
              {steps.map((s, n) => (
                <div key={s.id} hidden={n !== i}>
                  <p className="mb-3">
                    <StepJa step={s} />
                  </p>
                  <StepBody step={s} />
                </div>
              ))}
            </div>
          )}
        </Stepper>
      )}
    </div>
  );
}
