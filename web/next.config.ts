import type { NextConfig } from "next";

// GitHub Pages serves the site under /kyudo-note; local dev has no prefix.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static site for now (no backend). Supabase comes later.
  output: "export",
  trailingSlash: true,
  basePath,
  // cacheComponents / partialPrefetching (create-next-app defaults) are not supported
  // with `output: "export"` (PPR invariant); re-enable them when moving off static export.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
