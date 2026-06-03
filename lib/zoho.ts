/**
 * Submit a record to a Zoho Forms public submission URL (the
 * `…/htmlRecords/submit` endpoint shown in Share → Public URL).
 *
 * NOTE: This multipart endpoint returns 200 with a generic "Zoho Forms"
 * info page for almost every request, including ones that don't actually
 * persist. Prefer `submitToZohoFormJson` (which uses the same endpoint
 * the form's own XHR submit hits) for any new integration. This function
 * is kept only for the legacy CompanyRegistration wiring that already
 * works against this endpoint.
 *
 * Best-effort: returns false (and logs) on any failure so a Zoho
 * outage never blocks the user's submission to email. Returns false
 * immediately if `submissionUrl` is empty, which lets each API route
 * stay safe before the corresponding env var is configured.
 */
export async function submitToZohoForm(
  submissionUrl: string | undefined,
  fields: Record<string, string | Blob | undefined | null>
): Promise<boolean> {
  if (!submissionUrl) return false;

  try {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null || value === "") continue;
      fd.append(key, value as string | Blob);
    }
    const res = await fetch(submissionUrl, { method: "POST", body: fd });
    const bodyText = await res.text();
    const titleMatch = bodyText.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch?.[1] ?? "(none)";
    console.log(`[zoho] status=${res.status} title=${title}`);
    if (!res.ok) {
      console.error(`[zoho] submission failed (${res.status})`);
      console.error(
        `[zoho] body=${bodyText.slice(0, 1500).replace(/\s+/g, " ")}`
      );
      return false;
    }
    // Zoho returns the ShowError page (HTTP 200) when the submission URL or
    // a required field is wrong. Anything else is treated as success.
    if (title === "ShowError") {
      console.error("[zoho] response is ShowError page - submission rejected");
      console.error(
        `[zoho] body-head=${bodyText.slice(0, 1000).replace(/\s+/g, " ")}`
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("[zoho] submission threw:", err);
    return false;
  }
}

export type ZohoJsonValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>
  | null
  | undefined;

/**
 * Submit a record to a Zoho Forms form using the same JSON XHR endpoint
 * the form's own JavaScript hits when a real visitor presses Submit.
 *
 * Pass the form's public page URL (the share URL ending in the formperma
 * id). The function appends `/records` and POSTs the fields as JSON with
 * the headers Zoho expects (`Accept: application/zoho.forms-v1+json`,
 * `Content-Type: application/json`, `X-Requested-With: XMLHttpRequest`,
 * and an `Origin`/`Referer` pair matching the form host).
 *
 * Returns `true` only when Zoho responds with 2xx - the JSON endpoint
 * returns proper status codes, unlike the htmlRecords fallback which
 * lies with a 200 + generic info page on most failures.
 */
export async function submitToZohoFormJson(
  formUrl: string | undefined,
  fields: Record<string, ZohoJsonValue>
): Promise<boolean> {
  if (!formUrl) return false;

  try {
    const recordsUrl = `${formUrl.replace(/\/$/, "")}/records`;
    const origin = new URL(formUrl).origin;
    const cleaned: Record<string, ZohoJsonValue> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v === undefined || v === null) continue;
      cleaned[k] = v;
    }
    const res = await fetch(recordsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/zoho.forms-v1+json",
        "X-Requested-With": "XMLHttpRequest",
        Origin: origin,
        Referer: formUrl,
      },
      body: JSON.stringify(cleaned),
    });
    const bodyText = await res.text();
    console.log(
      `[zoho-json] status=${res.status} body=${bodyText.slice(0, 300).replace(/\s+/g, " ")}`,
    );
    if (!res.ok) {
      console.error(`[zoho-json] submission failed (${res.status})`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[zoho-json] submission threw:", err);
    return false;
  }
}

/**
 * Upload one file to Zoho Forms' public file-staging host and return the
 * server-side filepath string to reference in the /records submission.
 *
 * Zoho public forms upload files in TWO steps, NOT as multipart on /records:
 *   1. Stream the raw file bytes to
 *        <uploadEndpoint>/forms/v2/stream/publicupload
 *      with x-* headers. The host is datacenter-specific (IN forms use
 *      https://in2-files.zohopublic.in). It returns {"filepath":"/…"}.
 *   2. Put that filepath into the /records JSON under "<FieldLinkName>-v2"
 *      as an array of strings (e.g. "FileUpload2-v2": ["/…/…png"]).
 *
 * This function does step 1. `formUrl` is the public form page URL (same one
 * passed to submitToZohoFormJson); portal + form link name are parsed from it.
 * `fieldLinkName` is the Zoho field link name (e.g. "FileUpload2"). The
 * upload-id's middle segment (historically the numeric form id) is NOT
 * validated by Zoho, so a placeholder is used. Returns the filepath, or null
 * on any failure so the caller can decide whether the file was required.
 */
export async function uploadZohoFile(
  file: File,
  opts: { formUrl: string; fieldLinkName: string; uploadEndpoint?: string }
): Promise<string | null> {
  try {
    const url = new URL(opts.formUrl);
    // pathname: /<portal>/form/<formLinkName>/formperma/<perma>
    const parts = url.pathname.split("/").filter(Boolean);
    const portalName = parts[0];
    const formLinkName = parts[2];
    const endpoint = (
      opts.uploadEndpoint ||
      process.env.ZOHO_UPLOAD_ENDPOINT ||
      "https://in2-files.zohopublic.in"
    ).replace(/\/$/, "");
    const uploadUrl = `${endpoint}/forms/v2/stream/publicupload`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-service": "forms",
        "x-streammode": "1",
        "x-fclient-version": "2",
        "x-assured-response": "true",
        "x-live_form_upload": "true",
        "x-portalname": portalName,
        "x-formlinkname": formLinkName,
        "x-fieldlinkname": opts.fieldLinkName,
        "x-filename": encodeURIComponent(file.name),
        "upload-id": `${portalName}_0_${Date.now()}`,
        Origin: url.origin,
        Referer: opts.formUrl,
      },
      body: bytes,
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(
        `[zoho-upload] ${opts.fieldLinkName} failed (${res.status}): ${text.slice(0, 200)}`
      );
      return null;
    }
    let filepath: string | undefined;
    try {
      filepath = JSON.parse(text)?.filepath;
    } catch {
      /* fall through to header */
    }
    if (!filepath) {
      const xmsg = res.headers.get("x-msg");
      if (xmsg) filepath = decodeURIComponent(xmsg);
    }
    if (!filepath) {
      console.error(`[zoho-upload] no filepath in response: ${text.slice(0, 200)}`);
      return null;
    }
    return filepath;
  } catch (err) {
    console.error("[zoho-upload] threw:", err);
    return null;
  }
}
