"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { Expand } from "lucide-react";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

interface BaseProps {
  images: string[];
  locationName: string;
  cityName: string;
}

function buildSlides({ images, locationName, cityName }: BaseProps) {
  return images.map((src, i) => ({
    src,
    alt: `${locationName}, ${cityName} — photo ${i + 1}`,
    title: `${locationName}, ${cityName}`,
    description: `Photo ${i + 1} of ${images.length}`,
  }));
}

/**
 * Hero strip — featured 1 large + 2 smaller. Clicking any tile opens
 * the lightbox at that index (so users can keep scrubbing through the
 * full gallery from inside the viewer).
 */
export function LocationHeroStrip(props: BaseProps) {
  const { locationName, cityName } = props;
  // Drop any falsy entries: galleries are built from absolute indices into a
  // curated image pool, so culling a pool item can leave an out-of-range
  // `undefined`. Filtering keeps `<Image>` from receiving an empty src.
  const images = props.images.filter(Boolean);
  const [openAt, setOpenAt] = useState<number | null>(null);
  const open = useCallback((i: number) => setOpenAt(i), []);
  const close = useCallback(() => setOpenAt(null), []);
  const slides = buildSlides({ images, locationName, cityName });

  return (
    <>
      <section className="content-width pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 md:gap-3 rounded-2xl overflow-hidden h-auto md:h-[440px]">
          {images.slice(0, 3).map((src, i) => (
            <button
              type="button"
              key={`hero-${src}-${i}`}
              onClick={() => open(i)}
              aria-label={`Open photo ${i + 1} in viewer`}
              className={`relative bg-[var(--color-surface-alt)] group overflow-hidden cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] ${
                i === 0
                  ? "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto"
                  : "aspect-[5/3] md:aspect-auto"
              }`}
            >
              <Image
                src={src}
                alt={`${locationName}, ${cityName} — photo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                priority={i === 0}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm text-[var(--color-navy)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Expand className="w-4 h-4" strokeWidth={2.25} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <ImageLightbox
        open={openAt !== null}
        index={openAt ?? 0}
        slides={slides}
        onClose={close}
      />
    </>
  );
}

/**
 * "Inside the centre" — the remaining gallery shots beyond the hero
 * strip, rendered in a 2/3-col grid. Clicking opens the lightbox at
 * the global image index (offset +3 to skip the hero photos).
 */
export function LocationInsideGallery(props: BaseProps) {
  const { locationName, cityName } = props;
  // See LocationHeroStrip: filter falsy entries so a culled pool item can't
  // surface as an empty <Image> src.
  const images = props.images.filter(Boolean);
  const [openAt, setOpenAt] = useState<number | null>(null);
  const open = useCallback((i: number) => setOpenAt(i), []);
  const close = useCallback(() => setOpenAt(null), []);
  const slides = buildSlides({ images, locationName, cityName });
  const rest = images.slice(3);

  if (rest.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-2xl text-[var(--color-navy)] mb-5">
        Inside the centre
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {rest.map((src, i) => {
          const idx = i + 3;
          return (
            <button
              type="button"
              key={`gal-${src}-${idx}`}
              onClick={() => open(idx)}
              aria-label={`Open photo ${idx + 1} in viewer`}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-surface-alt)] group cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              <Image
                src={src}
                alt={`${locationName}, ${cityName} — gallery ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)]/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm text-[var(--color-navy)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Expand className="w-3.5 h-3.5" strokeWidth={2.25} />
              </span>
            </button>
          );
        })}
      </div>

      <ImageLightbox
        open={openAt !== null}
        index={openAt ?? 0}
        slides={slides}
        onClose={close}
      />
    </div>
  );
}
