import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_JP } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ReadingTools from "@/components/reading/ReadingTools";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "弓道學習筆記 Kyudo Note",
    template: "%s｜弓道學習筆記 Kyudo Note",
  },
  description:
    "以繁體中文整理的弓道學習資料：入門指南、射法八節、禮法與體配、裝備百科、文化與哲學、日文詞彙庫、問題研究中心與個人學習日誌。內容以全日本弓道連盟（ANKF）公開資料為準。",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e7" },
    { media: "(prefers-color-scheme: dark)", color: "#181512" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className={`${notoSansTC.variable} ${notoSerifJP.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ReadingTools />
      </body>
    </html>
  );
}
