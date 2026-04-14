import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cities } from "@/lib/data/locations";

// Distinct gradient per city
const cityGradients: Record<string, string> = {
  salem: "bg-gradient-to-br from-terracotta-700 to-terracotta-900",
  trichy: "bg-gradient-to-br from-olive-600 to-olive-900",
  tirupur: "bg-gradient-to-br from-warm-charcoal to-terracotta-800",
};

export function CityCardsSection() {
  return (
    <section className="section-padding bg-sand">
      <div className="content-width">
        <SectionHeading
          title="Find Us in Your City"
          subtitle="Premium coworking centres strategically located across Tamil Nadu's fastest-growing business cities."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Card key={city.slug} hover className="relative overflow-hidden">
              {/* Large placeholder image area */}
              <div
                className={`h-64 relative flex items-end ${cityGradients[city.slug] ?? "bg-gradient-to-br from-warm-charcoal to-terracotta-800"}`}
              >
                {/* City name watermark */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-5xl text-white/10 select-none pointer-events-none whitespace-nowrap">
                  {city.name}
                </span>

                {/* Bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="relative z-10 p-5 w-full flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-white">
                      {city.name}
                    </h3>
                    <p className="text-white/70 font-sans text-sm mt-0.5">
                      {city.centreCount}{" "}
                      {city.centreCount === 1 ? "Centre" : "Centres"}
                    </p>
                  </div>
                  <Button
                    href={`/locations/${city.slug}`}
                    variant="primary"
                    size="sm"
                    className="shrink-0"
                  >
                    Explore
                  </Button>
                </div>
              </div>

              {/* Tagline below image */}
              <div className="p-4">
                <p className="text-warm-gray font-sans text-sm">
                  {city.tagline}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
