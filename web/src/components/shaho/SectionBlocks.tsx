import { TAG_LABEL, type Point, type ShahoSection, type Tag } from "@/content/shaho";
import { SOURCES, type SourceKey } from "@/content/sources";
import SharedCites from "@/components/content/Cites";
import { videoAt, type MotionMeta } from "@/lib/shaho/motion";

const TAG_STYLE: Record<Tag, string> = {
  official: "bg-indigo/15 text-indigo border-indigo/30",
  guide: "bg-wood-soft text-ink border-wood/30",
  local: "bg-surface-2 text-ink border-line",
  folk: "bg-vermilion/10 text-vermilion border-vermilion/40",
  demo: "bg-surface-2 text-muted border-line",
  note: "bg-surface-2 text-muted border-line",
};

export function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span className={`mr-1.5 inline-block rounded border px-1.5 py-px align-[1px] text-[11px] leading-4 whitespace-nowrap ${TAG_STYLE[tag]}`}>
      {TAG_LABEL[tag]}
    </span>
  );
}

export function Cites({ src }: { src?: readonly SourceKey[] }) {
  return <SharedCites src={src?.map((k) => SOURCES[k])} />;
}

export function PointList({ points }: { points: Point[] }) {
  return (
    <ul className="space-y-2">
      {points.map((p, i) => (
        <li key={i} className="leading-relaxed">
          {p.tag && <TagBadge tag={p.tag} />}
          {p.text}
          <Cites src={p.src} />
        </li>
      ))}
    </ul>
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current text-wood">
      <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
    </svg>
  );
}

export function SectionCard({ s, meta }: { s: ShahoSection; meta: MotionMeta }) {
  const seg = meta.segments.find((x) => x.id === s.segment);
  const ref = meta.ref;
  return (
    <article id={s.id} className="scroll-mt-20 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {s.no != null ? (
          <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium text-paper">第 {s.no} 節</span>
        ) : (
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">補充</span>
        )}
        <h3 className="text-2xl font-semibold">
          <span lang="ja">{s.term}</span>
        </h3>
        <span lang="ja" className="text-sm text-muted">
          {s.kana}
        </span>
        <span className="text-sm text-muted">{s.romaji}</span>
        <span className="text-base text-ink">{s.zh}</span>
      </header>

      <details open className="group mt-4">
        <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
          <Chevron />
          入門
        </summary>
        <div className="mt-2 space-y-2 text-[15px] leading-relaxed">
          {s.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p>
            <Cites src={s.introSrc} />
          </p>
        </div>
      </details>

      <details data-layer="deep" className="mt-3 border-t border-line pt-3">
        <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
          <Chevron />
          深入
          <span className="font-normal text-muted">（細節、常見錯誤、坊間說法對照）</span>
        </summary>
        <div className="mt-3 space-y-4 text-[15px]">
          {s.deep.map((b) => (
            <div key={b.title}>
              <h4 className="mb-1.5 text-sm font-bold text-muted">{b.title}</h4>
              <PointList points={b.points} />
            </div>
          ))}
        </div>
      </details>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {seg && ref && (
          <a
            href={videoAt(ref.url, seg.start)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-wood underline"
          >
            在原影片看這一節（{Math.floor(seg.start)} 秒起）↗
          </a>
        )}
      </div>
    </article>
  );
}
