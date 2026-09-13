import { getPublicContent } from "@/lib/cms/public";
import type { NewsItem } from "@/lib/cms/types";
export type NewsPost = NewsItem & { dateLabel: string };
export type NewsCategory = NewsItem["category"];
export async function getNewsPosts(): Promise<NewsPost[]> {
  const { news } = await getPublicContent();
  return news.map((post) => ({
    ...post,
    dateLabel: new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(post.date)),
  }));
}
export async function getNewsPost(slug: string) {
  return (await getNewsPosts()).find((post) => post.slug === slug);
}
