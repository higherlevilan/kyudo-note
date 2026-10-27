"use client";

// Progress toasts (TechEDU ux.js toast/checkBadge): a quiet note when a 小節 is marked as read,
// the 過關測驗 score, and a badge card + confetti the first time a 關卡 is complete.
// Mounted once in the root layout. Sits at the top (below the mobile bar / top-right on desktop),
// clear of the reading tools (bottom-right) and the companion (bottom-left).

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Mascot from "@/components/mascot/Mascot";
import { CHAPTERS, CHAPTER_BY_ID } from "@/content/course/chapters";
import { badgeName, chapterStatus, getProgress, onCourseEvent, type CourseEvent } from "@/lib/course/progress";
import type { ChapterId, CourseProgress, Mood } from "@/lib/course/types";
import BadgeArt from "./BadgeArt";
import { confetti } from "./confetti";

type Toast =
  | { id: number; kind: "note"; mood: Mood; title: string; body?: string; ms: number }
  | { id: number; kind: "badge"; chapter: ChapterId; ms: number };

let nextId = 1;

function describe(e: CourseEvent, p: CourseProgress): Toast | null {
  const id = nextId++;
  if (e.type === "seen") {
    const ch = CHAPTER_BY_ID[e.chapter];
    const s = ch.sections.find((x) => x.id === e.section);
    const st = chapterStatus(p, ch);
    const all = st.seen === st.sections;
    return {
      id,
      kind: "note",
      mood: all ? "wow" : "happy",
      title: `✓ ${s?.title ?? e.section}`,
      body: all && st.hasQuiz && !st.quiz ? `${ch.tag} 小節全部看完了，剩下過關測驗！` : `${ch.tag} 進度 ${st.seen} / ${st.sections}`,
      ms: 2600,
    };
  }
  if (e.type === "quiz") {
    const { correct, total } = e.result;
    if (correct === total) return { id, kind: "note", mood: "wow", title: `滿分！${correct} / ${total}`, body: "小弓：「正中靶心，漂亮。」", ms: 3600 };
    if (correct >= total * 0.6) return { id, kind: "note", mood: "happy", title: `過關！${correct} / ${total}`, body: "錯的題目回去讀一次那一節就懂了。", ms: 3400 };
    return { id, kind: "note", mood: "oops", title: `${correct} / ${total}`, body: "沒關係，按「重做」再射一輪。", ms: 3400 };
  }
  if (e.type === "badge") return { id, kind: "badge", chapter: e.chapter, ms: 9000 };
  return { id, kind: "note", mood: "bow", title: "進度已清除", body: "所有小節、測驗與徽章都重新開始。", ms: 3000 };
}

function ToastShell({ toast, onClose, children, className = "" }: { toast: Toast; onClose: () => void; children: ReactNode; className?: string }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(onClose, toast.ms);
    return () => clearTimeout(t);
  }, [paused, toast.ms, onClose]);
  return (
    <div
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`course-pop pointer-events-auto rounded-2xl border bg-surface shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

function BadgeToast({ chapter, onClose }: { chapter: ChapterId; onClose: () => void }) {
  const ch = CHAPTER_BY_ID[chapter];
  const idx = CHAPTERS.indexOf(ch);
  const next = CHAPTERS[idx + 1];
  return (
    <div className="relative flex flex-col items-center gap-1 p-5 text-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="關閉"
        className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full text-lg text-muted hover:bg-surface-2"
      >
        ×
      </button>
      <BadgeArt chapter={chapter} tag={ch.tag} on className="course-badge-in h-auto w-28" />
      <p className="mt-1 text-xs tracking-[0.2em] text-wood">解鎖徽章</p>
      <p className="text-xl font-bold">{badgeName(ch)}</p>
      {ch.badge.line && <p className="text-sm leading-relaxed text-muted">{ch.badge.line}</p>}
      <p className="text-sm leading-relaxed text-muted">「{ch.title}」的小節和測驗都完成了，徽章掛到首頁的徽章牆上了。</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Link href="/#badges" onClick={onClose} className="inline-flex min-h-11 items-center rounded-xl border border-field-border px-4 text-sm font-semibold text-ink no-underline hover:bg-surface-2">
          看徽章牆
        </Link>
        {next && (
          <Link href={next.href} onClick={onClose} className="inline-flex min-h-11 items-center rounded-xl bg-ink px-4 text-sm font-semibold text-paper no-underline hover:bg-ink/85">
            下一關：{next.title} ▶
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CourseToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const push = (t: Toast) => setToasts((list) => [...list, t].slice(-3));
    const off = onCourseEvent((e) => {
      // Events fire after the store commits, so the snapshot already includes this change.
      const t = describe(e, getProgress());
      if (!t) return;
      if (t.kind === "badge") {
        // Let the score toast land first, then celebrate.
        timers.push(
          setTimeout(() => {
            push(t);
            confetti(innerWidth / 2, innerHeight * 0.35, 120);
          }, 900),
        );
      } else {
        push(t);
        if (e.type === "quiz" && e.result.correct === e.result.total) confetti(innerWidth / 2, innerHeight * 0.3, 90);
      }
    });
    return () => {
      off();
      timers.forEach(clearTimeout);
    };
  }, []);

  const close = (id: number) => setToasts((list) => list.filter((t) => t.id !== id));

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-[calc(var(--header-h)+0.75rem)] z-[60] flex flex-col items-center gap-2 sm:left-auto sm:items-end lg:top-4 print:hidden"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => close(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  // Stable callback per item so the timer doesn't restart on every parent render.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  const [stableClose] = useState(() => () => closeRef.current());

  if (toast.kind === "badge")
    return (
      <ToastShell toast={toast} onClose={stableClose} className="w-full max-w-sm border-2 border-vermilion/60">
        <BadgeToast chapter={toast.chapter} onClose={stableClose} />
      </ToastShell>
    );
  return (
    <ToastShell toast={toast} onClose={stableClose} className="flex max-w-sm items-center gap-2.5 border-wood/50 py-2 pr-4 pl-2">
      <Mascot mood={toast.mood} size={40} />
      <div className="min-w-0 text-sm leading-snug">
        <p className="font-bold">{toast.title}</p>
        {toast.body && <p className="text-muted">{toast.body}</p>}
      </div>
    </ToastShell>
  );
}
