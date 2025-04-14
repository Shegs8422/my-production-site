// next.config.ts
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify: true, // REMOVED

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // Keep this for later Sanity use
      },
    ],
  },
};

export default nextConfig;
