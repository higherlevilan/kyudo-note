// Small presentational pieces for the /culture page. Server components.

import type { ReactNode } from "react";
import { Cites, PointList, TagBadge } from "@/components/content/Blocks";
import { SHOOTING_TYPES } from "@/content/culture/lineage";
import {
  QUICK_HISTORY,
  SHAGI_DEEP,
  SHAGI_ROWS,
  SHAGI_SRC,
  SHAHOKUN,
  SHINZENBI,
  SHINZENBI_NOTE,
  SHINZENBI_SRC,
  TW_COLONIAL,
  TW_COLONIAL_DEEP,
  ZEN_FACTS,
  ZEN_FLOW,
} from "@/content/culture/sections";

function Chev() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current text-wood">
      <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
    </svg>
  );
}

/** A collapsed 深入 layer, styled like LayeredCard's. */
export function Deep({ title = "深入", children }: { title?: string; children: ReactNode }) {
  return (
    <details className="mt-3 border-t border-line pt-3">
      <summary className="flex items-center gap-1.5 text-sm font-semibold text-wood">
        <Chev />
        {title}
      </summary>
      <div className="mt-3 text-[15px]">{children}</div>
    </details>
  );
}

/** 3 分鐘歷史：六個停靠站。 */
export function QuickHistory() {
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <h3 className="text-xl font-semibold">三分鐘看懂弓道史</h3>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_HISTORY.map((q, i) => (
          <li key={q.title} className="relative rounded-xl border border-line bg-surface-2/50 p-4">
            <p className="flex items-baseline gap-2">
              <span aria-hidden="true" className="font-jp text-2xl leading-none text-wood/70">
                {"一二三四五六"[i]}
              </span>
              <span className="text-xs text-muted">{q.when}</span>
            </p>
            <p className="mt-1.5 font-bold">{q.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {q.text}
              <Cites src={q.src} />
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted">想看每個時代的細節，可以往下使用互動年表，或展開各個歷史專題。</p>
    </article>
  );
}

/** 真・善・美 */
export function ShinZenBi() {
  return (
    <article id="shinzenbi" className="scroll-mt-20 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl font-semibold">真・善・美</h3>
        <span lang="ja" className="text-sm text-muted">
          しん・ぜん・び
        </span>
      </header>
      <p className="mt-3 text-[15px] leading-relaxed">
        全弓連把「真善美」當作弓道的最高目標，國際弓道連盟也以它為宗旨。三個字各有說明：
        <Cites src={SHINZENBI_SRC} />
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {SHINZENBI.map((s) => (
          <li key={s.char} className="rounded-xl border border-line bg-surface-2/50 p-4 text-center sm:text-left">
            <p className="flex items-baseline justify-center gap-2 sm:justify-start">
              <span lang="ja" className="text-4xl leading-none font-semibold text-wood">
                {s.char}
              </span>
              <span lang="ja" className="text-xs text-muted">
                {s.kana}
              </span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{s.text}</p>
          </li>
        ))}
      </ul>
      <Deep>
        <PointList points={[SHINZENBI_NOTE]} />
      </Deep>
    </article>
  );
}

/** 《禮記・射義》原文＋逐句白話 */
export function Shagi() {
  return (
    <article id="shagi" className="scroll-mt-20 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl font-semibold">《禮記・射義》</h3>
        <span lang="ja" className="text-sm text-muted">
          礼記射義（らいきしゃぎ）
        </span>
      </header>
      <p className="mt-3 text-[15px] leading-relaxed">
        《禮記》第四十六篇〈射義〉是現行《弓道教本》開頭引用的經典，很多道場也把它掛在牆上。核心只有一句話：射不中，先從自己身上找原因。
        <Cites src={SHAGI_SRC} />
      </p>
      <blockquote className="mt-4 rounded-xl border-l-4 border-wood bg-wood-soft/30 px-4 py-3 text-[17px] leading-loose">
        <p>故射者，進退周還必中禮。內志正，外體直，然後持弓矢審固；持弓矢審固，然後可以言中。此可以觀德行矣。</p>
        <p className="mt-2">射者，仁之道也。射求正諸己，己正而後發。發而不中，則不怨勝己者，反求諸己而已矣。</p>
      </blockquote>

      <h4 className="mt-5 mb-2 text-sm font-bold text-muted">逐句白話</h4>
      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">《禮記・射義》逐句原文、常見日文訓讀與中文白話</caption>
          <thead className="hidden bg-surface-2 text-xs text-muted sm:table-header-group">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">
                原文
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                常見日文訓讀
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                白話
              </th>
            </tr>
          </thead>
          <tbody>
            {SHAGI_ROWS.map((r) => (
              <tr key={r.zh} className="block border-t border-line first:border-t-0 sm:table-row">
                <th scope="row" className="block px-3 pt-2.5 text-[15px] font-semibold sm:table-cell sm:py-2.5 sm:align-top">
                  {r.zh}
                </th>
                <td lang="ja" className="block px-3 pt-0.5 text-xs text-muted sm:table-cell sm:py-2.5 sm:align-top sm:text-sm">
                  {r.ja}
                </td>
                <td className="block px-3 pt-1 pb-2.5 leading-relaxed sm:table-cell sm:py-2.5 sm:align-top">{r.plain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Deep title="深入：版本差異與同源文獻">
        <PointList points={SHAGI_DEEP} />
      </Deep>
    </article>
  );
}

/** 《射法訓》 */
export function Shahokun() {
  return (
    <article id="shahokun" className="scroll-mt-20 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl font-semibold">《射法訓》</h3>
        <span lang="ja" className="text-sm text-muted">
          射法訓（しゃほうくん）
        </span>
      </header>
      <p className="mt-3 text-[15px] leading-relaxed">
        江戶時代紀州藩吉見順正留下的射法教訓，常與〈射義〉並列。它講的是身體：用骨骼而不是用手臂射，左右平衡地分開。中文大意：
        <Cites src={SHAHOKUN.src} />
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed">
        {SHAHOKUN.plain.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>
      <Deep title="深入：日文原文與出處">
        <blockquote lang="ja" className="mb-4 rounded-xl border-l-4 border-wood bg-wood-soft/30 px-4 py-3 text-[15px] leading-loose">
          {SHAHOKUN.ja}
        </blockquote>
        <PointList points={SHAHOKUN.deep} />
      </Deep>
    </article>
  );
}

/** 《弓與禪》基本事實 */
export function ZenFacts() {
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <h3 className="text-xl font-semibold">《弓與禪》是怎樣的一本書</h3>
      <dl className="mt-4 divide-y divide-line text-[15px]">
        {ZEN_FACTS.map((f) => (
          <div key={f.k} className="grid gap-1 py-2.5 sm:grid-cols-[6em_1fr] sm:gap-3">
            <dt className="font-semibold text-muted">{f.k}</dt>
            <dd className="leading-relaxed">
              {f.v}
              <Cites src={f.src} />
            </dd>
          </div>
        ))}
      </dl>
      <h4 className="mt-5 mb-2 text-sm font-bold text-muted">一段話如何走到全世界</h4>
      <ol aria-label="從阿波研造到日譯本的資訊流程" className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
        {ZEN_FLOW.map((s, i) => (
          <li key={s.who} className="flex items-center gap-2 sm:basis-[calc(33.333%_-_0.5rem)]">
            <div className="flex-1 rounded-xl border border-line bg-surface-2/50 px-3 py-2">
              <p className="text-sm font-bold">{s.who}</p>
              <p className="text-xs leading-relaxed text-muted">{s.what}</p>
            </div>
            {i < ZEN_FLOW.length - 1 && (
              <span aria-hidden="true" className="shrink-0 text-wood max-sm:hidden">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-muted">
        依山田奨治（2001）整理。
        <Cites src={[ZEN_FACTS[0].src[0]]} />
      </p>
    </article>
  );
}

/** 射的分類 */
export function ShootingTypes() {
  const t = SHOOTING_TYPES;
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <h3 className="text-xl font-semibold">射的分類：禮射與武射</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        教學上常把日本弓術分成兩大類。這是簡化：小笠原流也有騎射等武技，日置流也有禮法。
        <Cites src={t.src} />
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-[1fr_2fr]">
        <li className="rounded-xl border border-line bg-surface-2/50 p-4">
          <p>
            <span lang="ja" className="font-bold">
              {t.reisha.name}
            </span>
            <span lang="ja" className="ml-2 text-xs text-muted">
              {t.reisha.kana}
            </span>
          </p>
          <p className="mt-1 text-sm leading-relaxed">{t.reisha.text}</p>
        </li>
        <li className="rounded-xl border border-line bg-surface-2/50 p-4">
          <p>
            <span lang="ja" className="font-bold">
              {t.busha.name}
            </span>
            <span lang="ja" className="ml-2 text-xs text-muted">
              {t.busha.kana}
            </span>
          </p>
          <p className="mt-1 text-sm leading-relaxed">{t.busha.text}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {t.busha.children.map((c) => (
              <li key={c.name} className="rounded-lg border border-line bg-surface p-3">
                <p>
                  <span lang="ja" className="font-semibold">
                    {c.name}
                  </span>
                  <span lang="ja" className="ml-1.5 text-xs text-muted">
                    {c.kana}
                  </span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{c.text}</p>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </article>
  );
}

/** 日治時期台灣弓道 */
export function TwColonial() {
  return (
    <article id="tw-colonial" className="scroll-mt-20 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl font-semibold">日治時期（1895–1945）</h3>
        <TagBadge tag="research" />
      </header>
      <p className="mt-3 text-[15px] leading-relaxed">
        弓道在日治時期就已傳入台灣。目前最系統的研究是五賀友繼、洪子甯、松尾牧則 2022 年的論文，以《台灣日日新報》與各團體機關誌為史料。
        <Cites src={TW_COLONIAL[0].src} />
      </p>
      <ol className="mt-4 ml-1.5 border-l-2 border-indigo/40">
        {TW_COLONIAL.map((t) => (
          <li key={t.when} className="relative pb-4 pl-5 last:pb-0">
            <span aria-hidden="true" className="absolute top-1.5 -left-[7px] h-3 w-3 rounded-full bg-indigo" />
            <p className="font-semibold text-indigo tabular-nums">{t.when}</p>
            <p className="mt-0.5 text-[15px] leading-relaxed">{t.text}</p>
          </li>
        ))}
      </ol>
      <Deep title="深入：分布、學校與戰後">
        <PointList points={TW_COLONIAL_DEEP} />
      </Deep>
    </article>
  );
}
