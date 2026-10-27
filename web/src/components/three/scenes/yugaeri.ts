// 弓返り：從上方看握的地方，弓與弦在左手中的位置（會 → 離れ瞬間 → 弓返り後）。
// - 弓從握的上方切開（clipping plane），看得到弓的斷面、弦，以及代表握（手の内）的圓環——不畫手。
// - 來源只說「弦轉到左手手背那一側」（全弓連用語辭典），沒有寫轉的方向與角度，
//   所以轉動用淡出／淡入表示：轉動前的弓變成淡色，轉完的弓淡入；不畫轉的路徑。
// - 打ち切り（握緊、不讓它弓返り）：弓不轉，圓環變粗、變朱色。
// 世界座標：y 往上，-x 是往的的方向（俯視時在左邊），+x 是射手這一側；握的中心在原點。

import type * as T from "three";
import type { SceneCtx, SceneFactory } from "../ThreeStage";
import { addLights, ease, mat, polyline, tween } from "../kit";
import { BowCurve, GRIP_C, L, NOCK_LO, depth, mixWeights, only, rod, sleeve, width, type Sleeve, type Weights } from "../yumi-shape";

export interface YugaeriProps {
  /** 0 會, 1 離れ瞬間, 2 弓返り後 */
  step: number;
  /** yugaeri: 有弓返り; uchikiri: 打ち切り（握緊、不轉） */
  mode: "yugaeri" | "uchikiri";
}

const M = 0.01;
const S_CUT = 90; // 在矢摺籐的高度切開（搭箭處 82 cm 之上）

interface BowCopy {
  group: T.Group;
  update(c: BowCurve): void;
  opacity(a: number): void;
  /** world position of the string at grip height */
  stringAt(c: BowCurve, out: T.Vector3): T.Vector3;
}

function makeBow(ctx: SceneCtx, clip: T.Plane[], zg: number): BowCopy {
  const { THREE, colors } = ctx;
  const group = new THREE.Group();
  const frame = new THREE.Group();
  // bow-local +z (string → back) points toward the target (world -x); grip centre at the origin
  frame.rotation.y = -Math.PI / 2;
  frame.position.x = zg * M;
  group.add(frame);

  const mats: T.MeshStandardMaterial[] = [];
  const m = (c: T.Color, opts: Partial<T.MeshStandardMaterialParameters> = {}) => {
    const x = mat(ctx, c, { clippingPlanes: clip, ...opts });
    mats.push(x);
    return x;
  };
  const pieces: Sleeve[] = [];
  const add = (s: Sleeve) => {
    frame.add(s.mesh);
    pieces.push(s);
  };
  add(sleeve(ctx, 0, L, m(colors.wood), { step: 1.5 }));
  add(sleeve(ctx, 66, 81, m(colors.ink, { roughness: 0.95 }), { pad: 0.4 }));
  add(sleeve(ctx, 81, 93, m(colors.woodSoft), { pad: 0.15 }));
  add(sleeve(ctx, 5, 11, m(colors.woodSoft), { plate: true, step: 1 }));

  const strMat = m(colors.ink);
  const nakaMat = m(colors.ink.clone().lerp(colors.woodSoft, 0.35));
  const rods = [rod(ctx, 0.35, strMat), rod(ctx, 0.65, nakaMat), rod(ctx, 0.65, nakaMat), rod(ctx, 0.35, strMat)];
  for (const r of rods) frame.add(r.mesh);

  // 下面的弦輪（白）
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.22, 6, 18), m(colors.dark ? colors.ink : colors.surface));
  frame.add(ring);
  const zAxis = new THREE.Vector3(0, 0, 1);
  const tan = new THREE.Vector3();

  // 切開處的斷面（不受 clipping 影響）：外圈是矢摺籐，內側是弓身
  const capOuter = new THREE.Mesh(new THREE.CircleGeometry(1, 28), m(colors.woodSoft, { clippingPlanes: [], side: THREE.DoubleSide }));
  const capInner = new THREE.Mesh(new THREE.CircleGeometry(1, 28), m(colors.wood.clone().lerp(colors.woodSoft, 0.35), { clippingPlanes: [], side: THREE.DoubleSide }));
  for (const c of [capOuter, capInner]) {
    c.rotation.x = -Math.PI / 2;
    frame.add(c);
  }

  const update = (c: BowCurve) => {
    for (const p of pieces) p.update(c);
    const pts = c.string();
    rods.forEach((r, i) => r.set(pts[i], pts[i + 1]));
    const f = c.at(NOCK_LO);
    ring.position.set(0, f.y * M, f.z * M);
    tan.set(0, f.nz, -f.ny);
    ring.quaternion.setFromUnitVectors(zAxis, tan);
    ring.scale.set((width(NOCK_LO) / 2 + 0.45) * M, (depth(NOCK_LO) / 2 + 0.45) * M, M);
    const k = c.at(S_CUT);
    const hw = width(S_CUT) / 2;
    const hd = depth(S_CUT) / 2;
    capOuter.position.set(0, k.y * M + 0.0004, k.z * M);
    capOuter.scale.set((hw + 0.15) * M, (hd + 0.15) * M, 1);
    capInner.position.set(0, k.y * M + 0.0008, k.z * M);
    capInner.scale.set(hw * 0.86 * M, hd * 0.86 * M, 1);
  };

  const opacity = (a: number) => {
    group.visible = a > 0.01;
    for (const x of mats) {
      x.opacity = a;
      const tr = a < 0.999;
      if (x.transparent !== tr) {
        x.transparent = tr;
        x.depthWrite = !tr;
        x.needsUpdate = true;
      }
    }
  };

  const stringAt = (c: BowCurve, out: T.Vector3) => {
    const p = c.string();
    // the string at the grip's height (between 本弭 and the nocking point)
    const k = (0 - p[0][0]) / (p[2][0] - p[0][0]);
    out.set(0, 0, (p[0][1] + (p[2][1] - p[0][1]) * k) * M);
    group.updateMatrixWorld();
    return frame.localToWorld(out);
  };

  return { group, update, opacity, stringAt };
}

interface Target {
  w: Weights;
  /** opacity of the bow before / after turning */
  a: number;
  b: number;
  /** 0 = relaxed grip, 1 = 打ち切り */
  tight: number;
}

const targetFor = ({ step, mode }: YugaeriProps): Target => {
  if (step <= 0) return { w: only("drawn"), a: 1, b: 0, tight: mode === "uchikiri" ? 1 : 0 };
  if (step === 1) return { w: only("braced"), a: 1, b: 0, tight: mode === "uchikiri" ? 1 : 0 };
  return mode === "uchikiri" ? { w: only("braced"), a: 1, b: 0, tight: 1 } : { w: only("braced"), a: 0.18, b: 1, tight: 0 };
};

const make: SceneFactory<YugaeriProps> = (ctx, props) => {
  const { THREE, scene, colors, renderer } = ctx;
  renderer.localClippingEnabled = true;
  addLights(ctx, { key: [1.5, 4, 2] });

  const curve = new BowCurve(only("braced"));
  const zg = curve.at(GRIP_C).z;
  const yCut = curve.at(S_CUT).y * M;
  // keep y ≤ yCut
  const clip = [new THREE.Plane(new THREE.Vector3(0, -1, 0), yCut)];

  const before = makeBow(ctx, clip, zg);
  const after = makeBow(ctx, clip, zg);
  after.group.rotation.y = Math.PI; // 轉完：弦在往的那一側（手背側）。只畫終點，不畫路徑。
  scene.add(before.group, after.group);

  // 地板與方向
  const yFloor = curve.at(0).y * M - 0.03;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.1, 48), mat(ctx, colors.surface2));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0.25, yFloor, 0);
  scene.add(floor);
  const ay = yFloor + 0.002;
  scene.add(polyline(ctx, [[0.05, ay, 0.34], [-0.42, ay, 0.34]], colors.vermilion));
  scene.add(polyline(ctx, [[-0.38, ay, 0.31], [-0.42, ay, 0.34], [-0.38, ay, 0.37]], colors.vermilion));
  ctx.label("往的", [-0.47, ay, 0.34], { tone: "vermilion", small: true });
  ctx.label("射手這一側", [0.62, ay, 0.34], { small: true });

  // 握（手の内）：抽象的圓環，不是手的形狀
  const gripR = (Math.max(width(GRIP_C), depth(GRIP_C)) / 2 + 1.4) * M;
  const ringGeo = new THREE.TorusGeometry(gripR, 0.005, 10, 48);
  const ringMat = mat(ctx, colors.indigo);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  // 手背側（示意）：圓環靠往的那一側的一段弧
  const backArc = new THREE.Mesh(new THREE.TorusGeometry(gripR, 0.0075, 8, 24, Math.PI * 0.55), mat(ctx, colors.indigo.clone().lerp(colors.ink, 0.3)));
  backArc.rotation.set(Math.PI / 2, 0, Math.PI - Math.PI * 0.275);
  scene.add(backArc);
  ctx.label("握（手の内）", [0, 0, gripR + 0.05], { small: true, tone: "indigo" });
  ctx.label("手背側", [-(gripR + 0.05), 0, -0.02], { small: true, tone: "indigo" });
  const cutLbl = ctx.label("斷面", [0, yCut, 0], { small: true });
  const strLbl = ctx.label("弦", [0, 0, 0], { tone: "ink" });

  let cur: Target = targetFor(props);
  let lastTight = 0;
  const tmp = new THREE.Vector3();

  const apply = (t: Target) => {
    cur = t;
    curve.set(t.w);
    before.update(curve);
    after.update(curve);
    before.opacity(t.a);
    after.opacity(t.b);
    if (Math.abs(t.tight - lastTight) > 0.02 || (t.tight !== lastTight && (t.tight === 0 || t.tight === 1))) {
      lastTight = t.tight;
      ring.geometry.dispose();
      ring.geometry = new THREE.TorusGeometry(gripR - t.tight * 0.002, 0.005 + t.tight * 0.004, 10, 48);
    }
    ringMat.color.copy(colors.indigo).lerp(colors.vermilion, t.tight);
    // 斷面 label sits on the visible copy
    const k = curve.at(S_CUT);
    const z = (k.z - zg) * M;
    const showAfter = t.b > t.a;
    cutLbl.pos.set(showAfter ? z : -z, yCut + 0.01, -0.045);
    (showAfter ? after : before).stringAt(curve, tmp);
    strLbl.pos.copy(tmp).add(new THREE.Vector3(0, 0, -0.05));
    ctx.invalidate();
  };
  apply(cur);

  let cancel = () => {};
  return {
    update(p) {
      cancel();
      const from = cur;
      const to = targetFor(p);
      cancel = tween(ctx, 1000, (k) => {
        const e = ease(k);
        apply({
          w: mixWeights(from.w, to.w, e),
          a: from.a + (to.a - from.a) * e,
          b: from.b + (to.b - from.b) * e,
          tight: from.tight + (to.tight - from.tight) * e,
        });
      });
    },
    dispose() {
      cancel();
      renderer.localClippingEnabled = false;
    },
  };
};

export default make;
