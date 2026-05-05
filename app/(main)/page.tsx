import { HeroSection } from "@/components/sections/HeroSection";
import { LocationThumbnails } from "@/components/sections/LocationThumbnails";
import { AmenitiesPreview } from "@/components/sections/AmenitiesPreview";

/**
 * Home page — radically minimal per repeated client feedback. Three
 * sections: Hero, all-centre thumbnails, amenities icon strip. The
 * single conversion CTA lives in the footer; a dedicated dark CTA
 * band on top of the footer felt like double-dipping.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LocationThumbnails />
      <AmenitiesPreview />
    </>
  );
}
