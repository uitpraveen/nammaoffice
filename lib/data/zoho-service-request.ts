/**
 * Field-specific option lists for the Zoho `ServiceRequestForm`. Values
 * here MUST match the Zoho dropdown option text verbatim (typos and case
 * preserved) so submissions land in the right column.
 */

/** Branch list — copied verbatim from the live Zoho form. */
export const SERVICE_REQUEST_BRANCHES: readonly string[] = [
  "SALEM TIDEL NEO",
  "SALEM BRINTHAVAN RD",
  "SALEM BALAJI TOWERS",
  "SALEM RAJESHWARI TOWERS",
  "SALEM NEW BUSSTAND",
  "SALEM SS TOWERS",
  "SALEM NOBILQ 5 ROADS",
  "TIRUPPUR TIDEL NEO",
  "TRICHY ASHA GRAND",
  "ERODE TEX VALLEY",
  "HOSUR",
];

/** Area list — Zoho's dropdown ends with "Other"; selecting it reveals a
 *  free-text input (`allow-others-text` in Zoho). */
export const SERVICE_REQUEST_AREAS: readonly string[] = [
  "Work Place",
  "Food Court",
  "Wash Room",
  "Common Area",
  "Conference Room",
  "Other",
];

/** Floor list — optional, "Other" allowed (free-text follows in Zoho). */
export const SERVICE_REQUEST_FLOORS: readonly string[] = [
  "Floor - 1",
  "Floor - 2",
  "Floor - 3",
  "Other",
];
