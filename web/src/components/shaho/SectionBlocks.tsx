import type { ReactNode } from "react";
import { CUES, TAG_LABEL, type Point, type ShahoSection, type Tag } from "@/content/shaho";
import { SOURCES, type SourceKey } from "@/content/sources";
import SharedCites from "@/components/content/Cites";
import { SHAHO_VIDEO, videoAt } from "@/content/shaho-video";
import SectionFigure from "@/components/illustrations/archer/SectionFigure";

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

/** 重點筆記: the short reminders for one segment (CUES, restating the section above). */
export function KeyNotes({ segments }: { segments: { id: string; label?: string }[] }) {
  const groups = segments.map((g) => ({ ...g, cues: CUES[g.id] ?? [] })).filter((g) => g.cues.length > 0);
  if (groups.length === 0) return null;
  return (
    <aside className="mt-4 rounded-xl border border-wood/40 bg-wood-soft/40 p-3 text-[15px] leading-relaxed sm:p-4">
      <p className="mb-1 font-bold">
        重點筆記
        <span className="ml-2 text-xs font-normal text-muted">本站整理自上方說明</span>
      </p>
      {groups.map((g) => (
        <div key={g.id} className={groups.length > 1 ? "mt-1.5" : undefined}>
          {g.label && (
            <p lang="ja" className="text-sm font-semibold text-muted">
              {g.label}
            </p>
          )}
          <ul className="list-disc space-y-0.5 pl-5">
            {g.cues.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

function VideoLink({ seconds, label }: { seconds: number; label: string }) {
  return (
    <a href={videoAt(SHAHO_VIDEO.url, seconds)} target="_blank" rel="noopener noreferrer" className="text-sm text-wood underline">
      {label}（{seconds} 秒起）↗
    </a>
  );
}

/**
 * The body of one 射法八節 小節 (the page wraps it in <CourseSection>, which owns the anchor id and
 * the title): readings, 入門 with the figure, optional `children` (e.g. an animated diagram),
 * 深入, the 重點筆記 and the links into the demonstration video. Extra segments (大三) get their
 * own anchor (`#daisan`) and video link.
 */
export function SectionBody({ s, children }: { s: ShahoSection; children?: ReactNode }) {
  const start = SHAHO_VIDEO.starts[s.segment];
  const extras = s.extraSegments ?? [];
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {s.no != null ? (
          <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium text-paper">第 {s.no} 節</span>
        ) : (
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">補充</span>
        )}
        <span lang="ja" className="text-sm text-muted">
          {s.kana}
        </span>
        <span className="text-sm text-muted">{s.romaji}</span>
        <span className="text-base text-ink">{s.zh}</span>
      </p>

      {extras.map((e) => (
        <span key={e.id} id={e.id} aria-hidden="true" className="block scroll-mt-24" />
      ))}

      <details open className="group mt-4">
        <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
          <Chevron />
          入門
        </summary>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="min-w-0 flex-1 space-y-2 text-[15px] leading-relaxed">
            {s.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              <Cites src={s.introSrc} />
            </p>
          </div>
          <SectionFigure id={s.id} className="order-first rounded-xl bg-paper p-3 sm:order-last sm:max-w-[48%] sm:shrink-0" />
        </div>
      </details>

      {children && <div className="mt-4">{children}</div>}

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

      <KeyNotes segments={[...extras.map((e) => ({ id: e.id, label: e.label })), { id: s.segment, label: extras.length > 0 ? s.term : undefined }]} />

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {extras.map((e) => {
          const t = SHAHO_VIDEO.starts[e.id];
          return t != null ? <VideoLink key={e.id} seconds={t} label={`在示範影片看${e.label}`} /> : null;
        })}
        {start != null && <VideoLink seconds={start} label="在示範影片看這一節" />}
      </div>
    </div>
  );
}
