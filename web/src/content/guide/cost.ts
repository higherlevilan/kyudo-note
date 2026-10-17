// Defaults for the 費用試算 (annual cost estimator). Prices checked 2026-10-17.
// TWD prices are the 臺灣弓道協會's published fees; JPY prices are 小山弓具 web-shop prices
// (含稅、不含運費與進口稅) and ANKF 別表 1.

import { ANKF, TAIWAN } from "../common-sources";
import type { Source } from "../types";
import { PRICE, TW_X } from "./sources";

export type Currency = "TWD" | "JPY";

export interface CostItem {
  id: string;
  group: "協會與課程" | "場地" | "審查" | "消耗品與弓具";
  label: string;
  /** what one unit is, e.g. 期, 月, 條 */
  unit: string;
  currency: Currency;
  price: number;
  qty: number;
  /** included by default */
  on: boolean;
  /** only paid once (first year) */
  once?: boolean;
  note: string;
  src: Source[];
}

export const COST_ITEMS: CostItem[] = [
  {
    id: "join",
    group: "協會與課程",
    label: "協會入會費",
    unit: "次",
    currency: "TWD",
    price: 500,
    qty: 1,
    on: true,
    once: true,
    note: "個人會員，只繳一次，不退。",
    src: [TW_X.member, TAIWAN.class],
  },
  {
    id: "annual",
    group: "協會與課程",
    label: "常年會費",
    unit: "年",
    currency: "TWD",
    price: 1000,
    qty: 1,
    on: true,
    note: "每年繳；連續兩年未繳視為退會。",
    src: [TW_X.member],
  },
  {
    id: "class",
    group: "協會與課程",
    label: "弓道教室",
    unit: "期",
    currency: "TWD",
    price: 4800,
    qty: 4,
    on: true,
    note: "每期 6 週；完整課程四期（約 24 堂，上滿 20 堂發修業證明），預設 4 期。一年實際開幾期請看協會行事曆。",
    src: [TAIWAN.class, TW_X.calendar],
  },
  {
    id: "textbook",
    group: "協會與課程",
    label: "教材費",
    unit: "次",
    currency: "TWD",
    price: 200,
    qty: 1,
    on: true,
    once: true,
    note: "第一期繳。",
    src: [TAIWAN.class],
  },
  {
    id: "monthly",
    group: "場地",
    label: "藏月弓道場 月租",
    unit: "月",
    currency: "TWD",
    price: 2000,
    qty: 0,
    on: false,
    note: "會員自主練習用；學生 8 折（NT$1,600）請自行改單價。上課期間通常不需要。",
    src: [TW_X.program],
  },
  {
    id: "hourly",
    group: "場地",
    label: "藏月弓道場 小時票",
    unit: "小時",
    currency: "TWD",
    price: 150,
    qty: 0,
    on: false,
    note: "會員 NT$150／小時（日票 NT$400）。",
    src: [TW_X.program],
  },
  {
    id: "shinsa",
    group: "審查",
    label: "初段 審查料＋登録料",
    unit: "次",
    currency: "JPY",
    price: 5150,
    qty: 1,
    on: false,
    note: "全弓連別表 1：審查料 ¥2,050，合格後登録料 ¥3,100。不含協會手續費（未公開）與赴日旅費。",
    src: [ANKF.probationFee],
  },
  {
    id: "shitagake",
    group: "消耗品與弓具",
    label: "下がけ（棉布內手套）",
    unit: "枚",
    currency: "JPY",
    price: 300,
    qty: 2,
    on: true,
    note: "小山 三ツ用 素面 ¥300；流汗多、夏天要勤換。",
    src: [PRICE.koyamaKake],
  },
  {
    id: "tabi",
    group: "消耗品與弓具",
    label: "足袋",
    unit: "雙",
    currency: "JPY",
    price: 1500,
    qty: 1,
    on: false,
    note: "小山 棉足袋 ¥1,500。協會教室也接受白襪。",
    src: [PRICE.koyamaWear],
  },
  {
    id: "wear",
    group: "消耗品與弓具",
    label: "弓道衣＋袴＋角帯",
    unit: "套",
    currency: "JPY",
    price: 14000,
    qty: 1,
    on: false,
    once: true,
    note: "小山 白筒袖 ¥4,000＋黑袴 ¥8,000＋角帯 ¥2,000。上課可先穿白上衣、黑長褲。",
    src: [PRICE.koyamaWear],
  },
  {
    id: "string",
    group: "消耗品與弓具",
    label: "替弦（合成弦）",
    unit: "條",
    currency: "JPY",
    price: 1210,
    qty: 0,
    on: false,
    note: "小山 吟 特作 ¥1,210。換弦時機說法不一：弓師 200～300 射、弓具店 600～700 射。用公用弓時不需要。",
    src: [PRICE.koyamaStrings, PRICE.issuiString, PRICE.suizanString],
  },
  {
    id: "kit",
    group: "消耗品與弓具",
    label: "自購全套（最低限）",
    unit: "套",
    currency: "JPY",
    price: 86080,
    qty: 1,
    on: false,
    once: true,
    note: "本站以小山標價試算：玻璃纖維弓、鋁箭 6 支、三つがけ，並已含下がけ 2 枚、足袋、弓道衣＋袴＋角帯與替弦 1 條；勾選本項時請取消上面的下がけ、足袋、弓道衣＋袴＋角帯與替弦，避免重複計算。日幣含稅價，不含國際運費與進口稅；初學者不建議急著買。",
    src: [PRICE.koyamaBow, PRICE.koyamaKake, PRICE.koyamaWear, PRICE.koyamaGoods],
  },
];

export const COST_SOURCES: Source[] = [TAIWAN.class, TW_X.member, TW_X.program, TW_X.calendar, ANKF.probationFee, PRICE.bot, PRICE.koyamaKake, PRICE.koyamaWear, PRICE.koyamaStrings, PRICE.koyamaBow, PRICE.issuiString, PRICE.suizanString];
