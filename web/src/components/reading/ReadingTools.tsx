"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reading aids for the long article pages, built for one-handed phone use:
 * a progress bar under the top bar, a floating 「目錄」 button that opens a sheet with
 * the page's sections (current one highlighted), expand/collapse all 深入 layers,
 * a text-size setting (remembered on this device), and back-to-top.
 * On lg+ the course sidebar already lists the sections, so the button becomes 「閱讀設定」
 * and the sheet shows only the settings. Stays bottom-right; 小弓 (Companion) owns bottom-left.
 */

// Pages that are apps rather than articles, or too short to need it.
const SKIP = ["/journal", "/practice", "/form-check"];
const SIZES = [
  { key: "s", label: "小", scale: "93.75%" },
  { key: "m", label: "標準", scale: "100%" },
  { key: "l", label: "大", scale: "112.5%" },
] as const;
type SizeKey = (typeof SIZES)[number]["key"];
const SIZE_KEY = "kyudo-note:text-size";

type Heading = { id: string; label: string };

function collectHeadings(): Heading[] {
  const main = document.querySelector("main");
  if (!main) return [];
  const out: Heading[] = [];
  main.querySelectorAll("h2").forEach((h) => {
    // A course 小節 is the section itself (its h2 carries an id only for aria-labelledby).
    const target = h.closest<HTMLElement>("[data-course-section]") ?? (h.id ? h : h.closest<HTMLElement>("[id]"));
    const label = h.textContent?.trim();
    if (target?.id && label && !out.some((o) => o.id === target.id)) out.push({ id: target.id, label });
  });
  return out;
}

function readSize(): SizeKey {
  if (typeof window === "undefined") return "m";
  try {
    const saved = localStorage.getItem(SIZE_KEY);
    return SIZES.some((s) => s.key === saved) ? (saved as SizeKey) : "m";
  } catch {
    return "m";
  }
}

function applySize(key: SizeKey) {
  const s = SIZES.find((x) => x.key === key) ?? SIZES[1];
  document.documentElement.style.fontSize = s.scale;
}

export default function ReadingTools() {
  const pathname = usePathname() ?? "/";
  const skip = pathname === "/" || SKIP.some((p) => pathname.startsWith(p));

  const barRef = useRef<HTMLDivElement>(null);
  const tocButton = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  // The size only shows inside the sheet (client-only), so reading storage here can't mismatch.
  const [size, setSize] = useState<SizeKey>(readSize);

  // Re-apply the saved text size on every page, including skipped ones.
  useEffect(() => {
    applySize(size);
  }, [size]);

  const chooseSize = (key: SizeKey) => {
    setSize(key);
    try {
      localStorage.setItem(SIZE_KEY, key);
    } catch {
      /* ignore */
    }
  };

  // Headings, scroll progress, back-to-top, current section.
  useEffect(() => {
    if (skip) return;
    const list = collectHeadings();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        const p = max > 0 ? Math.min(1, scrollY / max) : 0;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        setShowTop(scrollY > 900);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    list.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname, skip]);

  const close = useCallback(() => {
    setOpen(false);
    tocButton.current?.focus();
  }, []);

  // Sheet: Escape closes, focus moves in, Tab stays inside.
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    sheet?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab" && sheet) {
        const items = [...sheet.querySelectorAll<HTMLElement>("button, a")];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const setDeep = (expand: boolean) => {
    document.querySelectorAll<HTMLDetailsElement>('main details[data-layer="deep"]').forEach((d) => (d.open = expand));
  };

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  if (skip) return null;

  const fab =
    "flex h-12 items-center gap-1.5 rounded-full border border-line bg-surface/95 px-4 text-sm font-medium text-ink shadow-lg backdrop-blur hover:border-wood";

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-[var(--header-h)] z-30 h-0.5 lg:left-[var(--side-w)]">
        <div ref={barRef} className="h-full origin-left bg-wood" style={{ transform: "scaleX(0)" }} />
      </div>

      <div className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex flex-col items-end gap-2 print:hidden">
        {showTop && (
          <button
            type="button"
            onClick={() => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
            className={`${fab} w-12 justify-center px-0`}
            aria-label="回到頂端"
          >
            ↑
          </button>
        )}
        <button
          ref={tocButton}
          type="button"
          onClick={() => {
            setHeadings(collectHeadings());
            setOpen(true);
          }} aria-haspopup="dialog" aria-expanded={open} className={fab}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current lg:hidden">
            <path d="M2 3h2v2H2zm4 0h8v2H6zM2 7h2v2H2zm4 0h8v2H6zm-4 4h2v2H2zm4 0h8v2H6z" />
          </svg>
          <span className="lg:hidden">目錄</span>
          <span aria-hidden="true" className="hidden font-bold lg:inline">
            Aa
          </span>
          <span className="hidden lg:inline">閱讀設定</span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center print:hidden">
          <button type="button" aria-label="關閉目錄" tabIndex={-1} onClick={close} className="absolute inset-0 bg-ink/40" />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="本頁目錄與閱讀設定"
            className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border border-line bg-paper p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-3xl"
          >
            <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-line sm:hidden" />
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                <span className="lg:hidden">本頁目錄</span>
                <span className="hidden lg:inline">閱讀設定</span>
              </h2>
              <button type="button" onClick={close} className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-muted hover:bg-surface-2" aria-label="關閉">
                ×
              </button>
            </div>
            {headings.length > 0 ? (
              <ol className="mt-2 space-y-1 lg:hidden">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(h.id);
                      }}
                      aria-current={active === h.id ? "location" : undefined}
                      className={`flex min-h-11 items-center rounded-xl px-3 no-underline ${
                        active === h.id ? "bg-wood-soft font-semibold text-ink" : "text-ink hover:bg-surface-2"
                      }`}
                    >
                      {h.label}
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-sm text-muted lg:hidden">這一頁沒有分段標題。</p>
            )}

            <div className="mt-5 border-t border-line pt-4 lg:mt-3 lg:border-t-0 lg:pt-0">
              <p className="text-sm font-semibold text-muted">深入說明</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setDeep(true)} className="min-h-11 rounded-xl border border-field-border bg-surface text-sm text-ink hover:bg-surface-2">
                  全部展開
                </button>
                <button type="button" onClick={() => setDeep(false)} className="min-h-11 rounded-xl border border-field-border bg-surface text-sm text-ink hover:bg-surface-2">
                  全部收合
                </button>
              </div>
              <p className="mt-4 text-sm font-semibold text-muted">文字大小</p>
              <div role="group" aria-label="文字大小" className="mt-2 grid grid-cols-3 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    aria-pressed={size === s.key}
                    onClick={() => chooseSize(s.key)}
                    className={`min-h-11 rounded-xl border text-sm ${
                      size === s.key ? "border-ink bg-ink text-paper" : "border-field-border bg-surface text-ink hover:bg-surface-2"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
