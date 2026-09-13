import { MetadataRoute } from "next";
import { publicEntries } from "@/lib/studio/public";
import { cities, locations } from "@/lib/data/locations";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await Promise.all([publicEntries("blog",10000),publicEntries("news",10000),publicEntries("case-study",10000)]);
  const baseUrl = "https://nammaoffice.com";

  const staticPages = [
    "",
    "/locations",
    "/news",
    "/blogs",
    "/case-studies",
    "/franchise",
    "/registration/company",
    "/registration/user",
    "/registration/vendor",
    "/bookings",
    "/gate-pass/tidel-neo-salem",
    "/gate-pass/tidel-neo-tirupur",
    "/service-request",
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

  const newsEntries: MetadataRoute.Sitemap = content.flat().map(post => ({
    url: `${baseUrl}/${post.kind === "blog" ? "blogs" : post.kind === "case-study" ? "case-studies" : "news"}/${post.data.slug}`, lastModified: new Date(post.updated_at), changeFrequency: "weekly", priority: 0.6,
  }));
  return [...staticEntries, ...cityEntries, ...locationEntries, ...newsEntries];
}
