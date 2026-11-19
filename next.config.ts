import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-only "N" badge: it covers the phone bottom bar while testing. Errors still show.
  devIndicators: false,

  // Lets a test build run in another folder (NEXT_BUILD_DIR=.next-check) while the dev server keeps using .next.
  distDir: process.env.NEXT_BUILD_DIR || ".next",

  // The website lives under /en and /ar. The bare address opens the English site.
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
