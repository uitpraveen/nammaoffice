import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { GoogleMap } from "@/components/ui/GoogleMap";
import { cities, getCity, getLocationsByCity } from "@/lib/data/locations";
import type { CitySlug } from "@/lib/types";

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCity(citySlug as CitySlug);
  if (!city) return {};
  return {
    title: city.seoTitle,
    description: city.seoDescription,
    openGraph: { title: city.seoTitle, description: city.seoDescription },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug as CitySlug);
  if (!city) notFound();

  const cityLocations = getLocationsByCity(city.slug as CitySlug);

  const avgLat =
    cityLocations.reduce((sum, l) => sum + l.coordinates.lat, 0) /
    (cityLocations.length || 1);
  const avgLng =
    cityLocations.reduce((sum, l) => sum + l.coordinates.lng, 0) /
    (cityLocations.length || 1);

  return (
    <>
      <HeroBanner eyebrow={`${cityLocations.length} centres in`} title={city.name} subtitle={city.tagline} />

      <section className="content-width py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="text-[15.5px] text-[var(--color-ink-secondary)] leading-relaxed">
            {city.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cityLocations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${city.slug}/${loc.slug}`}
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
                <span className="inline-flex items-center gap-1 mt-3 text-[13px] font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-gold-deep)] transition-colors">
                  View details
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.25} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO copy */}
      <section className="bg-[var(--color-surface-alt)] py-14">
        <div className="content-width max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl text-[var(--color-navy)]">
            Coworking space in {city.name}
          </h2>
          <p className="mt-4 text-[15px] text-[var(--color-ink-secondary)] leading-relaxed">
            {city.seoContent}
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="content-width py-14 md:py-20">
        <h2 className="font-display text-2xl md:text-3xl text-[var(--color-navy)] mb-6">
          Find us in {city.name}
        </h2>
        <GoogleMap
          lat={avgLat}
          lng={avgLng}
          title={`NammaOffice ${city.name} centres`}
          className="h-80 rounded-2xl overflow-hidden"
        />
      </section>
    </>
  );
}
