"use client";

// 弦的步驟播放器：左邊是張弦後的弓（側面，弓形依 YumiParts 的示意曲線，橫向放大 3.5 倍），
// 右邊是每一步的放大圖或重點。數字只畫本頁有出處的：弓把約 15 cm（指導書）、握在下方約 1/3（競技規則）、
// 箭與弦約 90 度（翠山）。中仕掛的實際長度與做法依弓具店與指導者，圖上只標位置。

import Stepper from "@/components/course/Stepper";
import { PointList } from "@/components/content/Blocks";
import { monotone, r1, range } from "@/components/illustrations/gear/geom";
import type { GearStep } from "@/content/equipment/steps";

const L = 221;
const SX = 120; // string x
const KX = 3.5; // horizontal exaggeration
const Y = (h: number) => r1(248 - h * 1.068);
const GRIP = L / 3;
/** distance (cm) from the string to the belly, by height above the 本弭 (same shape as YumiParts) */
const belly = monotone([
  [0, 0.5],
  [3, 0],
  [8, 1.0],
  [15, 2.9],
  [30, 7.0],
  [48, 11.4],
  [66, 14.6],
  [GRIP, 15.0],
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
const X = (h: number) => r1(SX - belly(h) * KX);
const line = (a: number, b: number) => `M${range(a, b, 1).map((h) => `${X(h)},${Y(h)}`).join("L")}`;

const BOW = line(0, L);
const GRIP_PATH = line(66, 81);
const SEKI = line(207, 215);
const NOCK = 83;

function Bow({ step }: { step: number }) {
  const lit = (on: boolean) => (on ? "stroke-vermilion" : "stroke-ink");
  return (
    <g>
      {/* bow */}
      <path d={BOW} className="stroke-wood" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={GRIP_PATH} className="stroke-ink" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={SEKI} className={step === 2 ? "stroke-indigo" : "stroke-wood"} strokeWidth={step === 2 ? 8 : 5} fill="none" />
      {/* string + 弦輪 */}
      <line x1={SX} y1={Y(217)} x2={SX} y2={Y(3)} className={lit(step === 0)} strokeWidth={step === 0 ? 2.4 : 1.4} />
      <circle cx={SX} cy={Y(217)} r={3.2} className={`fill-none ${lit(step === 0)}`} strokeWidth={1.6} />
      <circle cx={SX} cy={Y(3)} r={3.2} className={`fill-none ${lit(step === 0)}`} strokeWidth={1.6} />
      {/* 中仕掛 */}
      <rect x={SX - 2.5} y={Y(NOCK + 4)} width={5} height={Y(NOCK - 4) - Y(NOCK + 4)} className={step >= 3 ? "fill-vermilion" : "fill-ink/50"} />
      {step === 3 && <rect x={SX - 12} y={Y(NOCK + 8)} width={24} height={Y(NOCK - 8) - Y(NOCK + 8)} className="fill-none stroke-vermilion" strokeDasharray="3 3" />}
      {step === 4 && (
        <g className="stroke-vermilion" strokeWidth={1}>
          {[-5, 0, 5, 10].map((d) => (
            <path key={d} d={`M${SX} ${Y(NOCK + d)} l5 -3 M${SX} ${Y(NOCK + d) + 2} l-5 -3`} />
          ))}
        </g>
      )}
      {/* 弓把 */}
      {step === 2 && (
        <g>
          <g className="stroke-indigo" strokeWidth={1.6} fill="none">
            <line x1={X(GRIP) + 4} y1={Y(GRIP)} x2={SX - 2} y2={Y(GRIP)} />
            <path d={`M${X(GRIP) + 10} ${Y(GRIP) - 4} l-6 4 l6 4 M${SX - 8} ${Y(GRIP) - 4} l6 4 l-6 4`} />
          </g>
          <text x={(X(GRIP) + SX) / 2 + 2} y={Y(GRIP) - 9} textAnchor="middle" className="fill-indigo" fontSize={10.5} fontWeight={700}>
            約 15 cm
          </text>
        </g>
      )}
      <g fontSize={10.5} className="fill-muted">
        <text x={SX + 8} y={Y(217) + 4}>
          弦輪
        </text>
        <text x={X(GRIP) - 6} y={Y(GRIP) + 4} textAnchor="end">
          握
        </text>
        <text x={SX + 8} y={Y(120)}>
          弦
        </text>
        <text x={X(211) - 6} y={Y(211) + 4} textAnchor="end" className={step === 2 ? "fill-indigo" : "fill-muted"}>
          上関板
        </text>
      </g>
    </g>
  );
}

function Chip({ x, y, w, text, tone = "wood" }: { x: number; y: number; w: number; text: string; tone?: "wood" | "bad" | "plain" }) {
  const box = tone === "bad" ? "fill-vermilion/10 stroke-vermilion" : tone === "plain" ? "fill-surface stroke-line" : "fill-wood-soft stroke-wood";
  return (
    <g>
      <rect x={x} y={y} width={w} height={24} rx={12} className={box} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" className={tone === "bad" ? "fill-vermilion" : "fill-ink"} fontSize={11.5} fontWeight={700}>
        {text}
      </text>
    </g>
  );
}

function Panel({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <g>
          <Chip x={176} y={40} w={164} text="並寸弓 × 並寸弦 ✓" />
          <Chip x={176} y={74} w={164} text="二寸伸弓 × 並寸弦 ✗" tone="bad" />
          <text x={180} y={124} className="fill-muted" fontSize={11}>
            粗細依弓力選
          </text>
          <text x={180} y={140} className="fill-muted" fontSize={11}>
            同樣「2 號」，各牌對應的弓力不同
          </text>
        </g>
      );
    case 1:
      return (
        <g>
          {/* 弦巻 */}
          <circle cx={258} cy={100} r={38} className="fill-wood-soft stroke-wood" strokeWidth={2} />
          <circle cx={258} cy={100} r={16} className="fill-surface stroke-wood" strokeWidth={1.5} />
          <g className="stroke-ink/70" fill="none" strokeWidth={1.2}>
            <circle cx={258} cy={100} r={22} />
            <circle cx={258} cy={100} r={27} />
            <circle cx={258} cy={100} r={32} />
          </g>
          <text lang="ja" x={258} y={156} textAnchor="middle" className="fill-ink" fontSize={12} fontWeight={700}>
            弦巻（つるまき）
          </text>
          <text x={258} y={174} textAnchor="middle" className="fill-muted" fontSize={11}>
            替弦先拉過幾射，再收進來
          </text>
        </g>
      );
    case 2:
      return (
        <g>
          <Chip x={176} y={60} w={164} text="弓把：握到弦約 15 cm" />
          <Chip x={176} y={94} w={164} text="上関板不碰到弦" tone="plain" />
          <text x={180} y={144} className="fill-muted" fontSize={11}>
            新合成弦容易伸長：
          </text>
          <text x={180} y={160} className="fill-muted" fontSize={11}>
            弦輪先做短、弓把先張高一點
          </text>
        </g>
      );
    case 3: {
      const sx = 300;
      const ny = 130;
      return (
        <g>
          <rect x={172} y={22} width={176} height={210} rx={10} className="fill-surface stroke-vermilion" strokeDasharray="3 3" />
          <line x1={sx} y1={30} x2={sx} y2={224} className="stroke-ink" strokeWidth={2} />
          {/* 中仕掛 wrap */}
          <rect x={sx - 5} y={ny - 46} width={10} height={80} className="fill-wood-soft stroke-wood" />
          <g className="stroke-wood" strokeWidth={0.9}>
            {range(ny - 44, ny + 30, 5).map((y) => (
              <line key={y} x1={sx - 5} y1={y + 3} x2={sx + 5} y2={y} />
            ))}
          </g>
          {/* arrow, nocked at 90° */}
          <line x1={sx - 4} y1={ny} x2={186} y2={ny} className="stroke-wood" strokeWidth={4} />
          <path d={`M${sx + 2} ${ny - 6} h-10 v12 h10`} className="fill-none stroke-ink" strokeWidth={1.6} />
          <path d={`M${sx - 22} ${ny} v-12 h12`} className="fill-none stroke-indigo" strokeWidth={1.2} />
          <text x={sx - 30} y={ny - 18} textAnchor="end" className="fill-indigo" fontSize={11}>
            箭與弦約 90°
          </text>
          <text x={sx + 10} y={ny - 50} className="fill-wood" fontSize={11} fontWeight={700} textAnchor="start">
            中仕掛
          </text>
          <text x={180} y={ny + 30} className="fill-muted" fontSize={10.5}>
            筈（はず）扣在這裡
          </text>
          <text x={180} y={ny + 66} className="fill-vermilion" fontSize={11} fontWeight={700}>
            搭箭太低 → 可能傷到拇指
          </text>
        </g>
      );
    }
    default:
      return (
        <g>
          <text x={178} y={40} className="fill-muted" fontSize={11}>
            換弦時機（沒有官方數字）
          </text>
          <Chip x={176} y={50} w={164} text="弓師：200〜300 射" tone="plain" />
          <Chip x={176} y={80} w={164} text="弓具店：600〜700 射" tone="plain" />
          <Chip x={176} y={110} w={164} text="問答網站：1000〜3000 射" tone="plain" />
          <Chip x={176} y={152} w={164} text="起毛・變細・弦輪變硬 → 換" />
        </g>
      );
  }
}

export default function TsuruSteps({ steps }: { steps: GearStep[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <Stepper steps={steps.map((s) => ({ title: s.title, text: s.text }))} label="弦的準備與更換" autoplayMs={3800}>
        {(i) => (
          <div className="space-y-4">
            <figure className="ill-plate rounded-xl p-2 sm:p-3">
              <svg viewBox="0 0 360 256" role="img" aria-label={`弦的示意圖：${steps[i].title}`} className="mx-auto block h-auto w-full max-w-lg">
                <Bow step={i} />
                <Panel step={i} />
              </svg>
              <figcaption className="mt-1 px-1 text-xs leading-relaxed text-muted">
                示意圖（本站繪製）：張弦後的弓側面，橫向放大以便看清弓把；中仕掛的長度與做法依弓具店與指導者。
              </figcaption>
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
