import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";
import Link from "next/link";
import { Callout, Cites, FaqList, PointList, SourceList, TagBadge } from "@/components/content/Blocks";
import ChapterEnd from "@/components/course/ChapterEnd";
import ChapterHero from "@/components/course/ChapterHero";
import ChapterQuiz from "@/components/course/ChapterQuiz";
import CourseSection from "@/components/course/CourseSection";
import BudgetBuilder from "@/components/equipment/BudgetBuilder";
import DataTable from "@/components/equipment/DataTable";
import TopicCard from "@/components/equipment/TopicCard";
import TsuruSteps from "@/components/equipment/TsuruSteps";
import YajakuCalculator from "@/components/equipment/YajakuCalculator";
import YazukaSteps from "@/components/equipment/YazukaSteps";
import Yumi3D from "@/components/equipment/Yumi3D";
import BowLengthCompare from "@/components/illustrations/gear/BowLengthCompare";
import KakeParts from "@/components/illustrations/gear/KakeParts";
import { YaParts } from "@/components/illustrations/gear/YaParts";
import Ya3D from "@/components/equipment/Ya3D";
import YumiParts from "@/components/illustrations/gear/YumiParts";
import { EQUIPMENT_FAQS } from "@/content/equipment/faqs";
import { collectSources } from "@/content/equipment";
import { ANKF, PRICE_DATE, RULES } from "@/content/equipment/sources";
import { TSURU_STEPS, YAZUKA_STEPS } from "@/content/equipment/steps";
import {
  BEFORE_BUYING,
  BORROW_FIRST,
  BUYING_ORDER,
  CARE_TOPICS,
  DISPUTES,
  GOODS_TABLE,
  KAKE_TOPICS,
  OTHER_BUDGETS_TABLE,
  SHIPPING_NOTES,
  TAIWAN_CARE,
  TSURU_TOPICS,
  WEAR_TOPICS,
  YA_TOPICS,
  YUMI_TOPICS,
} from "@/content/equipment/topics";
import type { Point, Tag } from "@/content/types";

export const metadata: Metadata = pageMetadata({
  path: "/equipment/",
  title: "裝備百科",
  description:
    "弓道裝備的中文整理：矢束怎麼量、箭長與弓長計算器（各來源並列）、弓力、弓材、箭、弦、弽、服裝、初學者預算試算與保養。以全日本弓道連盟規則為準，弓具店建議另行標示。",
  og: "equipment",
});

/** 重點筆記 at the end of 〈弓〉: a recap of the rules and official numbers in the cards above. */
const BOW_NOTES: Point[] = [
  { text: "弓長以 221 cm（七尺三寸，並寸）為標準，允許若干長短；握在從本弭算起約 1/3 處。", tag: "official", src: [ANKF.playRules] },
  { text: "弓力：自己能肩入れ的弓力的 1/2 是標準，初學時 1/3〜1/4——寧弱勿強。", tag: "official", src: [ANKF.tool] },
  { text: "一般大會允許玻纖、碳纖等新素材（競技規則第 20 條）；天皇盃等個別大會的要項另規定竹弓。", tag: "official", src: [ANKF.playRules, RULES.tennohai] },
  { text: "店家的弓長對照表、弓力數字都是建議，不是規則；買之前請指導者看過你的射。", tag: "note" },
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
      {/* 3D 甲矢・乙矢；不支援 WebGL 時顯示原本的 HayaOtoya 斷面圖 */}
      <Ya3D />
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
      <ChapterHero chapter="equipment">
        <p>
          弓、矢、弦、弽與服裝的選法、規則和保養。數字類的建議——箭要多長、弓要多長、弓力多少——各來源常常不一樣，
          這一章<strong className="text-ink">把它們並列</strong>，並標出哪些是全弓連的規定、哪些只是弓具店或坊間的說法。
          初學者最重要的一句話是：<strong className="text-ink">先借再買</strong>。
        </p>
      </ChapterHero>

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
      <CourseSection
        chapter="equipment"
        id="start"
        quip
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
      </CourseSection>

      {/* ───────── 計算器 ───────── */}
      <CourseSection
        chapter="equipment"
        id="calc"
        quip
        title="矢尺・弓長計算器"
        lead={
          <>
            矢束（やづか）：依自己骨架量出的拉弓長度基準；矢尺（やじゃく）：箭的實際全長。先量矢束，再看各來源怎麼建議箭長與弓長。
            計算器<strong className="text-ink">不會給你一個「官方數字」</strong>：全弓連只定了底線，其餘都是弓具店的建議，而且彼此不同。
          </>
        }
      >
        <div>
          <h3 className="mb-2 text-lg font-semibold">怎麼量矢束、箭要多長</h3>
          <YazukaSteps steps={YAZUKA_STEPS} />
        </div>
        <YajakuCalculator />
      </CourseSection>

      {/* ───────── 弓 ───────── */}
      <CourseSection chapter="equipment" id="bow" title="弓" quip lead="先認識弓的各部位名稱，再看弓長、弓力、弓材，以及比賽與審查的規定。">
        <YumiParts />
        <Yumi3D />
        {YUMI_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} figure={TOPIC_FIGURES[t.id]} />
        ))}
        <Callout title="重點筆記">
          <PointList points={BOW_NOTES} />
        </Callout>
      </CourseSection>

      {/* ───────── 矢 ───────── */}
      <CourseSection chapter="equipment" id="arrow" title="矢" lead="箭的部位與規定、甲矢與乙矢、箭桿規格、重量，以及羽的合法來源。">
        {YA_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} figure={TOPIC_FIGURES[t.id]} />
        ))}
      </CourseSection>

      {/* ───────── 弦 ───────── */}
      <CourseSection chapter="equipment" id="string" title="弦" quip lead="合成弦與麻弦、粗細、換弦時機與中仕掛。">
        <TsuruSteps steps={TSURU_STEPS} />
        {TSURU_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} figure={TOPIC_FIGURES[t.id]} />
        ))}
      </CourseSection>

      {/* ───────── 弽 ───────── */}
      <CourseSection chapter="equipment" id="glove" title="弽" lead="右手的鹿皮手套：規定、種類、尺寸、價格帶與相關小物。">
        {KAKE_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} figure={TOPIC_FIGURES[t.id]} />
        ))}
      </CourseSection>

      {/* ───────── 服裝 ───────── */}
      <CourseSection chapter="equipment" id="dress" title="服裝">
        {WEAR_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} />
        ))}
      </CourseSection>

      {/* ───────── 其他用品 ───────── */}
      <CourseSection chapter="equipment" id="goods" title="其他用品" lead={`弓袋、矢筒、弦巻、ゴム弓等。價格是小山、山武、平安 ${PRICE_DATE} 的含稅標價。`}>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
          <DataTable t={GOODS_TABLE} />
        </div>
      </CourseSection>

      {/* ───────── 預算 ───────── */}
      <CourseSection
        chapter="equipment"
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
      </CourseSection>

      {/* ───────── 保養 ───────── */}
      <CourseSection chapter="equipment" id="care" title="保養" quip lead="保養的關鍵字是「濕氣」：竹弓怕高溫高濕，弽怕汗。">
        {CARE_TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} />
        ))}
        <div id="taiwan-care" className="scroll-mt-20">
          <Callout tone="warn" title="台灣高溫多濕（編者整理、非官方）">
            <PointList points={TAIWAN_CARE} />
          </Callout>
        </div>
      </CourseSection>

      {/* ───────── 說法不一 ───────── */}
      <CourseSection chapter="equipment" id="disputes" title="說法不一・待查證" lead="本頁數字最不確定的地方。看到這些主題時，請以指導者與購買店家的說明為準。">
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

      <ChapterQuiz chapter="equipment" />

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

      <ChapterEnd chapter="equipment" />
    </div>
  );
}

