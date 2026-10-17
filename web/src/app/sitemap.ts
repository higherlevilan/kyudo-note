import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/seo";

// Static export: render once at build time.
export const dynamic = "force-static";

// Lower priority for the browser-only tools (practice quizzes, personal journal), which have little crawlable text.
const PRIORITY: Partial<Record<(typeof ROUTES)[number], number>> = {
  "/": 1,
  "/practice/": 0.5,
  "/journal/": 0.4,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    // SITE_URL already ends with "/", so drop the route's leading slash.
    url: new URL(path.slice(1), SITE_URL).href,
    changeFrequency: "monthly",
    priority: PRIORITY[path] ?? 0.8,
  }));
}
