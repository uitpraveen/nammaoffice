"use client";

import { useState } from "react";
import Script from "next/script";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { faqs, getFaqsByCategory } from "@/lib/data/faqs";
import type { FAQItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type Category = FAQItem["category"];

const categories: { value: Category; label: string }[] = [
  { value: "general", label: "General" },
  { value: "pricing", label: "Pricing" },
  { value: "locations", label: "Locations" },
  { value: "franchise", label: "Franchise" },
  { value: "services", label: "Services" },
];

const faqSchemaContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("general");

  const filteredFaqs = getFaqsByCategory(activeCategory);

  return (
    <>
      {/* FAQ JSON-LD Schema — static data only, no user input */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {faqSchemaContent}
      </Script>

      <HeroBanner
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about NammaOffice — from memberships and pricing to locations and franchise opportunities."
      />

      <section className="section-padding">
        <div className="content-width">
          <div className="max-w-3xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center" role="tablist" aria-label="FAQ categories">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  role="tab"
                  aria-selected={activeCategory === cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={cn(
                    "px-5 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200",
                    activeCategory === cat.value
                      ? "bg-terracotta text-white"
                      : "bg-sand text-warm-gray hover:bg-sand-300"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            {filteredFaqs.length > 0 ? (
              <Accordion
                items={filteredFaqs.map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                }))}
              />
            ) : (
              <p className="text-center font-sans text-warm-gray py-8">
                No FAQs in this category yet.
              </p>
            )}

            {/* Bottom CTA */}
            <div className="mt-14 text-center bg-sand-50 rounded-brand p-8">
              <SectionHeading
                title="Didn't find your answer?"
                subtitle="Our team is happy to answer any question you have about workspaces, pricing, or availability."
                className="mb-6"
              />
              <Button href="/contact" variant="primary" size="md">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
