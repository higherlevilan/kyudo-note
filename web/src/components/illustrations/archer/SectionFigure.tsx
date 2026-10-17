// The illustration block for one 射法八節 section card: front view(s), an optional side or
// top view, the 足踏み footprints, and a short caption. All figures share one scale (--archer-k).

import { POSES, SECTION_FIGURES } from "@/content/illustrations/archer/poses";
import ArcherFigure from "./ArcherFigure";
import Footprints from "./Footprints";

const EXTRA_LABEL = { side: "從靶的方向看", top: "從上方看" } as const;

export default function SectionFigure({ id, className = "" }: { id: string; className?: string }) {
  const spec = SECTION_FIGURES[id];
  if (!spec) return null;
  const labelled = spec.poses.length > 1 || spec.extra != null;
  const extra = spec.extra && (
    <div className="flex min-w-0 flex-col items-center">
      <ArcherFigure pose={spec.poses[0]} view={spec.extra} frame="fit" scaled zoom={spec.extra === "top" ? 1.25 : 1} />
      <span className="mt-0.5 text-xs text-muted">{EXTRA_LABEL[spec.extra]}</span>
    </div>
  );
  return (
    <figure className={`ill-plate rounded-xl p-2 [--archer-k:0.62] sm:[--archer-k:1.05] ${className}`}>
      <div className="flex items-end justify-center gap-3 sm:gap-4">
        {spec.poses.map((p, i) => (
          <div key={p} className="flex min-w-0 flex-col items-center">
            <ArcherFigure pose={p} frame="fit" scaled target={i === spec.poses.length - 1} />
            {labelled && (
              <span lang="ja" className="mt-0.5 text-xs text-muted">
                {POSES[p].term}
              </span>
            )}
          </div>
        ))}
        {spec.extra === "side" && extra}
      </div>
      {spec.extra === "top" && <div className="mt-3 flex justify-center">{extra}</div>}
      {spec.footprints && <Footprints className="mx-auto mt-3 h-auto w-full max-w-[17rem]" />}
      <figcaption className="mt-2 text-xs leading-5 text-muted">{spec.caption}</figcaption>
    </figure>
  );
}
