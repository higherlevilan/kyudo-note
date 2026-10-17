"use client";

import { useMemo } from "react";
import { formatDay, shortDay } from "@/lib/journal/date";
import { EQUIP_CATEGORY_OPTS, EQUIP_STATUS_OPTS, optLabel } from "@/lib/journal/options";
import { isSample } from "@/lib/journal/sample";
import { equipmentSpend, inventory, isPractice } from "@/lib/journal/stats";
import type { Entry, PurchaseEntry } from "@/lib/journal/types";
import { money } from "./EntryCard";
import { btn, cardCls, SampleBadge } from "./ui";

const STATUS_STYLE: Record<PurchaseEntry["status"], string> = {
  active: "border-wood/40 bg-wood-soft text-ink",
  spare: "border-line bg-surface-2 text-ink",
  repair: "border-vermilion/40 bg-vermilion/10 text-vermilion",
  retired: "border-line bg-surface text-muted",
};

export default function GearView({ entries, today, onNew, onEdit }: { entries: Entry[]; today: string; onNew: () => void; onEdit: (id: string) => void }) {
  const items = useMemo(() => inventory(entries), [entries]);
  const spend = useMemo(() => equipmentSpend(entries, today), [entries, today]);
  const usage = useMemo(() => {
    const m = new Map<string, { count: number; last: string }>();
    for (const e of entries) {
      if (!isPractice(e)) continue;
      for (const id of e.equipmentIds) {
        const cur = m.get(id) ?? { count: 0, last: "" };
        cur.count++;
        if (e.date > cur.last) cur.last = e.date;
        m.set(id, cur);
      }
    }
    return m;
  }, [entries]);

  const groups = EQUIP_CATEGORY_OPTS.map((c) => ({ c, list: items.filter((i) => i.category === c.key) })).filter((g) => g.list.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[15px] text-muted">每筆採購同時是你的弓具清單；在練習紀錄勾選用了哪把弓、哪組矢，就能看到使用次數。</p>
        <button type="button" className={btn.primary} onClick={onNew}>
          ＋ 新增裝備
        </button>
      </div>

      {items.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["TWD", "JPY"] as const).map((c) => (
            <div key={c} className="rounded-2xl border border-line bg-surface p-3.5">
              <dt className="text-xs text-muted">{c === "TWD" ? "新臺幣合計" : "日圓合計"}</dt>
              <dd className="mt-0.5 text-xl font-bold tabular-nums">{money(spend[c].all, c)}</dd>
              <dd className="text-xs text-muted">今年 {money(spend[c].year, c)}</dd>
            </div>
          ))}
        </dl>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">還沒有裝備紀錄。從第一把弓、第一組矢開始記下店家、價格與規格（弓長、弓力、矢尺…）。</p>
      ) : (
        groups.map(({ c, list }) => (
          <section key={c.key} aria-labelledby={`gear-${c.key}`} className={cardCls}>
            <h3 id={`gear-${c.key}`} lang={c.ja ? "ja" : undefined} className="mb-2 text-lg font-bold">
              {c.label} <span className="text-sm font-normal text-muted">{list.length}</span>
            </h3>
            <ul className="divide-y divide-line">
              {list.map((it) => {
                const u = usage.get(it.id);
                return (
                  <li key={it.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold break-words">{it.item}</span>
                          <span className={`rounded border px-1.5 py-px text-xs ${STATUS_STYLE[it.status]}`}>{optLabel(EQUIP_STATUS_OPTS, it.status)}</span>
                          {isSample(it) && <SampleBadge />}
                        </p>
                        {it.specs.length > 0 && (
                          <p className="mt-0.5 text-sm break-words">
                            {it.specs
                              .filter((s) => s.value)
                              .map((s) => `${s.label ? `${s.label}：` : ""}${s.value}`)
                              .join("・")}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs text-muted">
                          {formatDay(it.date, true)}
                          {it.shop && `・${it.shop}`}
                          {it.price != null && `・${money(it.price, it.currency)}`}
                          {u && `・練習使用 ${u.count} 次（最後 ${shortDay(u.last)}）`}
                        </p>
                      </div>
                      <button type="button" className="min-h-10 shrink-0 rounded-lg px-3 text-sm text-wood hover:bg-surface-2" onClick={() => onEdit(it.id)} aria-label={`編輯「${it.item}」`}>
                        編輯
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
