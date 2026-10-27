// 〈第一次去道場〉步驟播放器的資料：從出門到離開道場的一天。
// 每一步的要點都直接取自本頁既有的內容（FIRST_VISIT、ROADMAP、SAFETY_RULES），不另寫新的規定；
// 只有最後一步的「以道場為準」是本站整理。

import { BUDOKAN, TAIWAN } from "../common-sources";
import type { Point } from "../types";
import { FIRST_VISIT, ROADMAP, SAFETY_RULES } from "./content";

/** Where the visitor is on the 道場 map (see components/guide/FirstVisitSteps.tsx). */
export type VisitStation = "home" | "genkan" | "dojo" | "practice" | "shajo" | "exit";

export interface VisitStep {
  id: string;
  title: string;
  /** one-line caption under the title */
  text: string;
  station: VisitStation;
  /** 2–3 short labels drawn in the map's note box */
  chips: string[];
  points: Point[];
}

const visit = (q: string) => FIRST_VISIT.find((v) => v.q === q)?.points ?? [];
const road = (id: string) => ROADMAP.find((r) => r.id === id);
const rule = (title: string) => SAFETY_RULES.find((r) => r.title === title);

const wear = visit("要穿什麼？");
const bring = visit("要帶什麼？要先買弓嗎？");
const enter = visit("一進門要做什麼？");
const toshu = road("toshu");
const taiken = road("taiken");

const rulePoints = (titles: string[]): Point[] =>
  titles.flatMap((t) => {
    const r = rule(t);
    return r ? [{ text: `${r.title}：${r.text}`, tag: r.tag, src: r.src }] : [];
  });

export const VISIT_STEPS: VisitStep[] = [
  {
    id: "wear",
    title: "出門前：穿對衣服",
    text: "白上衣、黑長褲、白襪；避開前排扣和左胸口袋。",
    station: "home",
    chips: ["白色上衣", "黑色長褲", "白襪"],
    points: wear,
  },
  {
    id: "bring",
    title: "要帶什麼：不用先買弓",
    text: "課程有公用的弓、箭、弽，先準備下がけ和白襪就好。",
    station: "home",
    chips: ["不用買弓", "下がけ", "白襪或足袋"],
    points: bring,
  },
  {
    id: "enter",
    title: "進門：鞋子排好，行禮",
    text: "進出道場、射場、巻藁區都要行禮。",
    station: "genkan",
    chips: ["鞋子排整齊", "行禮"],
    points: enter.slice(0, 2),
  },
  {
    id: "inside",
    title: "在道場裡：不跨弓具，保持安靜",
    text: "別人拉弓時安靜；中靶不喝彩；不主動指導別人。",
    station: "dojo",
    chips: ["不跨弓具", "保持安靜", "中靶不喝彩"],
    points: enter.slice(2),
  },
  {
    id: "practice",
    title: "開始練習：從徒手開始",
    text: "第一天多半是見學、體驗，什麼都不拿先練動作。",
    station: "practice",
    chips: ["從徒手開始", "絕不對人"],
    points: [
      ...(taiken ? [{ text: taiken.what, tag: taiken.tag, src: taiken.src }] : []),
      ...(toshu ? [{ text: toshu.what, tag: toshu.tag, src: toshu.src }] : []),
      ...(toshu?.safety ? [{ text: toshu.safety, tag: "guide" as const, src: [BUDOKAN.ch2] }] : []),
    ],
  },
  {
    id: "safety",
    title: "射場邊：三條沒有例外的規則",
    text: "不對人、不擅自上的前、不進矢道。",
    station: "shajo",
    chips: ["不對人", "的前要許可", "不進矢道"],
    points: rulePoints(["絕對不對人", "的前要經許可", "不進矢道，取箭要舉旗"]),
  },
  {
    id: "leave",
    title: "結束：問候、行禮後離開",
    text: "上課開始與結束時問候；有疑問就問指導者。",
    station: "exit",
    chips: ["問候", "行禮", "有疑問就問"],
    points: [
      { text: "上課開始與結束時問候；進出道場、射場時行禮。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6, TAIWAN.regulations] },
      { text: "各道場、社團的規矩可能不同：第一次去之前先問一聲，現場以指導者的指示為準。", tag: "note" },
    ],
  },
];
