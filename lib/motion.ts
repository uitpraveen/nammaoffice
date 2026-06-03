/**
 * Shared Framer Motion (motion/react) variants - ported from the Elevate
 * design system. Use `{...fadeUp}` on a `motion.div` to get the standard
 * fade-up reveal that fires once when the element scrolls into view.
 */

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15% 0px" },
  transition: { duration: 0.8, ease: easeOut },
} as const;

export const staggerParent = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: "-15% 0px" },
  transition: { staggerChildren: 0.06, delayChildren: 0.1 },
} as const;
