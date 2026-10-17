// 「八節一覽」: eight small figures in order, each linking to its section. Scrolls sideways
// (with snap) on phones, one row of eight from sm up. All thumbnails share one frame.

import { SECTIONS } from "@/content/shaho";
import { THUMB_POSE } from "@/content/illustrations/archer/poses";
import ArcherFigure from "./ArcherFigure";

export default function HassetsuStrip() {
  const steps = SECTIONS.filter((s) => s.no != null && THUMB_POSE[s.id]).sort((a, b) => (a.no ?? 0) - (b.no ?? 0));
  return (
    <section aria-labelledby="hassetsu-overview" className="mb-8">
      <h2 id="hassetsu-overview" className="mb-2 text-lg font-bold">
        八節一覽
      </h2>
      <ol className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-8 sm:overflow-visible sm:px-0 sm:pb-0">
        {steps.map((s) => (
          <li key={s.id} className="w-[5.25rem] shrink-0 snap-start sm:w-auto">
            <a
              href={`#${s.id}`}
              className="flex h-full flex-col items-center rounded-xl border border-line bg-surface px-1 pt-1 pb-1.5 text-center no-underline hover:border-wood hover:bg-surface-2"
            >
              <span className="ill-plate block w-full rounded-lg">
                <ArcherFigure pose={THUMB_POSE[s.id]} compact decorative className="h-auto w-full" />
              </span>
              <span className="mt-1 text-[11px] leading-4 text-muted tabular-nums">第 {s.no} 節</span>
              <span lang="ja" className="text-sm leading-5 text-ink">
                {s.term}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
