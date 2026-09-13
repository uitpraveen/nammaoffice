import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  initialContent,
  initializeContent,
  readContent,
  mutateContent,
  assertVersion,
} from "../lib/cms/repository";
import { namespace, redisCommand } from "../lib/cms/redis";
import { reserveAssets } from "../lib/cms/quota";

const enabled = Boolean(process.env.CMS_TEST_REDIS_URL);
beforeEach(async () => {
  if (!enabled) return;
  const url = new URL(process.env.CMS_TEST_REDIS_URL!);
  assert.equal(
    url.hostname,
    "127.0.0.1",
    "Integration tests only target a local Redis REST adapter",
  );
  Object.assign(process.env, {
    CMS_DRIVER: "redis",
    CMS_NAMESPACE: `cms-regression:${randomUUID()}`,
    UPSTASH_REDIS_REST_URL: url.href,
    UPSTASH_REDIS_REST_TOKEN:
      process.env.CMS_TEST_REDIS_TOKEN || "local-redis-test-token",
  });
  await initializeContent(initialContent());
});
afterEach(async () => {
  if (enabled)
    await redisCommand([
      "DEL",
      `${namespace()}:content:v1`,
      `${namespace()}:content:v1:previous`,
      `${namespace()}:blob:operations`,
      `${namespace()}:blob:bytes`,
    ]);
});
test(
  "Redis Lua transaction preserves simultaneous independent changes",
  { skip: !enabled },
  async () => {
    await Promise.all([
      mutateContent((c) => {
        c.clients[0].name = "Redis first";
      }),
      mutateContent((c) => {
        c.clients[1].name = "Redis second";
      }),
    ]);
    const content = await readContent();
    assert.equal(content.clients[0].name, "Redis first");
    assert.equal(content.clients[1].name, "Redis second");
    assert.equal(content.revision, 2);
  },
);
test("Redis rejects stale entity versions", { skip: !enabled }, async () => {
  const version = (await readContent()).clients[0].version;
  await mutateContent((c) => {
    assertVersion(c.clients[0], version);
    c.clients[0].version = randomUUID();
  });
  await assert.rejects(
    mutateContent((c) => {
      assertVersion(c.clients[0], version);
    }),
    /changed since/,
  );
});
test(
  "upload operation reservation is atomic and limited to 500 per window",
  { skip: !enabled },
  async () => {
    await reserveAssets(499, 100);
    const attempts = await Promise.allSettled([
      reserveAssets(1, 100),
      reserveAssets(1, 100),
    ]);
    assert.equal(attempts.filter((a) => a.status === "fulfilled").length, 1);
    assert.equal(
      await redisCommand(["GET", `${namespace()}:blob:operations`]),
      "500",
    );
    assert.ok(
      (await redisCommand<number>(["TTL", `${namespace()}:blob:operations`])) >
        2591900,
    );
  },
);
test(
  "image byte budget rejects before increasing either reservation",
  { skip: !enabled },
  async () => {
    await reserveAssets(1, 200 * 1024 * 1024);
    await assert.rejects(reserveAssets(1, 1), /storage allowance/);
    assert.equal(
      await redisCommand(["GET", `${namespace()}:blob:operations`]),
      "1",
    );
  },
);
