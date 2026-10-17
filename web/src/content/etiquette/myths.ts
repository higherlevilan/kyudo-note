// 常見迷思與「說法不一」（docs/research/03 §7、§2.6）。

import type { Source, Tag } from "../types";
import { ANKF, BUDOKAN, ET, TAIWAN } from "./sources";

export interface Myth {
  id: string;
  claim: string;
  verdict: string;
  tag: Tag;
  src?: Source[];
}

export const MYTHS: Myth[] = [
  {
    id: "yu-15",
    claim: "揖是 15 度。",
    verdict: "全弓連用語辭典寫的是「上半身前屈約 10 公分」，用距離，不是角度。15 度沒有官方出處。",
    tag: "folk",
    src: [ANKF.terminology],
  },
  {
    id: "rei-45",
    claim: "禮就是 45 度。",
    verdict: "立禮約 45 度是指導書的寫法，可以引用但要註明出處；用語辭典沒有收「礼」。坐禮沒有角度，只有指建礼、折手礼的手部位置。",
    tag: "guide",
    src: [BUDOKAN.ch4, BUDOKAN.ch5, ANKF.terminology],
  },
  {
    id: "first-rei",
    claim: "1 番入場的禮是三息。",
    verdict: "競技規則只寫「1 番行礼、2 番以後揖（二息）」，沒寫礼的息數；三息是指導書的補充。審查要領則只寫「依序禮（揖）」。",
    tag: "disputed",
    src: [ANKF.playRules, BUDOKAN.ch4, ANKF.probationGyosha],
  },
  {
    id: "next-enter",
    claim: "下一組在 2 番（或 3 番）乙矢的弦音時入場。",
    verdict: "兩者都對，看場合：5 人立的競技規則寫 2 番乙矢，審查要領寫 3 番乙矢。指導書描述競技時又寫成 3 番。請分清「競技」與「審查」。",
    tag: "disputed",
    src: [ANKF.playRules, ANKF.probationGyosha, BUDOKAN.ch4],
  },
  {
    id: "dozukuri",
    claim: "團體行射要「胴造りまで揃える」。",
    verdict: "本站在全弓連公開文件中沒有找到這句原文。官方寫的是「2 番在 1 番胴造り快結束時起身」，可能是某些道場或射禮的口傳。",
    tag: "disputed",
    src: [ANKF.probationGyosha],
  },
  {
    id: "yatori-call",
    claim: "矢取り的口令全國統一。",
    verdict: "沒有統一用語。同一本指導書裡就有三種版本，台灣藏月弓道場與日本講習會又各不相同。請依所屬道場。",
    tag: "disputed",
    src: [BUDOKAN.ch2, BUDOKAN.ch4, BUDOKAN.ch5, TAIWAN.regulations],
  },
  {
    id: "akahata",
    claim: "赤旗要 70 公分見方。",
    verdict: "競技規則是「50 公分見方以上」，70 公分是指導書的建議。兩者不矛盾，但 70 公分不是規則條文。",
    tag: "disputed",
    src: [ANKF.playRules, BUDOKAN.ch2],
  },
  {
    id: "mix",
    claim: "武射系、禮射系可以混著用。",
    verdict: "指導書並列兩種方式，沒說不能混；宮崎縣手冊明寫不能混用。持箭方式會決定足踏み與送箭，混用會讓動作不連貫——選一種並保持一致。",
    tag: "local",
    src: [BUDOKAN.ch4, ET.miyazaki],
  },
  {
    id: "kai-5s",
    claim: "「会要 5 秒、殘心要 2 秒」是規定。",
    verdict: "這是指導書給中學生的練習指引，不是審查或射法的規定。實際長度依個人與呼吸而定。",
    tag: "guide",
    src: [BUDOKAN.ch5, BUDOKAN.ch6],
  },
  {
    id: "kamidana",
    claim: "向神棚要二禮二拍手一拜。",
    verdict: "指導書寫「拝礼の仕方は各道場の作法による」，沒有統一規定。二拍手是神社或部分道場的做法。",
    tag: "guide",
    src: [BUDOKAN.ch4],
  },
  {
    id: "matagu",
    claim: "不能跨弓，是因為弓有靈性。",
    verdict: "「不跨越弓具」的規則確實存在，但指導書沒寫理由。精神性的解釋屬坊間說法；從安全與保護器材來理解比較穩妥。",
    tag: "folk",
    src: [BUDOKAN.ch5],
  },
  {
    id: "rissha",
    claim: "立射是不正式的偷懶版。",
    verdict: "審查與近的競技以坐射為原則，但坐射有困難時可依手續改立射，中央審查也有立射受審申請；立射者配合坐射者的動作。立射是正式承認的形式。",
    tag: "official",
    src: [ANKF.probationRules, ANKF.playRules, ET.documents, ANKF.rissha],
  },
  {
    id: "3steps",
    claim: "本座到射位的「3 步」就是固定幾公分。",
    verdict: "用語辭典講步數（坐射 3 步、立射 2 步），競技規則講距離（近的 2.0 公尺）。不要把 3 步換算成固定公分數套在每個人身上。",
    tag: "official",
    src: [ANKF.terminology, ANKF.playRules],
  },
];
