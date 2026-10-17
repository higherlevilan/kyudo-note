# 弓道學習筆記 Kyudo Note — Web

Next.js（App Router、TypeScript、Tailwind CSS v4）靜態網站。目前用 `output: "export"` 產生純靜態檔，尚無後端（Supabase 之後再接）。

## 開發

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # 輸出到 web/out/，可放到任何靜態主機
python3 -m http.server -d out 8000   # 本機預覽 build 結果（任一靜態伺服器皆可）
```

## 頁面

| 路徑 | 內容 |
| --- | --- |
| `/` | 首頁與模塊卡片（射法八節、日文詞彙庫已開放，其他「準備中」） |
| `/shaho/` | 射法八節：程式繪製的八節插圖＋各節「入門／深入」說明、常見問題、資料來源 |
| `/glossary/` | 日文詞彙庫：漢字／假名／羅馬拼音（有無長音符號皆可）／中文搜尋與分類篩選 |

## 資料來源

- **射法八節插圖**：`src/components/illustrations/archer/`，依關節角度以程式繪製（`src/content/illustrations/archer/poses.ts`），不使用任何影像。各節下方附示範影片（YouTube）的連結與秒數，設定在 `src/content/shaho-video.ts`；網站不嵌入、不擷取影片。
- **射法八節文字**：`src/content/shaho.ts`，依 `docs/research/02–05` 與全日本弓道連盟官網改寫；來源清單在 `src/content/sources.ts`。沒有官方出處的數字一律標「坊間常見說法」。
- **詞彙庫**：`src/content/glossary.json` 由 `docs/research/05-glossary.md` 轉換：

  ```bash
  npm run glossary   # = node scripts/build-glossary.mjs
  ```

  研究文件更新後重跑即可。欄位：`id, kanji, kana, romaji, romaji_plain, zh, category, source[], disputed, note`。

## 備註

- `create-next-app` 預設的 `cacheComponents`／`partialPrefetching` 與 `output: "export"` 不相容（build 會出現 PPR invariant 錯誤），已先關閉；改用伺服器部署時可再打開。
- 深色／淺色模式跟隨系統設定（`prefers-color-scheme`）。
