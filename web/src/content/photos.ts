// 真實照片：只用可自由再利用的授權（公有領域、CC0、CC BY、CC BY-SA），全部來自 Wikimedia Commons，
// 每張都標出作者、授權與原始頁面。檔案在 public/photos/，已縮到長邊 1200 px；
// 標「已轉向」的是把直立的長條照片轉成橫向。說明文字只寫照片本身看得出來、或原始頁面寫明的事。
// 店家、部落格、社群上的照片有著作權，未經同意不能放進來。

export interface Photo {
  /** file name under public/photos/ */
  file: string;
  width: number;
  height: number;
  /** alt text: what the photo shows */
  alt: string;
  /** short caption under the photo */
  caption: string;
  author: string;
  license: "公有領域" | "CC0" | "CC BY 3.0" | "CC BY 4.0" | "CC BY-SA 2.0" | "CC BY-SA 3.0" | "CC BY-SA 4.0";
  licenseUrl?: string;
  /** Wikimedia Commons file page */
  pageUrl: string;
  /** changes made to the original (required by CC BY / BY-SA) */
  changes?: string;
}

const BY4 = "https://creativecommons.org/licenses/by/4.0/";
const SA2 = "https://creativecommons.org/licenses/by-sa/2.0/";
const SA3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const SA4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/";
const SHRUNK = "縮小";

export const PHOTOS = {
  yumi: {
    file: "yumi-take.jpg",
    width: 1200,
    height: 147,
    alt: "一把上好弦的和弓，全長由左到右橫放，左端是上方的末弭",
    caption: "上好弦的竹弓（左邊是弓的上端；原圖由幾張照片拼接）。握在下半部，上下不對稱。",
    author: "Nuage fou",
    license: "公有領域",
    pageUrl: "https://commons.wikimedia.org/wiki/File:Yumi01.jpg",
    changes: "已轉向、縮小",
  },
  ya: {
    file: "ya-matoya.jpg",
    width: 1200,
    height: 200,
    alt: "兩支弓道用的箭，全長橫放，左端是羽與筈",
    caption: "練習與比賽用的箭（的矢），左端是羽和筈。",
    author: "霧木諒二",
    license: "CC BY-SA 3.0",
    licenseUrl: SA3,
    pageUrl: "https://commons.wikimedia.org/wiki/File:Matoya_02.jpg",
    changes: "已轉向、縮小",
  },
  yaHane: {
    file: "ya-hane.jpg",
    width: 900,
    height: 511,
    alt: "兩支箭的羽部特寫，羽毛有深淺斑紋",
    caption: "羽的特寫：每支箭有三片羽，貼在筈的前方。",
    author: "霧木諒二",
    license: "CC BY-SA 3.0",
    licenseUrl: SA3,
    pageUrl: "https://commons.wikimedia.org/wiki/File:Matoya_hane.jpg",
  },
  yaItatsuki: {
    file: "ya-itatsuki.jpg",
    width: 636,
    height: 750,
    alt: "三支箭的箭頭特寫，金屬箭頭套在箭桿前端",
    caption: "箭頭（板付）的特寫，形狀有幾種。",
    author: "霧木諒二",
    license: "CC BY-SA 3.0",
    licenseUrl: SA3,
    pageUrl: "https://commons.wikimedia.org/wiki/File:Matoya_yajiri.jpg",
  },
  kakeMitsu: {
    file: "kake-mitsu.jpg",
    width: 1200,
    height: 900,
    alt: "一只三指的弽平放在榻榻米上，有紫色的綁帶與白色的下襯",
    caption: "三つがけ（三指的弽），平放的樣子；依原始頁面說明，拇指是硬的「堅帽子」。",
    author: "Ｔ／Ｙ",
    license: "公有領域",
    pageUrl: "https://commons.wikimedia.org/wiki/File:%E3%82%86%E3%81%8C%E3%81%91.JPG",
    changes: SHRUNK,
  },
  kakeMitsuWorn: {
    file: "kake-mitsu-worn.jpg",
    width: 1200,
    height: 722,
    alt: "右手戴著三指的弽，手腕用紫色綁帶固定",
    caption: "戴在右手上的三つがけ，手腕用紐（綁帶）固定。",
    author: "Ｔ／Ｙ",
    license: "公有領域",
    pageUrl: "https://commons.wikimedia.org/wiki/File:%E3%82%86%E3%81%8C%E3%81%91.jpg",
    changes: SHRUNK,
  },
  kakeYotsu: {
    file: "kake-yotsu.jpg",
    width: 600,
    height: 400,
    alt: "射手放在膝上的右手戴著弽",
    caption: "比賽中射手戴著的四つがけ（依原始頁面說明）。",
    author: "Aabh",
    license: "CC BY-SA 3.0",
    licenseUrl: SA3,
    pageUrl: "https://commons.wikimedia.org/wiki/File:Kyudoka-yotsukake.jpg",
  },
  wear: {
    file: "wear-archers.jpg",
    width: 1200,
    height: 800,
    alt: "三位射手在室內射場持弓站立，穿白色上衣、黑色袴與白足袋",
    caption: "比賽中的服裝：白色弓道衣、黑袴、白足袋（2014 年巴黎弓道世界盃）。",
    author: "Pierre-Yves Beaudouin",
    license: "CC BY-SA 4.0",
    licenseUrl: SA4,
    pageUrl: "https://commons.wikimedia.org/wiki/File:2014_Kyudo_World_Cup_07.jpg",
    changes: SHRUNK,
  },
  tabi: {
    file: "tabi.jpg",
    width: 1200,
    height: 900,
    alt: "一雙白色足袋套在木製鞋楦上",
    caption: "白色足袋：大拇趾和其他四趾分開。照片攝於足袋博物館。",
    author: "Asturio Cantabrio",
    license: "CC BY-SA 4.0",
    licenseUrl: SA4,
    pageUrl: "https://commons.wikimedia.org/wiki/File:Gyoda_Tabi_2020-11_ac_(1).jpg",
    changes: SHRUNK,
  },
  makiwara: {
    file: "makiwara.jpg",
    width: 859,
    height: 1200,
    alt: "架在木台上的圓筒形草捆，正面朝向射手",
    caption: "巻藁：架在台上的草捆，近距離練習用。",
    author: "Ｔ／Ｙ",
    license: "CC BY-SA 3.0",
    licenseUrl: SA3,
    pageUrl: "https://commons.wikimedia.org/wiki/File:Makiwara_kyudo.jpg",
    changes: SHRUNK,
  },
  makiwaraRow: {
    file: "makiwara-row.jpg",
    width: 1200,
    height: 675,
    alt: "道場的巻藁練習區，一排巻藁架在台上",
    caption: "道場裡的巻藁練習區。",
    author: "Souka Kinmei",
    license: "CC BY 4.0",
    licenseUrl: BY4,
    pageUrl: "https://commons.wikimedia.org/wiki/File:%E5%B7%BB%E3%82%8F%E3%82%89%E7%B7%B4%E7%BF%92%E5%A0%B4(%E5%BC%93%E9%81%93%E5%A0%B4).jpg",
    changes: SHRUNK,
  },
  matoAzuchi: {
    file: "mato-azuchi.jpg",
    width: 1200,
    height: 900,
    alt: "兩個黑白同心圓的霞的立在土堆前，靶上插著箭",
    caption: "立在安土前的霞的，上面插著射中的箭。",
    author: "Ozizo",
    license: "CC0",
    licenseUrl: CC0,
    pageUrl: "https://commons.wikimedia.org/wiki/File:Target_of_Kyudo.jpg",
    changes: SHRUNK,
  },
  matoRow: {
    file: "mato-row.jpg",
    width: 1200,
    height: 900,
    alt: "戶外射場的安土前排著一列霞的，上方掛著紫色布幕",
    caption: "安土前排成一列的的，上方是遮陽遮雨的屋簷與布幕。",
    author: "ThisParticularGreg",
    license: "CC BY-SA 2.0",
    licenseUrl: SA2,
    pageUrl: "https://commons.wikimedia.org/wiki/File:Targets_of_Kyudo_(2806472683).jpg",
    changes: SHRUNK,
  },
  dojoKinteki: {
    file: "dojo-kinteki.jpg",
    width: 1200,
    height: 675,
    alt: "從室內射場的木地板望向草地矢道與遠處安土上的的，有一位射手站在射場上",
    caption: "近的射場：前景是木地板的射場，中間是矢道，遠處是安土與的。",
    author: "Souka Kinmei",
    license: "CC0",
    licenseUrl: CC0,
    pageUrl: "https://commons.wikimedia.org/wiki/File:%E8%BF%91%E7%9A%84%EF%BC%88%E3%81%8D%E3%82%93%E3%81%A6%E3%81%8D%EF%BC%89%E5%BC%93%E9%81%93%E5%A0%B4.jpg",
    changes: SHRUNK,
  },
  dojoShajo: {
    file: "dojo-shajo.jpg",
    width: 1200,
    height: 900,
    alt: "從射場望向對面的的場：草地矢道、安土與屋頂",
    caption: "從射場看對面的的場（日本岐阜縣各務原市弓道場）。",
    author: "Onaonan",
    license: "CC BY-SA 3.0",
    licenseUrl: SA3,
    pageUrl: "https://commons.wikimedia.org/wiki/File:%E5%90%84%E5%8B%99%E5%8E%9F%E5%B8%82%E5%BC%93%E9%81%93%E5%A0%B4_%E5%B0%84%E5%A0%B4.JPG",
    changes: SHRUNK,
  },
} satisfies Record<string, Photo>;

export type PhotoId = keyof typeof PHOTOS;
