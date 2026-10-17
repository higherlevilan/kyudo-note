import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PracticeApp from "@/components/practice/PracticeApp";

export const metadata: Metadata = pageMetadata({
  path: "/practice/",
  title: "互動練習",
  description:
    "1～3 分鐘的弓道小練習：射法八節排序、這是哪一節、詞彙閃卡、迷思是非題、體配與審查情境題、初段學科自我檢查。題目取自本站內容並附出處，成績只存在自己的瀏覽器。",
  og: "practice",
});

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <header className="pt-10 pb-6">
        <p className="text-sm text-wood">練習</p>
        <h1 className="mt-1 text-3xl font-bold">
          互動練習
          <span lang="ja" className="ml-2 text-xl font-normal text-muted">
            稽古の合間に
          </span>
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          每個練習 1～3 分鐘，答完立刻看解說與出處。通勤、等上射場的空檔，都可以練一輪。
        </p>
      </header>
      <PracticeApp />
    </div>
  );
}
