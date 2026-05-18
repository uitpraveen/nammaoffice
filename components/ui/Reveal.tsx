"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

interface Props extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Delay in seconds before the animation kicks off (defaults to 0). */
  delay?: number;
  /** Y offset to translate from. Defaults to 28px. */
  y?: number;
  /** When true, every render reveals (skip the once-only viewport guard). */
  repeat?: boolean;
}

/**
 * Lightweight scroll-reveal wrapper. Drop around any block to give
 * it a fade-up entry tied to the viewport. Used to animate sections
 * that aren't already wired with stagger/parallax of their own.
 */
export function Reveal({ children, delay = 0, y = 28, repeat = false, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
