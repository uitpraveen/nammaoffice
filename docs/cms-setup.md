> **Historical Vercel CMS proposal, superseded locally.** Use [NammaOffice Studio and VPS operations](./vps-cms.md) for the active implementation. The instructions below are preserved as history and should not be used to configure the new CMS.

# CMS setup and operation

The site now has one staff editor for client logos, news and testimonials. Production content lives in Upstash Redis; Vercel Blob holds immutable image files. Local development works without either cloud service.

**The implementation is ready locally. Production activation still requires a permanent Upstash database, environment configuration, deployment and a one-time import of the current live logos. No production data was changed during development.**

## Hosting and free allowances

This code uses ordinary Next.js Node functions and caching, without a paid Vercel-only feature. However, Vercel restricts Hobby to personal, non-commercial projects. This business/client website does not meet that published usage condition; technical compatibility does not remove the hosting-plan restriction. [Vercel Hobby policy](https://vercel.com/docs/plans/hobby)

Upstash's documented free Redis plan includes 256 MB and 500,000 monthly commands. Create a permanent account-owned free database, not an unclaimed temporary database that expires after three days. Keep eviction disabled: CMS records are persistent content, not disposable cache. [Upstash pricing](https://upstash.com/pricing/redis), [durability](https://upstash.com/docs/redis/features/durability)

No free service provides unlimited usage or a guarantee of zero downtime. A quota already exhausted on Vercel will not be reset by deploying these changes. If Blob is currently unavailable, the existing manifest/images must become accessible again before migration can be verified.

## What fixes the Blob issue

| Operation                                               | Blob advanced operations in the new CMS |
| ------------------------------------------------------- | --------------------------------------: |
| Homepage, news or testimonial read                      |                                       0 |
| Logo preview                                            |                                       0 |
| Save or replace a logo, including its original          |                          2 upload calls |
| Upload a news cover image                               |                           1 upload call |
| Edit news/testimonial text or change publication status |                                       0 |
| Remove or restore a logo                                |                                       0 |

There is no Blob `list()` call in the CMS. There is no manifest rewrite or propagation-polling loop. Public content is cached in Next's persistent Data Cache for an hour as a fallback interval; successful changes invalidate the shared content cache and affected pages. News updates also invalidate the exact old/new article URLs, including previously cached 404s. Warm homepage requests are served from the route cache. Logo/cover images are already processed WebP and bypass repeated Next Image transformations.

Blob still charges separately for file delivery, bandwidth and storage. SDK retries, other applications and dashboard actions can also affect usage. [Vercel Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)

Two conservative application budgets are reserved atomically before any new file upload:

- **500 upload operations per 30-day window**, starting with the first reservation. A logo plus its original reserves two; a news cover reserves one.
- **200 MiB of cumulative new CMS file bytes** per namespace. Originals, replacements and abandoned uploads count because the files remain in storage.

These budgets are implemented in `lib/cms/quota.ts`. They leave headroom below the documented Blob Hobby allowances, but do not measure existing files, other projects or dashboard usage. Do not reset counters or change namespaces to bypass them. When a budget is reached, uploading stops with a clear message; text editing, publication changes and archive/restore do not consume this upload allowance. Failed/ambiguous uploads are not refunded automatically, to avoid undercounting.

Uploads are limited to **3 MiB** and **16 megapixels**. The smaller file limit leaves room for multipart encoding below Vercel's 4.5 MB function payload limit. A request rejected by Vercel before reaching Next cannot be customized by this app. [Vercel payload limit](https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions)

## Production activation

1. Pause edits in the old logo editor during the migration. Save a copy of its live `clients/manifest.json` and back up the Blob artwork. The repository's `clients.json` may be older than the live list.
2. Create a **free Upstash Redis** database in your account, either through Vercel Marketplace or Upstash. Use its read/write REST URL and token, not its read-only token. Keep the region close to the Vercel functions and keep database eviction off.
3. Configure the production environment using [cms.env.example](./cms.env.example):

   | Variable                   | Purpose                                                                                       |
   | -------------------------- | --------------------------------------------------------------------------------------------- |
   | `ADMIN_PASSWORD`           | Long, random staff password; keep the existing one or deliberately rotate it                  |
   | `ADMIN_SESSION_SECRET`     | Independent random signing secret                                                             |
   | `UPSTASH_REDIS_REST_URL`   | Permanent database HTTPS REST endpoint                                                        |
   | `UPSTASH_REDIS_REST_TOKEN` | Server-only read/write credential                                                             |
   | `BLOB_READ_WRITE_TOKEN`    | Existing public image store credential                                                        |
   | `BLOB_MANIFEST_URL`        | Exact existing `clients/manifest.json` public URL; preserves live logos during the transition |

4. Give Preview deployments a separate Blob store/token and namespace. Without an override, Vercel Production uses `nammaoffice:production`, while Preview uses `nammaoffice:preview`. These can share a database's free capacity, but not content keys. Do not copy a custom production `CMS_NAMESPACE` into Preview. Keep the chosen production namespace stable across build and runtime.
5. Run `npm ci`, `npm test`, `npm run lint`, and `npm run build`. Build and runtime must have the same production storage configuration. An existing Blob token without a database document or manifest URL deliberately fails rather than silently dropping live additions. Preview builds also need an appropriate manifest URL if they have a Blob token but have not yet initialized content.
6. Deploy the reviewed changes. The existing production workflow deploys on a push to `main`; do not push unfinished setup there. The workflows now require lint and the CMS regression tests, including real Redis Lua tests.
7. Open `/admin/setup`, sign in, and select **Initialize CMS**. It imports the live manifest into Redis, preserving its image URLs. It performs one metadata check and one manifest fetch, with no Blob listing. If the manifest is still propagating, the import fails safely and asks you to retry. Initialization uses `SET NX` and will never overwrite an existing database document.
8. Confirm the imported client count and names against the saved manifest. Test a small real logo upload, replacement, archive and restore; then publish/unpublish one approved news article and testimonial. Confirm the homepage, article URL and sitemap update. Download a content backup from the setup page.
9. Retain the old manifest and old image files as a migration backup. After successful import, public reads use Redis. Remove `BLOB_MANIFEST_URL` from the production configuration and redeploy once the import is verified; this also prevents an accidentally deleted content key from falling back to the legacy list. Do not use the old deployment's editor: it writes the old Blob manifest, which is no longer authoritative.

Existing signed sessions will need a fresh login because signing now includes the password. Changing the password or signing secret invalidates existing sessions.

## Staff workflow

- **Client logos:** upload, optionally crop, preview and publish. Use **Replace** for an existing client. **Remove** archives it; **Restore** makes it visible again. Original files and previous image URLs are kept.
- **News:** create/edit an article, use plain paragraphs, optionally upload a cover and attach a supported YouTube/Vimeo video. Save as Draft, Published or Archived. The date is an article date; publishing is immediate, not scheduled. Slugs must be unique. Changing the slug removes the old URL; there is no automatic redirect history.
- **Testimonials:** enter the approved quote, person's name, company, optional role/centre and display order. Published testimonials appear on the homepage. Draft/Archived items are hidden.
- **Conflicting edits:** stale edits return a conflict instead of replacing another editor's work. Reload before retrying. Unrelated concurrent updates are retried against the current document.
- **Network interruption:** the controls recover and show an error. Reload before retrying because the first request may already have saved successfully.
- **Backup:** download all content from `/admin/setup`. This JSON includes drafts, archived items and file references; download the referenced files separately for a complete backup.

Uploaded files in the public Blob store have public URLs even if referenced by a draft. Do not upload confidential draft media. Draft text remains in the server-only database and is excluded from public pages.

The editor retains the existing shared staff password model, with full signature checks on protected pages/APIs, same-origin write checks, private/no-store API responses and distributed attempt limits. It does not provide individual accounts, role-based approvals, MFA or an editor audit log.

## Persistence and recovery

Content is one bounded JSON document (maximum 2 MiB; up to 1,000 entries per collection). Updates execute an atomic compare-and-swap Lua script, checking entity versions and retaining one previous document snapshot. Neither document has an expiry. Authoritative reads use `EVAL` to route to Upstash's primary rather than a potentially lagging read replica. [Upstash primary-read guidance](https://upstash.com/blog/replicated-cache-backed-by-redis)

Default production keys:

- `nammaoffice:production:content:v1` — authoritative content.
- `nammaoffice:production:content:v1:previous` — one previous snapshot, not full revision history.
- `nammaoffice:production:blob:operations` — upload reservations with a 30-day expiry.
- `nammaoffice:production:blob:bytes` — cumulative reserved file bytes, no expiry.

A database error is not treated as an empty list. Admin editing fails closed. Previously cached public pages can continue serving during a short outage, but a cold request/build without usable cached content may fail. This is preferable to silently republishing archived clients. Redis free-tier durability is not a replacement for off-service backups.

For recovery, pause staff editing, export the current and previous documents, validate a known-good backup using `parseContent`, then restore through an authorized database operation and redeploy/revalidate public caches. There is deliberately no destructive “replace everything” button. Keep file references intact. For orphan cleanup or storage-budget maintenance, inventory and back up files before deleting anything; archival never deletes files automatically.

A previous application release writes a different source of truth. Rolling application code back is not a content rollback; coordinate data and caching before re-enabling the legacy editor.

## Local development and tests

`npm run dev` uses `.cms/content.json`, `.cms/originals` and `public/images/cms`. These are ignored by Git. On first use the editor starts from committed logos with no sample news/testimonials. The local driver takes precedence even if cloud credentials happen to be present, unless `CMS_DRIVER=redis` is explicitly set. Production never writes local files. The local atomic-write queue assumes one development server; production concurrency uses Redis.

```sh
npm ci
npm test
npm run lint
npm run build
```

`npm test` runs 14 standalone regression tests. Four additional Redis integration tests run when a local test adapter is configured:

```sh
# Terminal 1: a disposable local Redis, not your application database
redis-server --bind 127.0.0.1 --port 16479 --save "" --appendonly no

# Terminal 2
node scripts/redis-rest-test-adapter.mjs

# Terminal 3
CMS_TEST_REDIS_URL=http://127.0.0.1:16480 npm test
```

Each integration test uses its own namespace and deletes only its own keys. The adapter accepts a fixed dummy token and binds only to loopback. The production connector requires HTTPS except for this loopback testing path. CI runs these tests against a disposable Redis service.

Validation during implementation: 18 regression tests passed using a real local Redis engine; 46 local HTTP checks passed; 17 production-mode HTTP checks passed; 10 Chrome browser checks passed, including mobile layout and interrupted requests. A production test verified that 100 warm homepage requests caused **zero database calls**. Previously cached article 404s became visible after publication without a rebuild, and unpublished articles stopped serving. The production build passed with the cloud driver enabled against a local REST adapter. Dependency audit reported zero known vulnerabilities after updating Next.js to 16.3.4 and Sharp to 0.35.4. Live Upstash/Blob credentials, platform CDN propagation and actual account usage still require the production activation checks above.
