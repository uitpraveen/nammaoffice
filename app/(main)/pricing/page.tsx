import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Pricing — Flexible Workspace Plans | NammaOffice",
  description:
    "Find the right workspace plan at NammaOffice. Compare private cabins, open desks, cubicles, meeting halls, business lounges, and managed offices across Salem, Trichy, and Tirupur.",
  keywords: [
    "coworking pricing Salem",
    "private cabin cost Tamil Nadu",
    "workspace plans NammaOffice",
    "flexible office pricing",
  ],
  openGraph: {
    title: "Pricing — Flexible Workspace Plans | NammaOffice",
    description:
      "Compare workspace types and find the right plan for your business at NammaOffice.",
  },
};

export default function PricingPage() {
  return (
    <>
      <HeroBanner
        title="Find the Right Workspace"
        subtitle="Flexible plans for freelancers, startups, and enterprises. Compare workspace types and let us tailor the perfect plan for you."
      />

      {/* Comparison Table */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="Compare All Workspace Types"
            subtitle="Side-by-side view of features, amenities, and availability across all our workspace options."
            className="mb-12"
          />
          <ComparisonTable />
        </div>
      </section>

      {/* Enquiry Section */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              title="Every team is unique. Let's find your perfect plan."
              subtitle="Tell us about your requirements and we'll get back with a personalised quote."
              className="mb-10"
            />
            <Card className="p-8">
              <EnquiryForm />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
