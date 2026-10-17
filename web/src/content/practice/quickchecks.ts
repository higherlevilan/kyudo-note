// 小測驗 (QuickCheck) sets shown near the end of the module pages. Small and fixed (no
// randomness, so the prerendered HTML matches the client). Each explanation is read from
// the page's own content file — FAQ answers, myth facts, table rows — and cites its sources.
// Nothing here imports glossary.json.

import { MYTHS as CULTURE_MYTHS } from "@/content/culture/myths";
import { EQUIPMENT_FAQS } from "@/content/equipment/faqs";
import { MEASURE_STEPS } from "@/content/equipment/topics";
import { MYTHS as ETIQUETTE_MYTHS } from "@/content/etiquette/myths";
import { KEY_FIGURES } from "@/content/etiquette/figures";
import { GYOSHA, POSITIONS, SHINSA } from "@/content/etiquette/sections";
import { ANKF } from "@/content/common-sources";
import { GUIDE_FAQS } from "@/content/guide/faqs";
import { FAQS as SHAHO_FAQS, SECTIONS } from "@/content/shaho";
import { SOURCES } from "@/content/sources";
import type { Faq, Point } from "@/content/types";
import type { ChoiceQuestion, MoreLink } from "@/lib/practice/types";

export interface QuickCheckSet {
  id: string;
  questions: ChoiceQuestion[];
  /** where 「更多練習」 goes */
  practice: MoreLink;
}

type Q = ChoiceQuestion | null;
const keep = (qs: Q[]): ChoiceQuestion[] => qs.filter((q): q is ChoiceQuestion => !!q && q.answer >= 0 && !!q.explain);

function faqPoints(list: readonly Faq[], q: string): Point[] {
  return list.find((f) => f.q === q)?.a ?? [];
}
const join = (ps: readonly Point[]) => ps.map((p) => p.text).join("");
const srcOf = (ps: readonly Point[]) => [...new Map(ps.flatMap((p) => p.src ?? []).map((s) => [s.url, s])).values()];

/* ───────────── 射法八節 ───────────── */

const shahoFaq = (q: string, n?: number) => {
  const a = SHAHO_FAQS.find((f) => f.q === q)?.a.slice(0, n) ?? [];
  return {
    explain: a.map((p) => p.text).join(""),
    src: [...new Set(a.flatMap((p) => p.src ?? []))].map((k) => SOURCES[k]),
  };
};
const fourth = SECTIONS.find((s) => s.no === 4);
const daisan = shahoFaq("大三是拉到三分之一嗎？");
const ashibumi = shahoFaq("足踏み要踏多寬？");

const SHAHO: QuickCheckSet = {
  id: "shaho",
  practice: { href: "/practice/#order", label: "八節排序練習" },
  questions: keep([
    fourth
      ? {
          id: "qc-shaho-4",
          prompt: "射法八節的第 4 節是哪一個？",
          options: [
            { text: "弓構え", ja: true },
            { text: "引分け", ja: true },
            { text: "打起し", ja: true },
            { text: "胴造り", ja: true },
          ],
          answer: ["弓構え", "引分け", "打起し", "胴造り"].indexOf(fourth.term),
          explain: `順序是足踏み → 胴造り → 弓構え → 打起し → 引分け → 会 → 離れ → 残心。第 4 節「${fourth.term}」：${fourth.intro[0]?.replace(/^第四節，/, "") ?? ""}`,
          tag: "official",
          src: fourth.introSrc.map((k) => SOURCES[k]),
          more: { href: `/shaho/#${fourth.id}`, label: `看「${fourth.term}」` },
        }
      : null,
    {
      id: "qc-shaho-daisan",
      prompt: "大三（だいさん）時，弓要拉開多少？",
      options: [{ text: "約箭長的三分之一" }, { text: "約箭長的一半" }, { text: "直接拉到会的位置" }],
      answer: 1,
      explain: daisan.explain,
      tag: "official",
      src: daisan.src,
      more: { href: "/shaho/#hikiwake", label: "看「引分け」" },
    },
    {
      id: "qc-shaho-ashibumi",
      prompt: "足踏み要踏多寬？",
      options: [{ text: "肩寬的 1.5 倍" }, { text: "以自己的矢束為寬度，兩腳約成 60 度" }, { text: "固定 90 公分" }],
      answer: 1,
      explain: ashibumi.explain,
      tag: "official",
      src: ashibumi.src,
      more: { href: "/shaho/#ashibumi", label: "看「足踏み」" },
    },
  ]),
};

/* ───────────── 禮法與體配 ───────────── */

const yu = KEY_FIGURES.find((f) => f.label === "揖");
const yu15 = ETIQUETTE_MYTHS.find((m) => m.id === "yu-15");
const steps = KEY_FIGURES.find((f) => f.label === "本座→射位");
const standUp = GYOSHA.find((r) => r.phase === "甲矢・起身");
const mnemonicLine = SHINSA.intro.flatMap((p) => p.split("。")).find((s) => s.includes("聽前兩人")) ?? "";
const mnemonic = mnemonicLine.slice(Math.max(0, mnemonicLine.indexOf("聽前兩人")));

const ETIQUETTE: QuickCheckSet = {
  id: "etiquette",
  practice: { href: "/practice/#scenario", label: "體配・審查情境題" },
  questions: keep([
    yu && yu15
      ? {
          id: "qc-et-yu",
          prompt: "全弓連用語辭典怎麼描述「揖」？",
          options: [{ text: "上半身前屈約 15 度" }, { text: yu.value }, { text: "上半身前屈約 45 度" }],
          answer: 1,
          explain: yu15.verdict,
          tag: "official",
          src: yu.src ?? [ANKF.terminology],
          more: { href: "/etiquette/#kihontai", label: "看〈基本體〉" },
        }
      : null,
    standUp
      ? {
          id: "qc-et-gyosha",
          prompt: `審查 5 人立，你是 ${POSITIONS[2]}。甲矢什麼時候起身？`,
          options: [{ text: standUp.cells[1] }, { text: standUp.cells[2] }, { text: standUp.cells[3] }],
          answer: 1,
          explain: `行射要領表：3 番甲矢在「${standUp.cells[2]}」時起身。口訣：${mnemonic}（3 番以後）。`,
          tag: "official",
          src: [ANKF.probationGyosha],
          more: { href: "/etiquette/#shinsa", label: "看〈審查時的體配〉" },
        }
      : null,
    steps
      ? {
          id: "qc-et-steps",
          prompt: "坐射：從本座走到射位，是幾步？",
          options: [{ text: "2 步" }, { text: "3 步" }, { text: "5 步" }],
          answer: 1,
          explain: `本座到射位：${steps.value}（${steps.note ?? ""}）。`,
          tag: steps.tag,
          src: steps.src ?? [ANKF.terminology],
          more: { href: "/etiquette/#rissha", label: "看〈立射與坐射〉" },
        }
      : null,
  ]),
};

/* ───────────── 文化與哲學 ───────────── */

const cMyth = (id: string) => CULTURE_MYTHS.find((m) => m.id === id);
const hit = cMyth("hit");
const shaho = cMyth("shaho");
const ct = cMyth("ct");

const CULTURE: QuickCheckSet = {
  id: "culture",
  practice: { href: "/practice/#myths", label: "迷思是非題" },
  questions: keep([
    hit
      ? {
          id: "qc-cu-hit",
          prompt: "審查統一基準裡寫著「的中不問」的，是哪一段？",
          options: [{ text: "初段" }, { text: "弐段" }, { text: "参段" }],
          answer: 1,
          explain: hit.fact,
          src: hit.src,
          more: { href: "/culture/#myths", label: "看迷思澄清" },
        }
      : null,
    shaho
      ? {
          id: "qc-cu-shaho",
          prompt: "射法八節是什麼時候確立的？",
          options: [{ text: "古代流派代代相傳" }, { text: "1953 年《弓道教本》" }, { text: "江戶時代的通し矢" }],
          answer: 1,
          explain: shaho.fact,
          src: shaho.src,
          more: { href: "/culture/#myths", label: "看迷思澄清" },
        }
      : null,
    ct
      ? {
          id: "qc-cu-ct",
          prompt: "臺灣弓道協會是國際弓道連盟（IKYF）的正式會員嗎？",
          options: [{ text: "是，名單上列為「Chinese Taipei」" }, { text: "不是，因為名單寫的是 Chinese Taipei" }],
          answer: 0,
          explain: ct.fact,
          src: ct.src,
          more: { href: "/culture/#taiwan", label: "看〈台灣與弓道〉" },
        }
      : null,
  ]),
};

/* ───────────── 裝備 ───────────── */

const measure = MEASURE_STEPS.find((p) => p.text.startsWith("從喉嚨中心"));
const sameLength = faqPoints(EQUIPMENT_FAQS, "為什麼箭不能剛好等於矢束？").slice(0, 1);
const bowPower = faqPoints(EQUIPMENT_FAQS, "初學者該用幾公斤的弓？").slice(0, 1);

const EQUIPMENT: QuickCheckSet = {
  id: "equipment",
  practice: { href: "/practice/#cards", label: "詞彙閃卡（可選「弓具」）" },
  questions: keep([
    measure
      ? {
          id: "qc-eq-yazuka",
          prompt: "矢束（やづか）要怎麼量？",
          options: [{ text: "身高除以 2" }, { text: "從喉嚨中心量到水平伸直的左手中指指尖" }, { text: "從肩膀量到手腕" }],
          answer: 1,
          explain: measure.text,
          tag: measure.tag,
          src: measure.src ?? [ANKF.tool],
          more: { href: "/equipment/", label: "看〈裝備百科〉" },
        }
      : null,
    {
      id: "qc-eq-length",
      prompt: "對靶練習（的前）時，可以用長度剛好等於矢束的箭嗎？",
      options: [{ text: "可以，剛好最準" }, { text: "不行，比矢束短或剛好等長的箭都禁止" }],
      answer: 1,
      explain: join(sameLength),
      tag: "official",
      src: srcOf(sameLength),
      more: { href: "/equipment/", label: "看〈裝備百科〉" },
    },
    {
      id: "qc-eq-power",
      prompt: "初學時的弓力，全弓連怎麼建議？",
      options: [{ text: "越強越好，進步比較快" }, { text: "自己能肩入れ的弓力的 1/3〜1/4" }, { text: "自己能肩入れ的最大弓力" }],
      answer: 1,
      explain: join(bowPower),
      tag: "official",
      src: srcOf(bowPower),
      more: { href: "/equipment/", label: "看〈裝備百科〉" },
    },
  ]),
};

/* ───────────── 入門指南 ───────────── */

const shodanFaq = faqPoints(GUIDE_FAQS, "初段要射幾支？一定要射中嗎？");
const subiki = faqPoints(GUIDE_FAQS, "素引き可以放弦嗎？");

const GUIDE: QuickCheckSet = {
  id: "guide",
  practice: { href: "/practice/#written", label: "初段學科練習" },
  questions: keep([
    {
      id: "qc-gu-arrows",
      prompt: "初段審查的實技，要射幾支箭？",
      options: [{ text: "1 支" }, { text: "2 支（甲矢、乙矢）" }, { text: "4 支" }],
      answer: 1,
      explain: join(shodanFaq.slice(0, 1)),
      tag: "official",
      src: srcOf(shodanFaq.slice(0, 1)),
      more: { href: "/guide/#shinsa", label: "看〈審查入門〉" },
    },
    {
      id: "qc-gu-hit",
      prompt: "初段一定要射中才能合格嗎？",
      options: [{ text: "要，至少中 1 支" }, { text: "不要求；参段起才要求「的中やや確実」" }],
      answer: 1,
      explain: join(shodanFaq.slice(1, 2)),
      tag: "official",
      src: srcOf(shodanFaq.slice(1, 2)),
      more: { href: "/guide/#shinsa", label: "看〈審查入門〉" },
    },
    {
      id: "qc-gu-subiki",
      prompt: "素引き（不搭箭空拉）拉滿之後，可以直接放弦嗎？",
      options: [{ text: "可以，只要旁邊沒人" }, { text: "不行，要慢慢送回去" }],
      answer: 1,
      explain: join(subiki),
      tag: subiki[0]?.tag,
      src: srcOf(subiki),
      more: { href: "/guide/#safety", label: "看〈安全守則〉" },
    },
  ]),
};

export const QUICKCHECKS = { shaho: SHAHO, etiquette: ETIQUETTE, culture: CULTURE, equipment: EQUIPMENT, guide: GUIDE } as const;
