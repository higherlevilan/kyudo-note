// 小弓's speech bubble (like TechEDU's HC.say): small avatar on the left, a bubble with the name
// label and the line. Server-safe; the hop-in on first scroll into view is a tiny client wrapper.
// Pass registry text with <b>/<i>/<br> through `html` (everything else is escaped), or JSX as children.

import type { ReactNode } from "react";
import type { Mood } from "@/lib/course/types";
import Mascot from "./Mascot";
import SayInView from "./SayInView";
import { sanitizeSayHtml } from "./sanitize";

export interface SayProps {
  mood?: Mood;
  children?: ReactNode;
  /** registry text; only <b>, <i>, <br> survive, everything else is escaped */
  html?: string;
  className?: string;
  /** smaller avatar and tighter bubble, for inline quips */
  compact?: boolean;
  /** name label, default 「小弓」 */
  name?: string;
}

export default function Say({ mood = "happy", children, html, className = "", compact = false, name = "小弓" }: SayProps) {
  return (
    <SayInView
      className={`mascot-say flex items-start ${compact ? "mascot-say-compact gap-2.5" : "gap-3"} ${className}`}
    >
      <div role="note" aria-label={`${name}說`} className="contents">
        <Mascot mood={mood} size={compact ? 38 : 52} bob className="mt-0.5" />
        <div
          data-mood={mood}
          className={`mascot-say-bubble min-w-0 max-w-[46em] flex-1 rounded-2xl rounded-tl-sm border border-line bg-surface text-ink ${
            compact ? "px-3 py-1.5" : "px-3.5 py-2.5"
          }`}
        >
          <span aria-hidden="true" className="block text-xs font-semibold tracking-wide text-wood">
            {name}
          </span>
          {html !== undefined ? (
            <p
              className={`${compact ? "text-sm" : "text-[0.95rem]"} leading-relaxed [&_b]:font-semibold`}
              dangerouslySetInnerHTML={{ __html: sanitizeSayHtml(html) }}
            />
          ) : (
            <div className={`${compact ? "text-sm" : "text-[0.95rem]"} leading-relaxed [&_b]:font-semibold`}>{children}</div>
          )}
        </div>
      </div>
    </SayInView>
  );
}
