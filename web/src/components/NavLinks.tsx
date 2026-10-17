"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/site";

function useActive() {
  const pathname = usePathname() ?? "/";
  return (href: string) => pathname.startsWith(href.replace(/\/$/, ""));
}

export default function NavLinks() {
  const isActive = useActive();
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);

  // While the menu is open: Escape or a press outside closes it.
  useEffect(() => {
    if (!open) return;
    const el = menu.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      el.open = false;
      el.querySelector("summary")?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!el.contains(e.target as Node)) el.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const linkClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 no-underline transition-colors ${
      active ? "bg-wood-soft text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
    }`;

  return (
    <>
      <nav aria-label="主要導覽" className="hidden shrink-0 items-center gap-0.5 text-sm lg:flex">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <details ref={menu} className="relative lg:hidden" onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M2 3.5h12v1.5H2zM2 7.25h12v1.5H2zM2 11h12v1.5H2z" />
          </svg>
          選單
        </summary>
        <nav
          aria-label="主要導覽"
          className="absolute right-0 z-40 mt-2 grid w-56 gap-0.5 rounded-2xl border border-line bg-surface p-2 text-[15px] shadow-lg"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl px-3 py-2 no-underline ${active ? "bg-wood-soft text-ink" : "text-ink hover:bg-surface-2"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </details>
    </>
  );
}
