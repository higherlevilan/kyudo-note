// 常見迷思澄清 (docs/research/01 §6, §4.2).

import type { Source } from "../types";
import { ANKF, IKYF, TAIWAN } from "../common-sources";
import { CS } from "./sources";

export interface Myth {
  id: string;
  myth: string;
  fact: string;
  src: Source[];
}

export const MYTHS: Myth[] = [
  {
    id: "zen",
    myth: "弓道就是禪修，自古就是禪的一部分。",
    fact: "弓道和禪的強烈連結主要是二戰後、尤其是 1956 年《弓與禪》日譯本出版後才形成的。但戰前也有少數團體提倡「射禪」，說兩者「完全無關」同樣過頭。比較準確的說法是：「弓道＝禪」是近代建構出來的形象，不是傳統主流。",
    src: [CS.yamada],
  },
  {
    id: "hit",
    myth: "弓道不在乎有沒有射中。",
    fact: "全弓連的理念是「正射必中」。参段的資格基準寫「的中やや確実」、四段寫「的中確実」；寫「的中不問」的只有審查統一基準的弐段一欄。命中是正射的檢驗，不是可有可無。",
    src: [ANKF.mind, ANKF.probationRules, ANKF.probationStandard],
  },
  {
    id: "shaho",
    myth: "射法八節是古代流傳下來的。",
    fact: "射法八節是戰後日本弓道連盟（全弓連前身）在 1953 年《弓道教本》中確立的現代基準，為了整合各流派。各流派仍保有自己的分節與名稱。",
    src: [CS.jaWikiShaho],
  },
  {
    id: "unbroken",
    myth: "日本弓道有從未中斷的悠久傳統。",
    fact: "實際上經歷過多次斷裂：小笠原流教法在室町時代大多失傳、江戶才復興；明治維新後衰退；1934–1942 年的弓道要則風波；戰後被禁再重建。",
    src: [CS.yamada, CS.goka2018, ANKF.history],
  },
  {
    id: "issha",
    myth: "『一射絶命』是弓道的傳統教誨。",
    fact: "依櫻井保之助與山田奨治的研究，它是阿波研造在 1920 年代提出的個人教義，當時就被同門前輩批評。它不是《弓道教本》或全弓連的官方標語。",
    src: [CS.yamada],
  },
  {
    id: "wakyu",
    myth: "和弓握把偏下，是因為某個確定的原因。",
    fact: "沒有定論。日本武道館的出版物明說真正理由仍不清楚，只列出材料、姿勢、彈力、振動節點等假說。可以確定的是，3 世紀的《魏志倭人傳》已經記載「短下長上」。",
    src: [CS.budokanBow, CS.yamada],
  },
  {
    id: "heki",
    myth: "所有流派都源自日置彈正。",
    fact: "小笠原流是另一個系統（鎌倉，小笠原長清）。日置彈正本人是否實有其人也有爭議；竹林派雖稱「日置流竹林派」，多數學者認為它和日置彈正沒有直接傳承關係。",
    src: [CS.yamada, CS.kbHeki],
  },
  {
    id: "toshiya",
    myth: "通し矢是在三十三間堂射靶。",
    fact: "通し矢比的是從外廊南端射到北端（約 120 m）、射「通」過去的箭數，不是射靶。現在每年 1 月的「大的大會」才是在 60 m 距離射大靶。",
    src: [CS.yamada, CS.oomato],
  },
  {
    id: "1895",
    myth: "『弓道』這個名稱是 1895 年武德會成立時改的。",
    fact: "學術研究顯示，大日本弓術會改名大日本弓道會、武德會改「武術」為「武道」，都發生在 1919 年。1895 年的說法見於日本武道館教材，應視為簡化或錯誤。",
    src: [CS.goka2018, CS.jaWiki, CS.budokanJr1],
  },
  {
    id: "ct",
    myth: "名單上寫『Chinese Taipei』，所以台灣沒有正式加入國際弓道連盟。",
    fact: "臺灣弓道協會是 IKYF 的正式會員，名單上列為「Chinese Taipei：Taiwan Kyudo Association」，這是國際體育組織常見的命名方式。",
    src: [IKYF.members, CS.twOrg],
  },
  {
    id: "name",
    myth: "台灣的弓道組織叫『中華民國弓道協會』。",
    fact: "查不到以此為名的組織。台灣加入 IKYF 的團體是「臺灣弓道協會」。另外，現代射箭（World Archery 系統）和弓道是不同的運動，在台灣也有各自的組織。",
    src: [TAIWAN.home, IKYF.members],
  },
];
