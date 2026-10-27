// 近的射場的 3D 示意（5 人立）。單位：公尺。
// 座標：x 是射位的排列方向（+x 是脇正面那一側），y 向上，z 由射位往後為正；射位線在 z = 0，的在 z = −28。
// 按比例的數字，全部取自 illustrations/dojo/ShajoLayout.tsx 與 Targets.tsx（《弓道競技規則》）：
//   射距離 28 m（第 22 條）、射位間隔 1.8 m、本座到射位 2.0 m；
//   霞的直徑 36 cm、各圈半徑 3.6／7.2／10.2／11.7／14.7／18 cm（第 26 條），靶心距垜敷 27 cm、向後傾 5 度（第 24 條）。
// 示意（沒有標準數字）：射場地板的大小（照俯視圖的比例）、矢道寬、安土的形狀與高度、的枠的厚度、
// 射手眼睛與放箭的高度、箭長、飛行速度與弧度；射場地板與垜敷畫成同高。
// 射手只用圓盤標出位置（不畫人），圓盤上的三角形指向脇正面（射手在射位面向脇正面，靶在左手邊）。
// mode "layout"：入門指南的射場圖，可選射位、射一箭、顯示尺寸線。
// mode "order"：禮法頁的 5 人立射順，圓盤依 props.marks 亮起，放箭的人有弦音的波紋。

import type * as T from "three";
import type { SceneCtx, SceneFactory, Label, Vec3 } from "../ThreeStage";
import { addLights, mat, polyline, tween } from "../kit";

/** 5 個射位的 x（由左到右，從射場往的看）；間隔 1.8 m */
export const LANE_X = [-3.6, -1.8, 0, 1.8, 3.6] as const;
const DIST = 28; // 射距離
const HONZA_Z = 2.0; // 本座在射位後方 2.0 m
const TARGET_Y = 0.27; // 靶心距垜敷 27 cm
const TILT = (5 * Math.PI) / 180; // 向後傾 5°
// 霞的 36 cm 的各圈（外 → 內，半徑 cm），同 home/Kasumi.tsx；外框半徑 18.6 cm 也照 Kasumi.tsx
const RINGS: [number, "black" | "white"][] = [
  [18, "black"],
  [14.7, "white"],
  [11.7, "black"],
  [10.2, "white"],
  [7.2, "black"],
  [3.6, "white"],
];
// 靶面的黑白是實物的顏色（和 Targets.tsx 一樣直接寫色碼，深色模式不反轉）
const FACE = { black: "#1f1b17", white: "#fbf8f2" } as const;

// 射場地板：照俯視圖（ShajoLayout）的比例換算，示意
const FLOOR = { x1: -5.31, x2: 4.51, z1: -1.98, z2: 3.78 };
const AZUCHI_Z = -DIST - 0.12; // 安土前緣（的立在安土前），示意

export type LaneMark = "s" | "r" | "k" | "y" | "d" | "-";

export interface DojoProps {
  mode: "layout" | "order";
  /** layout：選定的射位（LANE_X 的索引） */
  lane: number;
  /** layout：每按一次「射一箭」加 1 */
  shot: number;
  /** layout：顯示哪些尺寸線 */
  d28: boolean;
  d18: boolean;
  d20: boolean;
  /** order：每個射位的狀態，"|" 分隔（LANE_X 順序）：s 放箭、r 起身、k 取懸け、y 搭乙矢、d 已射、- 無 */
  marks?: string;
  /** order：每個射位圓盤下的說明文字，"|" 分隔 */
  acts?: string;
  /** order：每個射位的名稱，"|" 分隔 */
  names?: string;
  /** 點選圓盤時（layout） */
  onPick?: (lane: number) => void;
}

/** 霞的的 CanvasTexture：同心圓加木框邊（半徑 18.6 cm 的框，同 Kasumi.tsx） */
function kasumiTexture(ctx: SceneCtx) {
  const { THREE, colors } = ctx;
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const k = S / 2 / 18.6;
  g.fillStyle = `#${colors.wood.getHexString()}`;
  g.beginPath();
  g.arc(S / 2, S / 2, 18.6 * k, 0, Math.PI * 2);
  g.fill();
  for (const [r, col] of RINGS) {
    g.fillStyle = FACE[col];
    g.beginPath();
    g.arc(S / 2, S / 2, r * k, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** 平貼在地板上的細長條（線看起來比 1px 的 GL 線清楚） */
function strip(ctx: SceneCtx, x1: number, z1: number, x2: number, z2: number, w: number, color: T.Color, y = 0.004) {
  const { THREE } = ctx;
  const len = Math.hypot(x2 - x1, z2 - z1);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, w), new THREE.MeshBasicMaterial({ color }));
  m.rotation.x = -Math.PI / 2;
  m.rotation.z = -Math.atan2(z2 - z1, x2 - x1);
  m.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
  return m;
}

/** 尺寸線：主線＋兩端的短橫線，平貼地面 */
function dimension(ctx: SceneCtx, a: Vec3, b: Vec3, tickDir: [number, number], color: T.Color) {
  const g = new ctx.THREE.Group();
  const [ax, , az] = a;
  const [bx, , bz] = b;
  const t = 0.22;
  g.add(strip(ctx, ax, az, bx, bz, 0.05, color, 0.012));
  g.add(strip(ctx, ax - tickDir[0] * t, az - tickDir[1] * t, ax + tickDir[0] * t, az + tickDir[1] * t, 0.05, color, 0.013));
  g.add(strip(ctx, bx - tickDir[0] * t, bz - tickDir[1] * t, bx + tickDir[0] * t, bz + tickDir[1] * t, 0.05, color, 0.013));
  return g;
}

const make: SceneFactory<DojoProps> = (ctx, initial) => {
  const { THREE, scene, colors, camera, controls } = ctx;
  let props = initial;

  // 手機上 28 m 也要看得到靶：視角稍窄
  camera.fov = 35;
  camera.updateProjectionMatrix();
  controls.maxPolarAngle = Math.PI * 0.495;

  addLights(ctx, { key: [6, 12, 10] });

  /* ── 射場地板、射位線、本座線 ── */
  const fw = FLOOR.x2 - FLOOR.x1;
  const fd = FLOOR.z2 - FLOOR.z1;
  const floor = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.06, fd), mat(ctx, colors.surface));
  floor.position.set((FLOOR.x1 + FLOOR.x2) / 2, -0.03, (FLOOR.z1 + FLOOR.z2) / 2);
  scene.add(floor);
  // 地板邊緣
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(floor.geometry), new THREE.LineBasicMaterial({ color: colors.line }));
  edge.position.copy(floor.position);
  scene.add(edge);
  scene.add(strip(ctx, FLOOR.x1, 0, FLOOR.x2, 0, 0.05, colors.indigo)); // 射位線
  scene.add(strip(ctx, FLOOR.x1, HONZA_Z, FLOOR.x2, HONZA_Z, 0.05, colors.wood)); // 本座線

  /* ── 矢道 ── */
  const yamichi = new THREE.Mesh(new THREE.PlaneGeometry(fw, FLOOR.z1 - AZUCHI_Z), mat(ctx, colors.surface2));
  yamichi.rotation.x = -Math.PI / 2;
  yamichi.position.set((FLOOR.x1 + FLOOR.x2) / 2, -0.004, (FLOOR.z1 + AZUCHI_Z) / 2);
  scene.add(yamichi);

  /* ── 安土（形狀與高度示意） ── */
  const prof = new THREE.Shape();
  // 側面輪廓（u = 往後的距離，v = 高度）
  prof.moveTo(0, 0);
  prof.lineTo(1.5, 1.8);
  prof.lineTo(2.3, 1.8);
  prof.lineTo(2.3, 0);
  prof.closePath();
  const azW = fw + 0.36;
  const azGeo = new THREE.ExtrudeGeometry(prof, { depth: azW, bevelEnabled: false });
  const azuchi = new THREE.Mesh(azGeo, mat(ctx, colors.woodSoft));
  // shape 的 x → 世界 −z，y → 世界 y，extrude 的 z → 世界 x
  azuchi.rotation.y = Math.PI / 2;
  azuchi.position.set(FLOOR.x1 - 0.18, 0, AZUCHI_Z);
  scene.add(azuchi);

  /* ── 的（霞的 36 cm，靶心距垜敷 27 cm，向後傾 5°） ── */
  const tex = kasumiTexture(ctx);
  const faceMat = new THREE.MeshBasicMaterial({ map: tex });
  const faceGeo = new THREE.CircleGeometry(0.186, 48);
  const rimGeo = new THREE.CylinderGeometry(0.186, 0.186, 0.1, 32, 1, true);
  const rimMat = mat(ctx, colors.wood, { side: THREE.DoubleSide });
  LANE_X.forEach((x) => {
    const g = new THREE.Group();
    const face = new THREE.Mesh(faceGeo, faceMat);
    g.add(face);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.z = -0.05;
    g.add(rim);
    g.position.set(x, TARGET_Y, -DIST);
    g.rotation.x = -TILT; // 上緣往後（−z）倒
    scene.add(g);
  });
  // 射位 → 的 的射線（地上虛線）
  for (const x of LANE_X) {
    const l = polyline(ctx, [[x, 0.006, -0.4], [x, 0.006, -DIST + 0.4]], colors.muted, { dashed: true, opacity: 0.55 });
    const m = l.material as T.LineDashedMaterial;
    m.dashSize = 0.6;
    m.gapSize = 0.5;
    scene.add(l);
  }

  /* ── 射位的圓盤（不畫人） ── */
  const puckGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 32);
  const triGeo = new THREE.ConeGeometry(0.11, 0.22, 3);
  const hitGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.6, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const triMat = new THREE.MeshBasicMaterial({ color: colors.ink });
  const pucks: { mesh: T.Mesh; mat: T.MeshStandardMaterial; hit: T.Mesh; name: Label; act: Label }[] = [];
  LANE_X.forEach((x, i) => {
    const m = mat(ctx, colors.surface);
    const mesh = new THREE.Mesh(puckGeo, m);
    mesh.position.set(x, 0.04, 0);
    scene.add(mesh);
    // 三角形指向 +x（脇正面）
    const tri = new THREE.Mesh(triGeo, triMat);
    tri.rotation.z = -Math.PI / 2;
    tri.rotation.x = Math.PI / 2;
    tri.scale.set(1, 1, 0.25);
    tri.position.set(x + 0.12, 0.09, 0);
    scene.add(tri);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.position.set(x, 0.3, 0);
    hit.userData.lane = i;
    scene.add(hit);
    const name = ctx.label("", [x, i % 2 ? 0.55 : 0.8, 0], { small: true, tone: "ink", visible: false });
    const act = ctx.label("", [x, 0.05, 0.6], { tone: "indigo", visible: false });
    pucks.push({ mesh, mat: m, hit, name, act });
  });
  // 弦音的波紋
  const ripple = new THREE.Mesh(
    new THREE.RingGeometry(0.34, 0.4, 48),
    new THREE.MeshBasicMaterial({ color: colors.vermilion, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
  );
  ripple.rotation.x = -Math.PI / 2;
  ripple.position.y = 0.09;
  scene.add(ripple);

  /* ── 文字標籤 ── */
  ctx.label("安土", [0, 2.15, AZUCHI_Z - 1.5], { tone: "wood" });
  ctx.label("的（霞的 36 cm）", [LANE_X[2], 0.62, -DIST], { small: true });
  ctx.label("矢道", [0, 0.15, -12]);
  ctx.label("射位", [FLOOR.x2 + 0.6, 0.15, 0], { tone: "indigo" });
  ctx.label("本座", [FLOOR.x2 + 0.6, 0.15, HONZA_Z], { tone: "wood" });
  ctx.label("射場", [(FLOOR.x1 + FLOOR.x2) / 2, 0.05, FLOOR.z2 - 0.5], { small: true });

  /* ── 尺寸線（射距離 28 m、射位間隔 1.8 m、本座到射位 2.0 m） ── */
  const dim28 = dimension(ctx, [-4.45, 0, 0], [-4.45, 0, -DIST], [1, 0], colors.indigo);
  const dim18 = dimension(ctx, [LANE_X[3], 0, 0.75], [LANE_X[4], 0, 0.75], [0, 1], colors.indigo);
  const dim20 = dimension(ctx, [-5.0, 0, 0], [-5.0, 0, HONZA_Z], [1, 0], colors.indigo);
  scene.add(dim28, dim18, dim20);
  const l28 = ctx.label("28 m（射距離）", [-4.45, 0.35, -14], { tone: "indigo" });
  const l18 = ctx.label("1.8 m", [(LANE_X[3] + LANE_X[4]) / 2, 0.25, 0.75], { tone: "indigo" });
  const l20 = ctx.label("2.0 m", [-5.0, 0.3, HONZA_Z / 2], { tone: "indigo" });

  /* ── 箭（示意長度 1 m；箭頭在 group 原點，箭沿 +y） ── */
  const shaftGeo = new THREE.CylinderGeometry(0.01, 0.01, 1, 6);
  shaftGeo.translate(0, -0.5, 0);
  const tipGeo = new THREE.ConeGeometry(0.016, 0.05, 6);
  tipGeo.translate(0, -0.025, 0);
  const fletchGeo = new THREE.BoxGeometry(0.004, 0.14, 0.05);
  fletchGeo.translate(0, -0.9, 0);
  const shaftMat = mat(ctx, colors.wood);
  const tipMat = mat(ctx, colors.ink);
  const fletchMat = mat(ctx, colors.vermilion, { side: THREE.DoubleSide });
  const makeArrow = () => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(shaftGeo, shaftMat), new THREE.Mesh(tipGeo, tipMat));
    const f1 = new THREE.Mesh(fletchGeo, fletchMat);
    const f2 = new THREE.Mesh(fletchGeo, fletchMat);
    f2.rotation.y = Math.PI / 2;
    g.add(f1, f2);
    return g;
  };
  // 飛行軌跡
  const TRAIL_N = 48;
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRAIL_N * 3), 3));
  trailGeo.setDrawRange(0, 0);
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: colors.vermilion, transparent: true, opacity: 0.7 }));
  trail.frustumCulled = false;
  scene.add(trail);

  const stuck: T.Group[][] = LANE_X.map(() => []);
  let flying: { arrow: T.Group; cancel: () => void } | null = null;
  const up = new THREE.Vector3(0, 1, 0);
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();

  const shoot = (lane: number, n: number) => {
    if (flying) {
      // 上一支還在飛：直接拿掉
      flying.cancel();
      scene.remove(flying.arrow);
      flying = null;
    }
    const x = LANE_X[lane];
    // 放箭位置與高度：示意
    const p0 = new THREE.Vector3(x, 1.45, -0.25);
    // 中靶位置：在靶心附近隨 n 變化（示意）
    const a = n * 2.399;
    const rr = 0.03 + ((n * 37) % 9) / 100;
    const faceUp = new THREE.Vector3(0, Math.cos(TILT), -Math.sin(TILT));
    const p1 = new THREE.Vector3(x + Math.cos(a) * rr, TARGET_Y, -DIST).addScaledVector(faceUp, Math.sin(a) * rr);
    const H = 0.55; // 弧度：示意
    const at = (k: number, out: T.Vector3) => out.lerpVectors(p0, p1, k).setY(p0.y + (p1.y - p0.y) * k + H * 4 * k * (1 - k));
    const pos = trailGeo.getAttribute("position") as T.BufferAttribute;
    for (let i = 0; i < TRAIL_N; i++) {
      at(i / (TRAIL_N - 1), tmpA);
      pos.setXYZ(i, tmpA.x, tmpA.y, tmpA.z);
    }
    pos.needsUpdate = true;
    trailGeo.computeBoundingSphere();
    const arrow = makeArrow();
    scene.add(arrow);
    const place = (k: number) => {
      at(k, arrow.position);
      at(Math.max(0, k - 0.01), tmpA);
      at(Math.min(1, k + 0.01), tmpB);
      arrow.quaternion.setFromUnitVectors(up, tmpB.sub(tmpA).normalize());
      trailGeo.setDrawRange(0, Math.max(2, Math.round(k * (TRAIL_N - 1)) + 1));
    };
    place(0);
    const rec = { arrow, cancel: () => {} };
    flying = rec;
    rec.cancel = tween(
      ctx,
      950, // 飛行時間：示意（為了看得清楚，比實際慢）
      (k) => place(k),
      () => {
        // 插進靶裡一點點
        arrow.position.z -= 0.05;
        const list = stuck[lane];
        list.push(arrow);
        if (list.length > 2) scene.remove(list.shift()!);
        if (flying === rec) flying = null;
      },
    );
    ctx.invalidate();
  };

  /* ── 套用 props ── */
  let lastShot = initial.shot;
  let lastMarks = "";
  let rippleCancel = () => {};
  const apply = (p: DojoProps) => {
    const layout = p.mode === "layout";
    dim28.visible = layout && p.d28;
    dim18.visible = layout && p.d18;
    dim20.visible = layout && p.d20;
    l28.show(dim28.visible);
    l18.show(dim18.visible);
    l20.show(dim20.visible);
    trail.visible = layout;

    if (layout) {
      pucks.forEach((pk, i) => {
        pk.mat.color.copy(i === p.lane ? colors.vermilion : colors.surface);
        pk.name.show(false);
        pk.act.show(false);
      });
      if (p.shot !== lastShot) {
        lastShot = p.shot;
        shoot(p.lane, p.shot);
      }
    } else {
      const marks = (p.marks ?? "").split("|");
      const acts = (p.acts ?? "").split("|");
      const names = (p.names ?? "").split("|");
      pucks.forEach((pk, i) => {
        const m = (marks[i] || "-") as LaneMark;
        const col =
          m === "s" ? colors.vermilion : m === "r" || m === "k" ? colors.indigo : m === "y" ? colors.moss : m === "d" ? colors.line : colors.surface;
        pk.mat.color.copy(col);
        pk.name.set(names[i] ?? "");
        pk.name.show(!!names[i]);
        pk.act.set(acts[i] ?? "");
        pk.act.tone(m === "s" ? "vermilion" : m === "y" ? "moss" : m === "d" ? "muted" : "indigo");
        pk.act.show(!!acts[i]);
      });
      const key = p.marks ?? "";
      const si = marks.indexOf("s");
      if (key !== lastMarks) {
        lastMarks = key;
        rippleCancel();
        const rm = ripple.material as T.MeshBasicMaterial;
        if (si < 0) {
          rm.opacity = 0;
        } else {
          ripple.position.x = LANE_X[si];
          if (ctx.reducedMotion) {
            ripple.scale.setScalar(1.6);
            rm.opacity = 0.6;
          } else {
            // 弦音：波紋擴散兩次
            rippleCancel = tween(ctx, 1600, (k) => {
              const f = (k * 2) % 1;
              ripple.scale.setScalar(1 + f * 2.2);
              rm.opacity = k >= 1 ? 0 : 0.75 * (1 - f);
            });
          }
        }
      }
    }
    ctx.invalidate();
  };
  apply(initial);

  /* ── 點選圓盤 ── */
  const el = ctx.renderer.domElement;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down: { x: number; y: number } | null = null;
  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: PointerEvent) => {
    if (!down || props.mode !== "layout" || !props.onPick) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    if (moved > 6) return;
    const r = el.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pucks.map((p) => p.hit))[0];
    if (hit) props.onPick(hit.object.userData.lane as number);
  };
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointerup", onUp);

  return {
    update(p) {
      props = p;
      apply(p);
    },
    dispose() {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      flying?.cancel();
      rippleCancel();
      // 箭不一定還在場景裡，共用的幾何與材質在這裡釋放
      for (const o of [shaftGeo, tipGeo, fletchGeo, shaftMat, tipMat, fletchMat]) o.dispose();
    },
  };
};

export default make;
