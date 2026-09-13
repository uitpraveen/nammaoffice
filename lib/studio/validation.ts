import { z } from "zod";
import { videoEmbedUrl } from "../video";
export const kindSchema = z.enum(["logo", "blog", "news", "case-study", "testimonial", "promotion"]);
export type Kind = z.infer<typeof kindSchema>;
export type Role = "admin" | "editor" | "author";
export const uuid = z.string().uuid();
const text = (max: number) => z.string().trim().max(max).default("");
const safeURL = z.string().trim().max(2048).refine(v => !v || /^https?:\/\//i.test(v) && (() => { try { return !new URL(v).username && !new URL(v).password; } catch { return false; } })(), "Use a complete http or https URL.").default("");
export type RichNode = { type: string; text?: string; attrs?: Record<string, unknown>; marks?: { type: string; attrs?: Record<string, unknown> }[]; content?: RichNode[] };
const nodes = new Set(["doc","paragraph","text","heading","bulletList","orderedList","listItem","blockquote","hardBreak","horizontalRule","codeBlock"]);
const marks = new Set(["bold","italic","strike","code","link","underline"]);
export function validateRichText(value: unknown): RichNode {
  if (JSON.stringify(value).length > 150000) throw new Error("Article body must be under 150 KB.");
  let count = 0;
  const visit = (input: unknown, depth: number): RichNode => {
    if (++count > 5000 || depth > 16 || !input || typeof input !== "object") throw new Error("Invalid article structure.");
    const n = input as RichNode;
    if (!nodes.has(n.type)) throw new Error("Unsupported article block.");
    const out: RichNode = { type: n.type };
    if (n.type === "text") { if (typeof n.text !== "string") throw new Error("Invalid text."); out.text = n.text; }
    if (n.type === "heading") out.attrs = { level: [2,3,4].includes(Number(n.attrs?.level)) ? Number(n.attrs?.level) : 2 };
    if (n.type === "orderedList") out.attrs = { start: Math.max(1, Math.min(1000, Number(n.attrs?.start) || 1)) };
    if (n.marks) out.marks = n.marks.map(m => {
      if (!marks.has(m.type)) throw new Error("Unsupported text formatting.");
      if (m.type === "link") { const href = String(m.attrs?.href || ""); if (!/^https?:\/\//i.test(href) && !/^mailto:[^\s<>]+@[^\s<>]+$/.test(href)) throw new Error("Use an http, https or email link."); return { type: "link", attrs: { href: safeURL.parse(href.startsWith("mailto:") ? "" : href) || href } }; }
      return { type: m.type };
    });
    if (n.content) { if (!Array.isArray(n.content)) throw new Error("Invalid article blocks."); out.content = n.content.map(c => visit(c, depth + 1)); }
    return out;
  };
  const result = visit(value, 0); if (result.type !== "doc") throw new Error("Article must be a document."); return result;
}
export const blankBody: RichNode = { type: "doc", content: [{ type: "paragraph" }] };
export const entryDataSchema = z.object({
  title: text(180), slug: z.string().trim().max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"Use lowercase words separated by hyphens.").or(z.literal("")).default(""),
  excerpt: text(500), body: z.unknown().default(blankBody).transform(validateRichText),
  coverMediaId: uuid.or(z.literal("")).default(""), coverAlt: text(250),
  category: text(80), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")).default(""),
  authorName: text(120), seoTitle: text(70), seoDescription: text(170), videoUrl: safeURL,
  client: text(160), industry: text(100), centre: text(160), challenge: text(10000), solution: text(10000), results: text(10000),
  metrics: z.array(z.object({ value: text(60), label: text(140) })).max(12).default([]),
  gallery: z.array(uuid).max(30).default([]),
  name: text(160), website: safeURL, mediaId: uuid.or(z.literal("")).default(""), alt: text(250), order: z.number().int().min(0).max(100000).default(0),
  imageOnly: z.boolean().default(false),
  posterFrame: z.enum(["auto","portrait","square","landscape"]).default("auto"),
  posterFit: z.enum(["contain","cover"]).default("contain"),
  posterPositionX: z.number().int().min(0).max(100).default(50),
  posterPositionY: z.number().int().min(0).max(100).default(50),
  mobileMediaId: uuid.or(z.literal("")).default(""),
  startsAt: z.string().datetime({offset:true}).or(z.literal("")).default(""),
  endsAt: z.string().datetime({offset:true}).or(z.literal("")).default(""),
  priority: z.number().int().min(0).max(1000).default(0),
  ctaLabel: text(60), ctaUrl: safeURL,
  quote: text(4000), role: text(160), company: text(160),
}).strict();
export type EntryData = z.infer<typeof entryDataSchema>;
export const mediaIds = (d: EntryData) => [...new Set([d.mediaId,d.coverMediaId,d.mobileMediaId,...d.gallery].filter(Boolean))];
export function validatePublication(kind: Kind, d: EntryData) {
  if (kind === "logo" && (!d.name || !d.mediaId)) throw new Error("Add a client name and a ready logo before publishing.");
  if (kind === "testimonial" && (!d.name || !d.quote)) throw new Error("Add the person's name and testimonial before publishing.");
  if (!["logo","testimonial","promotion"].includes(kind)) {
    if (!d.title || !d.slug || !d.excerpt) throw new Error("Add a title, URL slug and summary before publishing.");
    if (kind === "case-study" && (!d.client || !d.challenge || !d.solution || !d.results)) throw new Error("Complete the client, challenge, solution and results.");
    if (kind !== "case-study" && !JSON.stringify(d.body).includes('"text"')) throw new Error("Add article content before publishing.");
  }
  if(kind === "promotion") {
    if(!d.title || !d.coverMediaId || !d.coverAlt)throw new Error("Add a promotion title, poster and image description.");
    if(!d.endsAt || !Number.isFinite(Date.parse(d.endsAt)))throw new Error("Set an end date so the poster disappears automatically.");
    if(d.startsAt && (!Number.isFinite(Date.parse(d.startsAt)) || Date.parse(d.startsAt)>=Date.parse(d.endsAt)))throw new Error("The end date must be after the start date.");
    if((!d.imageOnly && Boolean(d.ctaLabel)!==Boolean(d.ctaUrl)) || (d.imageOnly && d.ctaLabel && !d.ctaUrl))throw new Error("Add both a button label and its complete URL, or leave both blank.");
  }
  if (d.date && (Number.isNaN(Date.parse(d.date + "T00:00:00Z")) || new Date(d.date + "T00:00:00Z").toISOString().slice(0,10)!==d.date)) throw new Error("Choose a valid date.");
  if (d.videoUrl && !videoEmbedUrl(d.videoUrl)) throw new Error("Use a valid HTTPS YouTube or Vimeo video URL.");
  if (d.coverMediaId && !d.coverAlt) throw new Error("Describe the cover image for accessibility.");
}
