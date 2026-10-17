"""Refine arm depth for a single front-camera kyudo clip.

A front camera measures left-right and up-down well but guesses depth. Bone
lengths are constant, so each arm bone's depth magnitude follows from how
foreshortened it looks: |dz| = sqrt(L² − dx² − dy²)  (Taylor 2000). Which way
it points (toward or away from the camera) is ambiguous from one view, so the
sign comes from kyudo form for each 節:

  打起し・大三        both arms reach forward (fists in front of the forehead)
  引分け・会          right elbow behind the shoulder, right hand forward to the cheek
  離れ・残心          right forearm swings back behind the elbow
  other 節            keep the detector's own sign

Works in MediaPipe world coordinates (camera-aligned: +z points AWAY from the
camera, so "forward toward the camera" is −z), before any upright rotation.
"""

import numpy as np

L_SH, R_SH, L_EL, R_EL, L_WR, R_WR = 11, 12, 13, 14, 15, 16
HAND = {L_WR: (17, 19, 21), R_WR: (18, 20, 22)}

# (segment ids) -> {bone: sign}; bone = (from, to); sign −1 = toward camera, +1 = away, 0 = keep.
RULES = [
    ({"uchiokoshi", "daisan"}, {(L_SH, L_EL): -1, (L_EL, L_WR): -1, (R_SH, R_EL): -1, (R_EL, R_WR): -1}),
    ({"hikiwake", "kai"}, {(L_SH, L_EL): -1, (L_EL, L_WR): -1, (R_SH, R_EL): +1, (R_EL, R_WR): -1}),
    ({"hanare", "zanshin"}, {(L_SH, L_EL): -1, (L_EL, L_WR): -1, (R_SH, R_EL): +1, (R_EL, R_WR): +1}),
]
BONES = [(L_SH, L_EL), (L_EL, L_WR), (R_SH, R_EL), (R_EL, R_WR)]


def bone_lengths(world):
    """Upper-arm and forearm length: the 95th percentile of the in-image-plane length
    (a bone looks longest when it lies flat to the camera), shared by both sides."""
    xy = lambda a, b: np.linalg.norm(world[:, b, :2] - world[:, a, :2], axis=1)
    upper = np.percentile(np.r_[xy(L_SH, L_EL), xy(R_SH, R_EL)], 95)
    fore = np.percentile(np.r_[xy(L_EL, L_WR), xy(R_EL, R_WR)], 95)
    return {(L_SH, L_EL): upper, (R_SH, R_EL): upper, (L_EL, L_WR): fore, (R_EL, R_WR): fore}


def refine(world, t, segments, smooth=3):
    """Return a copy of world (N×33×3) with arm depths rebuilt."""
    world = world.copy()
    lengths = bone_lengths(world)
    seg_of = np.array([next((s["id"] for s in segments if s["start"] <= ti < s["end"]), None) for ti in t], dtype=object)

    out = world.copy()
    for i in range(len(world)):
        rule = next((r for ids, r in RULES if seg_of[i] in ids), {})
        for a, b in BONES:
            d = world[i, b] - world[i, a]
            dz = np.sqrt(max(lengths[(a, b)] ** 2 - d[0] ** 2 - d[1] ** 2, 0.0))
            sign = rule.get((a, b), 0) or (np.sign(d[2]) or 1)
            new_b = out[i, a] + np.array([d[0], d[1], sign * dz])
            shift = new_b - out[i, b]
            out[i, b] = new_b
            # Move everything further down the chain (wrist, hand points) with the joint.
            chain = [L_WR, *HAND[L_WR]] if b == L_EL else [R_WR, *HAND[R_WR]] if b == R_EL else list(HAND.get(b, ()))
            out[i, chain] += shift

    # Sign switches at 節 boundaries would pop; smooth the arm joints over time.
    joints = [L_EL, R_EL, L_WR, R_WR, *HAND[L_WR], *HAND[R_WR]]
    sm = out.copy()
    for i in range(len(out)):
        lo, hi = max(0, i - smooth), min(len(out), i + smooth + 1)
        sm[i, joints] = out[lo:hi, joints].mean(axis=0)
    return sm, lengths
