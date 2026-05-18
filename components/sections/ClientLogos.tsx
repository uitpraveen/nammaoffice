"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { clients } from "@/lib/data/clients";

/**
 * Client-logo strip — two horizontal marquees that counter-scroll past
 * each other. Logos are rendered as floating wordmarks (no card frame)
 * with a grayscale wash applied site-wide; hover (or tap on touch)
 * restores the original colour. The two opposing rows + restrained
 * monochrome treatment give the section editorial weight without
 * competing with the rest of the page.
 *
 * Each row's content is duplicated so when the first copy slides off
 * the left edge the second copy is already in position to take its
 * place — produces a seamless infinite loop.
 */
export function ClientLogos() {
  // Split clients across two rows (alternating ids for a varied mix).
  const half = Math.ceil(clients.length / 2);
  const row1 = clients.slice(0, half);
  const row2 = clients.slice(half);

  return (
    <section id="clients" className="relative bg-[var(--color-bg)] py-20 md:py-28 overflow-hidden border-y border-[var(--color-border)]">
      {/* Soft top + bottom rules in brick to differentiate the section
          from neighbouring cream surfaces. */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-300)]/40 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-300)]/40 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="content-width text-center mb-12 md:mb-16"
      >
        <p className="eyebrow">Our clients</p>
        <h2 className="display-md mt-3 text-[var(--color-navy)]">
          {clients.length} brands.{" "}
          <span className="text-[var(--color-gold-deep)] italic font-normal">
            One ecosystem.
          </span>
        </h2>
        <p className="mt-4 text-[15px] text-[var(--color-ink-secondary)] leading-relaxed max-w-xl mx-auto">
          From global PSUs and multinational pathology chains to Salem-born SaaS founders — every brand below builds, meets, or hosts from a NammaOffice centre.
        </p>
      </motion.div>

      <Marquee items={row1} direction="left" speedSec={70} />
      <div className="h-8 md:h-12" />
      <Marquee items={row2} direction="right" speedSec={90} />

      {/* Edge fade masks for both rows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-40 z-10"
        style={{
          background:
            "linear-gradient(90deg, var(--color-bg) 0%, var(--color-bg) 30%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-40 z-10"
        style={{
          background:
            "linear-gradient(270deg, var(--color-bg) 0%, var(--color-bg) 30%, transparent 100%)",
        }}
      />

      <style jsx global>{`
        @keyframes clients-marquee-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes clients-marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
        .clients-marquee-left  { animation: clients-marquee-left  var(--marquee-speed, 80s) linear infinite; }
        .clients-marquee-right { animation: clients-marquee-right var(--marquee-speed, 80s) linear infinite; }
        .clients-marquee-left:hover, .clients-marquee-right:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .clients-marquee-left, .clients-marquee-right { animation: none; transform: none; }
        }
      `}</style>
    </section>
  );
}

interface MarqueeProps {
  items: typeof clients;
  direction: "left" | "right";
  speedSec: number;
}

function Marquee({ items, direction, speedSec }: MarqueeProps) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={
          direction === "left" ? "clients-marquee-left" : "clients-marquee-right"
        }
        style={
          {
            "--marquee-speed": `${speedSec}s`,
            display: "flex",
            width: "fit-content",
            gap: "3.5rem",
            willChange: "transform",
            paddingInline: "1.75rem",
          } as React.CSSProperties
        }
      >
        {loop.map((c, i) => (
          <a
            key={`${c.id}-${i}`}
            href={`#client-${c.id}`}
            onClick={(e) => e.preventDefault()}
            title={c.name}
            aria-label={c.name}
            className="group relative shrink-0 inline-flex items-center justify-center h-16 md:h-20 px-2 md:px-3"
          >
            <Image
              src={c.logo}
              alt={c.name}
              width={240}
              height={80}
              sizes="240px"
              className="w-auto h-full max-w-[200px] md:max-w-[240px] object-contain grayscale opacity-65 transition-[filter,opacity,transform] duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04]"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
