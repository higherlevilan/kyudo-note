"use client";

// 矢束 → 矢尺 的步驟播放器。人形沿用原本矢束圖的構圖：左臂水平伸直，從喉嚨中心量到中指指尖。
// 下方的箭以「矢束 85 cm」為例按比例畫餘裕（1 cm ≈ 2.64 單位）；只是示意，不是建議的長度。

import Stepper from "@/components/course/Stepper";
import { PointList } from "@/components/content/Blocks";
import type { GearStep } from "@/content/equipment/steps";

const THROAT = 80;
const TIP = 304;
const PX_CM = (TIP - THROAT) / 85;
const cm = (n: number) => TIP + n * PX_CM;

function Arrow({ y, end, dim }: { y: number; end: number; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.55 : 1}>
      {/* halo so the shaft reads over the figure's legs */}
      <line x1={THROAT} y1={y} x2={end - 6} y2={y} className="stroke-surface" strokeWidth={6} />
      <line x1={THROAT} y1={y} x2={end - 6} y2={y} className="stroke-wood" strokeWidth={2.4} />
      <path d={`M${end} ${y} l-9 -4 v8 z`} className="fill-ink" />
      {/* 羽 (fletching) near the 筈 end */}
      <path d={`M${THROAT + 6} ${y - 1.5} h24 l-3 -5 h-17 z M${THROAT + 6} ${y + 1.5} h24 l-3 5 h-17 z`} className="fill-vermilion/60" />
    </g>
  );
}

function Figure({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 360 228" role="img" aria-label="量矢束與決定箭長的示意圖" className="mx-auto block h-auto w-full max-w-lg">
      <line x1={20} y1={204} x2={340} y2={204} className="stroke-line" strokeWidth={2} />
      {/* body (same drawing as the former static 矢束 diagram) */}
      <g className="stroke-ink" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.8}>
        <circle cx={80} cy={38} r={17} strokeWidth={4} />
        <line x1={80} y1={56} x2={80} y2={66} />
        <path d="M62 72 L98 72 L94 140 L66 140 Z" strokeWidth={4} />
        <path d="M62 76 L52 108 L50 138" />
        <path d="M72 140 L70 198" />
        <path d="M88 140 L90 198" />
      </g>
      {/* step 1: the arm comes up from hanging to level */}
      {step === 0 && (
        <g>
          <path d="M98 76 L106 108 L108 136" className="stroke-muted" strokeWidth={3} strokeDasharray="4 4" fill="none" strokeLinecap="round" />
          <path d="M126 132 A58 58 0 0 0 152 82" className="stroke-vermilion" strokeWidth={1.8} fill="none" />
          <path d="M152 82 l-7 3 l8 4 z" className="fill-vermilion" />
          <text x={160} y={112} className="fill-vermilion" fontSize={12} fontWeight={700}>
            抬到與肩同高
          </text>
        </g>
      )}
      <g className="stroke-ink" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8}>
        <line x1={98} y1={76} x2={288} y2={76} />
        <path d="M288 76 L304 76" strokeWidth={3.5} />
      </g>
      <text x={304} y={62} textAnchor="end" className="fill-muted" fontSize={11}>
        左手中指指尖
      </text>

      {/* step 2+: measuring points and the 矢束 dimension */}
      <g className="motion-safe:transition-opacity motion-safe:duration-500" opacity={step >= 1 ? 1 : 0}>
        <circle cx={THROAT} cy={66} r={4.5} className="fill-vermilion" />
        <circle cx={TIP} cy={76} r={4.5} className="fill-vermilion" />
        <g className="stroke-wood" strokeWidth={1.2} strokeDasharray="3 3">
          <line x1={THROAT} y1={70} x2={THROAT} y2={190} />
          <line x1={TIP} y1={80} x2={TIP} y2={190} />
        </g>
        <g className="stroke-wood" strokeWidth={1.8} fill="none">
          <line x1={84} y1={112} x2={300} y2={112} />
          <path d="M92 107 L84 112 L92 117" />
          <path d="M292 107 L300 112 L292 117" />
        </g>
        <text x={192} y={104} textAnchor="middle" className="fill-wood" fontSize={15} fontWeight={700}>
          矢束
        </text>
        <text x={108} y={60} className="fill-muted" fontSize={11}>
          喉嚨中心
        </text>
      </g>

      {/* step 3: arm length, not height */}
      {step === 2 && (
        <g>
          <line x1={34} y1={22} x2={34} y2={200} className="stroke-muted" strokeWidth={1.4} strokeDasharray="3 4" />
          <text x={30} y={16} className="fill-muted" fontSize={11}>
            身高
          </text>
          <g className="stroke-vermilion" strokeWidth={2.2} strokeLinecap="round">
            <line x1={26} y1={104} x2={42} y2={120} />
            <line x1={42} y1={104} x2={26} y2={120} />
          </g>
          <rect x={150} y={124} width={134} height={22} rx={11} className="fill-wood-soft" />
          <text x={217} y={139} textAnchor="middle" className="fill-ink" fontSize={12} fontWeight={700}>
            看手臂長度量
          </text>
        </g>
      )}

      {/* step 4+: the arrow, 矢束 + margin */}
      {step >= 3 && (
        <g>
          {step === 3 && <rect x={TIP} y={142} width={cm(5) - TIP} height={16} className="fill-indigo/20" />}
          {step >= 4 && (
            <>
              <rect x={cm(10)} y={142} width={cm(15) - cm(10)} height={16} className="fill-wood-soft" />
              <line x1={cm(10)} y1={138} x2={cm(10)} y2={162} className="stroke-indigo" strokeWidth={1.6} />
            </>
          )}
          <Arrow y={150} end={step >= 4 ? cm(10) : cm(5)} />
          {step === 3 && (
            <text x={TIP - 4} y={134} textAnchor="end" className="fill-indigo" fontSize={12} fontWeight={700}>
              ＋5 cm 以上（全弓連底線）
            </text>
          )}
          {step >= 4 && (
            <>
              <text x={cm(10) - 4} y={134} textAnchor="end" className="fill-indigo" fontSize={12} fontWeight={700}>
                初學者約 ＋10 cm（全弓連）
              </text>
              <text x={cm(15)} y={176} textAnchor="end" className="fill-wood" fontSize={11}>
                弓具店：＋12〜15 cm
              </text>
            </>
          )}
        </g>
      )}

      {/* step 6: a shaft that ends at the fingertip */}
      {step >= 5 && (
        <g>
          <Arrow y={190} end={TIP} dim />
          <g className="stroke-vermilion" strokeWidth={2.4} strokeLinecap="round">
            <line x1={TIP + 10} y1={182} x2={TIP + 24} y2={196} />
            <line x1={TIP + 24} y1={182} x2={TIP + 10} y2={196} />
          </g>
          <text x={TIP - 6} y={220} textAnchor="end" className="fill-vermilion" fontSize={12} fontWeight={700}>
            等長或更短：的前禁止
          </text>
        </g>
      )}
    </svg>
  );
}

export default function YazukaSteps({ steps }: { steps: GearStep[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <Stepper steps={steps.map((s) => ({ title: s.title, text: s.text }))} label="量矢束與決定箭長的步驟" autoplayMs={3600}>
        {(i) => (
          <div className="space-y-4">
            <figure className="ill-plate rounded-xl p-2 sm:p-3">
              <Figure step={i} />
              <figcaption className="mt-1 px-1 text-xs leading-relaxed text-muted">示意圖（本站繪製）：箭的餘裕以矢束 85 cm 為例按比例畫，不是建議的長度。</figcaption>
            </figure>
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
