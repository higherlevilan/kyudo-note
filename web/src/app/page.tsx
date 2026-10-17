import Link from "next/link";
import Kasumi from "@/components/home/Kasumi";
import WordOfDay from "@/components/home/WordOfDay";

type Module = { href: string; title: string; ja: string; desc: string };

const MODULES: Module[] = [
  { href: "/guide/", title: "入門指南", ja: "はじめに", desc: "第一次去道場、在台灣哪裡學、練習進程、安全、費用與審查。" },
  { href: "/shaho/", title: "射法八節", ja: "射法八節", desc: "足踏み到残心的八個步驟，每一節分入門與深入兩層。" },
  { href: "/etiquette/", title: "禮法與體配", ja: "体配", desc: "基本姿勢與動作、坐射與立射流程、矢取り、道場禮儀。" },
  { href: "/equipment/", title: "裝備百科", ja: "弓具", desc: "弓、矢、弽、弦、服裝與保養，附矢尺計算與預算試算。" },
  { href: "/culture/", title: "文化與哲學", ja: "射の心", desc: "歷史年表、流派系譜、射義與真善美、弓與禪的真相。" },
  { href: "/glossary/", title: "日文詞彙庫", ja: "用語", desc: "約 260 條術語，漢字、假名、羅馬拼音、中文都能搜尋。" },
  { href: "/faq/", title: "問題研究中心", ja: "問答", desc: "各單元的常見問題集中在這裡，每一題都附資料來源。" },
  { href: "/journal/", title: "個人學習日誌", ja: "稽古帳", desc: "記錄練習、課程筆記、審查、裝備採購與文化體驗。" },
  { href: "/practice/", title: "互動練習", ja: "練習", desc: "八節排序、詞彙閃卡、迷思是非題、體配情境題與初段學科練習。" },
];

const PATHS = [
  {
    who: "還沒碰過弓",
    steps: [
      { href: "/guide/", label: "入門指南" },
      { href: "/etiquette/", label: "道場禮儀" },
      { href: "/shaho/", label: "射法八節" },
    ],
  },
  {
    who: "已經在道場練習",
    steps: [
      { href: "/shaho/", label: "射法八節（深入）" },
      { href: "/equipment/", label: "選弓具" },
      { href: "/journal/", label: "開始記錄" },
    ],
  },
  {
    who: "準備審查、想更深入",
    steps: [
      { href: "/etiquette/", label: "審查體配" },
      { href: "/culture/", label: "射義與歷史" },
      { href: "/faq/", label: "問題研究中心" },
    ],
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[1fr_auto]">
        <div>
          <p lang="ja" className="text-sm tracking-[0.3em] text-wood">
            弓道
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">弓道學習筆記</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            從第一次握弓到資深修練，慢慢累積屬於你的弓道成長紀錄。技術與禮法以全日本弓道連盟（ANKF）的公開資料為準，
            每個說法都標出依據：官方、指導書，還是坊間常見說法。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/guide/" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper no-underline hover:opacity-90">
              從入門指南開始
            </Link>
            <Link
              href="/shaho/"
              className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink no-underline hover:bg-surface-2"
            >
              射法八節
            </Link>
          </div>
        </div>
        <figure className="mx-auto w-40 sm:w-52 md:w-60">
          <Kasumi className="h-auto w-full drop-shadow-sm" />
          <figcaption className="mt-2 text-center text-xs text-muted">
            <span lang="ja">霞的</span>：直徑 36 公分，依競技規則的比例繪製
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="paths" className="pb-10">
        <h2 id="paths" className="mb-4 text-xl font-bold">
          從哪裡開始？
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {PATHS.map((p) => (
            <li key={p.who} className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-semibold">{p.who}</p>
              <ol className="mt-3 space-y-2 text-sm">
                {p.steps.map((s, i) => (
                  <li key={s.label} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wood-soft text-xs text-ink">{i + 1}</span>
                    <Link href={s.href} className="text-ink underline decoration-line hover:text-wood">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="modules" className="pb-10">
        <h2 id="modules" className="mb-4 text-xl font-bold">
          內容單元
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className="block h-full rounded-2xl border border-line bg-surface p-5 text-ink no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-wood hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <p lang="ja" className="text-sm text-wood">
                  {m.ja}
                </p>
                <h3 className="mt-1 text-lg font-bold">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 pb-6 md:grid-cols-2">
        <WordOfDay />
        <blockquote className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs tracking-[0.2em] text-wood">禮記・射義</p>
          <p className="mt-2 text-lg leading-relaxed">
            射者，仁之道也。射求正諸己，己正而後發；發而不中，則不怨勝己者，反求諸己而已矣。
          </p>
          <footer className="mt-3 text-sm text-muted">
            射箭是向自己要求端正：先端正自己再放箭，射不中也不怨勝過自己的人，只回頭找自己的原因。
            <Link href="/culture/" className="ml-1 text-wood underline">
              讀更多
            </Link>
          </footer>
        </blockquote>
      </section>
    </div>
  );
}
