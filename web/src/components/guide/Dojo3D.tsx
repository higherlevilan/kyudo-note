"use client";

// 近的射場的 3D 示意（scenes/dojo.ts，mode "layout"）：切換視角、選射位、「射一箭」、開關尺寸線。
// 和下方的 ShajoLayout（按比例、有出處的俯視圖）是同一個射場；不支援 WebGL 時只留一句話，避免俯視圖出現兩次。

import { useState } from "react";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import ThreeStage, { type ViewPreset } from "@/components/three/ThreeStage";
import type { DojoProps } from "@/components/three/scenes/dojo";
import { ANKF } from "@/content/common-sources";

const VIEWS: ViewPreset[] = [
  { id: "overview", label: "俯瞰", pos: [16, 20, 16], target: [0, 0, -12] },
  { id: "shai", label: "從射位看的", pos: [0, 1.5, 0.9], target: [0, 0.35, -28] },
  { id: "side", label: "側面", pos: [42, 6, -13.3], target: [0, 0.4, -13.3] },
  { id: "azuchi", label: "安土前", pos: [0.9, 0.95, -24.2], target: [0, 0.3, -28.1] },
];

/** 射位的名稱（由左到右，從射場往的看）；這裡不套用 1 番～5 番的順序 */
const LANES = ["左端", "左 2", "中央", "右 2", "右端"] as const;

const DIMS = [
  { key: "d28", label: "28 m", text: "射距離 28 m：從射位到的（第 22 條）。" },
  { key: "d18", label: "1.8 m", text: "射位間隔 1.8 m：相鄰兩個射位的距離。" },
  { key: "d20", label: "2.0 m", text: "本座到射位 2.0 m：在射位後方等候、行揖的位置。" },
] as const;
type DimKey = (typeof DIMS)[number]["key"];

export default function Dojo3D() {
  const [lane, setLane] = useState(2);
  const [shot, setShot] = useState(0);
  const [dims, setDims] = useState<Record<DimKey, boolean>>({ d28: true, d18: false, d20: false });

  const props: DojoProps = { mode: "layout", lane, shot, ...dims, onPick: setLane };
  const on = DIMS.filter((d) => dims[d.key]);

  const btn = "inline-flex min-h-10 items-center rounded-lg border px-3 text-sm font-semibold transition-colors";
  const tog = (pressed: boolean) =>
    `${btn} ${pressed ? "border-wood bg-wood-soft text-ink" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`;

  return (
    <FigureFrame
      id="shajo-3d"
      title="近的射場的立體示意（5 人立）"
      caption={
        <>
          和下方的俯視圖是同一個射場，可以對照著看。按比例的是《弓道競技規則》近的的標準：射距離 28 m（第 22 條）、射位間隔 1.8 m、本座到射位 2.0 m；的是直徑 36 cm 的霞的，靶心距垜敷 27 cm、向後傾 5 度（第 24・26 條）。
          射場地板與矢道的寬、安土的形狀與高度、眼睛與放箭的高度都是示意；射場地板與垜敷的高低差沒有標準數字，圖中畫成同高。圓盤只標出射位（不畫人），三角形指向射手面對的脇正面。「射一箭」的飛行速度與弧度為示意，中靶位置也是隨意的。上座、看的所的位置依道場而不同，這裡不畫。
        </>
      }
      sources={[ANKF.playRules]}
    >
      <div className="mx-auto max-w-2xl">
        <ThreeStage
          load={() => import("@/components/three/scenes/dojo")}
          props={props}
          label="近的射場的立體示意圖"
          description="由後往前：射場地板上有本座線與射位線，相距 2.0 公尺；五個射位間隔 1.8 公尺，以圓盤表示。前方是 28 公尺的矢道，盡頭是安土，五個霞的立在安土前，各自對著一個射位。可切換視角、選射位並射出一支箭。"
          fallback={<p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">這個裝置無法顯示 3D 圖；下方的俯視圖是同一個射場。</p>}
          views={VIEWS}
          aspect="4 / 3"
          hint="左右拖曳可旋轉；點圓盤可選射位"
        >
          <div className="flex w-full flex-col gap-2">
            <div role="group" aria-label="選擇射位（由左到右，從射場往的看）" className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm text-muted">射位：</span>
              {LANES.map((l, i) => (
                <button key={l} type="button" aria-pressed={lane === i} onClick={() => setLane(i)} className={tog(lane === i)}>
                  {l}
                </button>
              ))}
              <button type="button" onClick={() => setShot((n) => n + 1)} className={`${btn} border-ink bg-ink text-paper hover:bg-ink/85`}>
                射一箭
              </button>
            </div>
            <div role="group" aria-label="顯示尺寸線" className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm text-muted">尺寸線：</span>
              {DIMS.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  aria-pressed={dims[d.key]}
                  onClick={() => setDims((s) => ({ ...s, [d.key]: !s[d.key] }))}
                  className={tog(dims[d.key])}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div aria-live="polite" className="rounded-lg bg-wood-soft/50 px-3 py-2 text-[15px] leading-relaxed text-ink">
              <p>
                {shot > 0
                  ? `從「${LANES[lane]}」的射位射出第 ${shot} 箭：飛過 28 m 的矢道，插在安土前的霞的上。飛行速度與弧度為示意。`
                  : `選好射位（目前是「${LANES[lane]}」），按「射一箭」看箭飛過 28 m 的矢道。`}
              </p>
              {on.length > 0 && (
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {on.map((d) => (
                    <li key={d.key}>{d.text}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </ThreeStage>
      </div>
    </FigureFrame>
  );
}
