import { head } from "@vercel/blob";
import { AdminError } from "@/lib/admin/errors";
import { imageUrl, identifier, text } from "./validation";
import type { Client } from "@/lib/data/clients";

export function validateLegacyClients(data: unknown): Client[] {
  if (!Array.isArray(data) || data.length > 1000)
    throw new AdminError(
      "The legacy manifest must be a client array with at most 1000 entries.",
    );
  const ids = new Set<string>();
  return data.map((c) => {
    if (!c || typeof c !== "object")
      throw new AdminError("Invalid client in the manifest.");
    const id = identifier(c.id);
    if (ids.has(id))
      throw new AdminError("Duplicate client IDs in the manifest.");
    ids.add(id);
    if (!Number.isInteger(c.w) || c.w <= 0 || c.w > 10000 || c.h !== 560)
      throw new AdminError("Invalid logo dimensions in the manifest.");
    return {
      id,
      name: text(c.name, "Client name", 150),
      logo: imageUrl(c.logo, true),
      w: c.w,
      h: c.h,
      ...(c.tile ? { tile: true as const } : {}),
    };
  });
}
export async function readLegacyClients(authoritative = false) {
  const configured = process.env.BLOB_MANIFEST_URL;
  if (!configured)
    throw new AdminError(
      "Set BLOB_MANIFEST_URL to the existing clients/manifest.json URL before importing.",
      503,
    );
  const url = imageUrl(configured, true);
  if (
    !url.startsWith("https://") ||
    new URL(url).pathname !== "/clients/manifest.json"
  )
    throw new AdminError(
      "BLOB_MANIFEST_URL must point to clients/manifest.json in your public Blob store.",
    );
  // Migration only: HEAD protects against importing a stale CDN snapshot.
  const metadata = authoritative
    ? await head(url, { abortSignal: AbortSignal.timeout(10000) })
    : null;
  if (metadata && metadata.size > 2 * 1024 * 1024)
    throw new AdminError("The existing manifest is too large to import.", 413);
  const target = new URL(url);
  if (authoritative) target.searchParams.set("migration", String(Date.now()));
  const response = await fetch(target, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new AdminError(
      "The existing logo manifest could not be read. Import was not started.",
      503,
    );
  const normalizeEtag = (value: string | null) =>
    value?.replace(/^W\//, "").replace(/^"|"$/g, "");
  if (
    metadata &&
    normalizeEtag(response.headers.get("etag")) !== normalizeEtag(metadata.etag)
  )
    throw new AdminError(
      "The logo manifest is still updating. Wait one minute and import again.",
      409,
    );
  return validateLegacyClients(await response.json());
}
