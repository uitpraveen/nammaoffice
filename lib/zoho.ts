/**
 * Submit a record to a Zoho Forms public submission URL (the
 * `…/htmlRecords/submit` endpoint shown in Share → Public URL).
 *
 * Best-effort: returns false (and logs) on any failure so a Zoho
 * outage never blocks the user's submission to email. Returns false
 * immediately if `submissionUrl` is empty, which lets each API route
 * stay safe before the corresponding env var is configured.
 *
 * Field IDs are the internal Zoho keys (e.g. `Name_First`, `SingleLine`,
 * `Email`, `PhoneNumber_countrycodeval`). Inspect your published form's
 * HTML or "Embed → Source" view to find each one, then fill the
 * field-name map in the calling route.
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
