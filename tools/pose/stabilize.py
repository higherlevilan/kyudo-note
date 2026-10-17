"""Stabilize a kyudo clip for display, using how the body is supposed to move.

Works on three.js-convention frames (N×33×3, +y up, hip-centred), after the
upright rotation. Three steps, each grounded in kyudo form:

1. Smooth detector jitter with a Gaussian filter: stronger on the head and legs,
   lighter on the arms, and almost none on the right arm around 離れ so the
   release keeps its snap.
2. Keep the torso vertical (胴造り holds through every 節): each frame, the upper
   body is rotated about the hip centre so the spine points straight up. Arms and
   head keep their pose relative to the torso.
3. Plant the lower body where the feet do not move — 執弓の姿勢 (feet together) and
   from the end of 足踏み until 弓倒し — pinning the legs to their median pose over
   each span, blending in and out at the edges.
"""

import numpy as np

UPPER = list(range(0, 23))  # face, shoulders, arms, hands
LEGS = list(range(23, 33))  # hips, knees, ankles, heels, toes
HEAD = list(range(0, 11))
R_ARM = [12, 14, 16, 18, 20, 22]


def gaussian_smooth(x, t, sigma_s):
    """Smooth along time; sigma_s may be a scalar or a per-frame array (seconds)."""
    sig = np.broadcast_to(np.asarray(sigma_s, dtype=float), t.shape)
    out = np.empty_like(x)
    for i in range(len(t)):
        if sig[i] <= 1e-6:
            out[i] = x[i]
            continue
        w = np.exp(-0.5 * ((t - t[i]) / sig[i]) ** 2)
        w[w < 1e-4] = 0
        out[i] = np.tensordot(w, x, axes=(0, 0)) / w.sum()
    return out


def rotation_to_vertical(v):
    """Rotation matrix taking direction v onto +y."""
    a = v / np.linalg.norm(v)
    b = np.array([0.0, 1.0, 0.0])
    c = float(np.dot(a, b))
    if c > 1 - 1e-9:
        return np.eye(3)
    axis = np.cross(a, b)
    vx = np.array([[0, -axis[2], axis[1]], [axis[2], 0, -axis[0]], [-axis[1], axis[0], 0]])
    return np.eye(3) + vx + vx @ vx / (1 + c)


def ramp(t, start, end, fade):
    """1 inside [start, end], fading linearly to 0 over `fade` seconds outside."""
    w = np.ones_like(t)
    w = np.minimum(w, np.clip((t - (start - fade)) / fade, 0, 1))
    w = np.minimum(w, np.clip(((end + fade) - t) / fade, 0, 1))
    return w


def stabilize(F, t, segments, release_t=None):
    F = F.copy()
    seg = {s["id"]: s for s in segments}

    # 1. Smoothing.
    out = np.empty_like(F)
    out[:, LEGS] = gaussian_smooth(F[:, LEGS], t, 0.25)
    out[:, HEAD] = gaussian_smooth(F[:, HEAD], t, 0.2)
    arms = [j for j in UPPER if j not in HEAD]
    out[:, arms] = gaussian_smooth(F[:, arms], t, 0.12)
    if release_t is not None:
        near = np.abs(t - release_t) < 0.3
        sig = np.where(near, 0.0, 0.12)
        out[:, R_ARM] = gaussian_smooth(F[:, R_ARM], t, sig)
    F = out

    # 2. Torso vertical.
    for i in range(len(F)):
        hip = F[i, [23, 24]].mean(axis=0)
        sh = F[i, [11, 12]].mean(axis=0)
        R = rotation_to_vertical(sh - hip)
        F[i, UPPER] = (F[i, UPPER] - hip) @ R.T + hip

    # 3. Planted lower body: 執弓の姿勢, and from the end of 足踏み until 弓倒し.
    spans = []
    if "torimi" in seg:
        spans.append((seg["torimi"]["start"], seg["torimi"]["end"]))
    if "ashibumi" in seg and "yudaoshi" in seg:
        spans.append((seg["ashibumi"]["end"], seg["yudaoshi"]["start"]))
    for start, end in spans:
        span = (t >= start) & (t < end)
        if span.any():
            planted = np.median(F[span][:, LEGS], axis=0)
            w = ramp(t, start, end, 0.4)[:, None, None]
            F[:, LEGS] = (1 - w) * F[:, LEGS] + w * planted
    return F
