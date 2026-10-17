// Glue: raw detector track → oriented track, scale, per-frame metrics, key moments, statements,
// and the plain-text summary that can be saved to the 稽古帳. Pure (no browser APIs).

import { mirrorTrack, median, type PoseTrack } from "./landmarks";
import { estimateScale, trackMetrics, windowMetrics, bodyFromPts, type Metrics } from "./metrics";
import { assessQuality, detectMirror, segment, type MirrorGuess, type QualityNote, type Segmentation } from "./segment";
import { compareStep, hanareStatements, summaryLine, type Statement } from "./feedback";
import type { MetricId } from "./metrics";
import { STEPS, STEP_IDS, type StepId } from "./steps";

export interface Analysis {
  /** track with the archer's left on the viewer's right (un-mirrored when needed) */
  track: PoseTrack;
  /** the displayed video is mirrored relative to `track` */
  mirrored: boolean;
  mirrorGuess: MirrorGuess;
  /** cm per video pixel, from the median shoulder width */
  cmPerPx: number;
  per: (Metrics | null)[];
  seg: Segmentation;
  quality: QualityNote[];
  /** metrics the detector is known to get wrong for this run (always shown as low confidence) */
  unreliable: Partial<Record<MetricId, string>>;
}

export type Picks = Record<StepId, number>;

/**
 * Returns null when there is nothing to analyse (no person, or the shoulders were never clear).
 * `mirror` overrides the automatic mirror guess.
 */
export function analyze(
  raw: PoseTrack,
  mirror: boolean | null = null,
  unreliable: Partial<Record<MetricId, string>> = {},
): Analysis | null {
  const mirrorGuess = detectMirror(raw);
  const mirrored = mirror ?? mirrorGuess.mirrored;
  const track = mirrored ? mirrorTrack(raw) : raw;
  const cmPerPx = estimateScale(track);
  if (cmPerPx == null) return null;
  const per = trackMetrics(track, cmPerPx);
  const seg = segment(track, cmPerPx);
  return { track, mirrored, mirrorGuess, cmPerPx, per, seg, quality: assessQuality(track, seg), unreliable };
}

export function autoPicks(a: Analysis): Picks {
  return Object.fromEntries(STEP_IDS.map((id) => [id, a.seg.moments[id].index])) as Picks;
}

/** Bow-hand (left wrist) displacement from 会 to just after 離れ, cm; with its detector confidence. */
function bowHandShift(a: Analysis, kai: number, hanare: number): { cm: number; conf: number } | null {
  const fr = a.track.frames;
  const after = Math.min(fr.length - 1, hanare + Math.max(1, Math.round(0.4 * a.track.fps)));
  const at = (i: number) => {
    const xs: number[] = [], ys: number[] = [], vs: number[] = [];
    for (let j = Math.max(0, i - 2); j <= Math.min(fr.length - 1, i + 2); j++) {
      const p = fr[j].pts;
      if (!p) continue;
      const b = bodyFromPts(p, a.track, a.cmPerPx);
      // relative to the shoulder midpoint, so a whole-body sway does not count
      xs.push(b.lw.x - (b.ls.x + b.rs.x) / 2);
      ys.push(b.lw.y - (b.ls.y + b.rs.y) / 2);
      vs.push(b.lw.v);
    }
    const x = median(xs), y = median(ys), v = median(vs);
    return x == null || y == null || v == null ? null : { x, y, v };
  };
  const p = at(kai), q = at(after);
  if (!p || !q || after <= kai) return null;
  return { cm: Math.hypot(q.x - p.x, q.y - p.y), conf: Math.min(p.v, q.v) };
}

export function stepStatements(a: Analysis, step: StepId, picks: Picks): Statement[] {
  if (step === "hanare") {
    const run = a.seg.kaiRun;
    const fr = a.track.frames;
    const hold = run && picks.hanare > run[0] ? fr[picks.hanare].t - fr[run[0]].t : null;
    const shift = picks.hanare > picks.kai ? bowHandShift(a, picks.kai, picks.hanare) : null;
    return hanareStatements(hold, shift?.cm ?? null, shift?.conf ?? 0);
  }
  return compareStep(step, windowMetrics(a.per, picks[step]), a.unreliable);
}

export interface SummaryOptions {
  enabled: Record<StepId, boolean>;
  manual: Record<StepId, boolean>;
  fileName?: string;
}

/** Plain-text summary (no images, no video) for the 稽古帳 note or copying. */
export function buildSummary(a: Analysis, picks: Picks, opts: SummaryOptions): string {
  const fr = a.track.frames;
  const lines: string[] = ["【射形分析（實驗）摘要】"];
  lines.push(
    `影片約 ${Math.round(a.track.duration)} 秒，以每秒 ${Math.round(a.track.fps)} 格分析${a.mirrored ? "（鏡像影片，已左右翻轉）" : ""}。`,
  );
  for (const id of STEP_IDS) {
    if (!opts.enabled[id]) continue;
    const t = fr[picks[id]]?.t ?? 0;
    const sts = stepStatements(a, id, picks);
    const tag = `${t.toFixed(1)} 秒${opts.manual[id] ? "・手動" : ""}`;
    lines.push(`・${summaryLine(`${STEPS[id].term}（${tag}）`, sts)}`);
  }
  for (const q of a.quality) lines.push(`※ ${q.text}`);
  lines.push("※ 由瀏覽器內的姿勢估計、單一正面鏡頭的 2D 推算，與示意圖（非量測標準）比較；僅供自我觀察，請以指導者為準。");
  return lines.join("\n");
}
