import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import committed from "@/lib/data/clients.json";
import { AdminError } from "@/lib/admin/errors";
import { namespace, redisCommand, redisConfigured } from "./redis";
import { parseContent } from "./validation";
import type { Content, ManagedClient } from "./types";

export const localStorage = () =>
  !process.env.VERCEL &&
  process.env.NODE_ENV !== "production" &&
  process.env.CMS_DRIVER !== "redis";
export const storageConfigured = () => localStorage() || redisConfigured();
export const dataDirectory = () =>
  process.env.CMS_LOCAL_DIR || path.join(process.cwd(), ".cms");
const key = () => `${namespace()}:content:v1`;
export const CAS_SCRIPT = `local current = redis.call('GET', KEYS[1])
if current ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[2], current)
redis.call('SET', KEYS[1], ARGV[2])
return 1`;
let localQueue: Promise<unknown> = Promise.resolve();

export function initialContent(clients = committed): Content {
  return {
    schema: 1,
    revision: 0,
    updatedAt: "1970-01-01T00:00:00.000Z",
    clients: clients.map(
      (c) =>
        ({
          ...c,
          version: `seed-${c.id}`,
          status: "published",
        }) as ManagedClient,
    ),
    news: [],
    testimonials: [],
  };
}
export async function readRaw(): Promise<string | null> {
  if (!localStorage()) {
    // EVAL is routed to the primary by Upstash, preventing a replica read
    // from repopulating the public cache with content older than a publish.
    const raw = await redisCommand<unknown>([
      "EVAL",
      'return redis.call("GET", KEYS[1])',
      1,
      key(),
    ]);
    if (raw !== null && typeof raw !== "string")
      throw new Error("Invalid CMS database response");
    return raw;
  }
  try {
    return await fs.readFile(
      path.join(dataDirectory(), "content.json"),
      "utf8",
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
export async function readContent(): Promise<Content> {
  const raw = await readRaw();
  if (raw) return parseContent(raw);
  if (localStorage()) return initialContent();
  throw new AdminError(
    "Import your existing logos from CMS setup before editing.",
    409,
  );
}
async function withLocalLock<T>(action: () => Promise<T>): Promise<T> {
  const result = localQueue.then(action, action);
  localQueue = result.catch(() => {});
  return result;
}
async function writeLocal(raw: string) {
  await fs.mkdir(dataDirectory(), { recursive: true });
  const temporary = path.join(dataDirectory(), `${randomUUID()}.tmp`);
  await fs.writeFile(temporary, raw, { mode: 0o600 });
  await fs.rename(temporary, path.join(dataDirectory(), "content.json"));
}
export async function initializeContent(content: Content): Promise<boolean> {
  const raw = JSON.stringify(content);
  if (!localStorage())
    return (await redisCommand(["SET", key(), raw, "NX"])) === "OK";
  return withLocalLock(async () => {
    if (await readRaw()) return false;
    await writeLocal(raw);
    return true;
  });
}
async function compareAndSwap(previous: string | null, next: string) {
  if (!localStorage()) {
    if (!previous) throw new AdminError("Complete CMS setup first.", 409);
    return (
      (await redisCommand<number>([
        "EVAL",
        CAS_SCRIPT,
        2,
        key(),
        `${key()}:previous`,
        previous,
        next,
      ])) === 1
    );
  }
  return withLocalLock(async () => {
    if ((await readRaw()) !== previous) return false;
    if (previous)
      await fs.writeFile(
        path.join(dataDirectory(), "previous.json"),
        previous,
        { mode: 0o600 },
      );
    await writeLocal(next);
    return true;
  });
}
export async function mutateContent(
  update: (content: Content) => void,
): Promise<Content> {
  // Retry unrelated concurrent changes. Entity versions are checked by update()
  // on every attempt, so stale edits to the same item are never overwritten.
  for (let attempt = 0; attempt < 4; attempt++) {
    const previous = await readRaw();
    if (!previous && !localStorage())
      throw new AdminError("Complete CMS setup first.", 409);
    const next = previous ? parseContent(previous) : initialContent();
    update(next);
    next.revision++;
    next.updatedAt = new Date().toISOString();
    const raw = JSON.stringify(next);
    if (Buffer.byteLength(raw) > 2 * 1024 * 1024)
      throw new AdminError(
        "The CMS has reached its content size limit. Export and review archived content.",
        413,
      );
    parseContent(raw);
    if (await compareAndSwap(previous, raw)) return next;
  }
  throw new AdminError("Another editor is saving. Reload and try again.", 409);
}
export function assertVersion(
  current: { version: string } | undefined,
  expected: string,
) {
  if ((current?.version || "") !== expected)
    throw new AdminError(
      "This item changed since you opened it. Reload before editing it again.",
      409,
    );
}
