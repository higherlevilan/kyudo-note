import type { MetadataRoute } from "next";
import { BASE_PATH, SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME } from "@/lib/seo";

// Static export: render once at build time.
export const dynamic = "force-static";

// Manifest URLs are not rewritten by Next.js, so prefix the GitHub Pages base path ourselves.
const withBase = (path: string) => `${BASE_PATH}${path}`;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    lang: "zh-Hant-TW",
    dir: "ltr",
    id: withBase("/"),
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    // --paper (globals.css light theme)
    background_color: "#f6f1e7",
    theme_color: "#f6f1e7",
    icons: [
      { src: withBase("/og/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: withBase("/og/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: withBase("/og/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
