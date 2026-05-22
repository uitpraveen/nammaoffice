import { BRAND } from "@/lib/constants";
import { cities, locations } from "@/lib/data/locations";
import { formatPhone } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Mail, MapPin, Phone } from "lucide-react";

const formsLinks = [
  { label: "Company Registration", href: "/registration/company" },
  { label: "User Registration", href: "/registration/user" },
  { label: "Vendor Form", href: "/registration/vendor" },
  { label: "Bookings", href: "/bookings" },
];

const serviceLinks = [
  { label: "Managed Offices & BOT", href: "/contact?intent=managed-office" },
  { label: "Meeting Halls & Gate Pass", href: "/bookings" },
  { label: "Service Desk", href: "/service-request" },
  { label: "Franchise", href: "/franchise" },
  { label: "Amenities", href: "/#amenities" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-conditions" },
  { label: "Refund", href: "/refund-policy" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0E0E0E] text-white/80">
      {/* Layered background — vertical gradient + warm brick halo radial in
          the top-right and a deep ember in the bottom-left. Adds depth without
          competing with the content. */}
      <div aria-hidden className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-[#0E0E0E] to-[#050505]" />
        <div
          className="absolute -top-48 -right-32 w-[42rem] h-[42rem] rounded-full opacity-[0.10]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(184,85,58,1), rgba(184,85,58,0))",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(216,150,120,1), rgba(216,150,120,0))",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Gold hairline + travelling comet of light, mirroring the masthead. */}
      <span
        aria-hidden
        className="absolute left-0 right-0 top-0 h-px bg-[var(--color-gold)] z-10"
      />
      <span
        aria-hidden
        className="absolute left-0 right-0 top-0 h-px z-10 overflow-hidden pointer-events-none"
      >
        <span
          className="header-light-sweep block h-px w-[26%] min-w-[180px] max-w-[360px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(232,162,107,0.45) 55%, rgba(255,215,150,1) 90%, transparent 100%)",
            boxShadow: "0 0 6px 0.5px rgba(255,215,150,0.85)",
          }}
        />
      </span>

      {/* CTA strip — full-width bottom rule, content stays constrained. */}
      <div className="relative border-b border-white/8">
        <div className="content-width py-14 md:py-20 grid lg:grid-cols-[1fr_auto] items-center gap-8 lg:gap-16">
          <div>
            <p className="eyebrow !text-[var(--color-gold-300)]">Get in touch</p>
            <h2 className="font-display text-3xl md:text-4xl !text-white mt-2 leading-tight">
              Ready to claim your space?
            </h2>
            <p className="mt-3 text-[15px] text-white/65 max-w-xl leading-relaxed">
              Book a meeting hall, request a gate pass, or talk to us about a managed office across Salem, Trichy, Tirupur, Erode, or Hosur.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/bookings"
              className="inline-flex items-center justify-center gap-1.5 h-12 px-6 text-[14px] font-semibold rounded-full bg-[var(--color-gold)] text-white hover:bg-[var(--color-gold-deep)] transition-colors shadow-[var(--shadow-cta-hover)]"
            >
              Book Now
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </Link>
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="inline-flex items-center justify-center gap-1.5 h-12 px-6 text-[14px] font-semibold rounded-full border border-white/25 text-white hover:bg-white/10 hover:border-[var(--color-gold-300)] transition-colors"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              {BRAND.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="content-width relative py-12 md:py-14 grid grid-cols-1 md:grid-cols-[1.5fr_1.2fr_1fr_1fr] gap-10">
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-flex items-center" aria-label="NammaOffice home">
            <Image
              src="/images/logo.png"
              alt="NammaOffice"
              width={1000}
              height={137}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-[14px] text-white/60 leading-relaxed max-w-xs">
            Premium coworking spaces across {cities.map((c) => c.name).join(", ").replace(/, ([^,]*)$/, " and $1")}.
          </p>

          {/* Contact blocks — labelled, larger so phone & email read as
              their own cards instead of cramped inline links. */}
          <div className="flex flex-col gap-2.5 max-w-sm">
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="group flex items-center gap-3.5 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 hover:border-[var(--color-gold-300)]/40 hover:bg-white/[0.06] transition-colors"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-gold-700)]/35 text-[var(--color-gold-300)] shrink-0">
                <Phone className="w-4 h-4" strokeWidth={2} />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Call us
                </span>
                <span className="text-[15px] font-medium text-white/95 group-hover:text-[var(--color-gold-300)] transition-colors mt-0.5 truncate">
                  {BRAND.phone}
                </span>
              </span>
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="group flex items-center gap-3.5 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 hover:border-[var(--color-gold-300)]/40 hover:bg-white/[0.06] transition-colors"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-gold-700)]/35 text-[var(--color-gold-300)] shrink-0">
                <Mail className="w-4 h-4" strokeWidth={2} />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Email us
                </span>
                <span className="text-[15px] font-medium text-white/95 group-hover:text-[var(--color-gold-300)] transition-colors mt-0.5 truncate">
                  {BRAND.email}
                </span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-1 -ml-2">
            <SocialIcon href={BRAND.social.instagram} label="Instagram">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.22-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85 0-3.2.01-3.58.07-4.85.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.64-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href={BRAND.social.linkedin} label="LinkedIn">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href={BRAND.social.facebook} label="Facebook">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                <path d="M24 12.07C24 5.45 18.63.07 12 .07S0 5.45 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.39H7.08v-3.46h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.5 0-1.96.92-1.96 1.87v2.25h3.33l-.53 3.46h-2.8v8.39C19.62 23.02 24 18.06 24 12.07Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href={BRAND.social.youtube} label="YouTube">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                <path d="M23.5 6.19a3.02 3.02 0 0 0-2.13-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14c.5-1.88.5-5.81.5-5.81s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        <FooterLocations />
        <FooterColumn title="Forms" links={formsLinks} />
        <FooterColumn title="Service Desk" links={serviceLinks} />
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/8">
        <div className="content-width py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[12.5px] text-white/45">
            &copy; {currentYear} NammaOffice. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12.5px]">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/55 hover:text-[var(--color-gold-300)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <span className="hidden md:inline-flex items-center gap-1.5 text-white/45">
              <MapPin className="w-3 h-3" strokeWidth={2} />
              {locations.length} centres · {cities.length} cities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Footer locations column — grouped by city instead of a flat 8-row
 * list. Each city heading is a clickable link to the city overview;
 * the centres list under it sits behind a subtle vertical rule so the
 * grouping reads at a glance.
 */
/**
 * Footer columns use a native <details>/<summary> accordion pattern so
 * mobile readers can collapse long link clusters without any client JS.
 * On md+ the columns are pinned open: pointer-events on the summary are
 * disabled so a user can't accidentally collapse them, and the chevron
 * is hidden. The bottom border under each summary on mobile gives the
 * accordion a clean divided look.
 */
function FooterAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className="group md:open border-b border-white/8 md:border-0 pb-2 md:pb-0"
    >
      <summary className="flex items-center justify-between py-3 md:py-0 md:mb-4 md:cursor-default list-none [&::-webkit-details-marker]:hidden md:pointer-events-none">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-300)]">
          {title}
        </h3>
        <ChevronDown
          className="md:hidden w-4 h-4 text-white/55 transition-transform duration-200 group-open:rotate-180"
          strokeWidth={2}
        />
      </summary>
      <div className="pt-1 md:pt-0">{children}</div>
    </details>
  );
}

function FooterLocations() {
  return (
    <FooterAccordion title="Locations">
      <div className="flex flex-col gap-5">
        {cities.map((city) => {
          const centres = locations.filter((l) => l.city === city.slug);
          return (
            <div key={city.slug}>
              <Link
                href={`/locations/${city.slug}`}
                className="group flex items-baseline gap-2 mb-2"
              >
                <span className="text-[13.5px] font-semibold text-white/90 group-hover:text-white transition-colors">
                  {city.name}
                </span>
                <span className="text-[10.5px] text-white/40 group-hover:text-[var(--color-gold-300)] transition-colors">
                  · {centres.length} {centres.length === 1 ? "centre" : "centres"}
                </span>
              </Link>
              <ul className="pl-3 border-l border-white/8 space-y-1.5">
                {centres.map((l) => (
                  <li key={`${l.city}-${l.slug}`}>
                    <Link
                      href={`/locations/${l.city}/${l.slug}`}
                      className="block text-[12.5px] text-white/55 hover:text-white/95 hover:translate-x-0.5 transition-all"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </FooterAccordion>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; sub?: string }[];
}) {
  return (
    <FooterAccordion title={title}>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="group block text-[13.5px] text-white/75 hover:text-white transition-colors"
            >
              {link.label}
              {link.sub && (
                <span className="block text-[11px] text-white/40 mt-0.5">
                  {link.sub}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </FooterAccordion>
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
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white/55 hover:text-[var(--color-gold-300)] hover:bg-white/5 transition-colors"
    >
      {children}
    </a>
  );
}
