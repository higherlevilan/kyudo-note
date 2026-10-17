// 文化與哲學 FAQs — also aggregated into the site-wide 問題研究中心.

import type { Faq } from "../types";
import { ANKF, IKYF, TAIWAN } from "../common-sources";
import { CS } from "./sources";

export const CULTURE_FAQS: Faq[] = [
  {
    topic: "基本認識",
    q: "弓道和一般的射箭（archery）有什麼不同？",
    a: [
      {
        text: "弓道使用長度超過兩公尺、握把偏下的和弓，依射法八節的固定步驟射箭，也重視禮法與體配；全弓連以「真・善・美」為最高目標。",
        tag: "official",
        src: [ANKF.mind, ANKF.syaho],
      },
      { text: "奧運的現代射箭屬 World Archery 系統，是和弓道不同的運動，在台灣也有各自的組織；弓道不是奧運項目。", tag: "note" },
    ],
  },
  {
    topic: "思想",
    q: "弓道真的不在乎射中嗎？",
    a: [
      { text: "不是。全弓連的理念是「正射必中」：正確的射法必然命中，命中是正射的檢驗。", tag: "official", src: [ANKF.mind] },
      {
        text: "審查基準在参段寫「的中やや確実」、四段寫「的中確実」；《審查統一基準》只有弐段一欄寫「的中不問」。",
        tag: "official",
        src: [ANKF.probationRules, ANKF.probationStandard],
      },
    ],
  },
  {
    topic: "弓與禪",
    q: "弓道是一種禪修嗎？《弓與禪》還值得讀嗎？",
    a: [
      {
        text: "依山田奨治的研究，弓道與禪的強烈連結主要是戰後、尤其 1956 年《弓與禪》日譯本出版後才形成；Herrigel 的老師阿波研造沒有禪修經歷，書中最神秘的情節有的沒有翻譯在場。",
        tag: "research",
        src: [CS.yamada],
      },
      {
        text: "這本書把很多人帶進弓道，作為文學與個人體驗仍可以讀；只是不要把它當作描寫日本弓道傳統的可靠史料。「射は立禅」這類說法可理解為比喻。",
        tag: "note",
        src: [CS.yamada, CS.budokanJr3],
      },
    ],
  },
  {
    topic: "思想",
    q: "「一射絶命」是全弓連的標語嗎？",
    a: [
      { text: "不是。它出自阿波研造及其「大射道教」，當時就受到同門前輩批評；後來部分道場把它當作通用的弓道精神。", tag: "research", src: [CS.yamada] },
    ],
  },
  {
    topic: "思想",
    q: "為什麼道場常掛著《禮記・射義》？",
    a: [
      { text: "全弓連指出，現行《弓道教本》的開頭就引用〈射義〉；它和《射法訓》常被並列。", tag: "official", src: [ANKF.history] },
      { text: "臺灣弓道協會網站也有〈射義〉的節錄。", tag: "local", src: [TAIWAN.home] },
      { text: "〈射義〉的核心是「射求正諸己」「反求諸己」：射不中時，從自己身上找原因。", src: [CS.wikisource] },
    ],
  },
  {
    topic: "歷史",
    q: "「弓術」和「弓道」差在哪裡？什麼時候改名的？",
    a: [
      { text: "1919 年大日本弓術會改名大日本弓道會，理由是「弓術」只指技術、意思太窄；同年武德會也改「武術」為「武道」。", tag: "research", src: [CS.goka2018, CS.jaWiki] },
      { text: "日本武道館教材寫 1895 年就已改名，與學術研究不同，屬說法不一；本站採 1919 年。", tag: "disputed", src: [CS.budokanJr1] },
    ],
  },
  {
    topic: "歷史",
    q: "和弓的握把為什麼在下方？",
    a: [
      { text: "沒有定論。日本武道館的出版物列出材料、姿勢、彈力、振動節點等假說，並明說真正的理由仍不清楚。", tag: "guide", src: [CS.budokanBow] },
      { text: "可以確定的是，3 世紀的《魏志倭人傳》已記載倭人的木弓「短下長上」。", src: [CS.yamada] },
    ],
  },
  {
    topic: "流派",
    q: "學弓道一定要選流派嗎？",
    a: [
      {
        text: "全弓連的《弓道教本》是整合各流派的現代基準，正面與斜面兩種打起し都採用；多數道場依教本教學，細節依道場習慣而定，可以向指導者確認。",
        tag: "note",
        src: [ANKF.syaho, CS.jaWikiShaho],
      },
      { text: "小笠原流、日置流諸派、本多流等古流仍有傳承，但不是學習弓道的必要條件。", tag: "note", src: [ANKF.history] },
    ],
  },
  {
    topic: "段位",
    q: "段位和稱號怎麼升？要等多久？",
    a: [
      { text: "級位五級～一級、段位初段～十段；五段以下須取得現段位後 5 個月才能受審，六段以上須 1 年。", tag: "official", src: [ANKF.probationRules] },
      { text: "錬士：五段以上且取得五段後 1 年；教士：取得錬士後 2 年且六段後 1 年；範士由審議會選考。", tag: "official", src: [ANKF.probationRules] },
      { text: "台灣會員的審查途徑另有規定，請見臺灣弓道協會「審查情報」。", tag: "local", src: [TAIWAN.shinsa] },
    ],
  },
  {
    topic: "台灣",
    q: "台灣在日治時期就有弓道了嗎？",
    a: [
      { text: "有。1896 年台北已有「大弓場」，1903 年台北武德殿設置弓道場；大日本弓道會在全台設有 46 個支部，南部還有許多製糖會社附屬的弓道會。", tag: "research", src: [CS.goka2022] },
      { text: "戰後多數資料認為弓道活動隨之消失，但中斷的程度仍待查證。", tag: "disputed", src: [CS.toxophilia] },
    ],
  },
  {
    topic: "台灣",
    q: "台灣的弓道組織正確名稱是什麼？",
    a: [
      {
        text: "臺灣弓道協會（Taiwan Kyudo Association），IKYF 名單上列為「Chinese Taipei：Taiwan Kyudo Association」，是正式會員。",
        tag: "local",
        src: [CS.twOrg, IKYF.members],
      },
      { text: "查不到名為「中華民國弓道協會」的組織，請不要使用這個名稱。", tag: "note", src: [TAIWAN.home] },
    ],
  },
  {
    topic: "台灣",
    q: "在台灣哪裡可以學弓道？",
    a: [
      { text: "臺灣弓道協會官網有「弓道教室」頁面；協會的會館道場是新北市新莊的藏月弓道場。開課與報名資訊以官網公告為準。", tag: "local", src: [TAIWAN.class, TAIWAN.home] },
      { text: "部分大學社團與民間道場也有活動，但現況本站未逐一查證。", tag: "disputed", src: [CS.toxophilia] },
    ],
  },
];
