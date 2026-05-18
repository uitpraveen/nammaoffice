"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";
import { cities, locations } from "@/lib/data/locations";

/**
 * Locations showcase — a richer replacement for the previous flat
 * thumbnails grid. The section header pins as the cards animate in
 * with stagger, and each card photo has subtle parallax as it crosses
 * the viewport.
 */
export function LocationsShowcase() {
  const cityName = (slug: string) =>
    cities.find((c) => c.slug === slug)?.name ??
    slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <section id="centres" className="bg-white border-y border-[var(--color-border)] py-20 md:py-28">
      <div className="content-width">
        {/* Header — fades up as it enters viewport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14"
        >
          <div className="max-w-2xl">
            <p className="eyebrow">Centres</p>
            <h2 className="display-lg mt-3 text-[var(--color-navy)]">
              Eight centres.{" "}
              <span className="text-[var(--color-gold-deep)] italic font-normal">
                Three cities.
              </span>
              <br />
              One ecosystem.
            </h2>
          </div>
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-navy)] hover:text-[var(--color-gold-deep)] transition-colors group"
          >
            View all centres
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              strokeWidth={2.25}
            />
          </Link>
        </motion.div>

        {/* Cards — stagger reveal, each card holds its own parallax photo */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {locations.map((loc) => (
            <CentreCard
              key={`${loc.city}-${loc.slug}`}
              href={`/locations/${loc.city}/${loc.slug}`}
              image={loc.images[0]}
              name={loc.name}
              cityTag={cityName(loc.city)}
              address={loc.address}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CentreCard({
  href,
  image,
  name,
  cityTag,
  address,
}: {
  href: string;
  image: string;
  name: string;
  cityTag: string;
  address: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [25, -25]);

  return (
    <motion.a
      ref={ref}
      href={href}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)] transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(184,85,58,0.50),0_24px_48px_-16px_rgba(184,85,58,0.30)] hover:-translate-y-0.5"
    >
      <motion.div style={{ y }} className="absolute -inset-y-8 inset-x-0">
        {image && (
          <Image
            src={image}
            alt={`${name}, ${cityTag}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)]/85 via-[var(--color-charcoal)]/25 to-transparent" />

      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center text-[10.5px] font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded bg-white/95 text-[var(--color-navy)]">
          {cityTag}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-white text-[22px] md:text-[24px] font-bold leading-tight tracking-[-0.01em]">
          {name}
        </h3>
        <p className="mt-1.5 text-white/75 text-[12.5px] leading-snug inline-flex items-start gap-1">
          <MapPin className="w-3 h-3 mt-1 shrink-0" strokeWidth={2.25} />
          <span className="line-clamp-1">{address}</span>
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-[var(--color-gold-300)] text-[12.5px] font-semibold">
          View centre
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.25}
          />
        </span>
      </div>
    </motion.a>
  );
}
