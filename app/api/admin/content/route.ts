import { randomUUID } from "node:crypto";
import {
  adminFailure,
  adminResponse,
  checkOrigin,
  jsonBody,
  requireAdmin,
} from "@/lib/admin/http";
import { AdminError } from "@/lib/admin/errors";
import {
  assertVersion,
  mutateContent,
  readContent,
} from "@/lib/cms/repository";
import { newsInput, testimonialInput, version } from "@/lib/cms/validation";
import { invalidateContent } from "@/lib/cms/invalidate";

export const runtime = "nodejs";
export const maxDuration = 30;
export async function GET() {
  try {
    await requireAdmin();
    return adminResponse(await readContent());
  } catch (error) {
    return adminFailure(error);
  }
}
export async function POST(request: Request) {
  try {
    await requireAdmin();
    checkOrigin(request);
    const body = await jsonBody(request);
    const expected = version(body.version);
    const nextVersion = randomUUID();
    if (body.kind === "news") {
      const entry = { ...newsInput(body), version: nextVersion };
      let previousSlug = entry.slug;
      await mutateContent((content) => {
        const current = content.news.find((n) => n.id === entry.id);
        assertVersion(current, expected);
        previousSlug = current?.slug || entry.slug;
        if (
          content.news.some((n) => n.id !== entry.id && n.slug === entry.slug)
        )
          throw new AdminError(
            "Another article already uses that URL slug.",
            409,
          );
        content.news = [
          ...content.news.filter((n) => n.id !== entry.id),
          entry,
        ];
      });
      invalidateContent([previousSlug, entry.slug]);
      return adminResponse({ entry });
    }
    if (body.kind === "testimonials") {
      const entry = { ...testimonialInput(body), version: nextVersion };
      await mutateContent((content) => {
        assertVersion(
          content.testimonials.find((t) => t.id === entry.id),
          expected,
        );
        content.testimonials = [
          ...content.testimonials.filter((t) => t.id !== entry.id),
          entry,
        ];
      });
      invalidateContent();
      return adminResponse({ entry });
    }
    throw new AdminError("Choose news or testimonials.");
  } catch (error) {
    return adminFailure(error);
  }
}
