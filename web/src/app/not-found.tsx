import type { Metadata } from "next";
import Link from "next/link";
import Kasumi from "@/components/home/Kasumi";
import { CHAPTERS, TOOLS } from "@/content/course/chapters";

const LINKS = [...CHAPTERS.map((c) => ({ href: c.href, label: `${c.stage}・${c.title}` })), ...TOOLS.map((t) => ({ href: t.href, label: t.label }))];

export const metadata: Metadata = {
  title: "找不到頁面",
  description: "這個網址沒有對應的頁面。可以回到首頁，或從入門指南、射法八節、禮法、裝備等單元重新開始。",
  // Next.js adds <meta name="robots" content="noindex"> to not-found pages itself.
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-8">
      <section className="grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[auto_1fr]">
        {/* The arrow landed outside the target: 霞的 with a vermilion hole beyond the rim. */}
        <div aria-hidden="true" className="relative mx-auto h-40 w-40 sm:h-52 sm:w-52 md:mx-0">
          <Kasumi className="h-full w-full opacity-90" />
          <span className="absolute -top-1 -right-3 h-4 w-4 rounded-full bg-vermilion ring-4 ring-paper sm:-right-5" />
        </div>

        <div>
          <p className="text-sm tracking-[0.2em] text-wood">
            404・<span lang="ja">外れ（はずれ）</span>
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">這一箭沒有中的</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            你要找的頁面不存在，可能已經移動，或是網址有誤。調整呼吸、重新搭箭，從首頁或下面任一個單元再出發。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper no-underline hover:opacity-90">
              回到首頁
            </Link>
            <Link
              href="/guide/"
              className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink no-underline hover:bg-surface-2"
            >
              從序章開始
            </Link>
          </div>
        </div>
      </section>

      <nav aria-labelledby="nf-sections" className="border-t border-line pt-8">
        <h2 id="nf-sections" className="text-lg font-bold">
          修煉路線與工具
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-ink no-underline hover:bg-surface-2"
              >
                {item.label}
                <span aria-hidden="true" className="text-muted">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
