"use client";

// 費用試算: an editable annual cost estimate in TWD. Defaults come from src/content/guide/cost.ts.

import { useId, useMemo, useState } from "react";
import { Cites } from "@/components/content/Blocks";
import type { CostItem } from "@/content/guide/cost";

// Inputs keep the raw text the user typed (like BudgetBuilder) so an empty or half-typed box
// is not silently rewritten to 0.
type Row = { on: boolean; price: string; qty: string };

const GROUPS: CostItem["group"][] = ["協會與課程", "場地", "審查", "消耗品與弓具"];
const GROUP_COLOR: Record<CostItem["group"], string> = {
  協會與課程: "bg-wood",
  場地: "bg-indigo",
  審查: "bg-vermilion",
  消耗品與弓具: "bg-muted",
};

const ntd = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 });

function initial(items: readonly CostItem[]): Record<string, Row> {
  return Object.fromEntries(items.map((it) => [it.id, { on: it.on, price: String(it.price), qty: String(it.qty) }]));
}

/** Parse an amount box: empty counts as 0; anything else must be a finite, non-negative number. */
function amount(v: string): number | null {
  if (v.trim() === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function CostEstimator({ items, defaultRate, checkedOn }: { items: readonly CostItem[]; defaultRate: number; checkedOn: string }) {
  const uid = useId();
  const [rows, setRows] = useState<Record<string, Row>>(() => initial(items));
  const [rateText, setRateText] = useState(String(defaultRate));
  const rate = rateText.trim() === "" ? NaN : Number(rateText);
  const rateOk = Number.isFinite(rate) && rate > 0 && rate < 10;

  const set = (id: string, patch: Partial<Row>) => setRows((r) => ({ ...r, [id]: { ...r[id], ...patch } }));

  const calc = useMemo(() => {
    // null = cannot be computed (an invalid number, or a JPY item without a valid rate).
    const sub: Record<string, number | null> = {};
    const byGroup: Record<string, number> = {};
    let first = 0;
    let later = 0;
    let complete = true;
    for (const it of items) {
      const r = rows[it.id];
      if (!r.on) {
        sub[it.id] = 0;
        continue;
      }
      const price = amount(r.price);
      const qty = amount(r.qty);
      const fx = it.currency === "JPY" ? (rateOk ? rate : null) : 1;
      const twd = price == null || qty == null || fx == null ? null : price * qty * fx;
      sub[it.id] = twd;
      if (twd == null) {
        complete = false;
        continue;
      }
      byGroup[it.group] = (byGroup[it.group] ?? 0) + twd;
      first += twd;
      if (!it.once) later += twd;
    }
    return { sub, byGroup, first, later, complete };
  }, [items, rows, rate, rateOk]);

  const inputCls =
    "rounded-lg border border-field-border bg-paper px-2.5 py-1.5 text-right text-base tabular-nums text-ink focus:border-wood focus:outline-none aria-[invalid=true]:border-vermilion";
  const total = (n: number) => (calc.complete ? `NT$${ntd.format(n)}` : "—");

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      {/* summary */}
      <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-xl bg-surface-2 p-4">
          <p className="text-sm text-muted">第一年估計</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{total(calc.first)}</p>
        </div>
        <div className="rounded-xl bg-surface-2 p-4">
          <p className="text-sm text-muted">第二年起每年（同樣設定、扣掉一次性項目）</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{total(calc.later)}</p>
        </div>
      </div>
      {!calc.complete && <p className="mt-2 text-sm text-vermilion">有欄位不是有效的數字，請修正標示紅框的欄位後再看合計。</p>}

      {calc.complete && calc.first > 0 && (
        <div className="mt-4">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
            {GROUPS.map((g) =>
              calc.byGroup[g] ? <span key={g} className={GROUP_COLOR[g]} style={{ width: `${(calc.byGroup[g] / calc.first) * 100}%` }} /> : null,
            )}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {GROUPS.map((g) => (
              <li key={g} className="flex items-center gap-1.5">
                <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-sm ${GROUP_COLOR[g]}`} />
                {g} NT${ntd.format(calc.byGroup[g] ?? 0)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-line pt-4">
        <label htmlFor={`${uid}-rate`} className="text-sm">
          匯率：1 日圓換多少新臺幣
          <span id={`${uid}-rate-hint`} className={`block text-xs ${rateOk ? "text-muted" : "text-vermilion"}`}>
            {rateOk ? `預設：臺灣銀行 ${checkedOn} 現金賣出` : "請輸入有效的匯率（大於 0 的數字）。"}
          </span>
        </label>
        <input
          id={`${uid}-rate`}
          type="number"
          inputMode="decimal"
          min={0}
          step={0.0001}
          value={rateText}
          onChange={(e) => setRateText(e.target.value)}
          aria-invalid={!rateOk || undefined}
          aria-describedby={`${uid}-rate-hint`}
          className={`${inputCls} w-28`}
        />
        <button
          type="button"
          onClick={() => {
            setRows(initial(items));
            setRateText(String(defaultRate));
          }}
          className="ml-auto rounded-full border border-field-border bg-paper px-4 py-1.5 text-sm hover:bg-surface-2"
        >
          恢復預設值
        </button>
      </div>

      {GROUPS.map((g) => (
        <fieldset key={g} className="mt-5">
          <legend className="mb-2 flex items-center gap-2 text-sm font-bold text-muted">
            <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-sm ${GROUP_COLOR[g]}`} />
            {g}
          </legend>
          <ul className="space-y-2.5">
            {items
              .filter((it) => it.group === g)
              .map((it) => {
                const r = rows[it.id];
                const id = `${uid}-${it.id}`;
                const sym = it.currency === "JPY" ? "¥" : "NT$";
                const priceBad = amount(r.price) == null;
                const qtyBad = amount(r.qty) == null;
                const sub = calc.sub[it.id];
                return (
                  <li key={it.id} className={`rounded-xl border p-3 transition-colors motion-reduce:transition-none ${r.on ? "border-wood/40 bg-paper" : "border-line bg-surface opacity-80"}`}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <label htmlFor={`${id}-on`} className="flex min-w-0 flex-1 basis-56 cursor-pointer items-start gap-2">
                        <input
                          id={`${id}-on`}
                          type="checkbox"
                          checked={r.on}
                          onChange={(e) => set(it.id, { on: e.target.checked })}
                          className="mt-1 h-4 w-4 shrink-0 accent-[var(--wood)]"
                        />
                        <span className="font-semibold">
                          {it.label}
                          {it.once && <span className="ml-1.5 rounded border border-line px-1 py-px text-[11px] font-normal text-muted">一次性</span>}
                        </span>
                      </label>
                      <div className="flex items-center gap-1.5 text-sm">
                        <label htmlFor={`${id}-price`} className="sr-only">
                          {it.label} 單價（{it.currency === "JPY" ? "日圓" : "新臺幣"}）
                        </label>
                        <span className="text-muted">{sym}</span>
                        <input
                          id={`${id}-price`}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={r.price}
                          onChange={(e) => set(it.id, { price: e.target.value })}
                          aria-invalid={priceBad || undefined}
                          className={`${inputCls} w-24`}
                        />
                        <span aria-hidden="true" className="text-muted">
                          ×
                        </span>
                        <label htmlFor={`${id}-qty`} className="sr-only">
                          {it.label} 數量（{it.unit}）
                        </label>
                        <input
                          id={`${id}-qty`}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={r.qty}
                          onChange={(e) => set(it.id, { qty: e.target.value })}
                          aria-invalid={qtyBad || undefined}
                          className={`${inputCls} w-16`}
                        />
                        <span className="whitespace-nowrap text-muted">{it.unit}</span>
                      </div>
                      <p className="w-full text-right text-sm font-semibold tabular-nums sm:w-28">= {sub == null ? "—" : `NT$${ntd.format(sub)}`}</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      {it.note}
                      <Cites src={it.src} />
                    </p>
                  </li>
                );
              })}
          </ul>
        </fieldset>
      ))}

      <div className="mt-5 rounded-xl bg-surface-2 p-3 text-xs leading-relaxed text-muted">
        <p className="font-semibold text-ink">試算前提</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          <li>台幣項目是臺灣弓道協會公布的價格；日圓項目是全弓連別表或小山弓具網路商店標價（含稅），查詢日期 {checkedOn}。</li>
          <li>日圓品項不含國際運費、台灣進口稅費與代購手續費；實際價格以店家為準。</li>
          <li>沒有算進交通、赴日審查的旅費、協會審查手續費（未公開），以及服裝、弓具的損耗速度（因人而異）。</li>
          <li>這是方便規劃的估算，不是報價；價格會變，報名前請向協會或店家確認。</li>
        </ul>
      </div>
    </div>
  );
}
