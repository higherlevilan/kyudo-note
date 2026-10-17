// Small deterministic geometry helpers for the diagrams (no dependencies, server-safe).

/** Monotone cubic (Fritsch–Carlson) interpolation through [x, y] points sorted by x. No overshoot at local extrema. */
export function monotone(points: readonly (readonly [number, number])[]): (x: number) => number {
  const n = points.length;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(xs[i + 1] - xs[i]);
    m.push((ys[i + 1] - ys[i]) / dx[i]);
  }
  const t: number[] = new Array(n).fill(0);
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) {
    t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = dx[i];
    const s = (x - xs[i]) / h;
    const s2 = s * s;
    const s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h * t[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h * t[i + 1];
  };
}

/** Round to 0.1 so the generated path strings stay short and stable. */
export const r1 = (v: number) => Math.round(v * 10) / 10;

/** Samples a..b (inclusive) every `step`. */
export function range(a: number, b: number, step: number): number[] {
  const out: number[] = [];
  for (let v = a; v < b; v += step) out.push(v);
  out.push(b);
  return out;
}

export const rad = (deg: number) => (deg * Math.PI) / 180;
