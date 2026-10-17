// Canvas drawing of the detected skeleton and of the canonical arm lines aligned to the learner's
// shoulders. Colours are fixed (they sit on top of video, not on the page background).

import { canonicalBody } from "./canonical";
import { BONES, LM, N_LM, STRIDE } from "./landmarks";
import type { PoseId } from "@/content/illustrations/archer/poses";

export const OVERLAY = {
  bowSide: "#59c3ef", // 弓手 (left) side
  drawSide: "#f4b740", // 妻手 (right) side
  centre: "#ffffff",
  canonical: "#ff6a4d",
  halo: "rgba(0,0,0,0.55)",
} as const;

const LEFT = new Set<number>([LM.leftShoulder, LM.leftElbow, LM.leftWrist, LM.leftHip, LM.leftKnee, LM.leftAnkle, LM.leftEar]);
const RIGHT = new Set<number>([LM.rightShoulder, LM.rightElbow, LM.rightWrist, LM.rightHip, LM.rightKnee, LM.rightAnkle, LM.rightEar]);

export interface DrawOptions {
  /** drawing size in px (the canvas' own coordinate space) */
  w: number;
  h: number;
  /** the displayed video is a mirror image of the (oriented) landmarks */
  mirrored: boolean;
  /** overlay the canonical arms of this pose, scaled by cmPerPx (in video px) and video→canvas factor */
  canonical?: { pose: PoseId; cmPerPx: number; videoW: number } | null;
  /** line width multiplier */
  scale?: number;
}

/** Draw one frame's skeleton. `pts` are oriented normalised landmarks (the archer's left = +x). */
export function drawPose(ctx: CanvasRenderingContext2D, pts: Float32Array | null, o: DrawOptions) {
  const { w, h } = o;
  const k = o.scale ?? Math.max(1, Math.min(w, h) / 360);
  ctx.save();
  if (o.mirrored) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (pts) {
    const P = (i: number) => [pts[i * STRIDE] * w, pts[i * STRIDE + 1] * h, pts[i * STRIDE + 2]] as const;
    const colour = (a: number, b: number) =>
      LEFT.has(a) && LEFT.has(b) ? OVERLAY.bowSide : RIGHT.has(a) && RIGHT.has(b) ? OVERLAY.drawSide : OVERLAY.centre;
    for (const pass of [0, 1]) {
      for (const [a, b] of BONES) {
        const pa = P(a), pb = P(b);
        const vis = Math.min(pa[2], pb[2]);
        if (vis < 0.2) continue;
        ctx.globalAlpha = vis < 0.5 ? 0.45 : 1;
        ctx.strokeStyle = pass === 0 ? OVERLAY.halo : colour(a, b);
        ctx.lineWidth = (pass === 0 ? 5 : 2.6) * k;
        ctx.setLineDash(vis < 0.5 && pass === 1 ? [3 * k, 3 * k] : []);
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    for (let i = 0; i < N_LM; i++) {
      if (!(LEFT.has(i) || RIGHT.has(i) || i === LM.nose)) continue;
      const [x, y, v] = P(i);
      if (v < 0.2) continue;
      ctx.globalAlpha = v < 0.5 ? 0.45 : 1;
      ctx.fillStyle = OVERLAY.halo;
      ctx.beginPath();
      ctx.arc(x, y, 4.2 * k, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = LEFT.has(i) ? OVERLAY.bowSide : RIGHT.has(i) ? OVERLAY.drawSide : OVERLAY.centre;
      ctx.beginPath();
      ctx.arc(x, y, 2.6 * k, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (o.canonical) drawCanonicalArms(ctx, pts, o, k);
  }
  ctx.restore();
}

/** The illustration's arms (shoulder → elbow → wrist), anchored at the learner's shoulder midpoint. */
function drawCanonicalArms(ctx: CanvasRenderingContext2D, pts: Float32Array, o: DrawOptions, k: number) {
  const c = o.canonical!;
  const { w, h } = o;
  const ls = [pts[LM.leftShoulder * STRIDE] * w, pts[LM.leftShoulder * STRIDE + 1] * h];
  const rs = [pts[LM.rightShoulder * STRIDE] * w, pts[LM.rightShoulder * STRIDE + 1] * h];
  if (Math.min(pts[LM.leftShoulder * STRIDE + 2], pts[LM.rightShoulder * STRIDE + 2]) < 0.3) return;
  const mx = (ls[0] + rs[0]) / 2, my = (ls[1] + rs[1]) / 2;
  // cm → canvas px: cmPerPx is in video pixels; the canvas may be drawn at another size.
  const pxPerCm = w / c.videoW / c.cmPerPx;
  const b = canonicalBody(c.pose);
  const cx = (b.ls.x + b.rs.x) / 2, cy = (b.ls.y + b.rs.y) / 2;
  const T = (p: { x: number; y: number }) => [mx + (p.x - cx) * pxPerCm, my - (p.y - cy) * pxPerCm] as const;
  const arms = [
    [b.ls, b.le, b.lw],
    [b.rs, b.re, b.rw],
  ];
  for (const pass of [0, 1]) {
    ctx.strokeStyle = pass === 0 ? "rgba(255,255,255,0.7)" : OVERLAY.canonical;
    ctx.lineWidth = (pass === 0 ? 4.4 : 2.2) * k;
    ctx.setLineDash(pass === 0 ? [] : [6 * k, 4 * k]);
    for (const arm of arms) {
      ctx.beginPath();
      arm.forEach((p, i) => {
        const [x, y] = T(p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    ctx.beginPath();
    const [x0, y0] = T(b.ls), [x1, y1] = T(b.rs);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}
