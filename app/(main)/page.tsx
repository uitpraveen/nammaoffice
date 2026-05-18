import { HeroSection } from "@/components/sections/HeroSection";
import { StoryStrip } from "@/components/sections/StoryStrip";
import { LocationsShowcase } from "@/components/sections/LocationsShowcase";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { StatsBand } from "@/components/sections/StatsBand";
import { AmenitiesShowcase } from "@/components/sections/AmenitiesShowcase";

/**
 * Home page — long-form parallax single-page that combines hero,
 * about story, locations showcase, stats, and amenities. The
 * Amenities section is anchored at #amenities and the nav menu
 * scrolls here directly — there is no separate /amenities route.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StoryStrip />
      <LocationsShowcase />
      <ClientLogos />
      <StatsBand />
      <AmenitiesShowcase />
    </>
  );
}
