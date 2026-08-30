import { promises as fs } from "node:fs";
import path from "node:path";
import type { Client } from "@/lib/data/clients";

/**
 * Where the admin page saves logos.
 *
 * Locally it writes straight into the repo, which is exactly what a developer
 * would commit by hand: the processed WebP into public/images/clients/ and the
 * entry into lib/data/clients.json. That keeps one source of truth and leaves
 * the site fully static.
 *
 * On Vercel the filesystem is read-only, so writing has to go somewhere else
 * (Blob, or a commit through the GitHub API). Until that driver exists the
 * admin page is read-only in production rather than silently pretending to
 * save, which is why `canWrite` is checked before every mutation.
 */
const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "public", "images", "clients");
const DATA_FILE = path.join(ROOT, "lib", "data", "clients.json");
/** Original artwork. scripts/build-client-logos.py rebuilds the entire list
 *  from this folder, so anything saved here and nowhere else gets wiped the
 *  next time that script runs. The admin therefore keeps the source too. */
const SOURCE_DIR = path.join(ROOT, "client-logos");

/** Vercel's runtime filesystem is read-only outside /tmp. */
export const canWrite = process.env.NODE_ENV !== "production" && !process.env.VERCEL;

export const readClients = async (): Promise<Client[]> =>
  JSON.parse(await fs.readFile(DATA_FILE, "utf8"));

async function writeClients(clients: Client[]) {
  const sorted = [...clients].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  await fs.writeFile(DATA_FILE, JSON.stringify(sorted, null, 2) + "\n");
}

export async function saveLogo(entry: Client, webp: Buffer, source?: { bytes: Buffer; ext: string }) {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.writeFile(path.join(IMAGES_DIR, `${entry.id}.webp`), webp);

  // Keep the original so the Python rebuild produces the same wall. Without
  // this, running the script silently removes every logo added here.
  if (source) {
    await fs.mkdir(SOURCE_DIR, { recursive: true });
    for (const stale of await fs.readdir(SOURCE_DIR)) {
      if (stale.replace(/\.[^.]+$/, "") === entry.id) {
        await fs.rm(path.join(SOURCE_DIR, stale), { force: true });
      }
    }
    await fs.writeFile(path.join(SOURCE_DIR, `${entry.id}.${source.ext}`), source.bytes);
  }
  const clients = await readClients();
  const next = clients.filter((c) => c.id !== entry.id);
  next.push(entry);
  await writeClients(next);
}

export async function removeLogo(id: string) {
  const clients = await readClients();
  if (!clients.some((c) => c.id === id)) return false;
  await writeClients(clients.filter((c) => c.id !== id));

  // The source artwork has to go too, or the next Python rebuild would put
  // this client straight back. Git history is the undo.
  await fs.mkdir(SOURCE_DIR, { recursive: true });
  for (const file of await fs.readdir(SOURCE_DIR)) {
    if (file.replace(/\.[^.]+$/, "") === id) {
      await fs.rm(path.join(SOURCE_DIR, file), { force: true });
    }
  }
  // The processed WebP stays: it is tiny, and leaving it means re-adding the
  // same client later is instant.
  return true;
}
