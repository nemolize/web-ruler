import type { NextConfig } from "next";

export default {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
} satisfies NextConfig;