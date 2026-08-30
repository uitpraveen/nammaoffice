# Managing the client logos

The row of client logos on the NammaOffice home page can be updated without a
developer. This page explains how.

**Where:** https://nammaoffice.com/admin/logos
**Password:** ask Praveen. It is shared, so please do not forward it outside
the team.

---

## Before you start: the logo file matters

The page trims each logo, removes its background and sizes it to match the
others automatically. What it cannot do is invent detail that is not in the
file you give it.

**Ask every client for one of these:**

- an **SVG** file (best, works at any size)
- a **PNG with a transparent background**
- failing those, the largest **JPG** they have, at least 1000 pixels wide

**Do not use** a screenshot, a photo of a business card, or a logo copied from
a website. Those are small and blurry, and no amount of processing fixes it.
About a third of the logos currently on the wall are slightly soft for exactly
this reason.

If a file is too small, the page will tell you before you publish.

---

## Adding a logo

1. Go to https://nammaoffice.com/admin/logos and enter the password.
2. Under **Add a logo**, click **Choose file** and pick the logo.
3. Check the **Client name**. It fills in from the file name, so tidy it up:
   this is what people see when they hover over the logo, and what a screen
   reader reads out. Write it the way the client writes it, for example
   `payAgri`, not `Payagri`.
4. Click **Preview**.
5. Look at **How it will look on the wall**. Your logo appears between two
   real neighbours, at the real size, on the real background. If it looks
   right there, it will look right on the site.
6. Click **Add to wall**.

The home page updates within a minute or two. Refresh
https://nammaoffice.com to see it.

### If the preview looks wrong

**Too much empty space around it, or part of another image crept in**
Drag a box on the uploaded image to keep only the part you want, then press
**Preview** again. Use **Clear crop** to start over. This is worth doing when
the file has a strapline you do not want, a border, or two logos side by side.

**A warning appears saying the artwork was enlarged**
The file is smaller than the wall needs, so the logo will look soft. It will
still publish, but ask the client for a bigger file when you can.

**The background did not come off**
Some artwork has a coloured panel that is genuinely part of the logo, like
Vi's red square or Corefactors' black bar. Those are kept on purpose. If a
plain white background survived, the file probably has a faint border or
shadow: crop just inside it and try again.

---

## Removing a logo

Scroll to **On the wall now**, find the client, click **Remove**, confirm.

The home page updates within a minute or two.

Removing is reversible: nothing is destroyed, so ask a developer if you take
one off by mistake.

---

## Things worth knowing

**The order is alphabetical and set automatically.** Logos are spread across
the three scrolling rows for you; there is nothing to arrange.

**Every logo is the same visual size.** Not the same height: a square badge
and a long wordmark are balanced so neither dominates. That is why a logo may
look smaller or larger here than it does on the client's own website.

**Nothing else on the site can be changed from this page.** It only touches
the client logo row.

**Signing in lasts 12 hours,** then you enter the password again.

---

## If something goes wrong

- **The password is not accepted** — check for a trailing space when pasting.
- **The upload fails** — the file may be over 12MB. Ask for a smaller one.
- **"That image could not be processed"** — the file is probably corrupt or is
  not really an image. Ask the client to resend it.
- **The logo does not appear on the home page after a few minutes** — tell
  Praveen. The list is safe; it is only the published page that lags.

---

## For developers

**In production the admin page is the source of truth.** Logos added through
it live in a Vercel Blob store, along with the list itself.

`lib/data/clients.json` in the repository is a fallback, used only if Blob is
unreachable, so that the wall degrades to an older list rather than rendering
empty. Keep it roughly current: regenerate with
`python3 scripts/build-client-logos.py`, which rebuilds it and the images in
`public/images/clients/` from the artwork in `client-logos/`. That script does
not run in CI, because its output would not match what the admin page has
saved.

Locally there is no Blob token, so the admin writes plain files into the
repository instead: exactly the changes you would commit by hand. Do not copy
the production Blob token into `.env.local`, or your dev server will edit the
live site.

Do not hand-edit `lib/data/clients.ts`; it only declares the types.
