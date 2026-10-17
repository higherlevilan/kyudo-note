"""Render a video with the extracted 2D skeleton drawn on top.

Usage:
  python overlay.py VIDEO LANDMARKS.json OUT.mp4 [--side-by-side]

--side-by-side puts the clean skeleton on a dark panel next to the overlay.
"""

import argparse
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np

BONES = [(11, 12), (11, 13), (13, 15), (12, 14), (14, 16), (11, 23), (12, 24), (23, 24), (23, 25), (25, 27),
         (24, 26), (26, 28), (27, 29), (29, 31), (27, 31), (28, 30), (30, 32), (28, 32), (15, 17), (15, 19),
         (16, 18), (16, 20), (0, 7), (0, 8)]
JOINTS = [0, 7, 8, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
LEFT = {1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31}
RIGHT = {4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32}
# BGR, matching the viewer: left (弓手) blue, right (妻手) red.
C_LEFT, C_RIGHT, C_CORE = (224, 163, 79), (79, 97, 224), (225, 230, 232)


def color(i):
    return C_LEFT if i in LEFT else C_RIGHT if i in RIGHT else C_CORE


def draw(img, pts, scale=1.0):
    th = max(2, int(3 * scale))
    for a, b in BONES:
        cv2.line(img, pts[a], pts[b], color(b if a == 0 else a), th, cv2.LINE_AA)
    for j in JOINTS:
        cv2.circle(img, pts[j], th + 3, color(j), -1, cv2.LINE_AA)
        cv2.circle(img, pts[j], th + 3, (20, 20, 20), 1, cv2.LINE_AA)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("landmarks")
    ap.add_argument("out")
    ap.add_argument("--side-by-side", action="store_true")
    args = ap.parse_args()

    lm = json.loads(Path(args.landmarks).read_text())
    frames = [f for f in lm["frames"] if f["pose"]]
    times = np.array([f["t"] for f in frames])

    cap = cv2.VideoCapture(args.video)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out_w = w * 2 if args.side_by_side else w
    tmp = Path(args.out).with_suffix(".raw.mp4")
    writer = cv2.VideoWriter(str(tmp), cv2.VideoWriter_fourcc(*"mp4v"), fps, (out_w, h))
    scale = h / 720

    i = 0
    while True:
        ok, img = cap.read()
        if not ok:
            break
        t = i / fps
        k = int(np.argmin(np.abs(times - t)))
        pts = [(int(x * w), int(y * h)) for x, y, _, _ in frames[k]["pose"]] if abs(times[k] - t) < 0.2 else None
        panel = np.full_like(img, 24)
        if pts:
            draw(img, pts, scale)
            draw(panel, pts, scale)
        writer.write(np.hstack([img, panel]) if args.side_by_side else img)
        i += 1
    writer.release()
    # Re-encode to H.264 so browsers can play it.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-c:v", "libx264", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", args.out], check=True)
    tmp.unlink()
    print("wrote", args.out)


if __name__ == "__main__":
    main()
