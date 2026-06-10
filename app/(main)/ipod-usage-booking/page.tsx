import type { Metadata } from "next";
import { ZohoFormEmbed } from "@/components/forms/ZohoFormEmbed";
import { FormPageShell } from "@/components/sections/FormPageShell";
import { Phone } from "lucide-react";

// Dedicated iPOD booking form (Zoho). This page is reachable only via the pod's
// printed QR code (canvaqr.com -> /ipod-usage-booking); it is intentionally not
// linked in the nav/footer or listed in the sitemap, and is marked noindex.
// To swap the form later, replace this URL with the new Zoho formperma link.
const IPOD_FORM_URL =
  "https://forms.zohopublic.in/NammaOffice/form/TEST/formperma/jTxS6_YeW6nMON9-0zlztI03_jzAknBUHyKOoSRhIfE";

export const metadata: Metadata = {
  title: "Book an iPOD - Reliance Mall, Salem",
  description:
    "Book a NammaOffice iPOD - a private, plug-and-play focus pod at Reliance Mall, Salem, from ₹99/hour.",
  alternates: { canonical: "/ipod-usage-booking" },
  robots: { index: false, follow: false },
};

export default function IpodBookingPage() {
  return (
    <FormPageShell
      eyebrow="iPOD Booking"
      title="Book your iPOD"
      subtitle="Private focus pods at Reliance Mall, Salem - from ₹99/hour."
      intro="Reserve a NammaOffice iPOD: a noise-free, plug-and-play pod built for focused work. Fill in the form below and our centre team confirms availability within an hour during operating hours."
      aside={
        <div className="rounded-2xl bg-[var(--color-navy)] text-white p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-300)] font-semibold">
            Need it now?
          </p>
          <p className="mt-2 text-[15px] leading-relaxed">
            Same-day pod bookings are easier by phone. Our team can confirm
            availability in minutes.
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
      <ZohoFormEmbed url={IPOD_FORM_URL} title="iPOD Booking" />
    </FormPageShell>
  );
}
