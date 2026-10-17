import type { Metadata } from "next";
import { FAQS, PAGE_SOURCES, POSTLUDE, PRELUDE, SECTIONS } from "@/content/shaho";
import { KIND_LABEL, SOURCES } from "@/content/sources";
import { SeekProvider } from "@/components/shaho/SeekContext";
import ViewerLoader from "@/components/shaho/ViewerLoader";
import { PointList, SectionCard } from "@/components/shaho/SectionBlocks";
import { MOTION_DATA_URL, readMotionMeta } from "@/lib/shaho/meta.server";
import QuickCheck from "@/components/practice/QuickCheck";
import { QUICKCHECKS } from "@/content/practice/quickchecks";
import HassetsuStrip from "@/components/illustrations/archer/HassetsuStrip";

export const metadata: Metadata = {
  title: "射法八節",
  description: "弓道射法八節（足踏み、胴造り、弓構え、打起し、引分け、会、離れ、残心）的 3D 示範與中文說明，以全日本弓道連盟公開資料為準。",
};

export default function ShahoPage() {
  const meta = readMotionMeta();
  return (
    <SeekProvider>
      <div className="mx-auto max-w-5xl px-4">
        <header className="pt-10 pb-6">
          <p className="text-sm text-wood">基本動作</p>
          <h1 className="mt-1 text-3xl font-bold">
            射法八節 <span lang="ja" className="ml-1 text-xl font-normal text-muted">しゃほうはっせつ</span>
          </h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">
            射一支箭的八個步驟：足踏み、胴造り、弓構え、打起し、引分け、会、離れ、残心。
            每一節的說明分「入門」與「深入」兩層，並附上示範影片中對應的片段。
          </p>
          <nav aria-label="各節" className="mt-4 flex flex-wrap gap-1.5 text-sm">
            {[PRELUDE, ...SECTIONS, POSTLUDE].map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                lang="ja"
                className="rounded-full border border-line bg-surface px-3 py-1 text-ink no-underline hover:bg-surface-2"
              >
                {s.no != null && <span className="mr-1 text-xs text-muted">{s.no}</span>}
                {s.term}
              </a>
            ))}
            <a href="#faq" className="rounded-full border border-line bg-surface px-3 py-1 text-ink no-underline hover:bg-surface-2">
              常見問題
            </a>
          </nav>
        </header>

        <HassetsuStrip />

        <details className="group rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <summary className="flex items-center justify-between gap-3 font-semibold">
            <span>
              3D 動作參考 <span className="ml-1 rounded-full border border-line px-2 py-0.5 text-xs font-normal text-muted">實驗中</span>
            </span>
            <span aria-hidden="true" className="chev text-wood">
              ›
            </span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            依一段真人示範的動作重建的人形，只用來理解八節的順序與大致姿勢；細節請以文字說明與指導者為準。
          </p>
          <div className="mt-4">
            <ViewerLoader dataUrl={MOTION_DATA_URL} />
          </div>
        </details>

        <section aria-labelledby="steps" className="mt-12">
          <h2 id="steps" className="mb-4 text-2xl font-bold">
            八節說明
          </h2>
          <div className="space-y-5">
            <SectionCard s={PRELUDE} meta={meta} />
            {SECTIONS.map((s) => (
              <SectionCard key={s.id} s={s} meta={meta} />
            ))}
            <SectionCard s={POSTLUDE} meta={meta} />
          </div>
        </section>

        <QuickCheck set={QUICKCHECKS.shaho} />

        <section id="faq" aria-labelledby="faq-title" className="mt-12 scroll-mt-20">
          <h2 id="faq-title" className="mb-4 text-2xl font-bold">
            常見問題
          </h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex items-start justify-between gap-3 font-semibold">
                  <span>{f.q}</span>
                  <span aria-hidden="true" className="chev mt-0.5 text-wood">
                    ›
                  </span>
                </summary>
                <div className="mt-3 text-[15px]">
                  <PointList points={f.a} />
                </div>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="sources" className="mt-12">
          <h2 id="sources" className="mb-3 text-xl font-bold">
            資料來源
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-muted">
            技術說明以全日本弓道連盟（ANKF）官網與指導書為準；本頁文字為中文改寫，只引用必要的短句。
            標示「坊間常見說法」的數字沒有官方出處；「指導書」是日本武道協議會《少年少女武道指導書 弓道》，屬教學教材，不等於射法規定。
            中文節名參考臺灣弓道協會的對照。
          </p>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            {PAGE_SOURCES.map((k) => (
              <li key={k}>
                <a href={SOURCES[k].url} target="_blank" rel="noopener noreferrer" className="text-wood underline">
                  {SOURCES[k].label}
                </a>
                <span className="ml-2 text-xs text-muted">{KIND_LABEL[SOURCES[k].kind]}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </SeekProvider>
  );
}
