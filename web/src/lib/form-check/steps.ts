// Which 射法八節 moments the form check looks at, which canonical pose each is compared with,
// and which metrics are meaningful for it in a single front view.

import type { PoseId } from "@/content/illustrations/archer/poses";
import type { MetricId } from "./metrics";

export const STEP_IDS = ["ashibumi", "dozukuri", "yugamae", "uchiokoshi", "daisan", "kai", "hanare", "zanshin"] as const;
export type StepId = (typeof STEP_IDS)[number];

export interface StepDef {
  id: StepId;
  /** Japanese term (render with lang="ja") */
  term: string;
  /** short reading aid in Chinese */
  zh: string;
  /** canonical illustration pose */
  pose: PoseId;
  /** metrics compared for this step, in display order */
  metrics: MetricId[];
  /** metrics strongly affected by depth here (arm pointing at the camera): wider tolerance + a note */
  loose?: MetricId[];
  /** how the automatic guess is made (shown to the user) */
  auto: string;
}

export const STEPS: Record<StepId, StepDef> = {
  ashibumi: {
    id: "ashibumi",
    term: "足踏み",
    zh: "踏開雙腳",
    pose: "ashibumi",
    metrics: ["stance", "torsoLean", "shoulderTilt"],
    auto: "雙腳踏開到與會時相近寬度之後的畫面",
  },
  dozukuri: {
    id: "dozukuri",
    term: "胴造り",
    zh: "穩定上身",
    pose: "dozukuri",
    metrics: ["torsoLean", "shoulderTilt"],
    auto: "足踏み之後、轉頭看靶（物見）之前最靜止的一秒",
  },
  yugamae: {
    id: "yugamae",
    term: "弓構え",
    zh: "取懸け・手の内・物見",
    pose: "yugamae",
    metrics: ["fistRise", "handsCenter", "wristDiff", "headTurn", "shoulderTilt"],
    auto: "雙手開始往上舉（打起し）之前最靜止的畫面",
  },
  uchiokoshi: {
    id: "uchiokoshi",
    term: "打起し",
    zh: "舉起雙拳",
    pose: "uchiokoshi",
    metrics: ["fistRise", "handsCenter", "wristDiff", "shoulderTilt", "headTurn"],
    auto: "會之前雙拳最高、兩手距離最小的畫面",
  },
  daisan: {
    id: "daisan",
    term: "大三",
    zh: "引分け的第一段",
    pose: "daisan",
    metrics: ["fistElevL", "elbowL", "wristDiff", "shoulderTilt"],
    loose: ["elbowL"],
    auto: "打起し之後、弓手推向靶並短暫停住的畫面",
  },
  kai: {
    id: "kai",
    term: "会",
    zh: "拉滿",
    pose: "kai",
    metrics: ["wristDiff", "fistElevL", "elbowL", "shoulderTilt", "torsoLean", "headTurn"],
    auto: "雙手張開最大、弓手接近水平並保持最久的一段",
  },
  hanare: {
    id: "hanare",
    term: "離れ",
    zh: "放箭",
    pose: "hanare",
    metrics: [],
    auto: "會之後妻手（右手腕）速度最快的瞬間",
  },
  zanshin: {
    id: "zanshin",
    term: "残心",
    zh: "放箭後的姿勢",
    pose: "zanshin",
    metrics: ["fistElevL", "fistElevR", "elbowL", "shoulderTilt", "torsoLean", "headTurn"],
    auto: "離れ之後雙手重新靜止的畫面",
  },
};
