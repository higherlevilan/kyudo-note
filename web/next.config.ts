import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site for now (no backend). Supabase comes later.
  output: "export",
  trailingSlash: true,
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
