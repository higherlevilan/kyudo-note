// Shared Tailwind class strings for the form-check UI (same look as the rest of the site).

export const btn = {
  primary:
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-[15px] font-semibold text-paper hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-[15px] text-ink hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50",
  small:
    "inline-flex min-h-10 shrink-0 items-center justify-center gap-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink hover:bg-surface-2 disabled:opacity-50",
  danger:
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-vermilion/50 bg-surface px-4 py-2 text-[15px] text-vermilion hover:bg-vermilion/10",
} as const;

export const cardCls = "rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5";

export const inputCls =
  "min-h-11 w-full rounded-xl border border-field-border bg-surface px-3 py-2 text-base text-ink focus:border-wood focus:outline-none";

export const stepTitleCls = "flex items-center gap-2 text-lg font-bold";

export function StepNum({ n }: { n: number }) {
  return (
    <span aria-hidden="true" className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wood-soft text-sm font-bold text-ink">
      {n}
    </span>
  );
}
