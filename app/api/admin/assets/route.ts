import sharp from "sharp";
import {
  adminFailure,
  adminResponse,
  checkOrigin,
  imageForm,
  MAX_FILE_BYTES,
  requireAdmin,
} from "@/lib/admin/http";
import { AdminError } from "@/lib/admin/errors";
import { rateLimit } from "@/lib/admin/rate-limit";
import { storeAsset } from "@/lib/cms/assets";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  try {
    await requireAdmin();
    checkOrigin(request);
    await rateLimit("image-uploads", "staff", 20, 60);
    const file = (await imageForm(request)).get("file");
    if (!(file instanceof File) || !file.size)
      throw new AdminError("Choose an image first.");
    if (file.size > MAX_FILE_BYTES)
      throw new AdminError("Choose an image under 3 MB.", 413);
    let bytes: Buffer;
    try {
      const image = sharp(Buffer.from(await file.arrayBuffer()), {
        limitInputPixels: 16000000,
      });
      const metadata = await image.metadata();
      if (
        !["png", "jpeg", "webp"].includes(metadata.format || "") ||
        (metadata.pages || 1) > 1
      )
        throw new Error("Invalid format");
      bytes = await image
        .rotate()
        .resize({
          width: 1600,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      throw new AdminError(
        "Use a still PNG, JPG or WebP image, no larger than 16 megapixels.",
        422,
      );
    }
    return adminResponse({ url: await storeAsset(bytes) });
  } catch (error) {
    return adminFailure(error);
  }
}
