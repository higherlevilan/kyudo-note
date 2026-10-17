import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import glossary from "@/content/glossary.json";
import GlossarySearch from "@/components/glossary/GlossarySearch";
import { TERMINOLOGY_URL, type GlossaryEntry } from "@/lib/glossary";

export const metadata: Metadata = pageMetadata({
  path: "/glossary/",
  title: "日文詞彙庫",
  description:
    "弓道術語的漢字、假名、羅馬拼音與中文解釋，可用任一種寫法搜尋。讀音與定義以全日本弓道連盟〈弓道用語辞典〉為準。",
  og: "glossary",
});

const entries = glossary as GlossaryEntry[];
const categories = [...new Set(entries.map((e) => e.category))];

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <header className="pt-10 pb-4">
        <p className="text-sm text-wood">日文詞彙庫</p>
        <h1 className="mt-1 text-3xl font-bold">
          弓道用語 <span lang="ja" className="ml-1 text-xl font-normal text-muted">きゅうどうようご</span>
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          收錄 {entries.length} 條射法、體配、弓具、道場、審查與思想相關的術語。標示「官方辭典」的詞條，讀音與定義已和
          <a href={TERMINOLOGY_URL} target="_blank" rel="noopener noreferrer" className="mx-1 text-wood underline">
            全日本弓道連盟〈弓道用語辞典〉
          </a>
          核對；中文解釋是本站依官方定義改寫。羅馬拼音用赫本式加長音符號，搜尋時有沒有長音符號都可以。
        </p>
      </header>
      <GlossarySearch entries={entries} categories={categories} />
    </div>
  );
}
