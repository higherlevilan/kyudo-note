"use client";

// 初學者全套預算試算：小山弓具 2026-10-17 標價為預設，日幣合計＋台幣換算（匯率可改）。

import { useId, useMemo, useState } from "react";
import { Cites, TagBadge } from "@/components/content/Blocks";
import { BUDGET_ITEMS, type BudgetItem } from "@/content/equipment/budget";
import { BOT, DEFAULT_RATE, PRICE_DATE } from "@/content/equipment/sources";

type Sel = Record<string, { opt: number; qty: number }>;
type PresetKey = "min" | "std" | "none";

function fromPreset(p: PresetKey): Sel {
  const s: Sel = {};
  for (const it of BUDGET_ITEMS) {
    const [opt, qty] = p === "none" ? [0, 0] : it.presets[p];
    s[it.id] = { opt, qty };
  }
  return s;
}

function sameSel(a: Sel, b: Sel) {
  return BUDGET_ITEMS.every((it) => a[it.id].qty === b[it.id].qty && (a[it.id].qty === 0 || a[it.id].opt === b[it.id].opt));
}

const yen = (n: number) => `¥${n.toLocaleString("en-US")}`;
const twd = (n: number) => `NT$${n.toLocaleString("en-US")}`;

const PRESETS: { key: PresetKey; label: string; hint: string }[] = [
  { key: "min", label: "最低限", hint: "グラス弓＋鋁箭＋控え無し三ツカケ＋道衣袴" },
  { key: "std", label: "標準", hint: "直心Ⅰ＋鋁箭＋中唐三ツカケ＋矢筒、工具等" },
  { key: "none", label: "全部清空", hint: "從零自己挑" },
];

export default function BudgetBuilder() {
  const uid = useId();
  const [sel, setSel] = useState<Sel>(() => fromPreset("min"));
  const [rateText, setRateText] = useState(String(DEFAULT_RATE));

  const rate = Number(rateText);
  const rateOk = Number.isFinite(rate) && rate > 0 && rate < 10;

  const total = useMemo(() => BUDGET_ITEMS.reduce((sum, it) => sum + it.options[sel[it.id].opt].price * sel[it.id].qty, 0), [sel]);
  const totalTwd = rateOk ? Math.round(total * rate) : null;
  const active = PRESETS.find((p) => sameSel(sel, fromPreset(p.key)))?.key;

  const update = (id: string, patch: Partial<{ opt: number; qty: number }>) => setSel((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <div role="group" aria-label="套組預設" className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-pressed={active === p.key}
            onClick={() => setSel(fromPreset(p.key))}
            className={`rounded-xl border px-3 py-2 text-left text-sm motion-safe:transition-colors ${
              active === p.key ? "border-ink bg-ink text-paper" : "border-field-border bg-paper text-ink hover:bg-surface-2"
            }`}
          >
            <span className="block font-semibold">{p.label}</span>
            <span className={`block text-xs ${active === p.key ? "opacity-80" : "text-muted"}`}>{p.hint}</span>
          </button>
        ))}
      </div>

      <ul className="mt-5 divide-y divide-line rounded-xl border border-line">
        {BUDGET_ITEMS.map((it) => (
          <ItemRow key={it.id} it={it} uid={uid} value={sel[it.id]} onChange={(p) => update(it.id, p)} />
        ))}
      </ul>

      <div className="mt-5 grid gap-4 rounded-xl bg-surface-2 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div aria-live="polite">
          <p className="text-sm text-muted">合計（日幣含消費稅，不含運費與進口稅費）</p>
          <p className="text-3xl font-bold tabular-nums">
            <output htmlFor={`${uid}-rate`}>{yen(total)}</output>
          </p>
          <p className="mt-1 text-lg tabular-nums">
            約 <output>{totalTwd != null ? twd(totalTwd) : "—"}</output>
          </p>
        </div>
        <div>
          <label htmlFor={`${uid}-rate`} className="block text-sm font-semibold">
            匯率（1 日圓＝? 台幣）
          </label>
          <input
            id={`${uid}-rate`}
            type="number"
            inputMode="decimal"
            step={0.0001}
            min={0}
            value={rateText}
            onChange={(e) => setRateText(e.target.value)}
            aria-describedby={`${uid}-rate-hint`}
            aria-invalid={!rateOk || undefined}
            className="mt-1 w-full rounded-xl border border-field-border bg-paper px-3 py-2 text-base tabular-nums text-ink focus:border-wood focus:outline-none sm:w-40"
          />
          <p id={`${uid}-rate-hint`} className={`mt-1 max-w-xs text-xs ${rateOk ? "text-muted" : "text-vermilion"}`}>
            {rateOk ? `預設 ${DEFAULT_RATE}：臺灣銀行 ${PRICE_DATE} 日圓現金賣出。` : "請輸入有效的匯率。"}
            <Cites src={[BOT]} />
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        <TagBadge tag="note" />
        價格是小山弓具網路商店 {PRICE_DATE} 的含稅標價（本站試算、同一家店方便比較），會隨時間、弓力與選配變動；購買前請以店家當下標價為準。
        最低限參考值 ¥86,080、標準 ¥123,950。
      </p>
    </div>
  );
}

function ItemRow({
  it,
  uid,
  value,
  onChange,
}: {
  it: BudgetItem;
  uid: string;
  value: { opt: number; qty: number };
  onChange: (p: Partial<{ opt: number; qty: number }>) => void;
}) {
  const opt = it.options[value.opt];
  const sub = opt.price * value.qty;
  const selId = `${uid}-${it.id}-opt`;
  const qtyId = `${uid}-${it.id}-qty`;
  const off = value.qty === 0;

  return (
    <li className={`p-3 sm:p-4 ${off ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1 basis-56">
          <p className="font-semibold">
            {it.ja ? <span lang="ja">{it.label}</span> : it.label}
          </p>
          {it.options.length > 1 ? (
            <>
              <label htmlFor={selId} className="sr-only">
                {it.label}：選擇品項
              </label>
              <select
                id={selId}
                value={value.opt}
                onChange={(e) => onChange({ opt: Number(e.target.value) })}
                className="mt-1 w-full max-w-full rounded-lg border border-field-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-wood focus:outline-none"
              >
                {it.options.map((o, i) => (
                  <option key={o.name} value={i}>
                    {o.name}・{yen(o.price)}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <p className="text-sm text-muted">
              {opt.name}・{yen(opt.price)}
            </p>
          )}
          {it.note && <p className="mt-1 text-xs text-muted">{it.note}</p>}
          <p className="text-xs">
            <Cites src={[it.src]} />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-field-border bg-paper" role="group" aria-label={`${it.label} 數量`}>
            <button
              type="button"
              onClick={() => onChange({ qty: Math.max(0, value.qty - 1) })}
              disabled={value.qty === 0}
              aria-label={`減少${it.label}`}
              className="h-9 w-9 text-lg text-ink disabled:opacity-30"
            >
              −
            </button>
            <label htmlFor={qtyId} className="sr-only">
              {it.label} 數量
            </label>
            <input
              id={qtyId}
              type="number"
              inputMode="numeric"
              min={0}
              max={it.maxQty}
              value={value.qty}
              onChange={(e) => {
                const n = Math.round(Number(e.target.value));
                onChange({ qty: Number.isFinite(n) ? Math.min(it.maxQty, Math.max(0, n)) : 0 });
              }}
              className="h-9 w-10 border-x border-field-border bg-transparent text-center text-base tabular-nums text-ink [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => onChange({ qty: Math.min(it.maxQty, value.qty + 1) })}
              disabled={value.qty >= it.maxQty}
              aria-label={`增加${it.label}`}
              className="h-9 w-9 text-lg text-ink disabled:opacity-30"
            >
              ＋
            </button>
          </div>
          <span className="w-24 text-right font-semibold tabular-nums">{off ? <span className="text-muted">—</span> : yen(sub)}</span>
        </div>
      </div>
    </li>
  );
}
