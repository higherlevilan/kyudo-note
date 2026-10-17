"use client";

// Type-specific form bodies for the entry editor.

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  CULTURE_KIND_OPTS,
  CURRENCY_OPTS,
  EQUIP_CATEGORY_OPTS,
  EQUIP_STATUS_OPTS,
  EXAM_RESULT_OPTS,
  FATIGUE_OPTS,
  FAULTS,
  GOAL_KIND_OPTS,
  GRADES,
  PAIN_AREAS,
  PRACTICE_KIND_OPTS,
  SHAHO_STEP_OPTS,
  SPEC_PRESETS,
  YADOKORO_OPTS,
  type Opt,
} from "@/lib/journal/options";
import { fmtPct, gridCounts, pct, usesGrid } from "@/lib/journal/model";
import type { CultureEntry, Entry, ExamEntry, GoalEntry, LessonEntry, Mark, PracticeEntry, PurchaseEntry, ShahoStep } from "@/lib/journal/types";
import ScoreSheet from "./ScoreSheet";
import { btn, ChipGroup, inputCls, LinesField, MarkGlyph, NumberField, RadioChips, SelectField, TextAreaField, TextField } from "./ui";

export interface FieldsProps<T extends Entry> {
  e: T;
  set: (patch: Partial<T>) => void;
  err: (field: string) => string | undefined;
  ctx: EditorContext;
}

export interface EditorContext {
  places: string[];
  teachers: string[];
  gear: { id: string; label: string }[];
  today: string;
}

/** Collapsible group; starts open when `open` is true on first render. */
export function Group({ title, ja, open, filled, children }: { title: string; ja?: string; open?: boolean; filled?: boolean; children: ReactNode }) {
  const [initial] = useState(!!open);
  return (
    <details open={initial} className="group rounded-2xl border border-line bg-surface">
      <summary className="flex min-h-12 items-center gap-2 px-4 py-2 font-semibold">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current text-wood">
          <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
        </svg>
        <span>{title}</span>
        {ja && (
          <span lang="ja" className="text-sm font-normal text-muted">
            {ja}
          </span>
        )}
        {filled && (
          <span className="ml-auto text-xs font-normal text-wood" aria-label="已填寫">
            ●
          </span>
        )}
      </summary>
      <div className="space-y-4 border-t border-line px-4 pt-3 pb-4">{children}</div>
    </details>
  );
}

function Datalist({ id, values }: { id: string; values: string[] }) {
  if (!values.length) return null;
  return (
    <datalist id={id}>
      {values.map((v) => (
        <option key={v} value={v} />
      ))}
    </datalist>
  );
}

function StepLinks({ steps }: { steps: ShahoStep[] }) {
  if (!steps.length) return null;
  return (
    <p className="text-xs text-muted">
      複習：
      {steps.map((s, i) => (
        <span key={s}>
          {i > 0 && "、"}
          <Link href={`/shaho/#${s}`} className="text-wood underline" lang="ja" target="_blank" rel="noopener">
            {SHAHO_STEP_OPTS.find((o) => o.key === s)?.ja ?? s}
          </Link>
        </span>
      ))}
      <span className="sr-only">（在新分頁開啟射法八節頁）</span>
    </p>
  );
}

const STEP_CHIPS: Opt<ShahoStep>[] = SHAHO_STEP_OPTS.map((o) => ({ ...o, label: o.ja ?? o.label }));

// ---------- 練習 ----------

export function PracticeFields({ e, set, err, ctx }: FieldsProps<PracticeEntry>) {
  const grid = usesGrid(e);
  const [showSheet, setShowSheet] = useState(grid);
  const [customFault, setCustomFault] = useState("");
  const counts = grid ? gridCounts(e.rounds) : { arrows: e.arrows, hits: e.hits };
  const customFaults = e.faults.filter((f) => !FAULTS.some((o) => o.key === f));
  const showMakiwara = e.kinds.includes("makiwara") || e.makiwara > 0;
  const addCustomFault = () => {
    const f = customFault.trim().slice(0, 40);
    if (f && !e.faults.includes(f)) set({ faults: [...e.faults, f] });
    setCustomFault("");
  };

  return (
    <>
      <Group title="基本" open>
        <TextField id="place" label="道場／地點" value={e.place} onChange={(place) => set({ place })} list="dl-places" placeholder="例如：市立體育館弓道場" optional />
        <Datalist id="dl-places" values={ctx.places} />
        <ChipGroup legend="練習內容" name="kinds" options={PRACTICE_KIND_OPTS} value={e.kinds} onChange={(kinds) => set({ kinds })} />
        <NumberField
          id="durationMin"
          label="練習時間"
          name="練習時間"
          unit="分"
          nullable
          optional
          step={15}
          max={1440}
          value={e.durationMin}
          onChange={(durationMin) => set({ durationMin })}
          error={err("durationMin")}
          className="max-w-xs"
        />
      </Group>

      <Group title="射數與的中" ja="的中" open>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted">
            {counts.arrows > 0 ? (
              <>
                今日的前 <strong className="text-ink tabular-nums">{counts.arrows}</strong> 射{" "}
                <strong className="text-ink tabular-nums">{counts.hits}</strong> 中（{fmtPct(pct(counts.hits, counts.arrows))}）
              </>
            ) : (
              "只填總數也可以，或用 ○× 記錄表逐射記。"
            )}
          </p>
          <button type="button" className={btn.ghost} aria-expanded={showSheet} aria-controls="score-sheet" onClick={() => setShowSheet((v) => !v)}>
            {showSheet ? "收起記錄表" : "○× 記錄表"}
          </button>
        </div>
        {showSheet && (
          <div id="score-sheet">
            <ScoreSheet rounds={e.rounds} onChange={(rounds: Mark[][]) => set({ rounds })} />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="arrows"
            label="的前射數"
            name="的前射數"
            value={counts.arrows}
            max={2000}
            disabled={grid}
            onChange={(v) => set({ arrows: v ?? 0 })}
            error={err("arrows")}
            hint={grid ? "依記錄表自動計算" : undefined}
            quick={[
              { label: "+2 一手", add: 2, aria: "射數加 2（一手）" },
              { label: "+4 一立", add: 4, aria: "射數加 4（一立）" },
            ]}
          />
          <NumberField id="hits" label="的中" name="的中" value={counts.hits} max={2000} disabled={grid} onChange={(v) => set({ hits: v ?? 0 })} error={err("hits")} />
        </div>
        {showMakiwara && (
          <NumberField
            id="makiwara"
            name="巻藁射數"
            label={
              <>
                <span lang="ja">巻藁</span>射數
              </>
            }
            value={e.makiwara}
            max={2000}
            onChange={(v) => set({ makiwara: v ?? 0 })}
            error={err("makiwara")}
            hint="不計入的中率，但會算進總射數。"
            className="sm:max-w-[50%]"
          />
        )}
      </Group>

      <Group title="射癖與矢所" ja="射癖" open filled={e.faults.length + e.yadokoro.length > 0}>
        <ChipGroup legend="今天出現的射癖" name="faults" options={FAULTS} value={e.faults} onChange={(faults) => set({ faults })} optional />
        {customFaults.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="自訂射癖">
            {customFaults.map((f) => (
              <li key={f}>
                <button
                  type="button"
                  onClick={() => set({ faults: e.faults.filter((x) => x !== f) })}
                  className="inline-flex min-h-10 items-center gap-1 rounded-full border border-ink bg-ink px-3 py-1.5 text-sm text-paper"
                  aria-label={`移除自訂射癖「${f}」`}
                >
                  {f} <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-1.5">
          <label htmlFor="custom-fault" className="sr-only">
            自訂射癖
          </label>
          <input
            id="custom-fault"
            value={customFault}
            maxLength={40}
            onChange={(ev) => setCustomFault(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                addCustomFault();
              }
            }}
            placeholder="其他射癖（自行輸入）"
            className={inputCls}
          />
          <button type="button" className={btn.secondary} onClick={addCustomFault} disabled={!customFault.trim()}>
            加入
          </button>
        </div>
        <details className="text-xs text-muted">
          <summary className="text-wood underline">射癖說明</summary>
          <ul className="mt-1.5 space-y-0.5">
            {FAULTS.filter((f) => f.hint).map((f) => (
              <li key={f.key}>
                <span lang={f.ja ? "ja" : undefined} className="text-ink">
                  {f.label}
                </span>
                ：{f.hint}
              </li>
            ))}
          </ul>
        </details>
        <ChipGroup
          legend="矢所（箭落點傾向）"
          name="yadokoro"
          options={YADOKORO_OPTS}
          value={e.yadokoro}
          onChange={(yadokoro) => set({ yadokoro })}
          hint="前＝射手看靶時偏右、後＝偏左。"
          optional
        />
      </Group>

      <Group title="練習重點與反省" open filled={!!(e.reflection || e.focusSteps.length)}>
        <ChipGroup legend="今天專注的射法八節" name="focus" options={STEP_CHIPS} value={e.focusSteps} onChange={(focusSteps) => set({ focusSteps })} optional />
        <StepLinks steps={e.focusSteps} />
        <TextAreaField id="reflection" label="自我反省" value={e.reflection} onChange={(reflection) => set({ reflection })} placeholder="今天哪裡做得好、哪裡想改？" optional />
      </Group>

      <Group title="指導者意見" filled={!!(e.instructor || e.feedback)}>
        <TextField id="instructor" label="指導者" value={e.instructor} onChange={(instructor) => set({ instructor })} list="dl-teachers" optional />
        <Datalist id="dl-teachers" values={ctx.teachers} />
        <TextAreaField id="feedback" label="指導內容" value={e.feedback} onChange={(feedback) => set({ feedback })} placeholder="老師說的話，盡量照原話記下來" optional />
      </Group>

      <Group title="身體狀況" filled={e.fatigue != null || e.painAreas.length > 0}>
        <RadioChips
          legend="疲勞度"
          name="fatigue"
          options={FATIGUE_OPTS}
          value={e.fatigue == null ? null : String(e.fatigue)}
          onChange={(v) => set({ fatigue: v == null ? null : Number(v) })}
          allowNone="未記錄"
        />
        <ChipGroup legend="疼痛或不適部位" name="pain" options={PAIN_AREAS.map((p) => ({ key: p, label: p }))} value={e.painAreas} onChange={(painAreas) => set({ painAreas })} optional />
        <TextAreaField id="painNote" label="身體備註" rows={2} value={e.painNote} onChange={(painNote) => set({ painNote })} optional />
        <p className="rounded-xl bg-vermilion/5 px-3 py-2 text-xs leading-relaxed text-muted">
          這裡的紀錄只是自我觀察。若疼痛持續、反覆出現或影響日常生活，請暫停練習並諮詢醫師或物理治療師，也可以告訴指導老師調整弓力。
        </p>
      </Group>

      <Group title="使用裝備" filled={e.equipmentIds.length > 0}>
        {ctx.gear.length ? (
          <ChipGroup
            legend="今天用的弓具"
            name="gear"
            options={ctx.gear.map((g) => ({ key: g.id, label: g.label }))}
            value={e.equipmentIds}
            onChange={(equipmentIds) => set({ equipmentIds })}
          />
        ) : (
          <p className="text-sm text-muted">在「裝備」分頁新增弓、矢、弽後，就能在這裡勾選每次練習用了哪些弓具。</p>
        )}
      </Group>
    </>
  );
}

// ---------- 課程筆記 ----------

export function LessonFields({ e, set, err, ctx }: FieldsProps<LessonEntry>) {
  return (
    <Group title="課程內容" open>
      <TextField id="className" label="課程名稱" value={e.className} onChange={(className) => set({ className })} error={err("className")} placeholder="例如：初心者講習 第 3 回" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="teacher" label="講師" value={e.teacher} onChange={(teacher) => set({ teacher })} list="dl-teachers" optional />
        <TextField id="lplace" label="地點" value={e.place} onChange={(place) => set({ place })} list="dl-places" optional />
      </div>
      <Datalist id="dl-teachers" values={ctx.teachers} />
      <Datalist id="dl-places" values={ctx.places} />
      <LinesField id="kp" legend="學到的重點" value={e.keyPoints} onChange={(keyPoints) => set({ keyPoints })} placeholder="一行一個重點" multiline />
      <ChipGroup legend="相關的射法八節" name="lsteps" options={STEP_CHIPS} value={e.steps} onChange={(steps) => set({ steps })} optional />
      <StepLinks steps={e.steps} />
      <TextAreaField id="homework" label="回家作業／下次要練的" rows={2} value={e.homework} onChange={(homework) => set({ homework })} optional />
    </Group>
  );
}

// ---------- 審查 ----------

export function ExamFields({ e, set, err }: FieldsProps<ExamEntry>) {
  const gradeOpts: Opt[] = GRADES.map((g) => ({ key: g, label: g }));
  const setMark = (i: number) => {
    const order: Mark[] = ["", "o", "x"];
    set({ marks: e.marks.map((m, j) => (j === i ? order[(order.indexOf(m) + 1) % 3] : m)) });
  };
  return (
    <Group title="審查" ja="審査" open>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="grade" label="受審段位" value={e.grade} onChange={(grade) => set({ grade })} options={gradeOpts} error={err("grade")} />
        <TextField id="eplace" label="會場" value={e.place} onChange={(place) => set({ place })} optional />
      </div>
      <RadioChips legend="結果" name="result" options={EXAM_RESULT_OPTS} value={e.result} onChange={(v) => set({ result: v ?? "pending" })} />
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">
          實技（<span lang="ja">甲矢・乙矢</span>）
        </legend>
        <div className="flex gap-2">
          {e.marks.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMark(i)}
              aria-label={`${i === 0 ? "甲矢" : i === 1 ? "乙矢" : `第${i + 1}射`}：${m === "o" ? "中" : m === "x" ? "未中" : "未記錄"}，點一下切換`}
              className="flex h-12 w-16 flex-col items-center justify-center rounded-xl border border-line bg-surface text-xl hover:bg-surface-2"
            >
              <MarkGlyph m={m} />
              <span lang="ja" className="text-[10px] text-muted">
                {i === 0 ? "甲矢" : i === 1 ? "乙矢" : i + 1}
              </span>
            </button>
          ))}
        </div>
      </fieldset>
      <LinesField id="q" legend="學科題目" value={e.questions} onChange={(questions) => set({ questions })} placeholder="題目與自己的答案要點" multiline addLabel="＋ 新增題目" />
      <TextAreaField id="judgeComments" label="審查員講評" rows={2} value={e.judgeComments} onChange={(judgeComments) => set({ judgeComments })} optional />
      <TextAreaField id="ereflection" label="反省與下一步" value={e.reflection} onChange={(reflection) => set({ reflection })} optional />
    </Group>
  );
}

// ---------- 裝備採購 ----------

export function PurchaseFields({ e, set, err }: FieldsProps<PurchaseEntry>) {
  const presets = SPEC_PRESETS[e.category].filter((p) => !e.specs.some((s) => s.label === p));
  const setSpec = (i: number, patch: Partial<{ label: string; value: string }>) => set({ specs: e.specs.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  return (
    <>
      <Group title="品項" open>
        <TextField id="item" label="品項名稱" value={e.item} onChange={(item) => set({ item })} error={err("item")} placeholder="例如：直心 カーボン弓" />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="category" label="類別" value={e.category} onChange={(category) => set({ category })} options={EQUIP_CATEGORY_OPTS} />
          <SelectField id="status" label="目前狀態" value={e.status} onChange={(status) => set({ status })} options={EQUIP_STATUS_OPTS} />
        </div>
        <TextField id="shop" label="購買店家" value={e.shop} onChange={(shop) => set({ shop })} optional />
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <NumberField id="price" label="價格" name="價格" nullable stepper={false} value={e.price} onChange={(price) => set({ price })} error={err("price")} optional />
          <SelectField id="currency" label="幣別" value={e.currency} onChange={(currency) => set({ currency })} options={CURRENCY_OPTS} />
        </div>
      </Group>
      <Group title="規格" open filled={e.specs.length > 0}>
        {e.specs.length > 0 && (
          <ul className="space-y-2">
            {e.specs.map((s, i) => (
              <li key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] items-center gap-1.5">
                <input aria-label={`規格 ${i + 1} 名稱`} value={s.label} maxLength={60} onChange={(ev) => setSpec(i, { label: ev.target.value })} placeholder="名稱" className={inputCls} />
                <input aria-label={`規格 ${i + 1} 內容`} value={s.value} maxLength={200} onChange={(ev) => setSpec(i, { value: ev.target.value })} placeholder="內容" className={inputCls} />
                <button
                  type="button"
                  onClick={() => set({ specs: e.specs.filter((_, j) => j !== i) })}
                  aria-label={`刪除規格 ${s.label || i + 1}`}
                  className="flex h-11 w-9 items-center justify-center rounded-xl text-muted hover:bg-surface-2 hover:text-vermilion"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button key={p} type="button" onClick={() => set({ specs: [...e.specs, { label: p, value: "" }] })} className="rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-sm hover:bg-wood-soft">
              ＋ {p}
            </button>
          ))}
          <button type="button" onClick={() => set({ specs: [...e.specs, { label: "", value: "" }] })} className={btn.ghost}>
            ＋ 自訂規格
          </button>
        </div>
      </Group>
    </>
  );
}

// ---------- 文化體驗 ----------

export function CultureFields({ e, set, err }: FieldsProps<CultureEntry>) {
  return (
    <Group title="活動" open>
      <TextField id="event" label="活動名稱" value={e.event} onChange={(event) => set({ event })} error={err("event")} placeholder="例如：明治神宮 秋季流鏑馬" />
      <RadioChips legend="類型" name="ckind" options={CULTURE_KIND_OPTS} value={e.kind} onChange={(v) => set({ kind: v ?? "other" })} />
      <TextField id="cplace" label="地點" value={e.place} onChange={(place) => set({ place })} optional />
      <TextField id="link" label="相關連結" type="url" inputMode="url" value={e.link} onChange={(link) => set({ link })} error={err("link")} placeholder="https://" maxLength={1000} optional />
    </Group>
  );
}

// ---------- 目標 ----------

export function GoalFields({ e, set, err }: FieldsProps<GoalEntry>) {
  const gradeOpts: Opt[] = GRADES.map((g) => ({ key: g, label: g }));
  return (
    <Group title="目標" open>
      <TextField id="title" label="目標名稱" value={e.title} onChange={(title) => set({ title })} error={err("title")} placeholder="例如：下次審查：初段" />
      <RadioChips legend="種類" name="gkind" options={GOAL_KIND_OPTS} value={e.kind} onChange={(v) => set({ kind: v ?? "custom" })} hint={GOAL_KIND_OPTS.find((o) => o.key === e.kind)?.hint} />
      {e.kind === "exam" && <SelectField id="ggrade" label="段位" value={e.grade || "初段"} onChange={(grade) => set({ grade })} options={gradeOpts} className="max-w-xs" />}
      {e.kind === "arrows" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="target" label="目標射數" name="目標射數" unit="射" step={100} nullable value={e.target} onChange={(target) => set({ target })} error={err("target")} />
          <TextField id="since" type="date" label="起算日" value={e.since} onChange={(since) => set({ since })} error={err("since")} />
        </div>
      )}
      {e.kind === "hitrate" && (
        <NumberField id="target" label="目標的中率" name="目標的中率" unit="%" step={5} max={100} nullable value={e.target} onChange={(target) => set({ target })} error={err("target")} className="max-w-xs" />
      )}
      <label className="flex min-h-11 items-center gap-2 text-[15px]">
        <input type="checkbox" checked={e.done} onChange={(ev) => set({ done: ev.target.checked })} className="h-5 w-5 accent-[var(--wood)]" />
        已達成
      </label>
    </Group>
  );
}
