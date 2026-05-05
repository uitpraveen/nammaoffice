import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, FileSignature, Plane } from "lucide-react";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Business Services | NammaOffice",
  description:
    "Beyond coworking — NammaOffice helps with company registration, virtual office plans, and workation packages across Tamil Nadu.",
  openGraph: {
    title: "Business Services | NammaOffice",
    description:
      "Company registration, virtual office, workation — services that work alongside our coworking spaces.",
  },
};

const services = [
  {
    href: "/services/company-registration",
    icon: FileSignature,
    title: "Company Registration",
    description:
      "End-to-end company formation — Pvt Ltd, LLP, Partnership, OPC. We handle name approval, MOA/AOA, MCA filing and GST registration.",
  },
  {
    href: "/services/virtual-office",
    icon: Building2,
    title: "Virtual Office",
    description:
      "A prestigious NammaOffice address for your business — perfect for GST registration, ROC filings and client correspondence — without a physical seat.",
  },
  {
    href: "/workation",
    icon: Plane,
    title: "Workation",
    description:
      "Work-from-anywhere packages combining a NammaOffice desk with a curated stay — meetings by day, hill stations and beaches by evening.",
  },
];

export default function ServicesIndexPage() {
  return (
    <>
      <HeroBanner
        title="Services beyond a desk"
        subtitle="NammaOffice helps you start, register, and run your business — not just sit in a workspace."
      />

      <section className="section-padding bg-[var(--color-bg)]">
        <div className="content-width">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group flex flex-col bg-white rounded-2xl border border-[var(--color-border)] p-6 md:p-7 hover:border-[var(--color-border-strong)] hover:shadow-[0_8px_24px_rgba(10,10,10,0.06)] transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-accent-50)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>

                  <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] text-[var(--color-ink-secondary)] leading-relaxed">
                    {s.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)]">
                    Learn more
                    <ArrowUpRight
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2.25}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
