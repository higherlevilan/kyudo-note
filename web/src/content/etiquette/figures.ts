// 本頁「有出處的數字」一覽（docs/research/03 §0.1）。不在這裡的數字，都不應寫成規定。

import type { KeyFigure } from "./kihontai";
import { ANKF, BUDOKAN } from "./sources";

export const KEY_FIGURES: (KeyFigure & { note?: string })[] = [
  { label: "揖", value: "上半身前屈約 10 cm", tag: "official", src: [ANKF.terminology], note: "距離，不是角度" },
  { label: "立禮", value: "約 45 度前屈", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5], note: "雙手指尖到膝頭" },
  { label: "開き足", value: "轉向 90 度", tag: "official", src: [ANKF.terminology], note: "從跪坐轉向" },
  { label: "本座→射位", value: "坐射 3 步・立射 2 步", tag: "official", src: [ANKF.terminology, ANKF.playRules], note: "近的坐射標準 2.0 m" },
  { label: "揖的息數", value: "入退場口二息・本座三息", tag: "official", src: [ANKF.playRules], note: "競技規則" },
  { label: "執弓的末弭", value: "離地約 10 cm", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch5], note: "身體前方中央" },
  { label: "視線", value: "立約 4 m・坐約 2 m", tag: "guide", src: [BUDOKAN.ch4, BUDOKAN.ch6], note: "經過鼻頭往前" },
  { label: "審查射場", value: "近的・5 人立・坐射", tag: "official", src: [ANKF.probationRules], note: "36 cm 霞的" },
];
