"""Export a clip's motion for the website: smoothed, upright-corrected 3D joints only.

No image data is exported, only joint coordinates (MediaPipe's 33 landmarks),
so the site can show the 3D figure without publishing the source footage.

Output JSON:
  meta      : source title/url, segments, release_t, nock_t
  fps       : sampling rate of the frames
  frames    : [[t, x0, y0, z0, x1, y1, z1, ...], ...]  three.js convention
              (metres, +y up, +z toward the camera, hip-centred)
  tilt      : [[shoulder_deg, hip_deg], ...] per frame, measured in the image
              (+ = left side higher). The detector's 3D y is off by ~10° at the
              shoulders, so line tilts come from the 2D image instead.

Usage:
  python export_web.py LANDMARKS.json ANALYSIS.json OUT.json [--title T --url U]
"""

import argparse
import json
from pathlib import Path

import numpy as np

from refine_depth import refine


def line_tilt(pose, right, left, k):
    """Smoothed image-plane tilt of the right→left line, degrees (+ = left side higher)."""
    d = pose[:, left] - pose[:, right]
    deg = np.degrees(np.arctan2(-d[:, 1], np.abs(d[:, 0])))
    return np.array([deg[max(0, i - k): i + k + 1].mean() for i in range(len(deg))])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("landmarks")
    ap.add_argument("analysis")
    ap.add_argument("out")
    ap.add_argument("--title")
    ap.add_argument("--url")
    ap.add_argument("--smooth", type=int, default=2, help="moving-average half window (samples)")
    ap.add_argument("--refine-depth", action="store_true", help="rebuild arm depth from bone lengths + 節 rules")
    args = ap.parse_args()

    lm = json.loads(Path(args.landmarks).read_text())
    an = json.loads(Path(args.analysis).read_text())
    frames = [f for f in lm["frames"] if f["world"]]
    t = np.array([f["t"] for f in frames])
    world = np.array([f["world"] for f in frames])
    pose = np.array([[q[:2] for q in f["pose"]] for f in frames])
    pose[..., 0] *= lm["width"] / lm["height"]
    if args.refine_depth:
        world, lengths = refine(world, t, an["segments"])
        print("bone lengths (m):", {f"{a}-{b}": round(float(v), 3) for (a, b), v in lengths.items()})

    # Same smoothing and upright correction the local viewer applies.
    k = args.smooth
    sm = np.stack([world[max(0, i - k): i + k + 1].mean(axis=0) for i in range(len(world))])
    sm = sm @ np.array(an["up_rotation"]).T
    # MediaPipe world (+y down, +z away from camera) → three.js (+y up, +z toward camera).
    sm[..., 1] *= -1
    sm[..., 2] *= -1

    out = {
        "meta": {
            "source": an["source"],
            "ref": {"title": args.title, "url": args.url} if args.url else None,
            "segments": [{k: s[k] for k in ("id", "label", "start", "end", "keyframe_t")} for s in an["segments"]],
            "release_t": an.get("release_t"),
            "nock_t": an.get("nock_t"),
            "depth_refined": args.refine_depth,
        },
        "fps": lm["fps"],
        "frames": [[round(float(ti), 3), *np.round(p.reshape(-1), 3).tolist()] for ti, p in zip(t, sm)],
        "tilt": np.round(np.stack([line_tilt(pose, 12, 11, k), line_tilt(pose, 24, 23, k)], axis=1), 1).tolist(),
    }
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
    print(f"wrote {args.out}: {len(out['frames'])} frames, {Path(args.out).stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
