// three.js scene for the 射法八節 viewer: grid-lined mannequin, bow (yumi) and arrow.
// Ported from tools/pose/viewer/index.html. Input points are already in three.js
// convention, so no axis flip / up-rotation is applied here; only the floor shift.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { BowState, Vec3 } from "./motion";

const FLOOR_Y = -1.0;
/** Ring spacing of the mannequin's grid lines (metres). */
const GRID_STEP = 0.07;
// 並寸 yumi 2.21 m with the grip ~1/3 from the bottom; arrow ≈ 矢束 + margin.
const BOW_UPPER = 1.47;
const BOW_LOWER = 0.74;
const BRACE = 0.15;
const ARROW_LEN = 0.95;

const Y_UP = new THREE.Vector3(0, 1, 0);
const TARGET = new THREE.Vector3(1, 0, 0);
const V = () => new THREE.Vector3();

type Ring = { c: THREE.Vector3; x: THREE.Vector3; z: THREE.Vector3 };
type RingFn = (s: number) => Ring;

/** Light-grey skin with blue lines: 4 lines around each segment, rings every GRID_STEP. */
function makeGridCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const g = canvas.getContext("2d");
  if (g) {
    g.fillStyle = "#e4e6ea";
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#2f45d6";
    for (let i = 0; i < 4; i++) g.fillRect(i * 64, 0, 5, 256);
    g.fillRect(0, 0, 256, 5);
  }
  return canvas;
}

/** Lofted tube whose rings are recomputed every frame (torso, limbs, neck). */
class Tube {
  readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  private readonly pos: Float32Array;

  constructor(
    private readonly rings: number,
    private readonly sides: number,
    material: THREE.MeshStandardMaterial,
  ) {
    const geo = new THREE.BufferGeometry();
    this.pos = new Float32Array((rings + 1) * (sides + 1) * 3);
    const uv = new Float32Array((rings + 1) * (sides + 1) * 2);
    const idx: number[] = [];
    for (let r = 0; r <= rings; r++)
      for (let s = 0; s <= sides; s++) {
        const k = r * (sides + 1) + s;
        uv[k * 2] = s / sides;
        uv[k * 2 + 1] = r / rings;
        if (r < rings && s < sides) {
          const a = k;
          const b = k + sides + 1;
          idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geo.setIndex(idx);
    this.mesh = new THREE.Mesh(geo, material);
    this.mesh.castShadow = true;
  }

  update(ringFn: RingFn, length: number) {
    const { rings, sides, pos } = this;
    for (let r = 0; r <= rings; r++) {
      const { c, x, z } = ringFn(r / rings);
      for (let s = 0; s <= sides; s++) {
        const a = (s / sides) * Math.PI * 2;
        const k = (r * (sides + 1) + s) * 3;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        pos[k] = c.x + x.x * ca + z.x * sa;
        pos[k + 1] = c.y + x.y * ca + z.y * sa;
        pos[k + 2] = c.z + x.z * ca + z.z * sa;
      }
    }
    const geo = this.mesh.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    const map = this.mesh.material.map;
    if (map) map.repeat.y = Math.max(1, length / GRID_STEP);
  }
}

/** Limb = tube between two joints with tapering radius and rounded ends. */
function limbRing(a: THREE.Vector3, b: THREE.Vector3, r0: number, r1: number): [RingFn, number] {
  const axis = V().subVectors(b, a);
  const len = axis.length();
  axis.normalize();
  const ref = Math.abs(axis.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = V().crossVectors(axis, ref).normalize();
  const w = V().crossVectors(axis, u).normalize();
  const cap = 0.18; // fraction of the tube used for each rounded end
  const ab = V().subVectors(b, a);
  return [
    (s) => {
      const t = s < cap ? -r0 * Math.cos(((s / cap) * Math.PI) / 2) : s > 1 - cap ? r1 * Math.cos((((1 - s) / cap) * Math.PI) / 2) : 0;
      const along = s < cap ? 0 : s > 1 - cap ? 1 : (s - cap) / (1 - 2 * cap);
      const base =
        s < cap
          ? r0 * Math.sin(((s / cap) * Math.PI) / 2)
          : s > 1 - cap
            ? r1 * Math.sin((((1 - s) / cap) * Math.PI) / 2)
            : r0 + (r1 - r0) * along;
      const c = V().copy(a).addScaledVector(ab, along).addScaledVector(axis, t);
      return { c, x: u.clone().multiplyScalar(base), z: w.clone().multiplyScalar(base) };
    },
    len,
  ];
}

// [from, to, radius at from, radius at to]
const LIMBS: [number, number, number, number][] = [
  [11, 13, 0.05, 0.042], [13, 15, 0.04, 0.032], [12, 14, 0.05, 0.042], [14, 16, 0.04, 0.032],
  [23, 25, 0.08, 0.06], [25, 27, 0.055, 0.04], [24, 26, 0.08, 0.06], [26, 28, 0.055, 0.04],
  [29, 31, 0.035, 0.03], [30, 32, 0.035, 0.03],
];
// Spheres that fill the gaps where limb tubes meet.
const JOINT_BALLS: [number, number][] = [
  [11, 0.056], [12, 0.056], [13, 0.046], [14, 0.046], [15, 0.036], [16, 0.036],
  [23, 0.078], [24, 0.078], [25, 0.062], [26, 0.062], [27, 0.046], [28, 0.046],
];

export class ShahoScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  private readonly controls: OrbitControls;
  private readonly gridCanvas = makeGridCanvas();

  private readonly limbs: Tube[];
  private readonly torso: Tube;
  private readonly neck: Tube;
  private readonly jointBalls: THREE.Mesh[];
  private readonly neckBall: THREE.Mesh;
  private readonly head: THREE.Mesh;
  private readonly hands: THREE.Mesh[];

  private readonly bowMesh: THREE.Mesh;
  private readonly gripMesh: THREE.Mesh;
  private readonly stringMesh: THREE.Mesh;
  private readonly arrow = new THREE.Group();

  constructor(private readonly canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer = renderer;

    const { scene, camera } = this;
    // Far enough back to fit the 2.2 m bow above the archer's head.
    camera.position.set(0, 0.45, 5.6);
    this.controls = new OrbitControls(camera, canvas);
    this.controls.target.set(0, 0.25, 0);
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    // Wheel / pinch zoom only while the viewer is being used, so the page still scrolls.
    this.controls.enableZoom = false;
    canvas.addEventListener("pointerdown", this.enableZoom);
    canvas.addEventListener("pointerleave", this.disableZoom);
    this.controls.update();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f99, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(1.5, 4, 3);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2 });
    scene.add(sun);

    const grid = new THREE.GridHelper(4, 16, 0x9aa0aa, 0xc4c8cf);
    grid.position.y = FLOOR_Y;
    scene.add(grid);
    const shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.ShadowMaterial({ opacity: 0.25 }));
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.y = FLOOR_Y + 0.001;
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);

    // Target direction marker (archer faces camera, target is on her left = +x).
    scene.add(new THREE.ArrowHelper(TARGET.clone(), new THREE.Vector3(0, FLOOR_Y + 0.02, 0), 1.6, 0xd9a441, 0.12, 0.06));

    // --- mannequin ---
    const addTube = (rings: number, sides: number, around = 1) => {
      const t = new Tube(rings, sides, this.gridMaterial(1, around));
      scene.add(t.mesh);
      return t;
    };
    this.limbs = LIMBS.map(() => addTube(10, 16));
    this.torso = addTube(20, 32, 2);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0x9fb0d8, roughness: 0.45, metalness: 0.05 });
    this.neckBall = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 14), ballMat);
    this.neckBall.castShadow = true;
    scene.add(this.neckBall);
    this.jointBalls = JOINT_BALLS.map(([, r]) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), ballMat);
      m.castShadow = true;
      scene.add(m);
      return m;
    });
    this.neck = addTube(8, 12);
    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), this.gridMaterial(3));
    this.head.scale.set(0.95, 1.2, 1.05);
    this.head.castShadow = true;
    scene.add(this.head);
    this.hands = [15, 16].map(() => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), this.gridMaterial(1));
      m.scale.set(1, 1.4, 0.6);
      m.castShadow = true;
      scene.add(m);
      return m;
    });

    // --- bow and arrow ---
    const bowMat = new THREE.MeshStandardMaterial({ color: 0xc89a52, roughness: 0.55 });
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.8 });
    const stringMat = new THREE.MeshStandardMaterial({ color: 0x3a3226, roughness: 0.9 });
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x8a8f96, metalness: 0.4, roughness: 0.4 });
    const featherMat = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, side: THREE.DoubleSide, roughness: 0.9 });
    this.bowMesh = new THREE.Mesh(new THREE.BufferGeometry(), bowMat);
    this.bowMesh.castShadow = true;
    scene.add(this.bowMesh);
    this.gripMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.13, 12), gripMat);
    scene.add(this.gripMesh);
    this.stringMesh = new THREE.Mesh(new THREE.BufferGeometry(), stringMat);
    scene.add(this.stringMesh);
    scene.add(this.arrow);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, ARROW_LEN, 8), shaftMat);
    shaft.position.y = ARROW_LEN / 2;
    this.arrow.add(shaft);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.007, 0.03, 8), shaftMat);
    tip.position.y = ARROW_LEN + 0.015;
    this.arrow.add(tip);
    for (let i = 0; i < 3; i++) {
      const vaneGeo = new THREE.PlaneGeometry(0.018, 0.13);
      vaneGeo.translate(0.011, 0, 0);
      const vane = new THREE.Mesh(vaneGeo, featherMat);
      vane.position.set(0, 0.11, 0);
      vane.rotation.y = (i * Math.PI * 2) / 3;
      this.arrow.add(vane);
    }
  }

  private readonly enableZoom = () => {
    this.controls.enableZoom = true;
  };
  private readonly disableZoom = () => {
    this.controls.enableZoom = false;
  };

  private gridMaterial(lengthRepeat: number, around = 1) {
    const tex = new THREE.CanvasTexture(this.gridCanvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.repeat.set(around, lengthRepeat);
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75 });
  }

  /** Pose the figure (33 landmarks, three.js coords) and the bow for the given state. */
  setPose(w: Vec3[], state: BowState) {
    // Drop the figure so the lower of the two heels rests on the floor.
    const floor = Math.min(w[29][1], w[30][1]);
    const dy = FLOOR_Y - floor + 0.03;
    const P = w.map((p) => new THREE.Vector3(p[0], p[1] + dy, p[2]));
    this.drawBow(P, state);

    LIMBS.forEach(([a, b, r0, r1], i) => this.limbs[i].update(...limbRing(P[a], P[b], r0, r1)));
    JOINT_BALLS.forEach(([j], i) => this.jointBalls[i].position.copy(P[j]));

    // Torso: loft from hip line up to shoulder line, narrowing at the waist.
    const hipC = V().addVectors(P[23], P[24]).multiplyScalar(0.5);
    const shC = V().addVectors(P[11], P[12]).multiplyScalar(0.5);
    const hipX = V().subVectors(P[23], P[24]).multiplyScalar(0.5);
    const shX = V().subVectors(P[11], P[12]).multiplyScalar(0.5);
    const spine = V().subVectors(shC, hipC);
    const fwd = V().crossVectors(V().addVectors(hipX, shX), spine).normalize();
    this.torso.update((s) => {
      const c = V().copy(hipC).addScaledVector(spine, -0.12 + s * 1.17);
      // Waist narrows between pelvis and chest; both ends close with a rounded cap.
      let width = 1.25 - 0.3 * Math.sin(Math.min(1, s / 0.75) * Math.PI);
      let depth = 0.1 + 0.025 * Math.sin(s * Math.PI);
      const bottomCap = s < 0.12 ? Math.sin(((s / 0.12) * Math.PI) / 2) : 1;
      const topCap = s > 0.86 ? 0.45 + 0.55 * Math.cos((((s - 0.86) / 0.14) * Math.PI) / 2) : 1;
      width *= Math.max(0.35, bottomCap) * topCap;
      depth *= bottomCap * (s > 0.86 ? topCap : 1);
      const x = V().lerpVectors(hipX, shX, s).multiplyScalar(width);
      return { c, x, z: fwd.clone().multiplyScalar(depth) };
    }, spine.length());

    // Head: centred between the ears, neck from shoulder midpoint.
    const headC = V().addVectors(P[7], P[8]).multiplyScalar(0.5);
    const headUp = V().subVectors(headC, shC).normalize();
    this.head.position.copy(headC).addScaledVector(headUp, 0.03);
    const earAxis = V().subVectors(P[7], P[8]).normalize();
    const faceDir = V().subVectors(P[0], headC).normalize();
    const front = V().crossVectors(earAxis, headUp);
    front.multiplyScalar(Math.sign(faceDir.dot(front)) || 1);
    this.head.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(earAxis, headUp, front));
    this.neck.update(...limbRing(shC, V().copy(headC).addScaledVector(headUp, -0.06), 0.045, 0.04));
    this.neckBall.position.copy(shC).addScaledVector(headUp, 0.02);

    // Hands: oriented from wrist toward the index/pinky knuckles.
    ([[15, 17, 19], [16, 18, 20]] as const).forEach(([wr, pk, ix], i) => {
      const tipP = V().addVectors(P[pk], P[ix]).multiplyScalar(0.5);
      const dir = V().subVectors(tipP, P[wr]).normalize();
      this.hands[i].position.copy(P[wr]).addScaledVector(dir, 0.05);
      this.hands[i].quaternion.setFromUnitVectors(Y_UP, dir);
    });
  }

  private drawBow(P: THREE.Vector3[], state: BowState) {
    const grip = V().addVectors(P[15], P[17]).add(P[19]).multiplyScalar(1 / 3); // left hand centre
    const nock = V().addVectors(P[16], P[22]).multiplyScalar(0.5); // right thumb / 取懸け
    const pull = V().subVectors(grip, nock); // nock → grip
    const nocked = state === "drawn";
    // 執弓の姿勢: the grip stays at the left hip and the bow slants forward and down so
    // the 末弭 (upper tip) is in front of the body centre, about 10 cm above the floor.
    const hipC = V().addVectors(P[23], P[24]).multiplyScalar(0.5);
    const apex = new THREE.Vector3(hipC.x, FLOOR_Y + 0.1, grip.z);
    const reach = Math.sqrt(Math.max(BOW_UPPER ** 2 - (apex.x - grip.x) ** 2 - (apex.y - grip.y) ** 2, 0));
    apex.z += reach;
    // Arrow direction while nocked; otherwise the bow's back faces the target.
    let fwd = nocked && pull.length() > 0.12 ? pull.clone().normalize() : TARGET.clone();
    let up = V().copy(Y_UP).addScaledVector(fwd, -fwd.y).normalize();
    if (state === "carry" || state === "lowered") {
      up = V().subVectors(apex, grip).normalize();
      fwd = TARGET.clone().addScaledVector(up, -TARGET.dot(up)).normalize();
    }
    // Draw amount 0..1 from how far the string is pulled behind the grip.
    const draw = nocked ? THREE.MathUtils.clamp((pull.length() - BRACE) / 0.7, 0, 1) : 0;
    // Tips sit behind the grip (string side); after 弓返り the string has swung to the target side.
    const side = state === "released" ? 1 : -1;
    const bend = (BRACE + 0.22 * draw) * side;
    const shrink = 1 - 0.06 * draw;
    const at = (along: number, back: number) => V().copy(grip).addScaledVector(up, along * shrink).addScaledVector(fwd, back);
    const upperTip = at(BOW_UPPER, bend);
    const lowerTip = at(-BOW_LOWER, bend * 0.85);
    this.bowMesh.geometry.dispose();
    this.bowMesh.geometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([lowerTip, at(-BOW_LOWER * 0.5, bend * 0.3), grip, at(BOW_UPPER * 0.5, bend * 0.3), upperTip]),
      48,
      0.011,
      8,
      false,
    );
    this.gripMesh.position.copy(grip);
    this.gripMesh.quaternion.setFromUnitVectors(Y_UP, up);

    // String: straight between the tips, or bent at the nock while drawn.
    const nockOnString = nocked && pull.length() > BRACE ? nock : null;
    const path = new THREE.CurvePath<THREE.Vector3>();
    if (nockOnString) {
      path.add(new THREE.LineCurve3(upperTip, nock));
      path.add(new THREE.LineCurve3(nock, lowerTip));
    } else {
      path.add(new THREE.LineCurve3(upperTip, lowerTip));
    }
    this.stringMesh.geometry.dispose();
    this.stringMesh.geometry = new THREE.TubeGeometry(path, 16, 0.0025, 6, false);

    // Arrow
    const arrow = this.arrow;
    arrow.visible = state !== "released" && state !== "lowered";
    if (state === "rest") {
      // Nocked on the string just above the grip, pointing at the target; string straight.
      arrow.position.copy(grip).addScaledVector(fwd, -BRACE).addScaledVector(up, 0.03);
      arrow.quaternion.setFromUnitVectors(Y_UP, fwd);
    }
    if (state === "carry") {
      // Held in the right fist, pointing at the 末弭 so bow and arrow form an isosceles triangle.
      arrow.position.copy(nock);
      arrow.quaternion.setFromUnitVectors(Y_UP, V().subVectors(upperTip, nock).normalize());
    } else if (nocked) {
      arrow.position.copy(nockOnString || nock);
      arrow.quaternion.setFromUnitVectors(Y_UP, fwd);
    }
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    this.renderer.setSize(r.width, r.height, false);
    this.camera.aspect = r.width / r.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.canvas.removeEventListener("pointerdown", this.enableZoom);
    this.canvas.removeEventListener("pointerleave", this.disableZoom);
    this.controls.dispose();
    const materials = new Set<THREE.Material>();
    this.scene.traverse((obj) => {
      const o = obj as THREE.Object3D & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
      o.geometry?.dispose();
      if (Array.isArray(o.material)) o.material.forEach((m) => materials.add(m));
      else if (o.material) materials.add(o.material);
    });
    materials.forEach((m) => {
      const map = (m as THREE.MeshStandardMaterial).map;
      map?.dispose();
      m.dispose();
    });
    const light = this.scene.children.find((c): c is THREE.DirectionalLight => c instanceof THREE.DirectionalLight);
    light?.shadow.map?.dispose();
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
