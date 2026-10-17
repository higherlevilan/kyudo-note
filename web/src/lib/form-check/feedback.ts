// Turn metric values into gentle, rounded statements next to the canonical (illustration) values.
// Wording rule: describe what the 2D picture shows; never prescribe a correction. 「請以指導者為準」.

import { canonicalMetrics, canonicalWristShift } from "./canonical";
import type { MetricId, Metrics } from "./metrics";
import { STEPS, type StepId } from "./steps";

export type Verdict = "close" | "some" | "far" | "info";

export interface Statement {
  metric: MetricId | "kaiHold" | "bowHandShift";
  /** full sentence for the result card */
  text: string;
  /** compact form for summaries: 「左右手腕高度差約 8 cm（弓手較高）〔示意圖約 5 cm（妻手較高）〕」 */
  short: string;
  verdict: Verdict;
  /** detector visibility of the joints involved was low (sleeves, hakama, profile view…) */
  lowConf: boolean;
  user: number | null;
  canonical: number | null;
  tolerance: number | null;
}

interface MetricSpec {
  /** display name */
  name: string;
  unit: "°" | "cm";
  /** within ±tol of the canonical value reads as 「接近標準形」 */
  tol: number;
  /** rounding step for display */
  step: number;
  /** describe one value in words */
  say: (v: number) => string;
  /** appended once after the comparison */
  note?: string;
}

const r = (v: number, step: number) => {
  const x = Math.round(v / step) * step;
  return Object.is(x, -0) ? 0 : x;
};
const abs = (v: number, step: number) => Math.abs(r(v, step));

export const METRIC_SPECS: Record<MetricId, MetricSpec> = {
  elbowL: { name: "弓手（左）手肘角度", unit: "°", tol: 15, step: 5, say: (v) => `約 ${r(v, 5)}°`, note: "180° 為完全伸直" },
  elbowR: { name: "妻手（右）手肘角度", unit: "°", tol: 15, step: 5, say: (v) => `約 ${r(v, 5)}°`, note: "180° 為完全伸直" },
  shoulderTilt: {
    name: "兩肩連線",
    unit: "°",
    tol: 4,
    step: 1,
    say: (v) => (abs(v, 1) <= 1 ? "大致水平" : `${v > 0 ? "左肩（弓手側）" : "右肩（妻手側）"}較高，傾斜約 ${abs(v, 1)}°`),
  },
  wristDiff: {
    name: "左右手腕高度差",
    unit: "cm",
    tol: 7,
    step: 1,
    say: (v) => (abs(v, 1) <= 1 ? "幾乎同高" : `約 ${abs(v, 1)} cm（${v > 0 ? "弓手" : "妻手"}較高）`),
  },
  fistRise: {
    name: "雙拳高度",
    unit: "cm",
    tol: 10,
    step: 5,
    say: (v) => (abs(v, 5) === 0 ? "約與肩同高" : `約在肩線${v > 0 ? "上方" : "下方"} ${abs(v, 5)} cm`),
  },
  handsCenter: {
    name: "雙拳的左右位置",
    unit: "cm",
    tol: 8,
    step: 1,
    say: (v) => (abs(v, 1) <= 2 ? "大致在身體正中" : `偏向${v > 0 ? "靶的方向" : "靶的反方向"}約 ${abs(v, 1)} cm`),
  },
  fistElevL: {
    name: "弓手方向（肩→手腕）",
    unit: "°",
    tol: 10,
    step: 5,
    say: (v) => (abs(v, 5) === 0 ? "大致水平指向靶" : `比水平${v > 0 ? "高" : "低"}約 ${abs(v, 5)}°`),
  },
  fistElevR: {
    name: "妻手方向（肩→手腕）",
    unit: "°",
    tol: 15,
    step: 5,
    say: (v) => (abs(v, 5) === 0 ? "大致水平向後展開" : `比水平${v > 0 ? "高" : "低"}約 ${abs(v, 5)}°`),
  },
  torsoLean: {
    name: "上半身",
    unit: "°",
    tol: 4,
    step: 1,
    say: (v) => (abs(v, 1) <= 1 ? "大致垂直" : `往${v > 0 ? "靶的方向" : "靶的反方向"}傾約 ${abs(v, 1)}°`),
  },
  headTurn: {
    name: "臉轉向靶（物見）",
    unit: "°",
    tol: 20,
    step: 5,
    say: (v) => (r(v, 5) <= 10 ? "大致朝正面" : `約 ${Math.min(90, r(v, 5))}°`),
    note: "90° 為完全轉向靶",
  },
  stance: { name: "兩腳踝距離（足踏み寬度）", unit: "cm", tol: 12, step: 5, say: (v) => `約 ${r(v, 5)} cm` },
  spread: { name: "兩手腕距離", unit: "cm", tol: 15, step: 5, say: (v) => `約 ${r(v, 5)} cm` },
};

/** Below this landmark visibility a measurement is marked as uncertain. */
export const LOW_CONF = 0.55;

function verdictOf(diff: number, tol: number): Verdict {
  const d = Math.abs(diff);
  return d <= tol ? "close" : d <= 2 * tol ? "some" : "far";
}

const VERDICT_TEXT: Record<Exclude<Verdict, "info">, string> = {
  close: "接近示意圖",
  some: "與示意圖略有不同",
  far: "與示意圖差異較明顯，可以請指導者看看",
};

export function verdictLabel(v: Verdict): string {
  return v === "info" ? "參考" : VERDICT_TEXT[v];
}

/** Statements for one step, comparing the learner's metrics with the canonical pose. */
export function compareStep(step: StepId, user: Metrics, unreliable: Partial<Record<MetricId, string>> = {}): Statement[] {
  const def = STEPS[step];
  const canon = canonicalMetrics(def.pose);
  const out: Statement[] = [];
  for (const id of def.metrics) {
    const spec = METRIC_SPECS[id];
    const loose = def.loose?.includes(id) ?? false;
    const tol = loose ? spec.tol * 2 : spec.tol;
    const u = user[id];
    const c = canon[id];
    if (!c) continue;
    if (!u) {
      out.push({
        metric: id,
        text: `${spec.name}：這個畫面沒有偵測到相關關節，無法比較。`,
        short: `${spec.name}無法判斷`,
        verdict: "info",
        lowConf: true,
        user: null,
        canonical: c.value,
        tolerance: tol,
      });
      continue;
    }
    const verdict = verdictOf(u.value - c.value, tol);
    const notes = [spec.note, loose ? "手臂有一段朝向鏡頭，正面畫面的角度只能粗略參考" : undefined, unreliable[id]].filter(Boolean);
    out.push({
      metric: id,
      text: `${spec.name}${spec.say(u.value)}；示意圖${spec.say(c.value)}${notes.length ? `（${notes.join("；")}）` : ""}。`,
      short: `${spec.name}${spec.say(u.value)}〔示意圖${spec.say(c.value)}〕`,
      verdict,
      lowConf: u.conf < LOW_CONF || id in unreliable,
      user: u.value,
      canonical: c.value,
      tolerance: tol,
    });
  }
  return out;
}

/** 離れ: how long 会 was held and how far the bow hand moved through the release. */
export function hanareStatements(kaiHoldS: number | null, bowHandShiftCm: number | null, shiftConf: number): Statement[] {
  const out: Statement[] = [];
  if (kaiHoldS != null) {
    out.push({
      metric: "kaiHold",
      text: `從進入会到離れ約 ${Math.round(kaiHoldS * 2) / 2} 秒。合適的長度因人、因指導而不同，這裡只是記錄，不做比較。`,
      short: `会約 ${Math.round(kaiHoldS * 2) / 2} 秒`,
      verdict: "info",
      lowConf: false,
      user: kaiHoldS,
      canonical: null,
      tolerance: null,
    });
  }
  if (bowHandShiftCm != null) {
    const c = canonicalWristShift("kai", "hanare");
    const tol = 6;
    out.push({
      metric: "bowHandShift",
      text: `弓手（左手腕）在離れ前後移動約 ${Math.round(bowHandShiftCm)} cm；示意圖約 ${Math.round(c)} cm。`,
      short: `弓手移動約 ${Math.round(bowHandShiftCm)} cm〔示意圖約 ${Math.round(c)} cm〕`,
      verdict: verdictOf(bowHandShiftCm - c, tol),
      lowConf: shiftConf < LOW_CONF,
      user: bowHandShiftCm,
      canonical: c,
      tolerance: tol,
    });
  }
  return out;
}

/** One short line per step for summaries, e.g. 「会：左右手腕高度差約 8 cm（弓手較高）〔示意圖…〕」. */
export function summaryLine(term: string, sts: Statement[]): string {
  const parts = sts.filter((s) => s.user != null).map((s) => s.short + (s.lowConf ? "（偵測信心低）" : ""));
  return `${term}：${parts.length ? parts.join("；") : "沒有可比較的數值"}`;
}
