import type { Metadata } from "next";
import { PageHeader } from "@/components/content/Blocks";
import JournalApp from "@/components/journal/JournalApp";

export const metadata: Metadata = {
  title: "稽古帳・個人學習日誌",
  description: "記錄每次弓道練習的射數、的中、射癖與指導意見，整理課程筆記、審查、裝備採購與文化體驗。資料只存在你的瀏覽器裡，可匯出備份。",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <PageHeader kicker="個人學習日誌" title="稽古帳" ja="けいこちょう">
        <p>
          慢慢累積屬於你的學習記錄：每次練習的射數與的中、出現的射癖、老師的一句話，還有課程筆記、審查、裝備採購與文化體驗。
        </p>
        <p className="mt-2 text-sm">
          紀錄只存在這個瀏覽器，不會上傳。清除瀏覽資料會一併遺失，請定期到「資料」匯出備份。
        </p>
      </PageHeader>
      <JournalApp />
    </div>
  );
}
