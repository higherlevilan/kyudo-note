import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/content/Blocks";
import FormCheckApp from "@/components/form-check/FormCheckApp";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/form-check/",
  title: "射形分析（實驗）",
  description:
    "在瀏覽器裡分析自己的正面射形影片：自動找出射法八節的關鍵畫面，與本站示意圖比較手腕高度、肩線、手肘角度與物見。影片只在你的裝置上處理，不會上傳。",
  og: "formcheck",
});

export default function FormCheckPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <header className="pt-10 pb-6">
        <p className="text-sm text-wood">實驗功能</p>
        <h1 className="mt-1 text-3xl font-bold">
          射形分析
          <span lang="ja" className="ml-2 text-xl font-normal text-muted">
            射形を見る
          </span>
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          錄一支自己的正面影片，瀏覽器會在你的裝置上找出身體關節，把
          <span lang="ja">弓構え</span>、<span lang="ja">打起し</span>、<span lang="ja">会</span>、<span lang="ja">残心</span>
          等畫面和
          <Link href="/shaho/" className="text-wood underline">
            射法八節
          </Link>
          的示意圖放在一起比較。這是自我觀察的輔助，不是教學，也不是評分。
        </p>
      </header>

      <div className="space-y-4">
        <Callout title="隱私：影片不會離開你的裝置">
          <p>
            影片只在這個瀏覽器分頁裡處理，不會上傳到任何伺服器，本站也收不到。唯一的網路請求，是在你按下「開始分析」後下載 Google MediaPipe
            的姿勢偵測模型與執行環境。關閉分頁後，影片與分析結果就會消失；只有你選擇「存成稽古帳筆記」時，文字摘要才會存進這個瀏覽器的稽古帳。
          </p>
        </Callout>
        <Callout title="拍攝安全" tone="warn">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              拍攝的人絕對不要站在<span lang="ja">矢道</span>（射位到靶之間）或<span lang="ja">巻藁</span>
              的後方，也不要在射手前方近距離拍攝實射。
            </li>
            <li>
              建議用<span lang="ja">素引き</span>、<span lang="ja">ゴム弓</span>或<span lang="ja">巻藁</span>
              練習來錄影；在道場錄影前，請先徵得指導者與道場同意，並留意不要拍到其他人。
            </li>
            <li>把手機固定（腳架或放在穩定處），放在射手正前方、約胸口高度、全身入鏡的距離。</li>
          </ul>
        </Callout>
      </div>

      <div className="mt-8">
        <FormCheckApp />
      </div>

      <section aria-labelledby="limits" className="mt-12">
        <h2 id="limits" className="mb-3 text-xl font-bold">
          這個分析做不到的事
        </h2>
        <ul className="list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            <strong>只有一個正面鏡頭</strong>：前後方向（深度）看不到。手臂朝向鏡頭時，畫面上的手肘角度會失真；
            <span lang="ja">会</span>時右肘是否在肩線後方、箭是否與肩線平行，正面影片都判斷不了。
          </li>
          <li>
            <strong>衣服會擋住關節</strong>：<span lang="ja">道衣</span>的袖子、<span lang="ja">袴</span>
            會遮住手肘、腰與腳踝，偵測位置可能偏移；結果中標示「偵測信心低」的項目請只當參考。
          </li>
          <li>
            <strong>公分只是估計</strong>：長度是以肩寬約 36 公分換算的，每個人的體格不同。
          </li>
          <li>
            <strong>示意圖不是標準答案</strong>：比較對象是本站插圖用的示意姿勢（約 170 公分的成人，依公開資料整理），不是量測出來的標準，
            也不代表任何流派或指導者的要求。
          </li>
          <li>
            <strong>這不是指導</strong>：數字只描述畫面上看到的樣子，不告訴你該怎麼改。射形的判斷與修正，請以指導者為準。
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          技術說明：使用 Google MediaPipe Pose Landmarker 在瀏覽器內偵測 33 個身體點，約每秒 12 格取樣；示意圖的比較值由本站插圖的姿勢資料，以相同的骨架與正面投影計算而來。
        </p>
      </section>
    </div>
  );
}
