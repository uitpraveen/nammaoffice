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
  Wifi,
} from "lucide-react";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { cn } from "@/lib/utils";

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
    src: "/images/hero/slide-1.png",
    alt: "NammaOffice modern coworking interior — Salem",
    eyebrow: "Coworking · Salem",
    caption: "Designed for focused work",
    location: "Fairlands · Salem",
    headline: { lead: "Build Your Business From", emphasis: "Your City" },
    subhead:
      "Premium workspaces for startups, freelancers, and growing teams in Tier-2 & Tier-3 cities.",
  },
  {
    src: "/images/hero/slide-2.png",
    alt: "NammaOffice premium workspace — Trichy",
    eyebrow: "Coworking · Trichy",
    caption: "Where teams come together",
    location: "Asha Grand · Trichy",
    headline: { lead: "Where Founders Find Their", emphasis: "People" },
    subhead:
      "Join a community of entrepreneurs, freelancers, and remote teams across Tamil Nadu.",
  },
  {
    src: "/images/hero/slide-3.png",
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
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-charcoal)]"
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
            "linear-gradient(180deg, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.50) 30%, rgba(10,10,10,0.55) 65%, rgba(10,10,10,0.95) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(10,10,10,0.45), transparent 75%)",
        }}
      />

      {/* Particle field */}
      <HeroParticles />

      {/* Content */}
      <div className="relative z-10 content-width w-full pt-[110px] md:pt-[130px] pb-36 md:pb-32 lg:pb-40 text-center flex flex-col items-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`content-${active}`}
            initial={{ opacity: 0, y: direction * 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -14 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/[0.08] backdrop-blur border border-white/15 text-white text-[12px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-gold-300)]" strokeWidth={2.25} />
              {slide.eyebrow}
            </div>

            <h1
              className="display-xl mt-7 max-w-full md:max-w-[20ch] text-white px-2"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
            >
              {slide.headline.lead}{" "}
              <span className="text-[var(--color-gold-300)] italic inline-block px-[0.06em]">
                {slide.headline.emphasis}
              </span>
              {slide.headline.tail ? <> {slide.headline.tail}</> : null}
            </h1>

            <p
              className="mt-7 text-[17px] lg:text-[19px] text-white/85 leading-relaxed max-w-2xl"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.55)" }}
            >
              {slide.subhead}
            </p>
          </motion.div>
        </AnimatePresence>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/85 text-[13px] font-medium">
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

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0">
          <Link
            href="/bookings"
            className="group inline-flex items-center justify-center gap-2 h-12 px-7 bg-[var(--color-gold)] text-[var(--color-navy-deep)] text-[14px] font-semibold rounded-full transition-all active:scale-[0.98] hover:bg-[var(--color-gold-deep)] hover:text-white hover:scale-[1.02] shadow-[var(--shadow-cta)]"
          >
            Book Now
            <ArrowRight
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.25}
            />
          </Link>
          <Link
            href="/locations"
            className="inline-flex items-center justify-center gap-2 h-12 px-7 border border-white/30 text-white text-[14px] font-semibold rounded-full hover:bg-white/10 active:bg-white/15 transition-colors"
          >
            Explore centres
          </Link>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-end gap-5 max-w-[calc(100vw-2rem)]">
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
                <Image src={s.src} alt="" fill sizes="96px" quality={50} className="object-cover" />
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex md:hidden items-center gap-1.5">
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
