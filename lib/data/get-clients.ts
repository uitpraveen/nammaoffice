import "server-only";
import { readClients } from "@/lib/admin/store";
import type { Client } from "./clients";

/**
 * Read the client list at request time rather than importing it.
 *
 * A static `import data from "./clients.json"` is baked into the bundle at
 * build time, so a logo added through /admin/logos would not appear until the
 * site was rebuilt. Going through the store means the page can be regenerated
 * on demand: the admin calls revalidatePath("/") after every change.
 *
 * The store falls back to the committed list whenever Blob is empty or
 * unreachable, so the wall cannot render blank.
 */
export const getClients = (): Promise<Client[]> => readClients();
