import { randomUUID } from "node:crypto";
import { AdminError } from "./errors";
import {
  assertVersion,
  mutateContent,
  readContent,
  storageConfigured,
} from "@/lib/cms/repository";
import { assetStorageConfigured, storeAssets } from "@/lib/cms/assets";
import type { Client } from "@/lib/data/clients";
import type { ManagedClient } from "@/lib/cms/types";

export const canWrite = () => storageConfigured() && assetStorageConfigured();
export const readClientsStrict = async () => (await readContent()).clients;
export async function saveLogo(
  entry: Client,
  webp: Buffer,
  source: Buffer,
  expected: string,
): Promise<ManagedClient> {
  if (!canWrite())
    throw new AdminError(
      "Configure the CMS database and image storage before uploading.",
      503,
    );
  const before = (await readContent()).clients.find((c) => c.id === entry.id);
  assertVersion(before, expected);
  // Check conflicts before uploading. A later conflict leaves only unreferenced
  // immutable files; it can never replace another client's existing artwork.
  const [logo, original] = await storeAssets([
    { bytes: webp },
    { bytes: source, original: true },
  ]);
  const stored: ManagedClient = {
    ...entry,
    logo,
    source: original,
    version: randomUUID(),
    status: "published",
  };
  await mutateContent((content) => {
    assertVersion(
      content.clients.find((c) => c.id === entry.id),
      expected,
    );
    content.clients = [
      ...content.clients.filter((c) => c.id !== entry.id),
      stored,
    ].sort((a, b) => a.name.localeCompare(b.name));
  });
  return stored;
}
export async function setLogoStatus(
  id: string,
  expected: string,
  status: "published" | "archived",
) {
  let stored: ManagedClient | undefined;
  await mutateContent((content) => {
    const current = content.clients.find((c) => c.id === id);
    if (!current) throw new AdminError("This logo no longer exists.", 404);
    assertVersion(current, expected);
    stored = { ...current, status, version: randomUUID() };
    content.clients = content.clients.map((c) => (c.id === id ? stored! : c));
  });
  return stored!;
}
