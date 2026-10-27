"use client";

// 足踏み的立體圖：射位地板上的兩隻足袋腳底，一步一步踏開（不畫人）。
// 依據：全弓連〈射法について〉（矢束を標準に、約60度）、〈弓道用語辞典〉；指導書第Ⅳ章（一足／二足、雙腳靠攏）、
// 第Ⅴ章（左腳先踏開半步，看右腳腳下再踏開半步）；〈立射の作法〉（看靶做足踏み）。一足的細節網站資料沒有寫，只畫前後位置。
// 不支援 WebGL 時改顯示原本的俯視腳印圖 Footprints。

import { useState } from "react";
import Stepper, { type StepDef } from "@/components/course/Stepper";
import ThreeStage, { type ViewPreset } from "@/components/three/ThreeStage";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import Footprints from "@/components/illustrations/archer/Footprints";
import { ANKF } from "@/content/common-sources";
import { SOURCES } from "@/content/sources";
import type { AshibumiMethod, AshibumiProps } from "@/components/three/scenes/ashibumi";

const VIEWS: ViewPreset[] = [
  { id: "top", label: "從上方看", pos: [0.3, 2.3, 0.28], target: [0.3, 0, -0.22] },
  { id: "mato", label: "從靶的方向看", pos: [1.3, 0.5, 0.02], target: [0, 0, -0.2] },
  { id: "side", label: "側面", pos: [0.25, 0.55, 1.7], target: [0.25, 0.03, -0.18] },
];

const START: StepDef = { title: "起點：雙腳靠攏", text: "執弓の姿勢的雙腳靠攏（指導書：男子約 3 公分、女子併攏）。起點畫在拇趾尖的線上，是示意。" };
const LOOK: StepDef = { title: "先看靶", text: "足踏み從看靶（的）開始，再把雙腳踏開。" };
const DONE: StepDef = {
  title: "完成：三個要點",
  text: "兩腳拇趾尖與靶心連成一直線；兩腳尖相距約一個矢束；兩腳向外成外八字、約 60 度。矢束因人而異，不是固定的公分數。",
};

const STEPS: Record<AshibumiMethod, StepDef[]> = {
  ni: [
    START,
    LOOK,
    { title: "左腳先踏開半步", text: "二足（分兩步踏開）：左腳先往外踏開半步。腳移動的路徑只是示意。" },
    { title: "看右腳腳下，右腳再踏開半步", text: "看著右腳腳下，右腳再踏開半步，兩腳就踏開到位。" },
    DONE,
  ],
  ichi: [
    START,
    LOOK,
    {
      title: "一步踏開",
      text: "一足（一步踏開）：網站目前的資料只寫「一步踏開」，沒有寫哪一腳先動、怎麼動，所以這裡只畫前後位置（虛線是起點）。請照所屬道場的教法。",
    },
    DONE,
  ],
};

const METHOD: Record<AshibumiMethod, { label: string; note: string }> = {
  ni: { label: "二足（分兩步）", note: "持箭時箭頭不露出（握在手中）的持法，配二足。" },
  ichi: { label: "一足（一步）", note: "持箭時箭頭露在前方的持法，配一足。" },
};

const btn = "inline-flex min-h-10 items-center rounded-lg border px-3 text-sm font-semibold transition-colors";

export default function Ashibumi3D() {
  const [method, setMethod] = useState<AshibumiMethod>("ni");
  const [step, setStep] = useState(0);
  const pick = (m: AshibumiMethod) => {
    if (m === method) return;
    setMethod(m);
    setStep(0); // the Stepper below remounts at step 0
  };

  return (
    <FigureFrame
      id="ashibumi-3d"
      title="足踏み立體圖"
      caption={
        <>
          不畫人，只畫足袋腳底的輪廓。矢束以 85 cm 示意（實際因人而異），「約矢束」「約 60°」都是約略值；腳的大小照比例，的的大小與距離不按比例。
          二足的順序依指導書第Ⅴ章（左腳先、看右腳腳下再踏右腳）；宮崎縣手冊也是左腳先、再定右腳。一足只畫前後位置。兩種方法和持箭方式連動，選一種並保持一致。
        </>
      }
      sources={[SOURCES.syaho, SOURCES.terminology, ANKF.rissha, SOURCES.b4, SOURCES.b5, SOURCES.miyazaki]}
    >
      <div className="space-y-3">
        <ThreeStage
          load={() => import("@/components/three/scenes/ashibumi")}
          props={{ method, step } satisfies AshibumiProps}
          label="足踏み的立體示意"
          description="射位的地板上畫著兩隻足袋腳底的輪廓與一條通往靶心的虛線。足踏み完成時，兩腳拇趾尖都在這條線上，兩腳尖相距約一個矢束，兩腳向外張開約 60 度。可以切換二足（左腳先踏開半步，再踏右腳）與一足（一步踏開），並一步一步看。"
          fallback={<Footprints className="mx-auto h-auto w-full max-w-sm" />}
          views={VIEWS}
        >
          <div role="group" aria-label="踏開的方法" className="flex w-full flex-wrap items-center gap-1.5">
            {(["ni", "ichi"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={method === m}
                onClick={() => pick(m)}
                className={`${btn} ${method === m ? "border-wood bg-wood-soft text-ink" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`}
              >
                {METHOD[m].label}
              </button>
            ))}
            <p aria-live="polite" className="basis-full text-sm text-muted">
              {METHOD[method].note}
            </p>
          </div>
        </ThreeStage>
        <Stepper key={method} steps={STEPS[method]} onStep={setStep} label={`足踏み的步驟：${METHOD[method].label}`}>
          {() => null}
        </Stepper>
      </div>
    </FigureFrame>
  );
}
