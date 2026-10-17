// MediaPipe PoseLandmarker, loaded lazily (browser only). The library code is a dynamic import so it
// is only fetched on /form-check after the user opts in; the wasm runtime and the model come from the
// official CDNs below. Video frames are processed in memory and never sent anywhere.

import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import { packLandmarks, type PoseFrame, type PoseTrack } from "./landmarks";
import { drawFrame, seek, whenVisible } from "./video";

/** Must match the installed @mediapipe/tasks-vision version (package.json) so JS and wasm agree. */
export const TASKS_VISION_VERSION = "1.1.1";
export const WASM_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;

export const MODELS = {
  full: {
    url: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
    label: "標準（full，約 9 MB）",
    mb: 9,
  },
  lite: {
    url: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    label: "較快（lite，約 6 MB；轉頭角度明顯偏小）",
    mb: 6,
  },
} as const;
export type ModelId = keyof typeof MODELS;
/** Approximate size of the wasm runtime download (MB). */
export const WASM_MB = 14;

/** Returns a user-facing message when this browser cannot run the detector, else null. */
export function unsupportedReason(): string | null {
  if (typeof window === "undefined") return "需要在瀏覽器中執行。";
  if (typeof WebAssembly === "undefined") return "這個瀏覽器不支援 WebAssembly，無法在裝置上執行姿勢偵測。請改用最新版的 Chrome、Safari、Edge 或 Firefox。";
  if (typeof HTMLCanvasElement === "undefined" || !document.createElement("canvas").getContext("2d"))
    return "這個瀏覽器無法使用 Canvas，無法讀取影片畫面。";
  return null;
}

function hasWebGL2(): boolean {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

export interface Detector {
  landmarker: PoseLandmarker;
  delegate: "GPU" | "CPU";
  /** last timestamp handed to detectForVideo (ms); VIDEO mode needs them strictly increasing */
  lastTs: number;
}

export async function createDetector(model: ModelId, preferGpu = true): Promise<Detector> {
  let vision: typeof import("@mediapipe/tasks-vision");
  try {
    vision = await import("@mediapipe/tasks-vision");
  } catch {
    throw new Error("載入姿勢偵測程式失敗。請確認網路連線後重試。");
  }
  let fileset;
  try {
    fileset = await vision.FilesetResolver.forVisionTasks(WASM_BASE);
  } catch {
    throw new Error("下載 WebAssembly 執行環境失敗。請確認網路連線（或關閉阻擋 cdn.jsdelivr.net 的外掛）後重試。");
  }
  const make = (delegate: "GPU" | "CPU") =>
    vision.PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODELS[model].url, delegate },
      runningMode: "VIDEO",
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputSegmentationMasks: false,
    });
  if (preferGpu && hasWebGL2()) {
    try {
      return { landmarker: await make("GPU"), delegate: "GPU", lastTs: 0 };
    } catch {
      /* fall back to CPU (no WebGL, or the GPU context failed) */
    }
  }
  try {
    return { landmarker: await make("CPU"), delegate: "CPU", lastTs: 0 };
  } catch {
    throw new Error("建立姿勢偵測模型失敗（模型下載中斷，或裝置記憶體不足）。請確認網路後重試，或改用「較快（lite）」模型。");
  }
}

export function closeDetector(d: Detector | null) {
  try {
    d?.landmarker.close();
  } catch {
    /* already closed */
  }
}

export interface RunOptions {
  fps: number;
  duration: number;
  width: number;
  height: number;
  signal: { cancelled: boolean };
  onProgress: (done: number, total: number) => void;
  /**
   * longer side of the frame handed to the model (px). 1280 keeps the face large enough for the
   * nose/ear head-turn estimate; at 640 a full-body shot leaves the head only ~15 px wide.
   */
  maxSide?: number;
  /** called when work pauses because the tab went to the background, and when it resumes */
  onHidden?: (hidden: boolean) => void;
}

export class CancelledError extends Error {
  constructor() {
    super("cancelled");
  }
}

/**
 * Seek through `video` at opts.fps and run the detector on each frame. If the GPU delegate fails on
 * the first frame, `onGpuFailure` can return a CPU detector to continue with.
 */
export async function runDetection(
  video: HTMLVideoElement,
  det: Detector,
  opts: RunOptions,
  onGpuFailure?: () => Promise<Detector>,
): Promise<{ track: PoseTrack; detector: Detector }> {
  const canvas = document.createElement("canvas");
  const step = 1 / opts.fps;
  const times: number[] = [];
  for (let t = 0; t < opts.duration - 0.02; t += step) times.push(Math.round(t * 1000) / 1000);
  const frames: PoseFrame[] = [];
  let d = det;
  for (let k = 0; k < times.length; k++) {
    if (opts.signal.cancelled) throw new CancelledError();
    const t = times[k];
    if (document.hidden) {
      opts.onHidden?.(true);
      await whenVisible();
      opts.onHidden?.(false);
      if (opts.signal.cancelled) throw new CancelledError();
    }
    const okSeek = await seek(video, t);
    if (opts.signal.cancelled) throw new CancelledError();
    if (!okSeek) {
      frames.push({ t, pts: null });
      continue;
    }
    const ctx = drawFrame(video, canvas, opts.maxSide ?? 1280);
    if (!ctx) throw new Error("無法讀取影片畫面。");
    const ts = Math.max(d.lastTs + 1, Math.round(t * 1000) + 1);
    let pts: Float32Array | null = null;
    try {
      const res = d.landmarker.detectForVideo(canvas, ts);
      d.lastTs = ts;
      const lm = res.landmarks[0];
      if (lm?.length) pts = packLandmarks(lm);
      res.close?.();
    } catch (err) {
      if (d.delegate === "GPU" && onGpuFailure && frames.length === 0) {
        closeDetector(d);
        d = await onGpuFailure();
        k--; // retry this frame on the CPU
        continue;
      }
      throw err instanceof Error ? err : new Error(String(err));
    }
    frames.push({ t, pts });
    opts.onProgress(k + 1, times.length);
    // Let the page breathe (progress bar, cancel button).
    if (k % 3 === 2) await new Promise((r) => setTimeout(r, 0));
  }
  return {
    track: { width: opts.width, height: opts.height, fps: opts.fps, duration: opts.duration, frames },
    detector: d,
  };
}

/** Sampling rate: ~12 fps, lowered for long clips so the work stays bounded (≤ ~1200 frames). */
export function chooseFps(duration: number): number {
  const fps = Math.min(12, 1200 / Math.max(1, duration));
  return Math.max(5, Math.round(fps));
}

/** Clips longer than this are refused: one shot is well under a minute and a half. */
export const MAX_DURATION_S = 240;
