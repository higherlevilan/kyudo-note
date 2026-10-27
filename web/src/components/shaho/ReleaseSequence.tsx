"use client";

// 会 → 離れ → 残心, step by step: the existing 会 / 離れ / 残心 poses with a few marks drawn on
// top (口割 line, 伸合い arrows, the arrow leaving, 弓返り, 縦横十文字). Every caption restates the
// 射法八節 page (ANKF〈射法について〉and 用語辞典); the marks are a visual aid (本站整理).

import { useEffect, useState } from "react";
import Stepper from "@/components/course/Stepper";
import { ARROW_LEN, add, armJoints, bowGeom, mul } from "@/components/illustrations/archer/geometry";
import { FRAMES } from "@/components/illustrations/archer/ArcherFigure";
import { ease } from "@/components/illustrations/archer/tween";
import { POSES, type PoseId } from "@/content/illustrations/archer/poses";
import { TagBadge, Cites } from "./SectionBlocks";
import ArcherStage, { animate, useTweenedPose } from "./ArcherStage";

const r1 = (n: number) => Math.round(n * 10) / 10;

// Arrow at full draw (front view: x as is, y flipped).
const KAI = POSES.kai;
const kaiL = armJoints("left", KAI.left);
const kaiR = armJoints("right", KAI.right);
const kaiBow = bowGeom(KAI, kaiL.hand);
const nock = add(kaiBow.nock, mul(kaiBow.r, 1.2));
const tip = add(nock, mul(kaiBow.b, ARROW_LEN));
const ARROW = { x0: nock[0], x1: tip[0], y: -nock[1] };
const FRONT = FRAMES.front;
/** how far the arrow travels to leave the plate */
const FLY = FRONT.x + FRONT.w - ARROW.x0 + 6;

const ZAN = POSES.zanshin;
const zanL = armJoints("left", ZAN.left);
const zanBow = bowGeom(ZAN, zanL.hand);

const RED = "var(--vermilion)";
const INK = "var(--ink)";
const MUTED = "var(--muted)";

interface Step {
  pose: PoseId;
  title: string;
  text: string;
  tag: "official" | "note";
  src: ("syaho" | "terminology")[];
}

const STEPS: Step[] = [
  {
    pose: "kai",
    title: "会：拉滿，持續",
    text: "矢束充分拉滿之後持續的狀態。箭在嘴唇的高度（口割）、貼著臉頰（頬付け），弦貼在胸前（胸弦）。",
    tag: "official",
    src: ["syaho", "terminology"],
  },
  {
    pose: "kai",
    title: "会：伸合い",
    text: "不憋氣，等腹部的力量充滿到八、九分。各關節咬合（詰合い），上下左右持續伸展（伸合い），不刻意數秒。",
    tag: "official",
    src: ["syaho", "terminology"],
  },
  {
    pose: "hanare",
    title: "離れ：箭離弦",
    text: "胸廓大幅打開、身體往四方伸展，在時機成熟時放出；官方辭典稱為「自然の離れ」。兩臂沿一直線向左右展開。",
    tag: "official",
    src: ["syaho", "terminology"],
  },
  {
    pose: "hanare",
    title: "離れ：弓返り",
    text: "放箭後弓在左手中轉動，弦轉到左手手背一側（弓返り）。有些流派刻意握住弓、不讓它轉（打ち切り），所以沒有弓返り不一定都算毛病。",
    tag: "official",
    src: ["terminology"],
  },
  {
    pose: "zanshin",
    title: "残心：留住姿勢與心",
    text: "保持離れ之後的姿勢，視線停在箭著的位置（矢所）；縱線（腳到頭）與橫線（兩肩兩臂）仍保持十字（縦横十文字）。官方沒有規定要停幾秒。",
    tag: "official",
    src: ["syaho", "terminology"],
  },
];

function Arrowhead({ x, y, dir }: { x: number; y: number; dir: "l" | "r" | "u" }) {
  const d = dir === "r" ? `M${x - 4} ${y - 3}L${x} ${y}L${x - 4} ${y + 3}` : dir === "l" ? `M${x + 4} ${y - 3}L${x} ${y}L${x + 4} ${y + 3}` : `M${x - 3} ${y + 4}L${x} ${y}L${x + 3} ${y + 4}`;
  return <path d={d} fill="none" stroke={RED} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />;
}

function Label({ x, y, children, anchor = "start" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} fontSize={9.5} fill={RED} textAnchor={anchor} stroke="#fbf7ef" strokeWidth={2.5} paintOrder="stroke" lang="ja">
      {children}
    </text>
  );
}

function Overlay({ i, fly }: { i: number; fly: number }) {
  if (i === 0) {
    return (
      <g>
        <path d={`M${FRONT.x + 4} ${ARROW.y}H${ARROW.x0 - 9}`} stroke={RED} strokeWidth={0.8} strokeDasharray="2.5 2.5" />
        <Label x={FRONT.x + 4} y={ARROW.y - 9}>口割</Label>
        <Label x={FRONT.x + 4} y={ARROW.y + 16}>嘴唇的高度</Label>
      </g>
    );
  }
  if (i === 1) {
    const ly = -kaiL.hand[1] + 14;
    const ry = -kaiR.elbow[1] + 12;
    return (
      <g fill="none" stroke={RED} strokeWidth={1.2} strokeLinecap="round">
        <path d={`M${r1(kaiL.hand[0] - 4)} ${r1(ly)}h22`} />
        <Arrowhead x={r1(kaiL.hand[0] + 18)} y={r1(ly)} dir="r" />
        <path d={`M${r1(kaiR.elbow[0] + 4)} ${r1(ry)}h-22`} />
        <Arrowhead x={r1(kaiR.elbow[0] - 18)} y={r1(ry)} dir="l" />
        <path d="M0 -176v-16" />
        <Arrowhead x={0} y={-192} dir="u" />
        <Label x={0} y={-197} anchor="middle">伸合い</Label>
      </g>
    );
  }
  if (i === 2) {
    const dx = fly * FLY;
    if (fly >= 1) return null;
    return (
      <g transform={`translate(${r1(dx)} 0)`} opacity={fly > 0.85 ? (1 - fly) / 0.15 : 1}>
        <path d={`M${r1(ARROW.x0)} ${r1(ARROW.y)}H${r1(ARROW.x1)}`} stroke={INK} strokeWidth={1.1} strokeLinecap="round" />
        <path d={`M${r1(ARROW.x1)} ${r1(ARROW.y)}l-4 -1.6v3.2Z`} fill={INK} />
        <path d={`M${r1(ARROW.x0 + 2)} ${r1(ARROW.y)}l6 -2.4M${r1(ARROW.x0 + 2)} ${r1(ARROW.y)}l6 2.4`} stroke={MUTED} strokeWidth={0.9} strokeLinecap="round" />
      </g>
    );
  }
  if (i === 3) {
    const g = zanBow.grip;
    return (
      <g>
        <circle cx={r1(g[0])} cy={r1(-g[1])} r={13} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="2.5 2" />
        <Label x={r1(g[0])} y={r1(-g[1] + 26)} anchor="middle">弓返り</Label>
      </g>
    );
  }
  // 残心: 縦横十文字
  const sy = -140;
  return (
    <g stroke={RED} strokeWidth={0.9} strokeDasharray="3 2.5" fill="none">
      <path d="M0 -2V-182" />
      <path d={`M-70 ${sy}H${r1(zanL.hand[0] + 6)}`} />
      <g stroke="none">
        <Label x={4} y={-186}>縦横十文字</Label>
      </g>
    </g>
  );
}

function Plate({ i }: { i: number }) {
  const s = STEPS[i];
  const { pose, fade } = useTweenedPose(s.pose, { fast: true });
  const [fly, setFly] = useState(0);
  useEffect(() => {
    if (i !== 2) return;
    // Let the release pose land first, then send the arrow off.
    return animate(700, (t) => setFly(t < 0.12 ? 0 : ease((t - 0.12) / 0.88)));
  }, [i]);
  return (
    <figure className="ill-plate rounded-xl p-2 sm:p-3">
      <div className="mx-auto max-w-[22rem]">
        <ArcherStage pose={pose} fade={fade} overlay={<Overlay i={i} fly={i === 2 ? fly : 0} />} />
      </div>
      <figcaption className="mt-1 px-1 text-xs leading-5 text-muted">正面圖，靶在右方。紅色記號是本站加上的示意，不是量測值。</figcaption>
    </figure>
  );
}

export default function ReleaseSequence() {
  return (
    <Stepper
      label="会、離れ、残心的步驟"
      autoplayMs={3000}
      steps={STEPS.map((s) => ({
        title: s.title,
        text: (
          <>
            <TagBadge tag={s.tag} />
            {s.text}
            <Cites src={s.src} />
          </>
        ),
      }))}
    >
      {(i) => <Plate i={i} />}
    </Stepper>
  );
}
