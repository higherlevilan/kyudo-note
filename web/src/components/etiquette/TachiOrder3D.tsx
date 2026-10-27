"use client";

// 5 人立的射順（弦音接力）：同一個射場 3D 場景（scenes/dojo.ts，mode "order"），一步一位射手放箭。
// 每一步亮起哪些人、做什麼，全部從 GYOSHA（審查規程別表 2 的行射要領表）推出來：
//   表格的格子寫「N 番的弦音」→ 在 N 番放箭的那一步亮起。
//   N 小於自己的番號 → 指同一輪（甲矢或乙矢）的弦音；N 大於自己的番號 → 指前一輪（甲矢）的弦音
//   （例如乙矢・立弓搭箭「4 番的弦音」是 4 番的甲矢）。
// 不是弦音的信號（1 番不間斷行射、2 番在 1 番胴造り快結束時起身、5 番射完甲矢立刻搭乙矢）寫在說明文字裡。
// 位置：用語辭典說大前是「一立中最前面的射手」，射手在射位面向脇正面，所以 1 番畫在脇正面那一端（+x），5 番（落）在另一端。

import FigureFrame from "@/components/illustrations/gear/FigureFrame";
import Stepper, { type StepDef } from "@/components/course/Stepper";
import ThreeStage, { type ViewPreset } from "@/components/three/ThreeStage";
import type { DojoProps, LaneMark } from "@/components/three/scenes/dojo";
import { ANKF } from "@/content/etiquette/sources";
import type { GyoshaRow } from "@/content/etiquette/sections";

type Round = "甲矢" | "乙矢";

const VERB: Record<string, { code: LaneMark; label: string }> = {
  起身: { code: "r", label: "起身" },
  取懸け: { code: "k", label: "取懸け" },
  立弓搭箭: { code: "y", label: "搭乙矢" },
};

const VIEWS: ViewPreset[] = [
  { id: "back", label: "從本座後方", pos: [0, 4, 9], target: [0, 0, -1.5] },
  { id: "top", label: "俯瞰射位", pos: [0, 11, 2], target: [0, 0, 0.2] },
];

/** 番號 p（0 = 1 番）↔ 場景裡的射位索引（LANE_X 由左到右）；兩個方向是同一個換算 */
const laneOf = (p: number) => 4 - p;

interface OrderStep extends StepDef {
  /** 依番號（0 = 1 番）的狀態 */
  marks: LaneMark[];
  acts: string[];
}

function buildSteps(rows: GyoshaRow[], positions: readonly string[]): OrderStep[] {
  const ref = (cell: string) => {
    const m = cell.match(/(\d) 番的弦音/);
    return m ? Number(m[1]) : null;
  };
  const parsed = rows.map((r) => {
    const [round, verb] = r.phase.split("・") as [Round, string];
    return { ...r, round, verb };
  });
  const cellOf = (phase: string, p: number) => rows.find((r) => r.phase === phase)?.cells[p] ?? "";
  const steps: OrderStep[] = [];

  // 第 0 步：甲矢開始（不是弦音的信號）
  {
    const marks: LaneMark[] = ["r", "-", "-", "-", "-"];
    const acts = ["起身", "", "", "", ""];
    steps.push({
      title: "甲矢開始",
      text: (
        <>
          {positions[0]}：{cellOf("甲矢・起身", 0)}。{positions[1]}：{cellOf("甲矢・起身", 1)}起身（不是聽弦音）。
        </>
      ),
      marks,
      acts,
    });
  }

  for (const round of ["甲矢", "乙矢"] as Round[]) {
    for (let k = 1; k <= 5; k++) {
      const s = k - 1;
      const marks: LaneMark[] = Array.from({ length: 5 }, (_, p) => (p < s ? "d" : "-"));
      const acts = ["", "", "", "", ""];
      marks[s] = "s";
      acts[s] = "放箭";
      const fx: [number, string][] = [];
      for (const r of parsed) {
        r.cells.forEach((cell, p) => {
          const pn = p + 1;
          if (ref(cell) === k) {
            const same = k < pn;
            const hit = (r.round === round && same) || (round === "甲矢" && r.round === "乙矢" && !same);
            if (!hit) return;
            const v = VERB[r.verb];
            if (!v) return;
            marks[p] = v.code;
            acts[p] = v.label;
            fx.push([p, `${positions[p]}：${r.phase}`]);
            if (r.round === "乙矢" && r.verb === "起身" && p === 0 && round === "甲矢") {
              fx.push([1, `${positions[1]}：乙矢・起身（${cellOf("乙矢・起身", 1)}，不是聽弦音）`]);
            }
          } else if (round === "甲矢" && p === s && cell.includes("射完甲矢立刻")) {
            acts[p] = "放箭→搭乙矢";
            fx.push([p, `${positions[p]}自己：${r.phase}（${cell}）`]);
          }
        });
      }
      let extra: string | null = null;
      if (round === "乙矢" && k === 3) extra = "下一組：在這聲乙矢弦音時入場，進本座跪坐。";
      if (round === "乙矢" && k === 5) extra = "這一立射完，從 1 番開始依序退場。下一組在 5 番的弦音時一起揖，最後的射手後退時前往射位。";
      steps.push({
        title: `${round}：${positions[s]}放箭`,
        text: (
          <>
            {fx.length > 0 ? (
              <>
                {positions[s]}的弦音是信號 → {fx.sort((a, b) => a[0] - b[0]).map((f) => f[1]).join("；")}。
              </>
            ) : (
              <>沒有人以這聲弦音為信號。</>
            )}
            {extra && <span className="mt-0.5 block text-sm text-muted">{extra}</span>}
          </>
        ),
        marks,
        acts,
      });
    }
  }
  return steps;
}

const LEGEND: { code: LaneMark; label: string; cls: string }[] = [
  { code: "s", label: "放箭（弦音）", cls: "bg-vermilion" },
  { code: "r", label: "起身・取懸け", cls: "bg-indigo" },
  { code: "y", label: "搭乙矢", cls: "bg-moss" },
  { code: "d", label: "這一輪已射", cls: "bg-line" },
];

/** WebGL 不能用時：五個位置排成一列（左邊是 5 番，同 3D 圖） */
function ChipRow({ marks, acts, positions }: { marks: LaneMark[]; acts: string[]; positions: readonly string[] }) {
  const tone = (m: LaneMark) =>
    m === "s" ? "border-vermilion bg-vermilion/15" : m === "r" || m === "k" ? "border-indigo bg-indigo/10" : m === "y" ? "border-moss bg-moss/10" : m === "d" ? "border-line bg-surface-2 text-muted" : "border-line bg-surface";
  return (
    <ol className="grid grid-cols-5 gap-1.5 text-center text-xs">
      {[4, 3, 2, 1, 0].map((p) => (
        <li key={p} className={`rounded-lg border px-1 py-2 ${tone(marks[p])}`}>
          <span className="block font-semibold">{positions[p]}</span>
          <span className="block min-h-4">{acts[p]}</span>
        </li>
      ))}
    </ol>
  );
}

export default function TachiOrder3D({ rows, positions }: { rows: GyoshaRow[]; positions: readonly string[] }) {
  const steps = buildSteps(rows, positions);
  const names = [0, 1, 2, 3, 4].map((lane) => positions[laneOf(lane)]).join("|");

  return (
    <FigureFrame
      id="tachi-order-3d"
      title="5 人立的射順（弦音接力）"
      caption={
        <>
          資料同上方的行射要領表（〈審査における行射の要領（５人立ち）〉）：每一步是一位射手放箭，亮起的是以這聲弦音為信號的人。只表示順序與信號，不表示每個動作花多少時間。
          圓盤代表射位上的射手（不畫人）。大前是一立中最前面的射手；射手在射位面向脇正面，所以圖中 1 番在脇正面那一端（右）、5 番（落）在另一端。射位間隔 1.8 m、本座到射位 2.0 m 按比例，其餘示意。
        </>
      }
      sources={[ANKF.probationGyosha, ANKF.terminology, ANKF.playRules]}
    >
      <Stepper steps={steps} label="5 人立射順的步驟" autoplayMs={3000}>
        {(k) => {
          const st = steps[k];
          const marks = [0, 1, 2, 3, 4].map((lane) => st.marks[laneOf(lane)]).join("|");
          const acts = [0, 1, 2, 3, 4].map((lane) => st.acts[laneOf(lane)]).join("|");
          const props: DojoProps = { mode: "order", lane: 0, shot: 0, d28: false, d18: false, d20: false, marks, acts, names };
          return (
            <div className="mx-auto max-w-2xl">
              <ThreeStage
                load={() => import("@/components/three/scenes/dojo")}
                props={props}
                label="5 人立射順的立體示意圖"
                description="射位上五個圓盤由右到左是 1 番（大前）到 5 番（落）。每一步，放箭的人的圓盤變紅，以這聲弦音為信號起身、取懸け或搭乙矢的人的圓盤亮起。"
                fallback={<ChipRow marks={st.marks} acts={st.acts} positions={positions} />}
                views={VIEWS}
                aspect="4 / 3"
              >
                <ul aria-label="圖例" className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                  {LEGEND.map((l) => (
                    <li key={l.code} className="inline-flex items-center gap-1">
                      <span aria-hidden="true" className={`inline-block h-3 w-3 rounded-full ${l.cls}`} />
                      {l.label}
                    </li>
                  ))}
                </ul>
              </ThreeStage>
            </div>
          );
        }}
      </Stepper>
    </FigureFrame>
  );
}
