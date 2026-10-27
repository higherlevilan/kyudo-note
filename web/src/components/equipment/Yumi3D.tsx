"use client";

// 和弓立體圖：可旋轉的 3D 和弓。點部位看名稱與說明；切換卸弦／張弦／拉開三種狀態，弓與弦會平滑變形。
// 部位名稱與說明沿用〈和弓各部位〉SVG 圖（YumiParts）的文字；形狀資料見 components/three/yumi-shape.ts。

import { useState } from "react";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import { PARTS, type PartId } from "@/components/illustrations/gear/YumiParts";
import ThreeStage, { type ViewPreset } from "@/components/three/ThreeStage";
import type { BowState } from "@/components/three/yumi-shape";
import type { YumiProps } from "@/components/three/scenes/yumi";
import { ANKF, BUDOKAN, SHOP } from "@/content/equipment/sources";

const VIEWS: ViewPreset[] = [
  { id: "front", label: "正面", pos: [0, 0.38, -3.8], target: [0, 0.38, 0] },
  { id: "side", label: "側面", pos: [3.8, 0.38, -0.15], target: [0, 0.38, -0.15] },
  { id: "oblique", label: "斜め", pos: [2.4, 1.0, -2.8], target: [0, 0.38, -0.1] },
];

const STATES: { id: BowState; name: string; ja: string; text: string }[] = [
  {
    id: "unstrung",
    name: "卸弦",
    ja: "弦を外した時",
    text: "卸下弦，弓往反方向彎，這叫裏反り（うらぞり）。弓師的說法：裏反り超過 15 cm 就張著放，不到 15 cm 就卸弦休息（弓具店說法）。圖上彎曲的程度是示意。",
  },
  {
    id: "braced",
    name: "張弦",
    ja: "弦を張った時",
    text: "張好弦，弓身朝弦的一面彎成弓形，弦兩端以弦輪掛在弭上。握到弦的距離叫弓把（ゆみづか），指導書以 15 cm 為基準。",
  },
  {
    id: "drawn",
    name: "拉開",
    ja: "引分け／会",
    text: "拉開時上下兩端往射手這一側彎，弦在搭箭處（中仕掛け）被拉成 V 字。圖以握到弦約 85 cm 示意（弓具店：矢束 85 cm 以內用並寸）；弓身彎曲的程度是示意。",
  },
];

const STRING_PARTS = new Set<PartId>(["tsuru", "naka", "tsuruwa"]);

export default function Yumi3D() {
  const [state, setState] = useState<BowState>("braced");
  const [part, setPart] = useState<PartId | null>(null);
  const cur = PARTS.find((p) => p.id === part);
  const st = STATES.find((s) => s.id === state)!;
  const props: YumiProps = { state, part };

  const btn = "inline-flex min-h-10 flex-col items-start justify-center rounded-lg border px-3 py-1 text-left text-sm leading-tight transition-colors";

  return (
    <FigureFrame
      id="yumi-3d"
      title="和弓立體圖"
      caption={
        <>
          按比例：全長 221 cm（並寸）、握在從本弭算起約 1/3（上半部約是下半部的 2 倍長）、張弦時弓把約 15 cm。
          不按比例：弓身厚度放大 2 倍、弦也畫粗；斷面形狀是示意。張弦的弓身曲線沿用〈和弓各部位〉圖，也是示意；卸弦（裏反り）與拉開時彎曲的程度是示意，不是實測。
          入木・出木（弓的左右偏向）的定義說法不一，沒有畫；上切詰籐等更細的部位沒有畫。
        </>
      }
      sources={[ANKF.playRules, ANKF.terminology, BUDOKAN.ch2, ANKF.rissha, SHOP.yokoyama, SHOP.suizanYumi]}
    >
      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <ThreeStage
          load={() => import("@/components/three/scenes/yumi")}
          props={props}
          label="和弓的立體示意圖"
          description={`可旋轉的 3D 和弓，全長 221 公分（並寸），握在從下端算起約三分之一處，上半部比下半部長。現在是「${st.name}（${st.ja}）」的形狀${
            cur ? `，標出「${cur.name}」` : ""
          }。`}
          fallback={
            <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
              這台裝置無法顯示 3D 圖。部位名稱與位置請看上方的
              <a href="#yumi-parts" className="mx-1 text-wood underline">
                〈和弓各部位〉圖
              </a>
              。
            </p>
          }
          views={VIEWS}
          initialView="oblique"
          aspect="3 / 4"
        >
          <div role="group" aria-label="弓的狀態" className="flex w-full flex-wrap gap-1.5">
            {STATES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={state === s.id}
                onClick={() => setState(s.id)}
                className={`${btn} ${state === s.id ? "border-wood bg-wood-soft text-ink" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`}
              >
                <span className="font-semibold">{s.name}</span>
                <span lang="ja" className="text-xs text-muted">
                  {s.ja}
                </span>
              </button>
            ))}
          </div>
        </ThreeStage>

        <div className="min-w-0">
          <p aria-live="polite" className="rounded-lg bg-wood-soft/60 px-3 py-2 text-sm leading-relaxed">
            <b className="text-ink">
              {st.name}
              <span lang="ja" className="ml-1 font-normal text-muted">
                {st.ja}
              </span>
            </b>
            ：{st.text}
          </p>

          <p className="mt-3 text-sm text-muted">點部位名稱，弓上會用朱色標出來；再點一次取消。</p>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 min-[480px]:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
            {PARTS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={part === p.id}
                  onClick={() => setPart(part === p.id ? null : p.id)}
                  className="flex min-h-10 w-full flex-col items-start rounded-lg border border-line bg-surface px-2.5 py-1.5 text-left text-sm leading-snug hover:border-wood aria-pressed:border-vermilion aria-pressed:bg-vermilion/10"
                >
                  <span lang="ja" className="font-semibold">
                    {p.name}
                  </span>
                  <span lang="ja" className="text-xs text-muted">
                    {p.kana}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div aria-live="polite" className="mt-3 min-h-16 rounded-lg bg-surface px-3 py-2 text-sm leading-relaxed">
            {cur ? (
              <>
                <span lang="ja" className="font-semibold text-vermilion">
                  {cur.name}
                </span>
                ：{cur.text}
                {state === "unstrung" && STRING_PARTS.has(cur.id) && <span className="text-muted">（卸弦時沒有弦；切到「張弦」或「拉開」看位置。）</span>}
              </>
            ) : (
              <span className="text-muted">還沒選部位。</span>
            )}
          </div>
        </div>
      </div>
    </FigureFrame>
  );
}
