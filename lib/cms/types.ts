import type { Client } from "@/lib/data/clients";

export type Status = "draft" | "published" | "archived";
export interface ManagedClient extends Client {
  version: string;
  status: "published" | "archived";
  source?: string;
}
export interface NewsItem {
  id: string;
  version: string;
  status: Status;
  title: string;
  slug: string;
  date: string;
  category: "News" | "Video" | "Insight" | "Event";
  excerpt: string;
  body: string[];
  coverImage: string;
  coverAlt: string;
  videoUrl: string;
}
export interface Testimonial {
  id: string;
  version: string;
  status: Status;
  quote: string;
  name: string;
  role: string;
  company: string;
  centre: string;
  order: number;
}
export interface Content {
  schema: 1;
  revision: number;
  updatedAt: string;
  clients: ManagedClient[];
  news: NewsItem[];
  testimonials: Testimonial[];
}
