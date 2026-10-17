import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";
import Link from "next/link";
import { Callout, Cites, FaqList, PageHeader, PointList, Section, SourceList, TagBadge, TocChips } from "@/components/content/Blocks";
import BudgetBuilder from "@/components/equipment/BudgetBuilder";
import DataTable from "@/components/equipment/DataTable";
import TopicCard from "@/components/equipment/TopicCard";
import YajakuCalculator from "@/components/equipment/YajakuCalculator";
import YazukaDiagram from "@/components/equipment/YazukaDiagram";
import BowLengthCompare from "@/components/illustrations/gear/BowLengthCompare";
import KakeParts from "@/components/illustrations/gear/KakeParts";
import { HayaOtoya, YaParts } from "@/components/illustrations/gear/YaParts";
import YumiParts from "@/components/illustrations/gear/YumiParts";
import { EQUIPMENT_FAQS } from "@/content/equipment/faqs";
import QuickCheck from "@/components/practice/QuickCheck";
import { QUICKCHECKS } from "@/content/practice/quickchecks";
import { collectSources } from "@/content/equipment";
import { PRICE_DATE } from "@/content/equipment/sources";
import {
  BEFORE_BUYING,
  BORROW_FIRST,
  BUYING_ORDER,
  CARE_TOPICS,
  DISPUTES,
  GOODS_TABLE,
  KAKE_TOPICS,
  MEASURE_STEPS,
  OTHER_BUDGETS_TABLE,
  SHIPPING_NOTES,
  TAIWAN_CARE,
  TSURU_TOPICS,
  WEAR_TOPICS,
  YA_TOPICS,
  YUMI_TOPICS,
} from "@/content/equipment/topics";
import type { Tag } from "@/content/types";

export const metadata: Metadata = pageMetadata({
  path: "/equipment/",
  title: "裝備百科",
  description:
    "弓道裝備的中文整理：矢束怎麼量、箭長與弓長計算器（各來源並列）、弓力、弓材、箭、弦、弽、服裝、初學者預算試算與保養。以全日本弓道連盟規則為準，弓具店建議另行標示。",
  og: "equipment",
});

const TOC = [
  { id: "start", label: "先借再買" },
  { id: "calc", label: "矢尺・弓長計算器" },
  { id: "bow", label: "弓" },
  { id: "arrow", label: "矢" },
  { id: "string", label: "弦" },
  { id: "glove", label: "弽" },
  { id: "dress", label: "服裝" },
  { id: "goods", label: "其他用品" },
  { id: "budget", label: "預算試算" },
  { id: "care", label: "保養" },
  { id: "disputes", label: "說法不一" },
  { id: "faq", label: "常見問題" },
];

const LEGEND: { tag: Tag; text: string }[] = [
  { tag: "official", text: "全日本弓道連盟（全弓連）的規則、官網" },
  { tag: "guide", text: "日本武道協議會《少年少女武道指導書 弓道》" },
  { tag: "local", text: "臺灣弓道協會" },
  { tag: "shop", text: "弓具店、弓師、全日本弓道具協會" },
  { tag: "folk", text: "論壇、部落格，沒有正式出處" },
  { tag: "note", text: "本站整理或建議" },
  { tag: "disputed", text: "說法不一、待查證" },
];

/** Diagrams placed inside topic cards, by topic id. */
const TOPIC_FIGURES: Record<string, ReactNode> = {
  "yumi-length": <BowLengthCompare id="bow-length-fig" />,
  "ya-rules": (
    <div className="space-y-4">
      <YaParts />
      <HayaOtoya />
    </div>
  ),
  tsuru: (
    <p className="text-sm text-muted">
      弦輪、中仕掛在弓上的位置，見上方
      <a href="#yumi-parts" className="mx-1 text-wood underline">
        〈和弓各部位〉圖
      </a>
      （點「弦」「中仕掛け」「弦輪」會標出來）。
    </p>
  ),
  kake: <KakeParts />,
};

const RELATED = [
  { href: "/guide/", label: "入門指南", text: "台灣哪裡學、練習進程、審查、在台灣買弓具與搭機" },
  { href: "/shaho/", label: "射法八節", text: "矢束、弓力合不合適，最後要看射形" },
  { href: "/glossary/", label: "日文詞彙庫", text: "弓具名稱的讀音與解釋" },
  { href: "/etiquette/", label: "禮法", text: "道場禮儀與體配" },
  { href: "/faq/", label: "問題研究中心", text: "各單元的常見問題總整理" },
];

export default function EquipmentPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <PageHeader kicker="裝備百科" title="弓具" ja="きゅうぐ">
        <p>
          弓、矢、弦、弽與服裝的選法、規則和保養。數字類的建議——箭要多長、弓要多長、弓力多少——各來源常常不一樣，
          本頁<strong className="text-ink">把它們並列</strong>，並標出哪些是全弓連的規定、哪些只是弓具店或坊間的說法。
          初學者最重要的一句話是：<strong className="text-ink">先借再買</strong>。
        </p>
      </PageHeader>

      <TocChips items={TOC} />

      <details className="mb-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
        <summary className="font-semibold text-wood">標籤怎麼讀</summary>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {LEGEND.map((l) => (
            <li key={l.tag}>
              <TagBadge tag={l.tag} />
              {l.text}
            </li>
          ))}
        </ul>
      </details>

      {/* ───────── 先借再買 ───────── */}
      <Section
        id="start"
        title="先借再買"
        lead={
          <>
            裝備要配合自己的矢束、弓力和射形，而這些在剛開始的幾個月都還會變。先用道場的器材，等指導者看過你的射，再一件一件買。
            台灣的弓道教室與學習地點見
            <Link href="/guide/" className="mx-1 text-wood underline">
              入門指南
            </Link>
            。
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">先用道場的</h3>
            <div className="text-[15px]">
              <PointList points={BORROW_FIRST} />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm md:col-span-2">
            <h3 className="mb-2 text-lg font-semibold">購買順序：兩家店的建議</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[BUYING_ORDER.suizan, BUYING_ORDER.heian].map((o) => (
                <div key={o.who}>
                  <p className="mb-2 text-sm">
                    <TagBadge tag="shop" />
                    <span className="font-semibold">{o.who}</span>
                  </p>
                  <ol className="space-y-2">
                    {o.steps.map((s, i) => (
                      <li key={s.title} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wood-soft text-xs font-bold text-wood"
                        >
                          {i + 1}
                        </span>
                        <span className="text-[15px] leading-relaxed">
                          <span className="font-semibold">{s.title}</span>：{s.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-1 text-xs">
                    <Cites src={o.src} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">要買之前</h3>
          <div className="text-[15px]">
            <PointList points={BEFORE_BUYING} />
          </div>
        </div>
      </Section>

      {/* ───────── 計算器 ───────── */}
      <Section
        id="calc"
        title="矢尺・弓長計算器"
        lead={
          <>
            矢束（やづか）：依自己骨架量出的拉弓長度基準；矢尺（やじゃく）：箭的實際全長。先量矢束，再看各來源怎麼建議箭長與弓長。
            計算器<strong className="text-ink">不會給你一個「官方數字」</strong>：全弓連只定了底線，其餘都是弓具店的建議，而且彼此不同。
          </>
        }
      >
        <div className="grid items-center gap-5 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <figure>
            <YazukaDiagram />
            <figcaption className="mt-1 text-xs text-muted">示意圖：量矢束的姿勢（本站繪製）</figcaption>
          </figure>
          <div>
            <h3 className="mb-2 text-lg font-semibold">怎麼量矢束</h3>
            <div className="text-[15px]">
              <PointList points={MEASURE_STEPS} />
            </div>
          </div>
        </div>
        <YajakuCalculator />
      </Section>

      {/* ───────── 弓 ───────── */}
      <Section id="bow" title="弓" lead="先認識弓的各部位名稱，再看弓長、弓力、弓材，以及比賽與審查的規定。">
        <YumiParts />
        {YUMI_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} figure={TOPIC_FIGURES[t.id]} />
        ))}
      </Section>

      {/* ───────── 矢 ───────── */}
      <Section id="arrow" title="矢" lead="箭的部位與規定、甲矢與乙矢、箭桿規格、重量，以及羽的合法來源。">
        {YA_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} figure={TOPIC_FIGURES[t.id]} />
        ))}
      </Section>

      {/* ───────── 弦 ───────── */}
      <Section id="string" title="弦" lead="合成弦與麻弦、粗細、換弦時機與中仕掛。">
        {TSURU_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} figure={TOPIC_FIGURES[t.id]} />
        ))}
      </Section>

      {/* ───────── 弽 ───────── */}
      <Section id="glove" title="弽" lead="右手的鹿皮手套：規定、種類、尺寸、價格帶與相關小物。">
        {KAKE_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} figure={TOPIC_FIGURES[t.id]} />
        ))}
      </Section>

      {/* ───────── 服裝 ───────── */}
      <Section id="dress" title="服裝">
        {WEAR_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} />
        ))}
      </Section>

      {/* ───────── 其他用品 ───────── */}
      <Section id="goods" title="其他用品" lead={`弓袋、矢筒、弦巻、ゴム弓等。價格是小山、山武、平安 ${PRICE_DATE} 的含稅標價。`}>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
          <DataTable t={GOODS_TABLE} />
        </div>
      </Section>

      {/* ───────── 預算 ───────── */}
      <Section
        id="budget"
        title="預算試算"
        lead={
          <>
            如果真的要在日本買齊一套，大概要多少？下面用<strong className="text-ink">同一家店（小山弓具）</strong>的標價試算，方便比較；
            可以切換「最低限」「標準」，或自己增減品項。這是「買齊」的估算，不是入門必要的花費——多數道場和臺灣弓道協會的課程都有公用器材。
          </>
        }
      >
        <BudgetBuilder />
        <Callout tone="warn" title="試算沒有算進去的">
          <PointList points={SHIPPING_NOTES} />
          <p className="mt-2 text-sm">
            從台灣訂購、搭機帶弓回台、箭與矢羽的攜帶規定，見
            <Link href="/guide/" className="mx-1 text-wood underline">
              入門指南
            </Link>
            。
          </p>
        </Callout>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
          <DataTable t={OTHER_BUDGETS_TABLE} />
        </div>
      </Section>

      {/* ───────── 保養 ───────── */}
      <Section id="care" title="保養" lead="保養的關鍵字是「濕氣」：竹弓怕高溫高濕，弽怕汗。">
        {CARE_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} />
        ))}
        <div id="taiwan-care" className="scroll-mt-20">
          <Callout tone="warn" title="台灣高溫多濕（編者整理、非官方）">
            <PointList points={TAIWAN_CARE} />
          </Callout>
        </div>
      </Section>

      {/* ───────── 說法不一 ───────── */}
      <Section id="disputes" title="說法不一・待查證" lead="本頁數字最不確定的地方。看到這些主題時，請以指導者與購買店家的說明為準。">
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
      </Section>

      <QuickCheck set={QUICKCHECKS.equipment} />

      <FaqList faqs={EQUIPMENT_FAQS} />

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
            查詢日期除另註外都是 {PRICE_DATE}。價格、匯率和店家頁面都會變動，購買前請以店家當下的標示為準。
            規則以全日本弓道連盟《弓道競技規則》（令和 7 年 5 月 14 日改定）與官網為準；本頁文字為中文改寫，只引用必要的短句。
            標「弓具店」的是製作或販售弓具的人的建議，不是規則；標「坊間常見說法」的沒有正式出處。
          </>
        }
      />
    </div>
  );
}

