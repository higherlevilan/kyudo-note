// One 射癖 card: 入門 (LayeredCard) → definitions with their authority → 深入 (studies, advice, when to ask).

import type { ReactNode } from "react";
import { Cites, LayeredCard, PointList, TagBadge } from "@/components/content/Blocks";
import type { Fault, Study } from "@/content/shaguse/types";

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current text-wood">
      <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
    </svg>
  );
}

function StudyItem({ s }: { s: Study }) {
  return (
    <li className="rounded-xl border border-line bg-paper/40 p-3">
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span lang="ja" className="font-semibold">
          {s.who}
        </span>
        <span className="rounded bg-surface-2 px-1.5 text-xs text-ink tabular-nums">{s.n}</span>
      </p>
      <dl className="mt-1.5 space-y-1.5 text-sm leading-relaxed">
        <div>
          <dt className="inline font-semibold text-muted">對象／方法：</dt>
          <dd className="inline">{s.method}</dd>
        </div>
        <div>
          <dt className="font-semibold text-muted">主要結果</dt>
          <dd>
            <ul className="mt-0.5 list-disc space-y-1 pl-5">
              {s.findings.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="inline font-semibold text-vermilion">限制：</dt>
          <dd className="inline">
            {s.limits}
            <Cites src={s.src} />
          </dd>
        </div>
      </dl>
    </li>
  );
}

function SubHead({ children }: { children: ReactNode }) {
  return <h4 className="mb-1.5 text-sm font-bold text-muted">{children}</h4>;
}

export default function FaultCard({ f }: { f: Fault }) {
  const titleText = f.section.title;
  return (
    <LayeredCard
      s={f.section}
      figure={
        <div className="rounded-xl border border-line bg-surface-2/50 p-3 text-[15px] sm:p-4">
          <p className="mb-1.5 text-sm font-bold text-muted">定義與用語</p>
          <PointList points={f.defs} />
        </div>
      }
    >
      <details data-layer="deep" className="mt-3 border-t border-line pt-3">
        <summary className="flex min-h-11 items-center gap-1.5 text-sm font-semibold text-wood">
          <Chevron />
          深入
          <span className="sr-only">：{titleText}的研究證據、改善說法與求助時機</span>
        </summary>
        <div className="mt-3 space-y-5 text-[15px]">
          <section aria-label={`${titleText}的研究證據`}>
            <SubHead>
              <TagBadge tag="research" />
              研究證據（請注意樣本數與限制）
            </SubHead>
            {f.studies.length > 0 ? (
              <ul className="grid gap-2.5 md:grid-cols-2">
                {f.studies.map((s) => (
                  <StudyItem key={s.who} s={s} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">{f.noStudyNote ?? "本站沒有找到相關研究。"}</p>
            )}
            {f.evidenceNotes && f.evidenceNotes.length > 0 && (
              <div className="mt-3">
                <PointList points={f.evidenceNotes} />
              </div>
            )}
          </section>
          <section aria-label={`${titleText}的改善說法`}>
            <SubHead>常見的改善說法（除非標「研究」，都是一般指導說法）</SubHead>
            <PointList points={f.tips} />
          </section>
          <section aria-label={`${titleText}：什麼時候要找人幫忙`} className="rounded-xl border border-wood/40 bg-wood-soft/40 p-3">
            <SubHead>什麼時候要找人幫忙</SubHead>
            <PointList points={f.help} />
          </section>
        </div>
      </details>
    </LayeredCard>
  );
}
