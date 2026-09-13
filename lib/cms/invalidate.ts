import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "./public";

export function invalidateContent(slugs: string[] = []) {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/news/[slug]", "page");
  for (const slug of new Set(slugs)) revalidatePath(`/news/${slug}`);
  revalidatePath("/sitemap.xml");
}
