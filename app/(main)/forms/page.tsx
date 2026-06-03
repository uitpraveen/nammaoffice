import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, CalendarCheck, LifeBuoy, UserPlus, type LucideIcon } from "lucide-react";
import { HeroBanner } from "@/components/sections/HeroBanner";

export const metadata: Metadata = {
  alternates: { canonical: "/forms" },
  title: "Forms",
  description:
    "All NammaOffice forms in one place - Company Registration, User Registration, Vendor Onboarding, and Bookings.",
};

interface FormCard {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  cta: string;
}

const FORMS: FormCard[] = [
  {
    href: "/registration/company",
    title: "Company Registration",
    description:
      "Register a Private Limited, LLP, Partnership, Sole Proprietorship, or OPC. End-to-end filing assistance from our team.",
    icon: Building2,
    cta: "Start filing",
  },
  {
    href: "/registration/user",
    title: "User Registration",
    description:
      "Onboarding form for NammaOffice members and visitors. Quick KYC, vehicle, and contact details.",
    icon: UserPlus,
    cta: "Register as member",
  },
  {
    href: "/registration/vendor",
    title: "Vendor Onboarding",
    description:
      "Apply to become an approved vendor. Cleaning, security, pantry, IT/AV, maintenance, stationery, furniture, and more.",
    icon: Briefcase,
    cta: "Apply as vendor",
  },
  {
    href: "/bookings",
    title: "Meeting Hall & Gate Pass Bookings",
    description:
      "Book a meeting hall or boardroom at any centre, or request a TIDEL gate pass for a visitor - same form, two purposes.",
    icon: CalendarCheck,
    cta: "Open booking form",
  },
  {
    href: "/service-request",
    title: "Service Desk Request",
    description:
      "Raise a ticket with the centre team for facilities, IT, housekeeping, or any issue at your branch. Attach a photo or PDF to help triage.",
    icon: LifeBuoy,
    cta: "Raise a ticket",
  },
];

export default function FormsPage() {
  return (
    <>
      <HeroBanner
        eyebrow="Forms"
        title="All forms, one page."
        subtitle="Pick the form you need - registration, onboarding, or bookings - and we'll route it to the right team."
      />

      <section className="content-width py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FORMS.map(({ href, title, description, icon: Icon, cta }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl bg-white border border-[var(--color-border)] p-6 md:p-7 flex flex-col gap-4 hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-brand-hover)] transition-all"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-gold-50)] text-[var(--color-gold-deep)]">
                <Icon className="w-6 h-6" strokeWidth={1.75} />
              </span>
              <div>
                <h2 className="font-display text-2xl text-[var(--color-purple)] leading-tight">
                  {title}
                </h2>
                <p className="mt-2 text-[14.5px] text-[var(--color-ink-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-purple)] group-hover:text-[var(--color-gold-deep)] transition-colors">
                {cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.25} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
