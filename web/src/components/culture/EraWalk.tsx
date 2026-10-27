"use client";

// 時代之旅: steps through the six eras of the timeline (ERAS), with a marker sliding along an era
// band and three key events of that era taken as-is from TIMELINE (with their 說法不一 notes and
// sources). The full, filterable list stays in <Timeline> below it.

import { useState } from "react";
import Stepper from "@/components/course/Stepper";
import { Cites, TagBadge } from "@/components/content/Blocks";
import { useProgress } from "@/components/shaguse/anim";
import { ERAS, TIMELINE, type EraId, type TimelineEvent } from "@/content/culture/timeline";

/** Three events per era, by id (both 日本 and 台灣 tracks where the era has them). */
const PICKS: Record<EraId, string[]> = {
  ancient: ["gishi", "fusedake", "jarai"],
  medieval: ["ogasawara", "heki", "teppo"],
  edo: ["hoshino", "yoshimune", "kobusho"],
  modern: ["butokukai", "tw-1896", "rename"],
  postwar: ["1949", "1953", "1956"],
  today: ["2001", "ikyf", "tw-2014"],
};

const byId = new Map(TIMELINE.map((e) => [e.id, e]));
const eventsOf = (era: EraId) => PICKS[era].map((id) => byId.get(id)).filter((e): e is TimelineEvent => !!e);
const countOf = (era: EraId) => TIMELINE.filter((e) => e.era === era).length;

const W = 330;
const PAD = 12;
const SEG = (W - PAD * 2) / ERAS.length;
const cx = (i: number) => PAD + SEG * i + SEG / 2;

function Band({ i }: { i: number }) {
  // Remember where the marker comes from (derived state, updated while rendering).
  const [move, setMove] = useState({ from: i, to: i });
  if (move.to !== i) setMove({ from: move.to, to: i });
  const from = move.to !== i ? move.to : move.from;
  const p = useProgress(i, 700);
  const e = 1 - Math.pow(1 - p, 3);
  const x = cx(from) + (cx(i) - cx(from)) * e;
  return (
    <svg viewBox={`0 0 ${W} 74`} className="block h-auto w-full" aria-hidden="true">
      <path d={`M${PAD} 30H${W - PAD}`} stroke="var(--line)" strokeWidth={3} strokeLinecap="round" />
      {ERAS.map((era, k) => (
        <g key={era.id}>
          <circle cx={cx(k)} cy={30} r={k === i ? 6 : 4} fill={k <= i ? "var(--wood)" : "var(--surface)"} stroke="var(--wood)" strokeWidth={1.4} />
          <text x={cx(k)} y={k % 2 === 0 ? 52 : 68} fontSize={11.5} textAnchor="middle" fill={k === i ? "var(--ink)" : "var(--muted)"} fontWeight={k === i ? 700 : 400}>
            {era.label}
          </text>
        </g>
      ))}
      {/* the traveller: an arrow flying along the band */}
      <g transform={`translate(${x.toFixed(1)} 14)`}>
        <path d="M-13 0H9" stroke="var(--ink)" strokeWidth={1.4} strokeLinecap="round" />
        <path d="M9 -2.6L14 0L9 2.6Z" fill="var(--ink)" />
        <path d="M-13 0l-3 -3M-13 0l-3 3M-10 0l-3 -3M-10 0l-3 3" stroke="var(--vermilion)" strokeWidth={1} strokeLinecap="round" />
      </g>
    </svg>
  );
}

function EraCard({ i }: { i: number }) {
  const era = ERAS[i];
  return (
    <div className="rounded-xl border border-line bg-paper/40 p-3 sm:p-4">
      <Band i={i} />
      <ol className="mt-2 space-y-3">
        {eventsOf(era.id).map((ev) => (
          <li key={ev.id} className="border-l-2 border-line pl-3" style={{ borderColor: ev.disputed ? "var(--vermilion)" : ev.track === "tw" ? "var(--indigo)" : "var(--wood)" }}>
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-semibold text-wood tabular-nums">{ev.when}</span>
              <span className={`rounded px-1.5 py-px text-[11px] leading-4 ${ev.track === "tw" ? "bg-indigo/15 text-indigo" : "bg-wood-soft text-ink"}`}>
                {ev.track === "tw" ? "台灣" : "日本"}
              </span>
              {ev.disputed && <TagBadge tag="disputed" />}
            </p>
            <p className="mt-0.5 font-semibold leading-snug">{ev.title}</p>
            <p className="mt-0.5 text-[15px] leading-relaxed text-muted">
              {ev.meaning}
              <Cites src={ev.src} />
            </p>
            {ev.disputed && ev.note && <p className="mt-1 rounded-lg bg-vermilion/5 px-3 py-1.5 text-sm leading-relaxed">註：{ev.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function EraWalk() {
  return (
    <Stepper
      label="弓道史的六個時代"
      autoplayMs={5200}
      steps={ERAS.map((era) => ({
        title: `${era.label}（${era.range}）`,
        text: `這個時代在年表中有 ${countOf(era.id)} 則事件，這裡先挑 3 則；完整內容見下方的互動年表。`,
      }))}
    >
      {(i) => <EraCard i={i} />}
    </Stepper>
  );
}
