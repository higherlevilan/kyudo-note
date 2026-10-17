# 稽古帳雲端同步：Supabase 設定步驟

稽古帳預設只把紀錄存在使用者的瀏覽器裡。設定好 Supabase 之後，使用者可以用電子郵件登入（magic link，不需要密碼），在多台裝置之間同步紀錄。

網站是 GitHub Pages 上的純靜態網站，沒有自己的伺服器：瀏覽器直接用 Supabase 的 **anon（publishable）key** 加上使用者登入後的 JWT 存取資料庫，資料的存取權限完全由資料庫的 **Row Level Security（RLS）** 控制。

> **沒有設定也沒關係。** 只要建置時沒有提供 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`，網站照常建置，帳號／同步功能完全關閉（「資料」頁只顯示「雲端同步尚未開放」），不會載入任何 Supabase 程式碼。

---

## 1. 建立 Supabase 專案

1. 到 <https://supabase.com/dashboard> 登入，按 **New project**。
2. 名稱例如 `kyudo-note`；**Region** 建議選離使用者近的（台灣使用者：`Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`）。
3. 設定資料庫密碼並妥善保存（之後用 CLI 才需要；網站本身用不到）。
4. 等專案建立完成（約 1–2 分鐘）。

## 2. 建立資料表（執行 migration）

migration 檔案：[`supabase/migrations/0001_journal.sql`](../supabase/migrations/0001_journal.sql)。它會建立：

- `public.journal_entries` 資料表，主鍵 `(user_id, id)`，刪除採軟刪除（`deleted = true`），刪除後內容會被清空。
- 同步用索引 `(user_id, server_updated_at, id)`。
- 寫入觸發器：拒絕比雲端舊的版本（last-writer-wins）、把未來時間夾回現在、維護 `server_updated_at`（同步游標）。
- **RLS**：只有登入的使用者，而且只能 select / insert / update / delete 自己的列；`anon` 角色沒有任何權限。

擇一執行：

**A. 用 Dashboard（最簡單）**

1. 左側 **SQL Editor** → **New query**。
2. 把 `0001_journal.sql` 全文貼上 → **Run**。看到 `Success. No rows returned` 即完成。
3. 到 **Table Editor** 確認有 `journal_entries`，且表名旁顯示 RLS 已啟用。

**B. 用 Supabase CLI**

```bash
cd /path/to/kyudo_note        # 專案根目錄（含 supabase/ 資料夾）
npx supabase login
npx supabase link --project-ref <你的 project ref>
npx supabase db push
```

這個 migration 可以重複執行（`if not exists` / `drop … if exists`）。

## 3. 設定登入（Email magic link）

到 **Authentication**：

1. **Sign In / Providers → Email**：確認 **Enable Email provider** 已開啟。
   - 「Confirm email」維持開啟即可（magic link 本身就是驗證）。
   - 若想限制只有特定人能註冊，可關閉 **Allow new users to sign up**，再到 **Users** 手動邀請。
2. **URL Configuration**：
   - **Site URL**：`https://higherlevilan.github.io/kyudo-note/journal/`
   - **Redirect URLs** 加入兩筆：
     - `https://higherlevilan.github.io/kyudo-note/journal/`
     - `http://localhost:3000/journal/`

     網站寄出登入信時用的回跳網址是 `window.location.origin + basePath + "/journal/"`，必須和這裡完全一致（含結尾的 `/`），否則 Supabase 會改導向 Site URL。
3. **（建議）Emails → Templates → Magic Link**：在信件內容加上驗證碼，讓「信件在別的 App／瀏覽器打開」的人也能在原本的瀏覽器輸入驗證碼登入（稽古帳的登入畫面有「或輸入信中的驗證碼」欄位）：

   ```html
   <h2>登入稽古帳</h2>
   <p><a href="{{ .ConfirmationURL }}">點這裡登入</a></p>
   <p>或在原本的頁面輸入驗證碼：<strong>{{ .Token }}</strong></p>
   ```

   **Confirm signup** 範本（第一次登入的人收到的信）也建議同樣加上 `{{ .Token }}`。
4. **（正式上線必做）SMTP**：Supabase 內建的寄信服務只用於測試——寄送量極低，而且只會寄給專案團隊成員的信箱。正式讓一般使用者登入前，請到 **Authentication → Emails → SMTP Settings** 設定自己的 SMTP（例如 Resend、Postmark、Amazon SES、SendGrid），並視需要在 **Rate Limits** 調整每小時寄信上限。

## 4. 取得 URL 與 anon key

**Project Settings → API**（或 **Data API** / **API Keys**）：

- **Project URL**：例如 `https://abcdefghijklmnop.supabase.co` → 這是 `NEXT_PUBLIC_SUPABASE_URL`。
- **Publishable key**（`sb_publishable_…`）或舊版的 **anon public** key（`eyJ…`）→ 這是 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。

這把 key 本來就會出現在網站的 JavaScript 裡，是公開的；安全性靠的是 RLS。

> ⚠️ **絕對不要**使用 `service_role` / `sb_secret_…` key：它會略過 RLS，任何人都能讀寫所有人的資料。也不要把任何 key 提交到 git。

## 5. 設定 GitHub（正式網站）

1. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**，新增：
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = publishable / anon key
2. `.github/workflows/deploy-web.yml` 的 build 步驟已經會讀這兩個 secrets：

   ```yaml
   - run: npm run build
     env:
       NEXT_PUBLIC_BASE_PATH: /kyudo-note
       NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
       NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
   ```

   secrets 沒設定時值是空字串，建置照樣成功，同步功能關閉。
3. 這些值在**建置時**寫進靜態檔案：新增或修改 secrets 後，要到 **Actions → Deploy web to GitHub Pages → Run workflow** 重新部署才會生效。

## 6. 本機開發

在 `web/.env.local` 建立（`.gitignore` 已排除 `.env*`，不會被提交）：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxx
```

然後 `cd web && npm run dev`，打開 <http://localhost:3000/journal/> → 「資料」分頁 →「帳號與雲端同步」。修改 `.env.local` 後要重新啟動 dev server。

建議本機開發用另一個 Supabase 專案（或至少另一個測試帳號），避免動到正式資料。

## 7. 上線後檢查

1. 在正式網站「資料」頁輸入信箱 → 收信 → 點連結，回到 `/kyudo-note/journal/` 並顯示已登入、「已同步」。
2. 新增一筆紀錄，幾秒後到 **Table Editor → journal_entries** 應該看到一列（`user_id` 是你的帳號）。
3. 用另一台裝置／瀏覽器登入同一個信箱，紀錄應該出現；在其中一邊刪除，另一邊按「立即同步」後也會消失（雲端那一列變成 `deleted = true`、`data = {}`）。
4. 確認 anon key 單獨讀不到資料（RLS 生效）：

   ```bash
   curl "https://<project>.supabase.co/rest/v1/journal_entries?select=id" \
     -H "apikey: <anon key>"
   # 預期：權限錯誤（anon 沒有權限），而不是資料
   ```

5. 用第二個帳號登入，確認看不到第一個帳號的紀錄。

## 同步的行為（給維護者參考）

- 紀錄一律先寫進瀏覽器（IndexedDB），離線照常可用；登入後在以下時機同步：登入時、按「立即同步」、分頁重新回到前景、恢復網路連線、每次編輯後約 3 秒。
- 衝突以 `updated_at` 較新者為準（last-writer-wins）；同時間時，刪除優先於保留。
- 刪除會留下「墓碑」（`deleted = true`，內容清空），讓其他裝置也刪除。墓碑很小，可依 migration 檔最後的註解手動清理很久以前的墓碑。
- 範例資料（`sample-` 開頭）永遠不會上傳；資料庫也有檢查擋下。
- 登出時會詢問要保留或清除這個瀏覽器裡的紀錄；兩者都不影響雲端。
- 使用者若要刪除帳號：到 **Authentication → Users** 刪除該使用者，`journal_entries` 會因 `on delete cascade` 一併刪除。

## 關閉同步

刪除兩個 GitHub secrets（或清空）並重新部署即可。使用者瀏覽器裡的紀錄不受影響，雲端資料仍留在 Supabase 專案中，直到你刪除專案或資料表。
