import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, sessionIsValid } from "./auth";
import { AdminError } from "./errors";

export const MAX_FILE_BYTES = 3 * 1024 * 1024;
export const MAX_FORM_BYTES = MAX_FILE_BYTES + 64 * 1024;

export async function requireAdmin() {
  if (!sessionIsValid((await cookies()).get(SESSION_COOKIE)?.value)) {
    throw new AdminError("Your session expired. Please sign in again.", 401);
  }
}

export async function requireAdminPage() {
  if (!sessionIsValid((await cookies()).get(SESSION_COOKIE)?.value))
    redirect("/admin/login");
}

export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  // Next may construct request.url with an internal hostname. Host represents
  // the target the browser actually requested; browsers cannot override it.
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  const expected = `${process.env.VERCEL ? "https:" : url.protocol}//${host}`;
  if (
    (origin && origin !== expected) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new AdminError("This request must come from this website.", 403);
  }
}

export function checkLength(request: Request, max: number) {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > max)) {
    throw new AdminError(
      "The upload is too large. Choose an image under 3 MB.",
      413,
    );
  }
}

export async function jsonBody(
  request: Request,
): Promise<Record<string, unknown>> {
  checkLength(request, 128 * 1024);
  let data: unknown;
  try {
    data = JSON.parse(await boundedText(request, 128 * 1024));
  } catch (error) {
    if (error instanceof AdminError) throw error;
    throw new AdminError("Send a valid JSON object.");
  }
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new AdminError("Send a valid JSON object.");
  return data as Record<string, unknown>;
}

async function boundedText(request: Request, max: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new AdminError("The request is empty.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      throw new AdminError("The request is too large.", 413);
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function imageForm(request: Request) {
  checkLength(request, MAX_FORM_BYTES);
  // Bound chunked bodies too, before invoking the multipart parser.
  const reader = request.body?.getReader();
  if (!reader) throw new AdminError("Choose an image first.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_FORM_BYTES) {
      await reader.cancel();
      throw new AdminError("Choose an image under 3 MB.", 413);
    }
    chunks.push(value);
  }
  try {
    return await new Response(Buffer.concat(chunks), {
      headers: { "Content-Type": request.headers.get("content-type") || "" },
    }).formData();
  } catch {
    throw new AdminError(
      "The upload could not be read. Choose the file again.",
    );
  }
}

export function adminResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export function adminFailure(error: unknown) {
  if (error instanceof AdminError)
    return adminResponse({ error: error.message }, error.status);
  // Do not expose upstream responses, credentials or internal paths.
  console.error(
    "Admin operation failed:",
    error instanceof Error ? error.name : "Unknown error",
  );
  return adminResponse(
    {
      error:
        "Storage is temporarily unavailable. Reload to check the latest state before retrying.",
    },
    503,
  );
}
