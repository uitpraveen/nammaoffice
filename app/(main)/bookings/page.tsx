import type { Metadata } from "next";
import { BookingsForm } from "@/components/forms/BookingsForm";
import { ZohoFormEmbed } from "@/components/forms/ZohoFormEmbed";
import { FormPageShell } from "@/components/sections/FormPageShell";
import { embedUrlFor } from "@/lib/forms/mode";
import { Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Meeting Hall & Gate Pass Bookings",
  description:
    "Book a meeting hall, boardroom, or request a gate pass at any NammaOffice centre across Salem, Trichy, and Tirupur.",
};

export default function BookingsPage() {
  const embed = embedUrlFor("bookings");
  return (
    <FormPageShell
      eyebrow="Bookings"
      title="Meeting Hall & Gate Pass Bookings"
      subtitle="One form for all bookings — meeting halls, boardrooms, and TIDEL gate passes."
      intro="Pick whether you're booking a meeting hall or requesting a visitor gate pass, choose your venue, and tell us when. Our centre team confirms availability within an hour during operating hours."
      aside={
        <div className="rounded-2xl bg-[var(--color-navy)] text-white p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-300)] font-semibold">
            Need it now?
          </p>
          <p className="mt-2 text-[15px] leading-relaxed">
            Same-day bookings are easier by phone. Our team can confirm availability and send a calendar invite in minutes.
          </p>
          <a
            href="tel:+919092109213"
            className="mt-4 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--color-gold)] text-[var(--color-navy-deep)] text-[14px] font-semibold hover:bg-[var(--color-gold-deep)] hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" strokeWidth={2} />
            +91 9092109213
          </a>
        </div>
      }
    >
      {embed ? (
        <ZohoFormEmbed url={embed} title="Meeting Hall & Gate Pass Bookings" />
      ) : (
        <BookingsForm />
      )}
    </FormPageShell>
  );
}
