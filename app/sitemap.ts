import { MetadataRoute } from "next";
import { cities, locations } from "@/lib/data/locations";
import { workspaces } from "@/lib/data/workspaces";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nammaoffice.com";

  const staticPages = [
    "",
    "/about",
    "/workspaces",
    "/locations",
    "/pricing",
    "/franchise",
    "/workation",
    "/services/company-registration",
    "/services/virtual-office",
    "/contact",
    "/book-tour",
    "/faq",
    "/gallery",
    "/privacy-policy",
    "/terms-conditions",
    "/refund-policy",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const workspaceEntries: MetadataRoute.Sitemap = workspaces.map((workspace) => ({
    url: `${baseUrl}/workspaces/${workspace.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const cityEntries: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/locations/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}/locations/${location.city}/${location.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...workspaceEntries,
    ...cityEntries,
    ...locationEntries,
  ];
}
