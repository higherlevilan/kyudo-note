"use client";

// Small form primitives for the journal. Native inputs underneath (keyboard + screen-reader
// support for free); text inputs use 16px text so iOS does not zoom on focus.

import type { ReactNode } from "react";
import type { Opt } from "@/lib/journal/options";
import { TYPE_META } from "@/lib/journal/options";
import type { EntryType } from "@/lib/journal/types";

export const inputCls =
  "w-full min-h-11 rounded-xl border border-field-border bg-surface px-3 py-2 text-base text-ink placeholder:text-muted/70 focus:border-wood focus:outline-none aria-[invalid=true]:border-vermilion";

export const btn = {
  primary:
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-ink px-4 py-2 text-[15px] font-semibold text-paper hover:opacity-90 disabled:opacity-50",
  secondary:
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-line bg-surface px-4 py-2 text-[15px] text-ink hover:bg-surface-2 disabled:opacity-50",
  ghost: "inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-sm text-wood hover:bg-surface-2",
  danger:
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-vermilion/50 bg-surface px-4 py-2 text-[15px] text-vermilion hover:bg-vermilion/10",
} as const;

export const cardCls = "rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5";

const describedBy = (id: string, hint?: ReactNode, error?: string) =>
  [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;

function Help({ id, hint, error }: { id: string; hint?: ReactNode; error?: string }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm text-vermilion">
          {error}
        </p>
      )}
    </>
  );
}

export function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-semibold text-ink">
      {children}
      {optional && <span className="ml-1.5 text-xs font-normal text-muted">選填</span>}
    </label>
  );
}

interface BaseFieldProps {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
}

export function TextField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  value,
  onChange,
  type = "text",
  placeholder,
  list,
  maxLength = 200,
  autoComplete = "off",
  inputMode,
}: BaseFieldProps & {
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "date" | "url" | "search";
  placeholder?: string;
  list?: string;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: "text" | "url" | "numeric";
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={list}
        maxLength={maxLength}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={inputCls}
      />
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  value,
  onChange,
  rows = 3,
  placeholder,
}: BaseFieldProps & { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={4000}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${inputCls} resize-y leading-relaxed`}
      />
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

export function SelectField<K extends string>({
  id,
  label,
  hint,
  error,
  optional,
  className,
  value,
  onChange,
  options,
}: BaseFieldProps & { value: K; onChange: (v: K) => void; options: readonly Opt<K>[] }) {
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as K)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={inputCls}
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

const digits = (s: string) => s.replace(/[^\d]/g, "").slice(0, 9);

/** Integer input with − / + buttons (big tap targets for post-practice entry on a phone). */
export function NumberField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  value,
  onChange,
  min = 0,
  max = 100_000_000,
  step = 1,
  nullable,
  unit,
  stepper = true,
  disabled,
  quick,
  name,
}: BaseFieldProps & {
  /** Plain-text field name for the stepper buttons' labels (defaults to `label` when it is a string). */
  name?: string;
  value: number | null;
  onChange: (v: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  nullable?: boolean;
  unit?: string;
  stepper?: boolean;
  disabled?: boolean;
  /** Extra quick-add buttons, e.g. +2 (一手) / +4 (一立). */
  quick?: { label: string; add: number; aria: string }[];
}) {
  const v = value ?? 0;
  const set = (n: number) => {
    const c = Math.min(max, Math.max(min, n));
    // Stepping an optional field down to nothing clears it rather than storing 0.
    onChange(nullable && c <= 0 ? null : c);
  };
  const fieldName = name ?? (typeof label === "string" ? label : "");
  const stepBtn =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-field-border bg-surface text-xl text-ink hover:bg-surface-2 disabled:opacity-40";
  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <div className="flex items-center gap-1.5">
        {stepper && (
          <button type="button" className={stepBtn} onClick={() => set(v - step)} disabled={disabled || v <= min} aria-label={`${fieldName}減少 ${step}`}>
            −
          </button>
        )}
        <div className="relative min-w-0 flex-1">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            disabled={disabled}
            value={value == null || (!nullable && value === 0) ? "" : String(value)}
            placeholder={nullable ? "" : "0"}
            onChange={(e) => {
              const d = digits(e.target.value);
              if (!d) onChange(nullable ? null : 0);
              else onChange(Math.min(max, Number(d)));
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, hint, error)}
            className={`${inputCls} text-center tabular-nums disabled:bg-surface-2 disabled:text-muted ${unit ? "pr-10" : ""}`}
          />
          {unit && <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted">{unit}</span>}
        </div>
        {stepper && (
          <button type="button" className={stepBtn} onClick={() => set(v + step)} disabled={disabled || v >= max} aria-label={`${fieldName}增加 ${step}`}>
            ＋
          </button>
        )}
      </div>
      {quick && !disabled && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {quick.map((q) => (
            <button key={q.label} type="button" onClick={() => set(v + q.add)} aria-label={q.aria} className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 text-sm text-ink hover:bg-wood-soft">
              {q.label}
            </button>
          ))}
        </div>
      )}
      <Help id={id} hint={hint} error={error} />
    </div>
  );
}

const chipCls =
  "relative inline-flex min-h-10 cursor-pointer select-none items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors " +
  "border-field-border bg-surface text-ink hover:bg-surface-2 " +
  "has-checked:border-ink has-checked:bg-ink has-checked:text-paper " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-wood motion-reduce:transition-none";

function OptText({ o }: { o: Opt }) {
  return o.ja && o.ja === o.label ? <span lang="ja">{o.label}</span> : <span>{o.label}</span>;
}

/** Multi-select chips (native checkboxes). */
export function ChipGroup<K extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
  showHints,
  optional,
}: {
  legend: ReactNode;
  name: string;
  options: readonly Opt<K>[];
  value: readonly string[];
  onChange: (v: K[]) => void;
  hint?: ReactNode;
  showHints?: boolean;
  optional?: boolean;
}) {
  const toggle = (k: K, on: boolean) => {
    const cur = value.filter((x) => x !== k) as K[];
    onChange(on ? [...cur, k] : cur);
  };
  return (
    <fieldset aria-describedby={hint ? `${name}-hint` : undefined}>
      <legend className="mb-1.5 text-sm font-semibold">
        {legend}
        {optional && <span className="ml-1.5 text-xs font-normal text-muted">選填</span>}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <label key={o.key} className={chipCls} title={o.hint}>
            <input type="checkbox" name={name} className="sr-only" checked={value.includes(o.key)} onChange={(e) => toggle(o.key, e.target.checked)} />
            <OptText o={o} />
            {showHints && o.hint && <span className="text-xs opacity-70">{o.hint}</span>}
          </label>
        ))}
      </div>
      {hint && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
    </fieldset>
  );
}

/** Single-select chips (native radios: arrow keys move the selection). */
export function RadioChips<K extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
  allowNone,
}: {
  legend: ReactNode;
  name: string;
  options: readonly Opt<K>[];
  value: K | null;
  onChange: (v: K | null) => void;
  hint?: ReactNode;
  allowNone?: string;
}) {
  return (
    <fieldset aria-describedby={hint ? `${name}-hint` : undefined}>
      <legend className="mb-1.5 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {allowNone && (
          <label className={chipCls}>
            <input type="radio" name={name} className="sr-only" checked={value === null} onChange={() => onChange(null)} />
            <span>{allowNone}</span>
          </label>
        )}
        {options.map((o) => (
          <label key={o.key} className={chipCls} title={o.hint}>
            <input type="radio" name={name} className="sr-only" checked={value === o.key} onChange={() => onChange(o.key)} />
            <OptText o={o} />
          </label>
        ))}
      </div>
      {hint && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
    </fieldset>
  );
}

/** Editable list of short text lines (key points, 學科題目…). */
export function LinesField({
  id,
  legend,
  value,
  onChange,
  placeholder,
  addLabel = "＋ 新增一項",
  multiline,
}: {
  id: string;
  legend: ReactNode;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  multiline?: boolean;
}) {
  const list = value.length ? value : [""];
  const set = (i: number, s: string) => onChange(list.map((x, j) => (j === i ? s : x)));
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold">{legend}</legend>
      <ol className="space-y-2">
        {list.map((line, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span aria-hidden="true" className="mt-2.5 w-5 shrink-0 text-right text-sm text-muted tabular-nums">
              {i + 1}.
            </span>
            {multiline ? (
              <textarea
                id={`${id}-${i}`}
                aria-label={`第 ${i + 1} 項`}
                value={line}
                rows={2}
                maxLength={4000}
                placeholder={i === 0 ? placeholder : undefined}
                onChange={(e) => set(i, e.target.value)}
                className={`${inputCls} resize-y`}
              />
            ) : (
              <input
                id={`${id}-${i}`}
                aria-label={`第 ${i + 1} 項`}
                value={line}
                maxLength={400}
                placeholder={i === 0 ? placeholder : undefined}
                onChange={(e) => set(i, e.target.value)}
                className={inputCls}
              />
            )}
            {list.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(list.filter((_, j) => j !== i))}
                aria-label={`刪除第 ${i + 1} 項`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface-2 hover:text-vermilion"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ol>
      <button
        type="button"
        className={`${btn.ghost} mt-1.5`}
        onClick={() => {
          onChange([...list, ""]);
          requestAnimationFrame(() => document.getElementById(`${id}-${list.length}`)?.focus());
        }}
      >
        {addLabel}
      </button>
    </fieldset>
  );
}

export function TypeBadge({ type, className = "" }: { type: EntryType; className?: string }) {
  const m = TYPE_META[type];
  return <span className={`inline-flex items-center rounded border px-1.5 py-px text-xs whitespace-nowrap ${m.badge} ${className}`}>{m.label}</span>;
}

export function SampleBadge() {
  return <span className="inline-flex rounded border border-dashed border-muted/60 px-1.5 py-px text-xs text-muted">範例</span>;
}

export function MarkGlyph({ m, className = "" }: { m: "o" | "x" | ""; className?: string }) {
  const [glyph, color, sr] = m === "o" ? ["○", "text-vermilion", "中"] : m === "x" ? ["×", "text-muted", "未中"] : ["・", "text-line", "未射"];
  return (
    <span className={`${color} ${className}`}>
      <span aria-hidden="true">{glyph}</span>
      <span className="sr-only">{sr}</span>
    </span>
  );
}
