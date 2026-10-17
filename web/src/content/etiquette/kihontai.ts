// 基本體：4 種基本姿勢與 8 種基本動作。依 docs/research/03 §1；只寫有出處的數字。

import type { Point, Tag, Source } from "../types";
import { ANKF, BUDOKAN, ET } from "./sources";

export interface KeyFigure {
  label: string;
  value: string;
  tag: Tag;
  src?: Source[];
}

export interface KihonItem {
  id: string;
  group: "姿勢" | "動作";
  no: number;
  ja: string;
  kana: string;
  zh: string;
  summary: string;
  figures?: KeyFigure[];
  howto: Point[];
  /** 指導現場常見的提醒（不是官方扣分表） */
  mistakes?: string[];
  deep?: Point[];
}

export const KIHON: KihonItem[] = [
  {
    id: "tatta-shisei",
    group: "姿勢",
    no: 1,
    ja: "立った姿勢",
    kana: "たったしせい",
    zh: "站姿",
    summary: "所有動作的起點：背脊伸直、穩穩站好，眼睛平靜地看向前方。",
    figures: [
      { label: "視線", value: "約 4 m 前方", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { label: "雙腳", value: "男約 3 cm／女併攏", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
    ],
    howto: [
      { text: "背脊伸直，目光經過鼻頭，落在約 4 公尺前方的地面。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "雙腳：男子兩腳間距約 3 公分，女子兩腳併攏。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "看約 4 公尺前方的用意：視野變寬，看得到兩旁射手的動作。", tag: "guide", src: [BUDOKAN.ch5] },
    ],
    mistakes: ["低頭看地", "下巴往前伸", "膝蓋鎖死、身體後仰"],
  },
  {
    id: "koshikaketa-shisei",
    group: "姿勢",
    no: 2,
    ja: "腰かけた姿勢",
    kana: "こしかけたしせい",
    zh: "坐椅子的姿勢",
    summary: "比賽與審查的候場區、本座有時會放椅子，坐椅子也有規矩。",
    howto: [
      { text: "競技規則與運營要領有「起立」口令，以及「本座的前一步站著等（可用椅子）」等規定。", tag: "official", src: [ANKF.playRules, ET.operation] },
      { text: "宮崎縣手冊的寫法：從椅子左側（下座那一側）坐下。", tag: "local", src: [ET.miyazaki] },
      { text: "各會場的上座位置不同，「左側＝下座」不一定成立；請照現場與老師的指示。", tag: "disputed" },
    ],
  },
  {
    id: "seiza",
    group: "姿勢",
    no: 3,
    ja: "坐った姿勢（正坐）",
    kana: "すわったしせい（せいざ）",
    zh: "正坐",
    summary: "腳背貼地、臀部坐在腳跟上的坐姿。上課開始、結束的問候常用正坐。",
    figures: [{ label: "視線", value: "約 2 m 前方", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] }],
    howto: [
      { text: "全弓連用語辭典：「正坐」就是「坐った姿勢」。", tag: "official", src: [ANKF.terminology] },
      { text: "背脊伸直，視線落在約 2 公尺前方。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "學校授業的安排：上下課的問候、戴弽（ゆがけ）與胸當時用正坐。", tag: "guide", src: [BUDOKAN.ch5] },
      { text: "無法正坐的人，指導書建議站在最後一排改行立禮，並要求指導者顧及無法正坐的學生。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5] },
    ],
  },
  {
    id: "kiza",
    group: "姿勢",
    no: 4,
    ja: "跪坐・蹲踞",
    kana: "きざ・そんきょ",
    zh: "跪坐與蹲姿",
    summary: "腳尖立起的坐姿。射場裡等候、坐射搭箭都用跪坐，是坐射最常用的姿勢。",
    howto: [
      { text: "跪坐（きざ）：腳尖立起、雙膝著地、臀部坐在腳跟上。", tag: "official", src: [ANKF.terminology] },
      { text: "蹲踞（そんきょ）：腳尖立起，膝蓋不著地的蹲姿。", tag: "official", src: [ANKF.terminology] },
      { text: "膝を生かす（ひざをいかす）：跪坐時，拿著主要物品（通常是弓）那一側的膝蓋稍微離地。", tag: "official", src: [ANKF.terminology] },
      { text: "射場裡等候與坐射搭箭時用跪坐；指導書提醒跪坐時要教「膝を生かす」。", tag: "guide", src: [BUDOKAN.ch4] },
    ],
    mistakes: ["腳背貼地（變成正坐）", "臀部懸空沒坐到腳跟", "上半身前傾", "雙膝大開"],
    deep: [
      { text: "戴、脫弽一定用正坐或跪坐（戶外則蹲踞）。", tag: "local", src: [ET.miyazaki] },
      { text: "跪坐時雙膝要開多寬，本站沒有找到官方數字。", tag: "disputed" },
      { text: "穿袴從跪坐起身時，很容易踩到袴擺。", tag: "folk", src: [ET.toxKneel] },
    ],
  },
  {
    id: "tachikata",
    group: "動作",
    no: 1,
    ja: "立ち方",
    kana: "たちかた",
    zh: "站起來",
    summary: "從坐姿站起來，上半身不晃、不借手力，靠腰與腳的力量直直上升。",
    howto: [
      { text: "從跪坐起身：先「腰を切る」，把骨盆挺起、臀部離開腳跟。", tag: "note" },
      { text: "踏出左腳，以腳尖為軸，不破壞胴造り（上半身的架構）地站起，同時雙腳併攏。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "頸後與背脊伸直，整個動作配合呼吸（息合い）。", tag: "guide", src: [BUDOKAN.ch6] },
    ],
    mistakes: ["用手撐地或撐膝蓋", "上半身前傾借力（像從椅子站起）", "起身時弓的末弭碰地或晃動"],
    deep: [
      { text: "「腰を切る」是指導現場的說法，全弓連用語辭典沒有收這個詞。", tag: "disputed" },
      { text: "坐射搭好箭起身時：右手護住筈，一邊腰を切る一邊起身，弓保持在「箭與眼同高」的位置。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
    ],
  },
  {
    id: "suwarikata",
    group: "動作",
    no: 2,
    ja: "坐り方",
    kana: "すわりかた",
    zh: "坐下",
    summary: "從站姿坐下：右腳後退半足（腳掌長度的一半），身體垂直往下沉。",
    figures: [{ label: "右腳後退", value: "半足（腳掌一半）", tag: "guide", src: [BUDOKAN.ch4, ANKF.terminology] }],
    howto: [
      { text: "右腳往後退半足，不破壞胴造り地把身體沉下，雙膝併攏。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "半足（はんそく）：腳掌長度的一半。", tag: "official", src: [ANKF.terminology] },
      { text: "起身出左腳、坐下退右腳，與「左進右退」的原則一致。", tag: "note" },
    ],
    mistakes: ["往後倒坐", "膝蓋重重撞地", "跪下時腳背貼地"],
  },
  {
    id: "arukikata",
    group: "動作",
    no: 3,
    ja: "歩き方",
    kana: "あるきかた",
    zh: "走法",
    summary: "腳底貼著地板滑步前進（すり足），以腰為軸，頭的高度幾乎不起伏。",
    figures: [{ label: "足的運法", value: "左進右退", tag: "official", src: [ANKF.terminology] }],
    howto: [
      { text: "盡量不讓後方的人看到腳底，以腰為軸行走。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "重心不要留在後面，帶著「從腰走出去」的意識。", tag: "local", src: [ET.miyazaki] },
      { text: "左進右退（さしんうたい）：前進先出左腳，後退先退右腳。", tag: "official", src: [ANKF.terminology] },
      { text: "下進上退（かしんじょうたい）：前進先出靠下座的腳，後退先退靠上座的腳。", tag: "official", src: [ANKF.terminology] },
    ],
    mistakes: ["像一般走路那樣腳跟先著地、腳尖翹起", "身體上下起伏", "手臂跟著擺動"],
    deep: [
      { text: "「すり足」是現場普遍的教法，全弓連用語辭典沒有收這個詞。", tag: "note" },
      { text: "宮崎縣手冊：入場到本座、射位到退場用「吸氣 2 步、吐氣 2 步」；本座到射位則讓步伐配合呼吸。全弓連規程沒有寫步數與呼吸的對應。", tag: "local", src: [ET.miyazaki] },
      { text: "左進右退與下進上退何時優先，本站沒有找到《弓道教本》原文；宮崎縣手冊寫「通常用左進右退」。", tag: "disputed", src: [ET.miyazaki] },
      { text: "「2 公尺約男子 3.5 步、女子 4.5 步」之類的換算沒有官方根據。", tag: "folk", src: [ET.basicAction] },
    ],
  },
  {
    id: "teishi-mawari",
    group: "動作",
    no: 4,
    ja: "停止体の回り方",
    kana: "ていしたいのまわりかた",
    zh: "站定時轉向",
    summary: "站著不動時改變方向。重點是用腰帶動，而不是用腳尖原地扭轉。",
    howto: [
      { text: "宮崎縣手冊的入場路線：1 番（大前）走到本座前，以直角轉彎。", tag: "local", src: [ET.miyazaki] },
      { text: "個人網站的做法：原地右轉 90 度時，先把左腳腳心靠到右腳尖前成 T 字，再把腳併攏；以腰帶動。", tag: "folk", src: [ET.basicAction] },
      { text: "實際腳法以所屬道場的教法為準。", tag: "note" },
    ],
    mistakes: ["用腳尖原地旋轉、腳跟離地"],
  },
  {
    id: "hoko-mawari",
    group: "動作",
    no: 5,
    ja: "歩行中の回り方",
    kana: "ほこうちゅうのまわりかた",
    zh: "行進中轉向",
    summary: "走路途中改變方向，步伐的節奏不中斷、身體高度不變。",
    howto: [
      { text: "宮崎縣手冊：2 番以後在本座前用「元禄（げんろく）」轉彎，也就是分兩次各轉 45 度，跟上前一人。", tag: "local", src: [ET.miyazaki] },
      { text: "「元禄」這個叫法，以及 1 番與 2 番以後的區分，本站只在地方手冊看到。", tag: "disputed" },
    ],
  },
  {
    id: "hirakiashi",
    group: "動作",
    no: 6,
    ja: "坐しての回り方（開き足）",
    kana: "ざしてのまわりかた（ひらきあし）",
    zh: "跪坐中轉向",
    summary: "在跪坐中把身體轉 90 度。坐射在射位用它從面向靶，轉成面向脇正面。",
    figures: [{ label: "轉向", value: "90 度", tag: "official", src: [ANKF.terminology] }],
    howto: [
      { text: "開き足：從跪坐改變 90 度方向的腳法。", tag: "official", src: [ANKF.terminology] },
      { text: "坐射在射位跪坐後，用開き足轉向脇正面（わきしょうめん，審判員席的方向）。", tag: "official", src: [ANKF.probationGyosha, ANKF.playRules] },
      { text: "指導書：開き足要反覆練習。", tag: "guide", src: [BUDOKAN.ch4] },
    ],
    mistakes: ["轉超過或不到 90 度", "身體高度大起大落", "用手撐地", "轉完膝蓋沒對齊原本的線"],
    deep: [
      { text: "先動哪隻腳、腳尖怎麼交叉、膝蓋何時離地，本站沒有找到可引用的一手文字。這一項請一定跟老師當面學。", tag: "disputed" },
    ],
  },
  {
    id: "rei",
    group: "動作",
    no: 7,
    ja: "礼",
    kana: "れい",
    zh: "禮（深禮）",
    summary: "比揖更深的禮。立禮約前屈 45 度；坐禮依手的位置分成指建礼與折手礼。",
    figures: [{ label: "立禮", value: "約 45 度前屈", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5, BUDOKAN.ch6] }],
    howto: [
      { text: "立禮：上半身約前屈 45 度，雙手指尖到雙膝頭。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5, BUDOKAN.ch6] },
      { text: "坐禮：背脊伸直彎身（指導書只寫到這裡）。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "指建礼（しけんれい）：指尖碰到地板程度的坐禮。", tag: "official", src: [ANKF.terminology] },
      { text: "折手礼（せっしゅれい）：手掌貼地、指尖約在膝頭位置的坐禮。", tag: "official", src: [ANKF.terminology] },
    ],
    mistakes: ["駝背彎腰", "膝蓋彎曲、臀部往後坐", "彎得太快"],
    deep: [
      { text: "全弓連用語辭典沒有收「礼」「立礼」，45 度是指導書的寫法。《弓道教本》原文是否寫 45 度，本站未見。", tag: "disputed" },
      { text: "拿著弓矢時的坐禮，全弓連學科試題（五段）考過，題目註明在《弓道教本》第一卷；本站未見原文，所以不寫步驟。", tag: "official", src: [ET.written2020] },
      { text: "向神棚或上座的拜禮：指導書明寫「拝礼の仕方は各道場の作法による」（依各道場的作法）。", tag: "guide", src: [BUDOKAN.ch4] },
    ],
  },
  {
    id: "yu",
    group: "動作",
    no: 8,
    ja: "揖",
    kana: "ゆう",
    zh: "揖（輕禮）",
    summary: "上半身輕輕前屈約 10 公分的禮。射場進退、本座最常用到它。",
    figures: [
      { label: "前屈", value: "約 10 cm（距離，非角度）", tag: "official", src: [ANKF.terminology] },
      { label: "呼吸", value: "入退場口二息・本座三息", tag: "official", src: [ANKF.playRules] },
    ],
    howto: [
      { text: "全弓連用語辭典：揖是「上体を10cmほど屈する礼」——上半身前屈約 10 公分。用的是距離，不是角度。", tag: "official", src: [ANKF.terminology] },
      { text: "入退場口（2 番以後）、本座（全員一起）都行揖。", tag: "official", src: [ANKF.playRules] },
      { text: "出了「失」回到射位後，向正面揖表示歉意。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "競技規則：入退場口的揖是二息，本座「揃って揖」是三息。", tag: "official", src: [ANKF.playRules] },
    ],
    mistakes: ["只點頭、背不動", "彎太深變成禮", "弓跟著身體前後擺"],
    deep: [{ text: "「揖約 15 度」的說法在網路上常見，但沒有官方出處。", tag: "folk" }],
  },
];
