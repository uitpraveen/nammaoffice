import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NammaOffice - Premium Coworking Spaces",
    short_name: "NammaOffice",
    description: "Premium coworking spaces in Salem, Trichy, Tirupur, Erode & Hosur",
    start_url: "/",
    display: "standalone",
    background_color: "#FEF6E6",
    theme_color: "#1FB5E0",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
