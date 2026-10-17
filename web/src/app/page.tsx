import Link from "next/link";

type Module = {
  title: string;
  ja?: string;
  desc: string;
  href?: string;
};

const MODULES: Module[] = [
  {
    title: "基本動作（射法八節）",
    ja: "射法八節",
    desc: "足踏み到残心的八個步驟，配合可旋轉的 3D 人形示範與入門、深入兩層說明。",
    href: "/shaho/",
  },
  {
    title: "日文詞彙庫",
    ja: "用語",
    desc: "約 260 條弓道術語：漢字、假名、羅馬拼音與中文解釋，可用任一種寫法搜尋。",
    href: "/glossary/",
  },
  { title: "文化與哲學", ja: "射の心", desc: "弓道的歷史由來、流派、禮法與精神（真・善・美、正射必中、射義）。" },
  { title: "入門指南", ja: "はじめに", desc: "從找道場、第一堂課，到初段審查的路徑。" },
  { title: "裝備百科", ja: "弓具", desc: "弓、矢、弽、弦、道衣與袴的選擇與保養，附常見問題與來源。" },
  { title: "個人學習日誌", ja: "稽古帳", desc: "記錄課程筆記、練習、裝備採購與文化體驗。" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="py-12 sm:py-16">
        <p lang="ja" className="text-sm tracking-[0.3em] text-wood">弓道</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">弓道學習筆記</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          從第一次握弓到資深修練，慢慢累積屬於你的弓道成長紀錄。
          這裡以繁體中文整理弓道（きゅうどう）的技術、禮法與詞彙；技術內容以全日本弓道連盟（ANKF）
          《弓道教本》與官方公開資料為準，坊間說法會另外標示。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/shaho/"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper no-underline hover:opacity-90"
          >
            從射法八節開始
          </Link>
          <Link
            href="/glossary/"
            className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink no-underline hover:bg-surface-2"
          >
            查詞彙
          </Link>
        </div>
      </section>

      <section aria-labelledby="modules" className="pb-8">
        <h2 id="modules" className="mb-4 text-xl font-bold">
          內容模塊
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => {
            const body = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{m.title}</h3>
                  {m.href ? (
                    <span className="shrink-0 rounded-full bg-wood-soft px-2.5 py-0.5 text-xs text-ink">開放中</span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">準備中</span>
                  )}
                </div>
                {m.ja && (
                  <p lang="ja" className="mt-1 text-sm text-wood">
                    {m.ja}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-muted">{m.desc}</p>
              </>
            );
            return (
              <li key={m.title}>
                {m.href ? (
                  <Link
                    href={m.href}
                    className="block h-full rounded-2xl border border-line bg-surface p-5 text-ink no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-wood hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {body}
                  </Link>
                ) : (
                  <div aria-disabled="true" className="h-full rounded-2xl border border-dashed border-line bg-surface/60 p-5 opacity-80">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
