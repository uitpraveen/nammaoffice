import { HeroSection } from "@/components/sections/HeroSection";
import { StoryStrip } from "@/components/sections/StoryStrip";
import { LocationsShowcase } from "@/components/sections/LocationsShowcase";
import { StatsBand } from "@/components/sections/StatsBand";
import { AmenitiesShowcase } from "@/components/sections/AmenitiesShowcase";

/**
 * Home page — long-form parallax single-page that combines hero,
 * about story, locations showcase, stats, and amenities. Each section
 * uses scroll-driven animation (parallax photos, sticky text panels,
 * stagger reveals) so the page reads like a magazine spread.
 *
 * /about, /amenities, /locations still exist as standalone pages for
 * SEO + direct linking; the rich content here is the main marketing
 * surface.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StoryStrip />
      <LocationsShowcase />
      <StatsBand />
      <AmenitiesShowcase />
    </>
  );
}
