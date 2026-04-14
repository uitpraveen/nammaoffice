import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { BookTourForm } from "@/components/forms/BookTourForm";

export const metadata: Metadata = {
  title: "Book a Tour — Visit a NammaOffice Centre | NammaOffice",
  description:
    "Book a free tour of any NammaOffice centre in Salem, Trichy, or Tirupur. See the workspace, meet the team, and find your perfect plan. Tours confirmed within 24 hours.",
  keywords: [
    "book office tour Salem",
    "coworking tour Trichy",
    "visit NammaOffice Tirupur",
    "workspace tour Tamil Nadu",
  ],
  openGraph: {
    title: "Book a Tour — Visit a NammaOffice Centre",
    description:
      "Book a free tour of any NammaOffice centre. Confirmed within 24 hours.",
  },
};

export default function BookTourPage() {
  return (
    <>
      <HeroBanner
        title="Book a Tour"
        subtitle="See the space, meet the team, and experience NammaOffice before you commit. Tours are free and take about 30 minutes."
      />

      <section className="section-padding">
        <div className="content-width">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              title="Schedule Your Visit"
              subtitle="Choose your preferred NammaOffice centre, workspace type, and time slot."
              className="mb-10"
            />

            <Card className="p-8">
              <BookTourForm />
            </Card>

            <p className="text-center font-sans text-sm text-warm-gray mt-6">
              We&apos;ll confirm your tour within 24 hours via call or WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
