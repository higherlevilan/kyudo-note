import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
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

const BUILD_DATE = new Date();

/**
 * lastModified = the last git commit touching the route's page, content and components
 * (src/app/<slug>, src/content/<slug>, src/components/<slug>), or the build date when git history
 * isn't available. Note: a shallow CI checkout (fetch-depth 1) makes every route report the HEAD commit.
 */
function lastModified(path: string): Date {
  const slug = path.replace(/^\/|\/$/g, "");
  const candidates = slug ? [`src/app/${slug}`, `src/content/${slug}`, `src/components/${slug}`] : ["src/app/page.tsx", "src/components/home"];
  const paths = candidates.filter((p) => existsSync(p));
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return iso ? new Date(iso) : BUILD_DATE;
  } catch {
    return BUILD_DATE;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    // SITE_URL already ends with "/", so drop the route's leading slash.
    url: new URL(path.slice(1), SITE_URL).href,
    lastModified: lastModified(path),
    changeFrequency: "monthly",
    priority: PRIORITY[path] ?? 0.8,
  }));
}
