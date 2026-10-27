// 射癖與矢所 FAQ（docs/research/04 §8-3）。問題研究中心可依 topic 篩選。

import type { Faq } from "@/content/types";
import { ANKF, BUDOKAN, STUDY, WEB } from "./sources";

export const SHAGUSE_FAQS: Faq[] = [
  {
    topic: "早気",
    q: "早気一定是心理問題嗎？",
    a: [
      { text: "目前證據傾向「心理因素佔很大比重」：小木曽 2023 的早気組（3 人）沒有肌張力異常的特徵，西尾 2021（n=65）也這樣推論。", tag: "research", src: [STUDY.ogiso2023, STUDY.nishio2021] },
      { text: "但也有研究指出引分方式、「会」的要素太早定下來等技術面因素，以及動作自動化。", tag: "research", src: [STUDY.mori1994, STUDY.mori1990, STUDY.matsuo2000] },
      { text: "比較合理的說法是「心理與技術都可能有關，因人而異」。", tag: "note" },
    ],
  },
  {
    topic: "早気",
    q: "早気要多久才會好？",
    a: [
      { text: "森 1990 的問卷（n=237）中，已改善的人約一半在 10 個月內、約 8 成在 3 年內改善，但約 2 成會拖很久，也有超過 10 年的。", tag: "research", src: [STUDY.mori1990] },
      { text: "這是回溯性的自我陳述資料，不能保證個人的情況。", tag: "note" },
    ],
  },
  {
    topic: "もたれ",
    q: "もたれ和早気是同一種問題的反面嗎？",
    a: [
      { text: "不一定。研究發現もたれ只單獨出現（n=65 中 3 人），部分案例有感覺把戲、定型性等肌張力異常的特徵（n=3），機轉可能和早気不同。", tag: "research", src: [STUDY.nishio2021, STUDY.ogiso2023] },
      { text: "長期無法改善、又伴隨固定且局部的肌肉緊繃時，可以考慮諮詢神經內科。這是研究者觀點的延伸，不是臨床指引。", tag: "note", src: [STUDY.ogiso2023] },
    ],
  },
  {
    topic: "緩み",
    q: "「緩み」可以靠什麼改善？",
    a: [
      { text: "小樣本研究（n=8）顯示，「会」中加強右前臂的ひねり、残身時加強右肘伸展，和較少緩み有關。", tag: "research", src: [STUDY.miyakawa2026] },
      { text: "即時回饋有助於察覺自己有緩み（學會摘要，樣本極小）。", tag: "research", src: [STUDY.kawamukai1983] },
      { text: "實際做法請和指導者討論。", tag: "note" },
    ],
  },
  {
    topic: "矢所",
    q: "箭一直往「前」飛，是什麼意思？",
    a: [
      { text: "「前」通常指射手看過去靶的右側。這是一般說法，官方沒有定義句。", tag: "folk", src: [WEB.kyusho] },
      { text: "指導書提到弓手沒有押し切，箭會往前飛。", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6] },
      { text: "力學研究也指出，沒有手の内的作用時箭會往右上偏（小樣本）。", tag: "research", src: [STUDY.hosoya1989, STUDY.miyakawa2026] },
      { text: "其他常見原因見本頁的矢所診斷（多屬一般說法）。", tag: "note" },
    ],
  },
  {
    topic: "矢所",
    q: "矢所診斷說的原因，可以直接照著改嗎？",
    a: [
      { text: "不建議。矢所表是歸納整理，不是診斷工具：同一個矢所可能有好幾個原因，瞄準、弓力與箭重、羽根、風也會影響，研究只支持其中少數項目。", tag: "note" },
      { text: "請讓指導者看你實際的射。", tag: "note" },
    ],
  },
  {
    topic: "弓返り",
    q: "我的弓都不會轉（沒有弓返り），是射癖嗎？",
    a: [
      { text: "初學者通常還不會有弓返り，要能充分做到手の内的作用之後才會出現（實驗研究，n=10）。", tag: "research", src: [STUDY.mori1982] },
      { text: "也有流派或指導者刻意握住弓不讓它轉（打ち切り），所以不一定是射癖。先問清楚你的道場怎麼要求。", tag: "official", src: [ANKF.terminology] },
    ],
  },
  {
    topic: "弦打到臉",
    q: "弦打到臉或手臂，要換護具還是改射法？",
    a: [
      { text: "先確認基本面：沒有空放、髮型與服裝、矢束與弓力是否合適。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch4] },
      { text: "射法上的成因（手の内、肘的位置、臉的方向）多屬一般說法，請讓指導者看實際的射。", tag: "folk", src: [WEB.bakufu] },
    ],
  },
  {
    topic: "弦打到臉",
    q: "「払う」是被弦打到的意思嗎？",
    a: [
      { text: "全弓連用語辭典的「払う離れ」是一種離れ的類型（像把前方東西撥開一樣的離れ），不是被弦打到。", tag: "official", src: [ANKF.terminology] },
      { text: "「顔を払う」「腕を払う」是社團裡說弦擦過臉或手臂的用語。", tag: "folk", src: [WEB.bakufu] },
    ],
  },
  {
    topic: "安全",
    q: "素引き可以放弦嗎？",
    a: [{ text: "不行。指導書規定素引き要「不放弦、送回去」；空放可能弄斷弦，或打到臉和左臂。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch4] }],
  },
  {
    topic: "錄影",
    q: "自己錄影看射形有用嗎？",
    a: [
      { text: "研究曾用錄影找出早気射手的共同特徵，緩み的研究也指出外在回饋有助於察覺。", tag: "research", src: [STUDY.mori1994, STUDY.kawamukai1983] },
      { text: "但沒有研究直接驗證「自己錄影」對弓道的效果。最有用的是把影片拿給指導者看；拍攝時人與器材不可進入矢道或巻藁後方。", tag: "note" },
    ],
  },
];
