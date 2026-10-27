// One 小節 of a 關卡 (TechEDU .sec): kicker ("02 · 05"), title from the registry (or `title`),
// optional lead, 小弓's quip from the chapter extras when `quip` is set, and seen-tracking
// (35% in view for 2.5 s, or a <Stepper> inside it reaching its last step).
// Server component; only the tracker / 「已讀」 chip is client-side.
import type { ReactNode } from "react";
import Say from "@/components/mascot/Say";
import { CHAPTER_BY_ID, sectionKicker } from "@/content/course/chapters";
import type { ChapterId } from "@/lib/course/types";
import SeenTracker from "./SeenTracker";

export default function CourseSection({
  chapter,
  id,
  title,
  lead,
  quip = false,
  className = "",
  children,
}: {
  chapter: ChapterId;
  id: string;
  title?: ReactNode;
  lead?: ReactNode;
  quip?: boolean;
  /** extra classes on the <section> (spacing defaults to mt-14) */
  className?: string;
  children: ReactNode;
}) {
  const ch = CHAPTER_BY_ID[chapter];
  const def = ch.sections.find((s) => s.id === id);
  if (process.env.NODE_ENV !== "production" && !def) console.warn(`[course] section "${id}" is not in the ${chapter} registry`);
  const q = quip ? ch.quips?.[id] : undefined;
  // Japanese section names (射法八節, 射癖) are the title itself; otherwise ja is a subtitle.
  const jaIsTitle = title === undefined && !!def?.ja && def.ja === def.title;
  const jaSub = title === undefined && def?.ja && def.ja !== def.title ? def.ja : undefined;

  return (
    <section id={id} aria-labelledby={`${id}-title`} data-course-section="" className={`mt-14 scroll-mt-20 first:mt-0 ${className}`}>
      <header className="mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.14em] text-wood tabular-nums">{sectionKicker(chapter, id)}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
          <SeenTracker chapter={chapter} id={id} />
        </div>
        <h2 id={`${id}-title`} lang={jaIsTitle ? "ja" : undefined} className="mt-2 text-2xl leading-snug font-bold sm:text-[1.7rem]">
          {title ?? def?.title ?? id}
          {jaSub && (
            <span lang="ja" className="ml-2 text-base font-normal text-muted">
              {jaSub}
            </span>
          )}
        </h2>
        {lead && <div className="mt-2 max-w-3xl leading-relaxed text-muted">{lead}</div>}
        {q?.text && <Say mood={q.mood ?? "think"} html={q.text} compact className="mt-4" />}
      </header>
      {children}
    </section>
  );
}
