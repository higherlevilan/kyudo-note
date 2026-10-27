// 迷思是非題: maps the two myth lists (culture, etiquette) into 對／錯 items.
//
// Every myth gives a 「錯」 statement (the myth itself). To keep the quiz from being
// "always 錯", most myths also get a 「對」 statement: a short restatement of the fact /
// verdict already written in the myth file — no new facts. Myths whose verdict is
// 「看場合」 or 「說法不一」 are only asked in their 「對」 form, so every answer is clear-cut.

import { MYTHS as CULTURE_MYTHS } from "@/content/culture/myths";
import { MYTHS as ETIQUETTE_MYTHS } from "@/content/etiquette/myths";
import { sample, shuffle } from "@/lib/practice/random";
import type { TrueFalseItem } from "@/lib/practice/types";

/** 「對」 restatements, keyed by myth id. Each paraphrases that myth's own fact text. */
const CULTURE_TRUE: Record<string, string> = {
  zen: "弓道與禪的強烈連結，主要是二戰後（尤其 1956 年《弓與禪》日譯本出版後）才形成的形象。",
  hit: "審查統一基準寫「的中不問」的，只有弐段那一欄；参段起要求「的中やや確実」。",
  shaho: "射法八節是 1953 年《弓道教本》中確立的現代基準，用來整合各流派。",
  unbroken: "日本弓道的傳承經歷過多次斷裂，例如明治維新後衰退、戰後被禁後再重建。",
  issha: "「一射絶命」是阿波研造在 1920 年代提出的個人教義，不是全弓連的官方標語。",
  wakyu: "和弓握把偏下的真正理由仍沒有定論，只有材料、姿勢、彈力等幾種假說。",
  heki: "小笠原流與日置流是不同的系統，並非所有流派都源自日置彈正。",
  toshiya: "三十三間堂的通し矢，比的是從外廊南端射「通」到北端的箭數，不是射靶。",
  "1895": "依學術研究，大日本弓術會改名「大日本弓道會」、武德會改「武術」為「武道」，都在 1919 年。",
  ct: "臺灣弓道協會是國際弓道連盟（IKYF）的正式會員，名單上列為「Chinese Taipei」。",
  name: "台灣加入國際弓道連盟的弓道團體，名稱是「臺灣弓道協會」。",
};

const ETIQUETTE_TRUE: Record<string, string> = {
  "yu-15": "全弓連用語辭典寫揖是「上半身前屈約 10 公分」——用距離，不是角度。",
  "rei-45": "「立禮約前屈 45 度」是指導書的寫法；坐禮沒有角度，依手的位置分指建礼、折手礼。",
  "first-rei": "競技規則寫「1 番行礼、2 番以後揖（二息）」，沒有寫礼的息數；「三息」是指導書的補充。",
  "next-enter": "審查時，下一組在 3 番乙矢的弦音時入場；5 人立的競技規則則寫 2 番乙矢。",
  dozukuri: "全弓連的審查要領寫的是「2 番在 1 番胴造り快結束時起身」。",
  "yatori-call": "矢取り的口令沒有全國統一的用語，請依所屬道場。",
  akahata: "競技規則對赤旗的規定是「50 公分見方以上」；70 公分是指導書的建議。",
  mix: "宮崎縣手冊寫：武射系、禮射系哪一種都可以，但不能混用。",
  "kai-5s": "「会約 5 秒、残心約 2 秒」是指導書給學生的練習指引，不是審查或射法的規定。",
  kamidana: "向神棚的拜禮方式，指導書寫「依各道場的作法」，沒有統一規定。",
  matagu: "「不跨越弓具」的規則確實存在，但指導書沒有寫理由。",
  rissha: "坐射有困難時可以依手續改用立射；立射是正式承認的形式。",
  "3steps": "用語辭典寫本座到射位：坐射 3 步、立射 2 步；競技規則另以距離（近的 2.0 公尺）規定。",
};

/** Etiquette myths whose claim is "partly right / depends" — asked only in the 「對」 form. */
const ETIQUETTE_NOT_CLEARLY_FALSE = new Set(["rei-45", "first-rei", "next-enter", "dozukuri", "mix"]);

export interface MythPair {
  id: string;
  falseItem?: TrueFalseItem;
  trueItem?: TrueFalseItem;
}

const CULTURE_LINK = { href: "/culture/#myths", label: "看〈文化與哲學〉的迷思澄清" };
const ETIQUETTE_LINK = { href: "/etiquette/#myths", label: "看〈禮法與體配〉的說法對照" };

export const MYTH_PAIRS: MythPair[] = [
  ...CULTURE_MYTHS.map((m): MythPair => {
    const base = { explain: m.fact, kindLabel: "文化迷思", src: m.src, more: CULTURE_LINK };
    const t = CULTURE_TRUE[m.id];
    return {
      id: `c-${m.id}`,
      falseItem: { ...base, id: `c-${m.id}-f`, statement: m.myth, isTrue: false },
      trueItem: t ? { ...base, id: `c-${m.id}-t`, statement: t, isTrue: true } : undefined,
    };
  }),
  ...ETIQUETTE_MYTHS.map((m): MythPair => {
    const base = { explain: m.verdict, tag: m.tag, kindLabel: "禮法迷思", src: m.src ?? [], more: ETIQUETTE_LINK };
    const t = ETIQUETTE_TRUE[m.id];
    return {
      id: `e-${m.id}`,
      falseItem: ETIQUETTE_NOT_CLEARLY_FALSE.has(m.id) ? undefined : { ...base, id: `e-${m.id}-f`, statement: m.claim, isTrue: false },
      trueItem: t ? { ...base, id: `e-${m.id}-t`, statement: t, isTrue: true } : undefined,
    };
  }),
].filter((p) => p.falseItem || p.trueItem);

/**
 * One session: n different myths, each asked once. About 40% are asked in their 「對」 form
 * (when one exists), so both buttons get used.
 */
export function buildMythSession(n: number): TrueFalseItem[] {
  const pairs = sample(MYTH_PAIRS, n);
  const wantTrue = Math.round(pairs.length * 0.4);
  let trues = 0;
  const out = pairs.map((p) => {
    const both = p.falseItem && p.trueItem;
    if (!both) return (p.falseItem ?? p.trueItem) as TrueFalseItem;
    const pickTrue = trues < wantTrue && Math.random() < 0.6;
    if (pickTrue) trues++;
    return (pickTrue ? p.trueItem : p.falseItem) as TrueFalseItem;
  });
  return shuffle(out);
}

export const MYTH_COUNT = MYTH_PAIRS.length;
