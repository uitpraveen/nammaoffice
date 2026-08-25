"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "motion/react";
import { clients, type Client } from "@/lib/data/clients";

/**
 * Client-logo wall - "ink rule". Three counter-scrolling rows of marks set
 * straight on the cream with nothing but a hairline between them, the way a
 * newspaper masthead or a carved donor wall sets a list of names. No cards,
 * no borders, no grayscale wash: every logo is in full brand colour.
 *
 * Sizing is done in the artwork, not here. Each file is a fixed 560px-tall
 * transparent canvas with the mark trimmed and area-normalised inside it
 * (see scripts/build-client-logos.py), so one CSS height is enough to make a
 * square monogram and a long wordmark carry the same optical weight, and the
 * canvas is only slightly taller than its mark.
 *
 * That 560 is 5x the height painted below, which is what keeps the marks
 * crisp: a 2x screen needs 224 device pixels here and a 3x phone 336, so the
 * source has to be several times --logo-h, not equal to it.
 *
 * Motion, in layers:
 *   - the three rows counter-scroll at three speeds, for parallax depth;
 *   - a warm light tracks the pointer across the whole wall;
 *   - hovering a row pauses it and recedes every mark except the one under
 *     the cursor, which lifts;
 *   - the wall fades up row-by-row on first view.
 *
 * Each row's content is duplicated so that as the first copy slides off the
 * edge the second is already in place: a seamless loop. The duplicate is
 * aria-hidden so a screen reader hears each brand once.
 */
const ROWS = 3;
/** Seconds for one full loop, per row. Kept off multiples of each other so
 *  the rows never settle into a visible lockstep. */
const ROW_SPEEDS = [86, 107, 94];

export function ClientLogos() {
  const wall = useRef<HTMLDivElement>(null);

  // Deal the (alphabetical) list round-robin across the rows so each row gets
  // a varied mix of wordmarks, monograms and dark tiles.
  const rows: Client[][] = Array.from({ length: ROWS }, () => []);
  clients.forEach((c, i) => rows[i % ROWS].push(c));

  // Pointer position drives the spotlight through CSS vars - no React state,
  // so moving the mouse never re-renders 98 images.
  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const n = wall.current;
    if (!n) return;
    const r = n.getBoundingClientRect();
    n.style.setProperty("--mx", `${e.clientX - r.left}px`);
    n.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="clients"
      className="relative bg-[var(--color-bg)] py-20 md:py-28 overflow-hidden border-y border-[var(--color-border)]"
    >
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
          <span className="display-italic">One ecosystem.</span>
        </h2>
        <p className="mt-4 text-[15px] text-[var(--color-ink-secondary)] leading-relaxed max-w-xl mx-auto">
          From global PSUs and multinational pathology chains to Salem-born SaaS founders - every brand below builds, meets, or hosts from a NammaOffice centre.
        </p>
      </motion.div>

      <div ref={wall} onPointerMove={track} className="clients-wall relative">
        <div className="flex flex-col gap-7 md:gap-9">
          {rows.map((items, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <Marquee
                items={items}
                direction={i % 2 === 0 ? "left" : "right"}
                speedSec={ROW_SPEEDS[i]}
              />
            </motion.div>
          ))}
        </div>

        {/* Warm light that follows the pointer across the wall. */}
        <span aria-hidden className="clients-glow" />
      </div>

      {/* Edge fades so marks dissolve into the cream instead of being
          guillotined at the viewport edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-40 z-10"
        style={{ background: "linear-gradient(90deg, var(--color-bg) 0%, var(--color-bg) 25%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-40 z-10"
        style={{ background: "linear-gradient(270deg, var(--color-bg) 0%, var(--color-bg) 25%, transparent 100%)" }}
      />

      <style jsx global>{`
        .clients-wall {
          /* Painted height of each logo canvas. The mark inside averages ~56%
             of it, so this is the dial to turn for readability. Keep the three
             values in step with RENDERED_H above, which drives the sizes
             attribute and therefore which raster Next serves. */
          --logo-h: 82px;
        }
        @media (min-width: 768px)  { .clients-wall { --logo-h: 100px; } }
        @media (min-width: 1280px) { .clients-wall { --logo-h: 112px; } }

        @keyframes clients-mq-left  { from { transform: translate3d(0,0,0);    } to { transform: translate3d(-50%,0,0); } }
        @keyframes clients-mq-right { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0);    } }
        .clients-track-left  { animation: clients-mq-left  var(--marquee-speed, 90s) linear infinite; }
        .clients-track-right { animation: clients-mq-right var(--marquee-speed, 90s) linear infinite; }
        .clients-row:hover .clients-track-left,
        .clients-row:hover .clients-track-right { animation-play-state: paused; }

        .clients-mark {
          position: relative;
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-inline: clamp(20px, 2.4vw, 38px);
          opacity: 0.88;
          transition:
            opacity 300ms ease,
            transform 450ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* The hairline that separates one mark from the next, fading out at
           both ends so it reads as a rule and not a table border. */
        .clients-mark + .clients-mark::before {
          content: "";
          position: absolute;
          left: 0;
          top: 24%;
          bottom: 24%;
          width: 1px;
          background: linear-gradient(180deg, transparent, var(--color-border-strong), transparent);
        }
        /* Spotlight: hovering a row recedes it, and the mark under the cursor
           comes back to full strength and lifts. */
        .clients-row:hover .clients-mark { opacity: 0.3; }
        .clients-row .clients-mark:hover { opacity: 1; transform: translateY(-8px) scale(1.07); }

        .clients-glow {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          opacity: 0;
          transition: opacity 400ms ease;
          background: radial-gradient(
            260px circle at var(--mx, 50%) var(--my, 50%),
            rgba(184, 85, 58, 0.13),
            rgba(184, 85, 58, 0.05) 45%,
            transparent 72%
          );
        }
        .clients-wall:hover .clients-glow { opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .clients-track-left, .clients-track-right { animation: none; transform: none; }
          .clients-mark { transition: none; }
          .clients-row:hover .clients-mark { opacity: 0.88; }
          .clients-row .clients-mark:hover { transform: none; }
          .clients-glow { display: none; }
        }
      `}</style>
    </section>
  );
}

interface MarqueeProps {
  items: Client[];
  direction: "left" | "right";
  speedSec: number;
}

function Marquee({ items, direction, speedSec }: MarqueeProps) {
  return (
    <div className="clients-row overflow-hidden">
      <div
        className={direction === "left" ? "clients-track-left" : "clients-track-right"}
        style={
          {
            "--marquee-speed": `${speedSec}s`,
            display: "flex",
            width: "fit-content",
            willChange: "transform",
          } as React.CSSProperties
        }
      >
        {items.map((c) => (
          <Mark key={c.id} client={c} />
        ))}
        {/* Seamless-loop duplicate - decorative only. */}
        {items.map((c) => (
          <Mark key={`${c.id}-dup`} client={c} decorative />
        ))}
      </div>
    </div>
  );
}

/** Rendered CSS height of a canvas at each breakpoint - must track --logo-h
 *  below, since `sizes` is what decides which raster Next actually serves. */
const RENDERED_H = { sm: 82, md: 100, lg: 112 };

function Mark({ client: c, decorative }: { client: Client; decorative?: boolean }) {
  // Every canvas is the same height but a different width, so one shared
  // `sizes` string would over-serve the narrow marks and under-serve the wide
  // ones. Derive each logo's true CSS width from its own aspect ratio instead.
  const w = (h: number) => Math.ceil((c.w / c.h) * h);
  const sizes =
    `(max-width: 767px) ${w(RENDERED_H.sm)}px, ` +
    `(max-width: 1279px) ${w(RENDERED_H.md)}px, ` +
    `${w(RENDERED_H.lg)}px`;

  return (
    <div {...(decorative ? { "aria-hidden": true } : {})} title={c.name} className="clients-mark">
      <Image
        src={c.logo}
        alt={decorative ? "" : c.name}
        width={c.w}
        height={c.h}
        sizes={sizes}
        loading="eager"
        className="w-auto select-none"
        style={{ height: "var(--logo-h)" }}
        draggable={false}
      />
    </div>
  );
}
