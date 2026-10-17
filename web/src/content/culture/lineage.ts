// 流派系譜 (docs/research/01 §1.3, §1.4, §2.10).
// edge: how this node connects to its parent.
//   solid  = 史料可考
//   legend = 傳說／存疑（虛線）
//   gap    = 傳承中斷後復興（點線）

import type { Source, Tag } from "../types";
import { ANKF } from "../common-sources";
import { CS } from "./sources";

export type Edge = "solid" | "legend" | "gap";

export interface LineageNode {
  id: string;
  name: string;
  kana?: string;
  /** person / years / one-line note */
  who?: string;
  note?: string;
  tag?: Tag;
  edge?: Edge;
  edgeLabel?: string;
  src?: Source[];
  children?: LineageNode[];
}

export interface LineageGroup {
  id: string;
  title: string;
  lead: string;
  roots: LineageNode[];
}

export const EDGE_LABEL: Record<Edge, string> = {
  solid: "史料可考",
  legend: "傳說／存疑",
  gap: "中斷後復興",
};

export const LINEAGE: LineageGroup[] = [
  {
    id: "ogasawara",
    title: "禮法・騎射系",
    lead: "鎌倉時代起源，重視儀典故實與騎射。",
    roots: [
      {
        id: "ogasawara",
        name: "小笠原流",
        kana: "おがさわらりゅう",
        who: "始祖：小笠原長清（1162–1242）",
        note: "傳承弓術、馬術與禮法。",
        src: [CS.yamada, CS.keio],
        children: [
          {
            id: "sadamune",
            name: "小笠原貞宗、常興",
            who: "14 世紀",
            note: "把武家弓射整理成規範，小笠原家其後長期擔任幕府的弓術與禮法師範。",
            edge: "solid",
            src: [ANKF.history],
            children: [
              {
                id: "tsuneharu",
                name: "小笠原平兵衛常春",
                who: "江戶中期，奉德川吉宗之命",
                note: "早期教法在室町時代大多失傳；常春研究並復興騎射與故實，是今日東京小笠原流的直接奠基者。",
                edge: "gap",
                edgeLabel: "室町時代大多失傳 → 江戶復興",
                src: [CS.yamada],
              },
            ],
          },
        ],
      },
      {
        id: "takeda",
        name: "武田流",
        kana: "たけだりゅう",
        who: "奉武田信光（?–1248）為祖",
        note: "與小笠原流同源的騎射流派；鎌倉祭的流鏑馬由武田流負責。",
        src: [CS.yamada, CS.keio],
      },
    ],
  },
  {
    id: "heki",
    title: "步射・武射系：日置流",
    lead: "室町～戰國時期成立，以實戰射術為主，後來分出許多派別。",
    roots: [
      {
        id: "danjo",
        name: "日置彈正正次",
        kana: "へき だんじょう まさつぐ",
        who: "生卒年有「約 1444–1502」「?–1502」等說法",
        note: "傳說中的流祖。是否確有其人，學界至今沒有定論。",
        tag: "disputed",
        src: [CS.yamada, CS.kbHeki],
        children: [
          {
            id: "yoshida",
            name: "吉田重賢・重政父子",
            who: "重賢 1463–1543、重政 1485–1569",
            note: "從這一系開始，傳承才有史料可考，稱為日置流（へきりゅう），也稱吉田流。",
            edge: "legend",
            edgeLabel: "傳說",
            src: [CS.yamada, CS.kbHeki],
            children: [
              { id: "izumo", name: "出雲派", kana: "いずもは", who: "吉田家系", edge: "solid", src: [ANKF.history, CS.kbHeki] },
              {
                id: "sekka",
                name: "雪荷派",
                kana: "せっかは",
                who: "吉田重勝（號雪荷）",
                note: "阿波研造最早學的就是雪荷派；也是通し矢的主力之一。",
                edge: "solid",
                src: [CS.yamada, CS.kbHeki],
                children: [
                  { id: "dosetsu", name: "道雪派", kana: "どうせつは", who: "伴道雪，從雪荷派分出", edge: "solid", src: [CS.kbHeki] },
                ],
              },
              {
                id: "insai",
                name: "印西派",
                kana: "いんさいは",
                who: "吉田一水軒印西（1562–1638）",
                note: "以步射為主，追求精準與「不懼死」的心性。",
                edge: "solid",
                src: [CS.yamada, CS.kbHeki],
              },
              { id: "okura", name: "大蔵派", kana: "おおくらは", who: "吉田家系", edge: "solid", src: [ANKF.history, CS.yamada] },
              { id: "sakon", name: "左近右衛門派", kana: "さこんえもんは", who: "吉田家系", edge: "solid", src: [CS.yamada] },
            ],
          },
          {
            id: "chikurin",
            name: "竹林派",
            kana: "ちくりんは",
            who: "真言宗僧侶竹林坊如成所創，盛行於尾張、紀州",
            note: "名稱上歸屬「日置流」，但多數學者認為它和日置彈正沒有直接傳承關係。通し矢的主力之一。",
            tag: "disputed",
            edge: "legend",
            edgeLabel: "名義歸屬，傳承存疑",
            src: [ANKF.history, CS.yamada, CS.kbHeki],
            children: [
              {
                id: "honda",
                name: "本多流",
                kana: "ほんだりゅう",
                who: "明治時代，本多利實（1836–1917）",
                note: "利實原屬竹林派，改採正面打起し；在東京帝國大學指導，門下團體把正面打起し推廣到全國。",
                edge: "solid",
                src: [ANKF.history, CS.yamada, CS.goka2018],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "others",
    title: "其他流派",
    lead: "江戶以後成立的流派。",
    roots: [
      {
        id: "yamato",
        name: "大和流",
        kana: "やまとりゅう",
        who: "江戶元祿年間，森川香山",
        note: "森川香山的生卒年待查證。",
        src: [ANKF.history],
      },
    ],
  },
];

/** 射的分類（教學用的簡化）。 */
export const SHOOTING_TYPES = {
  reisha: { name: "禮射", kana: "れいしゃ", text: "儀禮性、咒術性的弓射。山田奨治稱它幾乎是小笠原流的專屬領域。" },
  busha: {
    name: "武射",
    kana: "ぶしゃ",
    text: "實戰取向，主要是日置流系統。",
    children: [
      { name: "步射", kana: "ほしゃ", text: "步兵射術，約 30 m 內射穿鎧甲，例如印西派。現代近的 28 m 延續了這個距離設定。" },
      { name: "騎射", kana: "きしゃ", text: "騎馬射術，小笠原流、武田流；現代以流鏑馬留存。" },
      { name: "堂射", kana: "どうしゃ", text: "三十三間堂通し矢的專用技法，竹林派、雪荷派；明治以後衰退。" },
    ],
  },
  src: [CS.yamada, CS.jaWiki],
};
