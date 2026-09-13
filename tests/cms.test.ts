import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHmac } from "node:crypto";
import {
  initialContent,
  initializeContent,
  readContent,
  mutateContent,
  assertVersion,
  dataDirectory,
} from "../lib/cms/repository";
import { setLogoStatus } from "../lib/admin/store";
import {
  cropValue,
  newsInput,
  testimonialInput,
  parseContent,
} from "../lib/cms/validation";
import { createSessionValue, sessionIsValid } from "../lib/admin/auth";
import {
  checkOrigin,
  imageForm,
  jsonBody,
  MAX_FORM_BYTES,
} from "../lib/admin/http";
import { videoEmbedUrl } from "../lib/video";
import { rateLimit } from "../lib/admin/rate-limit";

let directory: string;
beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "namma-cms-unit-"));
  Object.assign(process.env, {
    NODE_ENV: "test",
    CMS_LOCAL_DIR: directory,
    CMS_DRIVER: "local",
    ADMIN_PASSWORD: "unit-password",
    ADMIN_SESSION_SECRET: "unit-secret",
  });
  delete process.env.VERCEL;
  await initializeContent(initialContent());
});
afterEach(async () => {
  await rm(directory, { recursive: true, force: true });
});

test("independent simultaneous changes survive optimistic retries", async () => {
  await Promise.all([
    mutateContent((c) => {
      c.clients[0].name = "First edit";
    }),
    mutateContent((c) => {
      c.clients[1].name = "Second edit";
    }),
  ]);
  const state = await readContent();
  assert.equal(state.clients[0].name, "First edit");
  assert.equal(state.clients[1].name, "Second edit");
  assert.equal(state.revision, 2);
});
test("stale edits to the same entity are rejected without overwriting newer content", async () => {
  const first = (await readContent()).clients[0];
  await mutateContent((c) => {
    assertVersion(c.clients[0], first.version);
    c.clients[0].version = "updated";
    c.clients[0].name = "New name";
  });
  await assert.rejects(
    mutateContent((c) => {
      assertVersion(c.clients[0], first.version);
      c.clients[0].name = "Stale name";
    }),
    /changed since/,
  );
  assert.equal((await readContent()).clients[0].name, "New name");
});
test("archive and restore retain URLs and never remove source files or similar client IDs", async () => {
  const state = await readContent(),
    a = state.clients[0];
  const source = path.join(directory, "source.png");
  await writeFile(source, "original");
  await mutateContent((c) => {
    c.clients[0].source = source;
    c.clients.push({ ...a, id: `${a.id}-two`, version: "second", source });
  });
  const archived = await setLogoStatus(a.id, a.version, "archived");
  assert.equal(archived.logo, a.logo);
  assert.equal(await readFile(source, "utf8"), "original");
  assert.equal(
    (await readContent()).clients.find((c) => c.id === `${a.id}-two`)?.status,
    "published",
  );
  const restored = await setLogoStatus(a.id, archived.version, "published");
  assert.equal(restored.logo, a.logo);
  assert.equal(restored.status, "published");
});
test("initialization never replaces existing content and saves keep a previous snapshot", async () => {
  assert.equal(await initializeContent(initialContent([])), false);
  const prior = await readContent();
  await mutateContent((c) => {
    c.clients[0].name = "Changed";
  });
  assert.deepEqual(
    JSON.parse(
      await readFile(path.join(dataDirectory(), "previous.json"), "utf8"),
    ),
    prior,
  );
});
test("corrupt content fails loudly instead of falling back and overwriting it", async () => {
  await writeFile(path.join(directory, "content.json"), "{bad json");
  await assert.rejects(readContent());
  await assert.rejects(
    mutateContent((c) => {
      c.clients = [];
    }),
  );
  assert.equal(
    await readFile(path.join(directory, "content.json"), "utf8"),
    "{bad json",
  );
  assert.throws(() =>
    parseContent(
      '{"schema":2,"revision":0,"clients":[],"news":[],"testimonials":[]}',
    ),
  );
});
test("sessions reject forgery, malformed expiry, extra segments and password rotation", () => {
  const valid = createSessionValue();
  assert.equal(sessionIsValid(valid), true);
  assert.equal(sessionIsValid(`${Date.now() + 3600000}.fake`), false);
  assert.equal(sessionIsValid(valid + ".extra"), false);
  const expiry = "NaN",
    mac = createHmac("sha256", "unit-secret")
      .update(`unit-password\0${expiry}`)
      .digest("hex");
  assert.equal(sessionIsValid(`${expiry}.${mac}`), false);
  process.env.ADMIN_PASSWORD = "rotated-password";
  assert.equal(sessionIsValid(valid), false);
});
test("null and oversized JSON bodies are rejected cleanly", async () => {
  await assert.rejects(
    jsonBody(
      new Request("https://example.test/api", { method: "POST", body: "null" }),
    ),
    /valid JSON object/,
  );
  await assert.rejects(
    jsonBody(
      new Request("https://example.test/api", {
        method: "POST",
        body: JSON.stringify({ text: "a".repeat(130 * 1024) }),
      }),
    ),
    /too large/,
  );
});
test("cross-site writes are rejected", () => {
  assert.doesNotThrow(() =>
    checkOrigin(
      new Request("http://localhost:3000/api", {
        headers: { Host: "127.0.0.1:3000", Origin: "http://127.0.0.1:3000" },
      }),
    ),
  );
  assert.throws(
    () =>
      checkOrigin(
        new Request("https://example.test/api", {
          headers: { Origin: "https://attacker.test" },
        }),
      ),
    /this website/,
  );
  assert.doesNotThrow(() =>
    checkOrigin(
      new Request("https://example.test/api", {
        headers: { Origin: "https://example.test" },
      }),
    ),
  );
});
test("oversized chunked multipart requests are bounded before parsing", async () => {
  const request = new Request("https://example.test/api", {
    method: "POST",
    body: new Blob([Buffer.alloc(MAX_FORM_BYTES + 1)]),
  });
  await assert.rejects(imageForm(request), /under 3 MB/);
});
test("invalid crop ranges and types are rejected", () => {
  for (const crop of [
    "null",
    "{",
    JSON.stringify({ x: -0.1, y: 0, width: 0.5, height: 0.5 }),
    JSON.stringify({ x: 0.9, y: 0, width: 0.5, height: 0.5 }),
    JSON.stringify({ x: "0", y: 0, width: 0.5, height: 0.5 }),
  ])
    assert.throws(() => cropValue(crop));
  assert.deepEqual(cropValue('{"x":0,"y":0,"width":1,"height":1}'), {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  });
});
const post = {
  id: "post-a",
  status: "draft",
  title: "Test article",
  slug: "test-article",
  date: "2026-09-06",
  category: "News",
  excerpt: "",
  body: "",
  coverImage: "",
  coverAlt: "",
  videoUrl: "",
};
test("publishing requires article content and rejects invalid dates, URLs and slugs", () => {
  assert.equal(newsInput(post).status, "draft");
  for (const changes of [
    { status: "published" },
    { date: "2026-02-30" },
    { slug: "../other" },
    { coverImage: "javascript:alert(1)" },
    { videoUrl: "https://attacker.test/youtube.com/watch?v=aqz-KE-bpKQ" },
  ])
    assert.throws(() => newsInput({ ...post, ...changes }));
  assert.equal(
    newsInput({
      ...post,
      status: "published",
      excerpt: "Summary",
      body: "Paragraph one.\n\nParagraph two.",
    }).body.length,
    2,
  );
});
test("testimonials validate names, quotes and display order", () => {
  const entry = {
    id: "testimonial-a",
    status: "draft",
    name: "A",
    company: "B",
    quote: "A useful workplace",
    role: "",
    centre: "",
    order: "0",
  };
  assert.equal(testimonialInput(entry).order, 0);
  assert.throws(() => testimonialInput({ ...entry, order: -1 }));
  assert.throws(() => testimonialInput({ ...entry, quote: "" }));
});
test("only recognized video URLs can become embeds", () => {
  assert.equal(
    videoEmbedUrl("https://youtu.be/aqz-KE-bpKQ"),
    "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
  );
  assert.equal(
    videoEmbedUrl("https://evil.test/youtube.com/watch?v=aqz-KE-bpKQ"),
    null,
  );
});
test("login attempt limit is enforced", async () => {
  const identity = `test-${directory}`;
  await rateLimit("test", identity, 2, 60);
  await rateLimit("test", identity, 2, 60);
  await assert.rejects(rateLimit("test", identity, 2, 60), /Too many attempts/);
});
