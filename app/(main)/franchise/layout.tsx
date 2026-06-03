import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schemas";
import { getFaqsByCategory } from "@/lib/data/faqs";

// The franchise page itself is a client component, so its SEO metadata +
// structured data live here in a server-rendered route layout.
export const metadata: Metadata = {
  title: "Franchise Opportunity",
  description:
    "Partner with NammaOffice to launch a premium coworking centre in your city - proven playbook, brand, member demand, and end-to-end support from real estate to operations.",
  alternates: { canonical: "/franchise" },
  openGraph: {
    title: "NammaOffice Franchise Opportunity",
    description:
      "Own a premium coworking brand in your city - backed by a proven playbook and full operational support.",
    url: "/franchise",
    images: ["/images/elevate/franchise-hero.jpg"],
  },
};

export default function FranchiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const franchiseFaqs = getFaqsByCategory("franchise");
  return (
    <>
      <JsonLd data={faqSchema(franchiseFaqs)} />
      {children}
    </>
  );
}
