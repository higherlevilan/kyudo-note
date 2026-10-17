// Canonical front-view reference values, derived from the site's illustration pose data by the
// same forward kinematics the ArcherFigure renderer uses (armJoints → front projection).
// Nothing here is hand-copied: change a pose in poses.ts and the reference values follow.
//
// The canonical figure is a schematic (≈ 170 cm adult, sources in poses.ts), not a measured standard.

import { POSES, type PoseId } from "@/content/illustrations/archer/poses";
import { SK, armJoints, feet, project, type V3 } from "@/components/illustrations/archer/geometry";
import { HEAD, computeMetrics, type Body2D, type Metrics } from "./metrics";
import type { Pt } from "./landmarks";

/**
 * Hip joints of the schematic. The illustration has no hip joints (the 袴 covers them); the torso is
 * upright, so only the midpoint's x (0) matters for the lean metric.
 */
const HIP: { x: number; y: number } = { x: 9, y: SK.waistY - 10 };
/** MediaPipe's ankle point sits about this fraction of the foot length in front of the heel. */
const ANKLE_FROM_HEEL = 0.22;

const front = (p: V3): Pt => {
  const q = project(p, "front");
  // project() returns screen coords (y down); metrics use y up.
  return { x: q.x, y: -q.y, v: 1 };
};
const P = (x: number, y: number): Pt => ({ x, y, v: 1 });

/** The illustration skeleton of one pose, projected to the front view, as metric input. */
export function canonicalBody(id: PoseId): Body2D {
  const pose = POSES[id];
  const L = armJoints("left", pose.left);
  const R = armJoints("right", pose.right);
  const ft = feet(pose);
  const ankle = (f: { toe: V3; heel: V3 }) =>
    front([f.heel[0] + (f.toe[0] - f.heel[0]) * ANKLE_FROM_HEEL, 8, f.heel[2] + (f.toe[2] - f.heel[2]) * ANKLE_FROM_HEEL]);
  // Head: the same model the head-turn metric inverts, so the metric returns pose.headYaw.
  const th = (pose.headYaw * Math.PI) / 180;
  const earY = SK.headY;
  return {
    ls: front(L.shoulder),
    rs: front(R.shoulder),
    le: front(L.elbow),
    re: front(R.elbow),
    lw: front(L.wrist),
    rw: front(R.wrist),
    lh: P(HIP.x, HIP.y),
    rh: P(-HIP.x, HIP.y),
    la: ankle(ft.left),
    ra: ankle(ft.right),
    nose: P(HEAD.noseFwd * Math.sin(th), earY - 3),
    lear: P(HEAD.earHalf * Math.cos(th), earY),
    rear: P(-HEAD.earHalf * Math.cos(th), earY),
  };
}

const cache = new Map<PoseId, Metrics>();

export function canonicalMetrics(id: PoseId): Metrics {
  let m = cache.get(id);
  if (!m) {
    m = computeMetrics(canonicalBody(id));
    cache.set(id, m);
  }
  return m;
}

/** Bow-hand (left wrist) displacement between two canonical poses, cm (front view). */
export function canonicalWristShift(from: PoseId, to: PoseId): number {
  const a = canonicalBody(from).lw;
  const b = canonicalBody(to).lw;
  return Math.hypot(a.x - b.x, a.y - b.y);
}
