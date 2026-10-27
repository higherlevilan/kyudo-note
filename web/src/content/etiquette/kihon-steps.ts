// 〈基本體〉的步驟播放器：站姿 → 坐下成跪坐 → 起身，回到站姿。
// 要點全部取自 kihontai.ts 的「怎麼做」（坐り方、跪坐、立ち方）；圖只畫這些文字寫到的姿勢，
// 膝蓋何時著地、腳尖怎麼立起等細節沒有可引用的一手文字，所以不畫過程，只畫前後兩個姿勢。

import type { Point } from "../types";
import { KIHON } from "./kihontai";

/** Side-view poses drawn by components/etiquette/KihonTransition.tsx. */
export type SidePose = "stand" | "stepBack" | "kiza" | "koshi" | "stepOut" | "standFwd";

export interface KihonStep {
  id: string;
  title: string;
  text: string;
  pose: SidePose;
  points: Point[];
}

const howto = (id: string, starts: string): Point[] => {
  const p = KIHON.find((k) => k.id === id)?.howto.find((h) => h.text.startsWith(starts));
  return p ? [p] : [];
};

export const KIHON_STEPS: KihonStep[] = [
  {
    id: "stand",
    title: "立った姿勢：先站好",
    text: "背脊伸直，視線經過鼻頭落在約 4 公尺前方。",
    pose: "stand",
    points: [...howto("tatta-shisei", "背脊伸直"), ...howto("tatta-shisei", "雙腳")],
  },
  {
    id: "step-back",
    title: "坐り方①：右腳後退半足",
    text: "半足＝腳掌長度的一半。",
    pose: "stepBack",
    points: [...howto("suwarikata", "右腳往後退半足"), ...howto("suwarikata", "半足")],
  },
  {
    id: "kiza",
    title: "坐り方②：垂直沉下，成跪坐",
    text: "腳尖立起、雙膝著地、臀部坐在腳跟上。",
    pose: "kiza",
    points: [...howto("kiza", "跪坐（きざ）"), ...howto("kiza", "射場裡等候"), ...howto("suwarikata", "起身出左腳")],
  },
  {
    id: "koshi",
    title: "立ち方①：腰を切る",
    text: "把骨盆挺起，臀部離開腳跟。",
    pose: "koshi",
    points: [...howto("tachikata", "從跪坐起身")],
  },
  {
    id: "step-out",
    title: "立ち方②：踏出左腳站起",
    text: "以腳尖為軸，不破壞胴造り地站起。",
    pose: "stepOut",
    points: [...howto("tachikata", "踏出左腳")],
  },
  {
    id: "stand-again",
    title: "雙腳併攏，回到站姿",
    text: "整個動作配合呼吸（息合い）。",
    pose: "standFwd",
    points: [
      ...howto("tachikata", "頸後與背脊伸直"),
      { text: "膝蓋何時著地、腳尖怎麼立起、起身時重心怎麼移，本站沒有找到可引用的一手文字：請跟老師當面學，以所屬道場的教法為準。", tag: "note" },
    ],
  },
];
