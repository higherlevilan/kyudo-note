"use client";
// Interactive figures (Stepper, ThreeStage) tell the corner 小弓 when they sit in the middle band of
// the screen, so on phones it can step aside instead of covering their controls.
// Each figure dispatches window "mascot:avoid" {el, on}; Companion keeps the set of active ones.

import { useEffect, type RefObject } from "react";

export const AVOID_EVENT = "mascot:avoid";
export type AvoidDetail = { el: Element; on: boolean };

export function useMascotAvoid(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let on = false;
    const set = (v: boolean) => {
      if (v === on) return;
      on = v;
      dispatchEvent(new CustomEvent<AvoidDetail>(AVOID_EVENT, { detail: { el, on: v } }));
    };
    // "In the middle of the screen": overlapping the band from 30% to 70% of the viewport height.
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { rootMargin: "-30% 0px -30% 0px" });
    io.observe(el);
    return () => {
      io.disconnect();
      set(false);
    };
  }, [ref]);
}
