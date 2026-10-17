"""Extract per-frame body + hand landmarks from a kyudo video with MediaPipe.

Output JSON (one entry per sampled frame):
  t      : timestamp in seconds
  pose   : 33 x [x, y, z, visibility]  normalized image coords (x, y in 0..1)
  world  : 33 x [x, y, z]              metric 3D, hip-centred (metres)
  hands  : {"Left"|"Right": 21 x [x, y, z]} normalized image coords

Usage:
  python extract.py VIDEO OUT.json [--fps 12]
"""

import argparse
import json
from pathlib import Path

import cv2
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions, vision

MODELS = Path(__file__).parent / "models"


def r(v, n=4):
    return round(float(v), n)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("out")
    ap.add_argument("--fps", type=float, default=12.0, help="sampling rate")
    args = ap.parse_args()

    pose = vision.PoseLandmarker.create_from_options(
        vision.PoseLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=str(MODELS / "pose_landmarker_heavy.task")),
            running_mode=vision.RunningMode.VIDEO,
            num_poses=1,
        )
    )
    hands = vision.HandLandmarker.create_from_options(
        vision.HandLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=str(MODELS / "hand_landmarker.task")),
            running_mode=vision.RunningMode.VIDEO,
            num_hands=2,
        )
    )

    cap = cv2.VideoCapture(args.video)
    src_fps = cap.get(cv2.CAP_PROP_FPS)
    step = max(1, round(src_fps / args.fps))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    frames = []
    idx = 0
    while True:
        ok, bgr = cap.read()
        if not ok:
            break
        if idx % step == 0:
            ts_ms = int(idx * 1000 / src_fps)
            image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
            pr = pose.detect_for_video(image, ts_ms)
            hr = hands.detect_for_video(image, ts_ms)
            entry = {"t": r(ts_ms / 1000, 3), "pose": None, "world": None, "hands": {}}
            if pr.pose_landmarks:
                entry["pose"] = [[r(p.x), r(p.y), r(p.z), r(p.visibility, 3)] for p in pr.pose_landmarks[0]]
                entry["world"] = [[r(p.x), r(p.y), r(p.z)] for p in pr.pose_world_landmarks[0]]
            for lms, handed in zip(hr.hand_landmarks, hr.handedness):
                entry["hands"][handed[0].category_name] = [[r(p.x), r(p.y), r(p.z)] for p in lms]
            frames.append(entry)
        idx += 1

    out = {
        "source": Path(args.video).name,
        "width": width,
        "height": height,
        "fps": args.fps,
        "frames": frames,
    }
    Path(args.out).write_text(json.dumps(out, separators=(",", ":")))
    detected = sum(1 for f in frames if f["pose"])
    print(f"{len(frames)} frames sampled, pose detected in {detected}")


if __name__ == "__main__":
    main()
