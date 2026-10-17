"""Compute kyudo-relevant joint metrics from extract.py output.

For every segment it picks a keyframe (the stillest frame in the middle
60% of the segment) and reports angles at that frame, plus the release
instant (peak right-wrist speed inside 会→残心).

Usage:
  python analyze.py LANDMARKS.json SEGMENTS.json OUT.json
"""

import json
import sys
from pathlib import Path

import numpy as np

NOSE, L_EAR, R_EAR = 0, 7, 8
L_SH, R_SH, L_EL, R_EL, L_WR, R_WR = 11, 12, 13, 14, 15, 16
L_HIP, R_HIP, L_KNEE, R_KNEE, L_ANK, R_ANK = 23, 24, 25, 26, 27, 28
L_HEEL, R_HEEL, L_TOE, R_TOE = 29, 30, 31, 32


def angle(a, b, c):
    """Angle ABC in degrees."""
    v1, v2 = a - b, c - b
    cos = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-9)
    return float(np.degrees(np.arccos(np.clip(cos, -1, 1))))


def tilt(p, q):
    """Image-plane tilt of segment p→q from horizontal, degrees (+ = q higher)."""
    d = q - p
    return float(np.degrees(np.arctan2(-d[1], abs(d[0]) + 1e-9)))


def elevation(p, q):
    """Elevation of q above p in 3D world space, degrees (world y points down)."""
    d = q - p
    return float(np.degrees(np.arctan2(-d[1], np.hypot(d[0], d[2]))))


def upright_rotation(world, t, seg):
    """Rotation that makes the body vertical during 胴造り.

    A single front camera is usually pitched, which tilts MediaPipe's world
    frame. 胴造り is a still, upright stance, so mid-ankle minus mid-shoulder
    there defines true down (+y in MediaPipe coordinates).
    """
    # Short clips without 胴造り fall back to the whole clip (the stance stays upright).
    s = next((s for s in seg["segments"] if s["id"] == "dozukuri"), None)
    idx = (t >= s["start"]) & (t <= s["end"]) if s else np.ones_like(t, dtype=bool)
    down = ((world[idx, L_ANK] + world[idx, R_ANK]) / 2 - (world[idx, L_SH] + world[idx, R_SH]) / 2).mean(axis=0)
    a = down / np.linalg.norm(down)
    b = np.array([0.0, 1.0, 0.0])
    v, c = np.cross(a, b), float(np.dot(a, b))
    vx = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
    return np.eye(3) + vx + vx @ vx / (1 + c)


def smooth(arr, k=3):
    out = arr.copy()
    for i in range(len(arr)):
        lo, hi = max(0, i - k), min(len(arr), i + k + 1)
        out[i] = np.nanmean(arr[lo:hi], axis=0)
    return out


def metrics(world, img, vis, aspect):
    w = world
    # Image coords scaled so x and y share units.
    p = img.copy()
    p[:, 0] *= aspect
    sh_w = np.linalg.norm(w[L_SH] - w[R_SH])
    m = {
        "elbow_left": angle(w[L_SH], w[L_EL], w[L_WR]),
        "elbow_right": angle(w[R_SH], w[R_EL], w[R_WR]),
        "shoulder_left": angle(w[L_HIP], w[L_SH], w[L_EL]),
        "shoulder_right": angle(w[R_HIP], w[R_SH], w[R_EL]),
        "fist_elevation_left": elevation(w[L_SH], w[L_WR]),
        "fist_elevation_right": elevation(w[R_SH], w[R_WR]),
        "wrist_height_diff_cm": float((w[R_WR][1] - w[L_WR][1]) * 100),
        "shoulder_tilt": tilt(p[R_SH], p[L_SH]),
        "hip_tilt": tilt(p[R_HIP], p[L_HIP]),
        "stance_to_shoulder_ratio": float(np.linalg.norm(w[L_ANK] - w[R_ANK]) / sh_w),
        "head_yaw_index": float(
            (p[NOSE][0] - (p[L_EAR][0] + p[R_EAR][0]) / 2) / (abs(p[L_EAR][0] - p[R_EAR][0]) + 1e-9)
        ),
        "low_visibility": [i for i in (L_ANK, R_ANK, L_HEEL, R_HEEL, L_TOE, R_TOE, L_KNEE, R_KNEE) if vis[i] < 0.5],
    }
    return {k: (round(v, 1) if isinstance(v, float) else v) for k, v in m.items()}


def main():
    lm = json.loads(Path(sys.argv[1]).read_text())
    seg = json.loads(Path(sys.argv[2]).read_text())
    aspect = lm["width"] / lm["height"]

    frames = [f for f in lm["frames"] if f["world"]]
    t = np.array([f["t"] for f in frames])
    world = smooth(np.array([f["world"] for f in frames]))
    rot = upright_rotation(world, t, seg)
    world = world @ rot.T
    img = smooth(np.array([[q[:3] for q in f["pose"]] for f in frames]))
    vis = np.array([[q[3] for q in f["pose"]] for f in frames])

    # Per-frame motion: mean landmark displacement of the upper body.
    upper = [L_SH, R_SH, L_EL, R_EL, L_WR, R_WR, NOSE]
    motion = np.r_[np.inf, np.linalg.norm(np.diff(world[:, upper], axis=0), axis=2).mean(axis=1)]

    # Release: right wrist peak speed between 会 start and 離れ end. Captions
    # lag the motion, so the release instant comes from the raw (unsmoothed) data.
    # Clips without 会/離れ (e.g. a 足踏み-only clip) have no release.
    raw_wr = np.array([f["world"][R_WR] for f in frames])
    kai = next((s for s in seg["segments"] if s["id"] == "kai"), None)
    han = next((s for s in seg["segments"] if s["id"] == "hanare"), None)
    rel, release_t = None, None
    if kai and han:
        idx = np.where((t >= kai["start"]) & (t <= han["end"]))[0]
        speed = np.linalg.norm(np.diff(raw_wr, axis=0), axis=1)
        rel = idx[np.argmax(speed[idx[:-1]])] + 1
        release_t = float(t[rel])

    out = {"source": seg["source"], "release_t": release_t,
           "kai_hold_s": round(release_t - kai["start"], 2) if release_t is not None else None,
           "up_rotation": np.round(rot, 5).tolist(), "nock_t": seg.get("nock_t"), "segments": []}
    for s in seg["segments"]:
        if s["id"] == "hanare":
            # 離れ is an instant: report the first frame after release.
            k = rel
        else:
            span = s["end"] - s["start"]
            lo, hi = s["start"] + 0.2 * span, s["end"] - 0.2 * span
            if s["id"] == "kai":
                hi = min(hi, release_t - 0.2)
            idx = np.where((t >= lo) & (t <= hi))[0]
            if len(idx) == 0:
                continue
            k = idx[np.argmin(motion[idx])]
        out["segments"].append({**s, "keyframe_t": float(t[k]), "metrics": metrics(world[k], img[k], vis[k], aspect)})

    Path(sys.argv[3]).write_text(json.dumps(out, ensure_ascii=False, indent=2))
    for s in out["segments"]:
        m = s["metrics"]
        print(
            f'{s["label"]:<8} t={s["keyframe_t"]:6.2f}  elbowL/R={m["elbow_left"]:5.1f}/{m["elbow_right"]:5.1f}  '
            f'shL/R={m["shoulder_left"]:5.1f}/{m["shoulder_right"]:5.1f}  fistElevL/R={m["fist_elevation_left"]:5.1f}/{m["fist_elevation_right"]:5.1f}  '
            f'shTilt={m["shoulder_tilt"]:5.1f} hipTilt={m["hip_tilt"]:5.1f} stance={m["stance_to_shoulder_ratio"]:.2f} '
            f'yaw={m["head_yaw_index"]:5.2f} lowVis={m["low_visibility"]}'
        )
    if release_t is not None:
        print("release at", out["release_t"], "s; 会 held ≈", out["kai_hold_s"], "s")


if __name__ == "__main__":
    main()
