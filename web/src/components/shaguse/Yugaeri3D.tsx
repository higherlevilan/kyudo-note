"use client";

// 弓返り的 3D 步驟圖：会 → 離れ瞬間 → 弓返り後，從上方看握的地方。
// 圓環代表握（手の内），不畫手。來源只說「弦轉到左手手背那一側」，沒有寫轉的方向，
// 所以第 3 步只畫轉完的位置（淡出／淡入），不畫轉的路徑。可切換「沒有弓返り（打ち切り）」比較。

import { useState } from "react";
import Stepper, { type StepDef } from "@/components/course/Stepper";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import { FigureNotes } from "@/components/content/Blocks";
import ThreeStage, { type ViewPreset } from "@/components/three/ThreeStage";
import type { YugaeriProps } from "@/components/three/scenes/yugaeri";
import { ANKF, BUDOKAN, STUDY } from "@/content/shaguse/sources";

type Mode = YugaeriProps["mode"];

const VIEWS: ViewPreset[] = [
  { id: "top", label: "俯視", pos: [0.25, 1.4, 0.02], target: [0.25, 0, 0] },
  { id: "close", label: "近看握", pos: [-0.02, 0.62, 0.01], target: [-0.02, 0, 0] },
  { id: "oblique", label: "斜め", pos: [0.95, 0.75, 1.15], target: [0.2, -0.12, 0] },
];

const COMMON: StepDef[] = [
  {
    title: "会",
    text: "拉滿，弦拉到胸前（胸弦）。藍色圓環代表左手握弓的地方（手の内），不是手的形狀。",
  },
  {
    title: "離れ瞬間",
    text: "箭離弦，弦彈回張弦時的位置（握到弦約 15 cm）。圖把「弦彈回」和「弓轉動」分成兩步畫，實際上是連續發生的。",
  },
];

const LAST: Record<Mode, StepDef> = {
  yugaeri: {
    title: "弓返り後",
    text: (
      <>
        弓在左手中轉動，弦轉到左手手背那一側（全弓連用語辭典）。淡色的是轉動前的位置。
        轉的方向與角度，本站引用的來源沒有寫明，所以圖只畫轉完的位置，不畫轉的路徑。研究測得弓返り約 0.165～0.253 秒（森 1982，n=10），動畫放慢了。
      </>
    ),
  },
  uchikiri: {
    title: "沒有弓返り（打ち切り）",
    text: (
      <>
        打ち切り：「用力握緊弓，不讓它弓返り。」（全弓連用語辭典）弓不轉，弦停在射手這一側。有些流派或指導者會刻意採用，所以沒有弓返り不一定是射癖；初學者本來就不會有弓返り。
      </>
    ),
  },
};

const MODES: { id: Mode; label: string }[] = [
  { id: "yugaeri", label: "有弓返り" },
  { id: "uchikiri", label: "沒有弓返り（握緊・打ち切り）" },
];

export default function Yugaeri3D() {
  const [mode, setMode] = useState<Mode>("yugaeri");
  const steps = [...COMMON, LAST[mode]];

  const btn = "inline-flex min-h-10 items-center rounded-lg border px-3 text-sm font-semibold transition-colors";

  return (
    <FigureFrame
      id="yugaeri-3d"
      title="弓返り（俯視示意）"
      caption="從握的上方往下看弓的斷面、弦與握；張弦時握到弦約 15 cm 按比例，其餘是示意。"
      sources={[ANKF.terminology, ANKF.syaho, BUDOKAN.ch2, STUDY.mori1982]}
    >
      <Stepper steps={steps} label="弓返り的步驟">
        {(step) => (
          <ThreeStage
            load={() => import("@/components/three/scenes/yugaeri")}
            props={{ step, mode }}
            label="弓返り的俯視示意圖"
            description={`從上方看左手握弓的地方：弓的斷面、弦，以及代表握的圓環。現在是第 ${step + 1} 步「${steps[step].title}」。${
              step === 2
                ? mode === "yugaeri"
                  ? "弓已在手中轉動，弦在左手手背那一側。"
                  : "握緊（打ち切り），弓沒有轉，弦還在射手這一側。"
                : step === 1
                  ? "弦彈回張弦的位置，在射手這一側。"
                  : "弦拉到胸前。"
            }`}
            fallback={<p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">這台裝置無法顯示 3D 圖；請看下方各步驟的文字說明。</p>}
            views={VIEWS}
            aspect="16 / 10"
          >
            <div role="group" aria-label="比較有沒有弓返り（影響第 3 步）" className="flex flex-wrap gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={`${btn} ${mode === m.id ? "border-wood bg-wood-soft text-ink" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </ThreeStage>
        )}
      </Stepper>
      <FigureNotes>
        <p>
          從握的上方把弓切開往下看：看得到弓的斷面、弦，和代表握的圓環。張弦時握到弦約 15 cm 按比例；会的時候弦拉開的距離以約 85 cm 示意；弓的厚度放大 2 倍，斷面形狀是示意。
        </p>
        <p>「弦轉到左手手背那一側」是全弓連用語辭典的說法；轉的方向、角度與手背側的確切範圍來源沒有寫明，圖上的停止位置與「手背側」弧線都是示意。</p>
      </FigureNotes>
    </FigureFrame>
  );
}
