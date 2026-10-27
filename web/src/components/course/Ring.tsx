// Progress ring around a chapter tag (TechEDU's .ring): a wood arc that turns into a vermilion
// 朱印 when the 關卡 is complete. Purely presentational; the fraction comes from the caller.
import type { CSSProperties, ReactNode } from "react";

const SIZE = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-9 w-9 text-[11px]",
  lg: "h-14 w-14 text-sm [--ring-w:5px]",
} as const;

export default function Ring({
  fraction,
  size = "md",
  label,
  children,
  className = "",
}: {
  fraction: number;
  size?: keyof typeof SIZE;
  /** screen-reader text, e.g. 「完成 40%」; the ring itself is decorative */
  label?: string;
  children?: ReactNode;
  className?: string;
}) {
  const done = fraction >= 1;
  return (
    <span
      className={`course-ring ${SIZE[size]} ${className}`}
      data-done={done || undefined}
      style={{ "--p": Math.max(0, Math.min(1, fraction)) } as CSSProperties}
    >
      <span aria-hidden="true" className={`font-semibold tabular-nums leading-none ${done ? "text-vermilion" : "text-ink"}`}>
        {children}
      </span>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
