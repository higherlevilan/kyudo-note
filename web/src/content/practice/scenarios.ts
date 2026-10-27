// 情境題（體配・審查）. Multiple-choice questions built from the 禮法與體配 and 走進道場
// content files. Answers and explanations are read from those files (GYOSHA, KEY_FIGURES,
// ZASHA_VS_RISSHA, KIHON, STANDARD …) wherever possible; a question whose data row is
// missing is dropped instead of guessed. Wrong options are plausible mix-ups (other rows
// of the same table, the folk numbers the site already debunks), never new claims.

import { KEY_FIGURES } from "@/content/etiquette/figures";
import { KIHON } from "@/content/etiquette/kihontai";
import { MYTHS as ETIQUETTE_MYTHS } from "@/content/etiquette/myths";
import { GYOSHA, POSITIONS, SHINSA, STANDARD, YA_HOLD, ZASHA_VS_RISSHA } from "@/content/etiquette/sections";
import { ANKF, BUDOKAN } from "@/content/etiquette/sources";
import { SHINSA_SECTIONS } from "@/content/guide/content";
import { sampleBalanced, shuffle } from "@/lib/practice/random";
import type { ChoiceQuestion, MoreLink, Source, Tag } from "@/lib/practice/types";

interface Spec {
  id: string;
  topic: string;
  prompt: string;
  correct: string;
  /** preferred wrong options (e.g. other cells of the same table row) */
  wrong: string[];
  /** fill-ins used only when `wrong` has fewer than 3 */
  extra?: string[];
  explain: string;
  tag?: Tag;
  src: Source[];
  more: MoreLink;
}

const SHINSA_LINK: MoreLink = { href: "/etiquette/#shinsa", label: "看〈審查時的體配〉" };
const KIHON_LINK: MoreLink = { href: "/etiquette/#kihontai", label: "看〈基本體〉" };
const RISSHA_LINK: MoreLink = { href: "/etiquette/#rissha", label: "看〈立射與坐射〉" };
const GUIDE_SHINSA_LINK: MoreLink = { href: "/guide/#shinsa", label: "看〈審查入門〉" };

const figure = (label: string) => KEY_FIGURES.find((f) => f.label === label);
const kihon = (id: string) => KIHON.find((k) => k.id === id);
const compare = (item: string) => ZASHA_VS_RISSHA.find((r) => r.item === item);
const standard = (grade: string) => STANDARD.find((r) => r.grade === grade);
const myth = (id: string) => ETIQUETTE_MYTHS.find((m) => m.id === id);
const yaHold = (item: string) => YA_HOLD.find((r) => r.item === item);
const firstPart = (s: string) => s.replace(/（.*?）/g, "").trim();

/* ───────────── 5 人立 行射要領（GYOSHA 表）───────────── */

const PHASE_PROMPT: Record<string, string> = {
  "甲矢・起身": "甲矢什麼時候起身？",
  "甲矢・取懸け": "甲矢什麼時候取懸け？",
  "乙矢・立弓搭箭": "乙矢什麼時候立弓、搭箭？",
  "乙矢・起身": "乙矢什麼時候起身？",
  "乙矢・取懸け": "乙矢什麼時候取懸け？",
};

/** The 口訣 sentence from the 審查 intro (「聽前兩人的弦音起身，聽前一人的弦音取懸け」). */
const MNEMONIC = (() => {
  const s = SHINSA.intro.flatMap((p) => p.split("。")).find((x) => x.includes("聽前兩人")) ?? "";
  return s.slice(Math.max(0, s.indexOf("聽前兩人")));
})();

const opt = (cell: string) => firstPart(cell);
const overlaps = (a: string, b: string) => a === b || a.includes(b) || b.includes(a);

function gyoshaSpecs(): Spec[] {
  const pool = [...new Set(GYOSHA.flatMap((r) => r.cells).filter((c) => c !== "—").map(opt))];
  return GYOSHA.flatMap((row, ri) => {
    const ask = PHASE_PROMPT[row.phase];
    if (!ask) return [];
    return row.cells.flatMap((cell, p): Spec[] => {
      if (cell === "—") return [];
      const correct = opt(cell);
      const sameRow = [...new Set(row.cells.filter((c) => c !== "—").map(opt))].filter((c) => !overlaps(c, correct));
      const others = pool.filter((c) => !overlaps(c, correct) && !sameRow.includes(c));
      const useMnemonic = p >= 2 && (row.phase.endsWith("起身") || row.phase.endsWith("取懸け"));
      return [
        {
          id: `gyosha-${ri}-${p}`,
          topic: "5 人立的弦音接力",
          prompt: `審查 5 人立，你是 ${POSITIONS[p]}。${ask}`,
          correct,
          wrong: sameRow,
          extra: others,
          explain: `行射要領表：${POSITIONS[p]}「${row.phase}」的信號是「${cell}」。${useMnemonic && MNEMONIC ? `口訣：${MNEMONIC}（3 番以後）。` : ""}`,
          tag: "official",
          src: [ANKF.probationGyosha],
          more: SHINSA_LINK,
        },
      ];
    });
  });
}

/* ───────────── 其他情境 ───────────── */

function fixedSpecs(): (Spec | null | undefined)[] {
  const yu = figure("揖");
  const yuBreath = figure("揖的息數");
  const rei = kihon("rei");
  const hiraki = figure("開き足");
  const steps = figure("本座→射位");
  const toSha = compare("本座到射位");
  const waiting = compare("前一組還在射時");
  const arena = figure("審查射場");
  const nidan = standard("弐段");
  const sit = kihon("suwarikata");
  const walk = kihon("arukikata");
  const gaze = figure("視線");
  const urahazu = figure("執弓的末弭");
  const ashibumi = yaHold("足踏み");
  const yu15 = myth("yu-15");
  const nextEnter = myth("next-enter");
  const shodan = SHINSA_SECTIONS.find((s) => s.id === "shinsa-shodan");
  const enterRule = SHINSA.deep?.flatMap((b) => b.points).find((p) => p.text.includes("下一組在 3 番"));

  return [
    yu && {
      id: "yu-depth",
      topic: "揖與禮",
      prompt: "全弓連用語辭典怎麼描述「揖」？",
      correct: yu.value,
      wrong: ["上半身前屈約 15 度", "上半身前屈約 45 度", "只點頭，背不動"],
      explain: yu15 ? yu15.verdict : `${yu.value}（${yu.note ?? "距離，不是角度"}）。`,
      tag: yu.tag,
      src: yu.src ?? [ANKF.terminology],
      more: KIHON_LINK,
    },
    rei && yu && {
      id: "yu-vs-rei",
      topic: "揖與禮",
      prompt: "揖和禮，哪一個是比較深的禮？",
      correct: "禮",
      wrong: ["揖", "一樣深，只是名稱不同"],
      explain: `${rei.summary} 揖則是${yu.value}。`,
      tag: "guide",
      src: [...(rei.figures?.[0]?.src ?? [BUDOKAN.ch4]), ANKF.terminology],
      more: KIHON_LINK,
    },
    yuBreath && {
      id: "yu-breath",
      topic: "揖與禮",
      prompt: "依競技規則，入退場口的揖、本座全員一起的揖，各是幾息？",
      correct: "入退場口二息、本座三息",
      wrong: ["入退場口三息、本座二息", "都是三息", "都是二息"],
      explain: `${yuBreath.label}：${yuBreath.value}（${yuBreath.note ?? "競技規則"}）。`,
      tag: yuBreath.tag,
      src: yuBreath.src ?? [ANKF.playRules],
      more: KIHON_LINK,
    },
    hiraki && {
      id: "hirakiashi",
      topic: "坐射的動作",
      prompt: "坐射：你在射位跪坐好了，接著要轉向脇正面。用什麼動作、轉幾度？",
      correct: "開き足，轉 90 度",
      wrong: ["開き足，轉 45 度", "開き足，轉 60 度", "先站起來，再原地轉 90 度"],
      explain: `開き足是從跪坐改變 90 度方向的腳法（${hiraki.value}）。坐射在射位跪坐後，用開き足轉向脇正面。`,
      tag: hiraki.tag,
      src: [...(hiraki.src ?? []), ANKF.probationGyosha],
      more: KIHON_LINK,
    },
    steps && toSha && {
      id: "steps-zasha",
      topic: "坐射與立射",
      prompt: "坐射：從本座走到射位，是幾步？",
      correct: "3 步",
      wrong: ["2 步", "4 步", "5 步"],
      explain: `本座到射位：${steps.value}（${steps.note ?? toSha.a}）。不要把步數換算成固定公分數套在每個人身上。`,
      tag: steps.tag,
      src: steps.src ?? [ANKF.terminology],
      more: RISSHA_LINK,
    },
    steps && {
      id: "steps-rissha",
      topic: "坐射與立射",
      prompt: "立射：從本座走到射位，是幾步？",
      correct: "2 步",
      wrong: ["3 步", "1 步", "4 步"],
      explain: `本座到射位：${steps.value}。`,
      tag: steps.tag,
      src: steps.src ?? [ANKF.terminology],
      more: RISSHA_LINK,
    },
    waiting && {
      id: "wait-zasha",
      topic: "坐射與立射",
      prompt: "坐射：你這一組進場時，前一組還在射。你在本座怎麼等？",
      correct: waiting.a,
      wrong: [waiting.b, "站在射位後方等", "在入場口外站著等"],
      explain: `競技規則：坐射「${waiting.a}」；立射「${waiting.b}」。`,
      tag: waiting.tag,
      src: waiting.src ?? [ANKF.playRules],
      more: RISSHA_LINK,
    },
    waiting && {
      id: "wait-rissha",
      topic: "坐射與立射",
      prompt: "立射：你這一組進場時，前一組還在射。你怎麼等？",
      correct: waiting.b,
      wrong: [waiting.a, "站在射位後方等", "在入場口外站著等"],
      explain: `競技規則：立射「${waiting.b}」；坐射「${waiting.a}」。`,
      tag: waiting.tag,
      src: waiting.src ?? [ANKF.playRules],
      more: RISSHA_LINK,
    },
    enterRule && {
      id: "next-group",
      topic: "5 人立的弦音接力",
      prompt: "審查：你在下一組等候。什麼時候入場？",
      correct: "前一組 3 番乙矢的弦音時",
      wrong: ["前一組 2 番乙矢的弦音時", "前一組 5 番乙矢的弦音時", "前一組全部退場之後"],
      explain: `審查要領：${enterRule.text}${nextEnter ? ` 注意：${nextEnter.verdict}` : ""}`,
      tag: "official",
      src: [ANKF.probationGyosha, ANKF.playRules],
      more: SHINSA_LINK,
    },
    arena && {
      id: "arena",
      topic: "審查",
      prompt: "審查的射場原則上是哪一種？",
      correct: "近的、5 人一組、坐射",
      wrong: ["遠的、5 人一組、坐射", "近的、3 人一組、立射", "近的、5 人一組、立射"],
      explain: `${arena.label}：${arena.value}（${arena.note ?? ""}）。坐射有困難時可依手續改立射。`,
      tag: arena.tag,
      src: [...(arena.src ?? []), ANKF.probationGyosha],
      more: SHINSA_LINK,
    },
    nidan && {
      id: "tekichu-fumon",
      topic: "審查",
      prompt: "審查統一基準裡，寫著「的中不問」（不問中靶與否）的是哪一段？",
      correct: "弐段",
      wrong: ["初段", "参段", "四段"],
      explain: `弐段：${nidan.note ?? "射技欄寫「的中不問」。"} 從参段起才要求「的中やや確実」。`,
      tag: "official",
      src: [ANKF.probationStandard],
      more: GUIDE_SHINSA_LINK,
    },
    shodan && {
      id: "pass-line",
      topic: "審查",
      prompt: "初段要怎樣才算合格？",
      correct: "行射得票 5 成以上，而且學科 60 分以上",
      wrong: ["兩支箭都要中靶", "只看行射，不考學科", "行射得票 7 成以上，而且學科 60 分以上"],
      explain: shodan.intro.find((p) => p.startsWith("合格門檻")) ?? "",
      tag: "official",
      src: [ANKF.probationRules, ANKF.probationStandard],
      more: GUIDE_SHINSA_LINK,
    },
    sit && {
      id: "suwarikata",
      topic: "基本體",
      prompt: "從站姿坐下時，右腳往後退多少？",
      correct: "半足（腳掌長度的一半）",
      wrong: ["一足（整個腳掌）", "不退，直接往下跪", "退到和肩同寬"],
      explain: sit.summary,
      tag: "guide",
      src: sit.figures?.[0]?.src ?? [BUDOKAN.ch4, ANKF.terminology],
      more: KIHON_LINK,
    },
    walk && {
      id: "sashin-utai",
      topic: "基本體",
      prompt: "在射場走動時，前進先出哪一腳？後退先退哪一腳？",
      correct: "前進先出左腳，後退先退右腳",
      wrong: ["前進先出右腳，後退先退左腳", "前進、後退都先動左腳", "前進、後退都先動右腳"],
      explain: walk.howto.find((h) => h.text.startsWith("左進右退"))?.text ?? "左進右退：前進先出左腳，後退先退右腳。",
      tag: "official",
      src: [ANKF.terminology],
      more: KIHON_LINK,
    },
    gaze && {
      id: "gaze",
      topic: "基本體",
      prompt: "站著的時候，視線大約落在哪裡？",
      correct: "約 4 公尺前方",
      wrong: ["約 2 公尺前方", "腳尖前", "一直看著靶"],
      explain: `${gaze.label}：${gaze.value}（${gaze.note ?? ""}）。`,
      tag: gaze.tag,
      src: gaze.src ?? [BUDOKAN.ch4],
      more: KIHON_LINK,
    },
    urahazu && {
      id: "urahazu",
      topic: "執弓の姿勢",
      prompt: "執弓の姿勢：弓的上端（末弭）放在哪裡？",
      correct: "身體正前方中央，離地約 10 公分",
      wrong: ["輕輕碰在地上", "身體右側，離地約 10 公分", "和腰同高"],
      explain: `${urahazu.label}：${urahazu.value}（${urahazu.note ?? ""}）。走路、轉向時都不上下晃動。`,
      tag: urahazu.tag,
      src: urahazu.src ?? [BUDOKAN.ch4],
      more: { href: "/etiquette/#toriyumi", label: "看〈執弓の姿勢〉" },
    },
    ashibumi && {
      id: "ya-hold",
      topic: "執弓の姿勢",
      prompt: "持箭時把箭頭握在手裡、不露出來。這種持法，足踏み通常怎麼踏？",
      correct: ashibumi.bu,
      wrong: [ashibumi.rei],
      explain: `持箭方式會連動足踏み：箭頭不露出 →「${ashibumi.bu}」；箭頭露在前方 →「${ashibumi.rei}」。選一種並從頭到尾保持一致。`,
      tag: "guide",
      src: [BUDOKAN.ch4, BUDOKAN.ch6],
      more: { href: "/etiquette/#toriyumi", label: "看〈執弓與持箭〉" },
    },
  ];
}

function toQuestion(s: Spec): ChoiceQuestion {
  const wrong = [...shuffle(s.wrong), ...shuffle(s.extra ?? [])].filter((w) => w && w !== s.correct).slice(0, 3);
  const options = shuffle([s.correct, ...wrong]);
  return {
    id: s.id,
    topic: s.topic,
    prompt: s.prompt,
    options: options.map((text) => ({ text })),
    answer: options.indexOf(s.correct),
    explain: s.explain,
    tag: s.tag,
    src: s.src,
    more: s.more,
  };
}

function allSpecs(): Spec[] {
  return [...gyoshaSpecs(), ...fixedSpecs().filter((s): s is Spec => !!s && !!s.correct && s.wrong.length > 0)];
}

export const SCENARIO_COUNT = allSpecs().length;

/** n questions, at most 2 per topic, so the 弦音接力 table does not fill a whole session. */
export function buildScenarioSession(n: number): ChoiceQuestion[] {
  return sampleBalanced(allSpecs(), n, (s) => s.topic, 2).map(toQuestion);
}
