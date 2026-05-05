import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { cities } from "@/lib/data/locations";
import { locationPhotos, noImageUrl } from "@/lib/data/nammaoffice-images";

export function CityCardsSection() {
  return (
    <section className="section-padding bg-white border-y border-[var(--color-border)]">
      <div className="content-width">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <p className="eyebrow">Cities</p>
            <h2 className="display-lg mt-3 text-[var(--color-ink)]">Find us in your city.</h2>
            <p className="mt-4 text-[16px] text-[var(--color-ink-secondary)] leading-relaxed max-w-lg">
              Premium centres in Tamil Nadu&apos;s fastest-growing business
              districts. More cities coming soon.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cities.map((city) => {
            const img = locationPhotos[city.slug];
            return (
              <Link
                key={city.slug}
                href={`/locations/${city.slug}`}
                className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)]"
              >
                {img && (
                  <Image
                    src={noImageUrl(img)}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/85 via-[#0A0A0A]/20 to-transparent" />

                <div className="absolute top-5 left-5">
                  <div className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white/95 backdrop-blur-sm text-[var(--color-ink)] text-[12px] font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={2.25} />
                    {city.centreCount} {city.centreCount === 1 ? "centre" : "centres"}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-[28px] font-bold tracking-[-0.02em] leading-tight">
                    {city.name}
                  </h3>
                  <p className="mt-2 text-white/75 text-[13.5px] leading-relaxed line-clamp-2">
                    {city.tagline}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-white text-[13px] font-semibold">
                    Visit
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
