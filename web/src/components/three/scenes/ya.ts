// 矢的立體示意：箭桿、筈、筈巻、末矧、三片羽、本矧、板付，並標出走り羽的「表」。
// 長度方向沿用 YaParts.tsx 的示意比例（全長 100 cm、羽丈 14 cm，各部位位置相同）；
// 箭桿粗細與羽的高度放大，不按比例。
// 座標：箭軸沿 z，筈在 +z、箭頭在 −z；從筈端往箭頭方向看時右邊是 +x、上面是 +y，
// 弓在箭的左邊（−x）——和 HayaOtoya 的斷面圖同一個視角。
// 甲矢・乙矢：用語辭典「羽根の表が外向き／内側」——走り羽的表朝外（遠離弓，+x）或朝內（靠弓，−x）。
// 其他兩片羽的表、羽的彎曲，網站資料沒有寫，這裡不畫。
// 「飛行旋轉」只示意箭繞軸轉動；轉向固定，不代表甲矢或乙矢的實際方向。

import type * as T from "three";
import type { Label, SceneFactory } from "../ThreeStage";
import { addLights, mat, polyline, tween } from "../kit";

export type YaPart = "itatsuki" | "no" | "motohagi" | "hashiriba" | "togakeba" | "yuzuriba" | "urahagi" | "hazumaki" | "hazu";

export interface YaProps {
  kind: "haya" | "otoya";
  part: YaPart | null;
  spinning: boolean;
}

const CM = 0.01;
/** z of a point given in cm from the nock end (nock at +0.5 m, head at −0.5 m) */
const zc = (cmFromNock: number) => 0.5 - cmFromNock * CM;

// positions in cm from the nock end — same as YaParts.tsx
const HAZU = [0, 2] as const;
const HAZUMAKI = [2, 3.6] as const;
const URAHAGI = [5.6, 7] as const;
const HANE = [6.4, 20.4] as const;
const MOTOHAGI = [20, 23] as const;
const HEAD = [96.5, 100] as const;

const R = 0.009; // shaft radius (exaggerated)
const VANE_H = 0.03; // feather height (exaggerated)
const VANE_T = 0.0016; // feather thickness
const VANE_L = (HANE[1] - HANE[0]) * CM;

/** the three feathers: angle in the end-on view from the nock (0° = right/+x, 90° = up) */
const VANES: { id: YaPart; name: string; deg: number; at: number }[] = [
  { id: "hashiriba", name: "走り羽", deg: 90, at: 0.55 },
  // labels of the two lower feathers sit at different points along the feather so they don't overlap in the side view
  { id: "togakeba", name: "外掛羽", deg: -30, at: 0.95 },
  { id: "yuzuriba", name: "弓摺羽", deg: -150, at: 0.05 },
];

const PART_NAME: Record<YaPart, string> = {
  itatsuki: "板付（矢尻）",
  no: "箆（箭桿）",
  motohagi: "本矧",
  hashiriba: "走り羽",
  togakeba: "外掛羽",
  yuzuriba: "弓摺羽",
  urahagi: "末矧",
  hazumaki: "筈巻",
  hazu: "筈",
};

const make: SceneFactory<YaProps> = (ctx, props) => {
  const { THREE, scene, colors } = ctx;
  addLights(ctx, { key: [2, 3, 4] });

  const arrow = new THREE.Group(); // spins about z
  scene.add(arrow);

  const parts = new Map<YaPart, { meshes: T.Mesh[]; base: T.Color; at: T.Vector3 }>();
  const addPart = (id: YaPart, mesh: T.Mesh, base: T.Color, at: [number, number, number]) => {
    const p = parts.get(id) ?? { meshes: [], base, at: new THREE.Vector3(...at) };
    p.meshes.push(mesh);
    parts.set(id, p);
  };
  /** cylinder along z between two cm marks */
  const tube = (from: number, to: number, r: number, color: T.Color, opts: Partial<T.MeshStandardMaterialParameters> = {}) => {
    const len = (to - from) * CM;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 20, 1), mat(ctx, color, opts));
    m.rotation.x = Math.PI / 2;
    m.position.z = zc((from + to) / 2);
    arrow.add(m);
    return m;
  };

  // 箆
  const shaft = tube(HAZU[1], HEAD[0], R, colors.wood);
  addPart("no", shaft, colors.wood, [0, R + 0.03, zc(55)]);

  // 板付（圓錐形示意；規則允許平題形、椎実形或圓錐形）
  const headMesh = new THREE.Mesh(new THREE.ConeGeometry(R * 1.25, (HEAD[1] - HEAD[0]) * CM, 20), mat(ctx, colors.ink, { roughness: 0.5 }));
  headMesh.rotation.x = -Math.PI / 2; // tip toward −z
  headMesh.position.z = zc((HEAD[0] + HEAD[1]) / 2);
  arrow.add(headMesh);
  addPart("itatsuki", headMesh, colors.ink, [0, R + 0.03, zc(98)]);

  // bindings: 本矧・末矧・筈巻
  const bind = (id: YaPart, [a, b]: readonly [number, number]) => {
    const m = tube(a, b, R * 1.14, colors.ink, { roughness: 0.7 });
    addPart(id, m, colors.ink, [0, R + 0.03, zc((a + b) / 2)]);
  };
  bind("motohagi", MOTOHAGI);
  bind("urahagi", URAHAGI);
  bind("hazumaki", HAZUMAKI);

  // 筈: body plus two prongs; the 筈溝 between them is vertical (the string sits in it)
  const hazuBody = tube(0.6, HAZU[1], R * 1.1, colors.ink, { roughness: 0.5 });
  addPart("hazu", hazuBody, colors.ink, [0, R + 0.03, zc(1)]);
  const gap = R * 0.5;
  for (const s of [-1, 1]) {
    const w = R * 1.1 - gap / 2;
    const prong = new THREE.Mesh(new THREE.BoxGeometry(w, R * 2.2, 0.6 * CM), mat(ctx, colors.ink, { roughness: 0.5 }));
    prong.position.set(s * (gap / 2 + w / 2), 0, zc(0.3));
    arrow.add(prong);
    addPart("hazu", prong, colors.ink, [0, 0, 0]);
  }

  // feather outline (same curve as YaParts): x along the arrow from the front end (toward the nock), y = height
  const shape = new THREE.Shape();
  const r = 0.004;
  shape.moveTo(0, 0);
  shape.bezierCurveTo(VANE_L * 0.25, VANE_H * 0.55, VANE_L * 0.55, VANE_H, VANE_L * 0.8, VANE_H);
  shape.lineTo(VANE_L - r, VANE_H);
  shape.quadraticCurveTo(VANE_L, VANE_H, VANE_L, VANE_H - r);
  shape.lineTo(VANE_L, 0);
  shape.closePath();
  const vaneGeo = new THREE.ExtrudeGeometry(shape, { depth: VANE_T, bevelEnabled: false, curveSegments: 14 });
  vaneGeo.translate(0, 0, -VANE_T / 2);
  const edgeGeo = new THREE.EdgesGeometry(vaneGeo, 40);
  const zFront = zc(HANE[1]);

  const tips: { anchor: T.Object3D; label: Label }[] = [];
  let omote: T.Mesh | null = null;
  let omoteLabel: Label | null = null;
  const omoteAnchor = new THREE.Object3D();

  for (const v of VANES) {
    const pivot = new THREE.Group();
    pivot.rotation.z = ((v.deg - 90) * Math.PI) / 180; // local +y → radial direction of this feather
    arrow.add(pivot);
    const vane = new THREE.Mesh(vaneGeo, mat(ctx, colors.surface, { side: THREE.DoubleSide, roughness: 0.95 }));
    vane.rotation.y = -Math.PI / 2; // shape x → +z, thickness along x
    vane.position.set(0, R, zFront);
    pivot.add(vane);
    const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: colors.ink, transparent: true, opacity: 0.7 }));
    edges.rotation.copy(vane.rotation);
    edges.position.copy(vane.position);
    pivot.add(edges);
    addPart(v.id, vane, colors.surface, [0, 0, 0]);

    const anchor = new THREE.Object3D();
    anchor.position.set(0, R + VANE_H + 0.012, zFront + VANE_L * v.at);
    pivot.add(anchor);
    tips.push({ anchor, label: ctx.label(v.name, [0, 0, 0], { small: true, tone: "ink" }) });

    if (v.id === "hashiriba") {
      // 表 of the 走り羽: a vermilion skin on one face (+x = away from the bow = 外)
      omote = new THREE.Mesh(
        new THREE.ShapeGeometry(shape, 14),
        new THREE.MeshBasicMaterial({ color: colors.vermilion, side: THREE.DoubleSide, transparent: true, opacity: 0.85, polygonOffset: true, polygonOffsetFactor: -1 }),
      );
      omote.rotation.y = -Math.PI / 2;
      omote.position.set(0, R, zFront);
      omote.scale.set(0.96, 0.9, 1);
      pivot.add(omote);
      omoteAnchor.position.set(0, R + VANE_H * 0.45, zFront + VANE_L * 0.7);
      pivot.add(omoteAnchor);
      omoteLabel = ctx.label("表", [0, 0, 0], { tone: "vermilion" });
    }
  }

  // the bow, end-on, to the left of the arrow (only to show which side is 外 / 內)
  const bow = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.17, 0.024), mat(ctx, colors.woodSoft));
  bow.position.set(-0.042, 0, zc(30));
  scene.add(bow);
  const bowEdges = new THREE.LineSegments(new THREE.EdgesGeometry(bow.geometry), new THREE.LineBasicMaterial({ color: colors.wood }));
  bowEdges.position.copy(bow.position);
  scene.add(bowEdges);
  const bowLabel = ctx.label("弓（示意位置）", [-0.042, 0.1, zc(30)], { small: true });

  // the arrow's axis, shown while spinning
  const axis = polyline(ctx, [[0, 0, -0.62], [0, 0, 0.66]], colors.muted, { dashed: true, opacity: 0.8 });
  (axis.material as T.LineDashedMaterial).dashSize = 0.02;
  (axis.material as T.LineDashedMaterial).gapSize = 0.014;
  axis.visible = false;
  scene.add(axis);

  const partLabel = ctx.label("", [0, 0, 0], { tone: "indigo", visible: false });
  const endLabels = [ctx.label("箭頭端", [0, -0.05, -0.45], { small: true }), ctx.label("筈端", [0, -0.05, 0.5], { small: true })];
  // looking along the arrow, the two end labels would sit on top of the shaft: hide them then
  const dirTmp = new THREE.Vector3();
  const onCam = () => {
    const along = Math.abs(dirTmp.copy(ctx.camera.position).sub(ctx.controls.target).normalize().z) > 0.85;
    for (const l of endLabels) l.show(!along);
  };
  ctx.controls.addEventListener("change", onCam);
  onCam();

  // ---- placing labels that ride on the spinning arrow
  const placeTips = () => {
    arrow.updateMatrixWorld(true);
    for (const t of tips) t.anchor.getWorldPosition(t.label.pos);
    if (omoteLabel) {
      omoteAnchor.getWorldPosition(omoteLabel.pos);
      // nudge the 表 label off the feather, toward the side the 表 faces
      const side = omote ? Math.sign(omote.position.x) || 1 : 1;
      const right = new THREE.Vector3(side * 0.03, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), arrow.rotation.z);
      omoteLabel.pos.add(right);
    }
  };

  // ---- 甲矢 / 乙矢: the 表 skin moves to the other face
  const OFF = VANE_T / 2 + 0.0004;
  let side = props.kind === "haya" ? 1 : -1;
  if (omote) omote.position.x = side * OFF;
  let cancelFlip = () => {};
  const setKind = (kind: YaProps["kind"]) => {
    const target = kind === "haya" ? 1 : -1;
    if (target === side || !omote) return;
    const from = omote.position.x;
    side = target;
    cancelFlip();
    cancelFlip = tween(ctx, 600, (k) => {
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      omote!.position.x = from + (target * OFF - from) * e;
      placeTips();
    });
  };

  // ---- part highlight
  const setPart = (part: YaPart | null) => {
    for (const [id, p] of parts) {
      for (const m of p.meshes) (m.material as T.MeshStandardMaterial).color.copy(id === part ? colors.indigo : p.base);
    }
    if (part && !VANES.some((v) => v.id === part)) {
      const p = parts.get(part)!;
      partLabel.pos.copy(p.at);
      partLabel.set(PART_NAME[part]);
      partLabel.show(true);
    } else partLabel.show(false);
    for (let i = 0; i < VANES.length; i++) tips[i].label.tone(VANES[i].id === part ? "indigo" : "ink");
  };

  // ---- spin about the arrow's own axis (direction fixed, only a visual aid)
  let stopSpin: (() => void) | null = null;
  let cancelSettle = () => {};
  const showStatic = (on: boolean) => {
    bow.visible = on;
    bowEdges.visible = on;
    bowLabel.show(on);
    axis.visible = !on;
  };
  const setSpin = (on: boolean) => {
    if (on && !stopSpin) {
      cancelSettle();
      showStatic(false);
      partLabel.show(false);
      const speed = Math.PI * 2 * (ctx.reducedMotion ? 0.15 : 0.6); // rad/s
      stopSpin = ctx.loop((dt) => {
        arrow.rotation.z = (arrow.rotation.z + dt * speed) % (Math.PI * 2);
        placeTips();
      });
    } else if (!on && stopSpin) {
      stopSpin();
      stopSpin = null;
      // come back to the nocked orientation (走り羽 up) so 外 / 內 reads again
      const from = arrow.rotation.z;
      const to = from > Math.PI ? Math.PI * 2 : 0;
      cancelSettle = tween(
        ctx,
        500,
        (k) => {
          arrow.rotation.z = from + (to - from) * (1 - (1 - k) ** 3);
          placeTips();
        },
        () => {
          arrow.rotation.z = 0;
          placeTips();
          showStatic(true);
          setPart(cur.part);
        },
      );
    }
  };

  let cur = props;
  placeTips();
  setPart(props.part);
  showStatic(true);
  setSpin(props.spinning);

  return {
    update(p) {
      if (p.kind !== cur.kind) setKind(p.kind);
      const prev = cur;
      cur = p;
      if (p.part !== prev.part) {
        setPart(p.part);
        if (stopSpin) partLabel.show(false);
      }
      if (p.spinning !== prev.spinning) setSpin(p.spinning);
      ctx.invalidate();
    },
    dispose() {
      stopSpin?.();
      cancelFlip();
      cancelSettle();
      ctx.controls.removeEventListener("change", onCam);
    },
  };
};

export default make;
