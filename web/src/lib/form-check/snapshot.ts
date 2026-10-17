// Still images of chosen frames (video frame + skeleton + canonical arms) for the result cards.
// They are data: URLs kept in memory only.

import type { PoseId } from "@/content/illustrations/archer/poses";
import type { Analysis } from "./analysis";
import { drawPose } from "./draw";
import { drawFrame, seek } from "./video";

export async function snapshot(video: HTMLVideoElement, a: Analysis, index: number, pose: PoseId, maxSide = 540): Promise<string | null> {
  const f = a.track.frames[index];
  if (!f) return null;
  if (!(await seek(video, f.t))) return null;
  const canvas = document.createElement("canvas");
  const ctx = drawFrame(video, canvas, maxSide);
  if (!ctx) return null;
  drawPose(ctx, f.pts, {
    w: canvas.width,
    h: canvas.height,
    mirrored: a.mirrored,
    canonical: { pose, cmPerPx: a.cmPerPx, videoW: a.track.width },
  });
  try {
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return null;
  }
}
