import { NextResponse } from "next/server";
import { submitToZohoFormJson, type ZohoJsonValue } from "@/lib/zoho";
import {
  getBookingRooms,
  getGatePassZohoVenue,
} from "@/lib/data/zoho-venues";

export const runtime = "nodejs";

interface BookingPayload {
  requestType: "booking" | "gate-pass";
  companyName: string;
  bookingPersonName: string;
  bookingPersonContact: string;
  bookingPersonEmail: string;
  /** `${city}/${slug}` — our internal centre identifier. */
  venue: string;
  /** Room id from `BOOKING_ROOMS_BY_CENTRE[venue]`. Required for booking
   *  mode, ignored for gate-pass (auto-mapped to the park's gate-pass venue). */
  room?: string;
  companyToVisit?: string;
  purpose: string;
  numParticipants: string;
  guestNames?: string;
  bookingDateTime: string;
  duration?: string;
  agreeTerms: boolean;
  honeypot?: string;
}

const REQUIRED: (keyof BookingPayload)[] = [
  "requestType",
  "companyName",
  "bookingPersonName",
  "bookingPersonContact",
  "bookingPersonEmail",
  "venue",
  "purpose",
  "numParticipants",
  "bookingDateTime",
];

/**
 * Translate our (centre, room) selection to the exact Zoho `Dropdown2`
 * value. Returns undefined if the combination isn't in the Zoho form yet
 * — the caller rejects the submission with a clear error so we never
 * fire-and-forget bad data into Zoho.
 */
function resolveZohoVenue(
  requestType: "booking" | "gate-pass",
  venue: string,
  room: string | undefined,
): string | undefined {
  if (requestType === "gate-pass") return getGatePassZohoVenue(venue);
  const rooms = getBookingRooms(venue);
  if (!room) return undefined;
  return rooms.find((r) => r.id === room)?.zohoValue;
}

/**
 * Format a JS Date string into Zoho's dd-MMM-yyyy hh:mm AM/PM format,
 * pinned to Asia/Kolkata so the dashboard column reads cleanly.
 */
function formatZohoDateTime(input: string): string {
  try {
    const d = new Date(input);
    const datePart = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(d)
      .replace(/ /g, "-");
    const timePart = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(d)
      .toUpperCase()
      .replace(/\s+/g, " ");
    return `${datePart} ${timePart}`;
  } catch {
    return input;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingPayload;

    if (body.honeypot) {
      return NextResponse.json({ success: true });
    }

    for (const key of REQUIRED) {
      if (!body[key]) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }
    if (!body.agreeTerms) {
      return NextResponse.json({ error: "Terms must be accepted" }, { status: 400 });
    }
    if (body.requestType === "gate-pass" && !body.companyToVisit?.trim()) {
      return NextResponse.json({ error: "Company to visit is required for gate pass" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.bookingPersonEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const isGatePass = body.requestType === "gate-pass";

    if (!isGatePass && !body.room) {
      return NextResponse.json({ error: "Missing field: room" }, { status: 400 });
    }

    const zohoVenue = resolveZohoVenue(body.requestType, body.venue, body.room);
    if (!zohoVenue) {
      return NextResponse.json(
        {
          error:
            "Selected centre/room is not yet available for online booking. Please call +91 9092109213.",
        },
        { status: 400 },
      );
    }

    const formattedDateTime = formatZohoDateTime(body.bookingDateTime);

    // Build the JSON record. Field IDs were captured from the live
    // NammaofficeBookings form. TermsConditions is sent as boolean true
    // because the JSON endpoint expects a real bool for checkbox-style
    // accept fields (the htmlRecords endpoint wanted "on", but that
    // endpoint silently drops records — see lib/zoho.ts).
    // Zoho's PhoneNumber field here is configured min 10 / max 12 digits and
    // rejects any non-digit char (Zoho error: "Enter only numbers"). Strip +
    // and spaces, and bound the length so Zoho never rejects the record.
    const phone = body.bookingPersonContact.replace(/\D/g, "");
    if (phone.length < 10 || phone.length > 12) {
      return NextResponse.json(
        { error: "Enter a valid phone number (10–12 digits, optionally with +91)." },
        { status: 400 },
      );
    }

    // MultiLine (Guest Names) is REQUIRED by Zoho (verified live: omitting it
    // returns {"MultiLine":"Enter a value for this field."}) even though our UI
    // treats it as optional — so fall back to a sensible placeholder when the
    // visitor leaves it blank. Dropdown1 (Duration) and SingleLine2 (Company to
    // Visit) ARE optional, so omit them when blank (submitToZohoFormJson strips
    // undefined, not "") to avoid pushing "" into a dropdown.
    const guestNamesValue = body.guestNames?.trim()
      ? body.guestNames.trim()
      : isGatePass
        ? "(Single visitor)"
        : "(Not provided)";

    const record: Record<string, ZohoJsonValue> = {
      Checkbox: [isGatePass ? "Gate Pass Request" : "Booking Request"],
      SingleLine: body.companyName,
      SingleLine1: body.bookingPersonName,
      PhoneNumber: phone,
      Email1: body.bookingPersonEmail,
      Dropdown2: zohoVenue,
      // Company to Visit only meaningful for gate-pass requests.
      SingleLine2: isGatePass ? body.companyToVisit?.trim() || undefined : undefined,
      SingleLine4: body.purpose,
      SingleLine5: body.numParticipants,
      MultiLine: guestNamesValue,
      DateTime: formattedDateTime,
      // Duration is meeting-hall only; gate-pass hides it. Omit when unset.
      Dropdown1: !isGatePass ? body.duration || undefined : undefined,
      TermsConditions: true,
    };

    const ok = await submitToZohoFormJson(
      process.env.ZOHO_FORM_URL_BOOKINGS,
      record,
    );

    if (!ok) {
      return NextResponse.json(
        { error: "Submission could not be delivered" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Bookings API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
