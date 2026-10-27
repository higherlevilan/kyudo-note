"use client";

// 八節播放器: steps (or auto-plays) the existing archer figure through 執弓の姿勢 → 八節 → 弓倒し,
// front view plus the view from the target, with the reminders already written for each 節
// (CUES in src/content/shaho.ts: ANKF〈射法について〉, 用語辞典, 指導書). Between neighbouring poses
// the figure is blended from one pose to the next; the in-between frames are only a visual aid.

import Stepper from "@/components/course/Stepper";
import { CUES, POSTLUDE, PRELUDE, SECTIONS } from "@/content/shaho";
import type { PoseId } from "@/content/illustrations/archer/poses";
import ArcherStage, { useTweenedPose } from "./ArcherStage";

interface PlayerStep {
  pose: PoseId;
  /** section anchor on the page */
  href: string;
  title: string;
  /** shown in the plate corner */
  term: string;
  cues: string[];
}

const sec = (id: string) => [PRELUDE, ...SECTIONS, POSTLUDE].find((s) => s.id === id)!;

function step(pose: PoseId, sectionId: string, term: string, cueIdx: number[]): PlayerStep {
  const s = sec(sectionId);
  const name = term === s.term ? term : `${s.term}（${term}）`;
  const label = s.no != null ? `第 ${s.no} 節　${name}` : name;
  return { pose, href: `#${pose === "daisan" ? "daisan" : sectionId}`, title: label, term, cues: cueIdx.map((i) => CUES[pose][i]).filter(Boolean) };
}

const STEPS: PlayerStep[] = [
  step("torimi", "torimi", "執弓の姿勢", [0, 1]),
  step("ashibumi", "ashibumi", "足踏み", [0, 1]),
  step("dozukuri", "dozukuri", "胴造り", [0, 1]),
  step("yugamae", "yugamae", "弓構え", [0, 1]),
  step("uchiokoshi", "uchiokoshi", "打起し", [0, 1]),
  step("daisan", "hikiwake", "大三", [0, 1]),
  step("hikiwake", "hikiwake", "引分け", [0, 2]),
  step("kai", "kai", "会", [0, 2]),
  step("hanare", "hanare", "離れ", [0, 2]),
  step("zanshin", "zanshin", "残心", [0, 2]),
  step("yudaoshi", "yudaoshi", "弓倒し", [0, 1]),
];

function Plate({ i }: { i: number }) {
  const s = STEPS[i];
  const { pose, fade } = useTweenedPose(s.pose);
  return (
    <figure className="ill-plate rounded-xl p-2 sm:p-3">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span lang="ja" className="text-lg font-semibold">
          {s.term}
        </span>
        <span className="text-xs text-muted tabular-nums">
          {i + 1} / {STEPS.length}
        </span>
      </div>
      <div className="mx-auto max-w-[30rem]">
        <ArcherStage pose={pose} fade={fade} side />
      </div>
      <figcaption className="mt-1 px-1 text-xs leading-5 text-muted">
        左：正面（靶在右方）。右：從靶的方向看。插圖依官方與指導書的描述以程式繪製，動作之間的過渡畫面只是示意（本站整理）。
      </figcaption>
    </figure>
  );
}

export default function HassetsuPlayer() {
  return (
    <Stepper
      label="射法八節的步驟"
      autoplayMs={3200}
      steps={STEPS.map((s) => ({
        title: s.title,
        text: (
          <>
            <ul className="list-disc space-y-0.5 pl-5">
              {s.cues.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <a href={s.href} className="mt-1 inline-block text-sm text-wood underline">
              看這一節的說明
            </a>
          </>
        ),
      }))}
    >
      {(i) => <Plate i={i} />}
    </Stepper>
  );
}
