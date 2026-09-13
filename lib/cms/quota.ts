import { AdminError } from "@/lib/admin/errors";
import { localStorage } from "./repository";
import { namespace, redisCommand } from "./redis";

export const RESERVE_ASSETS_SCRIPT = `local ops = tonumber(redis.call('GET', KEYS[1]) or '0')
local bytes = tonumber(redis.call('GET', KEYS[2]) or '0')
if ops + tonumber(ARGV[1]) > tonumber(ARGV[3]) then return 0 end
if bytes + tonumber(ARGV[2]) > tonumber(ARGV[4]) then return -1 end
redis.call('INCRBY', KEYS[1], ARGV[1])
if ops == 0 then redis.call('EXPIRE', KEYS[1], 2592000) end
redis.call('INCRBY', KEYS[2], ARGV[2])
return 1`;
export async function reserveAssets(operations: number, bytes: number) {
  if (localStorage()) return;
  // Conservative application budgets leave headroom for the existing store,
  // dashboard activity, retries and other consumers of account-wide quotas.
  // Reservations are deliberately not refunded after ambiguous network errors.
  const outcome = await redisCommand<number>([
    "EVAL",
    RESERVE_ASSETS_SCRIPT,
    2,
    `${namespace()}:blob:operations`,
    `${namespace()}:blob:bytes`,
    operations,
    bytes,
    500,
    200 * 1024 * 1024,
  ]);
  if (outcome === 0)
    throw new AdminError(
      "The CMS upload allowance is reached for this 30-day period. Existing content and text editing still work. Ask the developer to review storage usage.",
      429,
    );
  if (outcome === -1)
    throw new AdminError(
      "The CMS image storage allowance is reached. Existing content and text editing still work. Ask the developer to back up and review unused images.",
      413,
    );
  if (outcome !== 1) throw new Error("Invalid upload reservation response");
}
