import { AdminError } from "@/lib/admin/errors";

export const redisConfigured = () =>
  Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
export const namespace = () =>
  process.env.CMS_NAMESPACE ||
  `nammaoffice:${process.env.VERCEL_ENV || "development"}`;
export async function redisCommand<T>(
  command: (string | number)[],
): Promise<T> {
  if (!redisConfigured())
    throw new AdminError(
      "Configure the CMS database before editing content.",
      503,
    );
  const url = new URL(process.env.UPSTASH_REDIS_REST_URL!);
  if (url.protocol !== "https:" && url.hostname !== "127.0.0.1")
    throw new Error("CMS database requires HTTPS");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("CMS database unavailable");
  const body = await response.json();
  if (
    !body ||
    typeof body !== "object" ||
    !Object.prototype.hasOwnProperty.call(body, "result") ||
    body.error
  )
    throw new Error("CMS database command failed");
  return body.result as T;
}
