import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
  },
  trailingSlash: false,
};

export default nextConfig;
