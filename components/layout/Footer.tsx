import { BRAND } from "@/lib/constants";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { formatPhone } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

const workspaceLinks = [
  { label: "Private Cabin", href: "/workspaces/private-cabin" },
  { label: "Open Desk", href: "/workspaces/open-desk" },
  { label: "Cubicle", href: "/workspaces/cubicle" },
  { label: "Meeting Hall", href: "/workspaces/meeting-hall" },
  { label: "Business Lounge", href: "/workspaces/business-lounge" },
  { label: "Managed Office", href: "/workspaces/managed-office" },
];

const locationLinks = [
  { label: "Salem", href: "/locations/salem" },
  { label: "Trichy", href: "/locations/trichy" },
  { label: "Tirupur", href: "/locations/tirupur" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Franchise", href: "/franchise" },
  { label: "Workation", href: "/workation" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-charcoal)] text-white/80">
      {/* Big CTA row */}
      <div className="border-b border-white/10">
        <div className="content-width py-14 md:py-20 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
          <div>
            <p className="eyebrow !text-[var(--color-accent-300)]">Get started</p>
            <h2 className="display-lg !text-white mt-3">
              Find your space.
              <br />
              <span className="text-white/60">Start working tomorrow.</span>
            </h2>
            <p className="mt-4 text-[15px] text-white/60 max-w-md leading-relaxed">
              Subscribe for new locations, member offers and workspace tips. No spam — one email a month, max.
            </p>
          </div>
          <div className="w-full max-w-md lg:min-w-[420px]">
            <NewsletterForm />
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
              <a
                href={`tel:${formatPhone(BRAND.phone)}`}
                className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                {BRAND.phone}
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                {BRAND.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="content-width py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <Link href="/" className="inline-flex items-center" aria-label="NammaOffice home">
            <Image
              src="/images/logo.png"
              alt="NammaOffice"
              width={1000}
              height={137}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-3 text-[14px] text-white/60 leading-relaxed max-w-xs">
            {BRAND.description}
          </p>
        </div>

        <FooterColumn title="Workspaces" links={workspaceLinks} />
        <FooterColumn title="Locations" links={locationLinks} />
        <FooterColumn title="Company" links={companyLinks} />
        <FooterColumn title="Legal" links={legalLinks} />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="content-width py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[12.5px] text-white/50">
            &copy; {currentYear} NammaOffice. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
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
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40 mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[13.5px] text-white/75 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
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
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </a>
  );
}
