import type { Metadata } from "next";
import { pageMetadata, chapterJsonLd, toJsonLd } from "@/lib/seo";
import { FAQS, PAGE_SOURCES, POSTLUDE, PRELUDE, SECTIONS } from "@/content/shaho";
import { SOURCES } from "@/content/sources";
import { FaqTeaser, SourceList } from "@/components/content/Blocks";
import { SectionBody } from "@/components/shaho/SectionBlocks";
import { SHAHO_VIDEO } from "@/content/shaho-video";
import HassetsuPlayer from "@/components/shaho/HassetsuPlayer";
import ReleaseSequence from "@/components/shaho/ReleaseSequence";
import Ashibumi3D from "@/components/shaho/Ashibumi3D";
import ChapterHero from "@/components/course/ChapterHero";
import CourseSection from "@/components/course/CourseSection";
import ChapterQuiz from "@/components/course/ChapterQuiz";
import ChapterEnd from "@/components/course/ChapterEnd";

export const metadata: Metadata = pageMetadata({
  path: "/shaho/",
  title: "射法八節",
  description:
    "弓道射法八節（足踏み、胴造り、弓構え、打起し、引分け、会、離れ、残心）的圖解與中文說明，以全日本弓道連盟公開資料為準。",
  og: "shaho",
});

const QUIPS = new Set(["ashibumi", "uchiokoshi", "hikiwake", "kai", "zanshin"]);

export default function ShahoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(chapterJsonLd("shaho")) }} />
      <ChapterHero chapter="shaho">
        <p>
          射一支箭的八個步驟：足踏み、胴造り、弓構え、打起し、引分け、会、離れ、残心，前後再加上執弓の姿勢與弓倒し。
          每一節的說明分「入門」與「深入」兩層，並附示範影片中對應時間點的連結。
        </p>
      </ChapterHero>

      {/* No 八節一覽 thumbnail strip: the 小節 list above and each step's 「看這一節的說明」 link to the sections. */}
      <section id="hassetsu" aria-labelledby="hassetsu-player" className="mb-10 scroll-mt-20">
        <h2 id="hassetsu-player" className="mb-1 text-lg font-bold">
          八節播放器
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-muted">
          按「下一步」或「自動播放」，看同一位射手從執弓の姿勢一路做到弓倒し；每一步附上這一節的提醒。
        </p>
        <HassetsuPlayer />
      </section>

      <p className="mb-8 text-sm leading-relaxed text-muted">
        想看真人的連續動作，可以參考
        <a href={SHAHO_VIDEO.url} target="_blank" rel="noopener noreferrer" className="mx-1 text-wood underline">
          {SHAHO_VIDEO.title}
        </a>
        （YouTube，外部連結）；每一節下方也附了對應的秒數。
      </p>

      {[PRELUDE, ...SECTIONS, POSTLUDE].map((s) => (
        <CourseSection key={s.id} chapter="shaho" id={s.id} quip={QUIPS.has(s.id)}>
          <SectionBody s={s}>
            {s.id === "ashibumi" && (
              <div>
                <h3 className="mb-1 text-base font-bold">兩腳怎麼踏開，一步一步看</h3>
                <Ashibumi3D />
              </div>
            )}
            {s.id === "hanare" && (
              <div>
                <h3 className="mb-1 text-base font-bold">会 → 離れ → 残心，一步一步看</h3>
                <ReleaseSequence />
              </div>
            )}
          </SectionBody>
        </CourseSection>
      ))}

      <ChapterQuiz chapter="shaho" />

      <FaqTeaser module="shaho" faqs={FAQS} picks={["会要撐幾秒？", "打起し是 45 度嗎？", "足踏み要踏多寬？"]} />

      <SourceList
        sources={PAGE_SOURCES.map((k) => SOURCES[k])}
        note={
          <>
            技術說明以全日本弓道連盟（ANKF）官網與指導書為準；本頁文字為中文改寫，只引用必要的短句。
            標示「坊間常見說法」的數字沒有官方出處；「指導書」是日本武道協議會《少年少女武道指導書 弓道》，屬教學教材，不等於射法規定。
            中文節名參考臺灣弓道協會的對照。
          </>
        }
      />

      <ChapterEnd chapter="shaho" />
    </div>
  );
}
