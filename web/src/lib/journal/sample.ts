// Clearly fictional sample data for 「載入範例資料」. Every record has `sample: true` and an id
// starting with "sample-" so it can be removed in one go without touching real entries.

import { addDays, weekStart } from "./date";
import { blankEntry } from "./model";
import type { Entry, Mark } from "./types";

export const SAMPLE_PREFIX = "sample-";
export const isSample = (e: Entry) => e.sample === true || e.id.startsWith(SAMPLE_PREFIX);

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PLACE = "範例道場（虛構）";
const TEACHER = "範例老師";

export function sampleEntries(today: string, nowIso: string): Entry[] {
  const rand = rng(20261018);
  const out: Entry[] = [];
  let n = 0;
  const id = () => `${SAMPLE_PREFIX}${(n++).toString().padStart(3, "0")}`;
  const mk = <T extends Entry["type"]>(type: T, date: string) => {
    const e = blankEntry(type, date, nowIso, id());
    e.sample = true;
    e.tags = ["範例"];
    return e;
  };

  // Gear first so practices can reference it.
  const yumi = mk("purchase", addDays(today, -120));
  Object.assign(yumi, {
    item: "（範例）グラスファイバー弓",
    category: "yumi",
    shop: "範例弓具店",
    price: 16800,
    currency: "TWD",
    specs: [
      { label: "弓長（並寸／伸寸）", value: "並寸" },
      { label: "弓力（kg）", value: "11" },
    ],
  });
  const ya = mk("purchase", addDays(today, -118));
  Object.assign(ya, {
    item: "（範例）ジュラルミン矢 6 本組",
    category: "ya",
    shop: "範例弓具店",
    price: 9800,
    currency: "TWD",
    specs: [
      { label: "矢尺（cm）", value: "90" },
      { label: "支數", value: "6" },
    ],
  });
  const kake = mk("purchase", addDays(today, -90));
  Object.assign(kake, { item: "（範例）三つ弽", category: "kake", shop: "範例網路商店（日本）", price: 38000, currency: "JPY", specs: [{ label: "尺寸", value: "中" }] });
  const tsuru = mk("purchase", addDays(today, -30));
  Object.assign(tsuru, { item: "（範例）合成弦", category: "tsuru", shop: "範例弓具店", price: 450, currency: "TWD", status: "spare" });
  out.push(yumi, ya, kake, tsuru);

  // ~15 weeks of practice, two or three sessions a week, slowly improving.
  const start = addDays(weekStart(today), -7 * 14);
  const FAULT_POOL = ["hayake", "yurumi", "tsuru-arm", "yugaeri", "oshide", "katasaki", "biku"];
  for (let w = 0; w < 15; w++) {
    for (const dow of [2, 5, 6]) {
      const date = addDays(start, w * 7 + dow);
      if (date > today) continue;
      if (dow === 6 && rand() < 0.55) continue;
      if (rand() < 0.12) continue; // missed a session
      const p = mk("practice", date);
      const progress = w / 14;
      const tachi = 3 + Math.floor(rand() * 4);
      const rate = 0.3 + 0.22 * progress + (rand() - 0.5) * 0.15;
      const useGrid = w >= 11 && dow !== 6;
      const rounds: Mark[][] = [];
      let arrows = 0;
      let hits = 0;
      for (let t = 0; t < tachi; t++) {
        const r: Mark[] = [];
        for (let i = 0; i < 4; i++) {
          const hit = rand() < rate;
          r.push(hit ? "o" : "x");
          arrows++;
          if (hit) hits++;
        }
        rounds.push(r);
      }
      const faults = FAULT_POOL.filter((f, i) => rand() < (i === 0 ? 0.5 - 0.35 * progress : 0.22));
      Object.assign(p, {
        place: PLACE,
        kinds: dow === 6 ? ["makiwara", "matomae"] : ["matomae"],
        rounds: useGrid ? rounds : [],
        arrows,
        hits,
        makiwara: dow === 6 ? 10 + Math.floor(rand() * 10) : 0,
        durationMin: 90 + Math.floor(rand() * 4) * 15,
        faults,
        yadokoro: rand() < 0.5 ? ["mae"] : rand() < 0.5 ? ["shita"] : ["chiru"],
        focusSteps: rand() < 0.5 ? ["kai", "hanare"] : ["uchiokoshi", "hikiwake"],
        ...(rand() < 0.4 ? { instructor: TEACHER, feedback: "（範例）會的時間再多保持一點，左右均等地伸展。" } : {}),
        reflection: rand() < 0.6 ? "（範例）前半段比較急，後半段放慢之後離比較順。" : "",
        fatigue: 2 + Math.floor(rand() * 3),
        painAreas: w >= 12 && rand() < 0.7 ? ["弓手肩（左）"] : rand() < 0.1 ? ["手腕"] : [],
        equipmentIds: [yumi.id, ya.id, ...(w * 7 > 30 ? [kake.id] : [])],
        notes: "這是範例資料，可在「資料」分頁一鍵移除。",
      });
      out.push(p);
    }
  }

  const l1 = mk("lesson", addDays(today, -80));
  Object.assign(l1, {
    className: "（範例）初心者講習 第 3 回",
    teacher: TEACHER,
    place: PLACE,
    keyPoints: ["足踏み的寬度約為矢束", "胴造り時重心放在兩腳中央", "打起し時兩拳高度一致"],
    steps: ["ashibumi", "dozukuri", "uchiokoshi"],
    homework: "回家用ゴム弓練習引分け 20 次",
  });
  const l2 = mk("lesson", addDays(today, -25));
  Object.assign(l2, {
    className: "（範例）會與離的講習",
    teacher: TEACHER,
    place: PLACE,
    keyPoints: ["會不是停止，是持續伸合", "離由內而外自然發生"],
    steps: ["kai", "hanare", "zanshin"],
  });
  out.push(l1, l2);

  const ex = mk("exam", addDays(today, -60));
  Object.assign(ex, {
    grade: "初段",
    result: "pass",
    place: "（範例）某縣市審查會場",
    marks: ["o", "x"],
    questions: ["（範例）射法八節的名稱與要點", "（範例）弓道修練的目的"],
    judgeComments: "（範例）體配穩定，打起し再大一些。",
    reflection: "（範例）入場時太緊張，下次練習時多模擬審查流程。",
  });
  out.push(ex);

  const c1 = mk("culture", addDays(today, -45));
  Object.assign(c1, { event: "（範例）神社流鏑馬參觀", kind: "yabusame", place: "（範例）某神社", notes: "這是範例資料。" });
  const c2 = mk("culture", addDays(today, -10));
  Object.assign(c2, { event: "（範例）他道場交流射會", kind: "taikai", place: "（範例）友好道場" });
  out.push(c1, c2);

  const g1 = mk("goal", addDays(today, 75));
  Object.assign(g1, { title: "（範例）下次審查：弐段", kind: "exam", grade: "弐段" });
  const g2 = mk("goal", addDays(today, 40));
  Object.assign(g2, { title: "（範例）這一季累積 1,500 射", kind: "arrows", target: 1500, since: addDays(today, -90) });
  const g3 = mk("goal", addDays(today, 60));
  Object.assign(g3, { title: "（範例）的中率穩定 50%", kind: "hitrate", target: 50 });
  out.push(g1, g2, g3);

  return out;
}
