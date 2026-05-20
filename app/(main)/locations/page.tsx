import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { cities, locations } from "@/lib/data/locations";

const totalCentres = locations.length;
const totalCities = cities.length;
const cityListAnd = cities
  .map((c) => c.name)
  .join(", ")
  .replace(/, ([^,]*)$/, " and $1");
const centreBreakdown = cities
  .map((c) => {
    const n = locations.filter((l) => l.city === c.slug).length;
    return `${c.name} (${n})`;
  })
  .join(", ");

export const metadata: Metadata = {
  title: `All Locations — ${totalCentres} Centres Across ${cityListAnd}`,
  description: `NammaOffice has ${totalCentres} centres across ${totalCities} cities — ${centreBreakdown}. Find your nearest premium coworking space.`,
};

export default function LocationsPage() {
  return (
    <>
      <HeroBanner
        eyebrow="Our Centres"
        title={`${totalCentres} centres. ${totalCities} cities.`}
        subtitle={`Find the NammaOffice nearest to you. Premium workspaces across ${cityListAnd}.`}
      />

      {cities.map((city) => {
        const cityLocations = locations.filter((l) => l.city === city.slug);
        if (cityLocations.length === 0) return null;

        return (
          <section key={city.slug} className="content-width py-14 md:py-20 first:pt-16">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <p className="eyebrow !text-[var(--color-gold-deep)]">{city.name}</p>
                <h2 className="font-display text-3xl md:text-4xl text-[var(--color-navy)] mt-2 leading-tight">
                  {city.tagline}
                </h2>
              </div>
              <p className="hidden md:block text-[13.5px] text-[var(--color-ink-secondary)] font-medium">
                {cityLocations.length} centre{cityLocations.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cityLocations.map((loc) => (
                <Link
                  key={`${loc.city}-${loc.slug}`}
                  href={`/locations/${loc.city}/${loc.slug}`}
                  className="group flex flex-col rounded-2xl bg-white border border-[var(--color-border)] overflow-hidden hover:shadow-[var(--shadow-brand-hover)] hover:border-[var(--color-gold-300)] transition-all"
                >
                  <div className="relative aspect-[5/3] bg-[var(--color-surface-alt)]">
                    {loc.images[0] && (
                      <Image
                        src={loc.images[0]}
                        alt={loc.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col gap-2">
                    <h3 className="font-display text-xl text-[var(--color-navy)] leading-tight">
                      {loc.name}
                    </h3>
                    <p className="text-[13px] text-[var(--color-ink-secondary)] inline-flex items-start gap-1.5 leading-snug">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 text-[var(--color-gold-deep)] shrink-0" strokeWidth={2} />
                      <span>{loc.address}</span>
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
                      <span className="text-[12px] text-[var(--color-ink-secondary)]">
                        {loc.workspaceTypes.length} workspace types
                      </span>
                      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-gold-deep)] transition-colors">
                        View details
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.25} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
