// Light confetti on a shared full-screen canvas (TechEDU ux.js), in the site's dye colours.
// Does nothing when the viewer prefers reduced motion.

type Bit = { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vr: number; life: number; sq: boolean };

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let bits: Bit[] = [];
let raf = 0;

function colours() {
  const cs = getComputedStyle(document.documentElement);
  return ["--vermilion", "--wood", "--indigo", "--moss", "--yamabuki", "--murasaki"].map((v) => cs.getPropertyValue(v).trim() || "#b4442b");
}

function ensureCanvas() {
  if (canvas?.isConnected) return true;
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:90";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  return !!ctx;
}

function tick() {
  raf = 0;
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(innerWidth * dpr) || canvas.height !== Math.round(innerHeight * dpr)) {
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  bits = bits.filter((b) => b.life > 0 && b.y < innerHeight + 20);
  for (const b of bits) {
    b.vy += 0.22;
    b.vx *= 0.99;
    b.x += b.vx;
    b.y += b.vy;
    b.rot += b.vr;
    b.life -= 0.008;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, b.life * 1.5));
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rot);
    ctx.fillStyle = b.c;
    if (b.sq) ctx.fillRect(-b.r, -b.r / 2, b.r * 2, b.r);
    else {
      ctx.beginPath();
      ctx.arc(0, 0, b.r / 1.4, 0, 7);
      ctx.fill();
    }
    ctx.restore();
  }
  if (bits.length) raf = requestAnimationFrame(tick);
  else ctx.clearRect(0, 0, innerWidth, innerHeight);
}

/** Burst `n` pieces from (x, y). With `spread` (radians) they fly upwards in a cone. */
export function confetti(x: number, y: number, n = 40, spread?: number) {
  if (typeof window === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!ensureCanvas()) return;
  const cols = colours();
  for (let i = 0; i < n; i++) {
    const a = spread ? -Math.PI / 2 + (Math.random() - 0.5) * spread : Math.random() * Math.PI * 2;
    const v = 4 + Math.random() * 6;
    bits.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - (spread ? 3 : 0),
      r: 2.5 + Math.random() * 3.5,
      c: cols[i % cols.length],
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      life: 1,
      sq: Math.random() < 0.5,
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}

/** Burst from the centre of an element. */
export function confettiFrom(el: Element | null, n = 24) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  confetti(r.left + r.width / 2, r.top + r.height / 2, n, Math.PI * 0.9);
}
