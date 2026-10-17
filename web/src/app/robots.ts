import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Static export: render once at build time.
export const dynamic = "force-static";

// Note: on a GitHub Pages project site this file is served at /kyudo-note/robots.txt, but crawlers only read
// robots.txt at the host root (higherlevilan.github.io/robots.txt). It is kept for a future custom domain;
// submit the sitemap URL to Google Search Console / Bing Webmaster Tools directly.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("sitemap.xml", SITE_URL).href,
  };
}
