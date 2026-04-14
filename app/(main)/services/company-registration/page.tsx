import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ProcessStepper } from "@/components/sections/ProcessStepper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { CompanyRegistrationForm } from "@/components/forms/CompanyRegistrationForm";

export const metadata: Metadata = {
  title: "Company Registration Services | NammaOffice",
  description:
    "Register your company with ease at NammaOffice. Private Limited, LLP, OPC, Partnership, and Sole Proprietorship registration services in Salem, Trichy, and Tirupur.",
  keywords: [
    "company registration Salem",
    "private limited registration Tamil Nadu",
    "LLP registration Salem",
    "business registration Trichy",
    "company registration NammaOffice",
  ],
  openGraph: {
    title: "Company Registration Services | NammaOffice",
    description:
      "Hassle-free company registration services. Private Limited, LLP, OPC and more.",
  },
};

const included = [
  "Name availability search and reservation",
  "Digital Signature Certificate (DSC) for all directors",
  "Director Identification Number (DIN) application",
  "Memorandum and Articles of Association (MOA & AOA) drafting",
  "SPICe+ form filing with MCA",
  "Certificate of Incorporation",
  "PAN and TAN for the company",
  "GST registration (on request)",
  "Bank account opening assistance",
  "Post-incorporation compliance guidance",
];

const steps = [
  {
    step: 1,
    title: "Submit Your Details",
    description:
      "Fill out our company registration form with your proposed company name, type, number of directors, and contact details.",
  },
  {
    step: 2,
    title: "Documentation",
    description:
      "Our team collects KYC documents, drafts MOA & AOA, and prepares DSC and DIN applications for all directors.",
  },
  {
    step: 3,
    title: "Filing with MCA",
    description:
      "We file the SPICe+ form and all supporting documents with the Ministry of Corporate Affairs on your behalf.",
  },
  {
    step: 4,
    title: "Registration Complete",
    description:
      "Receive your Certificate of Incorporation, PAN, TAN, and all official documents. Your company is ready to do business.",
  },
];

export default function CompanyRegistrationPage() {
  return (
    <>
      <HeroBanner
        title="Company Registration Services"
        subtitle="From Private Limited to LLP — we handle the paperwork so you can focus on building your business."
      />

      {/* What's Included */}
      <section className="section-padding">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeading
                title="What's Included"
                centered={false}
                subtitle="Everything you need to get your company legally registered and operational."
                className="mb-8"
              />
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-sans text-sm text-warm-gray">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-terracotta flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Card className="p-8">
              <h2 className="font-serif text-2xl text-warm-charcoal mb-6">
                Get Started Today
              </h2>
              <CompanyRegistrationForm />
            </Card>
          </div>
        </div>
      </section>

      {/* Process Stepper */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <SectionHeading
            title="How It Works"
            subtitle="Four simple steps from enquiry to a registered company."
            className="mb-12"
          />
          <ProcessStepper steps={steps} />
        </div>
      </section>
    </>
  );
}
