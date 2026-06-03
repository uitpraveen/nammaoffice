"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

/**
 * Story section — ported from Elevate. Editorial paragraph block on the
 * left, two staggered portrait photos on the right with eyebrow captions.
 */
export function StoryStrip() {
  return (
    <section
      id="about"
      className="py-24 md:py-32"
      style={{ background: "var(--card)" }}
    >
      <div className="content-width">
        <motion.p {...fadeUp} className="eyebrow mb-6">
          Our story
        </motion.p>
        <motion.h2
          {...fadeUp}
          className="display text-[40px] md:text-[64px] max-w-[18ch]"
          style={{ color: "var(--ink)" }}
        >
          More than a desk.{" "}
          <span className="display-italic">A community for builders.</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
          <div
            className="space-y-6 text-[17px] leading-[1.7] max-w-[52ch]"
            style={{ color: "var(--ink-muted)" }}
          >
            <motion.p {...fadeUp}>
              NammaOffice began with a simple observation: the entrepreneurs
              and professionals of tier-2 Tamil Nadu were as ambitious as their
              counterparts in Chennai or Bengaluru — but lacked the
              infrastructure to match.
            </motion.p>
            <motion.p {...fadeUp}>
              Our first centre opened on Brindavan Road in Salem. Today we
              operate{" "}
              <strong className="font-medium" style={{ color: "var(--ink)" }}>
                10 centres
              </strong>{" "}
              across Salem, Trichy, Tirupur, Erode, and Hosur — serving
              everyone from solo freelancers to growing teams.
            </motion.p>
            <motion.p
              {...fadeUp}
              className="font-medium"
              style={{ color: "var(--ink)" }}
            >
              Premium workspaces. Predictable costs. A community that supports
              its own.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <motion.figure {...fadeUp} className="space-y-3">
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden border hairline"
                style={{ borderColor: "var(--border)" }}
              >
                <Image
                  src="/images/elevate/story-cafe.jpg"
                  alt="Our cafeteria and dining area, designed for breaks and conversations"
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="eyebrow">01 · Pause &amp; refresh</figcaption>
            </motion.figure>
            <motion.figure {...fadeUp} className="space-y-3 mt-12">
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden border hairline"
                style={{ borderColor: "var(--border)" }}
              >
                <Image
                  src="/images/elevate/story-discussion.jpg"
                  alt="A discussion room mid-session — daylight, whiteboards, and focus"
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="eyebrow">02 · Collaboration</figcaption>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
}
