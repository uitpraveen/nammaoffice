/**
 * Forms display mode - flip between the Next.js custom forms (which POST to
 * Zoho headlessly via the API routes) and embedding the Zoho form itself in an
 * iframe on the page.
 *
 * Controlled by the `FORMS_MODE` env var (server-side, read at request time):
 *   - "custom" (default) → render the custom <XForm /> component
 *   - "embed"            → render the Zoho form in an iframe (ZohoFormEmbed)
 *
 * One switch flips all five forms. When "embed", each form's iframe src comes
 * from its `ZOHO_EMBED_URL_*` env var; if that URL is missing, the form falls
 * back to the custom component so a page never renders blank.
 *
 * These are server-only env vars (not NEXT_PUBLIC) - read in the server-
 * component form pages. Changing them needs a dev-server restart (or, on
 * Vercel, a redeploy) to take effect.
 */

export type FormKey =
  | "company"
  | "user"
  | "vendor"
  | "bookings"
  | "serviceRequest";

const EMBED_ENV: Record<FormKey, string> = {
  company: "ZOHO_EMBED_URL_COMPANY",
  user: "ZOHO_EMBED_URL_USER",
  vendor: "ZOHO_EMBED_URL_VENDOR",
  bookings: "ZOHO_EMBED_URL_BOOKINGS",
  serviceRequest: "ZOHO_EMBED_URL_SERVICE_REQUEST",
};

export function getFormsMode(): "custom" | "embed" {
  return process.env.FORMS_MODE === "embed" ? "embed" : "custom";
}

export function getZohoEmbedUrl(key: FormKey): string | undefined {
  const v = process.env[EMBED_ENV[key]];
  return v && v.trim() ? v.trim() : undefined;
}

/**
 * Returns the Zoho embed URL for a form when we should embed it (mode is
 * "embed" AND a URL is configured), otherwise null → render the custom form.
 */
export function embedUrlFor(key: FormKey): string | null {
  if (getFormsMode() !== "embed") return null;
  return getZohoEmbedUrl(key) ?? null;
}
