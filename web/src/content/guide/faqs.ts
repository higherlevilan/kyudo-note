// 走進道場的問題研究中心卡片。依 docs/research/04 §8-3、§8-4 改寫；查詢日期 2026-10-17。

import { ANKF, BUDOKAN, IKYF, TAIWAN } from "../common-sources";
import type { Faq } from "../types";
import { ANKF_X, CARRY, CLUB, EXAMPLES, IKYF_X, INJURY, SHINSA_X, TW_X } from "./sources";

export const GUIDE_FAQS: Faq[] = [
  {
    topic: "練習",
    q: "新手大概多久能站上的前？",
    a: [
      { text: "全弓連的回答是「個人差異很大」，沒有標準時間。", tag: "official", src: [ANKF.faq] },
      { text: "社團實例：大學約 1～2 個月；高中約 3～4 個月，快的人 7 月就上的前。這些是單一社團的做法，不是標準。", tag: "local", src: [EXAMPLES.hokudai, EXAMPLES.hokuetsu, EXAMPLES.matsudo] },
      { text: "順序一般是徒手 → ゴム弓 → 素引き → 巻藁 → 的前。", tag: "official", src: [ANKF_X.improve, BUDOKAN.ch4] },
    ],
  },
  {
    topic: "練習",
    q: "練多久可以考初段？",
    a: [
      { text: "沒有官方標準時間。審查規程的初段基準是「射型、體配合乎規範，矢所不亂」，屬質性描述。", tag: "official", src: [ANKF.probationRules] },
      { text: "日本高中社團有入部約 1 年取得初段的例子，但只是單一學校的實例。", tag: "local", src: [EXAMPLES.matsudo] },
    ],
  },
  {
    topic: "安全",
    q: "素引き可以放弦嗎？",
    a: [{ text: "不行。指導書規定素引き要「不放弦、送回去」；空放可能讓弦斷掉，或打到臉和左臂。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch4] }],
  },
  {
    topic: "安全",
    q: "在家用ゴム弓練習要注意什麼？",
    a: [
      { text: "橡皮要套在外側再拉。", tag: "guide", src: [BUDOKAN.ch4] },
      { text: "絕對不要對著人，徒手也一樣；周圍留足夠空間。", tag: "guide", src: [BUDOKAN.ch2, BUDOKAN.ch5] },
    ],
  },
  {
    topic: "傷害",
    q: "弓道最常傷到哪裡？",
    a: [
      { text: "弓道研究中以肩最常見，其次是腰、手與手指、肘、頸。", tag: "research", src: [INJURY.tomizawa1971] },
      { text: "另一份 943 人的問卷顯示，右肘是各流派共通的好發部位。", tag: "research", src: [INJURY.ayabe1987] },
      { text: "這些研究都很舊，而且是問卷型，請當作參考。", tag: "note" },
    ],
  },
  {
    topic: "傷害",
    q: "有證據證明暖身能預防弓道傷害嗎？",
    a: [
      { text: "沒有找到弓道專屬的介入研究。", tag: "disputed" },
      { text: "富沢 1971 觀察到只有 25% 的人做準備運動，並主張準備與補助運動很重要；指導書在每節課都安排準備運動。可以當成合理的一般原則。", tag: "research", src: [INJURY.tomizawa1971, BUDOKAN.ch5] },
    ],
  },
  {
    topic: "傷害",
    q: "膝蓋不好、不能正坐，還能參加比賽或審查嗎？",
    a: [
      { text: "《弓道競技規則》第 3 條允許因傷病事先申請特例；坐射有困難可依手續改立射。", tag: "official", src: [ANKF.playRules] },
      { text: "全弓連 2023 年的通知針對體形、骨骼等狀況提出因應措施。", tag: "official", src: [ANKF_X.notice2023] },
      { text: "審查的處理方式請事先向所屬團體確認，沒有查到全國統一的書面規定。", tag: "disputed" },
    ],
  },
  {
    topic: "審查",
    q: "在台灣可以考全弓連的段位嗎？",
    a: [
      { text: "可以。臺灣弓道協會是 IKYF 會員，經協會報名，可參加亞洲大洋洲講習會的特別中央審查（2026 年的 Chinese Taipei 專場排在 11 月、東京）或錄像審查；證書由全弓連發給。", tag: "official", src: [IKYF.members, IKYF_X.plan2026] },
      { text: "錄像審查目前可考哪些段位、費用多少，沒有公開資料，請向協會確認。", tag: "disputed", src: [TW_X.calendar] },
    ],
  },
  {
    topic: "審查",
    q: "初段要射幾支？一定要射中嗎？",
    a: [
      { text: "一手 2 支（甲矢、乙矢）；原則上近的 28 m、5 人一立、坐射、36 cm 霞的。", tag: "official", src: [ANKF.probationRules, ANKF.probationGyosha] },
      { text: "審查統一基準在弐段欄寫「的中不問」，初段欄寫「矢枕落ち不問」；從参段起才要求「的中やや確実」。", tag: "official", src: [ANKF.probationStandard] },
    ],
  },
  {
    topic: "審查",
    q: "學科考什麼？有題庫嗎？",
    a: [
      { text: "有。全弓連每年公開地方與連合審查的學科題目（2026 年版於 1 月 30 日公布）。初段要寫出射法八節的順序、說明其中一節，再寫一篇心得題。", tag: "official", src: [ANKF.written2026] },
      { text: "很多縣連改成事前提交報告。", tag: "local", src: [SHINSA_X.kanagawa, SHINSA_X.aichi] },
      { text: "協會審查情報頁的題庫還是 2021 年版。", tag: "disputed", src: [TAIWAN.shinsa] },
    ],
  },
  {
    topic: "審查",
    q: "考初段要花多少錢？",
    a: [
      { text: "全弓連別表 1：初段審查料 ¥2,050，合格後登録料 ¥3,100。", tag: "official", src: [ANKF.probationFee] },
      { text: "日本的縣連可能另收手續費，例如愛知的管理費 ¥1,000。", tag: "local", src: [SHINSA_X.aichi] },
      { text: "在台灣報名時協會是否另收手續費，官網沒有寫。", tag: "disputed", src: [TAIWAN.shinsa] },
    ],
  },
  {
    topic: "審查",
    q: "可以自己直接把申請書寄給全弓連嗎？",
    a: [{ text: "不行。審查要經所屬團體與地連，海外要經所屬國家的協會彙整報名。", tag: "official", src: [ANKF.probationRules, IKYF_X.shinsa] }],
  },
  {
    topic: "審查",
    q: "協會行事曆上的「會內審查」是段位嗎？",
    a: [{ text: "性質不明，可能是協會內部的認定或受審前的模擬，不等於全弓連的段位。請向協會確認。", tag: "disputed", src: [TW_X.calendar] }],
  },
  {
    topic: "台灣",
    q: "台灣哪裡可以學？不是學生也可以嗎？",
    a: [
      { text: "社會人士以臺灣弓道協會（新莊藏月弓道場）的弓道教室為主，每期 NT$4,800。", tag: "local", src: [TAIWAN.class] },
      { text: "政大、北科標示收外校生與非學生，輔大收外校生；成大明示不開放非社員參觀或體驗。", tag: "local", src: [TW_X.clubs, CLUB.ncku] },
      { text: "另有台北松山的躾學、汐止的山道場、台中的岡達等民間團體。", tag: "local", src: [TW_X.memberGroup] },
    ],
  },
  {
    topic: "台灣",
    q: "協會常見問題頁寫一期 2,400 元、在南港，哪個才對？",
    a: [{ text: "常見問題頁內容過時。以弓道教室頁（每期 NT$4,800）和交通資訊頁（新莊）為準。", tag: "local", src: [TW_X.qna, TAIWAN.class, TW_X.traffic] }],
  },
  {
    topic: "法規",
    q: "在台灣拿著弓走在路上違法嗎？",
    a: [
      { text: "弓不在《槍砲彈藥刀械管制條例》的管制清單內。", tag: "official", src: [CARRY.gunLaw] },
      { text: "但無正當理由攜帶具殺傷力的器械，或發射有危害他人之虞，可依《社會秩序維護法》第 63 條處罰。請裝袋攜帶，只在道場內射。", tag: "official", src: [CARRY.orderLaw] },
    ],
  },
  {
    topic: "練習",
    q: "左撇子要反過來拉嗎？",
    a: [
      { text: "不用，也不行：《弓道競技規則》規定右手必戴弽，所以一律左手持弓、右手拉弦。", tag: "official", src: [ANKF.playRules] },
      { text: "「慣用手不影響學習」是常見說法，沒有官方明文。", tag: "folk" },
    ],
  },
];
