// 小弓 tips for the tool pages (see ../tips.ts for the rules: <b>/<i>/<br> only, facts match the page).
import type { Tip, TipRoute } from "../tips-routes";

const TIPS: Partial<Record<TipRoute, Tip[]>> = {
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
};

export default TIPS;
