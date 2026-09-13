import { videoEmbedUrl } from "@/lib/video";
import { AdminError } from "@/lib/admin/errors";
import type { Crop } from "@/lib/admin/process-logo";
import type { NewsItem, Testimonial, Status, Content } from "./types";

export function text(
  value: unknown,
  label: string,
  max: number,
  required = true,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length > max ||
    (required && !value.trim())
  ) {
    throw new AdminError(
      `${label} ${required ? "is required and" : ""} must be at most ${max} characters.`,
    );
  }
  return value.trim();
}
export function identifier(value: unknown) {
  const id = text(value, "ID", 100);
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new AdminError("Invalid item ID.");
  return id;
}
export function version(value: unknown) {
  return text(value, "Version", 100, false);
}
export function status(value: unknown): Status {
  if (value !== "draft" && value !== "published" && value !== "archived")
    throw new AdminError("Choose a valid publication status.");
  return value;
}
export function cropValue(value: FormDataEntryValue | null): Crop | undefined {
  if (!value) return;
  let c: Crop;
  try {
    c = JSON.parse(String(value));
  } catch {
    throw new AdminError("Choose a valid crop.");
  }
  if (
    !c ||
    ![c.x, c.y, c.width, c.height].every(
      (n) => typeof n === "number" && Number.isFinite(n),
    ) ||
    c.x < 0 ||
    c.y < 0 ||
    c.width <= 0 ||
    c.height <= 0 ||
    c.x + c.width > 1.000001 ||
    c.y + c.height > 1.000001
  ) {
    throw new AdminError("The crop must stay inside the image.");
  }
  return c;
}
export function imageUrl(value: unknown, required = false) {
  const url = text(value, "Image", 1000, required);
  if (!url && !required) return "";
  if (/^\/images\/[a-zA-Z0-9_./-]+$/.test(url) && !url.includes(".."))
    return url;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new AdminError("Choose an uploaded image.");
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    !/^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(parsed.hostname)
  )
    throw new AdminError("Choose an uploaded image.");
  return url;
}
export function videoUrl(value: unknown) {
  const url = text(value, "Video URL", 500, false);
  if (!url) return "";
  if (!videoEmbedUrl(url))
    throw new AdminError("Use a valid YouTube or Vimeo video URL.");
  return url;
}
export function newsInput(
  body: Record<string, unknown>,
): Omit<NewsItem, "version"> {
  const published = status(body.status);
  const slug = text(body.slug, "URL slug", 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new AdminError(
      "Use lowercase letters, numbers and hyphens for the URL slug.",
    );
  const date = text(body.date, "Date", 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    throw new AdminError("Choose a valid date.");
  if (!["News", "Video", "Insight", "Event"].includes(String(body.category)))
    throw new AdminError("Choose a valid category.");
  const paragraphs = text(
    body.body,
    "Article",
    30000,
    published === "published",
  )
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    id: identifier(body.id),
    status: published,
    slug,
    date,
    category: body.category as NewsItem["category"],
    title: text(body.title, "Title", 180),
    excerpt: text(body.excerpt, "Summary", 600, published === "published"),
    body: paragraphs,
    coverImage: imageUrl(body.coverImage),
    coverAlt: text(
      body.coverAlt,
      "Image description",
      200,
      Boolean(body.coverImage),
    ),
    videoUrl: videoUrl(body.videoUrl),
  };
}
export function testimonialInput(
  body: Record<string, unknown>,
): Omit<Testimonial, "version"> {
  const order = Number(body.order);
  if (!Number.isInteger(order) || order < 0 || order > 10000)
    throw new AdminError(
      "Display order must be a whole number between 0 and 10000.",
    );
  return {
    id: identifier(body.id),
    status: status(body.status),
    quote: text(body.quote, "Quote", 2000),
    name: text(body.name, "Name", 150),
    role: text(body.role, "Role", 150, false),
    company: text(body.company, "Company", 150),
    centre: text(body.centre, "Centre", 150, false),
    order,
  };
}
export function parseContent(raw: string): Content {
  try {
    const value = JSON.parse(raw) as Content;
    if (
      !value ||
      value.schema !== 1 ||
      !Number.isSafeInteger(value.revision) ||
      value.revision < 0 ||
      typeof value.updatedAt !== "string" ||
      !Number.isFinite(Date.parse(value.updatedAt)) ||
      !Array.isArray(value.clients) ||
      !Array.isArray(value.news) ||
      !Array.isArray(value.testimonials)
    )
      throw new Error();
    for (const collection of [value.clients, value.news, value.testimonials]) {
      if (
        collection.length > 1000 ||
        new Set(collection.map((item) => item.id)).size !== collection.length
      )
        throw new Error();
      for (const item of collection) {
        identifier(item.id);
        text(item.version, "Version", 100);
      }
    }
    for (const client of value.clients) {
      text(client.name, "Client name", 150);
      imageUrl(client.logo, true);
      if (
        !["published", "archived"].includes(client.status) ||
        client.h !== 560 ||
        !Number.isInteger(client.w) ||
        client.w < 1 ||
        client.w > 10000
      )
        throw new Error();
    }
    for (const post of value.news) {
      if (
        !Array.isArray(post.body) ||
        !post.body.every((p) => typeof p === "string")
      )
        throw new Error();
      newsInput({ ...post, body: post.body.join("\n\n") });
    }
    if (new Set(value.news.map((n) => n.slug)).size !== value.news.length)
      throw new Error();
    for (const entry of value.testimonials) testimonialInput({ ...entry });
    return value;
  } catch {
    throw new Error(
      "Invalid CMS document. Restore a verified backup before editing.",
    );
  }
}
