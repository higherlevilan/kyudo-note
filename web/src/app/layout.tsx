import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_JP } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ReadingTools from "@/components/reading/ReadingTools";
import { SITE_DESCRIPTION, SITE_NAME, siteMetadata, websiteJsonLd } from "@/lib/seo";
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
  ...siteMetadata,
  title: {
    default: SITE_NAME,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

// WebSite structured data. `<` is escaped so the JSON can never close the script element.
const jsonLd = JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c");

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </body>
    </html>
  );
}
