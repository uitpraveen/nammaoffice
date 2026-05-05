import { HeroSection } from "@/components/sections/HeroSection";
import { LocationThumbnails } from "@/components/sections/LocationThumbnails";
import { AmenitiesPreview } from "@/components/sections/AmenitiesPreview";
import { CTASection } from "@/components/sections/CTASection";

/**
 * Home page — radically minimal per client feedback. Four sections:
 * Hero, all-centre thumbnails, amenities icon strip, CTA. Detail content
 * (process, why-us, comparisons) lives on inner pages.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LocationThumbnails />
      <AmenitiesPreview />
      <CTASection />
    </>
  );
}
