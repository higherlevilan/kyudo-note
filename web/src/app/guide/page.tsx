import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Callout, Cites, FaqList, LayeredCard, PointList, SourceList, TagBadge } from "@/components/content/Blocks";
import ChapterEnd from "@/components/course/ChapterEnd";
import ChapterHero from "@/components/course/ChapterHero";
import ChapterQuiz from "@/components/course/ChapterQuiz";
import CourseSection from "@/components/course/CourseSection";
import ClubList from "@/components/guide/ClubList";
import CompareTable from "@/components/guide/CompareTable";
import CostEstimator from "@/components/guide/CostEstimator";
import Dojo3D from "@/components/guide/Dojo3D";
import FirstVisitSteps from "@/components/guide/FirstVisitSteps";
import Roadmap from "@/components/guide/Roadmap";
import SafetyZones from "@/components/guide/SafetyZones";
import ShajoLayout from "@/components/illustrations/dojo/ShajoLayout";
import { TargetFaces, TargetMount } from "@/components/illustrations/dojo/Targets";
import Yadokoro from "@/components/illustrations/dojo/Yadokoro";
import { ANKF, RESEARCH, TAIWAN } from "@/content/common-sources";
import {
  ASSOC_CLASSES,
  ASSOC_FACTS,
  BUYING,
  CLUBS,
  FIRST_VISIT,
  INJURY_SECTION,
  NOT_FOUND,
  RANKS,
  ROADMAP,
  SAFETY_NOTES,
  SAFETY_RULES,
  SHINSA_FEES,
  SHINSA_SECTIONS,
  SMALL_TOPICS,
  TIMING_EXAMPLES,
  VS_ARCHERY,
} from "@/content/guide/content";
import { COST_ITEMS, COST_SOURCES } from "@/content/guide/cost";
import { GUIDE_FAQS } from "@/content/guide/faqs";
import { VISIT_STEPS } from "@/content/guide/visit-steps";
import { CHECKED_ON, IKYF_X, JPY_TWD_RATE, PRICE, TW_X } from "@/content/guide/sources";
import type { LayeredSection, Point, Source } from "@/content/types";

export const metadata: Metadata = pageMetadata({
  path: "/guide/",
  title: "入門指南",
  description:
    "給完全初學者的弓道入門：第一年的練習進程、第一次去道場要準備什麼、在台灣哪裡學、安全守則、費用試算、初段審查與海外受審。資料以全日本弓道連盟與臺灣弓道協會公開資料為準。",
  og: "guide",
});

/** md stair offsets for the rank ladder (lowest rung first) */
const STAIR = ["md:mt-24", "md:mt-18", "md:mt-12", "md:mt-6", "md:mt-0"];

/** 重點筆記 at the end of 〈審查入門〉: a recap of facts already in the section above. */
const SHINSA_NOTES: Point[] = [
  { text: "初段射一手 2 支；原則上近的 28 m、5 人一立、坐射。", tag: "official", src: [ANKF.probationRules, ANKF.probationGyosha] },
  { text: "初段、弐段不要求中靶；從参段起才要求「的中やや確実」。", tag: "official", src: [ANKF.probationStandard] },
  { text: "合格門檻：行射得票 5 成以上，而且學科 60 分以上。", tag: "official", src: [ANKF.probationRules] },
  { text: "不能個人直接寄給全弓連；在台灣經臺灣弓道協會報名。", tag: "official", src: [ANKF.probationRules, IKYF_X.shinsa, TAIWAN.shinsa] },
];

/** FIRST_VISIT cards whose points are shown in the step player instead */
const IN_STEPS = new Set(["要穿什麼？", "要帶什麼？要先買弓嗎？", "一進門要做什麼？"]);

const ntd = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 });
const yen = new Intl.NumberFormat("ja-JP");

function pointSrc(points: readonly Point[]): Source[] {
  return points.flatMap((p) => p.src ?? []);
}
function layeredSrc(s: LayeredSection): Source[] {
  return [...(s.introSrc ?? []), ...(s.deep ?? []).flatMap((b) => pointSrc(b.points))];
}

const PAGE_SOURCES: Source[] = [
  ...ROADMAP.flatMap((s) => s.src),
  ...TIMING_EXAMPLES.flatMap((e) => e.src),
  ...FIRST_VISIT.flatMap((v) => pointSrc(v.points)),
  ...pointSrc(ASSOC_FACTS),
  TW_X.qna,
  ...CLUBS.flatMap((c) => c.links),
  TW_X.clubs,
  ...pointSrc(NOT_FOUND),
  ...pointSrc(BUYING.points),
  ...SAFETY_RULES.flatMap((r) => r.src),
  ...pointSrc(SAFETY_NOTES),
  ...layeredSrc(INJURY_SECTION),
  ...COST_SOURCES,
  ...SHINSA_SECTIONS.flatMap(layeredSrc),
  ANKF.probationFee,
  ...VS_ARCHERY.flatMap((r) => r.kyudoSrc ?? []),
  ...SMALL_TOPICS.flatMap(layeredSrc),
  ...GUIDE_FAQS.flatMap((f) => pointSrc(f.a)),
  ANKF.playRules,
  ANKF.terminology,
  RESEARCH.equipment,
  RESEARCH.etiquette,
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <ChapterHero chapter="guide">
        <p>
          還沒碰過弓也沒關係。這一章整理第一年會走的路、第一次去道場要準備什麼、在台灣可以去哪裡學、安全守則、要花多少錢，以及第一個段位「初段」考什麼。
        </p>
        <p className="mt-2 text-sm">
          重要說法都標出依據：
          <TagBadge tag="official" />
          是全弓連、國際弓道連盟或法規等官方來源；
          <TagBadge tag="guide" />
          是日本武道協議會《少年少女武道指導書 弓道》；
          <TagBadge tag="local" />
          是協會、社團的做法；
          <TagBadge tag="research" />
          是學術研究；
          <TagBadge tag="shop" />
          是弓具店、弓師的說法；
          <TagBadge tag="folk" />
          是坊間常見說法，沒有正式出處；
          <TagBadge tag="note" />
          是本站整理或建議；
          <TagBadge tag="disputed" />
          是說法不一或待查證。價格與社團資訊的查詢日期是 {CHECKED_ON}。
        </p>
      </ChapterHero>

      {/* ---------------------------------------------------------- */}
      <CourseSection
        chapter="guide"
        id="first-year"
        title="你的弓道第一年"
        quip
        lead={
          <>
            弓道不是第一天就射靶。全弓連與指導書的順序，是從不拿弓的徒手練習開始，一步步加上阻力，最後才站上射場。每一步的動作，都是
            <Link href="/shaho/" className="text-wood underline">
              射法八節
            </Link>
            。
          </>
        }
      >
        <Roadmap steps={ROADMAP} examples={TIMING_EXAMPLES} />
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection
        chapter="guide"
        id="first-visit"
        title="第一次去道場"
        lead="以臺灣弓道協會的弓道教室與藏月弓道場的公開規範為主；社團或其他道場的規矩可能不同，去之前先問一聲最保險。"
        quip
      >
        <FirstVisitSteps steps={VISIT_STEPS} />
        <p className="text-sm text-muted">
          裝備怎麼選，見
          <Link href="/equipment/" className="mx-1 text-wood underline">
            弓具
          </Link>
          ；完整的禮法，見
          <Link href="/etiquette/" className="mx-1 text-wood underline">
            禮法與體配
          </Link>
          。
        </p>
        <h3 className="text-lg font-semibold">去之前，還常有人問</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* 穿著、攜帶、進門的要點已在上方的步驟裡 */}
          {FIRST_VISIT.filter((v) => !IN_STEPS.has(v.q)).map((v) => (
            <article key={v.q} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">{v.q}</h3>
              <div className="text-[15px]">
                <PointList points={v.points} />
              </div>
              {v.link && (
                <p className="mt-3 text-sm">
                  <Link href={v.link.href} className="text-wood underline">
                    {v.link.label} →
                  </Link>
                </p>
              )}
            </article>
          ))}
        </div>
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection
        chapter="guide"
        id="dojo-layout"
        title="射場長什麼樣"
        lead={
          <>
            射手站的木地板是射場（しゃじょう），前方 28 m 是箭飛過的矢道，盡頭的土堆是安土（あづち），靶就立在安土前。圖中的數字是全弓連《弓道競技規則》近的的標準，各道場的實際尺寸與配置可能不同。
            在射場裡怎麼走、怎麼行禮，見
            <Link href="/etiquette/#flow" className="mx-1 text-wood underline">
              禮法與體配
            </Link>
            。
          </>
        }
      >
        <Dojo3D />
        <div className="grid gap-5 md:grid-cols-2 md:items-start">
          <ShajoLayout />
          <div className="space-y-5">
            <TargetMount />
            <Yadokoro />
          </div>
        </div>
        <TargetFaces />
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection
        chapter="guide"
        id="taiwan"
        title="在台灣哪裡學"
        lead={`社會人士主要是臺灣弓道協會的弓道教室；學生可以看看學校有沒有弓道社。以下資料查詢日期 ${CHECKED_ON}，課程、時間與費用都可能改變，去之前請先聯絡對方確認。`}
      >
        <article className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
          <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-xl font-semibold">臺灣弓道協會</h3>
            <span className="text-sm text-muted">藏月弓道場・新北新莊・IKYF 會員</span>
          </header>
          <div className="mt-3 text-[15px]">
            <PointList points={ASSOC_FACTS} />
          </div>
          <h4 className="mt-5 mb-2 text-sm font-bold text-muted">
            弓道教室班別 <Cites src={[TAIWAN.class]} />
          </h4>
          <ul className="grid grid-cols-1 gap-2 text-sm min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {ASSOC_CLASSES.map((c) => (
              <li key={c.code} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wood-soft font-bold text-wood">{c.code}</span>
                <span>
                  {c.day}
                  <span className="block text-xs text-muted tabular-nums">{c.time}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            聯絡：
            <a href="mailto:taiwan.kyudo@gmail.com" className="text-wood underline">
              taiwan.kyudo@gmail.com
            </a>
            ・
            <a href={TAIWAN.home.url} target="_blank" rel="noopener noreferrer" className="text-wood underline">
              kyudo.org.tw
            </a>
            <Cites src={[TW_X.contact]} />
          </p>
        </article>

        <Callout tone="warn" title="協會的「常見問題」頁已過時">
          <p>
            常見問題頁還寫著「一期 2,400 元、111-1 期起 3,000 元」「南港藏月弓道場」，和弓道教室頁（每期 NT$4,800）、交通資訊頁（新莊）不一致。請以弓道教室頁與交通資訊頁為準。
            <Cites src={[TW_X.qna, TAIWAN.class, TW_X.traffic]} />
          </p>
        </Callout>

        <div>
          <h3 className="mb-2 text-lg font-semibold">大學社團與民間團體</h3>
          <ClubList clubs={CLUBS} checkedOn={CHECKED_ON} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="mb-2 font-semibold">查過但沒找到</h3>
            <div className="text-[15px]">
              <PointList points={NOT_FOUND} />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="mb-2 font-semibold">{BUYING.title}</h3>
            <div className="text-[15px]">
              <PointList points={BUYING.points} />
            </div>
            <p className="mt-3 text-sm">
              <Link href="/equipment/" className="text-wood underline">
                弓、箭、弽怎麼選、去哪裡買，見〈裝備百科〉 →
              </Link>
            </p>
          </div>
        </div>
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection
        chapter="guide"
        id="safety"
        quip
        title="安全守則"
        lead={
          <>
            以下大多出自日本武道協議會《少年少女武道指導書 弓道》，對象是少年少女，成人練習同樣適用。進出射場的禮法與矢取り的口令，見
            <Link href="/etiquette/" className="text-wood underline">
              禮法與體配
            </Link>
            。
          </>
        }
      >
        <ol className="grid gap-3 sm:grid-cols-2">
          {SAFETY_RULES.map((r, i) => (
            <li key={r.title} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-vermilion/50 text-sm font-bold text-vermilion">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed">
                  <TagBadge tag={r.tag} />
                  {r.text}
                  <Cites src={r.src} />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <SafetyZones />
        <div className="rounded-2xl border border-line bg-surface-2/60 p-4 text-[15px]">
          <PointList points={SAFETY_NOTES} />
        </div>
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection chapter="guide" id="injury" title="傷害預防" quip>
        <Callout title="先看證據等級">
          <p>
            弓道專屬的傷害研究數量少、年代久（1971、1987 年的問卷是主要資料），多是問卷、小樣本或個案；沒有前瞻性研究，也沒有預防方法的隨機對照試驗。下面的建議是「合理的一般原則」，不是「已證實有效」。身體不適請找醫師，不要只靠網路資料。
          </p>
        </Callout>
        <LayeredCard s={INJURY_SECTION} />
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection
        chapter="guide"
        id="cost"
        title="費用試算"
        lead="以臺灣弓道協會弓道教室為例，估算第一年與之後每年的花費。勾選、修改單價或數量，總額會即時更新；預設值的出處列在每一項下面。"
      >
        <CostEstimator items={COST_ITEMS} defaultRate={JPY_TWD_RATE} checkedOn={CHECKED_ON} />
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection
        chapter="guide"
        id="shinsa"
        quip
        title="審查入門"
        lead={
          <>
            審查（しんさ）是全弓連的級段認定。段位制度的由來與稱號（錬士・教士・範士），見
            <Link href="/culture/" className="text-wood underline">
              文化與哲學
            </Link>
            ；審查時的體配，見
            <Link href="/etiquette/" className="text-wood underline">
              禮法與體配
            </Link>
            。
          </>
        }
      >
        <figure className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <figcaption className="mb-4">
            <span className="font-semibold">各段對「中靶」的要求</span>
            <span className="ml-2 text-sm text-muted">依《審査統一基準（五段以下）》</span>
            <Cites src={[ANKF.probationStandard, ANKF.probationRules]} />
          </figcaption>
          <ol className="grid gap-2 md:grid-cols-5 md:items-start md:gap-3">
            {RANKS.map((r, i) => {
              const hit = i >= 3;
              return (
                <li
                  key={r.rank}
                  className={`rounded-xl border p-3 ${STAIR[i]} ${hit ? "border-vermilion/50 bg-vermilion/5" : "border-line bg-paper"}`}
                >
                  <p className="flex items-baseline gap-2">
                    <span lang="ja" className="text-lg font-semibold">
                      {r.rank}
                    </span>
                    <span lang="ja" className="text-xs text-muted">
                      {r.kana}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{r.standard}</p>
                  {r.note && <p className={`mt-1 text-xs ${hit ? "text-vermilion" : "text-muted"}`}>{r.note}</p>}
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-sm text-muted">
            五段以上與稱號另有基準。初段、弐段看的是射形與體配；到参段才開始要求中靶。
          </p>
        </figure>

        {SHINSA_SECTIONS.map((s) => (
          <LayeredCard key={s.id} s={s} />
        ))}

        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="font-semibold">
            審查料與登録料
            <span className="ml-2 text-sm font-normal text-muted">全弓連別表 1（平成 28 年 4 月 1 日改正）</span>
          </h3>
          <div className="mt-3 max-w-xl overflow-x-auto">
            <table className="w-full min-w-[20rem] text-right text-sm tabular-nums">
              <caption className="sr-only">審查料與登録料（日圓）</caption>
              <thead className="border-b border-line text-muted">
                <tr>
                  <th scope="col" className="py-2 pr-3 text-left font-semibold">
                    段級
                  </th>
                  <th scope="col" className="px-2 py-2 font-semibold">
                    審查料
                  </th>
                  <th scope="col" className="px-2 py-2 font-semibold">
                    登録料（合格後）
                  </th>
                  <th scope="col" className="py-2 pl-2 font-semibold">
                    合計約台幣
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SHINSA_FEES.map((f) => (
                  <tr key={f.rank}>
                    <th scope="row" lang="ja" className="py-2 pr-3 text-left font-semibold">
                      {f.rank}
                    </th>
                    <td className="px-2 py-2">¥{yen.format(f.exam)}</td>
                    <td className="px-2 py-2">¥{yen.format(f.reg)}</td>
                    <td className="py-2 pl-2">NT${ntd.format((f.exam + f.reg) * JPY_TWD_RATE)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            台幣以臺灣銀行 {CHECKED_ON} 日圓現金賣出 {JPY_TWD_RATE} 換算，只供參考。不合格不收登録料；日本各縣連可能另收手續費，台灣協會的手續費未公開。
            <Cites src={[ANKF.probationFee, PRICE.bot]} />
          </p>
        </div>

        <Callout title="重點筆記">
          <PointList points={SHINSA_NOTES} />
        </Callout>
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection
        chapter="guide"
        id="vs-archery"
        quip
        title="弓道和現代射箭有什麼不同？"
        lead="兩者在台灣是不同體系：弓道屬臺灣弓道協會，現代射箭屬 World Archery 體系，另有各自的組織；台大也同時有弓道社和射箭協會。右欄是一般對照，不是本站查證的規則。"
      >
        <CompareTable rows={VS_ARCHERY} />
      </CourseSection>

      {/* ---------------------------------------------------------- */}
      <CourseSection chapter="guide" id="topics" title="其他常見疑問">
        <div className="grid gap-5 md:grid-cols-2">
          {SMALL_TOPICS.map((s) => (
            <LayeredCard key={s.id} s={s} />
          ))}
        </div>
      </CourseSection>

      <ChapterQuiz chapter="guide" />

      <FaqList faqs={GUIDE_FAQS} />

      <SourceList
        sources={PAGE_SOURCES}
        note={
          <>
            查詢日期 {CHECKED_ON}。規則以全日本弓道連盟公開文件為準，台灣資訊以臺灣弓道協會官網與公開行事曆為準；社團資訊來自各社團的公開頁面，可能隨學期變動。本頁文字為中文改寫，只引用必要的短句。完整的調查過程與爭議點，見本站研究筆記。
          </>
        }
      />

      <ChapterEnd chapter="guide" />
    </div>
  );
}
