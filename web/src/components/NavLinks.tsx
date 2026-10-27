"use client";

// Mobile shell (below lg): a compact sticky top bar with the menu button, brand and total
// progress ring, and a left drawer (<dialog>) holding the same 課程目錄 as the desktop sidebar.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Mascot from "@/components/mascot/Mascot";
import CourseNav, { useCurrentChapter } from "@/components/course/CourseNav";
import Ring from "@/components/course/Ring";
import { pct, totalFraction, useCourseProgress } from "@/lib/course/progress";

export default function NavLinks() {
  const dlg = useRef<HTMLDialogElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const p = useCourseProgress();
  const total = pct(totalFraction(p));
  const chapter = useCurrentChapter();

  const close = useCallback(() => dlg.current?.close(), []);

  // Close after navigating, and if the viewport grows into the sidebar layout.
  useEffect(() => {
    close();
  }, [pathname, close]);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  // showModal() runs before the drawer content mounts, so move focus once it is there:
  // the current chapter's link, else the first link.
  useEffect(() => {
    if (!open) return;
    const d = dlg.current;
    const el = d?.querySelector<HTMLElement>('a[aria-current="page"]') ?? d?.querySelector<HTMLElement>("a[href]");
    el?.focus();
  }, [open]);

  // No page scrolling behind the open drawer.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-30 flex h-[var(--header-h)] items-center gap-2.5 border-b border-line bg-paper/90 px-3 backdrop-blur supports-[backdrop-filter]:bg-paper/75 lg:hidden print:hidden">
        <button
          ref={menuBtn}
          type="button"
          aria-label="開啟課程目錄"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="course-drawer"
          onClick={() => {
            dlg.current?.showModal();
            setOpen(true);
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink hover:bg-surface-2"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M2 3.5h12v1.5H2zM2 7.25h12v1.5H2zM2 11h12v1.5H2z" />
          </svg>
        </button>
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 text-ink no-underline">
          <Mascot mood="happy" size={30} />
          <span className="truncate text-[16px] font-bold tracking-wide">弓道學習筆記</span>
          {chapter && (
            <span className="hidden shrink-0 rounded-md bg-wood-soft px-1.5 py-0.5 text-[11px] text-ink min-[400px]:inline">
              {chapter.tag} {chapter.title}
            </span>
          )}
        </Link>
        <Ring fraction={total / 100} size="sm" label={`總進度 ${total}%`}>
          {total}%
        </Ring>
      </div>

      <dialog
        ref={dlg}
        id="course-drawer"
        aria-label="課程目錄"
        onClose={() => {
          setOpen(false);
          // <dialog> normally restores focus to the menu button; make sure it doesn't fall to <body>.
          requestAnimationFrame(() => {
            const a = document.activeElement;
            if (!a || a === document.body) menuBtn.current?.focus();
          });
        }}
        onClick={(e) => e.target === dlg.current && close()}
        className="course-drawer fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-[min(86vw,20rem)] max-w-none overflow-y-auto border-0 border-r border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/50 lg:hidden"
      >
        {open && (
          <>
            <button
              type="button"
              onClick={close}
              aria-label="關閉課程目錄"
              className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted hover:bg-surface-2"
            >
              ×
            </button>
            <CourseNav onNavigate={close} />
          </>
        )}
      </dialog>
    </>
  );
}
