// 弓具 FAQ（docs/research/04 §8-1、§8-2）。問題研究中心可依 topic 篩選。

import type { Faq } from "@/content/types";
import { ANKF, BOT, BUDOKAN, BUDOKAN_EQ, FOLK, RULES, SHOP } from "./sources";

export const EQUIPMENT_FAQS: Faq[] = [
  {
    topic: "矢束・矢尺",
    q: "矢束要怎麼量？",
    a: [
      { text: "站直，左臂抬到肩高水平伸直，從喉嚨中心量到左手中指指尖。官方與多數弓具店都這樣量。", tag: "official", src: [ANKF.tool, SHOP.suizanYa, SHOP.yokoyama] },
    ],
  },
  {
    topic: "矢束・矢尺",
    q: "箭要比矢束長多少？",
    a: [
      { text: "全弓連：至少長 5cm（約 3 指寬），初學者約長 10cm；《弓道教本》寫 5～10cm。", tag: "official", src: [ANKF.tool, BUDOKAN.ch3] },
      { text: "弓具店給初學者、高中生的建議更保守：+12～15cm。", tag: "shop", src: [SHOP.suizanYa, SHOP.heian1913] },
      { text: "沒有單一的「正確」數字；初學者以 +10cm 以上為宜，請和指導者確認。", tag: "note" },
    ],
  },
  {
    topic: "矢束・矢尺",
    q: "為什麼箭不能剛好等於矢束？",
    a: [
      { text: "全弓連明令禁止在的前使用比矢束短或剛好等長的箭。", tag: "official", src: [ANKF.tool] },
      { text: "常見的解釋是：拉滿時箭頭可能被拉進弓的內側（引き込み），放箭時撞到弓或傷到左手。", tag: "folk", src: [FOLK.datamax] },
    ],
  },
  {
    topic: "矢束・矢尺",
    q: "可以用「身高÷2」算矢束嗎？",
    a: [
      { text: "只能粗估。官方說矢束由手臂長度決定。", tag: "official", src: [BUDOKAN.ch3] },
      { text: "論壇也有人指出這是舊說法；用 ÷2 和 ×0.55 算，身高 170cm 會差將近 9cm。請實際量。", tag: "folk", src: [FOLK.bbsYazuka] },
    ],
  },
  {
    topic: "弓",
    q: "我該買並寸還是伸寸？",
    a: [
      { text: "大致上：矢束 85cm 以內並寸（221cm）、90cm 以內二寸伸（227cm）、95cm 左右四寸伸（233cm）。各店分界不同（四寸伸上限翠山寫 100、橫山與山武寫 95）。", tag: "shop", src: [SHOP.suizanYumi, SHOP.sambuQA, SHOP.yokoyama] },
    ],
  },
  {
    topic: "弓",
    q: "規則對弓長有限制嗎？",
    a: [{ text: "沒有硬性上下限。只規定「以 221cm 為標準，允許若干長短」，旁註舉出 6～18cm 伸、3～12cm 詰等例子。", tag: "official", src: [ANKF.playRules] }],
  },
  {
    topic: "弓",
    q: "初學者該用幾公斤的弓？",
    a: [
      { text: "全弓連：自己能肩入れ的弓力的 1/2 是標準，初學時 1/3～1/4。", tag: "official", src: [ANKF.tool] },
      { text: "弓具店：初學男性 11～12kg、女性 8～10kg（翠山）；山武建議 6～10kg 起步。", tag: "shop", src: [SHOP.suizanMatch, SHOP.sambuQA] },
      { text: "中學生、高齡者沒有查到具體數字，請由指導者判斷。", tag: "disputed" },
    ],
  },
  {
    topic: "弓",
    q: "弓上標示的 kg 是在什麼條件下量的？",
    a: [
      { text: "以小山弓具為例：並寸拉 85cm、二寸伸 90cm、四寸伸 95cm、六寸伸 100cm 時的值。", tag: "shop", src: [SHOP.koyamaCarbon, SHOP.koyamaSeiho] },
      { text: "全弓連沒有規定測定條件；是否全業界統一，目前只確認兩家。", tag: "disputed", src: [ANKF.tool] },
    ],
  },
  {
    topic: "弓",
    q: "比賽或審查可以用玻纖、碳纖弓嗎？",
    a: [
      { text: "比賽可以。競技規則第 20 條明文允許新素材。", tag: "official", src: [ANKF.playRules] },
      { text: "審查規程檢索不到弓材質的限制，所以「審查可以用」是推論，請向所屬地方連盟確認。", tag: "disputed", src: [ANKF.probationRules] },
      { text: "但天皇盃・皇后盃、全日本遠的選手権等大會要項規定要用竹弓。「升段要用竹弓」是觀念，不是規則。", tag: "official", src: [RULES.tennohai, RULES.enteki, SHOP.suizanTypes] },
    ],
  },
  {
    topic: "矢",
    q: "1913 和 2015 怎麼選？",
    a: [
      { text: "依弓力和矢尺選，不要依性別選。大致是弓力 13kg 以下或箭較短選 1913，約 13kg 以上（各店 12～20kg 不等）選 2015。各店範圍不同，請以購買店家的表格為準。", tag: "shop", src: [SHOP.suizanYa, SHOP.sambuYa, SHOP.heian1913] },
    ],
  },
  {
    topic: "矢",
    q: "箭要多重？匁怎麼換算？",
    a: [
      { text: "1 匁＝3.75g。弓力 10kg 約配 22～23g，15kg 約 27～28g，18kg 約 30g（8 匁）。弓師說箭太輕容易傷弓。", tag: "shop", src: [SHOP.suizanYa, SHOP.issuiWeight] },
    ],
  },
  {
    topic: "矢",
    q: "鷲羽、鷹羽的箭可以拿去比賽嗎？",
    a: [
      { text: "部分猛禽羽要有全弓連規定的矢羽適正入手証明書，才能在比賽和審查使用；オジロワシ、オオワシ的羽不可使用。火雞等表上沒列的鳥不必證明。", tag: "official", src: [RULES.feathers, RULES.feathersChart] },
    ],
  },
  {
    topic: "預算",
    q: "初學者一定要先買全套嗎？",
    a: [
      { text: "不用。全弓連說初學者多半可以用道場的器材。", tag: "official", src: [ANKF.faq] },
      { text: "平安弓具建議先買弓道衣，幾個月到半年後再買弽，弓和箭最後買。", tag: "shop", src: [SHOP.heianBeginner] },
    ],
  },
  {
    topic: "弦",
    q: "合成弦和麻弦，初學者該用哪一種？",
    a: [
      { text: "用玻纖、碳纖弓的話用合成弦；店家說麻弦「主に竹弓用」。", tag: "shop", src: [SHOP.koyamaStrings] },
      { text: "規則兩種都允許。", tag: "official", src: [ANKF.playRules] },
    ],
  },
  {
    topic: "弦",
    q: "弦要買多長、多粗？",
    a: [
      { text: "長度和弓一致（並寸弓配並寸弦）。粗細看弓力和品牌：吟 特作 1號是 ～13kg，直心弦 1號是 ～11kg，各牌不同。", tag: "shop", src: [SHOP.suizanTsuru, SHOP.koyamaStrings] },
    ],
  },
  {
    topic: "弦",
    q: "弦多久換一次？",
    a: [
      { text: "說法不一：弓具店說 600～700 射，弓師為了保護弓建議 200～300 射。", tag: "disputed", src: [SHOP.suizanTsuru, SHOP.issuiSynth2] },
      { text: "重要比賽前換新弦，先拉約 100 射再上場。", tag: "shop", src: [SHOP.suizanTsuru] },
    ],
  },
  {
    topic: "弦",
    q: "中仕掛要做在哪裡？用什麼做？",
    a: [
      { text: "全弓連：用くすね和約 15cm 的麻，從搭箭位置往上 1～1.5cm 處開始，最後用道宝纏緊。", tag: "official", src: [ANKF.tool, BUDOKAN_EQ.ch7] },
      { text: "合成弦多半用木工膠或フエキ糊；翠山建議做成上粗下細、約 5cm。", tag: "shop", src: [SHOP.suizanTsuru] },
    ],
  },
  {
    topic: "弽",
    q: "三つがけ、四つがけ、諸弽怎麼選？",
    a: [
      { text: "規則三種都可以，但都要有控、帽子、弦枕，材質為鹿皮。", tag: "official", src: [ANKF.playRules] },
      { text: "初學者最常見的是堅帽子（控え付き）三つがけ；控え無し、和帽子比較軟，適合弓力弱的人。", tag: "shop", src: [SHOP.koyamaKake, SHOP.koyamaKakeInfo] },
    ],
  },
  {
    topic: "弽",
    q: "弽要怎麼量尺寸？",
    a: [
      { text: "量食指尖到拇指根（最重要）、拇指、中指三個長度，並留一點餘裕——皮半年左右會縮。最好到店試戴或郵寄手型。", tag: "shop", src: [SHOP.suizanKake, SHOP.miyakawaKake, SHOP.koyamaKake] },
    ],
  },
  {
    topic: "弽",
    q: "下がけ、ぎり粉、筆粉各做什麼用？",
    a: [
      { text: "下がけ：擋汗、保護弽，要勤換。ぎり粉：弽拇指的止滑粉，極少量使用。筆粉：左手握把的止滑粉。", tag: "official", src: [ANKF.tool, ANKF.terminology, SHOP.koyamaKake, SHOP.koyamaGoods] },
    ],
  },
  {
    topic: "服裝",
    q: "練習和審查要穿什麼？",
    a: [
      { text: "原則是白筒袖弓道衣、袴、白足袋。初學者可以穿運動服，但要避開胸前口袋、前排扣。女子要戴胸當。", tag: "official", src: [ANKF.tool, ANKF.playRules] },
      { text: "審查時五段以上和錬士、教士穿和服。", tag: "official", src: [ANKF.probationRules] },
    ],
  },
  {
    topic: "預算",
    q: "在日本買一套大概多少錢？",
    a: [
      { text: "用小山弓具 2026-10-17 標價試算：最低限約 ¥86,080（約 NT$17,900），標準約 ¥123,950（約 NT$25,800）；日幣含稅價，不含運費、國際運費與台灣關稅。", tag: "note", src: [SHOP.koyamaGlass, SHOP.koyamaKake, SHOP.koyamaWear, BOT] },
      { text: "平安弓具估約 10 萬日圓。價格會變動，請以店家當下標價為準。", tag: "shop", src: [SHOP.heianBeginner] },
    ],
  },
  {
    topic: "保養",
    q: "弓要不要一直張著弦？",
    a: [
      { text: "新竹弓：弓師和猪飼都說至少頭一個月、或用到熟成之前要張著。", tag: "shop", src: [SHOP.issuiNew, SHOP.ikaiTake] },
      { text: "玻纖、碳纖弓沒有官方或廠商的明確說法。", tag: "disputed", src: [FOLK.kyuudouq] },
    ],
  },
  {
    topic: "保養",
    q: "台灣很潮濕，弽和弓要怎麼顧？",
    a: [
      { text: "目前只有日本來源：弽通風陰乾、勤換下がけ、不要曬太陽也不要用吹風機；竹弓避開高溫，不要長時間放在防水袋裡。", tag: "shop", src: [SHOP.miyakawaKake, SHOP.zkYugake, SHOP.issuiNew, SHOP.yamaguchiCare] },
      { text: "台灣本地資料待查。", tag: "disputed" },
    ],
  },
];
