// 足踏み的立體示意：射位的地板、通往靶心的線、兩隻足袋腳底的輪廓（不畫人）。
// 依據網站內容：兩腳拇趾尖與靶心連成一直線、兩腳尖相距約一個矢束、兩腳約成 60 度（全弓連〈射法について〉）；
// 起點是執弓の姿勢的雙腳靠攏（指導書）；二足：左腳先踏開半步，看右腳腳下、右腳再踏開半步（指導書）；
// 一足：網站資料只寫「一步踏開」，所以只用淡入淡出表示前後位置，不畫腳怎麼移動。
// 座標同 illustrations/archer/geometry.ts：x = 射手的左（靶的方向），z = 射手前方，y = 上；單位公尺。
// 矢束以 85 cm 示意（同 Footprints.tsx），腳底輪廓也沿用 Footprints.tsx。

import type * as T from "three";
import type { Label, SceneFactory } from "../ThreeStage";
import { addLights, ease, mat, polyline, tween } from "../kit";

export type AshibumiMethod = "ni" | "ichi";

export interface AshibumiProps {
  method: AshibumiMethod;
  step: number;
}

const RAD = Math.PI / 180;
const HALF = 0.85 / 2; // half of one 矢束 (illustrative 85 cm)
const START = 0.015; // feet together: big-toe tips about 3 cm apart (示意)
const OUT = 30 * RAD; // each foot turned out → about 60° between the feet
const FOOT = 0.24;
const SOLE_T = 0.006;
const TARGET_X = 1.55;

/** Tabi sole (cm), same outline as Footprints.tsx: u from heel (0) to big-toe tip (24), v outward from the big-toe tip. */
const SOLE: [number, number][] = [
  [1.6, 0.9], [9, 0.6], [16.5, -1.1], [21, -1.1], [23.5, -0.3], [24, 1.2], [23.2, 2.6], [21.3, 3.1],
  [22, 4.4], [21.8, 6.4], [20.4, 8.1], [17.5, 9.2], [12, 8.4], [6, 7.2], [2.2, 6.6], [0.1, 5.2], [-0.4, 3.2],
];

interface FootPose {
  x: number;
  a: number;
}
interface Pose {
  L: FootPose;
  R: FootPose;
  active: "L" | "R" | null;
  look: boolean;
  dims: boolean;
  ghost: boolean;
}

const S: FootPose = { x: START, a: 0 };
const F: FootPose = { x: HALF, a: OUT };

function poseFor(method: AshibumiMethod, step: number): Pose {
  const base = { active: null, look: false, dims: false, ghost: false } as const;
  if (method === "ni") {
    switch (step) {
      case 0:
        return { ...base, L: S, R: S };
      case 1:
        return { ...base, L: S, R: S, look: true };
      case 2:
        return { ...base, L: F, R: S, active: "L" };
      case 3:
        return { ...base, L: F, R: F, active: "R" };
      default:
        return { ...base, L: F, R: F, dims: true };
    }
  }
  switch (step) {
    case 0:
      return { ...base, L: S, R: S };
    case 1:
      return { ...base, L: S, R: S, look: true };
    case 2:
      return { ...base, L: F, R: F, ghost: true };
    default:
      return { ...base, L: F, R: F, dims: true };
  }
}

const make: SceneFactory<AshibumiProps> = (ctx, props) => {
  const { THREE, scene, colors } = ctx;
  addLights(ctx, { key: [1.5, 4, 3] });

  // ---- floor of the 射位 (wooden boards)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.55), mat(ctx, colors.woodSoft, { roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0.4, 0, -0.33);
  scene.add(floor);
  for (let z = -1.05; z <= 0.4; z += 0.13) {
    scene.add(polyline(ctx, [[-0.95, 0.0005, z], [1.75, 0.0005, z]], colors.line, { opacity: 0.6 }));
  }
  ctx.label("射位的地板", [-0.75, 0, 0.32], { small: true });

  // ---- the line through the big-toe tips to the target, with a break (distance not to scale)
  const toeLine = polyline(ctx, [[-0.9, 0.002, 0], [1.08, 0.002, 0]], colors.vermilion, { dashed: true, opacity: 0.6 });
  const tlm = toeLine.material as T.LineDashedMaterial;
  tlm.dashSize = 0.04;
  tlm.gapSize = 0.025;
  scene.add(toeLine);
  const toeLine2 = polyline(ctx, [[1.18, 0.002, 0], [TARGET_X, 0.002, 0]], colors.vermilion, { dashed: true, opacity: 0.6 });
  Object.assign(toeLine2.material, { dashSize: 0.04, gapSize: 0.025 });
  scene.add(toeLine2);
  for (const x of [1.1, 1.16]) scene.add(polyline(ctx, [[x - 0.02, 0.002, 0.05], [x + 0.02, 0.002, -0.05]], colors.muted));
  ctx.label("距離不按比例", [1.13, 0, 0.1], { small: true });

  // ---- the target (的), standing, face toward the archer
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const g = cv.getContext("2d");
  if (g) {
    g.fillStyle = `#${colors.surface.getHexString()}`;
    g.fillRect(0, 0, 128, 128);
    g.strokeStyle = g.fillStyle = `#${colors.vermilion.getHexString()}`;
    g.lineWidth = 8;
    g.beginPath();
    g.arc(64, 64, 58, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.arc(64, 64, 30, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.arc(64, 64, 9, 0, Math.PI * 2);
    g.fill();
  }
  const face = new THREE.CanvasTexture(cv);
  face.colorSpace = THREE.SRGBColorSpace;
  const faceMat = new THREE.MeshBasicMaterial({ map: face });
  const mato = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 40), [mat(ctx, colors.wood), faceMat, faceMat]);
  mato.rotation.z = Math.PI / 2; // caps face ±x
  mato.position.set(TARGET_X, 0.19, 0);
  scene.add(mato);
  const matoLabel = ctx.label("的（示意）", [TARGET_X, 0.43, 0], { tone: "vermilion" });

  // ---- feet
  const shapeOf = (mirror: 1 | -1) => {
    const s = new THREE.Shape();
    SOLE.forEach(([u, v], i) => {
      const x = mirror * v * 0.01;
      const y = (24 - u) * 0.01;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
    s.closePath();
    return s;
  };
  const outlinePts = (mirror: 1 | -1, y: number) => SOLE.map(([u, v]) => new THREE.Vector3(mirror * v * 0.01, (24 - u) * 0.01, y));

  interface Foot {
    group: T.Group;
    fill: T.MeshStandardMaterial;
    line: T.LineBasicMaterial;
    dot: T.MeshBasicMaterial;
    label: Label;
    pose: FootPose;
    side: 1 | -1;
  }
  const makeFoot = (side: 1 | -1, name: string): Foot => {
    const group = new THREE.Group();
    const fill = mat(ctx, colors.surface, { side: THREE.DoubleSide, transparent: true });
    const sole = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeOf(side), { depth: SOLE_T, bevelEnabled: false }), fill);
    sole.rotation.x = -Math.PI / 2; // shape y → −z (toward the heel), extrusion → up
    group.add(sole);
    const line = new THREE.LineBasicMaterial({ color: colors.ink, transparent: true });
    sole.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(outlinePts(side, SOLE_T + 0.0005)), line));
    const dot = new THREE.MeshBasicMaterial({ color: colors.vermilion, transparent: true });
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.011, 20), dot);
    d.rotation.x = -Math.PI / 2;
    d.position.y = SOLE_T + 0.001;
    group.add(d);
    scene.add(group);
    return { group, fill, line, dot, label: ctx.label(name, [0, 0, 0], { small: true }), pose: { ...S }, side };
  };
  const feet = { L: makeFoot(1, "左腳"), R: makeFoot(-1, "右腳") };

  const place = (f: Foot) => {
    f.group.position.set(f.side * f.pose.x, 0, 0);
    f.group.rotation.y = f.side * f.pose.a;
    // label beside the heel, a little outward
    const d = new THREE.Vector3(f.side * Math.sin(f.pose.a), 0, Math.cos(f.pose.a));
    const w = new THREE.Vector3(f.side * Math.cos(f.pose.a), 0, -Math.sin(f.pose.a));
    f.label.pos.copy(f.group.position).addScaledVector(d, -FOOT - 0.04).addScaledVector(w, 0.06);
  };
  const setOpacity = (f: Foot, o: number) => {
    f.fill.opacity = o;
    f.line.opacity = o;
    f.dot.opacity = o;
  };

  // ghosts of the starting position (一足: only before / after is shown)
  const ghosts: T.LineLoop[] = [];
  for (const side of [1, -1] as const) {
    const m = new THREE.LineDashedMaterial({ color: colors.muted, dashSize: 0.012, gapSize: 0.009 });
    const loop = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(outlinePts(side, 0)), m);
    loop.computeLineDistances();
    loop.rotation.x = -Math.PI / 2;
    const holder = new THREE.Group();
    holder.position.set(side * START, 0.002, 0);
    holder.add(loop);
    scene.add(holder);
    ghosts.push(loop);
  }
  const ghostLabel = ctx.label("起點（靠攏）", [0, 0, -0.3], { small: true, visible: false });

  // ---- dimensions (shown on the last step)
  const dims = new THREE.Group();
  scene.add(dims);
  const DZ = 0.075;
  dims.add(polyline(ctx, [[-HALF, 0.003, DZ], [HALF, 0.003, DZ]], colors.wood));
  for (const s of [-1, 1]) {
    dims.add(polyline(ctx, [[s * HALF, 0.003, 0.012], [s * HALF, 0.003, DZ + 0.02]], colors.wood));
    dims.add(polyline(ctx, [[s * (HALF - 0.03), 0.003, DZ - 0.015], [s * HALF, 0.003, DZ], [s * (HALF - 0.03), 0.003, DZ + 0.015]], colors.wood));
  }
  const apexZ = -HALF / Math.tan(OUT);
  for (const s of [-1, 1]) {
    const ax = polyline(ctx, [[0, 0.003, apexZ], [s * HALF, 0.003, 0]], colors.muted, { dashed: true, opacity: 0.9 });
    Object.assign(ax.material, { dashSize: 0.025, gapSize: 0.02 });
    dims.add(ax);
  }
  const ARC = 0.17;
  const arc: [number, number, number][] = [];
  for (let i = 0; i <= 24; i++) {
    const a = -OUT + (2 * OUT * i) / 24;
    arc.push([ARC * Math.sin(a), 0.003, apexZ + ARC * Math.cos(a)]);
  }
  dims.add(polyline(ctx, arc, colors.wood));
  const dimLabels = [
    ctx.label("約矢束", [0, 0, DZ + 0.06], { tone: "wood" }),
    ctx.label("約 60°", [0, 0, apexZ + ARC + 0.07], { tone: "wood" }),
    ctx.label("拇趾尖對準靶心", [0.8, 0, -0.06], { tone: "vermilion", small: true }),
  ];

  // ---- apply a pose
  const first = poseFor(props.method, props.step);
  let cancel = () => {};
  const style = (p: Pose) => {
    for (const k of ["L", "R"] as const) {
      const f = feet[k];
      const on = p.active === k;
      f.fill.color.copy(on ? colors.yamabuki : colors.surface);
      f.label.tone(on ? "wood" : "muted");
      f.label.set(on ? `${k === "L" ? "左腳" : "右腳"}（這一步）` : k === "L" ? "左腳" : "右腳");
    }
    const hot = p.look || p.dims;
    tlm.opacity = hot ? 1 : 0.6;
    (toeLine2.material as T.LineDashedMaterial).opacity = hot ? 1 : 0.6;
    matoLabel.set(p.look ? "先看靶（的）" : "的（示意）");
    for (const gh of ghosts) gh.visible = p.ghost;
    ghostLabel.show(p.ghost);
    dims.visible = p.dims;
    for (const l of dimLabels) l.show(p.dims);
  };
  const snap = (p: Pose) => {
    feet.L.pose = { ...p.L };
    feet.R.pose = { ...p.R };
    place(feet.L);
    place(feet.R);
  };

  const go = (next: Pose, fade: boolean) => {
    cancel();
    style(next);
    const from = { L: { ...feet.L.pose }, R: { ...feet.R.pose } };
    const same = (k: "L" | "R") => from[k].x === next[k].x && from[k].a === next[k].a;
    if (same("L") && same("R")) {
      setOpacity(feet.L, 1);
      setOpacity(feet.R, 1);
      snap(next);
      ctx.invalidate();
      return;
    }
    if (fade) {
      // 一足 / method change: no movement path, just fade the feet in at the new place
      snap(next);
      cancel = tween(ctx, 700, (k) => {
        const o = ease(k);
        setOpacity(feet.L, o);
        setOpacity(feet.R, o);
      });
      return;
    }
    setOpacity(feet.L, 1);
    setOpacity(feet.R, 1);
    cancel = tween(ctx, 900, (k) => {
      const e = ease(k);
      for (const key of ["L", "R"] as const) {
        const f = feet[key];
        f.pose = { x: from[key].x + (next[key].x - from[key].x) * e, a: from[key].a + (next[key].a - from[key].a) * e };
        place(f);
      }
    });
  };

  snap(first);
  style(first);
  let last = props;

  return {
    update(p) {
      const next = poseFor(p.method, p.step);
      // 一足 and method changes fade instead of sliding (no movement path is given for them)
      go(next, p.method === "ichi" || p.method !== last.method);
      last = p;
    },
    dispose() {
      cancel();
    },
  };
};

export default make;
