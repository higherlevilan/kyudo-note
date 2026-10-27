import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Callout, FaqList, PointList, SourceList, TagBadge } from "@/components/content/Blocks";
import ChapterHero from "@/components/course/ChapterHero";
import CourseSection from "@/components/course/CourseSection";
import ChapterQuiz from "@/components/course/ChapterQuiz";
import ChapterEnd from "@/components/course/ChapterEnd";
import FaultCard from "@/components/shaguse/FaultCard";
import FaultTimeline from "@/components/shaguse/FaultTimeline";
import MaeUshiro from "@/components/shaguse/MaeUshiro";
import YadokoroDiagnosis from "@/components/shaguse/YadokoroDiagnosis";
import YadokoroTable from "@/components/shaguse/YadokoroTable";
import {
  ASK_INSTRUCTOR,
  collectSources,
  DISPUTES,
  FAULTS,
  HANARE_FAULTS,
  MAE_USHIRO,
  SHAGUSE_FAQS,
  VIDEO_EVIDENCE,
  VIDEO_HOW,
  VIDEO_SAFETY,
  WHAT_IS,
} from "@/content/shaguse";
import type { Tag } from "@/content/types";

export const metadata: Metadata = pageMetadata({
  path: "/shaguse/",
  title: "射癖與矢所",
  description:
    "早気、もたれ、びく、ゆすり、緩み、弓返り、筈こぼれ、弦打到臉或手臂、手の内問題的中文整理，附研究證據（樣本數與限制）與矢所診斷工具。改善法多屬一般指導說法，請以指導者為準。",
  og: "shaguse",
});

const LEGEND: { tag: Tag; text: string }[] = [
  { tag: "official", text: "全日本弓道連盟（全弓連）的用語辭典、官網、通知" },
  { tag: "guide", text: "日本武道協議會《少年少女武道指導書 弓道》（公家出版，準官方）" },
  { tag: "research", text: "學術研究或學會摘要；會寫出樣本數與限制" },
  { tag: "folk", text: "指導者的經驗傳承、社團與網路文章；沒有研究證據" },
  { tag: "note", text: "本站整理或建議" },
  { tag: "disputed", text: "說法不一、定義依來源而異、待查證" },
];

const RELATED = [
  { href: "/shaho/", label: "射法八節", text: "會、離れ、殘心各節的官方說明" },
  { href: "/equipment/", label: "裝備百科", text: "矢束、弓力、中仕掛：先排除弓具的問題" },
  { href: "/guide/", label: "入門指南", text: "練習進程與自主練習的安全" },
  { href: "/journal/", label: "稽古帳", text: "記下每次出現的射癖與矢所" },
  { href: "/practice/", label: "互動練習", text: "用小測驗複習術語與射法" },
  { href: "/faq/", label: "問題研究中心", text: "各單元的常見問題總整理" },
];

const QUIPS = new Set(["hayake", "yurumi", "harau", "tenouchi"]);

const JA_SHAGUSE = (
  <span lang="ja" className="text-ink">
    射癖
  </span>
);

export default function ShagusePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <ChapterHero chapter="shaguse">
        <p>
          {JA_SHAGUSE}（しゃぐせ）是射法上的習慣性毛病，像是還沒到「會」就放掉的早気、放不出去的もたれ；矢所（やどころ）是箭落在哪裡。
          本關整理九種常見射癖的定義、目前的研究證據，以及常聽到的改善說法，並附一個矢所對照工具。
        </p>
        <p className="mt-2">
          先講結論：<strong className="text-ink">射癖的研究證據很薄</strong>，多半是小樣本的問卷與個案，沒有任何隨機對照試驗驗證過矯正法。
          所以本頁的改善法除非標出「研究」，都是<strong className="text-ink">一般指導說法</strong>。真正要改，請讓指導者看你實際的射。
        </p>
      </ChapterHero>

      {/* ───────── 先讀這裡 ───────── */}
      <CourseSection chapter="shaguse" id="about" lead="射癖是什麼、為什麼要先問指導者，以及本頁的標籤怎麼讀。" quip>
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">射癖是什麼</h3>
              <div className="text-[15px]">
                <PointList points={WHAT_IS} />
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">為什麼要先問指導者</h3>
              <div className="text-[15px]">
                <PointList points={ASK_INSTRUCTOR} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <h3 className="mb-1 text-lg font-semibold">
              <TagBadge tag="guide" />
              指導書列出的五種離れ癖
            </h3>
            <p className="mb-3 text-sm text-muted">指導書在「進一步的階段」列出這五種，並提醒要讓學習者主動思考成因。</p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {HANARE_FAULTS.map((h) => (
                <li key={h.ja} className="rounded-xl border border-line bg-paper/40 px-3 py-2">
                  <span lang="ja" className="font-semibold">
                    {h.anchor ? (
                      <a href={`#${h.anchor}`} className="text-ink underline decoration-line hover:text-wood">
                        {h.ja}
                      </a>
                    ) : (
                      h.ja
                    )}
                  </span>
                  <span lang="ja" className="ml-1.5 text-sm text-muted">
                    {h.kana}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed">{h.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">標籤怎麼讀</h3>
            <ul className="grid gap-1.5 text-[15px] sm:grid-cols-2">
              {LEGEND.map((l) => (
                <li key={l.tag}>
                  <TagBadge tag={l.tag} />
                  {l.text}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              每張卡片分兩層：「入門」是白話的定義與感覺；「深入」是研究證據（樣本數、方法、限制）、常聽到的改善說法，以及什麼時候要找人幫忙。
              《弓道教本》沒有公開的網路全文，本頁引用的全弓連網頁都註明以教本為參考，但不等於教本原文。
            </p>
          </div>

          <div>
            <h3 className="mb-1 text-lg font-semibold">一張圖看懂：會的前後出了什麼事</h3>
            <p className="mb-3 text-sm leading-relaxed text-muted">
              早気、もたれ、びく、ゆすり、緩み都發生在引分け到離れ之間。先看沒有射癖時的樣子，再一個一個比較。
            </p>
            <FaultTimeline />
          </div>

          <p className="text-sm leading-relaxed text-muted">下面九個小節各是一種射癖；點「深入」看研究證據、常聽到的改善說法，以及什麼時候要找人幫忙。</p>
        </div>
      </CourseSection>

      {/* ───────── 射癖 ───────── */}
      {FAULTS.map((f) => (
        <CourseSection key={f.section.id} chapter="shaguse" id={f.section.id} quip={QUIPS.has(f.section.id)}>
          <FaultCard f={f} />
        </CourseSection>
      ))}

      {/* ───────── 矢所 ───────── */}
      <CourseSection
        chapter="shaguse"
        id="yadokoro"
        lead="箭老是偏向同一邊時，常聽到哪些原因？下面先說明「前」「後」的意思，再讓你點選方向查看。"
        quip
      >
        <div className="space-y-5">
          <Callout tone="warn" title="「前」「後」是一般說法">
            <PointList points={MAE_USHIRO} />
          </Callout>
          <MaeUshiro />
          <YadokoroDiagnosis />
          <details className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
            <summary className="flex min-h-11 items-center gap-1.5 font-semibold text-wood">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="chev h-3.5 w-3.5 fill-current">
                <path d="M5.5 3 10.5 8l-5 5-1-1 4-4-4-4 1-1Z" />
              </svg>
              完整對照表
            </summary>
            <div className="mt-3">
              <YadokoroTable />
              <p className="mt-2 text-sm leading-relaxed text-muted">
                表格是歸納整理，不是診斷工具。研究證據只能支持表中少數項目，已逐項標出。
              </p>
            </div>
          </details>
        </div>
      </CourseSection>

      {/* ───────── 錄影 ───────── */}
      <CourseSection
        chapter="shaguse"
        id="video"
        lead="緩み、早気這類射癖，本人常常感覺不到。錄影是一種簡單的外在回饋，最好的用法是拿給指導者看。"
      >
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">怎麼拍、看什麼</h3>
              <div className="text-[15px]">
                <PointList points={VIDEO_HOW} />
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">有什麼根據</h3>
              <div className="text-[15px]">
                <PointList points={VIDEO_EVIDENCE} />
              </div>
            </div>
          </div>
          <Callout tone="warn" title="拍攝的安全">
            <PointList points={VIDEO_SAFETY} />
          </Callout>
          <p className="text-[15px] leading-relaxed">
            看完影片，可以把當天出現的射癖和矢所記在
            <Link href="/journal/" className="mx-1 text-wood underline">
              稽古帳
            </Link>
            ，累積幾週後就看得出哪一種最常出現；想複習術語與射法，可以到
            <Link href="/practice/" className="mx-1 text-wood underline">
              互動練習
            </Link>
            。
          </p>
        </div>
      </CourseSection>

      {/* ───────── 說法不一 ───────── */}
      <CourseSection chapter="shaguse" id="disputes" lead="本頁最不確定的地方。遇到這些主題時，請以所屬道場與指導者的說明為準。">
        <ul className="grid gap-3 sm:grid-cols-2">
          {DISPUTES.map((d) => (
            <li key={d.title} className="rounded-xl border border-vermilion/30 bg-surface p-4">
              <p className="font-semibold">
                <TagBadge tag="disputed" />
                <a href={`#${d.anchor}`} className="text-ink underline decoration-line hover:text-wood">
                  {d.title}
                </a>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{d.text}</p>
            </li>
          ))}
        </ul>
      </CourseSection>

      <ChapterQuiz chapter="shaguse" />

      <FaqList faqs={SHAGUSE_FAQS} />

      <nav aria-labelledby="related" className="mt-12">
        <h2 id="related" className="mb-3 text-xl font-bold">
          相關頁面
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="block h-full rounded-xl border border-line bg-surface p-4 no-underline hover:bg-surface-2">
                <span className="font-semibold text-wood">{r.label}</span>
                <span className="mt-1 block text-sm text-muted">{r.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SourceList
        sources={collectSources()}
        note={
          <>
            查詢日期都是 2026-10-17。研究多為小樣本的問卷、個案或學會摘要，標籤上的 n 是樣本數；西洋弓的資料不能直接套用在弓道上。
            標「坊間常見說法」的改善法沒有研究證據，網路文章（二手資料）只用來說明常見的說法。本頁不是醫療建議。
          </>
        }
      />

      <ChapterEnd chapter="shaguse" />
    </div>
  );
}
