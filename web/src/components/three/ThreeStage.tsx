"use client";

// 3D 示意舞台：three.js 場景的共用外框。
// - three.js 與場景模組都是動態載入：舞台捲到畫面附近才下載（約 150 KB gzip），沒看到就不花流量。
// - 只在需要時繪製（拖曳、切換視角、場景動畫進行中）；離開畫面或分頁隱藏時停止動畫。
// - 文字標籤是疊在畫布上的 HTML（中日文字型清楚、可被螢幕閱讀器略過），由 ctx.label() 建立。
// - 不支援 WebGL 時顯示 fallback（通常是原本的 SVG 圖）。
// - 手機：畫布設 touch-action: pan-y，上下滑照常捲動頁面，左右拖曳才旋轉；滾輪不縮放，避免搶走捲動。
// - 深淺色：顏色取自 CSS 變數，系統切換配色時重建場景。
// - 舞台離畫面超過約 2 個螢幕高時釋放 WebGL context（瀏覽器同時可用的 context 有上限），捲回附近再重建；
//   WebGL context 遺失時，恢復後（或 2 秒內沒恢復）重建。場景 props 由父元件保管，重建後沿用；鏡頭位置也會保留。
// 場景模組 default export 一個 (ctx, props) => handle；props 變了會呼叫 handle.update(props)。

import { useEffect, useRef, useState, type ReactNode } from "react";
import type * as T from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useMascotAvoid } from "@/components/mascot/avoid";

export type Three = typeof import("three");
export type Vec3 = [number, number, number];

export interface Palette {
  dark: boolean;
  paper: T.Color;
  surface: T.Color;
  surface2: T.Color;
  ink: T.Color;
  muted: T.Color;
  line: T.Color;
  wood: T.Color;
  woodSoft: T.Color;
  vermilion: T.Color;
  indigo: T.Color;
  moss: T.Color;
  yamabuki: T.Color;
}

export type LabelTone = "ink" | "wood" | "vermilion" | "indigo" | "muted" | "moss";

export interface Label {
  /** world position (mutate it, then ctx.invalidate()) */
  pos: T.Vector3;
  set(text: string): void;
  show(visible: boolean): void;
  tone(tone: LabelTone): void;
}

export interface SceneCtx {
  THREE: Three;
  scene: T.Scene;
  camera: T.PerspectiveCamera;
  controls: OrbitControls;
  renderer: T.WebGLRenderer;
  colors: Palette;
  reducedMotion: boolean;
  /** request one redraw (call after changing anything outside a loop callback) */
  invalidate(): void;
  /** per-frame callback (dt, elapsed in seconds); return false to stop. Returns a cancel function. */
  loop(fn: (dt: number, t: number) => boolean | void): () => void;
  /** HTML label pinned to a world position. `small` = 12px muted style. */
  label(text: string, pos: Vec3 | T.Vector3, opts?: { tone?: LabelTone; small?: boolean; visible?: boolean }): Label;
  /** move the camera (and orbit target) smoothly; instant under reduced motion */
  flyTo(pos: Vec3, target: Vec3, ms?: number): void;
}

export interface SceneHandle<P> {
  update?(props: P): void;
  dispose?(): void;
}

export type SceneFactory<P> = (ctx: SceneCtx, props: P) => SceneHandle<P>;
export type SceneModule<P> = { default: SceneFactory<P> };

export interface ViewPreset {
  id: string;
  label: string;
  pos: Vec3;
  target: Vec3;
}

const TONE_CLASS: Record<LabelTone, string> = {
  ink: "text-ink",
  wood: "text-wood",
  vermilion: "text-vermilion",
  indigo: "text-indigo",
  muted: "text-muted",
  moss: "text-moss",
};

const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

function readPalette(THREE: Three): Palette {
  const cs = getComputedStyle(document.documentElement);
  const c = (name: string, dflt: string) => new THREE.Color((cs.getPropertyValue(name).trim() || dflt) as T.ColorRepresentation);
  return {
    dark: window.matchMedia?.("(prefers-color-scheme: dark)").matches === true,
    paper: c("--paper", "#f6f1e7"),
    surface: c("--surface", "#fffbf3"),
    surface2: c("--surface-2", "#efe6d6"),
    ink: c("--ink", "#2a2520"),
    muted: c("--muted", "#675d52"),
    line: c("--line", "#ddd1bd"),
    wood: c("--wood", "#82552b"),
    woodSoft: c("--wood-soft", "#ead9bd"),
    vermilion: c("--vermilion", "#a33e26"),
    indigo: c("--indigo", "#34507a"),
    moss: c("--moss", "#51662f"),
    yamabuki: c("--yamabuki", "#a8740f"),
  };
}

function shallowEqual(a: unknown, b: unknown) {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const ka = Object.keys(a as object);
  if (ka.length !== Object.keys(b as object).length) return false;
  return ka.every((k) => (a as Record<string, unknown>)[k] === (b as Record<string, unknown>)[k]);
}

type Status = "idle" | "ready" | "fail";

export default function ThreeStage<P>({
  load,
  props,
  label,
  description,
  fallback,
  views = [],
  initialView,
  aspect = "16 / 10",
  hint = "拖曳可旋轉",
  className = "",
  children,
}: {
  /** () => import("./scenes/xxx") */
  load: () => Promise<SceneModule<P>>;
  props: P;
  /** accessible name of the figure, e.g. 「射場的立體示意」 */
  label: string;
  /** screen-reader description of what the scene shows */
  description: string;
  /** shown when WebGL is unavailable (usually the existing SVG) */
  fallback: ReactNode;
  /** camera presets, shown as buttons under the canvas */
  views?: ViewPreset[];
  /** id of the starting view (default: first) */
  initialView?: string;
  /** CSS aspect-ratio of the canvas box */
  aspect?: string;
  hint?: string | null;
  className?: string;
  /** extra controls rendered under the view buttons (owned by the caller) */
  children?: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const labelHost = useRef<HTMLDivElement>(null);
  useMascotAvoid(box);
  const [status, setStatus] = useState<Status>("idle");
  const [gen, setGen] = useState(0);
  const [touched, setTouched] = useState(false);
  const [view, setView] = useState(initialView ?? views[0]?.id);
  const api = useRef<{ handle: SceneHandle<P>; ctx: SceneCtx } | null>(null);
  const propsRef = useRef(props);
  const lastProps = useRef<P | null>(null);
  const loadRef = useRef(load);
  const viewsRef = useRef(views);
  const viewRef = useRef(view);
  /** camera kept across rebuilds (context loss, off-screen release, colour-scheme change) */
  const camSave = useRef<{ pos: Vec3; target: Vec3 } | null>(null);
  useEffect(() => {
    propsRef.current = props;
    loadRef.current = load;
    viewsRef.current = views;
    viewRef.current = view;
  });

  // Build when the box comes within 300px of the screen; release it when it is more than ~2 screens away.
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const enter = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "300px 0px" });
    const leave = new IntersectionObserver(([e]) => !e.isIntersecting && setNear(false), { rootMargin: "200% 0px" });
    enter.observe(el);
    leave.observe(el);
    return () => {
      enter.disconnect();
      leave.disconnect();
    };
  }, []);

  // Rebuild on colour-scheme change.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const on = () => setGen((g) => g + 1);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!near) return;
    let dead = false;
    let cleanup = () => {};
    (async () => {
      let THREE: Three, Controls: typeof OrbitControls, mod: SceneModule<P>;
      try {
        [THREE, { OrbitControls: Controls }, mod] = await Promise.all([
          import("three"),
          import("three/addons/controls/OrbitControls.js"),
          loadRef.current(),
        ]);
      } catch {
        if (!dead) setStatus("fail");
        return;
      }
      if (dead) return;
      const host = canvasHost.current;
      const lhost = labelHost.current;
      const container = box.current;
      if (!host || !lhost || !container) return;

      let renderer: T.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        setStatus("fail");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      const canvas = renderer.domElement;
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      host.appendChild(canvas);

      // ---- context loss: stop drawing; rebuild when restored, or after 2 s if it never is
      let lost = false;
      let lostTimer = 0;
      const onLost = (e: Event) => {
        e.preventDefault();
        lost = true;
        lostTimer = window.setTimeout(() => setGen((g) => g + 1), 2000);
      };
      const onRestored = () => {
        clearTimeout(lostTimer);
        setGen((g) => g + 1);
      };
      canvas.addEventListener("webglcontextlost", onLost);
      canvas.addEventListener("webglcontextrestored", onRestored);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 400);
      const controls = new Controls(camera, canvas);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = false;
      canvas.style.touchAction = "pan-y";

      const colors = readPalette(THREE);
      const rm = reduced();

      // ---- render on demand + loop callbacks
      let raf = 0;
      let visible = true;
      let last = 0;
      let elapsed = 0;
      const loops = new Set<(dt: number, t: number) => boolean | void>();
      const labels: { el: HTMLSpanElement; pos: T.Vector3; on: boolean }[] = [];
      const tmp = new THREE.Vector3();

      const placeLabels = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        for (const l of labels) {
          if (!l.on) {
            l.el.style.display = "none";
            continue;
          }
          tmp.copy(l.pos).project(camera);
          if (tmp.z > 1 || tmp.z < -1) {
            l.el.style.display = "none";
            continue;
          }
          l.el.style.display = "";
          l.el.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px) translate(-50%, -50%)`;
        }
      };
      const frame = (now: number) => {
        raf = 0;
        if (lost) return;
        const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
        last = now;
        elapsed += dt;
        for (const fn of [...loops]) if (fn(dt, elapsed) === false) loops.delete(fn);
        renderer.render(scene, camera);
        placeLabels();
        if (loops.size && visible) raf = requestAnimationFrame(frame);
        else last = 0;
      };
      const invalidate = () => {
        if (!raf && !lost) raf = requestAnimationFrame(frame);
      };
      controls.addEventListener("change", invalidate);
      const onStart = () => setTouched(true);
      controls.addEventListener("start", onStart);

      const ctx: SceneCtx = {
        THREE,
        scene,
        camera,
        controls,
        renderer,
        colors,
        reducedMotion: rm,
        invalidate,
        loop(fn) {
          loops.add(fn);
          invalidate();
          return () => loops.delete(fn);
        },
        label(text, pos, opts = {}) {
          const el = document.createElement("span");
          el.className = `absolute left-0 top-0 whitespace-nowrap rounded-md px-1.5 py-0.5 leading-tight shadow-sm ring-1 ring-line ${
            opts.small ? "bg-surface/85 text-xs" : "bg-surface/90 text-[13px] font-semibold"
          } ${TONE_CLASS[opts.tone ?? (opts.small ? "muted" : "ink")]}`;
          el.textContent = text;
          lhost.appendChild(el);
          const rec = { el, pos: Array.isArray(pos) ? new THREE.Vector3(...pos) : pos, on: opts.visible ?? true };
          labels.push(rec);
          invalidate();
          return {
            pos: rec.pos,
            set: (t) => {
              el.textContent = t;
            },
            show: (v) => {
              rec.on = v;
              invalidate();
            },
            tone: (t) => {
              for (const c of Object.values(TONE_CLASS)) el.classList.remove(c);
              el.classList.add(TONE_CLASS[t]);
            },
          };
        },
        flyTo(pos, target, ms = 700) {
          const p0 = camera.position.clone();
          const t0 = controls.target.clone();
          const p1 = new THREE.Vector3(...pos);
          const t1 = new THREE.Vector3(...target);
          if (rm || ms <= 0) {
            camera.position.copy(p1);
            controls.target.copy(t1);
            controls.update();
            invalidate();
            return;
          }
          let k = 0;
          ctx.loop((dt) => {
            k = Math.min(1, k + (dt * 1000) / ms);
            const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
            camera.position.lerpVectors(p0, p1, e);
            controls.target.lerpVectors(t0, t1, e);
            controls.update();
            return k < 1;
          });
        },
      };

      // ---- size
      const resize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        invalidate();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      resize();

      // ---- pause loops off-screen / hidden tab
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting && !document.hidden;
        if (visible) invalidate();
      });
      io.observe(container);
      const onVis = () => {
        visible = !document.hidden;
        if (visible) invalidate();
      };
      document.addEventListener("visibilitychange", onVis);

      const v0 = viewsRef.current.find((v) => v.id === viewRef.current) ?? viewsRef.current[0];
      if (camSave.current) {
        camera.position.set(...camSave.current.pos);
        controls.target.set(...camSave.current.target);
      } else if (v0) {
        camera.position.set(...v0.pos);
        controls.target.set(...v0.target);
      }
      controls.update();

      let handle: SceneHandle<P>;
      try {
        handle = mod.default(ctx, propsRef.current);
      } catch (err) {
        console.error("[ThreeStage]", err);
        setStatus("fail");
        renderer.dispose();
        canvas.remove();
        return;
      }
      lastProps.current = propsRef.current;
      api.current = { handle, ctx };
      setStatus("ready");
      invalidate();

      cleanup = () => {
        camSave.current = { pos: camera.position.toArray() as Vec3, target: controls.target.toArray() as Vec3 };
        canvas.removeEventListener("webglcontextlost", onLost);
        canvas.removeEventListener("webglcontextrestored", onRestored);
        clearTimeout(lostTimer);
        cancelAnimationFrame(raf);
        loops.clear();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        controls.removeEventListener("change", invalidate);
        controls.removeEventListener("start", onStart);
        handle.dispose?.();
        controls.dispose();
        scene.traverse((o) => {
          const m = o as T.Mesh;
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
          for (const mat of mats) {
            for (const v of Object.values(mat)) if (v && (v as T.Texture).isTexture) (v as T.Texture).dispose();
            mat.dispose();
          }
        });
        renderer.dispose();
        if (!lost) renderer.forceContextLoss();
        canvas.remove();
        for (const l of labels) l.el.remove();
        api.current = null;
        setStatus("idle");
      };
    })();

    return () => {
      dead = true;
      cleanup();
    };
  }, [near, gen]);

  // Push new props into the live scene.
  useEffect(() => {
    const a = api.current;
    if (!a || shallowEqual(lastProps.current, props)) return;
    lastProps.current = props;
    a.handle.update?.(props);
    a.ctx.invalidate();
  });

  // The drag hint fades out on its own after a few seconds, so it never sits on the labels for long.
  useEffect(() => {
    if (status !== "ready" || touched) return;
    const t = setTimeout(() => setTouched(true), 6000);
    return () => clearTimeout(t);
  }, [status, touched]);

  const pick = (v: ViewPreset) => {
    setView(v.id);
    api.current?.ctx.flyTo(v.pos, v.target);
  };

  const btn =
    "inline-flex min-h-10 items-center rounded-lg border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  if (status === "fail") return <>{fallback}</>;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        ref={box}
        role="img"
        aria-label={label}
        className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-b from-surface to-surface-2"
        style={{ aspectRatio: aspect }}
      >
        <span className="sr-only">{description}</span>
        <div ref={canvasHost} className="absolute inset-0" />
        <div ref={labelHost} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" />
        {status !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted" aria-hidden="true">
            載入 3D 示意圖…
          </div>
        )}
        {status === "ready" && hint && !touched && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-2 max-w-[70%] rounded-md bg-ink/70 px-2 py-0.5 text-right text-xs text-paper"
          >
            {hint}
          </span>
        )}
      </div>
      {(views.length > 0 || children) && (
        <div className="flex flex-wrap items-center gap-2">
          {views.length > 0 && (
            <div role="group" aria-label="切換視角" className="flex flex-wrap gap-1.5">
              {views.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => pick(v)}
                  aria-pressed={view === v.id}
                  disabled={status !== "ready"}
                  className={`${btn} ${view === v.id ? "border-wood bg-wood-soft text-ink" : "border-field-border bg-surface text-ink hover:bg-surface-2"}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
