"use client";

// Progress toasts (TechEDU ux.js toast/checkBadge): the 過關測驗 score, a badge card + confetti
// the first time a 關卡 is complete, and the reset note. Reading a 小節 has no toast: the ring and
// the 「✓ 已讀」 chip already show it, and on phones a toast per section covered the text.
// One polite live region holds plain items. The score toast is visual only (aria-hidden): the
// quiz panel's own live region announces the result, so it is not read twice.
// Mounted once in the root layout. Sits at the top (below the mobile bar / top-right on desktop),
// clear of the reading tools (bottom-right) and the companion (bottom-left).

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Mascot from "@/components/mascot/Mascot";
import { CHAPTER_BY_ID, nextChapter } from "@/content/course/registry";
import { badgeName, onCourseEvent, passScore, type CourseEvent } from "@/lib/course/progress";
import type { ChapterId, Mood } from "@/lib/course/types";
import BadgeArt from "./BadgeArt";
import { confetti } from "./confetti";

type Toast =
  | { id: number; kind: "note"; mood: Mood; title: string; body?: string; ms: number; silent?: boolean }
  | { id: number; kind: "badge"; chapter: ChapterId; ms: number };

let nextId = 1;

function describe(e: CourseEvent): Toast | null {
  if (e.type === "seen") return null;
  const id = nextId++;
  if (e.type === "quiz") {
    const { correct, total } = e.result;
    const need = passScore(total);
    const base = { id, kind: "note", ms: 3400, silent: true } as const;
    if (correct === total) return { ...base, mood: "wow", title: `滿分！${correct} / ${total}`, body: "小弓：「正中靶心，漂亮。」", ms: 3600 };
    if (correct >= need) return { ...base, mood: "happy", title: `過關！${correct} / ${total}`, body: "錯的題目回去讀一次那一節就懂了。" };
    return { ...base, mood: "oops", title: `${correct} / ${total}`, body: `再試一次就能過關：要答對 ${need} 題。` };
  }
  if (e.type === "badge") return { id, kind: "badge", chapter: e.chapter, ms: 9000 };
  return { id, kind: "note", mood: "bow", title: "進度已清除", body: "所有小節、測驗與徽章都重新開始。", ms: 3000 };
}

function ToastShell({
  toast,
  onClose,
  children,
  className = "",
}: {
  toast: Toast;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(onClose, toast.ms);
    return () => clearTimeout(t);
  }, [paused, toast.ms, onClose]);
  return (
    <div
      aria-hidden={toast.kind === "note" && toast.silent ? true : undefined}
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
  const next = nextChapter(chapter);
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
        <Link href="/#badges" prefetch={false} onClick={onClose} className="inline-flex min-h-11 items-center rounded-xl border border-field-border px-4 text-sm font-semibold text-ink no-underline hover:bg-surface-2">
          看徽章牆
        </Link>
        {next && (
          <Link href={next.href} prefetch={false} onClick={onClose} className="inline-flex min-h-11 items-center rounded-xl bg-ink px-4 text-sm font-semibold text-paper no-underline hover:bg-ink/85">
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
      const t = describe(e);
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
