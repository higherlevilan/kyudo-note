// Sources used only by 射癖與矢所 (/shaguse). Shared ANKF / 指導書 sources come from common-sources.
// 查詢日期都是 2026-10-17（見 docs/research/04 第 10-3 節〔P〕組）。

import type { Source } from "@/content/types";

export { ANKF, BUDOKAN, RESEARCH } from "@/content/common-sources";

/** 全弓連的其他官方頁面與通知 */
export const ANKF_SG = {
  improve01: { label: "全日本弓道連盟〈上達への道。vol.01 ゴム弓練習法〉", url: "https://www.kyudo.jp/improve/", kind: "official" },
  improve02: { label: "全日本弓道連盟〈上達への道。vol.02 素引き練習〉", url: "https://www.kyudo.jp/improve/02.html", kind: "official" },
  notice2023: {
    label: "全日本弓道連盟 全弓連発第5-27号〈基本計画部会での検討内容の趣旨について〉（2023-07-24）",
    url: "https://www.kyudo.jp/pdf/notice/20230725_information.pdf",
    kind: "official",
  },
} satisfies Record<string, Source>;

/** 學術研究（J-STAGE／PubMed）。label 裡寫明樣本數，方便讀者判斷份量。 */
export const STUDY = {
  nishio2021: {
    label: "西尾誠一郎ほか〈弓道における異常な運動（いわゆるイップス）〉臨床神経学 61(8), 2021（問卷，n=65）",
    url: "https://www.jstage.jst.go.jp/article/clinicalneurol/61/8/61_cn-001568/_article/-char/ja",
    kind: "research",
  },
  ogiso2023: {
    label: "小木曽太知ほか〈弓道における異常な運動『もたれ』は動作特異性局所ジストニアの特徴を有している〉臨床神経学 63(8), 2023（短報，n=9）",
    url: "https://www.jstage.jst.go.jp/article/clinicalneurol/63/8/63_cn-001844/_article/-char/ja",
    kind: "research",
  },
  mori1990: {
    label: "森俊男ほか〈弓道における『早気』に関する研究〉武道学研究 23(2), 1990（問卷，n=237）",
    url: "https://www.jstage.jst.go.jp/article/budo1968/23/2/23_161/_article/-char/ja",
    kind: "research",
  },
  mori1994: {
    label: "森俊男・弘瀬公雄〈弓道における『早気』射手の行射に伴う特有の動作に関する研究〉武道学研究 27(Suppl), 1994（學會摘要，n=30）",
    url: "https://www.jstage.jst.go.jp/article/budo1968/27/Supplement/27_42/_article/-char/ja",
    kind: "research",
  },
  matsuo2000: {
    label: "松尾牧則・黒須憲〈弓術書からみた早気の矯正〉武道学研究 33(Suppl), 2000（文獻考察摘要）",
    url: "https://www.jstage.jst.go.jp/article/budo1968/33/Supplement/33_34/_article/-char/ja",
    kind: "research",
  },
  abe2022: {
    label: "安部レオほか〈弓道におけるイップス『早気』についての心理学的および神経生理学的検討〉基礎理学療法学 25(Suppl), 2022（學會摘要，n=13）",
    url: "https://www.jstage.jst.go.jp/article/jjptf/25/Supplement/25_P-3-3-10/_article/-char/ja",
    kind: "research",
  },
  bunkakai2001: {
    label: "弓道専門分科会〈弓道初心者指導法―射癖とその矯正法についての検討―〉武道学研究 34(Suppl), 2001",
    url: "https://www.jstage.jst.go.jp/article/budo1968/34/Supplement/34_13/_article/-char/ja",
    kind: "research",
  },
  miyakawa2026: {
    label: "宮川晃弥・松井泰二〈弓道の発射において求められる右手の技術〉体育学研究 71, 2026（原著，n=8）",
    url: "https://www.jstage.jst.go.jp/article/jjpehss/71/0/71_06-25053/_article/-char/ja",
    kind: "research",
  },
  yamaguchi2010: {
    label: "山口豊・窪田辰政〈習慣的な弓道『ゆるみ』動作へのヘルスカウンセリングの効果について〉運動とスポーツの科学 16(1), 2010（單一個案）",
    url: "https://www.jstage.jst.go.jp/article/jpess/16/1/16_61/_article/-char/ja",
    kind: "research",
  },
  kawamukai1983: {
    label: "川向洋子〈弓道の伸合習得における同時的フイードバックトレーニングの効果について〉日本体育学会大会号 34, 1983（學會摘要）",
    url: "https://www.jstage.jst.go.jp/article/jspeconf/34/0/34_679/_article/-char/ja",
    kind: "research",
  },
  mori1982: {
    label: "森俊男〈弓道における『手の内の働き』と『弓返り』について〉武道学研究 15(2), 1982（實驗，n=10）",
    url: "https://www.jstage.jst.go.jp/article/budo1968/15/2/15_115/_article/-char/ja",
    kind: "research",
  },
  hosoya1989: {
    label: "細谷聡〈弓道における手の内の『上押し』に関する力学的研究〉武道学研究 22(2), 1989（實驗，n=3）",
    url: "https://www.jstage.jst.go.jp/article/budo1968/22/2/22_23/_article/-char/ja",
    kind: "research",
  },
  ayabe1987: {
    label: "綾部香子ほか〈弓道選手の運動障害について〉武道学研究 20(2), 1987（問卷，n=943）",
    url: "https://www.jstage.jst.go.jp/article/budo1968/20/2/20_161/_article/-char/ja",
    kind: "research",
  },
  yamada2009: {
    label: "山田佳弘〈大学授業における弓道の初心者一斉指導法の開発―矢束紐装着の射による『会』形成の有効性―〉身体運動文化研究 14/15(1), 2009（教學法）",
    url: "https://www.jstage.jst.go.jp/article/physicalarts/14.15/1/14.15_47/_article/-char/ja",
    kind: "research",
  },
  okazaki2022: {
    label: "岡﨑紀創ほか〈空手道・弓道における ICT 活用の新たな試みと将来展望〉武道学研究 54(2), 2022（分科會報告）",
    url: "https://www.jstage.jst.go.jp/article/budo/54/2/54_2116/_article/-char/ja",
    kind: "research",
  },
  rayan1992: {
    label: "Rayan GM. Archery-related injuries of the hand, forearm, and elbow. South Med J 85(10), 1992（個案系列，西洋弓）",
    url: "https://pubmed.ncbi.nlm.nih.gov/1411735/",
    kind: "research",
  },
} satisfies Record<string, Source>;

/** 網路文章（一般說法，沒有研究證據） */
export const WEB = {
  kyusho: { label: "弓翔〈弓道初心者必見！矢が前に飛ぶ悩みを解決する完全ガイド〉（網路文章，無監修）", url: "https://kyusho-info.com/kyudo-basics/leash-fly-forward/", kind: "secondary" },
  bakufu: { label: "弓道幕府〈矢が下に行く・後ろに飛ぶ・顔を払う原因と直し方〉（網路文章）", url: "https://kyudo.bakufu.org/articles/yato-trouble.html", kind: "secondary" },
} satisfies Record<string, Source>;
