import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NammaOffice — Premium Coworking Spaces",
    short_name: "NammaOffice",
    description: "Premium coworking spaces in Salem, Trichy & Tirupur",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#C4683C",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
