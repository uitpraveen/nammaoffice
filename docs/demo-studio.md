# Explore the local demo CMS

Open **http://127.0.0.1:3001/admin/login**. Seven demo accounts and 55 fictional content entries have been added to the existing review database. The original repository logos and your existing accounts/content are preserved. Everything remains local.

Passwords are generated individually and saved only in [`.local/demo-accounts.json`](../.local/demo-accounts.json). Use separate browser profiles/private windows to compare roles; signing in as a second user in the same browser replaces that browser's session.

| Account | Role and suggested test |
| --- | --- |
| `admin.demo@nammaoffice.local` | Administrator: manage the team, roles and audit history |
| `editor.demo@nammaoffice.local` | Editor Meera: view all content and review/publish author submissions |
| `editor2.demo@nammaoffice.local` | Editor Arjun: compare concurrent editing in a separate browser |
| `author.demo@nammaoffice.local` | Author Kavya: write/edit only her own blogs, news and case studies; submit for review |
| `author2.demo@nammaoffice.local` | Author Rohan: verify he cannot open Kavya's private editor or manage her media |
| `disabled.demo@nammaoffice.local` | Disabled account: sign-in is rejected; an administrator can enable it |
| `invited.demo@nammaoffice.local` | Invitation example: use the password link in the administrator's Local mail outbox |

These `.local` addresses are fictional development accounts, not actual Gmail/Google identities. CMS two-factor authentication has been removed. The seed does not change your original administrator password or enable public registration. Invitation links expire; use **Password link** in Team & access to generate a fresh local invitation if necessary.

## Content scenarios

Each of Client logos, Blogs, News, Case Studies and Testimonials has **11 demo entries**. Search for `demo`, or inspect [the private content index](../.local/demo-content.json), which includes direct editor links, owners and the scheduled timestamp.

| Label in sample title | What to inspect |
| --- | --- |
| `draft` | Private, unpublished content |
| `review` | Author submission waiting for an editor |
| `published` | Visible on the public website |
| `live-draft` | Public version plus a different unpublished draft; public content stays unchanged |
| `scheduled` | Private until its scheduled date |
| `live-scheduled` | Existing public version plus a future scheduled replacement |
| `archived` | Hidden from the public website, retained in the normal admin list |
| `trash` | Hidden from public and normal admin list; choose **View trash** |
| `restored` | Previously trashed content restored as a private draft, ready for review |
| `published-two`, `published-three` | Extra published examples to populate public grids and sections |

Scheduled samples are initially set about 30 days ahead so they do not change while you review. To test automatic publication, edit a scheduled sample, save it, then schedule it a few minutes ahead. Editing cancels the old schedule. Keep the worker running; its health appears on the dashboard.

Articles have formatted paragraphs, headings, lists, quote blocks and demo cover artwork. Case studies also have a challenge, solution, results, illustrative metrics and a gallery. All invented company names, testimonials and figures are explicitly marked as demo content. They should not be imported to production.

The media library includes reusable artwork, an unused private image, a trashed image that can be restored, and a **clearly marked simulated failure** whose preserved original can be processed using Retry. Queued/processing states are temporary: upload a new image to see them while the real worker runs. The seed does not stop the worker or leave permanently stuck jobs.

## Walk through an author/editor handover

1. Sign in as Kavya and open her `review` blog or create a new draft. She has no publishing button or team-management permission.
2. In another browser, sign in as Meera. Open the same story, review it, then publish. Check `/blogs` and the article page.
3. Return to Kavya's browser and reload before editing, since Meera changed the version. Save an edit; the public page retains its published snapshot.
4. Sign in as Arjun in another browser and edit the same entry. Try saving from a stale editor to see the conflict protection.
5. As administrator, inspect the audit log, change a demo user's role or disable the account, then verify that its existing session is revoked.

An editor can publish all content but cannot invite staff or change roles. An administrator has editor capabilities plus team controls. Two authors can only edit their respective own content.

## Verification

235 checks passed against these local samples, covering all 55 entries' ownership/publication/workflow/trash flags, separate staff logins, rejected disabled login, author ownership, editor/team restrictions, the then-current administrator MFA enforcement (retired in the subsequent login update), and public article rendering. TypeScript and lint for the demo script also passed. The private result is in `.local/demo-verification.json`.

## Re-running the seed

Run `node --import tsx scripts/studio/demo.ts` with the local app/worker running. It refuses production mode, remote databases/origins and nonlocal mail. It uses stable demo IDs, preserves existing entries and credentials, and does not overwrite edits or republish content you have changed. It is an additive seed, not a reset command. A private encrypted backup was made before loading the first demo records.

The previous morning-review guide's statement that editorial sections were empty describes the initial delivery; this demo population supersedes that statement.

## Email delivery and company access

Invitation/password-reset delivery is already implemented through Resend. During local review `CMS_MAIL_MODE=local` writes to the private outbox; no real emails are sent. Activating delivery requires an approved sender, its verified sending domain and a server-side API key. See [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction).

**Google sign-in and transactional email are separate integrations.** Google sign-in needs OAuth credentials and registered callback URLs. Company Google Workspace access should validate Google's hosted-domain claim; specific consumer Gmail accounts instead need an exact approved-address list. A name substring, the `@gmail.com` domain alone, or only Google's account-selection hint is not sufficient. See [Google's OpenID Connect documentation](https://developers.google.com/identity/openid-connect/openid-connect) and [Better Auth's Google provider](https://better-auth.com/docs/authentication/google).

Google and password login are now implemented. The exact allowed company domain/addresses and OAuth credentials are awaiting configuration. No domain has been guessed and Google login has not been activated. Existing access remains invitation-only, using individual email/password accounts and server-side role checks. Belonging to an allowed domain should still require an administrator-approved staff account and role; it should never automatically grant administrator access.

## Homepage event poster examples

An additional 12 demo hero promotions are now available under **Hero promotions**, including an expired example. See [poster and cropping instructions](./hero-posters-and-cropping.md). These are in addition to the original 55 content examples; only editors and administrators can manage them.

For current password/Google setup, see [staff login](./staff-login.md). The older demo verification above is a historical record; current checks are in `npm run cms:verify`.
