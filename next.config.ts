import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/**" },
    ],
  },
  trailingSlash: false,
  async redirects() {
    return [
      // Old service-prefixed forms moved under /registration
      { source: "/services/company-registration", destination: "/registration/company", permanent: true },

      // Old book-tour collapsed into the unified bookings flow
      { source: "/book-tour", destination: "/bookings", permanent: true },

      // Old marketing pages removed in the strict-parity revamp.
      // Redirect to the closest equivalent rather than 404 to preserve any
      // external SEO juice or live links the client may have shared.
      { source: "/services/virtual-office", destination: "/registration/company", permanent: true },
      { source: "/services", destination: "/registration/company", permanent: true },
      { source: "/workation", destination: "/locations", permanent: true },
      { source: "/workspaces", destination: "/locations", permanent: true },
      { source: "/workspaces/:slug", destination: "/locations", permanent: true },
      { source: "/pricing", destination: "/bookings", permanent: true },
      { source: "/gallery", destination: "/locations", permanent: true },
      { source: "/faq", destination: "/franchise", permanent: true },

      // Old centre slug renamed to match reference site label
      { source: "/locations/salem/brindavan-road", destination: "/locations/salem/fairlands", permanent: true },
    ];
  },
};

export default nextConfig;
