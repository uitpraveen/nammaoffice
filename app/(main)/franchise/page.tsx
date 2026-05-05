import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { Accordion } from "@/components/ui/Accordion";
import { FranchiseForm } from "@/components/forms/FranchiseForm";
import {
  franchiseBenefits,
  franchiseInvestment,
  franchiseProcess,
  franchiseSupportPhases,
} from "@/lib/data/franchise";
import { getFaqsByCategory } from "@/lib/data/faqs";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Franchise — Own a NammaOffice Centre",
  description:
    "Own a NammaOffice franchise. 2,000–20,000 sq ft centres, 5+5 year agreement, 40% projected ROI, 2.5 year payback. Full support from site to launch.",
  keywords: [
    "coworking franchise Tamil Nadu",
    "NammaOffice franchise",
    "coworking business opportunity",
    "franchise investment India",
  ],
  openGraph: {
    title: "Franchise — Own a NammaOffice Centre",
    description:
      "Own a NammaOffice franchise. 40% projected ROI. Full support from site to launch.",
  },
};

const investmentStats = [
  {
    label: "Space Required",
    value: `${franchiseInvestment.minSize.toLocaleString()}–${franchiseInvestment.maxSize.toLocaleString()} ${franchiseInvestment.unit}`,
  },
  { label: "Agreement Term", value: franchiseInvestment.agreementTerm },
  { label: "Projected ROI", value: franchiseInvestment.projectedROI },
  { label: "Payback Period", value: franchiseInvestment.paybackPeriod },
];

const franchiseFaqs = getFaqsByCategory("franchise");

export default function FranchisePage() {
  return (
    <>
      <HeroBanner
        eyebrow="Franchise"
        title="Own a NammaOffice centre."
        subtitle="Join Tamil Nadu's fastest-growing coworking network. Proven systems, strong returns, and end-to-end support."
      />

      {/* Investment at a glance */}
      <section className="content-width py-14 md:py-20">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow">Investment at a glance</p>
          <h2 className="display-lg mt-3 text-[var(--color-navy)]">
            Transparent numbers. No surprises.
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {investmentStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white border border-[var(--color-border)] p-6"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--color-gold-deep)]">
                {stat.label}
              </p>
              <p className="font-display text-2xl md:text-3xl text-[var(--color-navy)] mt-2">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why partner */}
      <section className="bg-[var(--color-surface-alt)] py-14 md:py-20">
        <div className="content-width">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow">Why partner</p>
            <h2 className="display-lg mt-3 text-[var(--color-navy)]">
              Eight reasons to join us.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {franchiseBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl bg-white border border-[var(--color-border)] p-6 flex flex-col gap-3"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-gold-50)] text-[var(--color-gold-deep)]">
                  <Check className="w-5 h-5" strokeWidth={2} />
                </span>
                <h3 className="font-display text-lg text-[var(--color-navy)] leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-[13.5px] text-[var(--color-ink-secondary)] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="content-width py-14 md:py-20">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow">How it works</p>
          <h2 className="display-lg mt-3 text-[var(--color-navy)]">
            From enquiry to grand opening.
          </h2>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {franchiseProcess.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl bg-white border border-[var(--color-border)] p-6"
            >
              <p className="font-display text-3xl text-[var(--color-gold-deep)] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display text-lg text-[var(--color-navy)] mt-3 leading-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-[13.5px] text-[var(--color-ink-secondary)] leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Support phases */}
      <section className="bg-[var(--color-surface-alt)] py-14 md:py-20">
        <div className="content-width">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow">Support</p>
            <h2 className="display-lg mt-3 text-[var(--color-navy)]">
              You&apos;re never alone.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {franchiseSupportPhases.map((phase) => (
              <div
                key={phase.phase}
                className="rounded-2xl bg-white border border-[var(--color-border)] p-6"
              >
                <span className="inline-flex items-center text-[10.5px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded bg-[var(--color-navy)] text-white">
                  {phase.phase}
                </span>
                <h3 className="font-display text-xl text-[var(--color-navy)] mt-4">
                  {phase.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[13.5px] text-[var(--color-ink-secondary)]"
                    >
                      <Check className="w-3.5 h-3.5 mt-1 text-[var(--color-gold-deep)] shrink-0" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="content-width py-14 md:py-20">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow text-center">Apply</p>
          <h2 className="display-lg mt-3 text-[var(--color-navy)] text-center">
            Apply for a franchise.
          </h2>
          <p className="mt-4 text-[15px] text-[var(--color-ink-secondary)] leading-relaxed text-center">
            Fill in your details and our franchise development team will reach out within 48 hours.
          </p>
          <div className="mt-8 rounded-2xl bg-white border border-[var(--color-border)] p-6 md:p-8 shadow-[var(--shadow-brand)]">
            <FranchiseForm />
          </div>
        </div>
      </section>

      {/* FAQs */}
      {franchiseFaqs.length > 0 && (
        <section className="bg-[var(--color-surface-alt)] py-14 md:py-20">
          <div className="content-width max-w-3xl">
            <div className="mb-8">
              <p className="eyebrow">FAQ</p>
              <h2 className="display-lg mt-3 text-[var(--color-navy)]">
                Franchise FAQs.
              </h2>
            </div>
            <Accordion
              items={franchiseFaqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
              }))}
            />
          </div>
        </section>
      )}
    </>
  );
}
