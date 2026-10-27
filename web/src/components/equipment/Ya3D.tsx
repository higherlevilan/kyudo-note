"use client";

// 矢的立體圖：切換甲矢／乙矢（走り羽的「表」換到另一面）、標示各部位、繞軸旋轉。
// 部位位置與羽形沿用 YaParts.tsx；甲矢・乙矢的定義與「外／內以弓為準」的畫法沿用 HayaOtoya
// （全弓連〈弓道用語辞典〉）。不支援 WebGL 時改顯示原本的斷面圖 HayaOtoya。
// 旋轉方向：網站資料沒有寫甲矢、乙矢各往哪邊轉，動畫只示意「繞軸轉」，轉向固定。

import { useState } from "react";
import ThreeStage, { type ViewPreset } from "@/components/three/ThreeStage";
import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import { FigureNotes } from "@/components/content/Blocks";
import { HayaOtoya } from "@/components/illustrations/gear/YaParts";
import { ANKF } from "@/content/equipment/sources";
import type { YaPart, YaProps } from "@/components/three/scenes/ya";

const VIEWS: ViewPreset[] = [
  { id: "side", label: "側面", pos: [1.35, 0.18, 0.02], target: [0, 0, 0.02] },
  { id: "nock", label: "從筈後方看", pos: [0.001, 0.012, 0.9], target: [0, 0, 0.3] },
  { id: "oblique", label: "斜角", pos: [0.5, 0.3, 0.86], target: [0, 0, 0.24] },
];

const HANE_NOTE = "三片都是鳥羽；羽丈近的 13〜15 cm（圖中 14 cm）、羽山 5 mm 以上（圖中高度放大）。";

const PARTS: { id: YaPart; name: string; ja: string; text: string }[] = [
  { id: "itatsuki", name: "板付", ja: "いたつき", text: "箭頭（矢尻）。競技規則限平題形、椎実形或圓錐形，圖中畫成圓錐形。" },
  { id: "no", name: "箆", ja: "の", text: "箭桿。競技規則：直徑 6 mm 以上（圖中粗細放大）。" },
  { id: "motohagi", name: "本矧", ja: "もとはぎ", text: "固定羽時，箭頭側用線纏住的部分。競技規則要求要有本矧、末矧與筈巻。" },
  { id: "hashiriba", name: "走り羽", ja: "はしりば", text: `搭箭時朝上的那片羽；紅色那一面是它的「表」。${HANE_NOTE}` },
  { id: "togakeba", name: "外掛羽", ja: "とがけば", text: `又叫向羽，搭箭時朝外側（離弓較遠）的羽。${HANE_NOTE}` },
  { id: "yuzuriba", name: "弓摺羽", ja: "ゆずりば", text: `又叫頬摺羽，搭箭時朝內側（靠弓）的羽。${HANE_NOTE}` },
  { id: "urahagi", name: "末矧", ja: "うらはぎ", text: "固定羽時，筈側用線纏住的部分。" },
  { id: "hazumaki", name: "筈巻", ja: "はずまき", text: "在筈旁用線纏緊固定。" },
  { id: "hazu", name: "筈", ja: "はず", text: "箭尾扣弦處。競技規則：埋入式、有筈溝，不得有螢光、發光等功能。" },
];

const KIND_TEXT: Record<YaProps["kind"], string> = {
  haya: "甲矢（はや）：先射的箭，羽的表朝外——紅色的表在遠離弓的一側。",
  otoya: "乙矢（おとや）：一手中後射的箭，搭弦時羽的表朝內——紅色的表在靠弓的一側。",
};

const SPIN_TEXT = "飛行旋轉（示意）：箭繞自己的軸轉動。旋轉方向依羽的朝向而定；網站資料沒有寫甲矢、乙矢各往哪邊轉，動畫的轉向固定，不代表實際方向。";

const btn = "inline-flex min-h-10 items-center rounded-lg border px-3 text-sm font-semibold transition-colors";
const on = "border-wood bg-wood-soft text-ink";
const off = "border-field-border bg-surface text-ink hover:bg-surface-2";

export default function Ya3D() {
  const [kind, setKind] = useState<YaProps["kind"]>("haya");
  const [part, setPart] = useState<YaPart | null>(null);
  const [spinning, setSpinning] = useState(false);
  const cur = PARTS.find((p) => p.id === part);

  return (
    <FigureFrame
      id="ya-3d"
      title="矢的立體圖：甲矢與乙矢"
      caption="長度依上圖〈矢的部位〉的示意比例（全長 100 cm、羽丈 14 cm）；紅色面是走り羽的「表」，其餘是示意。"
      sources={[ANKF.terminology, ANKF.playRules]}
    >
      <ThreeStage
        load={() => import("@/components/three/scenes/ya")}
        props={{ kind, part, spinning } satisfies YaProps}
        label="矢的立體示意：甲矢與乙矢"
        description="一支箭的立體模型：箭頭的板付、箭桿（箆）、本矧、三片羽（走り羽朝上，外掛羽在離弓的一側，弓摺羽在靠弓的一側）、末矧、筈巻與筈。箭的左邊畫了一小段弓。走り羽的「表」以紅色標出：甲矢朝外（遠離弓），乙矢朝內（靠弓）。"
        fallback={<HayaOtoya />}
        views={VIEWS}
        initialView="oblique"
      >
        <div className="w-full space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <div role="group" aria-label="甲矢或乙矢" className="flex flex-wrap gap-1.5">
              {(["haya", "otoya"] as const).map((k) => (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={`${btn} ${kind === k ? on : off}`}>
                  <span lang="ja">{k === "haya" ? "甲矢" : "乙矢"}</span>
                </button>
              ))}
            </div>
            <button type="button" aria-pressed={spinning} onClick={() => setSpinning((s) => !s)} className={`${btn} ${spinning ? on : off}`}>
              <span aria-hidden="true" className="mr-1">
                {spinning ? "■" : "▶"}
              </span>
              {spinning ? "停止旋轉" : "飛行旋轉"}
            </button>
          </div>
          <div role="group" aria-label="標示部位" className="flex flex-wrap gap-1.5">
            {PARTS.map((p) => (
              <button
                key={p.id}
                type="button"
                lang="ja"
                aria-pressed={part === p.id}
                onClick={() => setPart((x) => (x === p.id ? null : p.id))}
                className={`${btn} ${part === p.id ? "border-indigo bg-indigo/10 text-indigo" : off}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="space-y-1 rounded-lg bg-surface px-3 py-2 text-sm leading-relaxed text-ink">
            <p>{KIND_TEXT[kind]}</p>
            {cur && (
              <p>
                <b lang="ja" className="text-indigo">
                  {cur.name}（{cur.ja}）
                </b>
                ：{cur.text}
              </p>
            )}
            {spinning && <p className="text-muted">{SPIN_TEXT}</p>}
          </div>
        </div>
      </ThreeStage>
      <FigureNotes>
        <p>
          長度方向依上圖〈矢的部位〉的示意比例（全長 100 cm、羽丈 14 cm）；箭桿粗細與羽的高度放大，不按比例；板付畫成圓錐形，弓只畫一小段、位置是示意。
        </p>
        <p>
          紅色面是走り羽的「表」：用語辭典說甲矢「羽根の表が外向き」、乙矢搭弦時「矢羽根の表が内側にある」；「外／內」以弓為準來畫，是本站對定義的圖解。
        </p>
        <p>
          另外兩片羽的表、羽的彎曲，資料沒有寫，圖中不畫。有些資料改用「羽順時針／逆時針」說明，但從哪一端看各說不一，本站不採用；「飛行旋轉」的轉向只是示意。
        </p>
      </FigureNotes>
    </FigureFrame>
  );
}
