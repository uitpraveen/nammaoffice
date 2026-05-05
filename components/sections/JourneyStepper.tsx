"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Sparkles, ArrowDownRight, MapPin, Building2, Rocket, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface JourneyStepperProps {
  milestones: Milestone[];
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Visual icon per milestone, cycled by index
const ICONS: LucideIcon[] = [Sparkles, Building2, Rocket, MapPin, ArrowDownRight, Trophy];

export function JourneyStepper({ milestones, className }: JourneyStepperProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll progress from when the track top hits 70% of viewport,
  // through to when the track bottom hits 30% of viewport.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 30%"],
  });

  // Smooth the raw scroll signal so the progress line doesn't twitch.
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });

  // The progress line height (0 → 1, applied via scaleY)
  const lineScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div ref={trackRef} className={className}>
      <div className="relative max-w-3xl mx-auto">
        {/* Track — base line (subtle, full length) */}
        <div
          aria-hidden
          className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-[2px] bg-[var(--color-border)]"
        />

        {/* Track — animated red fill that grows as user scrolls */}
        <motion.div
          aria-hidden
          className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-[2px] origin-top bg-[var(--color-accent)]"
          style={{ scaleY: lineScale }}
        />

        {/* Milestones */}
        <ol className="relative space-y-10 md:space-y-14">
          {milestones.map((m, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.li
                key={m.year}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                className="relative pl-12 md:pl-16"
              >
                {/* Dot + ring (the dot itself reveals with a small spring) */}
                <motion.span
                  aria-hidden
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay: 0.15,
                  }}
                  className="absolute left-0 top-1 inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-2 border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_0_4px_rgba(184,58,58,0.08)]"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                </motion.span>

                {/* Content card */}
                <div className="bg-white rounded-2xl p-5 md:p-6 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:shadow-[0_8px_24px_rgba(10,10,10,0.06)] transition-all">
                  <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] text-[var(--color-accent)] leading-none">
                      {m.year}
                    </p>
                    <span
                      aria-hidden
                      className="flex-1 h-px bg-[var(--color-border)]"
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                      Milestone {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-[18px] md:text-[20px] font-semibold tracking-[-0.02em] text-[var(--color-ink)] mt-2">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-[var(--color-ink-secondary)]">
                    {m.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* Track end cap */}
        <motion.span
          aria-hidden
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          className="absolute left-[8px] md:left-[12px] -bottom-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--color-accent)]"
        />
      </div>
    </div>
  );
}
