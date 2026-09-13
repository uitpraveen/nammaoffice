import sharp from "sharp";
import { createHash } from "node:crypto";
import { AdminError } from "@/lib/admin/errors";
import {
  adminFailure,
  adminResponse,
  checkOrigin,
  imageForm,
  jsonBody,
  MAX_FILE_BYTES,
  requireAdmin,
} from "@/lib/admin/http";
import { processLogo, toSlug, CANVAS_H } from "@/lib/admin/process-logo";
import {
  canWrite,
  readClientsStrict,
  saveLogo,
  setLogoStatus,
} from "@/lib/admin/store";
import { cropValue, identifier, text, version } from "@/lib/cms/validation";
import { invalidateContent } from "@/lib/cms/invalidate";
import { rateLimit } from "@/lib/admin/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;
export async function GET() {
  try {
    await requireAdmin();
    return adminResponse({
      clients: await readClientsStrict(),
      canWrite: canWrite(),
    });
  } catch (error) {
    return adminFailure(error);
  }
}
export async function POST(request: Request) {
  try {
    await requireAdmin();
    checkOrigin(request);
    await rateLimit("logo-processing", "staff", 30, 60);
    const form = await imageForm(request);
    const file = form.get("file");
    const name = text(form.get("name"), "Client name", 150);
    if (!(file instanceof File) || !file.size)
      throw new AdminError("Choose a logo file first.");
    if (file.size > MAX_FILE_BYTES)
      throw new AdminError("Choose an image under 3 MB.", 413);
    const bytes = Buffer.from(await file.arrayBuffer());
    let result;
    const crop = cropValue(form.get("crop"));
    try {
      const metadata = await sharp(bytes, {
        limitInputPixels: 16000000,
      }).metadata();
      if (!["png", "jpeg", "webp", "svg"].includes(metadata.format || ""))
        throw new Error("Unsupported image");
      if (metadata.pages && metadata.pages > 1)
        throw new Error("Animated image");
      result = await processLogo(bytes, crop);
    } catch {
      throw new AdminError(
        "Use a valid, still PNG, JPG, WebP or SVG image, no larger than 16 megapixels.",
        422,
      );
    }
    const id = form.get("id")
      ? identifier(form.get("id"))
      : toSlug(name) ||
        `client-${createHash("sha256").update(name).digest("hex").slice(0, 16)}`;
    const entry = {
      id,
      name,
      logo: `/images/clients/${id}.webp`,
      w: result.width,
      h: CANVAS_H,
      ...(result.tile ? { tile: true as const } : {}),
    };
    const warning =
      result.upscale > 1.02
        ? `This image was enlarged ${result.upscale.toFixed(1)}×. A larger original will look sharper.`
        : null;
    if (form.get("preview") === "true")
      return adminResponse({
        preview: `data:image/webp;base64,${result.webp.toString("base64")}`,
        entry,
        warning,
      });
    const stored = await saveLogo(
      entry,
      result.webp,
      bytes,
      version(form.get("version") || ""),
    );
    invalidateContent();
    return adminResponse({ ok: true, entry: stored, warning });
  } catch (error) {
    return adminFailure(error);
  }
}
async function changeStatus(
  request: Request,
  status: "published" | "archived",
) {
  try {
    await requireAdmin();
    checkOrigin(request);
    const body = await jsonBody(request);
    const entry = await setLogoStatus(
      identifier(body.id),
      version(body.version),
      status,
    );
    invalidateContent();
    return adminResponse({ ok: true, entry });
  } catch (error) {
    return adminFailure(error);
  }
}
export const DELETE = (request: Request) => changeStatus(request, "archived");
export const PATCH = (request: Request) => changeStatus(request, "published");
