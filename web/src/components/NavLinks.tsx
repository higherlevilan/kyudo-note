"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

export default function NavLinks() {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label="主要導覽" className="flex shrink-0 items-center gap-1 text-sm">
      {NAV.map((item) => {
        const active = pathname.startsWith(item.href.replace(/\/$/, ""));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 no-underline transition-colors ${
              active ? "bg-wood-soft text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
