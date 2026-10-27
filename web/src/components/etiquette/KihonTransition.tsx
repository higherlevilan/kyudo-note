"use client";

// 基本體的步驟播放器：側面的簡筆人形（面向右），從站姿坐下成跪坐，再起身回到站姿。
// 每一步畫「這一步做完的姿勢」，淡色虛影是上一步的姿勢；過程中的細節（膝蓋何時著地等）
// 沒有可引用的一手文字，所以不畫。比例只是示意。

import Stepper from "@/components/course/Stepper";
import { PointList } from "@/components/content/Blocks";
import type { KihonStep, SidePose } from "@/content/etiquette/kihon-steps";

type P = [number, number];

interface Leg {
  knee: P;
  ankle: P;
  /** heel → (ball →) toe */
  foot: P[];
}

interface Body {
  hip: P;
  shoulder: P;
  head: P;
  /** 左腳（靠近觀看者） */
  near: Leg;
  /** 右腳（遠側） */
  far: Leg;
}

const GROUND = 204;

function standing(x: number, farBack = 0): Body {
  const leg = (dx: number): Leg => ({
    knee: [x + 1 + dx, 157],
    ankle: [x + dx, 199],
    foot: [
      [x - 4 + dx, GROUND - 1],
      [x + 18 + dx, GROUND - 1],
    ],
  });
  return { hip: [x, 110], shoulder: [x, 54], head: [x + 1, 38], near: leg(0), far: leg(farBack) };
}

/** kneeling legs (跪坐): knee on the floor, toes turned up under the heel */
function kneelLeg(dx = 0): Leg {
  return {
    knee: [126 + dx, 196],
    ankle: [86 + dx, 184],
    foot: [
      [86 + dx, 184],
      [83 + dx, GROUND - 2],
      [94 + dx, GROUND - 1],
    ],
  };
}

const POSES: Record<SidePose, Body> = {
  stand: standing(90),
  stepBack: standing(90, -11),
  kiza: { hip: [88, 170], shoulder: [88, 114], head: [89, 98], near: kneelLeg(), far: kneelLeg(-3) },
  koshi: { hip: [104, 156], shoulder: [104, 100], head: [105, 84], near: kneelLeg(), far: kneelLeg(-3) },
  stepOut: {
    hip: [124, 152],
    shoulder: [124, 96],
    head: [125, 80],
    near: {
      knee: [166, 154],
      ankle: [168, 198],
      foot: [
        [164, GROUND - 1],
        [186, GROUND - 1],
      ],
    },
    far: kneelLeg(),
  },
  standFwd: standing(166),
};

const pts = (ps: P[]) => ps.map((p) => p.join(" ")).join(" L");

function Figure({ b, ghost }: { b: Body; ghost?: boolean }) {
  const ink = ghost ? "stroke-muted" : "stroke-ink";
  const leg = (l: Leg, cls: string) => <path d={`M${pts([b.hip, l.knee, l.ankle])} M${pts(l.foot)}`} className={cls} strokeWidth={ghost ? 2 : 5} />;
  const fist: P = [b.shoulder[0] + 7, b.hip[1] - 2];
  const elbow: P = [b.shoulder[0] + 2, (b.shoulder[1] + b.hip[1]) / 2 + 2];
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={ghost ? 0.35 : 1} strokeDasharray={ghost ? "4 4" : undefined}>
      {leg(b.far, "stroke-muted")}
      <path d={`M${pts([b.hip, b.shoulder])}`} className={ink} strokeWidth={ghost ? 2 : 8} />
      {leg(b.near, ink)}
      <path d={`M${pts([b.shoulder, elbow, fist])}`} className={ink} strokeWidth={ghost ? 2 : 4} />
      <circle cx={b.head[0]} cy={b.head[1]} r={11} className={`${ink} ${ghost ? "" : "fill-surface"}`} strokeWidth={ghost ? 2 : 3} />
      {!ghost && <circle cx={b.head[0] + 5} cy={b.head[1] - 2} r={1.6} className="fill-ink stroke-none" />}
    </g>
  );
}

function Notes({ pose }: { pose: SidePose }) {
  switch (pose) {
    case "stand":
      return (
        <g>
          <line x1={97} y1={37} x2={300} y2={110} className="stroke-wood" strokeWidth={1.4} strokeDasharray="4 4" />
          <text x={326} y={130} textAnchor="end" className="fill-wood" fontSize={11.5}>
            視線：約 4 m 前方
          </text>
        </g>
      );
    case "stepBack":
      return (
        <g className="fill-vermilion">
          <path d="M97 214 H108 M97 210 v8 M108 210 v8" className="stroke-vermilion" strokeWidth={1.4} />
          <text x={114} y={218} fontSize={11.5} fontWeight={700}>
            右腳後退半足
          </text>
        </g>
      );
    case "kiza":
      return (
        <g>
          <path d="M40 112 V160" className="stroke-vermilion" strokeWidth={1.6} />
          <path d="M40 166 l-5 -9 h10 z" className="fill-vermilion" />
          <text x={14} y={104} className="fill-vermilion" fontSize={11.5} fontWeight={700}>
            垂直沉下
          </text>
          <text x={100} y={218} textAnchor="middle" className="fill-muted" fontSize={11}>
            腳尖立起・臀部坐在腳跟上
          </text>
        </g>
      );
    case "koshi":
      return (
        <g>
          <path d="M140 170 V140" className="stroke-vermilion" strokeWidth={1.6} />
          <path d="M140 134 l-5 9 h10 z" className="fill-vermilion" />
          <text x={148} y={150} className="fill-vermilion" fontSize={11.5} fontWeight={700}>
            腰を切る
          </text>
          <text x={148} y={166} className="fill-muted" fontSize={11}>
            臀部離開腳跟
          </text>
        </g>
      );
    case "stepOut":
      return (
        <g>
          <text x={176} y={146} className="fill-vermilion" fontSize={11.5} fontWeight={700}>
            踏出左腳
          </text>
          <text x={100} y={218} textAnchor="middle" className="fill-muted" fontSize={11}>
            以腳尖為軸
          </text>
        </g>
      );
    case "standFwd":
      return (
        <text x={196} y={200} className="fill-vermilion" fontSize={11.5} fontWeight={700}>
          雙腳併攏
        </text>
      );
  }
}

function SideView({ pose, prev }: { pose: SidePose; prev?: SidePose }) {
  return (
    <svg viewBox="0 0 340 224" role="img" aria-label="基本體側面示意：簡筆人形面向右方" className="mx-auto block h-auto w-full max-w-md">
      <line x1={10} y1={GROUND} x2={330} y2={GROUND} className="stroke-line" strokeWidth={2} />
      {prev && prev !== pose && <Figure b={POSES[prev]} ghost />}
      <Figure b={POSES[pose]} />
      <Notes pose={pose} />
    </svg>
  );
}

export default function KihonTransition({ steps }: { steps: KihonStep[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <p className="mb-3 text-sm text-muted">坐下與起身，是坐射裡最常重複的兩個動作。跟著播放器走一遍（側面示意，面向右）。</p>
      <Stepper steps={steps.map((s) => ({ title: s.title, text: s.text }))} label="坐下與起身的步驟" autoplayMs={3200}>
        {(i) => (
          <div className="space-y-4">
            <figure className="ill-plate rounded-xl p-2 sm:p-3">
              <SideView pose={steps[i].pose} prev={steps[i - 1]?.pose} />
              <figcaption className="mt-1 px-1 text-xs leading-relaxed text-muted">
                簡筆示意，不按比例：實線是這一步做完的姿勢，虛影是上一步。深色腳是左腳，淺色是右腳。
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
