"use client";

// 矢尺・弓長計算器：輸入矢束（與選填的身高），並列各來源的建議範圍。不產生「官方唯一數字」。

import { useId, useState } from "react";
import { Cites, TagBadge } from "@/components/content/Blocks";
import {
  BOWS,
  DRAW_CHARTS,
  HEIGHT_CHARTS,
  HEIGHT_ESTIMATE_SRC,
  HEIGHT_ESTIMATES,
  MARGIN_RULES,
  matchBand,
  onBoundary,
  type BowChart,
  type BowId,
} from "@/content/equipment/calc";
import { SHOP } from "@/content/equipment/sources";

const YAZUKA_MIN = 55;
const YAZUKA_MAX = 115;
const HEIGHT_MIN = 120;
const HEIGHT_MAX = 210;

// Range chart axis: offsets from 矢束, in cm.
const AX_MIN = -3;
const AX_MAX = 17;
const pct = (v: number) => ((v - AX_MIN) / (AX_MAX - AX_MIN)) * 100;

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function parse(s: string, lo: number, hi: number): number | null {
  if (!s.trim()) return null;
  const v = Number(s);
  return Number.isFinite(v) && v >= lo && v <= hi ? v : null;
}

const bowName = (id: BowId) => BOWS.find((b) => b.id === id)?.name ?? id;

interface ChartResult {
  chart: BowChart;
  idx: number;
  bow: BowId | null;
  edge: boolean;
}

function evaluate(charts: BowChart[], v: number | null): ChartResult[] {
  if (v == null) return [];
  return charts.map((chart) => {
    const idx = matchBand(chart, v);
    return { chart, idx, bow: idx >= 0 ? chart.bands[idx].bow : null, edge: onBoundary(chart, v) };
  });
}

export default function YajakuCalculator() {
  const uid = useId();
  const [yazukaText, setYazukaText] = useState("");
  const [heightText, setHeightText] = useState("");
  const [estimated, setEstimated] = useState(false);

  const yazuka = parse(yazukaText, YAZUKA_MIN, YAZUKA_MAX);
  const height = parse(heightText, HEIGHT_MIN, HEIGHT_MAX);
  const yazukaBad = yazukaText.trim() !== "" && yazuka == null;
  const heightBad = heightText.trim() !== "" && height == null;

  const drawResults = evaluate(DRAW_CHARTS, yazuka);
  const heightResults = evaluate(HEIGHT_CHARTS, height);
  const drawBows = [...new Set(drawResults.map((r) => (r.bow ? bowName(r.bow) : "超出表格")))];

  const summary =
    yazuka == null
      ? "請輸入矢束（55〜115 cm）。"
      : `矢束 ${fmt(yazuka)} cm${estimated ? "（身高估算值）" : ""}：箭長必須長於 ${fmt(yazuka)} cm，全弓連底線 ${fmt(yazuka + 5)} cm 以上；` +
        `初學者常見建議 ${fmt(yazuka + 10)}〜${fmt(yazuka + 15)} cm。弓長依各店矢束表：${drawBows.join("、")}。`;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} aria-label="矢尺・弓長計算器">
        <div>
          <label htmlFor={`${uid}-yazuka`} className="block font-semibold">
            矢束（cm）
          </label>
          <input
            id={`${uid}-yazuka`}
            type="number"
            inputMode="decimal"
            min={YAZUKA_MIN}
            max={YAZUKA_MAX}
            step={0.5}
            value={yazukaText}
            onChange={(e) => {
              setYazukaText(e.target.value);
              setEstimated(false);
            }}
            placeholder="例如 85"
            aria-describedby={`${uid}-yazuka-hint`}
            aria-invalid={yazukaBad || undefined}
            className="mt-1 w-full rounded-xl border border-field-border bg-paper px-4 py-2.5 text-base text-ink placeholder:text-muted/80 focus:border-wood focus:outline-none"
          />
          <p id={`${uid}-yazuka-hint`} className={`mt-1 text-sm ${yazukaBad ? "text-vermilion" : "text-muted"}`}>
            {yazukaBad ? `請輸入 ${YAZUKA_MIN}〜${YAZUKA_MAX} 之間的數字。` : "喉嚨中心量到水平伸直的左手中指指尖（見上方示意圖）。"}
          </p>
        </div>
        <div>
          <label htmlFor={`${uid}-height`} className="block font-semibold">
            身高（cm，選填）
          </label>
          <input
            id={`${uid}-height`}
            type="number"
            inputMode="decimal"
            min={HEIGHT_MIN}
            max={HEIGHT_MAX}
            step={1}
            value={heightText}
            onChange={(e) => setHeightText(e.target.value)}
            placeholder="例如 170"
            aria-describedby={`${uid}-height-hint`}
            aria-invalid={heightBad || undefined}
            className="mt-1 w-full rounded-xl border border-field-border bg-paper px-4 py-2.5 text-base text-ink placeholder:text-muted/80 focus:border-wood focus:outline-none"
          />
          <p id={`${uid}-height-hint`} className={`mt-1 text-sm ${heightBad ? "text-vermilion" : "text-muted"}`}>
            {heightBad ? `請輸入 ${HEIGHT_MIN}〜${HEIGHT_MAX} 之間的數字。` : "只用來粗估，並對照依身高分級的表。"}
          </p>
        </div>
      </form>

      {height != null && (
        <div className="mt-4 rounded-xl border border-vermilion/40 bg-vermilion/5 p-4 text-[15px]">
          <p className="font-semibold">
            <TagBadge tag="folk" />
            身高粗估矢束——只能當起點
          </p>
          <ul className="mt-2 space-y-1">
            {HEIGHT_ESTIMATES.map((e) => (
              <li key={e.id}>
                {e.label} ≈ <strong>{fmt(Math.round(height * e.factor * 10) / 10)} cm</strong>
                <span className="ml-1 text-sm text-muted">（{e.note}）</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm leading-relaxed">
            兩種算法差了 {fmt(Math.round(height * 0.05 * 10) / 10)} cm。全弓連與《弓道教本》都說矢束由手臂長度決定，<strong>請實際量臂長</strong>。
            <Cites src={HEIGHT_ESTIMATE_SRC} />
          </p>
          {yazuka == null && (
            <button
              type="button"
              onClick={() => {
                setYazukaText(fmt(Math.round(height * 5) / 10));
                setEstimated(true);
              }}
              className="mt-3 rounded-full border border-wood bg-surface px-4 py-1.5 text-sm font-semibold text-wood hover:bg-wood-soft"
            >
              暫用 身高÷2（{fmt(Math.round(height * 5) / 10)} cm）試算
            </button>
          )}
        </div>
      )}

      <div aria-live="polite" className="mt-5 rounded-xl bg-surface-2 px-4 py-3 text-[15px] leading-relaxed">
        <TagBadge tag="note" />
        {summary}
      </div>

      {yazuka != null && (
        <>
          {estimated && (
            <p className="mt-3 rounded-lg bg-vermilion/10 px-3 py-2 text-sm text-vermilion">
              目前用的是身高估算的矢束，誤差可能接近 9 cm。實際買箭、買弓前請一定要量。
            </p>
          )}
          <ArrowLength yazuka={yazuka} />
          <BowLength yazuka={yazuka} height={height} drawResults={drawResults} heightResults={heightResults} />
        </>
      )}
    </div>
  );
}

/* ───────────── 矢尺 ───────────── */

function ArrowLength({ yazuka }: { yazuka: number }) {
  const ticks = [0, 5, 10, 15];
  return (
    <section aria-labelledby="calc-arrow" className="mt-6">
      <h3 id="calc-arrow" className="text-lg font-semibold">
        箭長（矢尺）：各來源並列
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        矢尺＝矢束＋安全餘量。下方每一條是一個來源的建議範圍；紅色區是「箭長 ≤ 矢束」，全弓連禁止在的前使用。
        沒有哪一條是「官方唯一數字」，最後請和指導者確認。
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-indigo/30 bg-indigo/5 px-4 py-3">
          <p className="text-sm text-muted">
            <TagBadge tag="official" />
            全弓連底線
          </p>
          <p className="mt-1 text-2xl font-bold">
            {fmt(yazuka + 5)} cm <span className="text-base font-normal">以上</span>
          </p>
          <p className="text-xs text-muted">比矢束長 5 cm 以上；≤ {fmt(yazuka)} cm 禁止用於的前</p>
        </div>
        <div className="rounded-xl border border-wood/40 bg-wood-soft/40 px-4 py-3">
          <p className="text-sm text-muted">
            <TagBadge tag="note" />
            初學者常見建議
          </p>
          <p className="mt-1 text-2xl font-bold">
            {fmt(yazuka + 10)}〜{fmt(yazuka + 15)} cm
          </p>
          <p className="text-xs text-muted">全弓連初學者約 +10；弓具店 +10〜15（本站整理的區間）</p>
        </div>
      </div>

      <div className="mt-5">
        {/* axis */}
        <div className="sm:grid sm:grid-cols-[13rem_1fr] sm:gap-3">
          <div className="hidden sm:block" />
          <div className="relative h-6 text-[11px] text-muted" aria-hidden="true">
            {ticks.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${pct(t)}%` }}>
                {t === 0 ? `${fmt(yazuka)}` : `+${t}`}
              </span>
            ))}
          </div>
        </div>
        <ul className="space-y-3">
          {MARGIN_RULES.map((r) => {
            const lo = yazuka + r.min;
            const hi = r.max != null ? yazuka + r.max : null;
            const range = r.approx ? `約 ${fmt(lo)} cm` : hi == null ? `${fmt(lo)} cm 以上` : `${fmt(lo)}〜${fmt(hi)} cm`;
            const plus = r.approx ? `約 +${r.min}` : r.max == null ? `+${r.min} 以上` : `+${r.min}〜${r.max}`;
            const left = pct(r.min);
            const right = r.max != null ? pct(r.max) : 100;
            return (
              <li key={r.id} className="sm:grid sm:grid-cols-[13rem_1fr] sm:items-start sm:gap-3">
                <div className="text-sm leading-snug">
                  <TagBadge tag={r.tag} />
                  <span className="font-semibold">{r.who}</span>
                  <span className="text-muted">・{r.scope}</span>
                  <div className="mt-0.5">
                    <strong>{range}</strong> <span className="text-xs text-muted">（{plus}）</span>
                  </div>
                </div>
                <div className="mt-1.5 sm:mt-1">
                  <div className="relative h-4 rounded-full bg-surface-2" aria-hidden="true">
                    <div className="absolute inset-y-0 left-0 rounded-l-full bg-vermilion/25" style={{ width: `${pct(0)}%` }} />
                    <div className="absolute inset-y-[-3px] w-px bg-indigo/60" style={{ left: `${pct(5)}%` }} />
                    {r.approx ? (
                      <div
                        className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface ${r.tag === "official" ? "bg-indigo" : "bg-wood"}`}
                        style={{ left: `${left}%` }}
                      />
                    ) : (
                      <div
                        className={`absolute inset-y-0 rounded-full ${
                          r.max == null
                            ? "rounded-r-none bg-linear-to-r from-indigo/70 to-indigo/5"
                            : r.tag === "official"
                              ? "bg-indigo/70"
                              : r.tag === "disputed"
                                ? "bg-vermilion/50"
                                : "bg-wood/70"
                        }`}
                        style={{ left: `${left}%`, width: `${Math.max(right - left, 1.5)}%` }}
                      />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {r.note}
                    <Cites src={r.src} />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted">直線標記：全弓連底線（+5 cm）。紅色區：箭長 ≤ 矢束。</p>
      </div>

      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed">
        <li>箭也不是越長越好：太長會飛得差。熟練後才可能縮短（翠山說高段者約 +5〜6）。</li>
        <li>買箭時問清楚店家的箭長含不含箭頭（平安弓具標示不含，含箭頭再多約 1 cm）。箭依長度切割，通常不能退換。</li>
      </ul>
    </section>
  );
}

/* ───────────── 弓長 ───────────── */

function ResultChips({ results, basisLabel }: { results: ChartResult[]; basisLabel: string }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {results.map((r) => (
        <li key={r.chart.id} className="rounded-xl border border-line bg-paper px-3 py-2 text-sm">
          <span className="text-muted">
            {r.chart.who}（{r.chart.basis === "引き尺" ? "引き尺" : basisLabel}）
          </span>
          <span className="ml-1.5 font-bold">{r.bow ? bowName(r.bow) : "超出此表範圍"}</span>
          {r.edge && <span className="ml-1.5 text-xs text-vermilion">剛好在分界</span>}
        </li>
      ))}
    </ul>
  );
}

function BowLength({
  yazuka,
  height,
  drawResults,
  heightResults,
}: {
  yazuka: number;
  height: number | null;
  drawResults: ChartResult[];
  heightResults: ChartResult[];
}) {
  const distinct = new Set(drawResults.map((r) => r.bow ?? "none"));
  const anyEdge = drawResults.some((r) => r.edge);
  const charts = [...DRAW_CHARTS, ...HEIGHT_CHARTS];
  const hit = new Map<string, number>();
  for (const r of drawResults) hit.set(r.chart.id, r.idx);
  for (const r of heightResults) hit.set(r.chart.id, r.idx);

  return (
    <section aria-labelledby="calc-bow" className="mt-8">
      <h3 id="calc-bow" className="text-lg font-semibold">
        弓長：各店對照表並列
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        <TagBadge tag="official" />
        規則只說以 221 cm（並寸）為標準、允許若干長短，沒有對照表。下面全部是弓具店、弓師、業界團體的建議，分界各不相同。
      </p>

      <div className="mt-3">
        <p className="mb-1.5 text-sm font-semibold">依你的矢束 {fmt(yazuka)} cm</p>
        <ResultChips results={drawResults} basisLabel="矢束" />
      </div>
      {height != null && (
        <div className="mt-3">
          <p className="mb-1.5 text-sm font-semibold">依身高 {fmt(height)} cm（只供參考）</p>
          <ResultChips results={heightResults} basisLabel="身高" />
        </div>
      )}

      {(distinct.size > 1 || anyEdge) && (
        <p className="mt-3 rounded-lg bg-vermilion/10 px-3 py-2 text-sm leading-relaxed text-vermilion">
          <TagBadge tag="disputed" />
          {distinct.size > 1 ? "各店的結果不一致——你的矢束落在各店分界不同的地方。" : "你的矢束剛好在某些表的分界上。"}
          請實際試拉、並請教指導者或購買的店家。不可以選比自己拉距短的弓。
        </p>
      )}

      <div role="region" aria-label="弓長對照表" tabIndex={0} className="relative mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
          <caption className="sr-only">弓長對照表：各店依矢束、引き尺或身高分級（單位 cm），符合你輸入值的格子會標出</caption>
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">
                弓
              </th>
              {charts.map((c) => (
                <th key={c.id} scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">
                  {c.who}
                  <span className="block text-xs font-normal text-muted">{c.basis}</span>
                </th>
              ))}
              <th scope="col" className="px-3 py-2 font-semibold">
                小山
                <span className="block text-xs font-normal text-muted">弓力標示的拉距</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {BOWS.map((b) => (
              <tr key={b.id} className="border-t border-line">
                <th scope="row" className="px-3 py-2 font-medium whitespace-nowrap">
                  <span lang="ja">{b.name}</span>
                  <span className="block text-xs font-normal text-muted">
                    {b.shaku}・{b.cm}
                  </span>
                </th>
                {charts.map((c) => {
                  const i = c.bands.findIndex((band) => band.bow === b.id);
                  const on = i >= 0 && hit.get(c.id) === i;
                  return (
                    <td key={c.id} className={`px-3 py-2 ${on ? "bg-wood-soft font-bold text-ink ring-2 ring-wood ring-inset" : ""}`}>
                      {i >= 0 ? c.bands[i].label : <span className="text-muted">—</span>}
                      {on && <span className="sr-only">（符合）</span>}
                    </td>
                  );
                })}
                <td className="px-3 py-2">{b.ratedDraw ? `${b.ratedDraw} 引き` : <span className="text-muted">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted">
        {charts.map((c) => (
          <li key={c.id}>
            <TagBadge tag={c.tag} />
            {c.who}（{c.basis}）{c.note ? `：${c.note}` : ""}
            <Cites src={c.src} />
          </li>
        ))}
        <li>
          <TagBadge tag="shop" />
          小山弓具的弓力是在「七尺・並寸 85 cm、二寸伸 90 cm、四寸伸 95 cm、六寸伸 100 cm」拉距下標示；拉得比這短，實際負荷會比標示輕。
          <Cites src={[SHOP.koyamaCarbon, SHOP.koyamaSeiho]} />
        </li>
      </ul>
    </section>
  );
}
