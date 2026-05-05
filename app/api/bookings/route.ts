import { NextResponse } from "next/server";
import { sendNotificationEmail, emailShell, renderRows } from "@/lib/email";
import { locations } from "@/lib/data/locations";

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

function gatePassLabel(venue: string): string {
  if (venue.startsWith("salem/tidel-neo")) return "Salem";
  if (venue.startsWith("tirupur/tidel-neo")) return "Tirupur";
  return "Unknown";
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
    const subjectPrefix = isGatePass
      ? `[GATEPASS — ${gatePassLabel(body.venue)}]`
      : `[BOOKING]`;

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

    const html = emailShell(
      isGatePass ? "Gate Pass Request" : "Meeting Hall Booking",
      isGatePass ? "Service Desk" : "Bookings",
      renderRows({
        "Request Type": isGatePass ? "Gate Pass" : "Meeting Hall Booking",
        Venue: venueLabel(body.venue),
        ...(isGatePass ? { "Company to Visit": body.companyToVisit } : {}),
        "Booking Date & Time": formattedDateTime,
        Duration: body.duration,
        "No. of Participants": body.numParticipants,
        "Guest Names": body.guestNames,
        Purpose: body.purpose,
        "Company Name": body.companyName,
        "Booking Person": body.bookingPersonName,
        Phone: body.bookingPersonContact,
        Email: body.bookingPersonEmail,
      })
    );

    await sendNotificationEmail({
      subject: `${subjectPrefix} ${body.companyName} — ${formattedDateTime}`,
      html,
      replyTo: body.bookingPersonEmail,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Bookings API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
