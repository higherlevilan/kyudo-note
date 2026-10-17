import type { Metadata } from "next";
import Link from "next/link";
import { Callout, FaqList, LayeredCard, PageHeader, PointList, Section, SourceList, TagBadge, TocChips } from "@/components/content/Blocks";
import LineageTree from "@/components/culture/LineageTree";
import MythCards from "@/components/culture/MythCards";
import { Deep, QuickHistory, Shagi, Shahokun, ShinZenBi, ShootingTypes, TwColonial, ZenFacts } from "@/components/culture/Pieces";
import RankLadder from "@/components/culture/RankLadder";
import BowMaterialsFigure from "@/components/illustrations/culture/BowMaterialsFigure";
import BowScaleFigure from "@/components/illustrations/culture/BowScaleFigure";
import GripFigure from "@/components/illustrations/culture/GripFigure";
import ToshiyaFigure from "@/components/illustrations/culture/ToshiyaFigure";
import Timeline from "@/components/culture/Timeline";
import { CULTURE_FAQS } from "@/content/culture/faqs";
import QuickCheck from "@/components/practice/QuickCheck";
import { QUICKCHECKS } from "@/content/practice/quickchecks";
import { cultureSources } from "@/content/culture/index";
import { RANK_HISTORY, RANK_RULES } from "@/content/culture/ranks";
import { HISTORY_TOPICS, ISSHA, THOUGHT, TW_TODAY, WHAT_IS, ZEN, ZEN_BALANCE } from "@/content/culture/sections";
import type { Tag } from "@/content/types";

export const metadata: Metadata = {
  title: "文化與哲學",
  description:
    "弓道的歷史、流派系譜、真善美與正射必中、《禮記・射義》、弓道與禪的真相、段位與稱號、台灣弓道史與常見迷思。依全日本弓道連盟與學術研究整理，爭議處標示「說法不一」。",
};

const TOC = [
  { id: "intro", label: "入門" },
  { id: "timeline", label: "年表" },
  { id: "history", label: "歷史專題" },
  { id: "lineage", label: "流派系譜" },
  { id: "thought", label: "思想" },
  { id: "zen", label: "弓道與禪" },
  { id: "ranks", label: "段位與稱號" },
  { id: "taiwan", label: "台灣與弓道" },
  { id: "myths", label: "迷思澄清" },
  { id: "faq", label: "常見問題" },
];

const TAG_GUIDE: { tag: Tag; text: string }[] = [
  { tag: "official", text: "全日本弓道連盟等官方規定或說明" },
  { tag: "guide", text: "日本武道協議會《少年少女武道指導書 弓道》等指導教材" },
  { tag: "research", text: "學術論文的結論" },
  { tag: "local", text: "臺灣弓道協會、地方團體" },
  { tag: "folk", text: "常見但沒有官方出處" },
  { tag: "disputed", text: "資料互相矛盾，或本站尚未查證" },
  { tag: "note", text: "本站的整理與提醒" },
];

export default function CulturePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <PageHeader kicker="文化與哲學" title="弓道的來路與心法">
        <p>
          從繩文時代的狩獵弓，到今天的《弓道教本》與國際弓道連盟：這一頁整理弓道的歷史、流派、思想、段位制度，以及弓道在台灣的足跡。每一段都分成「入門」（預設展開）與「深入」（點開閱讀）兩層；資料有爭議的地方，會直接標出「說法不一」。
        </p>
      </PageHeader>
      <TocChips items={TOC} />

      {/* ---------------------------------------------------------- 入門 */}
      <Section id="intro" title="入門：弓道是什麼">
        <LayeredCard s={WHAT_IS}>
          <p className="mt-3 text-sm text-muted">
            想先看動作？請到
            <Link href="/shaho/" className="mx-1 text-wood underline">
              射法八節
            </Link>
            看八節的圖解與說明。
          </p>
        </LayeredCard>
        <QuickHistory />
        <Callout title="本頁的標籤怎麼讀">
          <ul className="mt-1 grid gap-1.5 text-sm sm:grid-cols-2">
            {TAG_GUIDE.map((t) => (
              <li key={t.tag}>
                <TagBadge tag={t.tag} />
                {t.text}
              </li>
            ))}
          </ul>
        </Callout>
      </Section>

      {/* ---------------------------------------------------------- 年表 */}
      <Section
        id="timeline"
        title="互動年表"
        lead="依時代排列，可以只看日本或台灣的事件。年代或細節有爭議的條目以紅色虛線圓點與「說法不一」標示，並附上註解。"
      >
        <Timeline />
      </Section>

      {/* ------------------------------------------------------ 歷史專題 */}
      <Section id="history" title="歷史專題" lead="年表裡的幾個關鍵轉折，展開來說。">
        {HISTORY_TOPICS.map((s) => (
          <LayeredCard
            key={s.id}
            s={s}
            figure={
              s.id === "wakyu" ? (
                <>
                  <GripFigure />
                  <BowScaleFigure />
                  <BowMaterialsFigure />
                </>
              ) : s.id === "toshiya" ? (
                <ToshiyaFigure />
              ) : undefined
            }
          />
        ))}
      </Section>

      {/* ------------------------------------------------------ 流派系譜 */}
      <Section
        id="lineage"
        title="流派系譜"
        lead="現代弓道以全弓連《弓道教本》為共同基準，但它的背後是幾條不同的古流脈絡。系譜圖用線條區分「有史料可考」與「傳說或存疑」的關係。"
      >
        <LineageTree />
        <ShootingTypes />
      </Section>

      {/* ---------------------------------------------------------- 思想 */}
      <Section id="thought" title="思想" lead="弓道常掛在嘴邊的幾句話：各自從哪裡來、原本是什麼意思。">
        <ShinZenBi />
        {THOUGHT.filter((s) => s.id === "seisha").map((s) => (
          <LayeredCard key={s.id} s={s}>
            <div className="mt-4">
              <Callout title="常見誤解：「弓道不在乎中不中」" tone="warn">
                <p>
                  正射必中講的是因果：射法正確，命中自然隨之而來。全弓連的審查從参段起就寫進命中要求（参段「的中やや確実」、四段「的中確実」），只有弐段在統一基準寫「的中不問」。所以重點不是「不在乎命中」，而是命中要來自正確的射法。
                </p>
              </Callout>
            </div>
          </LayeredCard>
        ))}
        <Shagi />
        <Shahokun />
        {THOUGHT.filter((s) => s.id !== "seisha").map((s) => (
          <LayeredCard key={s.id} s={s} />
        ))}
      </Section>

      {/* ------------------------------------------------------ 弓道與禪 */}
      <Section
        id="zen"
        title="弓道與禪"
        lead="很多人是因為 Eugen Herrigel 的《弓與禪》（Zen in der Kunst des Bogenschießens）才認識弓道。這一節不神話化這本書，也不否定讀者的體驗，而是把史料攤開來看。"
      >
        <Callout title="先說結論">
          <p>
            《弓與禪》讓全世界認識了弓道，作為文學與個人體驗的價值不必否定；但它不是描寫日本弓道傳統的可靠史料。書中最神秘的情節，有的發生在沒有翻譯的場合，有的經過翻譯者的意譯；Herrigel 的老師阿波研造本人沒有禪修經歷，教法在當時屬於少數。「射は立禅」這類說法，可以理解為比喻，而不是說弓道等於禪宗修行。
          </p>
        </Callout>
        <ZenFacts />
        <LayeredCard s={ZEN} />
        <LayeredCard s={ISSHA} />
        <Callout title="公平地說">
          <PointList points={ZEN_BALANCE} />
        </Callout>
      </Section>

      {/* ---------------------------------------------------- 段位與稱號 */}
      <Section
        id="ranks"
        title="段位與稱號"
        lead="全弓連的審查分三條：級位（五級～一級）、段位（初段～十段），以及錬士・教士・範士三個稱號。以下依《審査規程および内規》整理。"
      >
        <RankLadder />
        <article className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
          <h3 className="text-xl font-semibold">規則重點</h3>
          <div className="mt-3 text-[15px]">
            <PointList points={RANK_RULES} />
          </div>
          <Deep title="深入：稱號制度的由來">
            <PointList points={RANK_HISTORY} />
          </Deep>
        </article>
      </Section>

      {/* ---------------------------------------------------- 台灣與弓道 */}
      <Section id="taiwan" title="台灣與弓道" lead="弓道在台灣有一段日治時期的歷史，也有今天加入國際弓道連盟的協會。">
        <Callout title="名稱提醒" tone="warn">
          <p>
            台灣的弓道協會正式名稱是「臺灣弓道協會」（Taiwan Kyudo Association）。查不到名為「中華民國弓道協會」的組織，請不要使用這個名稱。另外，現代射箭（World Archery 系統、奧運項目）和弓道是不同的運動，在台灣也有各自的組織，不要混為一談。
          </p>
        </Callout>
        <TwColonial />
        <LayeredCard s={TW_TODAY} />
      </Section>

      {/* ------------------------------------------------------ 迷思澄清 */}
      <Section id="myths" title="迷思澄清" lead="每張卡片的正面是常見說法，按「看事實」翻面。">
        <MythCards />
      </Section>

      <QuickCheck set={QUICKCHECKS.culture} />

      <FaqList faqs={CULTURE_FAQS} />

      <SourceList
        sources={cultureSources()}
        note={
          <>
            本頁依本站研究筆記 01〈弓道的歷史由來與意義〉整理（2026-10-17 調查），文字為中文改寫，只引用必要的短句。官方規定以全日本弓道連盟為準；標示「二手資料」的來源（辭典、維基百科、個人整理）只作線索或交叉比對。會員數、IKYF 會員組織數、台灣團體現況等會變動的資訊，以各組織最新公告為準。
          </>
        }
      />
    </div>
  );
}
