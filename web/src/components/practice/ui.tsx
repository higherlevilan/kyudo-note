// Small presentational pieces shared by the practice modes and QuickCheck.

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { KIND_LABEL, TAG_LABEL, type Source, type Tag } from "@/content/types";
import type { MoreLink } from "@/lib/practice/types";

type BtnProps = ComponentProps<"button"> & { variant?: "primary" | "secondary" | "ghost" };

export function Btn({ variant = "secondary", className = "", type = "button", ...rest }: BtnProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const look =
    variant === "primary"
      ? "bg-ink text-paper hover:bg-ink/85"
      : variant === "ghost"
        ? "text-wood hover:bg-surface-2"
        : "border border-field-border bg-surface text-ink hover:bg-surface-2";
  return <button type={type} className={`${base} ${look} ${className}`} {...rest} />;
}

const TAG_STYLE: Record<Tag, string> = {
  official: "bg-indigo/15 text-indigo border-indigo/30",
  guide: "bg-wood-soft text-ink border-wood/30",
  local: "bg-surface-2 text-ink border-line",
  research: "bg-surface-2 text-ink border-indigo/30",
  shop: "bg-surface-2 text-ink border-line",
  folk: "bg-vermilion/10 text-vermilion border-vermilion/40",
  note: "bg-surface-2 text-muted border-line",
  disputed: "bg-vermilion/10 text-vermilion border-vermilion/40",
};

export function TagChip({ tag, label }: { tag?: Tag; label?: string }) {
  if (!tag && !label) return null;
  const style = tag ? TAG_STYLE[tag] : "bg-surface-2 text-muted border-line";
  return (
    <span className={`inline-block rounded border px-1.5 py-px text-[11px] leading-4 whitespace-nowrap ${style}`}>
      {tag ? TAG_LABEL[tag] : label}
    </span>
  );
}

/** Visible source list under an explanation. */
export function SourceLinks({ src }: { src: readonly Source[] }) {
  const unique = [...new Map(src.map((s) => [s.url + s.label, s])).values()];
  if (!unique.length) return null;
  return (
    <div className="mt-2 text-xs leading-relaxed text-muted">
      <span className="font-semibold">出處：</span>
      <ul className="mt-0.5 space-y-0.5">
        {unique.map((s) => (
          <li key={s.url + s.label}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-line hover:text-wood">
              {s.label}
            </a>
            <span className="ml-1.5 text-[11px]">{KIND_LABEL[s.kind]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function More({ link }: { link?: MoreLink }) {
  if (!link) return null;
  return (
    <Link href={link.href} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-wood underline">
      {link.label} →
    </Link>
  );
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"
      >
        <div className="h-full rounded-full bg-wood motion-safe:transition-[width] motion-safe:duration-300" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-muted tabular-nums">
        {value} / {max}
      </span>
    </div>
  );
}

/** ✓ / ✗ marker with a text label, so colour is never the only signal. */
export function Verdict({ ok, children }: { ok: boolean; children?: ReactNode }) {
  return (
    <p className={`flex items-center gap-2 text-base font-bold ${ok ? "text-indigo" : "text-vermilion"}`}>
      <span aria-hidden="true" className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${ok ? "border-indigo" : "border-vermilion"}`}>
        {ok ? "✓" : "✗"}
      </span>
      {children ?? (ok ? "答對了" : "再想想")}
    </p>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6 ${className}`}>{children}</div>;
}
