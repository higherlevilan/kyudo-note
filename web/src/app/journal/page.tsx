import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/content/Blocks";
import JournalApp from "@/components/journal/JournalApp";
import { SYNC_ENABLED } from "@/lib/journal/sync/config";

export const metadata: Metadata = pageMetadata({
  path: "/journal/",
  title: "稽古帳・個人學習日誌",
  description:
    "記錄每次弓道練習的射數、的中、射癖與指導意見，整理課程筆記、審查、裝備採購與文化體驗。資料只存在你的瀏覽器裡，可匯出備份。",
  og: "journal",
});

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <PageHeader kicker="個人學習日誌" title="稽古帳" ja="けいこちょう">
        <p>
          慢慢累積屬於你的學習記錄：每次練習的射數與的中、出現的射癖、老師的一句話，還有課程筆記、審查、裝備採購與文化體驗。
        </p>
        <p className="mt-2 text-sm">
          {SYNC_ENABLED
            ? "紀錄預設只存在這個瀏覽器；到「資料」登入帳號後，會同步到雲端並在其他裝置取回。沒有登入時，清除瀏覽資料會一併遺失，請定期匯出備份。"
            : "紀錄只存在這個瀏覽器，不會上傳。清除瀏覽資料會一併遺失，請定期到「資料」匯出備份。"}
        </p>
      </PageHeader>
      <JournalApp />
    </div>
  );
}
