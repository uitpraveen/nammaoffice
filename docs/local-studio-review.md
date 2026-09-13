# Morning review — NammaOffice Studio

Open **http://127.0.0.1:3001/admin/login**.

Your generated local administrator credentials are in [the private credentials file](../.local/cms/initial-admin.json). Sign in directly with the email and password, then change the initial password. CMS two-factor authentication is no longer required. Credentials are not committed or copied into this document.

## What is ready

- Individual staff accounts with Administrator, Editor and Author permissions.
- Client logo uploads, optional cropping/padding, processed previews, replacement, display order, archive/trash and restoration.
- Blogs, News, Case Studies and Testimonials, with rich text and reusable media.
- Draft autosave, preview, editorial review, publication, scheduling and revision restoration.
- Public content pages, SEO fields, published-only sitemap entries and redirects for renamed article slugs.
- PostgreSQL storage, a durable background worker and persistent media files, with no Vercel Blob calls in the active CMS.
- Encrypted backup/restore, a local-file content importer and Docker/Caddy preparation for the VPS.

The local review database keeps the repository's **36 existing client logos**. At your request, it now also includes **55 clearly marked fictional demo entries and seven demo accounts** for trying every workflow. See [demo accounts and walkthrough](./demo-studio.md). Live Blob content has not been imported. Automated regression-test fixtures remain in a separate database.

## Verification

Production builds, 87 HTTP checks, 7 browser scenarios, 11 Linux container checks, local import and encrypted backup/restore passed. See the [verification record](./local-studio-verification-2026-09-13.md) for coverage and limits.

## Review in this order

1. Log in and finish Account security setup.
2. Open Client logos, edit one client and upload a replacement. Save as draft and check the homepage still uses the previous published image. Publish and check again. Archive to hide a client; restore as a draft when needed.
3. Add a blog, a news article, a case study and a testimonial. Check preview, published pages and revision history.
4. Invite an author from Team & access. In **Local mail**, open their password link in a private window and verify their limited access. No invitation email is sent during local review.
5. Schedule a news article a few minutes ahead. The dashboard worker indicator should be healthy; publishing needs that worker running.

If localhost is stopped, run `npm run cms:dev` in this repository. Keep the terminal open and the Mac awake while testing. Local content persists across application restarts in `.local/`.

The logo editor now has draggable crop controls, and **Hero promotions** includes 12 additional demo event posters. See [cropping and event-poster instructions](./hero-posters-and-cropping.md).

Read [the operating guide](./vps-cms.md) for roles, storage, backup recovery, repeatable tests and the future migration sequence. [Logo instructions](./managing-client-logos.md) cover the client workflow.

**No commits, pushes, deployment, DNS changes or real CMS emails were made.** The current Vercel site is unaffected. Actual VPS TLS, email delivery, monitoring and a fresh live-content import must be verified during the later staging/cutover step you authorize.

## Latest changes

The original homepage hero has been restored; the normal banner uses 60% of the desktop layout and the poster fills the remaining 40%. In Hero promotions, switch **Image only** to choose between artwork alone and a poster with a text panel. Use **Remove from homepage** to archive it, or set Display until for automatic expiry. Demo priority is 200; other published samples can appear after it is removed. Login uses individual email/password accounts without CMS 2FA. Google sign-in is prepared but requires credentials; see [staff login setup](./staff-login.md). No commit, push or deployment has been made.

The full-width poster takeover was reverted at the owner’s request. Promotions now use the 60/40 layout; image-only mode, removal and automatic expiry remain available. Earlier large-layout screenshots and results describe the superseded design.

Poster editing is available directly after upload: **Edit poster image** retrieves its preserved original. **Poster fit & alignment** controls Auto fit, fixed frames and image positioning. **Preview homepage placement** shows desktop and mobile layouts. Draft changes remain private until publication.
