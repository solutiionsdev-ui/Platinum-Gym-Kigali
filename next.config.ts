import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-only "N" badge: it covers the phone bottom bar while testing. Errors still show.
  devIndicators: false,

  // The website lives under /en and /ar. The bare address opens the English site.
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
