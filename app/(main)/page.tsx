import { HeroSection } from "@/components/sections/HeroSection";
import { WorkspaceCardsGrid } from "@/components/sections/WorkspaceCardsGrid";
import { CityCardsSection } from "@/components/sections/CityCardsSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { StatsBanner } from "@/components/sections/StatsBanner";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WorkspaceCardsGrid />
      <CityCardsSection />
      <WhyChooseUs />
      <StatsBanner />
      <TestimonialsSlider />
      <ClientLogos />
      <CTASection />
    </>
  );
}
