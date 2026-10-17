// 「你的弓道第一年」: the standard practice progression as a vertical path,
// with community timing examples shown beside it (clearly labelled as examples, not standards).

import { Cites, TagBadge } from "@/components/content/Blocks";
import Kasumi from "@/components/home/Kasumi";
import type { RoadStep, TimingExample } from "@/content/guide/content";

const KANJI_NO = ["〇", "一", "二", "三", "四", "五", "六"];

export default function Roadmap({ steps, examples }: { steps: readonly RoadStep[]; examples: readonly TimingExample[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <ol className="relative" aria-label="練習進程">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={s.id} className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 pb-5 last:pb-0">
              {/* the shaft of the arrow connecting the steps */}
              {!last && <span aria-hidden="true" className="absolute top-11 bottom-0 left-[1.375rem] w-px -translate-x-1/2 bg-wood/40" />}
              <span
                aria-hidden="true"
                className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border text-lg ${
                  s.id === "matomae" ? "border-transparent bg-transparent" : last ? "border-vermilion/50 bg-vermilion/10 text-vermilion" : "border-wood/50 bg-surface text-wood"
                }`}
                lang="ja"
              >
                {s.id === "matomae" ? <Kasumi className="h-11 w-11" /> : KANJI_NO[i]}
              </span>
              <div className="min-w-0 rounded-2xl border border-line bg-surface p-4 shadow-sm">
                <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-xs text-muted">第 {i} 步</span>
                  <span className="text-lg font-semibold">{s.zh}</span>
                  {s.ja && (
                    <span lang="ja" className="text-base text-ink">
                      {s.ja}
                    </span>
                  )}
                  {s.kana && (
                    <span lang="ja" className="text-sm text-muted">
                      {s.kana}
                    </span>
                  )}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed">
                  <TagBadge tag={s.tag} />
                  {s.what}
                  <Cites src={s.src} />
                </p>
                {s.safety && (
                  <p className="mt-2 rounded-lg border-l-2 border-vermilion/60 bg-vermilion/5 px-3 py-1.5 text-sm leading-relaxed">
                    <span className="font-semibold text-vermilion">安全：</span>
                    {s.safety}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <aside aria-labelledby="timing-title" className="self-start rounded-2xl border border-dashed border-wood/50 bg-wood-soft/30 p-4 lg:sticky lg:top-20">
        <h3 id="timing-title" className="font-bold">
          多久走到哪一步？
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          以下是日本社團與教室的<strong className="text-ink">實例</strong>，不是標準。到初段沒有官方規定的時間，台灣也沒有查到系統性的資料。
        </p>
        <ul className="mt-3 space-y-3 text-sm">
          {examples.map((e) => (
            <li key={e.who} className="leading-relaxed">
              <p className="font-semibold">
                {e.who}
                <span className="ml-1.5 rounded border border-line bg-surface px-1.5 py-px text-[11px] font-normal text-muted">{e.kind}</span>
              </p>
              <p>
                {e.text}
                <Cites src={e.src} />
              </p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
