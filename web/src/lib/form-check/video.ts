// Small helpers around <video> for frame-accurate, offline processing (browser only).

export class VideoLoadError extends Error {
  constructor(
    message: string,
    readonly kind: "codec" | "timeout" | "empty",
  ) {
    super(message);
  }
}

function once(el: HTMLMediaElement, events: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve) => {
    const off = () => {
      clearTimeout(timer);
      for (const e of events) el.removeEventListener(e, on[e]);
    };
    const on: Record<string, () => void> = {};
    for (const e of events)
      on[e] = () => {
        off();
        resolve(e);
      };
    const timer = setTimeout(() => {
      off();
      resolve("timeout");
    }, timeoutMs);
    for (const e of events) el.addEventListener(e, on[e]);
  });
}

/**
 * Browsers defer media loading and seeking in background tabs. Resolves once the page is visible
 * (immediately if it already is), so long work pauses instead of timing out.
 */
export function whenVisible(): Promise<void> {
  if (typeof document === "undefined" || !document.hidden) return Promise.resolve();
  return new Promise((resolve) => {
    const on = () => {
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", on);
      resolve();
    };
    document.addEventListener("visibilitychange", on);
  });
}

/** Point `video` at `url` and wait until a frame can be drawn. Throws VideoLoadError with a clear message. */
export async function loadVideo(video: HTMLVideoElement, url: string, fallbackDuration?: number): Promise<{ duration: number; width: number; height: number }> {
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  if (video.src !== url) {
    video.src = url;
    video.load();
  }
  await whenVisible();
  if (video.readyState < 2) {
    const ev = await once(video, ["loadeddata", "error"], 20_000);
    if (ev === "error") {
      throw new VideoLoadError(
        "這個瀏覽器無法解碼這支影片（常見於 HEVC/H.265 或特殊格式）。請改用 MP4（H.264）格式，或在手機相機設定中選擇「最相容」後重新錄影。",
        "codec",
      );
    }
    if (ev === "timeout") throw new VideoLoadError("影片載入逾時。請確認檔案完整，或換一個較短的影片。", "timeout");
  }
  if (!video.videoWidth || !video.videoHeight) throw new VideoLoadError("讀不到影片畫面（可能只有聲音軌，或格式不受支援）。", "empty");
  // iOS Safari decodes frames for seeking only after the element has played once.
  try {
    await video.play();
    video.pause();
  } catch {
    /* autoplay refused: seeking still works on most browsers */
  }
  let duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    // MediaRecorder WebM files carry no duration; seeking far ahead makes the browser compute it.
    video.currentTime = 1e7;
    await once(video, ["durationchange", "seeked"], 5_000);
    duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : (fallbackDuration ?? 0);
    await seek(video, 0);
  }
  if (!(duration > 0)) throw new VideoLoadError("無法判斷影片長度。請換一個檔案試試。", "empty");
  return { duration, width: video.videoWidth, height: video.videoHeight };
}

/** Seek and resolve once the frame at t is ready (false on timeout). */
export function seek(video: HTMLVideoElement, t: number, timeoutMs = 5_000): Promise<boolean> {
  if (Math.abs(video.currentTime - t) < 0.0005 && !video.seeking && video.readyState >= 2) return Promise.resolve(true);
  const p = once(video, ["seeked"], timeoutMs).then((e) => e === "seeked");
  video.currentTime = t;
  return p;
}

/** Draw the current video frame into `canvas`, scaled so the longer side is at most maxSide px. */
export function drawFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement, maxSide: number): CanvasRenderingContext2D | null {
  const k = Math.min(1, maxSide / Math.max(video.videoWidth, video.videoHeight));
  const w = Math.max(1, Math.round(video.videoWidth * k));
  const h = Math.max(1, Math.round(video.videoHeight * k));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, w, h);
  return ctx;
}
