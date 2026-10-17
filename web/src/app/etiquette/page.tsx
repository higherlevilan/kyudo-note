import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Callout, Cites, FaqList, LayeredCard, PageHeader, PointList, Section, SourceList, TagBadge, TocChips } from "@/components/content/Blocks";
import Topic from "@/components/etiquette/Topic";
import KihonGrid from "@/components/etiquette/KihonGrid";
import ZashaStepper from "@/components/etiquette/ZashaStepper";
import GyoshaTable from "@/components/etiquette/GyoshaTable";
import { BowDiagram, ShajoDiagram } from "@/components/etiquette/Diagrams";
import { CompareTable, DressTable, MythList, ShitsuTable, StandardTable, YaHoldTable, YatoriVersions } from "@/components/etiquette/Lists";
import { KIHON } from "@/content/etiquette/kihontai";
import { KEY_FIGURES } from "@/content/etiquette/figures";
import { ZASHA_FLOW } from "@/content/etiquette/flow";
import { MYTHS } from "@/content/etiquette/myths";
import { ETIQUETTE_FAQS } from "@/content/etiquette/faqs";
import QuickCheck from "@/components/practice/QuickCheck";
import { QUICKCHECKS } from "@/content/practice/quickchecks";
import { ANKF, BUDOKAN, ET, ETIQUETTE_SOURCES } from "@/content/etiquette/sources";
import {
  DOJO_ENTER,
  DOJO_OTHERS,
  DOJO_YUMI,
  DRESS,
  DRESS_SECTION,
  GYOSHA,
  OVERVIEW,
  POSITIONS,
  RISSHA,
  RISSHA_MATCH,
  SAFETY,
  SHAREI,
  SHINSA,
  SHITSU,
  SHITSU_TABLE,
  STANDARD,
  TORIYUMI,
  YA_HOLD,
  YA_HOLD_NOTES,
  YATORI,
  YATORI_SECTION,
  ZASHA_VS_RISSHA,
} from "@/content/etiquette/sections";

export const metadata: Metadata = pageMetadata({
  path: "/etiquette/",
  title: "禮法與體配",
  description:
    "弓道的禮法與體配（たいはい）：4 種基本姿勢與 8 種基本動作、執弓の姿勢、坐射一手的完整流程、審查 5 人立的弦音接力、矢取り與道場禮儀、失的處理。以全日本弓道連盟公開資料為準，標明出處與說法不一之處。",
  og: "etiquette",
});

const TOC = [
  { id: "intro", label: "什麼是體配" },
  { id: "kihontai", label: "基本體" },
  { id: "toriyumi", label: "執弓與持箭" },
  { id: "flow", label: "坐射一手" },
  { id: "rissha", label: "立射與坐射" },
  { id: "shinsa", label: "審查" },
  { id: "dojo", label: "道場禮儀" },
  { id: "safety", label: "安全與失" },
  { id: "myths", label: "說法不一" },
  { id: "faq", label: "常見問題" },
];

const RELATED = [
  { href: "/shaho/", label: "射法八節", note: "射一支箭的八個步驟與圖解" },
  { href: "/guide/", label: "入門指南", note: "怎麼開始學、去哪裡學" },
  { href: "/equipment/", label: "裝備", note: "弓、矢、弽與道衣" },
  { href: "/culture/", label: "文化與哲學", note: "禮的意義與段位制度" },
  { href: "/glossary/", label: "詞彙表", note: "查本頁出現的日文術語" },
  { href: "/journal/", label: "稽古帳", note: "記下每次練習的體配重點" },
];

export default function EtiquettePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <PageHeader kicker="基本動作" title="禮法與體配" ja="礼法・体配（たいはい）">
        <p>
          射法八節之外，弓道還有一整套站、坐、走、行禮與進退的規矩，合稱「體配」。它是審查評分的一部分，也是在道場與他人一起練習的基礎。
          這一頁從 12 項基本體開始，接著走一遍坐射一手的完整流程，再整理審查、道場禮儀與安全。
        </p>
        <p className="mt-2">
          每一點都標了出處等級；各道場做法不同的地方，請以
          <strong className="text-ink">所屬道場與老師的教法</strong>為準。
        </p>
      </PageHeader>

      <TocChips items={TOC} />

      {/* ───── 入門 ───── */}
      <Section id="intro" title="什麼是體配">
        <LayeredCard s={OVERVIEW} />
        <div>
          <h3 className="mb-3 text-lg font-semibold">有出處的數字</h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {KEY_FIGURES.map((f) => (
              <li key={f.label} className="rounded-xl border border-line bg-surface p-3">
                <p className="text-xs text-muted">{f.label}</p>
                <p className="mt-0.5 font-semibold leading-snug">{f.value}</p>
                {f.note && <p className="mt-0.5 text-xs text-muted">{f.note}</p>}
                <p className="mt-1.5">
                  <TagBadge tag={f.tag} />
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            不在這張表裡的數字（例如揖幾度、幾步一息、跪坐雙膝開多寬），本站都沒有找到官方出處，不應寫成規定。
          </p>
        </div>
      </Section>

      {/* ───── 基本體 ───── */}
      <Section
        id="kihontai"
        title="基本體：4 種姿勢與 8 種動作"
        lead={
          <>
            <span lang="ja">基本体（きほんたい）</span>是「4 種基本姿勢、8 種基本動作」的總稱，也是審查學科會考的內容。
            以下排序依地方手冊與用語辭典整理，《弓道教本》原文的排序本站未見。
            <Cites src={[ANKF.terminology, ET.miyazaki]} />
          </>
        }
      >
        <KihonGrid items={KIHON} />
        <BowDiagram />
      </Section>

      {/* ───── 執弓 ───── */}
      <Section id="toriyumi" title="執弓の姿勢與持箭">
        <Topic
          s={TORIYUMI}
          deepLabel="深入：武射系與禮射系"
          deepExtra={
            <div className="space-y-3">
              <p className="leading-relaxed">
                持箭有兩種方式，會連帶決定足踏み是一步還是兩步、矢番え送箭幾次。下表的「武射系／禮射系」名稱只出現在宮崎縣的地方手冊。
              </p>
              <YaHoldTable rows={YA_HOLD} />
              <PointList points={YA_HOLD_NOTES} />
            </div>
          }
        />
      </Section>

      {/* ───── 坐射一手 ───── */}
      <Section
        id="flow"
        title="坐射一手的完整流程"
        lead="從入場口到退場，一步一步看。標示「本站整理」的息數與時間只是幫助理解的粗估，不是官方規定；實際節奏依各人呼吸，並以道場的教法為準。"
      >
        <ZashaStepper steps={ZASHA_FLOW} />
        <ShajoDiagram />
        <p className="text-sm text-muted">
          整個射場的俯視圖（五個射位的間隔、矢道、安土與的、看的所、上座與下座），見入門指南
          <Link href="/guide/#dojo-layout" className="mx-1 text-wood underline">
            〈射場長什麼樣〉
          </Link>
          。
        </p>
        <Callout title="整段要多久？">
          本站粗估單人約 3～4 分鐘（不計等待前人弦音的時間）。這是本站整理的估計，沒有官方的秒數。
          <TagBadge tag="note" />
        </Callout>
      </Section>

      {/* ───── 立射與坐射 ───── */}
      <Section id="rissha" title="立射與坐射">
        <Topic
          s={RISSHA}
          introExtra={<CompareTable rows={ZASHA_VS_RISSHA} a="坐射（ざしゃ）" b="立射（りっしゃ）" label="坐射與立射的比較" />}
          deepExtra={
            <div>
              <h4 className="mb-1.5 text-sm font-bold text-muted">立射者怎麼配合坐射者（全弓連〈立射の作法〉）</h4>
              <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
                {RISSHA_MATCH.map((p) => (
                  <li key={p.text}>
                    {p.text}
                    <Cites src={p.src} />
                  </li>
                ))}
              </ol>
            </div>
          }
        />
      </Section>

      {/* ───── 審查 ───── */}
      <Section id="shinsa" title="審查時的體配">
        <Topic
          s={SHINSA}
          introExtra={
            <div className="space-y-3">
              <Callout title="弦音接力的口訣">
                <p>
                  <strong>聽前兩人的弦音起身，聽前一人的弦音取懸け。</strong>
                  （3 番以後適用；1 番不間斷行射，2 番在 1 番胴造り快結束時起身。）
                  <Cites src={[ANKF.probationGyosha]} />
                </p>
              </Callout>
              <GyoshaTable rows={GYOSHA} positions={POSITIONS} />
              <p className="text-xs text-muted">
                依全弓連〈審査における行射の要領（５人立ち）〉，弓道衣與和服共通。競技規則的時機有些地方不同（例如下一組入場的信號），請分開看。
              </p>
            </div>
          }
          deepExtra={
            <div>
              <h4 className="mb-1.5 text-sm font-bold text-muted">各段級的體配要求（審查統一基準，五段以下）</h4>
              <StandardTable rows={STANDARD} />
              <p className="mt-2 text-sm text-muted">
                審查依以上項目「綜合評價」，沒有公開的扣分表。
                <Cites src={[ANKF.probationStandard]} />
              </p>
            </div>
          }
        />
        <LayeredCard s={SHAREI} />
      </Section>

      {/* ───── 道場禮儀 ───── */}
      <Section id="dojo" title="道場禮儀" lead="以下是常見做法與各方的寫法。每個道場的規矩都可能不同，第一次去時先觀察、先問。">
        <LayeredCard s={DOJO_ENTER} />
        <Topic s={YATORI_SECTION} introExtra={<YatoriVersions versions={YATORI} />} />
        <LayeredCard s={DOJO_YUMI} />
        <LayeredCard s={DOJO_OTHERS} />
        <Topic s={DRESS_SECTION} introExtra={<DressTable rows={DRESS} />} />
      </Section>

      {/* ───── 安全與失 ───── */}
      <Section id="safety" title="安全與「失」的處理">
        <Callout tone="warn" title="三條沒有例外的規則">
          <ul className="list-disc space-y-1 pl-5">
            <li>絕對不朝人拉弓——徒手練習、橡皮弓練習也一樣。</li>
            <li>不進矢道；要到靶前，一定先出聲、等回應、掛赤旗。</li>
            <li>看到赤旗，立刻安全地停止行射；赤旗掛出時不取懸け。</li>
          </ul>
          <p className="mt-2">
            <Cites src={[ANKF.playRules, BUDOKAN.ch2]} />
          </p>
        </Callout>
        <LayeredCard s={SAFETY} />
        <Topic s={SHITSU} introExtra={<ShitsuTable rows={SHITSU_TABLE} />} />
      </Section>

      {/* ───── 說法不一 ───── */}
      <Section id="myths" title="常見迷思與說法不一" lead="網路與道場常聽到的說法，對照本站查到的出處。">
        <MythList myths={MYTHS} />
      </Section>

      <QuickCheck set={QUICKCHECKS.etiquette} />

      <FaqList faqs={ETIQUETTE_FAQS} />

      <section aria-labelledby="related" className="mt-12">
        <h2 id="related" className="mb-3 text-xl font-bold">
          相關頁面
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="block rounded-xl border border-line bg-surface p-3 no-underline hover:bg-surface-2">
                <span className="font-semibold text-ink">{r.label}</span>
                <span className="mt-0.5 block text-sm text-muted">{r.note}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          還有疑問？到
          <Link href="/faq/" className="mx-1 text-wood underline">
            問題研究中心
          </Link>
          查各模組整理的問答。
        </p>
      </section>

      <SourceList
        sources={ETIQUETTE_SOURCES}
        note={
          <>
            以全日本弓道連盟（全弓連）的規程、用語辭典與學科試題為準。「指導書」是全弓連參與編寫的《少年少女武道指導書 弓道》，可代表全弓連系的說法，但不等於規程條文。
            地方連盟、學校與臺灣弓道協會的做法標為「地方／協會」；個人筆記與部落格只當線索。本站沒有取得《弓道教本》第一卷原文。本頁文字為中文改寫，只引用必要的短句。
          </>
        }
      />
    </div>
  );
}
