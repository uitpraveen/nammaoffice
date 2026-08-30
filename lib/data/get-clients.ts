import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Client } from "./clients";

/**
 * Read the client list at request time rather than importing it.
 *
 * A static `import data from "./clients.json"` is baked into the bundle at
 * build time, so a logo added through /admin/logos would not appear until the
 * site was rebuilt. Reading the file here means the page can be regenerated on
 * demand: the admin calls revalidatePath("/") after every change, and the wall
 * updates without a deploy.
 */
export async function getClients(): Promise<Client[]> {
  const file = path.join(process.cwd(), "lib", "data", "clients.json");
  return JSON.parse(await fs.readFile(file, "utf8"));
}
