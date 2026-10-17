"use client";

// Optional in-page recording with getUserMedia + MediaRecorder. The clip stays in memory as a Blob;
// nothing is uploaded. Kept deliberately small: start/stop, front/back camera, an optional countdown.

import { useEffect, useRef, useState } from "react";
import { btn } from "./ui";

const MAX_S = 120;
const MIME_CANDIDATES = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];

function pickMime(): string | undefined {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") return undefined;
  return MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m));
}

export function cameraSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";
}

export default function CameraRecorder({
  onRecorded,
  onClose,
}: {
  onRecorded: (blob: Blob, seconds: number) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [delay, setDelay] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stopTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };
  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.srcObject = stream;
  }, [stream]);

  useEffect(
    () => () => {
      stopTimers();
      try {
        if (recRef.current?.state === "recording") {
          recRef.current.ondataavailable = null;
          recRef.current.onstop = null;
          recRef.current.stop();
        }
      } catch {
        /* ignore */
      }
      stopStream();
    },
    [],
  );

  async function openCamera(face = facing) {
    setError(null);
    stopStream();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: face, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: false,
      });
      streamRef.current = s;
      setStream(s);
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setError(
        name === "NotAllowedError"
          ? "沒有取得相機權限。可以在瀏覽器的網站設定中允許相機，或改用「選擇影片檔」。"
          : name === "NotFoundError" || name === "OverconstrainedError"
            ? "找不到可用的相機。"
            : "無法開啟相機。可以改用手機相機錄好後再「選擇影片檔」。",
      );
      setStream(null);
    }
  }

  function begin() {
    const s = streamRef.current;
    if (!s) return;
    const mime = pickMime();
    let rec: MediaRecorder;
    try {
      rec = new MediaRecorder(s, mime ? { mimeType: mime, videoBitsPerSecond: 4_000_000 } : undefined);
    } catch {
      setError("這個瀏覽器無法錄影。請改用手機相機錄好後再「選擇影片檔」。");
      return;
    }
    const chunks: Blob[] = [];
    rec.ondataavailable = (ev) => {
      if (ev.data.size) chunks.push(ev.data);
    };
    rec.onstop = () => {
      stopTimers();
      setRecording(false);
      const secs = (performance.now() - startedAt.current) / 1000;
      const blob = new Blob(chunks, { type: rec.mimeType || mime || "video/webm" });
      stopStream();
      setStream(null);
      if (blob.size) onRecorded(blob, secs);
      else setError("錄影沒有內容，請再試一次。");
    };
    recRef.current = rec;
    startedAt.current = performance.now();
    rec.start(1000);
    setRecording(true);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      const secs = (performance.now() - startedAt.current) / 1000;
      setElapsed(Math.floor(secs));
      if (secs >= MAX_S) stop();
    }, 500);
  }

  function start() {
    if (!delay) return begin();
    let n = 5;
    setCountdown(n);
    timerRef.current = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        stopTimers();
        setCountdown(null);
        begin();
      } else setCountdown(n);
    }, 1000);
  }

  function stop() {
    try {
      if (recRef.current?.state === "recording") recRef.current.stop();
    } catch {
      /* ignore */
    }
  }

  function cancel() {
    stopTimers();
    setCountdown(null);
    if (recRef.current?.state === "recording") {
      recRef.current.onstop = null;
      recRef.current.stop();
      setRecording(false);
    }
    stopStream();
    setStream(null);
    onClose();
  }

  return (
    <div className="mt-4 rounded-xl border border-line bg-surface-2 p-3 sm:p-4">
      <p className="text-sm leading-relaxed text-muted">
        錄影只存在這個分頁的記憶體裡，不會上傳。請把手機固定在射手正前方、約胸口高度，讓全身（含弓）都在畫面內；最長 {MAX_S} 秒。
      </p>
      {stream ? (
        <div className="relative mx-auto mt-3 w-full max-w-md overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label="相機預覽"
            className={`block max-h-[60vh] w-full object-contain ${facing === "user" ? "-scale-x-100" : ""}`}
          />
          {countdown != null && (
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white drop-shadow">
              {countdown}
            </span>
          )}
          {recording && (
            <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-sm text-white">● 錄影中 {elapsed} 秒</span>
          )}
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {countdown != null ? `${countdown} 秒後開始錄影` : recording ? "錄影中" : ""}
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-vermilion">
          {error}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!stream ? (
          <button type="button" className={btn.primary} onClick={() => openCamera()}>
            開啟相機
          </button>
        ) : recording ? (
          <button type="button" className={btn.danger} onClick={stop}>
            停止錄影
          </button>
        ) : (
          <>
            <button type="button" className={btn.primary} onClick={start} disabled={countdown != null}>
              開始錄影
            </button>
            <button
              type="button"
              className={btn.secondary}
              disabled={countdown != null}
              onClick={() => {
                const f = facing === "user" ? "environment" : "user";
                setFacing(f);
                void openCamera(f);
              }}
            >
              切換前／後鏡頭
            </button>
          </>
        )}
        <button type="button" className={btn.secondary} onClick={cancel}>
          關閉
        </button>
        {!recording && (
          <label className="inline-flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[var(--wood)]" checked={delay} onChange={(e) => setDelay(e.target.checked)} />
            倒數 5 秒才開始（自己拍時方便就位）
          </label>
        )}
      </div>
    </div>
  );
}
