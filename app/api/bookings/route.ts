import { NextResponse } from "next/server";
import { locations } from "@/lib/data/locations";
import { submitToZohoForm } from "@/lib/zoho";

export const runtime = "nodejs";

interface BookingPayload {
  requestType: "booking" | "gate-pass";
  companyName: string;
  bookingPersonName: string;
  bookingPersonContact: string;
  bookingPersonEmail: string;
  venue: string;
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

function venueLabel(venue: string): string {
  const [city, slug] = venue.split("/");
  const loc = locations.find((l) => l.city === city && l.slug === slug);
  if (!loc) return venue;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  return `${loc.name} — ${cityName}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingPayload;

    if (body.honeypot) {
      // Bot — pretend success to not signal detection.
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

    const formattedDateTime = (() => {
      try {
        return new Date(body.bookingDateTime).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        });
      } catch {
        return body.bookingDateTime;
      }
    })();

    // Forward to Zoho Forms. Set ZOHO_FORM_URL_BOOKINGS and replace the
    // placeholder keys below with the actual Zoho field IDs from the
    // published Bookings/Gate-Pass form.
    const ok = await submitToZohoForm(process.env.ZOHO_FORM_URL_BOOKINGS, {
      // TODO: replace each key below with the matching Zoho field name.
      Radio: isGatePass ? "Gate Pass" : "Meeting Hall Booking",
      Dropdown: venueLabel(body.venue),
      SingleLine: body.companyToVisit,
      DateTime: formattedDateTime,
      SingleLine1: body.duration,
      Number: body.numParticipants,
      MultiLine: body.guestNames,
      MultiLine1: body.purpose,
      SingleLine2: body.companyName,
      Name_First: body.bookingPersonName,
      PhoneNumber_countrycodeval: body.bookingPersonContact,
      Email: body.bookingPersonEmail,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Submission could not be delivered" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Bookings API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
