import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";

export const metadata: Metadata = {
  title: "Refund Policy",
  alternates: { canonical: "/refund-policy" },
  description:
    "NammaOffice Refund Policy - eligibility, process, and timelines for membership and service refunds.",
};

const sections = [
  {
    id: "eligibility",
    title: "Eligibility",
    content: `NammaOffice offers refunds under the following circumstances:

Membership cancellation with more than 7 days' notice before the next billing cycle: a pro-rated refund for unused days in the current period will be issued.

Meeting room and event space bookings cancelled with at least 24 hours' notice are eligible for a full refund or credit. Cancellations with less than 24 hours' notice will not be refunded.

Virtual office and service subscriptions cancelled within the first 7 days of the initial term are eligible for a refund if no services have been rendered (e.g., no mail has been received, no documentation has been issued).

Non-refundable items include setup fees, registration fees, day passes (once activated), and any services that have already been delivered.`,
  },
  {
    id: "process",
    title: "Refund Process",
    content: `To request a refund, please contact us through one of the following channels:

Email: info@nammaoffice.com with subject line "Refund Request - [Your Name/Membership ID]"
Phone: +91 9092109213
In person at your NammaOffice centre

Please provide your full name, membership ID, the service for which you are requesting a refund, and the reason for the refund request.

Our team will review your request and respond within 2 business days to confirm eligibility and next steps. All refund requests must be submitted within 30 days of the charge or service date.`,
  },
  {
    id: "timeline",
    title: "Timeline",
    content: `Once your refund request has been approved, the following timelines apply:

Bank transfers and NEFT/RTGS refunds: 5–7 business days from approval.

UPI payments: 2–3 business days from approval.

Cheque refunds: 7–10 business days from approval.

Credit card refunds (if applicable): 7–14 business days from approval, subject to your bank's processing time.

NammaOffice credit (applicable to future use): applied to your account within 1 business day.

Please note that all timelines are estimates and may vary based on banking procedures and public holidays.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have any questions about our refund policy or would like to discuss your specific situation, please don't hesitate to reach out:

NammaOffice
Email: info@nammaoffice.com
Phone: +91 9092109213
WhatsApp: +91 9092109213

Our team is available Monday to Saturday, 8:00 AM to 9:00 PM, and we are committed to resolving all refund queries fairly and promptly.`,
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <HeroBanner
        title="Refund Policy"
        subtitle="Our commitment to fair and transparent refund processes."
      />

      <section className="section-padding">
        <div className="content-width">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: Table of Contents (sticky) */}
            <aside className="lg:sticky lg:top-8 lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-brand shadow-brand border border-warm-border p-6">
                <h2 className="font-serif text-lg text-warm-charcoal mb-4">Contents</h2>
                <nav>
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="font-sans text-sm text-warm-gray hover:text-terracotta transition-colors leading-relaxed block"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Right: Content */}
            <article className="flex-1 min-w-0">
              <p className="font-sans text-warm-gray text-sm leading-relaxed mb-8">
                NammaOffice is committed to fair and transparent pricing. This Refund
                Policy outlines the conditions under which refunds are issued and the
                process for making a refund request. If you have any questions, our
                team is always happy to help.
              </p>

              {sections.map((section) => (
                <div key={section.id} id={section.id} className="mb-10 scroll-mt-8">
                  <h2 className="font-serif text-2xl text-warm-charcoal mb-4">
                    {section.title}
                  </h2>
                  {section.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="font-sans text-warm-gray text-sm leading-relaxed mb-3">
                      {paragraph}
                    </p>
                  ))}
                  <div className="border-b border-warm-border mt-8" />
                </div>
              ))}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
