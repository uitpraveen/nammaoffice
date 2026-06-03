import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
  description:
    "NammaOffice Privacy Policy - how we collect, use, and protect your personal information.",
};

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: `We collect information you provide directly to us when you register for a workspace, fill out an enquiry form, book a tour, or communicate with us. This includes your name, email address, phone number, company name, and any other details you choose to provide.

We also collect information automatically when you use our website, including your IP address, browser type, pages visited, and time spent on pages. This information is collected through cookies and similar technologies.`,
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve our services, including processing workspace enquiries and bookings, communicating with you about your membership or enquiry, sending you service updates and promotional materials (you may opt out at any time), and analysing usage patterns to improve our website and services.

We do not sell, trade, or rent your personal information to third parties for their marketing purposes.`,
  },
  {
    id: "data-security",
    title: "Data Security",
    content: `We take the security of your personal data seriously. We implement appropriate technical and organisational measures to protect your information against unauthorised access, disclosure, alteration, or destruction.

Our website uses HTTPS encryption for all data transmitted between your browser and our servers. Access to personal data is restricted to authorised personnel who need it to perform their duties.

While we strive to protect your personal information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of data transmitted to our website.`,
  },
  {
    id: "cookies",
    title: "Cookies",
    content: `Our website uses cookies - small text files stored on your device - to enhance your browsing experience and analyse website traffic. We use session cookies (which expire when you close your browser) and persistent cookies (which remain until deleted or expired).

You can control cookie settings through your browser preferences. Note that disabling cookies may affect the functionality of certain features of our website. We use Google Analytics and similar analytics tools to understand website usage; these tools may set their own cookies.`,
  },
  {
    id: "third-parties",
    title: "Third Parties",
    content: `We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business, such as email service providers, analytics platforms, and payment processors. These parties are contractually obligated to keep your information confidential and use it only for the purpose of providing services to us.

We may also disclose your information if required by law, regulation, or legal process, or to protect the rights, property, or safety of NammaOffice, our members, or the public.`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: `You have the right to access the personal information we hold about you. You may request a copy of your data, ask us to correct inaccurate information, or request that we delete your personal data, subject to legal requirements.

To exercise these rights, please contact us at info@nammaoffice.com. We will respond to your request within 30 days. You also have the right to opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or our data practices, please contact us at:

NammaOffice
Email: info@nammaoffice.com
Phone: +91 9092109213

This Privacy Policy was last updated on January 2025. We may update this policy periodically, and we will notify you of significant changes by posting the new policy on this page.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <HeroBanner
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information."
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
              <div className="prose prose-slate max-w-none">
                <p className="font-sans text-warm-gray text-sm leading-relaxed mb-8">
                  At NammaOffice, we are committed to protecting the privacy and security
                  of your personal information. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit our website
                  or use our services.
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
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
