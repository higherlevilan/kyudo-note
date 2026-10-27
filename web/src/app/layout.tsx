import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ReadingTools from "@/components/reading/ReadingTools";
import CourseToasts from "@/components/course/CourseToasts";
import Companion from "@/components/mascot/Companion";
import { SITE_DESCRIPTION, SITE_NAME, siteMetadata, toJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

// Chinese text uses the system CJK sans (globals.css --font-sans); only Japanese terms (:lang(ja)) get a web font.
// These are Noto Serif JP subset to the characters in src/ (`npm run fonts`, scripts/fonts/subset.mjs): one
// ~440 KB woff2 per weight, committed, so the build needs no network. Not preloaded: the browser fetches a weight
// only when a page actually renders Japanese text in it. Fallback metrics off: the system Mincho stack follows.
const notoSerifJP = localFont({
  variable: "--font-noto-serif-jp",
  src: [
    { path: "./fonts/NotoSerifJP-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NotoSerifJP-600.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

// Apply the saved ReadingTools text size (same key and scales as ReadingTools.tsx) before first paint, so the
// page doesn't reflow when ReadingTools re-applies it after hydration. "m" is the default 100%.
const textSizeScript = `try{var s={s:"93.75%",l:"112.5%"}[localStorage.getItem("kyudo-note:text-size")];if(s)document.documentElement.style.fontSize=s}catch(e){}`;

export const metadata: Metadata = {
  ...siteMetadata,
  title: {
    default: SITE_NAME,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

// WebSite structured data.
const jsonLd = toJsonLd(websiteJsonLd);

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e7" },
    { media: "(prefers-color-scheme: dark)", color: "#181512" },
  ],
};

// lg+: the fixed 課程目錄 sidebar (SiteHeader) sits in the body's left padding (--side-w).
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: textSizeScript may set <html style> before React hydrates.
    <html lang="zh-Hant-TW" className={`${notoSerifJP.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: textSizeScript }} />
      </head>
      <body className="flex min-h-full flex-col lg:pl-[var(--side-w)]">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <ReadingTools />
        <CourseToasts />
        <Companion />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </body>
    </html>
  );
}
