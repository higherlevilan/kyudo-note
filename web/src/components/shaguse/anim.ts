"use client";

// Tiny animation helper for the step diagrams on /shaguse and /culture: a 0 → 1 progress value
// that restarts whenever `key` changes. With prefers-reduced-motion it is 1 straight away.

import { useEffect, useRef, useState } from "react";

function reduced(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

export function useProgress(key: string | number, ms = 900): number {
  const [state, setState] = useState<{ key: string | number; p: number }>({ key, p: 1 });
  const first = useRef(true);
  useEffect(() => {
    // The first step is shown finished; animate only when the step changes.
    if (first.current) {
      first.current = false;
      return;
    }
    let raf = 0;
    if (reduced()) {
      raf = requestAnimationFrame(() => setState({ key, p: 1 }));
      return () => cancelAnimationFrame(raf);
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      setState({ key, p: t });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key, ms]);
  // Until the first frame of a new key arrives, start from 0 (the server render shows the end state).
  return state.key === key ? state.p : reduced() ? 1 : 0;
}
