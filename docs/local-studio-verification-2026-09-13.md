# Local verification — 13 September 2026 (IST)

The application was implemented and checked locally on Praveen's Mac. No commit, push, remote deployment, DNS change or real CMS email was performed. The existing working tree already contained changes from the earlier CMS work; those were preserved. The active Studio uses PostgreSQL and persistent local media, superseding the old shared-password/Blob endpoints.

| Check | Result |
| --- | --- |
| Production Next.js standalone build | Passed on native Node 22 and Linux Docker Node 24 |
| TypeScript | Passed (`tsc --noEmit`) |
| Unit/security/image tests | 24 passed; 4 optional legacy Redis tests skipped |
| Production-mode HTTP checks | **87 passed** |
| Chromium browser scenarios | **7 passed**, including complete invitation acceptance/password setup |
| Linux container workflow checks | **11 passed**, including a stopped/restarted worker and persisted published content after web restart |
| Local-file import | Validation, image processing, publication and duplicate-free retry passed |
| Native encrypted backup/restore | Restored 36 entries and 36 media folders into a separate database/directory |
| Container encrypted backup/restore | Restored into a separate native PostgreSQL database; published content and all ready artwork verified |
| Lint | 0 errors; 8 existing warnings in non-CMS files |
| Production dependency audit | 0 reported vulnerabilities at verification time |
| Desktop/mobile review | Captured and inspected; 390 px browser checks found no page overflow |
| Main review environment | 36 repository logos, healthy worker, HTTP 200 for homepage, admin login, Blogs, News, Case Studies and health endpoint |
| Secret handling | Local credentials, environment files, test accounts and backups are ignored by Git and excluded from Docker build context |

The HTTP/browser checks cover server-side authorization, author ownership, public signup blocking, mandatory administrator MFA, disabled-user rejection and session revocation, last-admin protection, CSRF, unsafe rich text/SVG, invalid uploads/crops, duplicate uploads, private media, publication boundaries, concurrency conflicts, slug redirects, scheduled publication, history restoration, trash/archive, all requested content kinds, local invitations, one-use reset tokens, mobile layout, network-failure recovery and logout.

Application issues found during testing were corrected and the final production-mode suite was rerun successfully. Browser artifacts are private under `.local/studio-desktop.png`, `.local/studio-logos.png`, `.local/studio-mobile.png` and `playwright-report/`. Machine-readable outcomes are in `.local/verification-result.json`, `.local/container-verification.json`, `.local/import-verification.json`, `.local/restore-verification.json` and `.local/container-backup-verification.json`.

The review app runs at **http://127.0.0.1:3001/admin/login** using the dedicated local database. The temporary verification server and Docker services were stopped after verification; their databases, volumes and encrypted backup artifacts were retained. Restart the main app with `npm run cms:dev` if needed. See [morning review](./local-studio-review.md) and [VPS operations](./vps-cms.md).

## Limits of these results

The live Blob store was not accessed or imported; the local 36-logo seed may differ from current production. Real email delivery, VPS DNS/TLS, off-server backups, monitoring and traffic/load capacity need staging verification on the actual VPS. This work does not change current Vercel quota usage or the deployed site. A single VPS has finite resources and is not a guarantee of uninterrupted availability. Existing non-CMS lead/booking form delivery was outside this CMS test run.
