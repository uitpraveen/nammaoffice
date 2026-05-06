"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { wix } from "@/lib/data/wix-pool";

const STORY_IMAGES = [
  { src: wix.team, alt: "NammaOffice team gathering" },
  { src: wix.cabin, alt: "A private cabin at NammaOffice" },
  { src: wix.discussion, alt: "A discussion room in session" },
];

/**
 * Story strip — sticky narrative panel on the left while three large
 * photographs parallax in from the right. Apple-product-page feel.
 *
 * Each ParallaxImage subtly translates -40 → 40 pixels as it crosses
 * the viewport, so the photos feel like they're "moving past" the
 * pinned text instead of just stacking.
 */
export function StoryStrip() {
  return (
    <section className="bg-[var(--color-bg)] py-20 md:py-32 border-t border-[var(--color-border)]">
      <div className="content-width">
        <div className="grid lg:grid-cols-[5fr_6fr] gap-12 lg:gap-16">
          {/* Left — sticky narrative */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow">Our story</p>
            <h2 className="font-display text-4xl md:text-5xl text-[var(--color-navy)] mt-3 leading-[1.05]">
              Born in Salem.
              <br />
              <span className="text-[var(--color-gold-deep)] italic font-normal">
                Built for Tamil Nadu.
              </span>
            </h2>
            <div className="mt-6 space-y-4 text-[15.5px] text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
              <p>
                NammaOffice began with a simple observation: the entrepreneurs and professionals of tier-2 Tamil Nadu were as ambitious as their counterparts in Chennai or Bengaluru — but lacked the infrastructure to match.
              </p>
              <p>
                Our first centre opened on Brindavan Road in Salem with 50 seats and a vision. Within months we had a waiting list. Today we operate <strong className="text-[var(--color-navy)]">8 centres</strong> across Salem, Trichy, and Tirupur — serving everyone from solo freelancers to 50-person teams.
              </p>
              <p>
                Premium workspaces. Predictable costs. A community that supports its own.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-navy)] hover:text-[var(--color-gold-deep)] transition-colors"
            >
              Read the full story
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
            </Link>
          </div>

          {/* Right — stacked parallax photos */}
          <div className="space-y-6 lg:space-y-10">
            {STORY_IMAGES.map((img, i) => (
              <ParallaxImage key={i} src={img.src} alt={img.alt} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ParallaxImage({ src, alt, index }: { src: string; alt: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className={
        // Slightly different aspect per slot for editorial rhythm
        index === 0
          ? "relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)] shadow-[var(--shadow-brand)]"
          : index === 1
            ? "relative aspect-[5/4] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)] shadow-[var(--shadow-brand)] lg:translate-x-8"
            : "relative aspect-[3/2] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)] shadow-[var(--shadow-brand)]"
      }
    >
      <motion.div style={{ y }} className="absolute -inset-y-12 inset-x-0">
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </motion.div>
      {/* Caption strip */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-[var(--color-charcoal)]/85 via-[var(--color-charcoal)]/30 to-transparent">
        <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-[var(--color-gold-300)]">
          {String(index + 1).padStart(2, "0")} · {index === 0 ? "Community" : index === 1 ? "Focused work" : "Collaboration"}
        </p>
      </div>
    </motion.div>
  );
}
