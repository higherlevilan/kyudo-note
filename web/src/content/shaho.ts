// 射法八節 page content. Wording paraphrases ANKF public pages and our research notes
// (docs/research/02, 03, 04, 05); only short phrases are quoted. Numbers without an
// official source are tagged "folk" (坊間常見說法).

import type { SourceKey } from "./sources";

/** official = ANKF；guide = 日本武道館指導書；local = 地方連盟／學校；folk = 坊間常見說法；demo = 3D 示範觀察；note = 本站整理 */
export type Tag = "official" | "guide" | "local" | "folk" | "demo" | "note";

export interface Point {
  text: string;
  tag?: Tag;
  src?: SourceKey[];
}

export interface DeepBlock {
  title: string;
  points: Point[];
}

export interface ShahoSection {
  id: string;
  /** 1–8 for the 八節; null for the notes before / after */
  no: number | null;
  term: string;
  kana: string;
  romaji: string;
  zh: string;
  /** segment id in the motion data, for the 3D jump button and the video link */
  segment: string;
  extraSegments?: { id: string; label: string }[];
  intro: string[];
  introSrc: SourceKey[];
  deep: DeepBlock[];
}

export const TAG_LABEL: Record<Tag, string> = {
  official: "官方",
  guide: "指導書",
  local: "地方做法",
  folk: "坊間常見說法",
  demo: "3D 示範觀察",
  note: "本站整理",
};

export const PRELUDE: ShahoSection = {
  id: "torimi",
  no: null,
  term: "執弓の姿勢",
  kana: "とりゆみのしせい",
  romaji: "toriyumi no shisei",
  zh: "持弓的基本姿勢",
  segment: "torimi",
  intro: [
    "射法八節開始之前，先用「執弓の姿勢」站好：左手持弓、右手持箭，兩個拳頭輕放在腰骨的位置。",
    "弓的上端（末弭）放在身體正前方的中央、離地約 10 公分；箭尖朝向弓的前端，弓與箭的延長線形成一個二等邊三角形。",
  ],
  introSrc: ["terminology", "b4", "b5"],
  deep: [
    {
      title: "要點",
      points: [
        { text: "官方辭典的定義只有一句：拿著弓與箭的正確姿勢。具體細節來自全弓連參與編寫的指導書。", tag: "official", src: ["terminology"] },
        { text: "雙腳併攏（指導書寫男子約 3 公分、女子併攏）；視線落在前方約 4 公尺處。", tag: "guide", src: ["b4", "b6"] },
        { text: "雙肘向兩側微微撐開，不要跑到身體側線的後方。", tag: "guide", src: ["b5"] },
        {
          text: "持箭有兩種方式：把箭頭藏在手中，或握在箭頭後約 10 公分、讓箭頭露出。持法會連動足踏み（分兩步或一步踏開）與搭箭的方式，選一種並保持一致。",
          tag: "guide",
          src: ["b4", "miyazaki"],
        },
      ],
    },
    {
      title: "常見錯誤",
      points: [
        { text: "末弭碰到地面或抬得太高；弓拿到身體右側；兩拳離開腰；箭尖朝下或朝外。", tag: "note", src: ["miyazaki"] },
      ],
    },
    {
      title: "關於 3D 示範",
      points: [
        {
          text: "3D 示範的弓是依「握把在左腰、末弭在身體前方中央離地約 10 公分」計算出來的，人形本身的動作則來自示範影片；弓與箭的實際角度依身高與弓長而不同。",
          tag: "demo",
        },
      ],
    },
  ],
};

export const SECTIONS: ShahoSection[] = [
  {
    id: "ashibumi",
    no: 1,
    term: "足踏み",
    kana: "あしぶみ",
    romaji: "ashibumi",
    zh: "踏足、站位",
    segment: "ashibumi",
    intro: [
      "第一節，決定雙腳怎麼站。站上射位後，以自己的「矢束」為寬度，把雙腳向外踏開成外八字，兩腳約成 60 度。",
      "兩腳拇趾的尖端要和靶的中心連成一直線。腳站穩了，後面七節才有穩定的基礎。",
    ],
    introSrc: ["syaho", "terminology"],
    deep: [
      {
        title: "要點",
        points: [
          {
            text: "矢束（やづか）是合乎自己骨架的箭長，官方的量法是從喉嚨中央量到向側面伸直的左手中指指尖。所以「足幅＝矢束」因人而異，不是固定的公分數。",
            tag: "official",
            src: ["tool", "terminology"],
          },
          { text: "全弓連官網寫的是「矢束（やづか）を標準に」、「約60度」，以矢束當寬度的基準。", tag: "official", src: ["syaho"] },
          { text: "踏開的方法有一步踏開（一足）與分兩步踏開（二足）兩種，和持箭方式連動。", tag: "guide", src: ["b4"] },
        ],
      },
      {
        title: "常見錯誤",
        points: [
          {
            text: "站的位置偏離靶心：偏向靶的前方叫「背負い的（せおいまと）」，偏向後方叫「抱き的（だきまと）」。",
            tag: "official",
            src: ["terminology"],
          },
        ],
      },
      {
        title: "坊間說法 vs 官方",
        points: [
          { text: "「足幅是肩寬的 1.5 倍」：網路與道場常聽到，但官方沒有這個數字。", tag: "folk" },
          { text: "官方以自己的矢束為寬度標準，角度約 60 度。", tag: "official", src: ["syaho"] },
        ],
      },
      {
        title: "關於 3D 示範",
        points: [
          {
            text: "示範者穿著袴，膝蓋與腳踝被遮住；3D 的腳步是依影片推估後固定住的，腳的寬度與角度請以上面的文字說明為準。",
            tag: "demo",
            src: ["demo"],
          },
        ],
      },
    ],
  },
  {
    id: "dozukuri",
    no: 2,
    term: "胴造り",
    kana: "どうづくり",
    romaji: "dōzukuri",
    zh: "立身、定軀幹",
    segment: "dozukuri",
    intro: [
      "第二節，以足踏み為基礎，把上半身穩穩放在腰上。",
      "重心放在身體中央，兩肩的線、腰的線都和兩腳的線平行。同時檢查弦與箭，並把呼吸調整平順。",
    ],
    introSrc: ["syaho"],
    deep: [
      {
        title: "要點",
        points: [
          {
            text: "從正上方看，腳、腰、肩三條線重疊成一條，官方稱為「三重十文字（さんじゅうじゅうもんじ）」。",
            tag: "official",
            src: ["terminology"],
          },
          {
            text: "官方辭典把身體的狀態分成五種（五胴）：反る、屈む、懸かる、退く與中正；拉弓時的正確姿勢叫「中胴（ちゅうどう）」。",
            tag: "official",
            src: ["terminology"],
          },
        ],
      },
      {
        title: "常見錯誤",
        points: [
          {
            text: "反り胴（上身後仰）、屈む胴（前屈）、懸かる胴（往靶的方向傾）、退き胴（往靶的反方向傾）。",
            tag: "official",
            src: ["terminology"],
          },
          {
            text: "肩線不水平：左肩比右肩低叫落肩、高叫差肩；左肩往前叫出肩、往後叫退肩。",
            tag: "official",
            src: ["terminology"],
          },
        ],
      },
      {
        title: "關於 3D 示範",
        points: [
          {
            text: "胴造り建立的直立軀幹會一直保持到残心，所以 3D 人形的軀幹依這個原則校正成垂直；足踏み之後到弓倒し之前，腳步也固定不動。",
            tag: "demo",
            src: ["demo"],
          },
        ],
      },
    ],
  },
  {
    id: "yugamae",
    no: 3,
    term: "弓構え",
    kana: "ゆがまえ",
    romaji: "yugamae",
    zh: "持弓預備",
    segment: "yugamae",
    intro: [
      "第三節，拉弓前的準備，包含三個動作：右手戴著弽（ゆがけ）扣住弦的「取懸け」、左手握弓的「手の内」，最後把臉轉向靶的「物見」。",
      "兩臂像抱著一棵大樹一樣，輕輕撐成圓形。",
    ],
    introSrc: ["syaho", "terminology"],
    deep: [
      {
        title: "要點",
        points: [
          {
            text: "兩肘不伸直、像畫圓一樣的構形叫「円相（えんそう）」；箭與身體之間的圓形空間叫「弓懐（ゆみふところ）」。",
            tag: "official",
            src: ["terminology"],
          },
          {
            text: "手の内的基本做法：把弓的左角放在左手掌的「天文筋」上，讓弓與手掌成直角；拇指根與食指之間「虎口」的皮膚從下方捲入弓；中指尖與拇指不分開。",
            tag: "official",
            src: ["improve02", "terminology"],
          },
          {
            text: "弓構え有「正面」與「斜面」兩種：正面在身體正前方構弓，斜面在身體左前方先完成手の内。這會決定下一節打起し的方向。",
            tag: "official",
            src: ["terminology"],
          },
        ],
      },
      {
        title: "常見問題",
        points: [
          {
            text: "手の内要多深、上押し還是中押し比較好，各流派與指導者說法不同，請依所屬道場的指導。",
            tag: "note",
            src: ["research04"],
          },
          {
            text: "弦打到臉或左臂，常被歸因於手の内、弓手肘的位置、物見與胴造り不正；這些多半是一般指導說法，沒有研究證據。",
            tag: "folk",
            src: ["research04"],
          },
        ],
      },
    ],
  },
  {
    id: "uchiokoshi",
    no: 4,
    term: "打起し",
    kana: "うちおこし",
    romaji: "uchiokoshi",
    zh: "舉弓",
    segment: "uchiokoshi",
    intro: [
      "第四節，從弓構え的位置，把弓與箭靜靜地往上舉。",
      "兩個拳頭同時舉到一樣的高度，官方的說法是「額の線よりやや上」（比額頭的線稍高）。舉的時候肩與胸不要用力聳起。",
    ],
    introSrc: ["syaho"],
    deep: [
      {
        title: "要點",
        points: [
          {
            text: "正面打起し：從正面的弓構え，把兩臂舉到正上方，接著取大三。斜面打起し：從斜面的弓構え，往左斜上方舉起。官方辭典兩種都有收錄。",
            tag: "official",
            src: ["terminology"],
          },
          {
            text: "射法八節在 1953 年的《弓道教本》中確立，正面與斜面兩種打起し並列，所以兩者沒有對錯之分。",
            tag: "note",
          },
        ],
      },
      {
        title: "坊間說法 vs 官方",
        points: [
          { text: "「打起し約 45 度」：常聽到，但官方只描述高度（比額頭稍高），沒有寫角度。", tag: "folk" },
          {
            text: "3D 示範者的雙拳舉得比額頭明顯更高；「45 度」常指從側面看手臂與水平的夾角，量法不同，不能直接比較。",
            tag: "demo",
            src: ["demo"],
          },
        ],
      },
    ],
  },
  {
    id: "hikiwake",
    no: 5,
    term: "引分け",
    kana: "ひきわけ",
    romaji: "hikiwake",
    zh: "開弓",
    segment: "hikiwake",
    extraSegments: [{ id: "daisan", label: "大三" }],
    intro: [
      "第五節，把舉起的弓左右均等地拉開，直到進入「会」。",
      "正面打起し會先經過「大三（だいさん）」：左手往靶的方向推出，右手跟著，拉開約箭長的一半。接著兩手同時往左右分開，箭慢慢降到嘴唇的高度。",
    ],
    introSrc: ["syaho", "terminology"],
    deep: [
      {
        title: "要點",
        points: [
          { text: "官方辭典對大三的說明是拉開約箭長一半的狀態，又稱「肘力」「中力」。", tag: "official", src: ["terminology"] },
          {
            text: "全弓連官網在引分け提到「押大目引三分一」：推的一側多、拉的一側約三分之一，說的是推與拉的比例。",
            tag: "official",
            src: ["syaho"],
          },
          { text: "從弓構え到会，弦所走的路線叫「弦道（つるみち）」。", tag: "official", src: ["terminology"] },
        ],
      },
      {
        title: "常見錯誤",
        points: [
          { text: "照る（てる）：弓沒有保持垂直，往後仰著引分。", tag: "official", src: ["terminology"] },
          {
            text: "空筈（からはず）：引分け時箭筈從弦上脫開，箭雖然沒掉，放出去卻不會飛；箭從弦上掉落叫筈こぼれ／矢こぼれ。",
            tag: "official",
            src: ["terminology"],
          },
        ],
      },
      {
        title: "坊間說法 vs 官方",
        points: [
          {
            text: "「大三是拉到三分之一」：這是把「押大目引三分一」誤解成拉開的長度。官方辭典寫的是約箭長的一半。",
            tag: "folk",
            src: ["terminology"],
          },
        ],
      },
    ],
  },
  {
    id: "kai",
    no: 6,
    term: "会",
    kana: "かい",
    romaji: "kai",
    zh: "滿弓持滿",
    segment: "kai",
    intro: [
      "第六節，把矢束充分拉滿之後持續的狀態，是整個射法的核心。",
      "官方的說明是不憋氣，等待腹部的力量充滿到八、九分。此時弦貼在胸前（胸弦）、箭貼著臉頰（頬付け），箭的高度在嘴唇的位置（口割）。",
    ],
    introSrc: ["syaho", "terminology"],
    deep: [
      {
        title: "要點",
        points: [
          {
            text: "会中各關節咬合、可以繼續伸展的狀態叫「詰合い（つめあい）」；充實氣力、持續伸展身體叫「伸合い（のびあい）」。",
            tag: "official",
            src: ["terminology"],
          },
          {
            text: "官方辭典把会分成三種：拉滿後還在拉（引く矢束）、拉滿並有詰合與伸合（引かぬ矢束，理想）、只是拉滿而沒有詰合與伸合（ただ矢束）。",
            tag: "official",
            src: ["terminology"],
          },
          {
            text: "会時的五個十字「五重十文字」：弓與箭、弓與手の内、弽的拇指與弦、胸的中線與兩肩線、頸與箭。",
            tag: "official",
            src: ["terminology"],
          },
        ],
      },
      {
        title: "常見射癖",
        points: [
          { text: "早気（はやけ）：還沒進入会就放箭，或剛進入就立刻放。", tag: "official", src: ["terminology"] },
          { text: "もたれ：進入会之後錯過放箭的時機，放不出去。", tag: "official", src: ["terminology"] },
          { text: "縮み（ちぢみ）：会中氣力或肩、肘鬆掉。", tag: "official", src: ["terminology"] },
          {
            text: "問卷研究中，有早気經驗的人在 5～8 成之間，依對象而不同；目前沒有隨機對照試驗驗證過任何矯正法。",
            tag: "note",
            src: ["research04"],
          },
        ],
      },
      {
        title: "坊間說法 vs 官方",
        points: [
          { text: "「会要撐 5～7 秒」：常聽到，但全弓連沒有規定秒數。", tag: "folk" },
          { text: "日本武道館的學校授課指導書建議練習時維持約 5 秒，這是教學指引，不是射法規定。", tag: "guide", src: ["b5"] },
          { text: "這次示範從会開始到離れ約 4.3 秒。", tag: "demo", src: ["demo"] },
        ],
      },
    ],
  },
  {
    id: "hanare",
    no: 7,
    term: "離れ",
    kana: "はなれ",
    romaji: "hanare",
    zh: "放箭",
    segment: "hanare",
    intro: [
      "第七節，箭離開弦的瞬間。官方的說明是胸廓大幅打開、身體往四方伸展，在時機成熟時放出。",
      "時機成熟、自然發生的離れ，官方辭典稱為「自然の離れ」。放箭後弦會轉到左手手背一側，這叫「弓返り（ゆがえり）」。",
    ],
    introSrc: ["syaho", "terminology"],
    deep: [
      {
        title: "要點",
        points: [
          { text: "左右拳、左右肩四處一致的理想離れ，叫「四部の離れ（しべのはなれ）」。", tag: "official", src: ["terminology"] },
          {
            text: "握緊弓、不讓它弓返り的做法叫「打ち切り」。有些流派或指導者會刻意採用，所以沒有弓返り不一定都算毛病。",
            tag: "official",
            src: ["terminology"],
          },
        ],
      },
      {
        title: "常見離れ癖",
        points: [
          {
            text: "指導書列出五種：緩み（往回鬆了才放）、突き上げ（弓手往上頂）、切り下げ（往下切）、前離れ（在靶前方就放）、早気。",
            tag: "guide",
            src: ["b4", "b6"],
          },
          {
            text: "「払う離れ」在官方辭典裡是一種離れ的類型（像撥開前方的東西），不是「被弦打到」的意思。",
            tag: "official",
            src: ["terminology"],
          },
        ],
      },
      {
        title: "關於 3D 示範",
        points: [
          {
            text: "3D 中的離れ時間點（約 86.3 秒）是依右手腕速度的峰值偵測的；原影片的「離」字幕約晚 1 秒出現。",
            tag: "demo",
            src: ["demo"],
          },
        ],
      },
    ],
  },
  {
    id: "zanshin",
    no: 8,
    term: "残心",
    kana: "ざんしん",
    romaji: "zanshin",
    zh: "放箭後的留心",
    segment: "zanshin",
    intro: [
      "第八節，離れ之後保持放箭時的姿勢，視線停在箭著的位置（矢所）。",
      "身心都不鬆懈，然後才放下弓。也寫作「残身」，兩種寫法讀音相同。",
    ],
    introSrc: ["syaho", "terminology"],
    deep: [
      {
        title: "要點",
        points: [
          {
            text: "腳、腰、脊椎、頸椎的縱線，與兩肩、兩臂的橫線構成十字，官方稱為「縦横十文字」，残心時仍要保持。",
            tag: "official",
            src: ["syaho", "terminology"],
          },
        ],
      },
      {
        title: "坊間說法 vs 官方",
        points: [
          { text: "「残心要停 2～3 秒」：常聽到，但官方沒有規定秒數。", tag: "folk" },
          { text: "日本武道館的社團活動指導書寫離れ的姿勢「約 2 秒」維持，屬於教學指引。", tag: "guide", src: ["b6"] },
        ],
      },
      {
        title: "關於 3D 示範",
        points: [
          {
            text: "在 3D 中切換「会」與「残心」比較，可以看到妻手往後方大幅展開、右拳往下。",
            tag: "demo",
            src: ["demo"],
          },
        ],
      },
    ],
  },
];

export const POSTLUDE: ShahoSection = {
  id: "yudaoshi",
  no: null,
  term: "弓倒し",
  kana: "ゆだおし",
  romaji: "yudaoshi",
  zh: "收弓",
  segment: "yudaoshi",
  intro: [
    "残心之後，把弓放回執弓姿勢的動作。",
    "接著把臉從靶轉回正面（物見返し），再把雙腳合起來（足閉じ），一射才算結束。",
  ],
  introSrc: ["terminology"],
  deep: [
    {
      title: "要點",
      points: [
        { text: "官方辭典：弓倒し是離れ之後回到執弓姿勢的動作；物見返し是把轉向靶的臉轉回來。", tag: "official", src: ["terminology"] },
        {
          text: "宮崎縣的指導手冊寫：兩拳以最短的直線同時回到腰骨，末弭不要落到地面。",
          tag: "local",
          src: ["miyazaki"],
        },
        {
          text: "足閉じ先動哪一隻腳，各資料說法不一，請依所屬道場。",
          tag: "note",
        },
        { text: "團體射時要注意弓倒的路線，不要打到前方的射手。", tag: "note" },
      ],
    },
  ],
};

export interface Faq {
  q: string;
  a: Point[];
}

export const FAQS: Faq[] = [
  {
    q: "会要撐幾秒？",
    a: [
      { text: "全弓連沒有規定秒數，說明的是等腹部的力量充滿到八、九分。", tag: "official", src: ["syaho"] },
      { text: "學校授課用的指導書建議練習時維持約 5 秒，這是給學生的練習指引。", tag: "guide", src: ["b5"] },
      { text: "「5～7 秒」沒有官方出處；本站 3D 示範的会約 4.3 秒。實際長度依個人與呼吸而定。", tag: "folk", src: ["demo"] },
    ],
  },
  {
    q: "打起し是 45 度嗎？",
    a: [
      { text: "官方只寫高度：兩拳舉到比額頭的線稍高的位置，沒有寫角度。", tag: "official", src: ["syaho"] },
      { text: "「45 度」是坊間常見說法，通常指從側面看手臂與水平的夾角，沒有官方出處。", tag: "folk" },
    ],
  },
  {
    q: "足踏み要踏多寬？",
    a: [
      { text: "以自己的矢束為寬度，兩腳約成 60 度。矢束是從喉嚨中央量到向側面伸直的左手中指指尖。", tag: "official", src: ["syaho", "tool"] },
      { text: "「肩寬的 1.5 倍」沒有官方出處。因為矢束因人而異，寬度不是固定的公分數。", tag: "folk" },
    ],
  },
  {
    q: "大三是拉到三分之一嗎？",
    a: [
      { text: "不是。官方辭典寫大三是拉開約箭長一半的狀態。", tag: "official", src: ["terminology"] },
      { text: "「三分之一」來自「押大目引三分一」，說的是推與拉的比例，不是拉開的長度。", tag: "official", src: ["syaho"] },
    ],
  },
  {
    q: "残心要停多久？",
    a: [
      { text: "官方的說明是保持姿勢、看箭著的位置，沒有規定秒數。", tag: "official", src: ["syaho"] },
      { text: "社團活動用的指導書寫維持約 2 秒，是教學指引；「2～3 秒」屬於坊間常見說法。", tag: "guide", src: ["b6"] },
    ],
  },
  {
    q: "正面打起し和斜面打起し，哪一種才對？",
    a: [
      { text: "兩種都是全弓連承認的方式，官方辭典都有收錄。差別在弓構え的位置與舉弓的方向。", tag: "official", src: ["terminology"] },
      { text: "實際採用哪一種，依所屬道場與指導者的系統。本站的 3D 示範是正面打起し。", tag: "note" },
    ],
  },
  {
    q: "3D 示範的動作可以當標準嗎？",
    a: [
      {
        text: "不行。它是單一示範者、單一次動作、單一正面鏡頭的重建，前後深度與腳部是推算的。請把它當成理解動作順序的輔助，標準以《弓道教本》與指導者為準。",
        tag: "demo",
        src: ["demo"],
      },
    ],
  },
];

/** Sources listed at the bottom of the page, in order. */
export const PAGE_SOURCES: SourceKey[] = ["syaho", "terminology", "tool", "improve02", "b4", "b5", "b6", "miyazaki", "twkyudo", "demo", "research04"];

/**
 * 「這一節要注意的地方」shown under the 3D viewer, keyed by motion segment id.
 * Plain reminders drawn from the sections above (ANKF〈射法について〉, 用語辞典 and the
 * 日本武道館 指導書); no numbers beyond the ones those sources give.
 */
export const CUES: Record<string, string[]> = {
  torimi: [
    "左手持弓、右手持箭，兩個拳頭輕放在腰骨上。",
    "弓往前下方斜，末弭在身體正前方中央、離地約 10 公分；弓與箭形成二等邊三角形。",
    "雙腳併攏、背脊伸直，視線落在前方約 4 公尺。",
  ],
  ashibumi: [
    "先看靶，再把雙腳踏開。",
    "寬度約等於自己的矢束，兩腳成約 60 度的外八字。",
    "兩腳拇趾的尖端和靶心連成一直線。",
    "踏開時上半身不跟著晃動。",
  ],
  dozukuri: [
    "重心放在兩腳中央，腰穩穩坐在腳上，背脊伸直。",
    "從上方看，腳、腰、肩三條線重疊（三重十文字）。",
    "檢查弦與箭（弦調べ、箆調べ），把呼吸調整平順。",
  ],
  yugamae: [
    "右手扣弦（取懸け）、左手握弓（手の内），最後轉頭看靶（物見）。",
    "兩臂撐成圓形，像抱著一棵大樹（円相）。",
    "準備時肩膀放鬆，不要聳起。",
  ],
  uchiokoshi: [
    "兩個拳頭同時、靜靜地往上舉，高度保持一致。",
    "舉到比額頭的線稍高的位置。",
    "肩膀不跟著聳起，胸背保持放鬆。",
  ],
  daisan: [
    "左手往靶的方向推出，右手跟著移動，拉開約箭長的一半。",
    "推與拉的比例是「押大目引三分一」：推的一側多。",
    "箭保持水平，不要讓箭尖上下晃。",
  ],
  hikiwake: [
    "左右均等地拉開，一邊拉一邊讓箭慢慢降到嘴唇的高度。",
    "不是只用手臂拉，而是把胸背向左右打開。",
    "弓保持垂直，不要往後仰（照る）。",
  ],
  kai: [
    "箭在嘴唇的高度（口割）、貼著臉頰（頬付け），弦貼在胸前（胸弦）。",
    "不憋氣，上下左右持續伸展（伸合い）。",
    "等腹部的力量充滿到八、九分，不刻意數秒。",
  ],
  hanare: [
    "不刻意鬆手，在持續伸展中讓箭自然離弦。",
    "左右同時向外展開，胸廓大幅打開。",
    "左手推住不鬆，弓在手中轉動（弓返り）。",
  ],
  zanshin: [
    "保持放箭後的姿勢，視線停在箭著的位置（矢所）。",
    "身體與精神都不要馬上放鬆。",
    "縱線（腳到頭）與橫線（兩肩兩臂）仍保持十字。",
  ],
  yudaoshi: [
    "兩拳以最短的路線同時回到腰骨，弓回到執弓姿勢，末弭不落地。",
    "把臉轉回正面（物見返し），再把雙腳合起來（足閉じ）。",
    "團體射時注意弓的路線，不要打到前方的人。",
  ],
};
