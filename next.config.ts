import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
} satisfies NextConfig;

export default nextConfig;