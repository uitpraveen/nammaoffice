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
      console.error("[zoho] response is ShowError page — submission rejected");
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
 * Returns `true` only when Zoho responds with 2xx — the JSON endpoint
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
