// Site shell: the 課程目錄 sidebar on lg+ (fixed; the body is padded by --side-w), and the compact
// top bar + drawer below lg (NavLinks).
import CourseNav from "./course/CourseNav";
import NavLinks from "./NavLinks";

export default function SiteHeader() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-xl bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        跳到主要內容
      </a>
      <aside
        aria-label="課程目錄"
        className="fixed inset-y-0 left-0 z-40 hidden w-[var(--side-w)] overflow-y-auto overscroll-contain border-r border-line bg-surface lg:block print:hidden"
      >
        <CourseNav />
      </aside>
      <NavLinks />
    </>
  );
}
