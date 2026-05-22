/**
 * Mapping from our (city/slug) location IDs to the exact venue-string values
 * the Zoho NammaofficeBookings form expects in its `Dropdown2` field.
 *
 * Strings here MUST match the Zoho dropdown option text verbatim (including
 * any typos and unusual spacing — Zoho stores the literal). When a venue is
 * added or renamed in Zoho admin, update the corresponding entry here.
 *
 * Centres that are not yet present in the Zoho form are listed in
 * `BOOKING_CENTRES_NOT_IN_ZOHO` so the UI can hide them until admin adds
 * the corresponding options.
 */

export interface ZohoRoom {
  /** Stable id used in the <Select> value (no spaces). */
  id: string;
  /** Human label shown to the visitor in our form. */
  label: string;
  /** Exact string Zoho expects in `Dropdown2`. */
  zohoValue: string;
}

/** Booking-mode room map. Centre key = `${city}/${slug}`. */
export const BOOKING_ROOMS_BY_CENTRE: Record<string, ZohoRoom[]> = {
  "salem/ramakrishna-road": [
    {
      id: "balaji-discussion-4",
      label: "Discussion Room — 4 seater",
      zohoValue: "Salem - Balaji Towers - Discussion Room - 4 Seater",
    },
  ],
  "salem/rajeshwari-towers": [
    {
      id: "rajeshwari-discussion-8",
      label: "Discussion Room — 8 seater",
      zohoValue: "Salem - Rajeshwari Towers - Discussion Room - 8 Seater",
    },
  ],
  "salem/new-bus-stand": [
    {
      id: "newbusstand-board-20",
      label: "Board Room — 20 seater",
      zohoValue: "Salem - New Busstand -Board Room 20 Seater",
    },
  ],
  "salem/tidel-neo": [
    {
      id: "salem-tidel-board-30",
      label: "Board Room — 30 seater",
      zohoValue: "Salem - Tidel Neo - Board Room -30 Seater",
    },
    {
      id: "salem-tidel-discussion-4",
      label: "Discussion Room — 4 seater",
      zohoValue: "Salem - Tidel Neo - Discussion Room -4 Seater",
    },
  ],
  "tirupur/tidel-neo": [
    {
      id: "tirupur-tidel-board-25",
      label: "Board Room — 25 seater",
      zohoValue: "Tirupur-Tidel Neo-Borad Room - 25 Seater",
    },
    {
      id: "tirupur-tidel-discussion-6",
      label: "Discussion Room — 6 seater",
      zohoValue: "Tirupur-Tidel Neo-Discussion Room- 6 Seater",
    },
  ],
  "erode/texvalley": [
    {
      id: "erode-texvalley",
      label: "Meeting room",
      zohoValue: "Erode - Tex Valley",
    },
  ],
};

/** Gate-pass venue map. Only TIDEL parks are gate-pass enabled. */
export const GATE_PASS_VENUES_BY_CENTRE: Record<string, string> = {
  "salem/tidel-neo": "Gate Pass - TIDEL NEO SALEM",
  "tirupur/tidel-neo": "Gate Pass - TIDEL NEO TIRUPPUR",
};

/** Centres our site lists but which Zoho's Bookings form doesn't yet
 *  support. The form filters these out of the centre dropdown until they
 *  are added in Zoho admin. */
export const BOOKING_CENTRES_NOT_IN_ZOHO: ReadonlySet<string> = new Set([
  "salem/fairlands",
  "salem/ipod",
  "trichy/asha-grand",
  "hosur/sipcot-phase-2",
]);

export function getBookingRooms(centreKey: string): ZohoRoom[] {
  return BOOKING_ROOMS_BY_CENTRE[centreKey] ?? [];
}

export function getGatePassZohoVenue(centreKey: string): string | undefined {
  return GATE_PASS_VENUES_BY_CENTRE[centreKey];
}
