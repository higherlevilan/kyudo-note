// Automatic key-moment guesses on a pose track, plus mirror detection and footage-quality checks.
// Heuristics only: every guess can be moved by the user. Pure functions (testable in Node).

import { LM, median, percentile, px, smoothTrack, type PoseTrack } from "./landmarks";
import { SHOULDER_CM, bodyFromPts, trackMetrics, type Body2D, type MetricId, type Metrics } from "./metrics";
import { STEP_IDS, type StepId } from "./steps";

export interface KeyMoment {
  /** index into track.frames */
  index: number;
  /** false = the heuristic found nothing convincing and fell back to a rough position */
  found: boolean;
}

export interface Segmentation {
  moments: Record<StepId, KeyMoment>;
  /** frame range [start, end] of the detected 会 hold, if any */
  kaiRun: [number, number] | null;
  /** seconds between the start of 会 and 離れ */
  kaiHoldS: number | null;
}

const NaNs = (n: number) => new Array<number>(n).fill(NaN);
const ok = (x: number) => Number.isFinite(x);

interface Series {
  n: number;
  t: number[];
  body: (Body2D | null)[];
  m: (Metrics | null)[];
  get(id: MetricId): number[];
  /** wrist speed (cm/s) */
  vL: number[];
  vR: number[];
  /** right wrist height above the shoulder line (cm) */
  rwRise: number[];
  /** x of each wrist relative to the shoulder midpoint (cm, + = toward the target) */
  lwX: number[];
  rwX: number[];
}

function series(track: PoseTrack, cmPerPx: number): Series {
  const sm = smoothTrack(track, 2);
  const n = sm.frames.length;
  const t = sm.frames.map((f) => f.t);
  const body = sm.frames.map((f) => (f.pts ? bodyFromPts(f.pts, sm, cmPerPx) : null));
  const m = trackMetrics(sm, cmPerPx);
  const cacheM = new Map<MetricId, number[]>();
  const get = (id: MetricId) => {
    let a = cacheM.get(id);
    if (!a) {
      a = m.map((x) => x?.[id]?.value ?? NaN);
      cacheM.set(id, a);
    }
    return a;
  };
  const speed = (k: "lw" | "rw") => {
    const out = NaNs(n);
    for (let i = 0; i < n; i++) {
      let a = -1, b = -1;
      for (let j = i - 1; j >= Math.max(0, i - 2); j--) if (body[j]) { a = j; break; }
      for (let j = i + 1; j <= Math.min(n - 1, i + 2); j++) if (body[j]) { b = j; break; }
      if (a < 0) a = body[i] ? i : -1;
      if (b < 0) b = body[i] ? i : -1;
      if (a < 0 || b < 0 || a === b) continue;
      const p = body[a]![k], q = body[b]![k];
      out[i] = Math.hypot(q.x - p.x, q.y - p.y) / (t[b] - t[a]);
    }
    return out;
  };
  const rel = (k: "lw" | "rw", axis: "x" | "y") =>
    body.map((b) => (b ? b[k][axis] - (b.ls[axis] + b.rs[axis]) / 2 : NaN));
  // Median over ±2 frames: the drawing hand by the face is often mis-placed for a frame or two.
  const calm = (a: number[]) =>
    a.map((_, i) => median(a.slice(Math.max(0, i - 2), i + 3).filter(ok)) ?? NaN);
  return { n, t, body, m, get, vL: calm(speed("lw")), vR: calm(speed("rw")), rwRise: rel("rw", "y"), lwX: rel("lw", "x"), rwX: rel("rw", "x") };
}

/** Longest run of true values, tolerating gaps of up to maxGap false values inside the run. */
export function longestRun(flags: boolean[], maxGap: number): [number, number] | null {
  let best: [number, number] | null = null;
  let start = -1, last = -1;
  for (let i = 0; i <= flags.length; i++) {
    const f = i < flags.length && flags[i];
    if (f) {
      if (start < 0 || i - last - 1 > maxGap) {
        if (start >= 0 && (!best || last - start > best[1] - best[0])) best = [start, last];
        start = i;
      }
      last = i;
    }
  }
  if (start >= 0 && (!best || last - start > best[1] - best[0])) best = [start, last];
  return best;
}

function argBest(lo: number, hi: number, score: (i: number) => number, pick: "min" | "max"): number {
  let bi = -1, bv = pick === "min" ? Infinity : -Infinity;
  for (let i = Math.max(0, lo); i <= hi; i++) {
    const v = score(i);
    if (!ok(v)) continue;
    if (pick === "min" ? v < bv : v > bv) {
      bv = v;
      bi = i;
    }
  }
  return bi;
}

const clampI = (i: number, n: number) => Math.max(0, Math.min(n - 1, i));

/** Guess the frame of each 節. `track` must already be un-mirrored. */
export function segment(track: PoseTrack, cmPerPx: number): Segmentation {
  const S = series(track, cmPerPx);
  const { n } = S;
  const fps = track.fps;
  const f = (sec: number) => Math.max(1, Math.round(sec * fps));
  const spread = S.get("spread"), rise = S.get("fistRise"), elevL = S.get("fistElevL"), elbowL = S.get("elbowL");
  const head = S.get("headTurn"), stance = S.get("stance");
  const vMax = (i: number) => Math.max(S.vL[i], S.vR[i]);
  const vSum = (i: number) => S.vL[i] + S.vR[i];

  // 会: bow arm extended toward the target near horizontal, the drawing hand by the face (not yet flown
  // out as in 残心), hands about as far apart as they get in that shape, and still.
  const kaiShape = spread.map(
    (s, i) =>
      ok(s) &&
      elevL[i] >= -20 && elevL[i] <= 25 &&
      elbowL[i] >= 140 &&
      S.lwX[i] >= 1.2 * SHOULDER_CM &&
      S.rwX[i] >= -1.25 * SHOULDER_CM && S.rwX[i] <= 0.4 * SHOULDER_CM &&
      S.rwRise[i] >= -12 && S.rwRise[i] <= 30,
  );
  const maxSpread = percentile(spread.filter((s, i) => kaiShape[i]), 98) ?? NaN;
  const kaiFlag = spread.map((s, i) => kaiShape[i] && s >= 0.85 * maxSpread && !(vMax(i) > 45));
  const run = longestRun(kaiFlag, f(0.6));
  const kaiFound = !!run && S.t[run[1]] - S.t[run[0]] >= 0.5;
  let kaiStart: number, kaiEnd: number, kai: number;
  if (run && kaiFound) {
    [kaiStart, kaiEnd] = run;
    // The end of 引分け is slow and may pass the test; 会 begins once the drawing hand stops descending.
    const tail = (arr: number[]) => median(arr.slice(Math.max(kaiStart, kaiEnd - f(1)), kaiEnd + 1).filter(ok));
    const refRise = tail(S.rwRise), refSpread = tail(spread);
    if (refRise != null && refSpread != null) {
      for (let i = kaiStart; i < kaiEnd - f(0.5); i++) {
        if (Math.abs(S.rwRise[i] - refRise) < 4 && spread[i] >= refSpread - 6) {
          kaiStart = i;
          break;
        }
      }
    }
    kai = kaiStart + Math.round(0.6 * (kaiEnd - kaiStart));
  } else {
    kai = argBest(0, n - 1, (i) => (elevL[i] >= -25 && elevL[i] <= 30 ? spread[i] : NaN), "max");
    if (kai < 0) kai = Math.round(n * 0.7);
    kaiStart = kaiEnd = kai;
  }

  // 離れ: the drawing hand flies out behind (and stays out); the release is the right-wrist speed peak
  // just before that. Falls back to the plain speed peak after the hold.
  const flownOut = (i: number) => S.rwX[i] <= -1.5 * SHOULDER_CM;
  let out = -1;
  for (let i = Math.max(0, kaiEnd - f(0.5)); i < Math.min(n, kaiEnd + f(2.5)); i++) {
    let c = 0;
    for (let j = i; j < Math.min(n, i + 4); j++) if (flownOut(j)) c++;
    if (flownOut(i) && c >= 3) { out = i; break; }
  }
  let hanare = out >= 0
    ? argBest(Math.max(kaiStart, out - f(0.35)), out, (i) => S.vR[i], "max")
    : argBest(kaiEnd - f(0.2), Math.min(n - 1, kaiEnd + f(1.5)), (i) => S.vR[i], "max");
  const hanareFound = hanare >= 0 && (out >= 0 || S.vR[hanare] > 80);
  if (hanare < 0) hanare = clampI(kaiEnd + 1, n);
  if (kaiFound && hanare <= kaiEnd) {
    kaiEnd = Math.max(kaiStart, hanare - 1);
    kai = kaiStart + Math.round(0.6 * (kaiEnd - kaiStart));
  }

  // 残心: once both wrists are still again after 離れ (held ≥ 0.3 s): the middle of that hold, ≤ 1 s in.
  let zanshin = -1;
  {
    const need = f(0.3);
    let start = -1;
    let end = -1;
    for (let i = hanare + f(0.2); i < Math.min(n, hanare + f(4)); i++) {
      if (vMax(i) < 30) {
        if (start < 0) start = i;
        end = i;
      } else if (start >= 0) {
        if (end - start + 1 >= need) break;
        start = -1;
      }
    }
    if (start >= 0 && end - start + 1 >= need) zanshin = start + Math.min(f(1), Math.round((end - start) / 2));
  }
  const zanshinFound = zanshin >= 0;
  if (zanshin < 0) zanshin = clampI(hanare + f(1), n);

  // 打起し: before 会, fists highest; among the near-highest frames the one with the hands closest.
  const preKai = kaiStart - 1;
  const maxRise = Math.max(...rise.slice(0, Math.max(0, preKai + 1)).filter(ok), -Infinity);
  let uchi = argBest(0, preKai, (i) => (rise[i] >= maxRise - 6 && rise[i] > 0 ? spread[i] : NaN), "min");
  const uchiFound = uchi >= 0 && maxRise > 10;
  if (uchi < 0) uchi = clampI(kaiStart - f(8), n);

  // 大三: between 打起し and 会, hands still high, bow hand pushed part of the way out, a pause.
  const sU = spread[uchi], sK = spread[kai];
  let daisan = -1;
  if (ok(sU) && ok(sK) && sK > sU) {
    daisan = argBest(uchi + 1, preKai, (i) =>
      rise[i] >= maxRise - 25 && spread[i] >= sU + 0.3 * (sK - sU) && spread[i] <= sU + 0.85 * (sK - sU) ? vSum(i) : NaN, "min");
  }
  const daisanFound = daisan >= 0;
  if (daisan < 0) daisan = clampI(Math.round(uchi + (kaiStart - uchi) / 3), n);

  // 弓構え: the stillest frame shortly before the fists start to rise.
  const riseBefore = rise.slice(0, uchi).filter(ok);
  const lowRise = percentile(riseBefore, 10);
  let riseStart = -1;
  if (lowRise != null && ok(rise[uchi])) {
    const thr = lowRise + 0.3 * (rise[uchi] - lowRise);
    for (let i = uchi; i >= 0; i--) if (ok(rise[i]) && rise[i] < thr) { riseStart = i; break; }
  }
  let yugamae = riseStart >= 0 ? argBest(riseStart - f(1.5), riseStart, vSum, "min") : -1;
  const yugamaeFound = yugamae >= 0;
  if (yugamae < 0) yugamae = clampI(uchi - f(2), n);

  // 足踏み: once the feet are about as wide as during 会 (ankles are often hidden by the 袴: low confidence).
  const stanceRef = median(stance.slice(kaiStart, kaiEnd + 1).filter(ok));
  let ashibumi = -1;
  if (stanceRef != null) {
    for (let i = 0; i < yugamae; i++) {
      const c = S.m[i]?.stance?.conf ?? 0;
      if (ok(stance[i]) && c > 0.3 && stance[i] >= 0.85 * stanceRef) {
        ashibumi = Math.min(yugamae, i + f(0.5));
        break;
      }
    }
  }
  const ashibumiFound = ashibumi >= 0;
  if (ashibumi < 0) ashibumi = 0;

  // 胴造り: the stillest second between 足踏み and the turn of the head (物見, the end of 弓構え).
  // In a front view it differs from 弓構え mostly in depth, so only posture (lean, shoulders) is compared.
  let monomi = -1;
  for (let i = yugamae; i > ashibumi; i--) {
    if (ok(head[i]) && head[i] < 30) { monomi = i; break; }
  }
  if (monomi < 0) monomi = yugamae;
  const calm = (i: number) => {
    let sum = 0, cnt = 0;
    for (let j = Math.max(0, i - f(0.5)); j <= Math.min(n - 1, i + f(0.5)); j++) if (ok(vSum(j))) { sum += vSum(j); cnt++; }
    return cnt ? sum / cnt : NaN;
  };
  let dozukuri = argBest(ashibumi + f(1), monomi - f(1), calm, "min");
  const dozukuriFound = dozukuri >= 0;
  if (dozukuri < 0) dozukuri = clampI(Math.round((ashibumi + yugamae) / 2), n);

  const moments: Record<StepId, KeyMoment> = {
    ashibumi: { index: ashibumi, found: ashibumiFound },
    dozukuri: { index: dozukuri, found: dozukuriFound },
    yugamae: { index: yugamae, found: yugamaeFound },
    uchiokoshi: { index: uchi, found: uchiFound },
    daisan: { index: daisan, found: daisanFound },
    kai: { index: kai, found: kaiFound },
    hanare: { index: hanare, found: hanareFound },
    zanshin: { index: zanshin, found: zanshinFound },
  };
  // Keep the order of the 節 (a failed early guess must not land after a later one).
  let prev = 0;
  for (const id of STEP_IDS) {
    const mo = moments[id];
    if (mo.index < prev) {
      mo.index = prev;
      mo.found = false;
    }
    prev = mo.index;
  }
  return {
    moments,
    kaiRun: kaiFound ? [kaiStart, kaiEnd] : null,
    kaiHoldS: kaiFound && hanareFound ? Math.max(0, S.t[hanare] - S.t[kaiStart]) : null,
  };
}

// --- Mirror detection ----------------------------------------------------------------------

export interface MirrorGuess {
  mirrored: boolean;
  /** frames that looked like 会 with the extended arm on the expected / the opposite side */
  votesNormal: number;
  votesMirrored: number;
}

/**
 * In 会 the bow (left) arm is extended toward the target — the viewer's right — while the right hand
 * stays near the face. If instead the right-labelled arm reaches out to the viewer's left, the footage
 * is mirrored (typical of some front-camera recordings): MediaPipe then labels the sides the other way.
 */
export function detectMirror(track: PoseTrack): MirrorGuess {
  let votesNormal = 0, votesMirrored = 0;
  for (const fr of track.frames) {
    if (!fr.pts) continue;
    const g = (i: number) => px(fr.pts!, i, track.width, track.height);
    const ls = g(LM.leftShoulder), rs = g(LM.rightShoulder), lw = g(LM.leftWrist), rw = g(LM.rightWrist);
    const sw = Math.abs(ls.x - rs.x);
    if (sw < 4 || Math.min(ls.v, rs.v) < 0.5) continue;
    const cx = (ls.x + rs.x) / 2, cy = (ls.y + rs.y) / 2;
    const a = (lw.x - cx) / sw, b = (rw.x - cx) / sw;
    const level = (y: number) => Math.abs(y - cy) < 0.9 * sw;
    if (a > 1.4 && Math.abs(b) < 0.9 && level(lw.y) && level(rw.y)) votesNormal++;
    if (b < -1.4 && Math.abs(a) < 0.9 && level(lw.y) && level(rw.y)) votesMirrored++;
  }
  return { mirrored: votesMirrored >= 3 && votesMirrored > 1.5 * votesNormal, votesNormal, votesMirrored };
}

// --- Footage quality -------------------------------------------------------------------------

export interface QualityNote {
  id: "detect" | "small" | "oblique" | "short" | "noKai";
  text: string;
}

export function assessQuality(track: PoseTrack, seg: Segmentation | null): QualityNote[] {
  const notes: QualityNote[] = [];
  const fr = track.frames;
  const seen = fr.filter((f) => f.pts).length;
  if (fr.length && seen / fr.length < 0.6)
    notes.push({ id: "detect", text: `只有約 ${Math.round((seen / fr.length) * 100)}% 的畫面偵測到人，結果可能不完整。請確認全身都在畫面內、光線充足、背景單純。` });
  const sw: number[] = [];
  const ratio: number[] = [];
  for (const f of fr) {
    if (!f.pts) continue;
    const g = (i: number) => px(f.pts!, i, track.width, track.height);
    const ls = g(LM.leftShoulder), rs = g(LM.rightShoulder), lh = g(LM.leftHip), rh = g(LM.rightHip);
    if (Math.min(ls.v, rs.v) < 0.5) continue;
    const w = Math.hypot(ls.x - rs.x, ls.y - rs.y);
    sw.push(w / Math.min(track.width, track.height));
    const torso = Math.hypot((ls.x + rs.x - lh.x - rh.x) / 2, (ls.y + rs.y - lh.y - rh.y) / 2);
    if (torso > 1) ratio.push(w / torso);
  }
  const swm = median(sw);
  // Shoulder width under ~7% of the frame's short side: the body fills only a small part of the frame.
  if (swm != null && swm < 0.07)
    notes.push({ id: "small", text: "人在畫面中偏小，細節（手肘、頭部）的判斷會比較粗略。可以站近一點，或讓全身剛好填滿畫面。" });
  const rm = median(ratio);
  // The schematic's shoulder width / torso height is about 36 / 50; far below that = not a front view.
  if (rm != null && rm < 0.45)
    notes.push({ id: "oblique", text: "肩寬相對於軀幹看起來偏窄，可能不是正面拍攝。這裡的比較假設鏡頭在射手正前方（脇正面）。" });
  if (track.duration < 4) notes.push({ id: "short", text: "影片很短，可能沒有拍到完整的一射。" });
  if (seg && !seg.kaiRun)
    notes.push({ id: "noKai", text: "沒有找到明確的「会」（雙手張開並保持）。各節的自動位置可能不準，請用時間軸手動調整。" });
  return notes;
}
