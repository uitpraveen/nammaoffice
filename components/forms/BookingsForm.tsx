"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { FormSection } from "@/components/ui/FormSection";
import { CheckCircle2 } from "lucide-react";
import { cities, locations } from "@/lib/data/locations";
import {
  BOOKING_CENTRES_NOT_IN_ZOHO,
  getBookingRooms,
} from "@/lib/data/zoho-venues";

const REQUEST_TYPES = [
  {
    value: "booking",
    label: "Meeting hall booking",
    description: "Book a boardroom or meeting hall at one of our centres.",
  },
  {
    value: "gate-pass",
    label: "Gate pass request",
    description: "Request a visitor pass for a TIDEL park entry.",
  },
];

// Values are the exact strings the Zoho `Dropdown1` field expects — keep
// them in sync with the Zoho form's Meeting Duration options.
const DURATIONS = [
  { value: "30mins", label: "30 minutes" },
  { value: "1:00 Hrs", label: "1 hour" },
  { value: "1:30 Hrs", label: "1 hr 30 min" },
  { value: "2:00 Hrs", label: "2 hours" },
  { value: "3:00 Hrs", label: "3 hours" },
  { value: "4:00 Hrs", label: "Half day (4 hrs)" },
  { value: "8:00 Hrs", label: "Full day (8 hrs)" },
];

// Booking-mode venues are grouped by city (one <optgroup> per city) so
// long centre lists read scannably on mobile. Centres not yet present in
// the Zoho Bookings form are filtered out — adding them in Zoho admin and
// in lib/data/zoho-venues.ts will surface them here automatically.
const ALL_VENUE_GROUPS = cities
  .map((c) => ({
    label: c.name,
    options: locations
      .filter(
        (l) =>
          l.city === c.slug &&
          !BOOKING_CENTRES_NOT_IN_ZOHO.has(`${l.city}/${l.slug}`),
      )
      .map((l) => ({
        value: `${l.city}/${l.slug}`,
        label: l.name,
      })),
  }))
  .filter((g) => g.options.length > 0);

// Gate-pass is a TIDEL-park-only service. Mirror the physical workflow
// instead of letting customers pick a non-TIDEL centre and getting
// confused at reception.
const GATE_PASS_VENUE_OPTIONS = locations
  .filter((l) => l.slug === "tidel-neo")
  .map((l) => ({
    value: `${l.city}/${l.slug}`,
    label: `${l.name} — ${l.city.charAt(0).toUpperCase() + l.city.slice(1)}`,
  }));

/**
 * Earliest datetime the input will accept — now + 30 minutes, formatted
 * for the native <input type="datetime-local"> in the browser's local
 * timezone (slice trims seconds and timezone suffix).
 */
function minLeadTimeIso(): string {
  const d = new Date(Date.now() + 30 * 60 * 1000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

interface FormState {
  requestType: "booking" | "gate-pass";
  companyName: string;
  bookingPersonName: string;
  bookingPersonContact: string;
  bookingPersonEmail: string;
  venue: string;
  /** Room id from `lib/data/zoho-venues.ts`. Required when requestType is "booking". */
  room: string;
  companyToVisit: string;
  purpose: string;
  numParticipants: string;
  guestNames: string;
  bookingDateTime: string;
  duration: string;
  agreeTerms: boolean;
  honeypot: string;
}

interface BookingsFormProps {
  defaultRequestType?: "booking" | "gate-pass";
  defaultVenue?: string;
  /**
   * When true (used by city-specific gate-pass routes), the Venue
   * dropdown is locked to defaultVenue so customers can't accidentally
   * pick the wrong centre and end up at the wrong reception desk.
   */
  lockVenue?: boolean;
}

export function BookingsForm({
  defaultRequestType = "booking",
  defaultVenue = "",
  lockVenue = false,
}: BookingsFormProps) {
  const [form, setForm] = useState<FormState>({
    requestType: defaultRequestType,
    companyName: "",
    bookingPersonName: "",
    bookingPersonContact: "",
    bookingPersonEmail: "",
    venue: defaultVenue,
    room: "",
    companyToVisit: "",
    purpose: "",
    numParticipants: "",
    guestNames: "",
    bookingDateTime: "",
    duration: "",
    agreeTerms: false,
    honeypot: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    const required: (keyof FormState)[] = [
      "companyName",
      "bookingPersonName",
      "bookingPersonContact",
      "bookingPersonEmail",
      "venue",
      "purpose",
      "numParticipants",
      "bookingDateTime",
    ];
    required.forEach((f) => {
      const v = form[f];
      if (typeof v === "string" && !v.trim()) errs[f] = "Required";
    });
    if (form.bookingPersonEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.bookingPersonEmail)) {
      errs.bookingPersonEmail = "Enter a valid email";
    }
    if (form.requestType === "booking" && !form.room) {
      errs.room = "Pick a room";
    }
    if (form.requestType === "gate-pass" && !form.companyToVisit.trim()) {
      errs.companyToVisit = "Tell us which company you're visiting";
    }
    if (!form.agreeTerms) errs.agreeTerms = "Please accept the terms & conditions";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.honeypot) return; // Bot submission — silently drop.
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    const isGatePass = form.requestType === "gate-pass";
    return (
      <div className="rounded-2xl bg-white border border-[var(--color-gold-300)] p-8 text-center flex flex-col items-center gap-3">
        <CheckCircle2 className="w-12 h-12 text-[var(--color-gold-deep)]" strokeWidth={1.5} />
        <h2 className="font-display text-2xl text-[var(--color-navy)]">
          {isGatePass ? "Gate pass requested" : "Booking received"}
        </h2>
        <p className="text-[14.5px] text-[var(--color-ink-secondary)] max-w-md">
          {isGatePass
            ? "We've sent your gate pass request to the centre team. You'll get a confirmation email shortly."
            : "Thanks! We've received your booking request and our team will confirm availability within an hour."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot — hidden from real users, visible to bots */}
      <input
        type="text"
        name="company"
        value={form.honeypot}
        onChange={(e) => update("honeypot", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-px h-px"
        aria-hidden="true"
      />

      <FormSection title="What do you need?">
        <Radio
          label="Request type"
          name="requestType"
          options={REQUEST_TYPES}
          value={form.requestType}
          onChange={(v) => update("requestType", v as "booking" | "gate-pass")}
          layout="cards"
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            type="text"
            required
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            error={errors.companyName}
          />
          <Select
            label="Venue"
            required
            options={
              form.requestType === "gate-pass"
                ? GATE_PASS_VENUE_OPTIONS
                : ALL_VENUE_GROUPS
            }
            placeholder={
              form.requestType === "gate-pass"
                ? "Select a TIDEL park"
                : "Select a centre"
            }
            value={form.venue}
            onChange={(e) => {
              update("venue", e.target.value);
              // Reset room — its options depend on the centre.
              update("room", "");
            }}
            error={errors.venue}
            disabled={lockVenue}
            hint={
              lockVenue
                ? "Pre-selected for this centre — submit a request from another centre's page to change venue."
                : form.requestType === "gate-pass"
                  ? "Gate pass is available only at TIDEL NEO Salem and TIDEL NEO Tirupur."
                  : "Centres are grouped by city."
            }
          />
        </div>
        {/* Room is meeting-hall booking only — gate pass maps to a fixed
            venue value per TIDEL park, no room choice needed. */}
        {form.requestType === "booking" && form.venue && (
          <Select
            label="Room"
            required
            options={getBookingRooms(form.venue).map((r) => ({
              value: r.id,
              label: r.label,
            }))}
            placeholder="Select a room"
            value={form.room}
            onChange={(e) => update("room", e.target.value)}
            error={errors.room}
            hint="Available rooms vary by centre."
          />
        )}
      </FormSection>

      <FormSection title="Contact details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Booking Person Name"
            type="text"
            required
            value={form.bookingPersonName}
            onChange={(e) => update("bookingPersonName", e.target.value)}
            error={errors.bookingPersonName}
          />
          <Input
            label="Booking Person Contact"
            type="tel"
            placeholder="+91 9000000000"
            required
            value={form.bookingPersonContact}
            onChange={(e) => update("bookingPersonContact", e.target.value)}
            error={errors.bookingPersonContact}
          />
        </div>
        <Input
          label="Booking Person Email"
          type="email"
          required
          value={form.bookingPersonEmail}
          onChange={(e) => update("bookingPersonEmail", e.target.value)}
          error={errors.bookingPersonEmail}
        />
        {form.requestType === "gate-pass" && (
          <Input
            label="Company to Visit"
            type="text"
            placeholder="The tenant inside TIDEL park"
            required
            value={form.companyToVisit}
            onChange={(e) => update("companyToVisit", e.target.value)}
            error={errors.companyToVisit}
          />
        )}
      </FormSection>

      <FormSection title="Meeting details">
        <Textarea
          label="Purpose of meeting"
          required
          value={form.purpose}
          onChange={(e) => update("purpose", e.target.value)}
          error={errors.purpose}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="No of Participants"
            type="number"
            min="1"
            required
            value={form.numParticipants}
            onChange={(e) => update("numParticipants", e.target.value)}
            error={errors.numParticipants}
          />
          <Input
            label="Booking Date-Time"
            type="datetime-local"
            required
            min={minLeadTimeIso()}
            value={form.bookingDateTime}
            onChange={(e) => update("bookingDateTime", e.target.value)}
            error={errors.bookingDateTime}
            hint="Centre hours 8 AM – 9 PM, Mon–Sat. Same-day or after-hours? Call +91 9092109213 for fastest confirmation."
          />
        </div>
        <Textarea
          label="List of Guest Names"
          placeholder="One name per line"
          value={form.guestNames}
          onChange={(e) => update("guestNames", e.target.value)}
        />
        {/* Meeting Duration is a meeting-hall concept; hide it on gate-pass requests. */}
        {form.requestType === "booking" && (
          <Select
            label="Meeting Duration"
            options={DURATIONS}
            placeholder="Select duration"
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
          />
        )}
        <div className="flex flex-col gap-1">
          <Checkbox
            label="I agree to the terms & conditions"
            checked={form.agreeTerms}
            onChange={(e) => update("agreeTerms", e.target.checked)}
          />
          {errors.agreeTerms && (
            <p className="text-sm text-red-500 font-sans">{errors.agreeTerms}</p>
          )}
        </div>
      </FormSection>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading"
          ? "Submitting…"
          : form.requestType === "gate-pass"
            ? "Request gate pass"
            : "Submit booking"}
      </Button>

      {status === "error" && (
        <p className="text-sm text-red-500 font-sans text-center">
          Something went wrong. Please try again, or call +91 9092109213.
        </p>
      )}
    </form>
  );
}
