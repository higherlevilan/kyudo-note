// 和弓立體圖：程序化的不對稱和弓（並寸 221 cm，握在從本弭算起約 1/3）。
// - 點部位：該段弓身蓋上朱色，並在旁邊標名稱。
// - 三種狀態（卸弦／張弦／拉開）之間用 kit.tween 平滑變形，弦跟著走；卸弦時弦淡出。
// 形狀資料見 ../yumi-shape.ts；弓的本地座標就是世界座標（y 往上，z 由弦指向弓背）。

import type * as T from "three";
import type { SceneFactory } from "../ThreeStage";
import { addLights, ease, mat, tween } from "../kit";
import { PARTS, type PartId } from "@/components/illustrations/gear/YumiParts";
import { BowCurve, GRIP_C, L, NOCK_HI, NOCK_LO, depth, mixWeights, only, rod, sleeve, width, type BowState, type Sleeve } from "../yumi-shape";

export interface YumiProps {
  state: BowState;
  part: PartId | null;
}

/** 弓身上的部位：s 範圍（cm，從本弭量起），同〈和弓各部位〉圖的標示範圍 */
const BOW_PARTS: Partial<Record<PartId, { a: number; b: number; plate?: boolean; pad?: number; at: number }>> = {
  urahazu: { a: 216, b: L, at: 219 },
  uwaseki: { a: 207, b: 215, plate: true, at: 211 },
  himezori: { a: 188, b: 205, at: 197 },
  toriuchi: { a: 177, b: 188, at: 182 },
  yazuri: { a: 81, b: 93, at: 88 },
  togashira: { a: 80.4, b: 81.6, pad: 1.1, at: 81 },
  nigiri: { a: 66, b: 81, at: GRIP_C },
  shimoseki: { a: 5, b: 11, plate: true, at: 8 },
  motohazu: { a: 0, b: 4, at: 1.5 },
};

const M = 0.01; // cm → m

const make: SceneFactory<YumiProps> = (ctx, props) => {
  const { THREE, scene, colors } = ctx;
  addLights(ctx, { key: [2.5, 4, -3] });

  const curve = new BowCurve(only(props.state));
  const pieces: Sleeve[] = [];
  const add = (s: Sleeve) => {
    scene.add(s.mesh);
    pieces.push(s);
    return s;
  };

  // 弓身（竹）、握革、矢摺籐（底＋一圈圈的籐）、上下関板
  add(sleeve(ctx, 0, L, mat(ctx, colors.wood), { step: 1.5 }));
  add(sleeve(ctx, 66, 81, mat(ctx, colors.ink, { roughness: 0.95 }), { pad: 0.4 }));
  add(sleeve(ctx, 81, 93, mat(ctx, colors.woodSoft), { pad: 0.15 }));
  const rattan = mat(ctx, colors.wood.clone().lerp(colors.ink, 0.25));
  for (let s = 82; s <= 92.5; s += 1.3) add(sleeve(ctx, s, s + 0.45, rattan, { pad: 0.35, step: 0.45 }));
  const plate = mat(ctx, colors.woodSoft);
  add(sleeve(ctx, 207, 215, plate, { plate: true, step: 1 }));
  add(sleeve(ctx, 5, 11, plate, { plate: true, step: 1 }));

  // 朱色的部位標示（選到才顯示）
  const hlMat = mat(ctx, colors.vermilion, { transparent: true, opacity: 0.62, depthWrite: false, emissive: colors.vermilion, emissiveIntensity: 0.25 });
  const overlays = new Map<PartId, Sleeve[]>();
  for (const [id, p] of Object.entries(BOW_PARTS) as [PartId, NonNullable<(typeof BOW_PARTS)[PartId]>][]) {
    overlays.set(id, [sleeve(ctx, p.a, p.b, hlMat, { pad: p.plate ? 0.25 : (p.pad ?? 0.55), step: 1, plate: p.plate })]);
  }
  overlays.set("tsuruwa", [sleeve(ctx, 216.2, 217.8, hlMat, { pad: 1.1, step: 0.4 }), sleeve(ctx, 2.2, 3.8, hlMat, { pad: 1.1, step: 0.4 })]);
  for (const list of overlays.values())
    for (const o of list) {
      o.mesh.visible = false;
      o.mesh.renderOrder = 2;
      scene.add(o.mesh);
    }

  // 弦：本弭→中仕掛け→搭箭處→中仕掛け→末弭（中仕掛け畫粗一點）
  const strMat = mat(ctx, colors.ink, { transparent: true });
  const nakaMat = mat(ctx, colors.ink.clone().lerp(colors.woodSoft, 0.35), { transparent: true });
  const rods = [rod(ctx, 0.35, strMat), rod(ctx, 0.65, nakaMat), rod(ctx, 0.65, nakaMat), rod(ctx, 0.35, strMat)];
  for (const r of rods) scene.add(r.mesh);

  // 弦輪：上紅、下白（用語辭典）
  const ringGeo = new THREE.TorusGeometry(1, 0.22, 6, 18);
  const ringUp = new THREE.Mesh(ringGeo, mat(ctx, colors.vermilion, { transparent: true }));
  const ringLo = new THREE.Mesh(ringGeo.clone(), mat(ctx, colors.dark ? colors.ink : colors.surface, { transparent: true }));
  scene.add(ringUp, ringLo);
  const zAxis = new THREE.Vector3(0, 0, 1);
  const tan = new THREE.Vector3();
  const placeRing = (m: T.Mesh, s: number) => {
    const f = curve.at(s);
    m.position.set(0, f.y * M, f.z * M);
    tan.set(0, f.nz, -f.ny);
    m.quaternion.setFromUnitVectors(zAxis, tan);
    m.scale.set((width(s) / 2 + 0.45) * M, (depth(s) / 2 + 0.45) * M, M);
  };

  // labels
  const backPoint = (s: number, out: number): [number, number, number] => {
    const f = curve.at(s);
    const h = depth(s) / 2 + out;
    return [0, (f.y + f.ny * h) * M, (f.z + f.nz * h) * M];
  };
  const tipUp = ctx.label("末弭（上）", backPoint(L, 6), { small: true });
  const tipLo = ctx.label("本弭（下）", backPoint(0, 6), { small: true });
  const gripLbl = ctx.label("握：從本弭約 1/3", backPoint(GRIP_C, 10), { small: true });
  const sel = ctx.label("", [0, 0, 0], { tone: "vermilion", visible: false });

  let part: PartId | null = null;
  let stringAlpha = 1;

  const placeLabels = () => {
    tipUp.pos.set(...backPoint(L, 6));
    tipLo.pos.set(...backPoint(0, 6));
    gripLbl.pos.set(...backPoint(GRIP_C, 10));
    tipUp.show(part !== "urahazu");
    tipLo.show(part !== "motohazu");
    gripLbl.show(part !== "nigiri");
    if (!part) return sel.show(false);
    const bp = BOW_PARTS[part];
    const pts = curve.string();
    if (bp) sel.pos.set(...backPoint(bp.at, 9));
    else if (part === "tsuru") sel.pos.set(0, ((pts[3][0] + pts[4][0]) / 2) * M, ((pts[3][1] + pts[4][1]) / 2 - 6) * M);
    else if (part === "naka") sel.pos.set(0, pts[2][0] * M, (pts[2][1] - 9) * M);
    else sel.pos.set(...backPoint(217, 8));
    // 卸弦時沒有弦：弦、中仕掛け、弦輪的標籤也藏起來
    sel.show(bp ? true : stringAlpha > 0.02);
  };

  const apply = () => {
    for (const p of pieces) p.update(curve);
    for (const list of overlays.values()) for (const o of list) if (o.mesh.visible) o.update(curve);
    const pts = curve.string();
    rods.forEach((r, i) => r.set(pts[i], pts[i + 1]));
    placeRing(ringUp, NOCK_HI);
    placeRing(ringLo, NOCK_LO);
    // 卸弦時弦淡出
    stringAlpha = 1 - curve.w.unstrung;
    for (const m of [strMat, nakaMat, ringUp.material as T.MeshStandardMaterial, ringLo.material as T.MeshStandardMaterial]) m.opacity = stringAlpha;
    for (const r of rods) r.mesh.visible = stringAlpha > 0.02;
    ringUp.visible = ringLo.visible = stringAlpha > 0.02;
    placeLabels();
  };

  const pick = (id: PartId | null) => {
    part = id;
    for (const [k, list] of overlays) for (const o of list) o.mesh.visible = k === id && (k !== "tsuruwa" || stringAlpha > 0.02);
    strMat.color.copy(id === "tsuru" ? colors.vermilion : colors.ink);
    nakaMat.color.copy(id === "naka" ? colors.vermilion : colors.ink.clone().lerp(colors.woodSoft, 0.35));
    if (id) {
      const name = id === "tsuruwa" ? "弦輪（上紅・下白）" : (PARTS.find((x) => x.id === id)?.name ?? "");
      sel.set(name);
    }
    apply();
    ctx.invalidate();
  };

  pick(props.part);

  let state = props.state;
  let cancel = () => {};
  const morph = (to: BowState) => {
    cancel();
    const w0 = curve.w;
    const w1 = only(to);
    cancel = tween(ctx, 1100, (k) => {
      curve.set(mixWeights(w0, w1, ease(k)));
      apply();
      // the 弦輪 overlay follows the string's visibility
      if (part === "tsuruwa") for (const o of overlays.get("tsuruwa") ?? []) o.mesh.visible = stringAlpha > 0.02;
    });
  };

  return {
    update(p) {
      if (p.part !== part) pick(p.part);
      if (p.state !== state) {
        state = p.state;
        morph(state);
      }
    },
    dispose() {
      cancel();
    },
  };
};

export default make;
