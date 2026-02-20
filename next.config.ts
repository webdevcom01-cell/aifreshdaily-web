import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      // favicon sources
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
