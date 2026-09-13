# Logo cropping and homepage event posters

Both features are available locally at **http://127.0.0.1:3001/admin**. Nothing has been committed, pushed or deployed. Use an editor or administrator account from the [demo account guide](./demo-studio.md).

## Crop and set a client logo

1. Open **Client logos**, choose a client and select **Choose artwork** or **Replace artwork**. For an existing image, use **Adjust crop** to retrieve its preserved original.
2. Select **Crop the original**. Drag a corner to resize the selection; drag inside it to move the selection. Square, wide-logo, landscape and portrait presets are available. Reset returns to the full image.
3. You can focus the selection or a corner and use arrow keys; Shift increases the movement. Expand **Precise crop coordinates** to enter percentages if needed.
4. Adjust padding and optionally trim unused border space. Light/dark slot previews show how the logo fits. Padding is proportional to the actual resized artwork, including small source images.
5. Press **Prepare image**. This processes the original server-side and shows the actual saved output. Inspect it, choose **Use this image**, then **Publish changes** when ready.

Cropping saves a new processed image/version; the original and previous published artwork remain available. Changing a crop only changes the draft until publication. The processor checks crop bounds, file contents, dimensions and size. Logos retain their aspect ratio and are not stretched or automatically stripped of backgrounds. The media library also offers **Adjust crop**; that creates reusable artwork, which you then select in a content draft.

## Publish an event poster in the hero

Open **Hero promotions → Add hero promotion**.

- Enter an internal event title. Leave **Image only** off for a poster with a readable event text panel, or turn it on to display only the artwork. In image-only mode, include the event details in the accessible poster description.
- Choose the main poster and, optionally, separate mobile artwork. Supply an accessible poster description. The two versions should communicate the same event.
- Set **Display from** if it should start later; leave it blank for immediate eligibility after publication. **Display until is required**, so an event cannot remain featured indefinitely by accident. Dates use your device's timezone.
- Optionally enter a button label and complete URL. In image-only mode the URL makes the artwork clickable; leave it blank for a plain image.
- Use **Priority** to resolve overlaps. Higher values win; equal values use the most recently published eligible poster, with a stable ID tie-breaker.
- Switch between **Desktop preview** and **Mobile preview**, review the result and publish. The original photo carousel, headline and booking buttons remain visible. The desktop content area is split 60% for the normal banner and 40% for the poster, with a small gap between them; the poster uses the full width of its column. On phones it appears below the headline. Auto fit shows the whole image using its original proportions, without stretching it. With a text panel, **View full poster** opens the prepared artwork separately.

Use **Remove from homepage** in the Publishing panel to archive a poster immediately, or move it to trash. Other eligible promotions can then appear; the normal hero returns when none remain. Existing browser tabs update on reload, while expiry also works automatically in an open tab.

### Edit an uploaded poster and set its placement

- **Edit poster image** or **Edit mobile image** reopens that file’s preserved original. Crop it, prepare the result and choose **Use this image**. This creates a new prepared version; the original and the currently published artwork are preserved.
- **Poster frame → Auto** uses the image’s own proportions and fits it inside the full poster column. Landscape images will naturally be shorter than portrait posters. Auto never stretches artwork or guesses which text can be cut off.
- Choose **Portrait**, **Square** or **Landscape** for a fixed frame. **Show the full image** keeps all content visible; **Fill the frame** crops overflowing edges. Horizontal/vertical sliders adjust the position where there is spare space or cropped artwork.
- **Auto fit & centre** resets the frame, fit and positioning. Frame/alignment changes do not re-upload or reprocess an image. The same settings apply to the selected desktop and mobile artwork.
- Use **Preview homepage placement** to see the normal banner and draft poster together; switch to the phone layout inside the preview. **Publish changes** applies your saved draft to the public site.

Publishing approves a poster; its display dates decide when it appears. Usually, publish now and use Display from/until to control the event window. The existing Schedule publication control can be used to defer approval/publication itself, but must be set before the display end date.

Each homepage request chooses one eligible published poster. Drafts, future display windows, expired posters, archived entries and trash are excluded. If no poster qualifies, the normal homepage hero returns. The end-date rule runs in the public query and does not depend on the background worker. A timer also removes an expired poster from an already-open page, returning that page to its normal hero; reloading selects any next eligible promotion. Newly starting promotions appear on the next homepage load.

Editors and administrators can manage promotions. Authors cannot list, create, edit or publish them. Draft changes leave the last published poster intact. Revision restore, archiving, trash and optimistic concurrency protection work the same way as the rest of Studio. The media library protects both main and mobile artwork referenced by content or its history.

Published files can remain accessible by their direct image URL, and visitors may have downloaded/cached them. The display end date removes the promotion from the homepage; it is not a file-revocation mechanism.

## Local examples and verification

Twelve clearly marked fictional demo promotions have been added, including draft, review, published, live-with-draft-changes, scheduled, live-with-scheduled-changes, archived, trash, restored and expired examples. See `.local/demo-promotions.json` for editor links. An additional **DEMO community open house** now shows the larger image-only hero, with separate wide desktop and portrait mobile artwork. Its priority is **200**; give your own local test poster priority **201** to take over, or archive the active demo promotions first. There are 13 promotion samples in total. The original 55 demo entries and existing logos were preserved.

`node --import tsx scripts/studio/demo-promotions.ts` adds missing examples locally without overwriting existing entries. It refuses production mode, remote connections and real-mail mode. A private encrypted backup was taken before adding the schema and content.

Database updates are ordered SQL migrations, recorded once under a transaction/advisory lock. `cms:setup` and the isolated verification environment both run the same migration runner. Existing data is preserved when adding the promotion content type.

The automated suite covers crop movement/bounds/aspect presets, selected output pixels, small-logo padding, re-cropping the preserved original, unpublished/public image separation, promotion permissions and validation, display windows, priority, expiry/fallback, mobile source selection, editor publication and expiry in an open browser. Run `npm test` and `npm run cms:verify` to repeat the checks against a separate local test database.

## Earlier verification result

The production build, 112 API/workflow checks and all 10 browser scenarios passed. The unit suite passed 28 tests; four optional legacy Redis tests were skipped. Lint has zero errors and eight existing non-CMS warnings. Desktop and mobile hero layouts were captured and inspected locally. These checks used a separate verification database; the review portal keeps its demo content and accounts.

The subsequent larger-hero update adds coverage for full desktop width, image-only display, optional image links, mobile overflow and removal through the admin portal. See the latest `.local/verification-result.json` after running `npm run cms:verify`.

## Larger poster and login update verification

The production build and 112 HTTP checks passed, along with 11 Google access-policy checks using local signed-token fixtures and all 11 browser scenarios. The unit suite passed 30 tests with four optional legacy Redis tests skipped. TypeScript and targeted lint passed. The original local administrator signed in directly without 2FA. Desktop/mobile screenshots are `.local/large-hero-desktop.png` and `.local/large-hero-mobile.png`. Real Google Cloud login remains pending OAuth credentials; no external email was sent.

The image-only sample can be added idempotently with `node --import tsx scripts/studio/demo-featured-poster.ts`; it preserves any existing sample and refuses remote or production environments. Its editor link is in `.local/demo-featured-poster.json`.

The full-width poster takeover was reverted at the owner’s request. Promotions now use a 60/40 split beside the original banner; image-only mode, removal and automatic expiry remain available. Earlier large-layout screenshots and results describe the superseded design.

## Current 60/40 layout verification

The production build, 112 HTTP checks, 11 Google policy checks with local signed-token fixtures and all 12 browser scenarios passed. Unit tests: 32 passed, four optional legacy Redis tests skipped. The browser suite now covers editing an uploaded poster, preserving its original, keeping draft crop/alignment changes private, previewing placement, publishing a fixed frame and resetting to Auto fit. A locked-aspect crop resize issue found during testing was fixed and regression-tested. Desktop proportions and mobile overflow were also checked on the main local site. Screenshots: `.local/hero-60-40-desktop.png` and `.local/hero-60-40-mobile.png`. No commit, push or deployment was performed.
