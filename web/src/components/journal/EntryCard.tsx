"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { formatDay } from "@/lib/journal/date";
import { entryTitle, fmtPct, pct, practiceTotals } from "@/lib/journal/model";
import {
  CULTURE_KIND_OPTS,
  EQUIP_CATEGORY_OPTS,
  EQUIP_STATUS_OPTS,
  EXAM_RESULT_OPTS,
  FATIGUE_OPTS,
  faultOpt,
  optLabel,
  PRACTICE_KIND_OPTS,
  SHAHO_STEP_OPTS,
  TYPE_META,
  YADOKORO_OPTS,
} from "@/lib/journal/options";
import { isSample } from "@/lib/journal/sample";
import type { Entry, ShahoStep } from "@/lib/journal/types";
import { MarkGlyph, SampleBadge, TypeBadge } from "./ui";

/** NT$1,200 / ¥38,000 — explicit prefixes so TWD is never mistaken for USD. */
export function money(n: number, currency: string): string {
  const num = Math.round(n).toLocaleString("en-US");
  return currency === "TWD" ? `NT$${num}` : currency === "JPY" ? `¥${num}` : `${currency} ${num}`;
}

function Chip({ children, ja }: { children: ReactNode; ja?: boolean }) {
  return (
    <span lang={ja ? "ja" : undefined} className="inline-block rounded-full border border-line bg-surface-2 px-2 py-0.5 text-xs text-ink">
      {children}
    </span>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5em_1fr] gap-2 text-[15px]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="min-w-0 leading-relaxed break-words whitespace-pre-wrap">{children}</dd>
    </div>
  );
}

export function StepLinkList({ steps }: { steps: ShahoStep[] }) {
  return (
    <span className="inline-flex flex-wrap gap-x-2 gap-y-1">
      {steps.map((s) => (
        <Link key={s} href={`/shaho/#${s}`} lang="ja" className="text-wood underline">
          {SHAHO_STEP_OPTS.find((o) => o.key === s)?.ja ?? s}
        </Link>
      ))}
    </span>
  );
}

/** One-line headline numbers for an entry. */
function headline(e: Entry): ReactNode {
  switch (e.type) {
    case "practice": {
      const t = practiceTotals(e);
      return (
        <>
          {t.arrows > 0 && (
            <span>
              的前 <strong className="tabular-nums">{t.arrows}</strong> 射 <strong className="tabular-nums">{t.hits}</strong> 中
              <span className="text-muted">（{fmtPct(pct(t.hits, t.arrows))}）</span>
            </span>
          )}
          {t.makiwara > 0 && (
            <span>
              <span lang="ja">巻藁</span> <strong className="tabular-nums">{t.makiwara}</strong> 射
            </span>
          )}
          {e.durationMin && <span className="text-muted">{e.durationMin} 分</span>}
        </>
      );
    }
    case "exam":
      return (
        <>
          <span className={e.result === "pass" ? "font-semibold text-wood" : e.result === "fail" ? "text-vermilion" : "text-muted"}>{optLabel(EXAM_RESULT_OPTS, e.result)}</span>
          {e.marks.some(Boolean) && (
            <span className="text-lg leading-none">
              {e.marks.map((m, i) => (
                <MarkGlyph key={i} m={m} />
              ))}
            </span>
          )}
        </>
      );
    case "purchase":
      return (
        <>
          <span className="text-muted">{optLabel(EQUIP_CATEGORY_OPTS, e.category)}</span>
          {e.price != null && <strong className="tabular-nums">{money(e.price, e.currency)}</strong>}
          {e.shop && <span className="text-muted">{e.shop}</span>}
        </>
      );
    case "culture":
      return (
        <>
          <span className="text-muted">{optLabel(CULTURE_KIND_OPTS, e.kind)}</span>
          {e.place && <span className="text-muted">{e.place}</span>}
        </>
      );
    case "lesson":
      return (
        <>
          {e.teacher && <span className="text-muted">講師：{e.teacher}</span>}
          {e.keyPoints.length > 0 && <span className="text-muted">{e.keyPoints.length} 個重點</span>}
        </>
      );
    case "goal":
      return <span className="text-muted">目標日 {formatDay(e.date, true)}</span>;
  }
}

function details(e: Entry, gearName: (id: string) => string | undefined): ReactNode {
  switch (e.type) {
    case "practice": {
      const gear = e.equipmentIds.map(gearName).filter(Boolean);
      return (
        <>
          {e.kinds.length > 0 && <Row label="練習內容">{e.kinds.map((k) => optLabel(PRACTICE_KIND_OPTS, k)).join("、")}</Row>}
          {e.rounds.length > 0 && (
            <Row label="記錄表">
              <span className="flex flex-wrap gap-x-3 gap-y-1 text-lg leading-none">
                {e.rounds.map((r, i) => (
                  <span key={i} aria-label={`第${i + 1}組`}>
                    {r.map((m, j) => (
                      <MarkGlyph key={j} m={m} />
                    ))}
                  </span>
                ))}
              </span>
            </Row>
          )}
          {e.yadokoro.length > 0 && <Row label="矢所">{e.yadokoro.map((k) => optLabel(YADOKORO_OPTS, k)).join("、")}</Row>}
          {e.focusSteps.length > 0 && (
            <Row label="練習重點">
              <StepLinkList steps={e.focusSteps} />
            </Row>
          )}
          {(e.instructor || e.feedback) && (
            <Row label="指導">
              {e.instructor && <span className="text-muted">{e.instructor}：</span>}
              {e.feedback}
            </Row>
          )}
          {e.reflection && <Row label="自我反省">{e.reflection}</Row>}
          {(e.fatigue != null || e.painAreas.length > 0 || e.painNote) && (
            <Row label="身體">
              {[e.fatigue != null ? optLabel(FATIGUE_OPTS, String(e.fatigue)) : "", e.painAreas.length ? `不適：${e.painAreas.join("、")}` : "", e.painNote]
                .filter(Boolean)
                .join("｜")}
            </Row>
          )}
          {gear.length > 0 && <Row label="裝備">{gear.join("、")}</Row>}
        </>
      );
    }
    case "lesson":
      return (
        <>
          {e.place && <Row label="地點">{e.place}</Row>}
          {e.keyPoints.length > 0 && (
            <Row label="重點">
              <ol className="list-decimal space-y-0.5 pl-5 whitespace-normal">
                {e.keyPoints.map((k, i) => (
                  <li key={i} className="whitespace-pre-wrap">
                    {k}
                  </li>
                ))}
              </ol>
            </Row>
          )}
          {e.steps.length > 0 && (
            <Row label="射法八節">
              <StepLinkList steps={e.steps} />
            </Row>
          )}
          {e.homework && <Row label="作業">{e.homework}</Row>}
        </>
      );
    case "exam":
      return (
        <>
          {e.place && <Row label="會場">{e.place}</Row>}
          {e.questions.length > 0 && (
            <Row label="學科題目">
              <ol className="list-decimal space-y-0.5 pl-5 whitespace-normal">
                {e.questions.map((k, i) => (
                  <li key={i} className="whitespace-pre-wrap">
                    {k}
                  </li>
                ))}
              </ol>
            </Row>
          )}
          {e.judgeComments && <Row label="講評">{e.judgeComments}</Row>}
          {e.reflection && <Row label="反省">{e.reflection}</Row>}
        </>
      );
    case "purchase":
      return (
        <>
          <Row label="狀態">{optLabel(EQUIP_STATUS_OPTS, e.status)}</Row>
          {e.specs.map((s, i) => (
            <Row key={i} label={s.label || "規格"}>
              {s.value}
            </Row>
          ))}
        </>
      );
    case "culture":
      return e.link ? (
        <Row label="連結">
          <a href={e.link} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-wood underline">
            {e.link}
          </a>
        </Row>
      ) : null;
    case "goal":
      return null;
  }
}

export default function EntryCard({ e, onEdit, gearName }: { e: Entry; onEdit: (id: string) => void; gearName: (id: string) => string | undefined }) {
  const meta = TYPE_META[e.type];
  const faults = e.type === "practice" ? e.faults : [];
  const body = details(e, gearName);
  const hasBody = !!body || !!e.notes || e.tags.length > 0;
  const titleId = `entry-${e.id}`;

  return (
    <article aria-labelledby={titleId} className="relative rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <span aria-hidden="true" className={`absolute top-4 bottom-4 left-0 w-1 rounded-r ${meta.dot}`} />
      <header className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <TypeBadge type={e.type} />
            <time dateTime={e.date}>{formatDay(e.date)}</time>
            {isSample(e) && <SampleBadge />}
          </div>
          <h3 id={titleId} className="mt-1 text-lg leading-snug font-semibold break-words">
            {entryTitle(e)}
          </h3>
        </div>
        <button type="button" onClick={() => onEdit(e.id)} className="-mt-1 -mr-1 min-h-10 shrink-0 rounded-lg px-3 text-sm text-wood hover:bg-surface-2" aria-label={`編輯「${entryTitle(e)}」`}>
          編輯
        </button>
      </header>
      <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[15px]">{headline(e)}</p>
      {faults.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1" aria-label="射癖">
          {faults.map((f) => {
            const o = faultOpt(f);
            return (
              <li key={f}>
                <Chip ja={!!o?.ja && o.ja === o.label}>{o?.label ?? f}</Chip>
              </li>
            );
          })}
        </ul>
      )}
      {hasBody && (
        <details className="mt-2">
          <summary className="inline-flex min-h-9 items-center gap-1 text-sm text-wood">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3 w-3 fill-current">
              <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
            </svg>
            詳細內容
          </summary>
          <dl className="mt-2 space-y-1.5">
            {body}
            {e.notes && <Row label="備註">{e.notes}</Row>}
            {e.tags.length > 0 && <Row label="標籤">{e.tags.map((t) => `#${t}`).join(" ")}</Row>}
          </dl>
        </details>
      )}
    </article>
  );
}
