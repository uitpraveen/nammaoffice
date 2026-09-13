# Local project and CMS audit — 6 September 2026

The logo editor works for ordinary local uploads and removals, but its production storage strategy makes unnecessary Blob operations and has data-integrity issues. Fix those before extending the editor into a team CMS.

This was an assessment, not an implementation or deployment. Application source and existing uncommitted work were preserved. All upload/delete tests ran against an isolated temporary project with dummy admin credentials and no Blob token. Production Blob behavior was tested with an in-memory substitute; no live storage, forms, emails, or deployment were modified. Vercel documentation was consulted to verify operation categories and platform limits. Account usage and the deployed commit were not inspected.

## Project structure and current CMS coverage

- Next.js 16.2.3 App Router, React 19, TypeScript and Tailwind CSS 4. Marketing content is mainly in `lib/data`, with reusable sections in `components/sections`.
- The website includes location pages, booking/registration/service forms, franchise information and policy pages. Forms integrate with Zoho; email support uses Resend. These external submission flows were not exercised.
- `/admin/login` and `/admin/logos` form a custom logo editor. It uses one shared password and a signed, twelve-hour session cookie. Sharp processes uploaded artwork into normalized WebP images; originals are retained on upload.
- Without `BLOB_READ_WRITE_TOKEN`, development writes to `lib/data/clients.json`, `public/images/clients`, and `client-logos`. With a token, the editor uses Vercel Blob for images, originals and `clients/manifest.json`. Production without a token is read-only.
- The local environment has admin credentials configured and no Blob token. Secret values were not printed or copied into the test project.
- There are 36 committed client entries. IDs are unique, every referenced local logo exists, and dimensions are valid.
- `/news` and `/news/[slug]` already have local page designs and four sample posts. They read TypeScript constants, with no editor, persistence API or publishing workflow. Comments anticipate Sanity, but no Sanity integration is installed.
- Local case-study pages contain three fictional examples with sample quotes. These are not a testimonial-management system. There is no dedicated testimonial editor or homepage testimonial section.
- News, case-study pages/data and `VideoEmbed.tsx` are currently untracked. `Header.tsx` also has existing edits. The tracked navigation already links to these routes, although their pages are absent from HEAD. Local route success therefore does not establish that these links work in the deployed version. Placeholder content must be replaced or excluded from publication.

## Validation results

| Check | Result |
|---|---|
| `npx tsc --noEmit --incremental false` | Passed |
| `npm run build` in isolated copy, default Turbopack | Passed; 57 static-generation entries completed |
| `npm run lint` | Failed: 4 existing errors and 9 warnings |
| Public HTTP smoke checks | 39 routes returned 200, including sitemap pages and local news/case-study articles |
| Unknown news article | Correctly returned 404 |
| Production server smoke checks | Homepage, login, news and case studies returned 200; anonymous admin access redirected |
| Authentication API | Correct login accepted; wrong password, missing cookie and forged signature rejected |
| PNG, JPEG, WebP and SVG preview | Passed; previews did not change the manifest |
| Crop API, invalid artwork, missing name | Valid crop accepted; invalid artwork and missing name rejected |
| Save, replace, read back, homepage display and delete | Passed in local development storage |
| Browser | Login and preview passed; network, crop, stale-preview and mobile issues reproduced below |
| Production Blob driver | Operation counts, concurrent-write loss and deletion matching tested with a mocked Blob service |

The production build used no Blob token; its homepage was static. It does not validate live Blob propagation or the rendering/cache behavior of a token-enabled deployment. Local dev used webpack; the production build used the project's default Turbopack.

The four lint errors are synchronous state changes inside effects in `DesktopNav.tsx:122`, `Header.tsx:169`, `DateTimePicker.tsx:104`, and `lib/hooks/use-active-href.ts:36`. CI currently allows lint failures. Runtime also emitted a Next Image warning about hero quality `50` not being included in configured qualities.

## Why Blob advanced operations grow

The public read path is:

`HomePage → getClients() → readClients() → blobManifestUrl() → list()`

See `lib/admin/store.ts:48`, `lib/admin/store.ts:77`, and `lib/data/get-clients.ts`.

Every execution of the Blob-backed reader lists storage to discover the same manifest URL. It then fetches a timestamped URL using `cache: "no-store"`. There is no persistent cache around the storage lookup. With an existing live manifest, that uncached fetch also prevents normal full-route caching of the homepage. Admin page visits and the admin GET endpoint read through the same function.

| Scenario | Locally measured SDK calls |
|---|---|
| 100 public reader executions | 100 `list()` + 100 manifest fetches |
| Save with original, immediately visible manifest | 3 `put()` + 2 `list()` = 5 advanced calls |
| Save with original, stale manifest throughout polling | 3 `put()` + 11 `list()` = 14 advanced calls |
| Delete, immediately visible manifest | 1 `put()` + 4 `list()` = 5 advanced calls, plus file deletion |

These are application-level calls with successful mocked SDK operations, excluding SDK retries and subsequent page visits. They are not measurements of this project's Vercel bill.

Vercel bills `put`, `copy` and `list` as advanced operations. Ordinary image delivery is a different usage category, and `del()` itself is free. The currently documented Hobby allocation includes 2,000 advanced operations; dashboard browsing also consumes operations. If this project is on Hobby, roughly 2,000 uncached reader executions alone could use that allowance. This explains how usage can grow even when staff rarely upload logos. [Vercel Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)

**First correction:** store the known manifest URL rather than discovering it on every read, cache public content reads with explicit invalidation after changes, and separate public cached reads from authoritative write-time reads. Eliminate listing within propagation polling. Use immutable image URLs on replacements. Caching alone does not fix concurrent updates to the manifest.

## Findings to fix before CMS expansion

### High priority: storage and access

1. **Concurrent saves can lose a client's change.** `saveLogo` and `removeLogo` read and rewrite the entire manifest without a transaction or version check (`lib/admin/store.ts:172`). In a local simulation, two simultaneous additions both completed but only the second remained. Use transactional content records or conditional writes with conflict handling; a process-local lock is insufficient across Vercel instances.

2. **Deletion matches other clients' original files.** `removeLogo` lists `clients-source/${id}` and deletes every result (`lib/admin/store.ts:185`). Removing `acme` also matched and deleted `acme-two.png` in the mock. Match exact source keys and store source references explicitly. The five-result limit also means cleanup can be incomplete.

3. **A failed save can still overwrite artwork.** Image and original uploads happen before the strict manifest read (`lib/admin/store.ts:141`, `:172`). A forced read failure showed both files had already been written, while the API reports “nothing was saved.” Upload to new immutable keys and publish the reference only after a successful authoritative content update, with cleanup of unreferenced uploads.

4. **Admin page authentication is incomplete.** The proxy only checks a cookie timestamp; the page performs no signature verification (`proxy.ts:20`, `app/admin/logos/page.tsx:9`). A future timestamp with a fake signature returned the editor HTML with HTTP 200. The API correctly returned 401, so this did not permit edits. Verify sessions at the protected page/layout as well as the API. Before expanding to team publishing, address the absence of application-level login throttling and individual staff identities; any external firewall protection was not inspected.

### Upload and editor behavior

5. **The advertised 12 MB limit is not supported end to end.** Locally, a 12 MiB-plus upload returned 500 before the application size check: Next's proxy truncates buffered bodies at its default 10 MB, and `request.formData()` is outside error handling (`app/api/admin/logos/route.ts:28`). Vercel Functions additionally impose a 4.5 MB payload limit, so larger uploads can fail in production even if local processing succeeds. Choose a conservative server-upload limit below that envelope, or redesign for direct uploads plus processing. Update client validation and the guide together. [Vercel payload limit](https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions)

6. **Network errors leave the editor stuck.** The browser's preview request was deliberately aborted; “Processing…” remained, with no application error message. Save, delete and login likewise lack `try/catch/finally` around fetch (`components/admin/LogoManager.tsx:60`, `:83`; `LoginForm.tsx:29`). Restore controls on failure and give a retryable message.

7. **The approved preview can differ from the saved result.** Changing the name or crop leaves “Add to wall” enabled with the old preview. Saving processes current inputs. Invalidate the preview whenever its inputs change and guard against late responses overwriting newer input state.

8. **Crop coordinates include empty display space.** A square source appeared inside a 571 × 256 element with `object-contain`; the actual square image occupied only 256 × 256. Coordinates are calculated against the whole container and sent as source-image fractions (`components/admin/LogoManager.tsx:264`, `:295`). Account for the displayed image rectangle when mapping a drag.

9. **Replacing artwork may show an older image.** Saves overwrite a fixed image URL. The propagation check compares only client IDs, so an image-only replacement can pass while content is stale (`lib/admin/store.ts:119`). The mock reproduced that early return. Vercel documents up to 60 seconds of cache propagation for overwrites. Use immutable/versioned image references and content revisions. Actual CDN delay was not tested. [Vercel Blob caching](https://vercel.com/docs/vercel-blob)

10. **Malformed inputs and mobile layout need cleanup.** JSON `null` causes 500s in login and delete handlers. Crop JSON is parsed without shape/range validation. On a 390 px viewport the editor document measured 439 px wide because cards overflowed. Same-slug uploads silently replace an existing logo; provide an explicit replacement action or warning. Names consisting entirely of Tamil characters produce an empty slug and are rejected.

### Recovery and publishing

11. **The removal guide promises recovery that is not implemented.** `docs/managing-client-logos.md:75` says nothing is destroyed. Local removal deleted the original file during testing; production code deletes both uploaded artwork and originals. There is no restore UI. Implement archive/restore or accurately document permanent removal.

12. **A storage outage can show older content without an error.** Rendering and the admin list silently fall back to the committed JSON. Removed clients can reappear and newly added ones can disappear. Prefer a last-known-good public snapshot, while the editor should distinguish storage failure from the authoritative live list. Strict writes already avoid one fallback-related data-loss scenario, but do not solve stale reads or concurrent writes.

13. **Publishing integration is unfinished.** News and case-study routes are absent from the sitemap. The legacy `/newsinsights` redirect still points home. Admin metadata inherits indexing permission, and robots only disallows `/api/`. Add proper publication-dependent sitemap entries, update redirects, and set admin pages to `noindex` as part of the CMS work.

## Proposed CMS scope

Use one staff content area with these three content types. Keep longer case studies optional and separate from short testimonials.

| Content | Fields and controls |
|---|---|
| Client logos | Stable ID, client name, image, original reference, alt text, optional website, display order, published/archived state; preview, replace and restore |
| News | Title, unique slug, summary, article body, cover image/alt text, category, author, publication date, optional video, SEO fields; draft, preview, publish, edit and unpublish |
| Testimonials | Quote, person's name, role, company/client relation, optional photo/logo, optional centre, display order and featured flag; draft, preview, publish, edit and unpublish |

The frontend can reuse the local news layouts after placeholder data is removed. Add a reusable testimonial section to the intended public pages. Content reads should be cached, with affected public pages and sitemap invalidated on publication. Staff edits should use reliable structured persistence with conflict handling and revisions; files belong in asset storage. Avoid expanding the current single mutable Blob manifest into the store for all CMS content.

Suggested order: correct Blob read usage and unsafe writes; harden and retest the existing editor; then implement the shared CMS and connect real news/testimonial content. A CMS vendor or account was not selected or provisioned during this audit.
