import type { Metadata } from "next";
import Link from "next/link";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ContactForm } from "@/components/forms/ContactForm";
import { cities, getLocationsByCity, locations } from "@/lib/data/locations";
import { BRAND } from "@/lib/constants";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact NammaOffice — Book a Tour or Get in Touch",
  description:
    "Contact NammaOffice to book a workspace tour, get pricing information, or make an enquiry. Call +91 9092109213, WhatsApp, or fill out our contact form.",
  keywords: [
    "contact NammaOffice",
    "coworking enquiry Salem",
    "book office tour Tamil Nadu",
  ],
  openGraph: {
    title: "Contact NammaOffice — Book a Tour or Get in Touch",
    description:
      "Reach out to NammaOffice. We're here to help you find the perfect workspace.",
  },
};

export default function ContactPage() {
  const cityGroups = cities
    .map((city) => ({ city, count: getLocationsByCity(city.slug).length }))
    .filter(({ count }) => count > 0);
  const totalCentres = cityGroups.reduce((n, g) => n + g.count, 0);

  return (
    <>
      <HeroBanner
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Have a question or ready to book a workspace? Reach out and we'll respond within one business day."
      />

      {/* Form + concise contact panel, side by side. */}
      <section className="bg-[var(--color-bg)] py-10 md:py-14">
        <div className="content-width grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10 items-start">
          <div className="rounded-2xl bg-white border border-[var(--color-border)] p-6 md:p-8 shadow-[var(--shadow-brand)]">
            <ContactForm />
          </div>

          <aside className="rounded-2xl bg-[var(--color-navy)] text-white p-6 md:p-7 sticky lg:top-[120px]">
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--color-gold-300)]">
              Prefer a call?
            </p>
            <p className="font-display text-xl md:text-2xl text-white mt-2 leading-snug">
              Talk to our team directly.
            </p>

            <div className="mt-6 space-y-4 text-[14px]">
              <ContactRow
                icon={<Phone className="w-4 h-4" strokeWidth={2} />}
                label="Phone"
                value={BRAND.phone}
                href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              />
              <ContactRow
                icon={<Mail className="w-4 h-4" strokeWidth={2} />}
                label="Email"
                value={BRAND.email}
                href={`mailto:${BRAND.email}`}
              />
              <ContactRow
                icon={<Clock className="w-4 h-4" strokeWidth={2} />}
                label="Hours"
                value="Mon – Sat · 8 AM – 9 PM"
              />
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-[#25D366] text-white text-[13px] font-semibold hover:bg-[#1ebe5a] transition-colors"
              >
                WhatsApp
              </a>
              <Link
                href="/locations"
                className="inline-flex items-center justify-center gap-1.5 h-10 rounded-full border border-white/25 text-white text-[13px] font-semibold hover:bg-white/10 transition-colors"
              >
                All centres <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
              </Link>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
              <SocialIcon href={BRAND.social.instagram} label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href={BRAND.social.linkedin} label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialIcon>
              <SocialIcon href={BRAND.social.facebook} label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialIcon>
            </div>
          </aside>
        </div>
      </section>

      {/* All 10 centres in a 3-column compact grid. Each card carries the
          full address + phone + email + hours so visitors don't need to
          jump to /locations just to pick up the basics. */}
      <section className="bg-[var(--color-bg)] pb-14 md:pb-20">
        <div className="content-width">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <p className="eyebrow !text-[var(--color-gold-deep)]">Walk in</p>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-navy)] mt-1">
                {totalCentres} centres across {cityGroups.length} cities.
              </h2>
            </div>
            <Link
              href="/locations"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-gold-deep)] hover:text-[var(--color-gold)] transition-colors"
            >
              Browse centre pages <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {locations.map((loc) => {
              const city = cities.find((c) => c.slug === loc.city);
              return (
                <article
                  key={`${loc.city}-${loc.slug}`}
                  className="group rounded-xl bg-white border border-[var(--color-border)] p-5 hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-brand-hover)] transition-all flex flex-col"
                >
                  <header className="flex items-start justify-between gap-3 mb-3">
                    <Link
                      href={`/locations/${loc.city}/${loc.slug}`}
                      className="font-display text-[16px] leading-tight text-[var(--color-navy)] group-hover:text-[var(--color-gold-deep)] transition-colors"
                    >
                      {loc.name}
                    </Link>
                    <span className="shrink-0 inline-flex items-center h-5 px-2 rounded-full bg-[var(--color-gold-50)] text-[var(--color-gold-deep)] text-[10px] font-semibold uppercase tracking-[0.12em]">
                      {city?.name ?? loc.city}
                    </span>
                  </header>

                  <p className="flex items-start gap-2 text-[12.5px] text-[var(--color-ink-secondary)] leading-snug mb-3">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--color-gold)]" strokeWidth={2} />
                    <span>{loc.address}</span>
                  </p>

                  <div className="mt-auto pt-3 border-t border-[var(--color-border)] grid grid-cols-1 gap-1.5 text-[12.5px]">
                    <a
                      href={`tel:${loc.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 text-[var(--color-ink)] hover:text-[var(--color-gold-deep)] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[var(--color-gold)]" strokeWidth={2} />
                      {loc.phone}
                    </a>
                    <a
                      href={`mailto:${loc.email}`}
                      className="inline-flex items-center gap-2 text-[var(--color-ink)] hover:text-[var(--color-gold-deep)] transition-colors truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-[var(--color-gold)] shrink-0" strokeWidth={2} />
                      <span className="truncate">{loc.email}</span>
                    </a>
                    <span className="inline-flex items-center gap-2 text-[var(--color-ink-secondary)]">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-gold)]" strokeWidth={2} />
                      {loc.operatingHours}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Spacer for the mobile sticky CTA bar so the last centre card is
          not hidden behind it. */}
      <div aria-hidden className="lg:hidden h-[80px]" />

      {/* Mobile-only sticky action bar — Call + WhatsApp always reachable. */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.85rem)]"
        style={{
          background: "rgba(14,14,14,0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid grid-cols-2 gap-2.5 max-w-[640px] mx-auto">
          <a
            href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[var(--color-gold)] text-white text-[13.5px] font-semibold hover:bg-[var(--color-gold-deep)] transition-colors"
          >
            <Phone className="w-4 h-4" strokeWidth={2.25} />
            Call us
          </a>
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[#25D366] text-white text-[13.5px] font-semibold hover:bg-[#1ebe5a] transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/8 text-[var(--color-gold-300)] shrink-0">
        {icon}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-white/55">
          {label}
        </span>
        <span className="text-[14px] text-white mt-0.5">{value}</span>
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      className="flex items-center gap-3 hover:text-[var(--color-gold-300)] transition-colors"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-3">{content}</div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-white/75 hover:text-[var(--color-gold-300)] hover:border-[var(--color-gold-300)]/70 hover:bg-white/5 transition-colors"
    >
      {children}
    </a>
  );
}
