import { createHash } from "node:crypto";
import { AdminError } from "./errors";
import { namespace, redisCommand } from "@/lib/cms/redis";
import { localStorage } from "@/lib/cms/repository";
const counts = new Map<string, { count: number; until: number }>();
const SCRIPT = `local n = redis.call('INCR', KEYS[1])
if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return n`;
export async function rateLimit(
  scope: string,
  identity: string,
  limit: number,
  seconds: number,
) {
  const hash = createHash("sha256").update(identity).digest("hex").slice(0, 32);
  const key = `${namespace()}:limit:${scope}:${hash}`;
  let count: number;
  if (localStorage()) {
    const now = Date.now();
    for (const [k, v] of counts) if (v.until <= now) counts.delete(k);
    const item = counts.get(key) || { count: 0, until: now + seconds * 1000 };
    item.count++;
    counts.set(key, item);
    count = item.count;
  } else count = await redisCommand<number>(["EVAL", SCRIPT, 1, key, seconds]);
  if (!Number.isSafeInteger(count) || count < 1)
    throw new Error("Invalid rate limit response");
  if (count > limit)
    throw new AdminError(
      "Too many attempts. Please wait a few minutes and try again.",
      429,
    );
}
