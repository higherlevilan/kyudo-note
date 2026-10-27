// Shared look for the 3D scenes: soft matte materials in the site palette, one warm key light,
// and small helpers. Units are metres unless a scene says otherwise.

import type * as T from "three";
import type { SceneCtx, Vec3 } from "./ThreeStage";

/** Ambient + hemisphere + one directional light; no shadows (cheap on phones). */
export function addLights(ctx: SceneCtx, { key = [3, 6, 4] as Vec3, intensity = 1 } = {}) {
  const { THREE, scene, colors } = ctx;
  const hemi = new THREE.HemisphereLight(colors.dark ? 0xd8d0c4 : 0xfffbf3, colors.dark ? 0x2a2723 : 0xd8cdb8, 1.1 * intensity);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xfff4e6, 1.4 * intensity);
  dir.position.set(...key);
  scene.add(dir);
  return { hemi, dir };
}

/** Matte material in a palette colour (or any colour). */
export function mat(ctx: SceneCtx, color: T.ColorRepresentation | T.Color, opts: Partial<T.MeshStandardMaterialParameters> = {}) {
  return new ctx.THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });
}

/** Unlit line through points. */
export function polyline(ctx: SceneCtx, pts: Vec3[], color: T.ColorRepresentation | T.Color, opts: { dashed?: boolean; opacity?: number } = {}) {
  const { THREE } = ctx;
  const g = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(...p)));
  const m = opts.dashed
    ? new THREE.LineDashedMaterial({ color, dashSize: 0.12, gapSize: 0.08, transparent: opts.opacity !== undefined, opacity: opts.opacity ?? 1 })
    : new THREE.LineBasicMaterial({ color, transparent: opts.opacity !== undefined, opacity: opts.opacity ?? 1 });
  const line = new THREE.Line(g, m);
  if (opts.dashed) line.computeLineDistances();
  return line;
}

/** Ease in-out (cubic). */
export const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

/**
 * Run a 0→1 tween over `ms` via ctx.loop; jumps straight to 1 under reduced motion.
 * Returns a cancel function.
 */
export function tween(ctx: SceneCtx, ms: number, step: (k: number) => void, done?: () => void) {
  if (ctx.reducedMotion || ms <= 0) {
    step(1);
    done?.();
    ctx.invalidate();
    return () => {};
  }
  let k = 0;
  let live = true;
  ctx.loop((dt) => {
    if (!live) return false;
    k = Math.min(1, k + (dt * 1000) / ms);
    step(k);
    if (k >= 1) {
      done?.();
      return false;
    }
  });
  return () => {
    live = false;
  };
}
