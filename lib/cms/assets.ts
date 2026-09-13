import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { AdminError } from "@/lib/admin/errors";
import { reserveAssets } from "./quota";
import { dataDirectory, localStorage, readContent } from "./repository";

export const assetStorageConfigured = () =>
  localStorage() || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
async function putAsset(bytes: Buffer, original = false): Promise<string> {
  if (!assetStorageConfigured())
    throw new AdminError("Connect Vercel Blob to upload images.", 503);
  const filename = `${randomUUID()}.${original ? "bin" : "webp"}`;
  if (process.env.NODE_ENV !== "production" && localStorage()) {
    const dir = original
      ? path.join(dataDirectory(), "originals")
      : path.join(process.cwd(), "public/images/cms");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(/* turbopackIgnore: true */ dir, filename),
      bytes,
    );
    return original ? `local:${filename}` : `/images/cms/${filename}`;
  }
  // Immutable keys prevent old CDN/Next Image caches showing replaced artwork.
  // No list, overwrite, propagation polling or destructive cleanup.
  const blob = await put(
    `cms/${original ? "originals" : "images"}/${filename}`,
    bytes,
    {
      access: "public",
      contentType: original ? "application/octet-stream" : "image/webp",
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 31536000,
    },
  );
  return blob.url;
}

export async function storeAssets(
  items: { bytes: Buffer; original?: boolean }[],
) {
  if (!assetStorageConfigured())
    throw new AdminError("Connect Vercel Blob to upload images.", 503);
  await readContent();
  await reserveAssets(
    items.length,
    items.reduce((size, item) => size + item.bytes.length, 0),
  );
  const urls: string[] = [];
  for (const item of items)
    urls.push(await putAsset(item.bytes, item.original));
  return urls;
}
export async function storeAsset(bytes: Buffer) {
  return (await storeAssets([{ bytes }]))[0];
}
