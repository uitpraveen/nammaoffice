import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";

export const metadata: Metadata = {
  title: "Terms & Conditions | NammaOffice",
  description:
    "NammaOffice Terms and Conditions — the rules governing use of our workspaces and services.",
};

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: `By accessing our website, booking a workspace, or becoming a member of NammaOffice, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.

These terms apply to all visitors, members, and others who access or use our services. NammaOffice reserves the right to modify these terms at any time, and continued use of our services after any changes constitutes acceptance of the updated terms.`,
  },
  {
    id: "services",
    title: "Services",
    content: `NammaOffice provides coworking spaces, private offices, meeting room facilities, virtual office services, and related business services across our centres in Salem, Trichy, Tirupur, Erode and Hosur.

Access to specific services depends on your membership plan. We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice to members. Service availability may vary by location.`,
  },
  {
    id: "user-obligations",
    title: "User Obligations",
    content: `Members and visitors agree to:

Use NammaOffice facilities in a professional and respectful manner that does not disturb other members or staff. Comply with all posted rules and policies at each centre, including those relating to noise, guest policies, and use of common areas.

Not engage in any illegal activities or activities that violate the rights of others while using our facilities. Maintain the cleanliness and condition of the workspace, and report any damage promptly. Not share access credentials or provide unauthorised access to non-members.`,
  },
  {
    id: "payment",
    title: "Payment",
    content: `All fees for workspace memberships, meeting room bookings, and services are due as specified in your membership agreement or booking confirmation. Monthly memberships are billed in advance.

Payments are non-refundable except as specified in our Refund Policy. We accept bank transfers, UPI payments, and cheques. Late payments may result in suspension of access. All prices are exclusive of applicable taxes (GST) unless stated otherwise.`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: `The NammaOffice name, logo, website content, and all associated intellectual property are the property of NammaOffice and are protected by applicable intellectual property laws.

You may not use our trademarks, logos, or branding without prior written consent. Members retain ownership of all work created while using NammaOffice facilities. NammaOffice claims no intellectual property rights over work created by its members.`,
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    content: `NammaOffice shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or facilities, even if we have been advised of the possibility of such damages.

Our total liability to you for any claim arising from your use of our services shall not exceed the amount you paid for the service giving rise to the claim in the month preceding the claim. NammaOffice is not responsible for the loss, theft, or damage of personal property brought into our centres.`,
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any dispute arising from these terms shall be subject to the exclusive jurisdiction of the courts in Salem, Tamil Nadu.

If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. These terms constitute the entire agreement between you and NammaOffice with respect to your use of our services.`,
  },
];

export default function TermsConditionsPage() {
  return (
    <>
      <HeroBanner
        title="Terms & Conditions"
        subtitle="The terms that govern your use of NammaOffice workspaces and services."
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
                These Terms and Conditions (&ldquo;Terms&rdquo;) govern your relationship with
                NammaOffice and your use of our coworking spaces, services, and website.
                Please read these terms carefully before using our services.
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
