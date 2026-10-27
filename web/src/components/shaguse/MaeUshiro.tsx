"use client";

// 矢所的「前」「後」, step by step: a top view of the archer and the target beside the target face
// as the archer sees it. Restates MAE_USHIRO (src/content/shaguse/yadokoro.ts): a common club
// usage (一般說法), not an official definition. Everyone holds the bow in the left hand, so there is
// no mirrored version.

import Stepper from "@/components/course/Stepper";
import { TagBadge, Cites } from "@/components/content/Blocks";
import { WEB } from "@/content/shaguse/sources";
import { useProgress } from "./anim";

const RED = "var(--vermilion)";
const INK = "var(--ink)";
const MUTED = "var(--muted)";

// Top view: archer at (52, 96), target edge-on at x = 214. Face inset centred at (282, 96).
const AX = 52;
const AY = 96;
const TX = 214;
const FX = 284;
const FY = 96;
const FR = 34;

type Side = "none" | "mae" | "ushiro";

interface Step {
  title: string;
  text: string;
  side: Side;
}

const STEPS: Step[] = [
  {
    title: "射手怎麼站",
    text: "足踏み時身體正面朝向脇正面，靶在左手邊。射手身體正面那一側叫「前」，背後那一側叫「後」。",
    side: "none",
  },
  {
    title: "箭偏「前」",
    text: "箭往射手身體正面那一側偏。從射手看過去，落在靶的右側。",
    side: "mae",
  },
  {
    title: "箭偏「後」",
    text: "箭往射手背後那一側偏。從射手看過去，落在靶的左側。",
    side: "ushiro",
  },
];

function Label({ x, y, children, fill = INK, anchor = "middle", size = 12 }: { x: number; y: number; children: string; fill?: string; anchor?: "start" | "middle" | "end"; size?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} stroke="#fbf7ef" strokeWidth={3} paintOrder="stroke">
      {children}
    </text>
  );
}

function Diagram({ i }: { i: number }) {
  const s = STEPS[i];
  const p = useProgress(i, 900);
  // 前 (the archer's front) is toward the bottom of the top view.
  const sideSign = s.side === "mae" ? 1 : s.side === "ushiro" ? -1 : 0;
  // Where the arrow lands on the face (as the archer sees it): 前 → right.
  const faceDx = s.side === "none" ? 0 : s.side === "mae" ? 1 : -1;
  const hitY = AY + sideSign * 13;
  const path = `M${AX + 12} ${AY}Q${(AX + TX) / 2} ${AY} ${TX} ${hitY}`;
  const landed = p > 0.85;
  return (
    <figure className="ill-plate rounded-xl p-2 sm:p-3">
      <svg viewBox="0 0 330 186" className="block h-auto w-full" role="img" aria-label={`示意圖：${s.title}。${s.text}`}>
        {/* top view */}
        <Label x={(AX + TX) / 2 + 10} y={16} fill={MUTED} size={11}>
          從上方看
        </Label>
        <path d={`M${AX + 12} ${AY}H${TX}`} stroke="var(--line)" strokeWidth={1} strokeDasharray="3 3" />
        {/* archer: shoulders, head turned toward the target, feet */}
        <g>
          <ellipse cx={AX} cy={AY} rx={11} ry={20} fill="var(--surface)" stroke={INK} strokeWidth={1.2} />
          <circle cx={AX + 1} cy={AY} r={7} fill={INK} />
          <path d={`M${AX + 4} ${AY - 3}l6 3l-6 3`} fill="var(--surface)" />
        </g>
        {/* 前 / 後 sides of the archer */}
        <path d={`M${AX - 30} ${AY + 34}h46`} stroke={RED} strokeWidth={1} opacity={0.5} />
        <Label x={AX - 6} y={AY + 50} fill={RED}>
          前（身體正面）
        </Label>
        <Label x={AX - 6} y={AY - 42} fill={MUTED}>
          後（背後）
        </Label>
        {/* target, edge-on */}
        <path d={`M${TX} ${AY - 20}V${AY + 20}`} stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
        <Label x={TX} y={AY - 28} size={13}>
          的
        </Label>
        {s.side !== "none" && (
          <>
            <path d={path} fill="none" stroke={RED} strokeWidth={1.8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
            {landed && <circle cx={TX - 2} cy={hitY} r={3} fill={RED} />}
          </>
        )}

        {/* the face as the archer sees it */}
        <Label x={FX} y={16} fill={MUTED} size={11}>
          射手看到的靶
        </Label>
        <g>
          <circle cx={FX} cy={FY} r={FR} fill="#fffbf3" stroke={INK} strokeWidth={1} />
          {[0.82, 0.62, 0.42].map((k) => (
            <circle key={k} cx={FX} cy={FY} r={FR * k} fill="none" stroke={INK} strokeWidth={FR * 0.09} />
          ))}
          <circle cx={FX} cy={FY} r={FR * 0.2} fill={INK} />
        </g>
        <Label x={FX + FR + 2} y={FY + FR + 18} anchor="end" fill={faceDx !== 0 || i === 0 ? RED : MUTED} size={11.5}>
          ← 後　　前 →
        </Label>
        {faceDx !== 0 && landed && <circle cx={FX + faceDx * FR * 0.72} cy={FY + 2} r={4} fill={RED} stroke="#fbf7ef" strokeWidth={1.2} />}
      </svg>
      <figcaption className="mt-1 px-1 text-xs leading-5 text-muted">
        「前＝靶的右側」是社團間的一般說法，全弓連用語辭典與指導書沒有直接的定義句。弓道一律左手持弓、右手拉弦（《弓道競技規則》規定右手必戴弽），所以每位射手的前後都一樣。圖是示意，不是實際落點。
      </figcaption>
    </figure>
  );
}

export default function MaeUshiro() {
  return (
    <Stepper
      label="矢所的前與後"
      autoplayMs={3000}
      steps={STEPS.map((s) => ({
        title: s.title,
        text: (
          <>
            <TagBadge tag="folk" />
            {s.text}
            <Cites src={[WEB.kyusho]} />
          </>
        ),
      }))}
    >
      {(i) => <Diagram i={i} />}
    </Stepper>
  );
}
