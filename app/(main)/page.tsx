import { HeroSection } from "@/components/sections/HeroSection";
import { LocationThumbnails } from "@/components/sections/LocationThumbnails";
import { StatsBand } from "@/components/sections/StatsBand";
import { AmenitiesPreview } from "@/components/sections/AmenitiesPreview";

/**
 * Home page — Glass / SaaS rhythm:
 *   dark hero → light thumbnails → dark stats band → cream amenities → cream footer
 * One mid-page dark moment for visual rhythm; otherwise minimal copy.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LocationThumbnails />
      <StatsBand />
      <AmenitiesPreview />
    </>
  );
}
