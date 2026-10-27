import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import Kasumi from "@/components/home/Kasumi";
import WordOfDay from "@/components/home/WordOfDay";
import { BadgeWall, HeroCta, Roadmap } from "@/components/home/CourseHome";
import BrushDivider from "@/components/illustrations/icons/BrushDivider";
import { CameraPoseIcon, type IconProps, KanjiIcon, NotebookIcon, QuestionIcon, TargetCheckIcon } from "@/components/illustrations/icons/ModuleIcons";
import Mascot from "@/components/mascot/Mascot";
import Say from "@/components/mascot/Say";
import { CHAPTERS, TOOLS } from "@/content/course/chapters";

export const metadata: Metadata = pageMetadata({ path: "/", title: SITE_NAME, description: SITE_DESCRIPTION, og: "home" });

const TOOL_INFO: Record<(typeof TOOLS)[number]["href"], { desc: string; Icon: (p: IconProps) => ReactNode }> = {
  "/glossary/": { desc: "約 260 條術語，漢字、假名、羅馬拼音、中文都能搜尋。", Icon: KanjiIcon },
  "/faq/": { desc: "各關卡的常見問題集中在這裡，每一題都附資料來源。", Icon: QuestionIcon },
  "/practice/": { desc: "八節排序、詞彙閃卡、迷思是非題、體配情境題與初段學科。", Icon: TargetCheckIcon },
  "/journal/": { desc: "記錄練習、課程筆記、審查、裝備採購與文化體驗。", Icon: NotebookIcon },
  "/form-check/": { desc: "在瀏覽器裡比對自己的八節姿勢；影片不會離開你的裝置。", Icon: CameraPoseIcon },
};

const HOWTO = [
  { k: "▶ 看動畫", t: "多數圖解都有「下一步」與「自動播放」，一個動作一個動作拆給你看。" },
  { k: "✋ 動手玩", t: "計算器、排序、點選與拖拉都會即時改變圖解；玩亂了就按重來。" },
  { k: "✓ 進度", t: "讀過的小節和測驗會自動記在這台瀏覽器，路線圖上的圓環會慢慢填滿。" },
];

const sectionCount = CHAPTERS.reduce((a, c) => a + c.sections.length, 0);

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="grid items-center gap-8 pt-10 pb-8 sm:pt-14 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm tracking-[0.2em] text-wood">
            <span lang="ja">弓道</span>・繁體中文學習路線
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-bold sm:text-5xl">
            歡迎來到
            <br />
            <span className="bg-[linear-gradient(transparent_62%,var(--wood-soft)_0)] text-wood">弓道學習筆記</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            從第一次走進道場，到射法八節、射癖、弓具與文化，整理成 {CHAPTERS.length} 個關卡、{sectionCount} 個小節。
            每個說法都標出依據：官方、指導書，還是坊間常見說法；技術與禮法以全日本弓道連盟（ANKF）的公開資料為準。
          </p>
          <HeroCta />
        </div>
        <figure className="mx-auto w-48 sm:w-56 md:w-64">
          <div className="relative">
            <Kasumi className="h-auto w-full drop-shadow-sm" />
            <Mascot mood="focus" size={104} className="absolute -bottom-2 -left-12 sm:-left-14" />
          </div>
          <figcaption className="mt-4 text-center text-xs text-muted">
            <span lang="ja">霞的</span>：直徑 36 公分，依競技規則的比例繪製
          </figcaption>
        </figure>
      </section>

      <Say mood="happy" className="mb-10">
        嗨，我是<b>小弓</b>，這裡的導覽員。每一關我都會在旁邊提醒重點；看不懂就多按幾次「下一步」，圖解不會累。
        讀完一關、交了過關測驗，就能在下面的徽章牆收集一枚徽章。
      </Say>

      <section id="roadmap" aria-labelledby="roadmap-h" className="scroll-mt-20 pb-10">
        <h2 id="roadmap-h" className="text-2xl font-bold">
          修煉路線圖
        </h2>
        <p className="mt-1 mb-5 text-muted">照順序走最順，也可以直接跳到想看的關卡。</p>
        <Roadmap />
      </section>

      <section id="badges" aria-labelledby="badges-h" className="scroll-mt-20 pb-10">
        <h2 id="badges-h" className="text-2xl font-bold">
          徽章牆
        </h2>
        <p className="mt-1 mb-5 text-muted">每一關的小節全部讀完、過關測驗也交卷，就能解鎖一枚徽章。</p>
        <BadgeWall />
      </section>

      <section aria-label="怎麼使用這個網站" className="pb-10">
        <ul className="grid gap-3 sm:grid-cols-3">
          {HOWTO.map((h) => (
            <li key={h.k} className="rounded-2xl bg-surface-2 px-4 py-3.5">
              <p className="font-bold">{h.k}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{h.t}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tools-h" className="pb-10">
        <h2 id="tools-h" className="text-2xl font-bold">
          工具
        </h2>
        <p className="mt-1 mb-5 text-muted">不在路線上，但隨時用得到。</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => {
            const { desc, Icon } = TOOL_INFO[t.href];
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="flex h-full gap-3 rounded-2xl border border-line bg-surface p-4 text-ink no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-wood hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wood-soft/70 text-wood">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <b className="font-bold">{t.label}</b>
                      <small lang="ja" className="text-xs text-wood">
                        {t.ja}
                      </small>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{desc}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <BrushDivider className="pb-8" />

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
