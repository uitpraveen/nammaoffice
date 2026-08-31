import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, sessionIsValid } from "@/lib/admin/auth";
import { processLogo, toSlug, CANVAS_H, type Crop } from "@/lib/admin/process-logo";
import { canWrite, readClients, removeLogo, saveLogo } from "@/lib/admin/store";

/** The proxy checks the cookie cheaply; this verifies the signature properly. */
async function authed() {
  const jar = await cookies();
  return sessionIsValid(jar.get(SESSION_COOKIE)?.value);
}
const denied = () => NextResponse.json({ error: "Not signed in." }, { status: 401 });

export async function GET() {
  if (!(await authed())) return denied();
  return NextResponse.json({ clients: await readClients(), canWrite });
}

/**
 * Processes an uploaded logo. With `preview: true` it returns the result as a
 * data URL without saving, so the page can show exactly what will land on the
 * wall before anyone commits to it.
 */
export async function POST(request: Request) {
  if (!(await authed())) return denied();

  const form = await request.formData();
  const file = form.get("file");
  const name = String(form.get("name") || "").trim();
  const preview = form.get("preview") === "true";
  const cropRaw = form.get("crop");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a logo file first." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Give the client a name." }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "That file is over 12MB. Please send a smaller one." }, { status: 400 });
  }

  let crop: Crop | undefined;
  if (typeof cropRaw === "string" && cropRaw) {
    try { crop = JSON.parse(cropRaw); } catch { /* ignore a malformed crop */ }
  }

  let result;
  try {
    result = await processLogo(Buffer.from(await file.arrayBuffer()), crop);
  } catch (error) {
    const message = error instanceof Error ? error.message : "That image could not be processed.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const id = toSlug(name);
  if (!id) return NextResponse.json({ error: "That name has no letters or numbers in it." }, { status: 400 });

  const entry = {
    id, name,
    logo: `/images/clients/${id}.webp`,
    w: result.width, h: CANVAS_H,
    ...(result.tile ? { tile: true as const } : {}),
  };

  // Warn rather than block: a slightly soft logo is still better than none,
  // but whoever uploaded it should know to ask the client for a bigger file.
  const warning = result.upscale > 1.02
    ? `This artwork is smaller than the wall needs, so it was enlarged ${result.upscale.toFixed(1)}x and will look soft. Ask the client for an SVG or a larger PNG.`
    : null;

  if (preview) {
    return NextResponse.json({
      preview: `data:image/webp;base64,${result.webp.toString("base64")}`,
      entry, warning,
    });
  }

  if (!canWrite) {
    return NextResponse.json({
      error: "Saving is only wired up for local development so far. Run this on localhost, or ask for the production storage step to be finished.",
    }, { status: 501 });
  }

  const ext = (file.name.match(/\.([a-z0-9]+)$/i)?.[1] || "png").toLowerCase();
  // Use what was actually stored, not what we were about to store. In
  // production the image goes to Blob and gets a different URL, so replying
  // with the local path made the new card render as a broken image until the
  // page was reloaded.
  let stored;
  try {
    stored = await saveLogo(entry, result.webp, {
      bytes: Buffer.from(await file.arrayBuffer()),
      ext,
    });
  } catch {
    // The list is read before it is written back, so a failed read must not be
    // papered over: writing anyway would rebuild it from the deployed copy and
    // lose earlier changes.
    return NextResponse.json({
      error: "Could not reach the logo storage, so nothing was saved. Try again in a moment.",
    }, { status: 503 });
  }
  revalidatePath("/");
  return NextResponse.json({ ok: true, entry: stored, warning });
}

export async function DELETE(request: Request) {
  if (!(await authed())) return denied();
  if (!canWrite) {
    return NextResponse.json({ error: "Removing is only wired up for local development so far." }, { status: 501 });
  }
  const { id } = await request.json().catch(() => ({ id: "" }));
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Which logo?" }, { status: 400 });
  }
  let removed;
  try {
    removed = await removeLogo(id);
  } catch {
    return NextResponse.json({
      error: "Could not reach the logo storage, so nothing was removed. Try again in a moment.",
    }, { status: 503 });
  }
  if (!removed) return NextResponse.json({ error: "No logo with that id." }, { status: 404 });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
