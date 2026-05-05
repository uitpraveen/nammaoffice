import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { cities, locations } from "@/lib/data/locations";

/**
 * Home-page locations grid: a thumbnail per centre. Image-led, minimal copy
 * — name, city tag, and one-line address. Click → centre detail page where
 * the heavier content (amenities, workspaces, map) lives.
 */
export function LocationThumbnails() {
  const cityName = (slug: string) =>
    cities.find((c) => c.slug === slug)?.name ??
    slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <section className="section-padding bg-white border-y border-[var(--color-border)]">
      <div className="content-width">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <p className="eyebrow">Centres</p>
            <h2 className="display-lg mt-3 text-[var(--color-purple)]">
              8 centres. 3 cities. One ecosystem.
            </h2>
          </div>
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-purple)] hover:text-[var(--color-gold-deep)] transition-colors"
          >
            View all centres
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {locations.map((loc) => (
            <Link
              key={`${loc.city}-${loc.slug}`}
              href={`/locations/${loc.city}/${loc.slug}`}
              className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)] transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(215,38,96,0.55),0_20px_40px_-12px_rgba(215,38,96,0.30)] hover:-translate-y-0.5"
            >
              {loc.images[0] && (
                <Image
                  src={loc.images[0]}
                  alt={`${loc.name}, ${cityName(loc.city)}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-purple-deep)]/85 via-[var(--color-purple-deep)]/25 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center text-[10.5px] font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded bg-white/95 text-[var(--color-purple)]">
                  {cityName(loc.city)}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-white text-[22px] md:text-[24px] font-bold leading-tight tracking-[-0.01em]">
                  {loc.name}
                </h3>
                <p className="mt-1.5 text-white/75 text-[12.5px] leading-snug inline-flex items-start gap-1">
                  <MapPin className="w-3 h-3 mt-1 shrink-0" strokeWidth={2.25} />
                  <span className="line-clamp-1">{loc.address}</span>
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[var(--color-gold-300)] text-[12.5px] font-semibold">
                  View centre
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
