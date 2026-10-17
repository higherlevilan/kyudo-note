import Link from "next/link";
import NavLinks from "./NavLinks";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 h-[var(--header-h)] border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex max-w-5xl h-full items-center justify-between gap-3 px-4">
        <Link href="/" className="group flex min-w-0 items-baseline gap-2 no-underline">
          <span className="text-lg font-bold tracking-wide text-ink">弓道學習筆記</span>
          <span className="hidden text-xs tracking-[0.2em] text-muted uppercase sm:inline">Kyudo Note</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
