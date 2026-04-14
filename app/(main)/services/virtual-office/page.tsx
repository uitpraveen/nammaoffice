import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { VirtualOfficeForm } from "@/components/forms/VirtualOfficeForm";

export const metadata: Metadata = {
  title: "Virtual Office — Business Address & Mail Handling | NammaOffice",
  description:
    "Get a prestigious business address in Salem, Trichy, or Tirupur with NammaOffice virtual office plans. Includes mail handling, GST registration support, and ROC compliance.",
  keywords: [
    "virtual office Salem",
    "business address Trichy",
    "virtual office Tirupur",
    "GST registration address Tamil Nadu",
    "mail handling coworking",
  ],
  openGraph: {
    title: "Virtual Office — Business Address & Mail Handling | NammaOffice",
    description:
      "A professional business address without a physical office. Virtual office plans in Salem, Trichy, and Tirupur.",
  },
};

const benefits = [
  {
    icon: "🏢",
    title: "Business Address",
    description:
      "Use a prestigious NammaOffice address in Salem, Trichy, or Tirupur as your registered business address — perfect for client communications, business cards, and legal filings.",
  },
  {
    icon: "📬",
    title: "Mail Handling",
    description:
      "Receive, scan, and forward your physical mail and couriers. Never miss an important letter from a client, bank, or government authority.",
  },
  {
    icon: "🧾",
    title: "GST Registration",
    description:
      "Use the NammaOffice address for GST registration and receive all necessary NOC documentation and address proof for compliance purposes.",
  },
  {
    icon: "📋",
    title: "ROC Support",
    description:
      "Satisfy Registrar of Companies (ROC) address requirements with a verifiable, professional business address and associated documentation support.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Choose Your Plan",
    description:
      "Select the virtual office services you need — business address, mail handling, GST support, or all of the above.",
  },
  {
    step: "02",
    title: "Complete KYC",
    description:
      "Submit your identity and business documents. We verify and issue your agreement and NOC letter, typically within 2–3 business days.",
  },
  {
    step: "03",
    title: "Start Using Your Address",
    description:
      "Your NammaOffice address is now ready. Use it on letterheads, GST filings, bank accounts, and all official documents.",
  },
];

export default function VirtualOfficePage() {
  return (
    <>
      <HeroBanner
        title="Virtual Office"
        subtitle="A prestigious business address in Tamil Nadu's key cities — without the overhead of a physical office."
      />

      {/* Benefits Grid */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="What You Get with a Virtual Office"
            subtitle="Professional presence, without the monthly rent."
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} hover className="p-6 flex flex-col gap-4">
                <div className="text-4xl" aria-hidden="true">{benefit.icon}</div>
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

      {/* How It Works */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <SectionHeading
            title="How It Works"
            subtitle="Three steps to your professional business address."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-terracotta text-white flex items-center justify-center font-serif font-bold text-xl">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-warm-charcoal mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-warm-gray leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Office Form */}
      <section className="section-padding">
        <div className="content-width">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              title="Get Your Virtual Office"
              subtitle="Fill in your details and we'll set up your virtual office within 2–3 business days."
              className="mb-10"
            />
            <Card className="p-8">
              <VirtualOfficeForm />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
