import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { locations } from "@/lib/data/locations";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact NammaOffice — Book a Tour or Get in Touch",
  description:
    "Contact NammaOffice to book a workspace tour, get pricing information, or make an enquiry. Call +91 9092109213, WhatsApp, or fill out our contact form.",
  keywords: [
    "contact NammaOffice",
    "coworking enquiry Salem",
    "book office tour Tamil Nadu",
  ],
  openGraph: {
    title: "Contact NammaOffice — Book a Tour or Get in Touch",
    description:
      "Reach out to NammaOffice. We're here to help you find the perfect workspace.",
  },
};

export default function ContactPage() {
  return (
    <>
      <HeroBanner
        title="Get in Touch"
        subtitle="Have a question or ready to book a workspace? We'd love to hear from you."
      />

      <section className="section-padding">
        <div className="content-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Form */}
            <div>
              <SectionHeading
                title="Send Us a Message"
                centered={false}
                subtitle="Fill out the form and we'll respond within one business day."
                className="mb-8"
              />
              <ContactForm />
            </div>

            {/* Right: Location Details */}
            <div>
              <SectionHeading
                title="Our Locations"
                centered={false}
                subtitle="Walk in or call us directly at any of our 7 centres."
                className="mb-8"
              />

              <div className="space-y-6">
                {locations.map((location) => (
                  <div
                    key={`${location.city}-${location.slug}`}
                    className="bg-white rounded-brand shadow-brand p-5 border border-warm-border"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-serif text-lg text-warm-charcoal">
                          {location.name}
                        </h3>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium font-sans bg-sand text-warm-gray capitalize">
                          {location.city}
                        </span>
                      </div>
                    </div>

                    <address className="not-italic space-y-2">
                      <p className="font-sans text-sm text-warm-gray flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta flex-shrink-0 mt-0.5" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {location.address}
                      </p>
                      <p className="font-sans text-sm text-warm-gray flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta flex-shrink-0" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.59 4.87a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <a href={`tel:${location.phone.replace(/\s/g, "")}`} className="hover:text-terracotta transition-colors">
                          {location.phone}
                        </a>
                      </p>
                      <p className="font-sans text-sm text-warm-gray flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta flex-shrink-0" aria-hidden="true">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <a href={`mailto:${location.email}`} className="hover:text-terracotta transition-colors">
                          {location.email}
                        </a>
                      </p>
                      <p className="font-sans text-sm text-warm-gray flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta flex-shrink-0" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {location.operatingHours}
                      </p>
                    </address>
                  </div>
                ))}
              </div>

              {/* Operating Hours and Social */}
              <div className="mt-8 bg-white rounded-brand shadow-brand p-5 border border-warm-border">
                <h3 className="font-serif text-lg text-warm-charcoal mb-3">Operating Hours</h3>
                <p className="font-sans text-sm text-warm-gray mb-1">
                  <strong className="font-medium text-warm-charcoal">Monday – Saturday:</strong> 8:00 AM – 9:00 PM
                </p>
                <p className="font-sans text-sm text-warm-gray mb-6">
                  Members with 24/7 plans have round-the-clock biometric access.
                </p>

                <h3 className="font-serif text-lg text-warm-charcoal mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a
                    href={BRAND.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-brand bg-sand flex items-center justify-center text-warm-gray hover:text-terracotta hover:bg-terracotta-50 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  <a
                    href={BRAND.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-brand bg-sand flex items-center justify-center text-warm-gray hover:text-terracotta hover:bg-terracotta-50 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                  <a
                    href={BRAND.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-brand bg-sand flex items-center justify-center text-warm-gray hover:text-terracotta hover:bg-terracotta-50 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://wa.me/${BRAND.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-brand bg-sand flex items-center justify-center text-warm-gray hover:text-terracotta hover:bg-terracotta-50 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
