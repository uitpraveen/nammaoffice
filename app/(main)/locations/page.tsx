import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTASection } from "@/components/sections/CTASection";
import { getPageSEO } from "@/lib/data/seo";
import { cities } from "@/lib/data/locations";
import LocationsSearch from "./LocationsSearch";

export function generateMetadata(): Metadata {
  const seo = getPageSEO("/locations");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}

// City gradient colors
const cityGradients: Record<string, string> = {
  salem: "from-terracotta-700 to-terracotta-400",
  trichy: "from-olive-700 to-olive-400",
  tirupur: "from-warm-charcoal to-warm-gray",
};

export default function LocationsPage() {
  return (
    <>
      <HeroBanner
        title="Our Locations"
        subtitle="7 centres across Salem, Trichy, and Tirupur — find your nearest NammaOffice."
      />

      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="Find Us in Your City"
            subtitle="We're present across Tamil Nadu's fastest-growing cities with premium coworking infrastructure."
            className="mb-12"
          />

          {/* Client-side search + city cards */}
          <LocationsSearch
            cities={cities.map((city) => ({
              ...city,
              gradient: cityGradients[city.slug] ?? "from-warm-charcoal to-warm-gray",
            }))}
          />
        </div>
      </section>

      <CTASection />
    </>
  );
}
