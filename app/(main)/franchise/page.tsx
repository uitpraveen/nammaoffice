import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ProcessStepper } from "@/components/sections/ProcessStepper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { FranchiseForm } from "@/components/forms/FranchiseForm";
import {
  franchiseBenefits,
  franchiseInvestment,
  franchiseProcess,
  franchiseSupportPhases,
} from "@/lib/data/franchise";
import { getFaqsByCategory } from "@/lib/data/faqs";

export const metadata: Metadata = {
  title: "NammaOffice Franchise — Own a Coworking Centre | 40% ROI",
  description:
    "Own a NammaOffice franchise. 2,000–20,000 sq ft centres, 5+5 year agreement, 40% projected ROI, 2.5 year payback. Full support from site to launch. Apply today.",
  keywords: [
    "coworking franchise Tamil Nadu",
    "NammaOffice franchise",
    "coworking business opportunity",
    "franchise investment India",
  ],
  openGraph: {
    title: "NammaOffice Franchise — Own a Coworking Centre | 40% ROI",
    description:
      "Own a NammaOffice franchise. 40% projected ROI. Full support from site to launch.",
  },
};

const investmentStats = [
  {
    label: "Space Required",
    value: `${franchiseInvestment.minSize.toLocaleString()}–${franchiseInvestment.maxSize.toLocaleString()} ${franchiseInvestment.unit}`,
    icon: "🏢",
  },
  {
    label: "Agreement Term",
    value: franchiseInvestment.agreementTerm,
    icon: "📝",
  },
  {
    label: "Projected ROI",
    value: franchiseInvestment.projectedROI,
    icon: "📈",
  },
  {
    label: "Payback Period",
    value: franchiseInvestment.paybackPeriod,
    icon: "⏱️",
  },
];

const franchiseFaqs = getFaqsByCategory("franchise");

export default function FranchisePage() {
  return (
    <>
      <HeroBanner
        title="Partner With Us — Own a NammaOffice"
        subtitle="Join India's fastest-growing coworking network in Tamil Nadu. Proven systems, strong returns, and end-to-end support."
      />

      {/* Why Partner */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="Why Partner With NammaOffice?"
            subtitle="Eight reasons why entrepreneurs choose the NammaOffice franchise model."
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {franchiseBenefits.slice(0, 4).map((benefit) => (
              <Card key={benefit.title} hover className="p-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-brand bg-terracotta-50 flex items-center justify-center">
                  <span className="text-2xl" aria-hidden="true">
                    {benefit.title === "Proven Brand" && "🏆"}
                    {benefit.title === "Strong ROI" && "📈"}
                    {benefit.title === "Full Operational Support" && "🤝"}
                    {benefit.title === "Technology Platform" && "💻"}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-warm-charcoal mb-2">
                    {benefit.title}
                  </h3>
                  <p className="font-sans text-sm text-warm-gray leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Second row of benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {franchiseBenefits.slice(4, 8).map((benefit) => (
              <Card key={benefit.title} hover className="p-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-brand bg-olive-50 flex items-center justify-center">
                  <span className="text-2xl" aria-hidden="true">
                    {benefit.title === "Staff Training" && "🎓"}
                    {benefit.title === "Marketing & Lead Generation" && "📣"}
                    {benefit.title === "Interior Design & Fitout" && "🎨"}
                    {benefit.title === "Exclusive Territory" && "🗺️"}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-warm-charcoal mb-2">
                    {benefit.title}
                  </h3>
                  <p className="font-sans text-sm text-warm-gray leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Details */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <SectionHeading
            title="Investment at a Glance"
            subtitle="Transparent investment parameters for prospective franchise partners."
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentStats.map((stat) => (
              <Card key={stat.label} className="p-8 text-center">
                <div className="text-4xl mb-4" aria-hidden="true">
                  {stat.icon}
                </div>
                <p className="font-serif text-2xl text-terracotta font-bold mb-2">
                  {stat.value}
                </p>
                <p className="font-sans text-sm text-warm-gray">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Stepper */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="How to Become a Franchise Partner"
            subtitle="A clear, step-by-step journey from enquiry to grand opening."
            className="mb-12"
          />
          <ProcessStepper steps={franchiseProcess} />
        </div>
      </section>

      {/* Support Phases */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <SectionHeading
            title="What Support Do You Get?"
            subtitle="NammaOffice partners are never alone — from day one to long-term growth."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {franchiseSupportPhases.map((phase) => (
              <Card key={phase.phase} className="p-8">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium font-sans bg-terracotta-50 text-terracotta mb-4">
                  {phase.phase}
                </div>
                <h3 className="font-serif text-xl text-warm-charcoal mb-4">
                  {phase.title}
                </h3>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-sans text-sm text-warm-gray">
                      <span className="text-terracotta mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Form */}
      <section className="section-padding">
        <div className="content-width">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              title="Apply for a NammaOffice Franchise"
              subtitle="Fill in your details and our franchise development team will contact you within 48 hours."
              className="mb-10"
            />
            <Card className="p-8">
              <FranchiseForm />
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      {franchiseFaqs.length > 0 && (
        <section className="section-padding bg-sand-50">
          <div className="content-width">
            <SectionHeading
              title="Franchise FAQs"
              subtitle="Answers to common questions from prospective franchise partners."
              className="mb-10"
            />
            <div className="max-w-3xl mx-auto">
              <Accordion
                items={franchiseFaqs.map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                }))}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
