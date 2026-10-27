"use client";
// Marks a say bubble with data-in the first time it scrolls into view, which plays the hop-in
// (CSS in ./mascot.css, skipped under prefers-reduced-motion). Content is visible without JS.

import { useEffect, useRef, type ReactNode } from "react";

export default function SayInView({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Bubbles already on screen at load don't hop; only ones the reader scrolls to.
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
