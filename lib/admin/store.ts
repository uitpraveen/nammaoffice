import { promises as fs } from "node:fs";
import path from "node:path";
import { del, list, put } from "@vercel/blob";
import type { Client } from "@/lib/data/clients";
import committed from "@/lib/data/clients.json";

/**
 * Where the admin page saves logos.
 *
 * Two drivers, chosen by whether a Blob token is present:
 *
 *   local  - writes straight into the repo, exactly what a developer would
 *            commit by hand. Used in development.
 *   blob   - Vercel's filesystem is read-only, so production keeps the list
 *            and any newly uploaded images in Blob storage instead.
 *
 * The logos that shipped with the site keep their /images/clients/*.webp URLs
 * and are still served straight from the deployment. Only the list and
 * anything uploaded later live in Blob, so switching this on could not change
 * a logo that was already on the wall.
 *
 * Once a Blob manifest exists it IS the live list, and lib/data/clients.json
 * becomes a fallback used only when Blob is unreachable. Keep the two roughly
 * in step: if the committed copy drifts, an outage would not just fail, it
 * would quietly show an older wall. scripts/build-client-logos.py rewrites the
 * committed copy, which is why it no longer runs in CI.
 */
const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "public", "images", "clients");
const DATA_FILE = path.join(ROOT, "lib", "data", "clients.json");
/** Original artwork. scripts/build-client-logos.py rebuilds the whole list
 *  from this folder, so anything saved elsewhere gets wiped on the next run. */
const SOURCE_DIR = path.join(ROOT, "client-logos");

/** The manifest key in Blob. Kept at a fixed path so it can be overwritten. */
const MANIFEST = "clients/manifest.json";

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
/** Saving is possible either way now: on disk locally, in Blob on Vercel. */
export const canWrite = useBlob || (process.env.NODE_ENV !== "production" && !process.env.VERCEL);

/** The list that shipped with the deployment. Also the fallback if Blob is
 *  empty or unreachable, so the wall never renders blank. */
async function committedClients(): Promise<Client[]> {
  return JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
}

async function blobManifestUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: MANIFEST, limit: 1 });
  return blobs[0]?.url ?? null;
}

/**
 * The live list, or a thrown error.
 *
 * Used by anything that then writes the list back. A silent fallback here is
 * dangerous: a single flaky read would rebuild the manifest from the deployed
 * copy and throw away every change made through the admin page. Failing loudly
 * turns that into a visible error instead of quiet data loss.
 */
export async function readClientsStrict(): Promise<Client[]> {
  if (!useBlob) return JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  const url = await blobManifestUrl();
  // No manifest yet means nobody has saved anything, so the deployed list is
  // genuinely the current one.
  if (!url) return committedClients();
  const fresh = `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
  const response = await fetch(fresh, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not read the logo list (${response.status}).`);
  return (await response.json()) as Client[];
}

/**
 * The live list, falling back to the deployed copy if storage is unreachable.
 * Only for rendering: better a slightly stale wall than a blank one.
 */
export async function readClients(): Promise<Client[]> {
  if (!useBlob) return committedClients();
  try {
    const url = await blobManifestUrl();
    if (!url) return committedClients();
    // Blob URLs are immutable per upload, but we overwrite the same key, so
    // ask for a fresh copy rather than a CDN-cached one.
    // The manifest keeps the same URL on every overwrite, so Blob's CDN will
    // happily serve the previous copy. Without a cache-buster a save or a
    // delete appears not to have happened until the edge catches up.
    const fresh = `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
    const response = await fetch(fresh, { cache: "no-store" });
    if (!response.ok) return committedClients();
    return (await response.json()) as Client[];
  } catch {
    // Never let a storage hiccup empty the client wall.
    return committedClients();
  }
}

const sortByName = (clients: Client[]) =>
  [...clients].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

async function writeClients(clients: Client[]) {
  const sorted = sortByName(clients);
  if (!useBlob) {
    await fs.writeFile(DATA_FILE, JSON.stringify(sorted, null, 2) + "\n");
    return;
  }

  await put(MANIFEST, JSON.stringify(sorted, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });

  // Blob takes about a second to propagate an overwrite. The caller
  // revalidates the home page straight after this, and that regeneration
  // reads the manifest back, so returning too early would rebuild the wall
  // from the previous version. Wait until the write is actually visible.
  const expected = JSON.stringify(sorted.map((c) => c.id));
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const seen = await readClientsStrict();
      if (JSON.stringify(seen.map((c) => c.id)) === expected) return;
    } catch {
      // Still settling. Keep waiting rather than treating it as done.
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  // Six tries is over two seconds. Carry on rather than failing the save: the
  // write itself succeeded, and the page will pick it up on a later request.
}

export async function saveLogo(
  entry: Client,
  webp: Buffer,
  source?: { bytes: Buffer; ext: string },
) {
  let stored = entry;

  if (useBlob) {
    const uploaded = await put(`clients/${entry.id}.webp`, webp, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    // The wall renders whatever URL is in the list, so a Blob-hosted logo sits
    // beside the committed ones with no special casing.
    stored = { ...entry, logo: uploaded.url };
    // Keep the original too, so a developer can rebuild the wall from scratch.
    if (source) {
      await put(`clients-source/${entry.id}.${source.ext}`, source.bytes, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    }
  } else {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
    await fs.writeFile(path.join(IMAGES_DIR, `${entry.id}.webp`), webp);
    if (source) {
      await fs.mkdir(SOURCE_DIR, { recursive: true });
      for (const stale of await fs.readdir(SOURCE_DIR)) {
        if (stale.replace(/\.[^.]+$/, "") === entry.id) {
          await fs.rm(path.join(SOURCE_DIR, stale), { force: true });
        }
      }
      await fs.writeFile(path.join(SOURCE_DIR, `${entry.id}.${source.ext}`), source.bytes);
    }
  }

  const clients = await readClientsStrict();
  await writeClients([...clients.filter((c) => c.id !== stored.id), stored]);
  return stored;
}

export async function removeLogo(id: string) {
  const clients = await readClientsStrict();
  if (!clients.some((c) => c.id === id)) return false;
  await writeClients(clients.filter((c) => c.id !== id));

  if (useBlob) {
    // Drop the uploaded copies. A logo that shipped with the deployment has no
    // Blob entry, and del() on a missing key is a no-op, so both cases are fine.
    for (const key of [`clients/${id}.webp`, `clients-source/${id}`]) {
      try {
        const { blobs } = await list({ prefix: key, limit: 5 });
        if (blobs.length) await del(blobs.map((b) => b.url));
      } catch {
        // The list no longer shows it, which is what visitors see. A leftover
        // file is harmless and should not fail the request.
      }
    }
    return true;
  }

  await fs.mkdir(SOURCE_DIR, { recursive: true });
  for (const file of await fs.readdir(SOURCE_DIR)) {
    if (file.replace(/\.[^.]+$/, "") === id) {
      await fs.rm(path.join(SOURCE_DIR, file), { force: true });
    }
  }
  // The processed WebP stays: it is tiny, and leaving it makes re-adding the
  // same client instant.
  return true;
}
