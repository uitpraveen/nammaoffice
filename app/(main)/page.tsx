import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { StoryStrip } from "@/components/sections/StoryStrip";
import { LocationsShowcase } from "@/components/sections/LocationsShowcase";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { StatsBand } from "@/components/sections/StatsBand";
import { AmenitiesShowcase } from "@/components/sections/AmenitiesShowcase";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home page - long-form parallax single-page that combines hero,
 * about story, locations showcase, stats, and amenities. The
 * Amenities section is anchored at #amenities and the nav menu
 * scrolls here directly - there is no separate /amenities route.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <HeroSection />
      <StoryStrip />
      <LocationsShowcase />
      <ClientLogos />
      <StatsBand />
      <AmenitiesShowcase />
    </>
  );
}
