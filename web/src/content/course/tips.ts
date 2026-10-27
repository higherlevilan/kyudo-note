// 小弓的角落小提醒 — route-aware tips for the corner companion (src/components/mascot/Companion.tsx).
// Keys are routes with a trailing slash (no basePath); "*" is the fallback for any other page.
// Text may contain <b>, <i> and <br> only (rendered through the mascot's sanitizer).
// Facts must agree with the site's own pages (standard: 全日本弓道連盟《弓道教本》);
// safety tips end with deference to the instructor.

import type { Mood } from "@/lib/course/types";

export interface Tip {
  /** one or two short sentences; may contain <b>, <i>, <br> */
  text: string;
  mood?: Mood;
  /** optional 「去看看 →」 link, e.g. "#safety" (same page) or "/shaho/#kai" */
  href?: string;
}

export type TipRoute =
  | "/"
  | "/guide/"
  | "/etiquette/"
  | "/shaho/"
  | "/shaguse/"
  | "/equipment/"
  | "/culture/"
  | "/glossary/"
  | "/faq/"
  | "/practice/"
  | "/journal/"
  | "/form-check/"
  | "*";

export const TIPS: Record<TipRoute, Tip[]> = {
  "/": [
    { text: "嗨，我是<b>小弓</b>！點我一下，我會說一句和這一頁有關的小提醒。", mood: "happy" },
    { text: "還沒碰過弓？先到「從哪裡開始？」挑一條適合自己的路線。", mood: "happy", href: "#paths" },
    { text: "首頁這個靶叫<b>霞的</b>，直徑 36 公分。近的比賽是從 28 公尺外射它。", mood: "wow" },
    { text: "<b>今日の一語</b>每天換一個詞，台灣時間午夜更新。一天記一個，不貪心。", mood: "happy" },
    { text: "本站的技術與禮法以全弓連公開資料為準，每個說法都標出依據：官方、指導書，還是坊間說法。", mood: "think" },
    { text: "〈射義〉說：射不中，不怨勝過自己的人，回頭找自己的原因。我射歪時也努力這樣想。", mood: "bow" },
    { text: "我叫小弓，但我不負責教你射箭——那是你和指導者的事，我只負責在角落提醒。", mood: "happy" },
  ],
  "/guide/": [
    { text: "弓道不是第一天就射靶：先徒手，再ゴム弓、素引き、巻藁，最後才站上的前。", mood: "think", href: "#first-year" },
    { text: "第一次去道場不用先買弓。協會的弓道教室有公用的弓、箭、弽。", mood: "happy", href: "#first-visit" },
    { text: "最基本的三條：不對人、不擅自上的前、不進矢道。徒手練習也不對著人。實際做法請以指導者為準。", mood: "focus", href: "#safety" },
    { text: "<b>素引き</b>絕不放弦：空放可能讓弦斷掉，或打到臉與左臂。實際做法請以指導者為準。", mood: "oops", href: "#safety" },
    { text: "射場前方的<b>矢道</b>，盡頭的土堆叫<b>安土</b>，靶就立在安土前。去看看射場的俯視圖。", mood: "wow", href: "#dojo-layout" },
    { text: "第一年大概花多少？「費用試算」可以勾選、改單價，總額即時更新。", mood: "happy", href: "#cost" },
    { text: "審查的初段、弐段看射形與體配，到<b>参段</b>才開始要求中靶。", mood: "wow", href: "#shinsa" },
    { text: "弓道的傷害研究少又舊。身體不適請找醫師；練習量怎麼調整，請以指導者為準。", mood: "think", href: "#injury" },
  ],
  "/etiquette/": [
    { text: "<b>揖</b>是上半身前屈約 10 公分——官方寫的是距離，不是角度，也不是我平常點頭的幅度。", mood: "bow", href: "#intro" },
    { text: "<b>基本體</b>是 4 種姿勢加 8 種動作，審查學科也會考。", mood: "think", href: "#kihontai" },
    { text: "一手是兩支箭：先射<b>甲矢</b>，再射<b>乙矢</b>。去看看坐射一手的完整流程。", mood: "happy", href: "#flow" },
    { text: "審查的弦音接力（3 番以後）：聽前兩人的弦音起身，聽前一人的弦音取懸け。", mood: "focus", href: "#shinsa" },
    { text: "<b>矢取り</b>的口令各道場不同，同一本指導書裡就有三種版本。實際做法請以指導者為準。", mood: "think", href: "#dojo" },
    { text: "赤旗掛出時不取懸け，也絕不進矢道。實際做法請以指導者為準。", mood: "focus", href: "#safety" },
    { text: "斷弦、筈こぼれ、掉弓都算<b>失</b>，處理得好不好也是體配的一部分。實際做法請以指導者為準。", mood: "oops", href: "#safety" },
    { text: "不跨過地上的弓具。指導書沒寫理由，從安全與保護器材來理解比較穩妥。", mood: "bow", href: "#dojo" },
  ],
  "/shaho/": [
    { text: "足踏み、胴造り、弓構え、打起し、引分け、会、離れ、残心。我背這串背了很久。", mood: "happy", href: "#torimi" },
    { text: "每一節都分「入門」與「深入」兩層。想一次全打開，按右下角「目錄」裡的<b>全部展開</b>。", mood: "happy" },
    { text: "足踏み的寬度以自己的<b>矢束</b>為標準、約 60 度；「肩寬 1.5 倍」是坊間說法。", mood: "think", href: "#ashibumi" },
    { text: "打起し，官方只說舉到「比額頭的線稍高」；常聽到的「45 度」沒有官方出處。", mood: "think", href: "#uchiokoshi" },
    { text: "<b>会</b>是整個射法的核心。「要撐 5～7 秒」常聽到，但全弓連沒有規定秒數。", mood: "focus", href: "#kai" },
    { text: "時機成熟、自然發生的離れ，官方辭典稱為<b>自然の離れ</b>。", mood: "focus", href: "#hanare" },
    { text: "離れ之後還沒結束：<b>残心</b>時視線停在矢所，身心都不鬆懈。也寫作残身。", mood: "focus", href: "#zanshin" },
    { text: "最後弓倒し、物見返し、足閉じ，一射才算結束。這頁是幫助理解，實際怎麼做照指導者教的。", mood: "bow", href: "#yudaoshi" },
  ],
  "/shaguse/": [
    { text: "先講結論：射癖的研究證據很薄，沒有任何隨機對照試驗驗證過矯正法。", mood: "think", href: "#about" },
    { text: "<b>早気</b>非常普遍：問卷中有過經驗的人在 5～8 成之間，而且很多人後來改善了。", mood: "wow", href: "#hayake" },
    { text: "早気讓你壓力很大的話，不必獨自硬撐。練習方式怎麼調整，請以指導者為準。", mood: "bow", href: "#hayake" },
    { text: "<b>緩み</b>常常本人感覺不到，所以特別需要別人看，或錄影拿給指導者看。", mood: "oops", href: "#yurumi" },
    { text: "初學者本來就不會有<b>弓返り</b>，不必焦慮。我也還在等我的弓轉過來。", mood: "happy", href: "#yugaeri" },
    { text: "<b>筈こぼれ</b>、暴發首先是安全問題：先停下來，請指導者檢查弓具與取懸け。", mood: "oops", href: "#hazukobore" },
    { text: "被弦打到臉或手臂會痛，也會讓人害怕。先排除基本面，再請指導者看你的射。實際做法請以指導者為準。", mood: "oops", href: "#harau" },
    { text: "箭老是偏同一邊？「矢所診斷」可以點選方向，看常聽到的原因。", mood: "think", href: "#yadokoro" },
  ],
  "/equipment/": [
    { text: "初學者最重要的一句話：<b>先借再買</b>。", mood: "happy", href: "#start" },
    { text: "<b>矢尺・弓長計算器</b>：輸入矢束（身高選填），並列各來源的建議範圍，不給「唯一官方數字」。", mood: "think", href: "#calc" },
    { text: "矢束的官方量法：從喉嚨中央量到水平伸直的左手中指指尖。請別人拿捲尺比較準。", mood: "happy", href: "#calc" },
    { text: "箭一定要比矢束長，全弓連的底線是長 5 公分以上。實際箭長請以指導者為準。", mood: "focus", href: "#calc" },
    { text: "弓力寧弱勿強：全弓連說初學者要從弱的弓開始。選弓前請以指導者的意見為準。", mood: "think", href: "#start" },
    { text: "我的弓比我高很多，這很正常——和弓的標準長度是 221 公分（七尺三寸，並寸）。", mood: "wow", href: "#bow" },
    { text: "保養的關鍵字是「濕氣」：竹弓怕高溫高濕，弽怕汗。", mood: "think", href: "#care" },
    { text: "預算試算可以切換「最低限」「標準」。那是買齊一套的估算，不是入門必要的花費。", mood: "happy", href: "#budget" },
  ],
  "/culture/": [
    { text: "射法八節是 1953 年《弓道教本》確立的現代基準，不是古代流傳下來的。", mood: "wow", href: "#myths" },
    { text: "「弓道＝禪」的強烈印象，主要是 1956 年《弓與禪》日譯本出版後才形成的。", mood: "think", href: "#zen" },
    { text: "三十三間堂的<b>通し矢</b>比的是從外廊一端射「通」到另一端的箭數，不是射靶。", mood: "wow", href: "#history" },
    { text: "互動年表可以只看日本或台灣的事件；紅色虛線圓點表示說法不一。", mood: "happy", href: "#timeline" },
    { text: "迷思澄清的卡片，正面是常見說法，按「看事實」翻面。", mood: "happy", href: "#myths" },
    { text: "段位之外，還有<b>錬士・教士・範士</b>三個稱號。", mood: "bow", href: "#ranks" },
    { text: "台灣的協會正式名稱是<b>臺灣弓道協會</b>，是國際弓道連盟（IKYF）的正式會員。", mood: "happy", href: "#taiwan" },
    { text: "和弓的握把為什麼偏下？沒有定論。3 世紀的《魏志倭人傳》已經記載「短下長上」。", mood: "think", href: "#myths" },
  ],
  "/glossary/": [
    { text: "漢字、假名、羅馬拼音、中文都能搜；羅馬拼音有沒有長音符號都可以。", mood: "happy", href: "#glossary-q" },
    { text: "用分類按鈕縮小範圍：射法、弓具、體配、思想與歷史、道場、審查與競技。", mood: "happy" },
    { text: "標「官方辭典」的詞條，讀音與定義已和全弓連〈弓道用語辞典〉核對過。", mood: "think" },
    { text: "看到「說法不一或待查證」的紅色小框，記得讀一下旁邊的註解。", mood: "think" },
    { text: "打「はや」會同時找到<b>早気</b>和<b>甲矢</b>——讀音很像，意思差很多。", mood: "wow", href: "#glossary-q" },
    { text: "<b>弽</b>讀作ゆがけ，也叫かけ，是右手戴的鹿皮手套。", mood: "happy" },
  ],
  "/faq/": [
    { text: "直接搜關鍵字，例如：矢尺、会、跪坐、審查費。", mood: "happy", href: "#faq-q" },
    { text: "每個回答都有標籤：「官方」、「指導書」，或「坊間常見說法」。", mood: "think" },
    { text: "只想看有出處的規定？打開「只看有官方依據的」篩選。", mood: "think" },
    { text: "可以按單元篩選；每題最後都有連結，回到該單元看完整說明。", mood: "happy" },
    { text: "這裡是整理資料，不是下指令。做法有差異時，請以所屬道場與指導者為準。", mood: "bow" },
  ],
  "/practice/": [
    { text: "每個練習 1～3 分鐘，答完立刻看解說與出處。等上射場的空檔剛好。", mood: "happy" },
    { text: "<b>射法八節排序</b>：8 張卡片打亂了，依序點回來。我第一次把離れ排到会前面，早気了（小聲）。", mood: "oops" },
    { text: "<b>詞彙閃卡</b>按「記得／不熟」，會自動安排下次什麼時候再複習。", mood: "happy" },
    { text: "迷思是非題：常聽到的說法到底對不對？每題都附出處。", mood: "think" },
    { text: "初段學科練習：先自己寫，再對照「可以提到的重點」。", mood: "focus" },
    { text: "連續練習天數、成績、閃卡進度和草稿，都只存在這台裝置的瀏覽器裡。", mood: "think" },
    { text: "答錯也沒關係，看完解說的那一題，通常最記得住。", mood: "oops" },
  ],
  "/journal/": [
    { text: "紀錄預設只存在這個瀏覽器，清除瀏覽資料會一併遺失。記得定期到「資料」匯出備份。", mood: "oops" },
    { text: "記錄練習時可以用 ○× 記錄表，點「○ 中」「× 未中」一支一支記。", mood: "happy" },
    { text: "射數有快捷按鈕：+2 是一手，+4 是一立。", mood: "wow" },
    { text: "老師的一句話也值得記下來，過一陣子回頭看，常常會有新的理解。", mood: "bow" },
    { text: "分頁有總覽、紀錄、裝備、目標、資料。可以先在「目標」寫下最想練好的一節。", mood: "happy" },
    { text: "射形分析的文字摘要，也可以存成稽古帳的一筆練習紀錄。", mood: "think", href: "/form-check/" },
  ],
  "/form-check/": [
    { text: "這是<b>實驗功能</b>：自我觀察的輔助，不是教學，也不是評分。", mood: "think" },
    { text: "影片只在你的裝置上處理，不會上傳；唯一的網路請求是下載姿勢偵測模型。", mood: "happy" },
    { text: "拍攝的人絕不站在矢道或巻藁後方；在道場錄影前先徵得同意。實際做法請以指導者為準。", mood: "focus" },
    { text: "手機固定好，放在射手正前方、約胸口高度、全身入鏡。", mood: "happy" },
    { text: "只有正面鏡頭看不到深度：会時右肘在不在肩線後方，這裡判斷不了。", mood: "think", href: "#limits" },
    { text: "數字只描述畫面上的樣子，不告訴你該怎麼改。射形的判斷與修正，請以指導者為準。", mood: "bow", href: "#limits" },
    { text: "分析完可以存成稽古帳的練習紀錄，之後和老師的意見對照。", mood: "happy", href: "/journal/" },
  ],
  "*": [
    { text: "長文章頁右下角有「目錄」：跳到各段、全部展開「深入」、調整文字大小。", mood: "happy" },
    { text: "標籤小抄：「官方」是全弓連，「指導書」是武道指導書，「坊間常見說法」沒有官方出處。", mood: "think" },
    { text: "看到不熟的日文詞，可以到日文詞彙庫查。", mood: "happy", href: "/glossary/" },
    { text: "本站是查資料整理的筆記，不是指導。實際做法請以所屬道場與指導者為準。", mood: "bow" },
    { text: "迷路了嗎？回首頁，從「從哪裡開始？」挑一條路線。", mood: "oops", href: "/#paths" },
  ],
};

/** Tips for a pathname (with or without trailing slash); falls back to "*". */
export function tipsFor(pathname: string | null | undefined): Tip[] {
  const p = !pathname || pathname === "/" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;
  const key = (Object.keys(TIPS) as TipRoute[]).find((k) => k !== "*" && k !== "/" && p.startsWith(k)) ?? (p === "/" ? "/" : "*");
  const list = TIPS[key];
  return list.length ? list : TIPS["*"];
}
