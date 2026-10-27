"use client";

// Seen-tracking for one 小節 (TechEDU buildChapter): marks it read after it has filled 35% of
// its own height (or of the viewport, for sections taller than the screen) for 2.5 s, or as soon
// as a <Stepper> inside it reaches its last step (bubbling "course:done"). Renders the 「✓ 已讀」
// chip in the section header. Also remembers the section as the last visited one (for
// 「繼續上次進度」) whenever it crosses the reading line, a thin band 35% down the viewport.

import { useEffect, useRef } from "react";
import { isSeen, markSeen, markVisited, useCourseProgress } from "@/lib/course/progress";
import type { ChapterId } from "@/lib/course/types";

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

export default function SeenTracker({ chapter, id }: { chapter: ChapterId; id: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = isSeen(useCourseProgress(), chapter, id);

  // Last visited: independent of `seen`, so it keeps working on sections already read.
  useEffect(() => {
    const sec = ref.current?.closest<HTMLElement>("[data-course-section]");
    if (!sec) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && markVisited(chapter, id), { rootMargin: "-35% 0px -64% 0px" });
    io.observe(sec);
    return () => io.disconnect();
  }, [chapter, id]);

  useEffect(() => {
    if (seen) return;
    const sec = ref.current?.closest<HTMLElement>("[data-course-section]");
    if (!sec) return;
    let timer = 0;
    const mark = () => markSeen(chapter, id);
    const io = new IntersectionObserver(
      ([e]) => {
        const need = Math.min(e.boundingClientRect.height, innerHeight) * 0.35;
        const inView = e.isIntersecting && e.intersectionRect.height >= need;
        if (inView && !timer) timer = window.setTimeout(mark, 2500);
        else if (!inView && timer) {
          clearTimeout(timer);
          timer = 0;
        }
      },
      { threshold: THRESHOLDS },
    );
    io.observe(sec);
    sec.addEventListener("course:done", mark);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      sec.removeEventListener("course:done", mark);
    };
  }, [seen, chapter, id]);

  return (
    <span ref={ref} className="shrink-0 text-xs font-semibold text-wood">
      {seen && (
        <>
          <span aria-hidden="true">✓ </span>已讀
        </>
      )}
    </span>
  );
}
