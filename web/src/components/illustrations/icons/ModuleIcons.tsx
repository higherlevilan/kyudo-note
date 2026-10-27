// Stroke icons for the home-page module cards. 24px grid, 1.5 stroke, currentColor.
// Decorative: they always sit next to the module title, so they are aria-hidden.

import type { ReactNode } from "react";

export type IconProps = { className?: string };

function Icon({ className = "h-6 w-6", children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

/** 詞彙：方框裡的「弓」。 */
export function KanjiIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x={3} y={3} width={18} height={18} rx={2.5} />
      <path d="M8 7.2h7.5v3.6H9v3.5h7.5c0 3-.4 4-1.6 4.2-.6.1-1.2 0-1.9-.3" />
    </Icon>
  );
}

/** 問題研究：筆觸的圓相與問號。 */
export function QuestionIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M19.4 8.2A8.5 8.5 0 1 0 20.5 12.6" />
      <path d="M19.4 8.2c.5-.9 1-1.4 1.6-1.6" strokeWidth={1} />
      <path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2.9-1.2 1.7v.6" />
      <circle cx={12} cy={16.9} r={0.5} fill="currentColor" />
    </Icon>
  );
}

/** 練習：靶與勾。 */
export function TargetCheckIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx={10.5} cy={10.5} r={7.5} />
      <circle cx={10.5} cy={10.5} r={4} />
      <circle cx={10.5} cy={10.5} r={0.6} fill="currentColor" />
      <path d="m14.5 18.5 2.3 2.3 4.7-5.3" />
    </Icon>
  );
}

/** 稽古帳：和綴じの帳面。 */
export function NotebookIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x={4.5} y={2.5} width={15} height={19} rx={1.5} />
      <path d="M8 2.5v19" />
      <path d="M4.5 6h3.5M4.5 10.5h3.5M4.5 15h3.5M4.5 19h3.5" strokeWidth={1.1} />
      <path d="M11.5 6.5h5v6h-5z" strokeWidth={1.2} />
    </Icon>
  );
}

/** 射形分析：相機與人形骨架。 */
export function CameraPoseIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M3 7.5h3.5l1.5-2h8l1.5 2H21v12H3z" />
      <circle cx={12} cy={10.2} r={1.2} />
      <path d="M12 11.4v4.1M9.2 13l2.8-.8 2.8.8M10.4 18.3 12 15.5l1.6 2.8" strokeWidth={1.2} />
    </Icon>
  );
}
