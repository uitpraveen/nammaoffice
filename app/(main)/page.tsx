import { HeroSection } from "@/components/sections/HeroSection";
import { CityCardsSection } from "@/components/sections/CityCardsSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { AmenitiesPreview } from "@/components/sections/AmenitiesPreview";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CityCardsSection />
      <HowItWorks />
      <WhyChooseUs />
      <AmenitiesPreview />
      <CTASection />
    </>
  );
}
