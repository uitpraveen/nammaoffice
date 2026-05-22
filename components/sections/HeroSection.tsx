"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Pause,
  Play,
  Sparkles,
  Star,
  Wifi,
} from "lucide-react";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { cn } from "@/lib/utils";
import { cities, locations } from "@/lib/data/locations";

// Pre-computed once at module load — same numbers the MobileCitySelector
// renders under the hero. Saves a recompute on every paint.
const citiesSelector = cities.map((c) => ({
  slug: c.slug,
  name: c.name,
  centres: locations.filter((l) => l.city === c.slug).length,
}));

interface Slide {
  src: string;
  alt: string;
  eyebrow: string;
  caption: string;
  location: string;
  headline: { lead: string; emphasis: string; tail?: string };
  subhead: string;
}

const SLIDES: Slide[] = [
  {
    src: "/images/elevate/hero-slide-1.jpg",
    alt: "NammaOffice modern coworking interior — Salem",
    eyebrow: "Coworking · Salem",
    caption: "Designed for focused work",
    location: "Fairlands · Salem",
    headline: { lead: "Build Your Business From", emphasis: "Your City" },
    subhead:
      "Premium workspaces for startups, freelancers, and growing teams in Tier-2 & Tier-3 cities.",
  },
  {
    src: "/images/elevate/hero-slide-2.jpg",
    alt: "NammaOffice premium workspace — Trichy",
    eyebrow: "Coworking · Trichy",
    caption: "Where teams come together",
    location: "Asha Grand · Trichy",
    headline: { lead: "Where Founders Find Their", emphasis: "People" },
    subhead:
      "Join a community of entrepreneurs, freelancers, and remote teams across Tamil Nadu.",
  },
  {
    src: "/images/elevate/hero-slide-3.jpg",
    alt: "NammaOffice managed office — Tirupur",
    eyebrow: "Coworking · Tirupur",
    caption: "Built for ambitious businesses",
    location: "TIDEL NEO · Tirupur",
    headline: { lead: "Workspaces That", emphasis: "Grow", tail: "With You" },
    subhead:
      "From hot desks to managed offices — flexible plans that scale as your team does.",
  },
];

const SLIDE_MS = 7000;
const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const [[active, direction], setActiveDir] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number, dir: number = 1) => {
    const normalized = ((idx % SLIDES.length) + SLIDES.length) % SLIDES.length;
    setActiveDir([normalized, dir]);
  }, []);

  const next = useCallback(() => {
    setActiveDir(([cur]) => [(cur + 1) % SLIDES.length, 1]);
  }, []);
  const prev = useCallback(() => {
    setActiveDir(([cur]) => [(cur - 1 + SLIDES.length) % SLIDES.length, -1]);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, SLIDE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, paused, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = SLIDES[active];

  return (
    <>
    <section
      id="hero"
      className="relative h-[100svh] min-h-[560px] flex flex-col overflow-hidden bg-[var(--color-charcoal)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Slide images — pre-mounted siblings, opacity-only crossfade */}
      {SLIDES.map((s, i) => (
        <motion.div
          key={`img-${s.src}`}
          aria-hidden={i !== active}
          initial={false}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="absolute inset-0"
          style={{ willChange: "opacity" }}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            sizes="100vw"
            quality={75}
            className="object-cover"
          />
        </motion.div>
      ))}

      {/* Two-layer overlay for legibility on every slide:
          1. Base linear darken (top-bottom)
          2. Radial darken centered behind the headline + body text */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,10,0.82) 0%, rgba(8,8,10,0.68) 30%, rgba(8,8,10,0.72) 65%, rgba(8,8,10,0.98) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 60% at 40% 45%, rgba(8,8,10,0.55), transparent 75%)",
        }}
      />

      {/* Particle field */}
      <HeroParticles />

      {/* Nav clearance — keeps content from drifting under the fixed header on
          short viewports where flex centering would overflow upward. */}
      <div aria-hidden className="h-[132px] md:h-[148px] shrink-0 relative z-10" />

      {/* Content — `safe center` alignment centers when content fits but falls
          back to top-aligned when content would overflow upward, so the
          eyebrow never gets pushed under the navbar. */}
      <div className="relative z-10 flex-1 min-h-0 flex w-full [align-items:safe_center]">
        <div className="content-width w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 md:gap-10 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="text-left flex flex-col items-start max-w-[720px]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={`content-${active}`}
                initial={{ opacity: 0, y: direction * 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction * -14 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex flex-col items-start"
              >
                <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/[0.08] backdrop-blur border border-white/15 text-white text-[12px] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-gold-300)]" strokeWidth={2.25} />
                  {slide.eyebrow}
                </div>

                <h1
                  className="display-xl mt-4 md:mt-5 lg:mt-6 max-w-full md:max-w-[20ch] text-white"
                  style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
                >
                  {slide.headline.lead}{" "}
                  <span className="display-italic inline-block px-[0.06em]">
                    {slide.headline.emphasis}
                  </span>
                  {slide.headline.tail ? <> {slide.headline.tail}</> : null}
                </h1>

                <p
                  className="mt-4 md:mt-5 lg:mt-6 text-[15px] md:text-[16px] lg:text-[18px] text-white/85 leading-relaxed max-w-2xl"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.55)" }}
                >
                  {slide.subhead}
                </p>
              </motion.div>
            </AnimatePresence>

            <ul className="mt-5 md:mt-6 lg:mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-white/85 text-[12px] md:text-[13px] font-medium">
              <FeaturePill icon={<Wifi className="w-3.5 h-3.5" strokeWidth={2} />}>
                High-Speed Internet
              </FeaturePill>
              <FeaturePill icon={<MapPin className="w-3.5 h-3.5" strokeWidth={2} />}>
                Prime Locations
              </FeaturePill>
              <FeaturePill icon={<Building2 className="w-3.5 h-3.5" strokeWidth={2} />}>
                Flexible Plans
              </FeaturePill>
            </ul>

            <div className="mt-6 md:mt-7 lg:mt-8 flex flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/bookings"
                className="group inline-flex items-center justify-center gap-2 h-11 md:h-12 px-5 md:px-7 bg-[var(--color-gold)] text-[var(--color-navy-deep)] text-[13px] md:text-[14px] font-semibold rounded-full transition-all active:scale-[0.98] hover:bg-[var(--color-gold-deep)] hover:text-white hover:scale-[1.02] shadow-[var(--shadow-cta)] flex-1 sm:flex-none"
              >
                Book Now
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                />
              </Link>
              <Link
                href="/locations"
                className="inline-flex items-center justify-center gap-2 h-11 md:h-12 px-5 md:px-7 border border-white/30 text-white text-[13px] md:text-[14px] font-semibold rounded-full hover:bg-white/10 active:bg-white/15 transition-colors flex-1 sm:flex-none"
              >
                Explore centres
              </Link>
            </div>
          </div>

          {/* Right — floating glass cards (desktop only).
              Opacity-only fade (no transform) — `backdrop-filter` flickers /
              snaps in late when its container is being translated, so we keep
              the parent static and just fade the cards in. */}
          <motion.div
            className="hidden lg:flex flex-col gap-3 w-full max-w-[360px] ml-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          >
            {/* Rating card */}
            <div
              className="rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl p-4 text-white"
              style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.5)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <Star
                      key={k}
                      className="w-3.5 h-3.5"
                      fill="var(--color-gold-300)"
                      stroke="var(--color-gold-300)"
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                  Verified
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[28px] font-medium leading-none tabular-nums tracking-tight">
                  4.9
                </span>
                <span className="text-[12px] text-white/60">/ 5 · 200+ reviews</span>
              </div>
              <p className="mt-2 text-[12.5px] leading-snug text-white/80 line-clamp-2">
                &ldquo;Best workspace experience I&apos;ve had in Salem. The team feels like family.&rdquo;
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 text-[11px] uppercase tracking-[0.14em] text-white/55">
                Arjun K. · Founder
              </div>
            </div>

            {/* Live now card */}
            <div
              className="rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl p-4 text-white"
              style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.5)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex w-2 h-2">
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: "var(--color-gold-300)" }}
                  />
                  <span
                    className="relative w-2 h-2 rounded-full"
                    style={{ background: "var(--color-gold-300)" }}
                  />
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/75 font-medium">
                  Live now
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[24px] font-medium leading-none tabular-nums tracking-tight">
                    312
                  </div>
                  <div className="mt-1 text-[12px] text-white/65">members working</div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-medium leading-none tabular-nums tracking-tight">
                    10
                  </div>
                  <div className="mt-1 text-[12px] text-white/65">centres open</div>
                </div>
              </div>
            </div>

            {/* Next slide preview */}
            <button
              onClick={() => goTo((active + 1) % SLIDES.length, 1)}
              className="group rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl p-3 text-left text-white overflow-hidden hover:bg-white/[0.12] transition-colors"
              style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.5)" }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={SLIDES[(active + 1) % SLIDES.length].src}
                    alt={SLIDES[(active + 1) % SLIDES.length].caption}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-white/55 mb-1">
                    Up next
                  </div>
                  <div className="text-[13px] font-medium truncate">
                    {SLIDES[(active + 1) % SLIDES.length].eyebrow}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          </motion.div>
        </div>
        </div>
      </div>

      {/* Bottom space reservation — keeps content (esp. CTAs) clear of the
          absolutely-positioned carousel controls / mobile dots below. */}
      <div aria-hidden className="h-[56px] md:h-[150px] lg:h-[160px] shrink-0 relative z-10" />

      {/* Carousel controls */}
      <div className="absolute bottom-14 lg:bottom-16 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-end gap-5 max-w-[calc(100vw-2rem)]">
        <div className="text-left mr-4 min-w-[200px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
            <span className="text-white">{String(active + 1).padStart(2, "0")}</span>
            <span className="mx-1.5">/</span>
            <span>{String(SLIDES.length).padStart(2, "0")}</span>
          </p>
          <AnimatePresence initial={false} mode="wait">
            <motion.p
              key={`cap-${active}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mt-1.5 text-[15px] font-semibold text-white tracking-[-0.01em]"
            >
              {slide.caption}
            </motion.p>
          </AnimatePresence>
          <p className="text-[12px] text-white/55">{slide.location}</p>
        </div>

        <div className="flex items-end gap-2">
          {SLIDES.map((s, i) => {
            const isActive = i === active;
            return (
              <motion.button
                key={s.src}
                onClick={() => goTo(i, i > active ? 1 : -1)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                animate={{
                  width: isActive ? 96 : 56,
                  opacity: isActive ? 1 : 0.6,
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={cn(
                  "relative h-14 overflow-hidden rounded-lg border",
                  isActive
                    ? "border-white shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    : "border-white/30 hover:border-white/60"
                )}
              >
                <Image src={s.src} alt={s.caption} fill sizes="96px" quality={50} className="object-cover" />
                {isActive && (
                  <motion.span
                    key={`progress-${active}-${paused ? "p" : "r"}`}
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? 0 : 1 }}
                    transition={{
                      duration: paused ? 0 : SLIDE_MS / 1000,
                      ease: "linear",
                    }}
                    className="absolute bottom-0 left-0 h-[3px] w-full bg-[var(--color-gold)] origin-left"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          <ControlButton onClick={prev} label="Previous slide">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
          </ControlButton>
          <ControlButton
            onClick={() => setPaused((p) => !p)}
            label={paused ? "Resume autoplay" : "Pause autoplay"}
          >
            {paused ? (
              <Play className="w-3.5 h-3.5" strokeWidth={2.25} />
            ) : (
              <Pause className="w-3.5 h-3.5" strokeWidth={2.25} />
            )}
          </ControlButton>
          <ControlButton onClick={next} label="Next slide">
            <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
          </ControlButton>
        </div>
      </div>

      {/* Mobile dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex md:hidden items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i, i > active ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            animate={{
              width: i === active ? 32 : 6,
              opacity: i === active ? 1 : 0.5,
            }}
            transition={{ duration: 0.35, ease: EASE }}
            className="h-1 rounded-full bg-white"
          />
        ))}
      </div>
    </section>
    <MobileCitySelector />
    </>
  );
}

/**
 * Mobile-only horizontally-scrollable city chip row, sitting directly
 * under the hero. Lets visitors on small screens pick their city without
 * scrolling past the hero or hunting in the menu. Hidden on lg+ — the
 * desktop hero already has the "Explore centres" CTA on the right cluster.
 */
function MobileCitySelector() {
  return (
    <section
      aria-label="Pick your city"
      className="lg:hidden bg-[var(--color-bg)] border-b border-[var(--color-border)] py-3"
    >
      <div className="content-width">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-secondary)] mb-2">
          Pick your city
        </p>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {citiesSelector.map((c) => (
            <Link
              key={c.slug}
              href={`/locations/${c.slug}`}
              className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white border border-[var(--color-border)] text-[13px] font-semibold text-[var(--color-navy)] hover:border-[var(--color-gold-300)] hover:text-[var(--color-gold-deep)] transition-colors"
            >
              {c.name}
              <span className="text-[11px] font-normal text-[var(--color-ink-secondary)]">
                · {c.centres}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ControlButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/25 text-white hover:bg-white/15 hover:border-white/50 transition-colors"
    >
      {children}
    </motion.button>
  );
}

function FeaturePill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/[0.08] backdrop-blur border border-white/15 text-white/85">
      <span className="text-white">{icon}</span>
      {children}
    </li>
  );
}
