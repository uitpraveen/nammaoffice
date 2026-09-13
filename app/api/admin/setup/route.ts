import {
  adminFailure,
  adminResponse,
  checkOrigin,
  jsonBody,
  requireAdmin,
} from "@/lib/admin/http";
import { AdminError } from "@/lib/admin/errors";
import {
  initialContent,
  initializeContent,
  readContent,
  readRaw,
} from "@/lib/cms/repository";
import { readLegacyClients } from "@/lib/cms/legacy";
import { invalidateContent } from "@/lib/cms/invalidate";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  try {
    await requireAdmin();
    checkOrigin(request);
    const body = await jsonBody(request);
    if (await readRaw())
      throw new AdminError(
        "CMS is already initialized. Existing content was left unchanged.",
        409,
      );
    if (body.source !== "legacy" && body.source !== "committed")
      throw new AdminError(
        "Choose the existing Blob manifest or repository logos.",
      );
    // Require a deliberate migration when this deployment already has Blob.
    if (body.source === "committed" && process.env.BLOB_READ_WRITE_TOKEN)
      throw new AdminError(
        "Import the existing Blob manifest to preserve changes made on the live site.",
      );
    const content =
      body.source === "legacy"
        ? initialContent(await readLegacyClients(true))
        : initialContent();
    if (!(await initializeContent(content)))
      throw new AdminError(
        "Another editor already initialized the CMS. Reload the page.",
        409,
      );
    invalidateContent();
    return adminResponse({ ok: true, count: content.clients.length });
  } catch (error) {
    return adminFailure(error);
  }
}
export async function GET() {
  try {
    await requireAdmin();
    const response = adminResponse(await readContent());
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="nammaoffice-cms-backup.json"',
    );
    return response;
  } catch (error) {
    return adminFailure(error);
  }
}
