"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { locations } from "@/lib/data/locations";
import { fadeUp } from "@/lib/motion";

/**
 * Centres bento grid (ported from Elevate). 10 centres from
 * lib/data/locations laid out in a 12-col asymmetric grid. Each card
 * pairs an Elevate-pooled photograph with the centre's real name and
 * full address, and links to the centre's detail page.
 */

const bentoImages = [
  "/images/elevate/bento-cabin.jpg",
  "/images/elevate/bento-open.jpg",
  "/images/elevate/bento-meeting.jpg",
  "/images/elevate/bento-lounge.jpg",
  "/images/elevate/bento-cafe.jpg",
  "/images/elevate/bento-facade.jpg",
];

// 10 layout slots in 12-col grid order — sums per row to 12 where possible.
// Designed so the largest "anchor" card breaks the rhythm on row 1.
const layoutSlots: { span: string; aspect: string }[] = [
  { span: "md:col-span-7", aspect: "aspect-[16/10]" }, // 0 — flagship
  { span: "md:col-span-5", aspect: "aspect-[4/3]" },   // 1
  { span: "md:col-span-5", aspect: "aspect-[4/3]" },   // 2
  { span: "md:col-span-4", aspect: "aspect-square" },  // 3
  { span: "md:col-span-3", aspect: "aspect-[4/3]" },   // 4
  { span: "md:col-span-4", aspect: "aspect-[4/3]" },   // 5
  { span: "md:col-span-4", aspect: "aspect-[4/3]" },   // 6
  { span: "md:col-span-4", aspect: "aspect-[4/3]" },   // 7
  { span: "md:col-span-8", aspect: "aspect-[16/9]" },  // 8 — wide
  { span: "md:col-span-4", aspect: "aspect-[4/3]" },   // 9
];

const cityLabel: Record<string, string> = {
  salem: "Salem",
  trichy: "Trichy",
  tirupur: "Tirupur",
  erode: "Erode",
  hosur: "Hosur",
};

interface LocationsShowcaseProps {
  /** Hide the "View all centres" affordance — useful when the bento is
   * itself the /locations page and the link would loop back. */
  hideViewAll?: boolean;
  /** Override the eyebrow text above the headline. */
  eyebrow?: string;
}

export function LocationsShowcase({
  hideViewAll = false,
  eyebrow = "Centres",
}: LocationsShowcaseProps = {}) {
  const totalCities = new Set(locations.map((l) => l.city)).size;
  return (
    <section id="centres" className="bg-canvas-alt-grid py-24 md:py-32">
      <div className="content-width relative z-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <motion.p {...fadeUp} className="eyebrow mb-6">
              {eyebrow}
            </motion.p>
            <motion.h2
              {...fadeUp}
              className="display text-[40px] md:text-[64px] max-w-[18ch]"
              style={{ color: "var(--ink)" }}
            >
              {locations.length === 10 ? "Ten" : locations.length} centres.{" "}
              {totalCities === 5 ? "Five" : totalCities} cities.{" "}
              <span className="display-italic">One ecosystem.</span>
            </motion.h2>
          </div>
          {!hideViewAll && (
            <motion.div {...fadeUp}>
              <Link
                href="/locations"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium border-b pb-0.5"
                style={{ borderColor: "var(--border)", color: "var(--ink)" }}
              >
                View all centres{" "}
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </Link>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {locations.map((loc, i) => {
            const slot = layoutSlots[i] ?? layoutSlots[layoutSlots.length - 1];
            const img = bentoImages[i % bentoImages.length];
            return (
              <motion.div
                key={`${loc.city}-${loc.slug}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: (i % 3) * 0.05,
                }}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden rounded-3xl border hairline transition-all ${slot.span}`}
                style={{ background: "var(--card)" }}
              >
                <Link
                  href={`/locations/${loc.city}/${loc.slug}`}
                  className="block"
                  aria-label={`${loc.name} — ${cityLabel[loc.city] ?? loc.city}`}
                >
                  <div className={`relative ${slot.aspect} overflow-hidden`}>
                    <Image
                      src={img}
                      alt={`${loc.name}, ${cityLabel[loc.city] ?? loc.city}`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(14,14,14,0.55) 0%, rgba(14,14,14,0) 50%)",
                      }}
                    />
                    <div
                      className="absolute top-4 left-4 eyebrow text-white/85 px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(14,14,14,0.45)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {cityLabel[loc.city] ?? loc.city}
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3
                          className="display text-[20px] md:text-[22px] leading-tight"
                          style={{ color: "var(--ink)" }}
                        >
                          {loc.name}
                        </h3>
                        <p
                          className="mt-2 text-[13px] leading-[1.55] line-clamp-2"
                          style={{ color: "var(--ink-muted)" }}
                        >
                          {loc.address}
                        </p>
                      </div>
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-full border hairline flex items-center justify-center transition-all group-hover:translate-x-1 group-hover:-translate-y-1"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        <ArrowUpRight
                          className="w-3.5 h-3.5"
                          strokeWidth={1.75}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
