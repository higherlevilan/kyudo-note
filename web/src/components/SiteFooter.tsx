import { REPO_URL } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface-2/50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>資料以全日本弓道連盟（ANKF）公開資料為準。流派與道場做法可能不同，請以所屬指導者為準。</p>
        <a href={REPO_URL} className="shrink-0 text-wood underline" target="_blank" rel="noopener noreferrer">
          GitHub：kyudo-note
        </a>
      </div>
    </footer>
  );
}
