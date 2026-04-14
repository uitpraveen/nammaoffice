"use client";

import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function Counter({
  target,
  suffix = "",
  duration = 2000,
  className,
}: CounterProps) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const animationRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(eased * target);

      setCount(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, target, duration]);

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={cn("tabular-nums", className)}
    >
      {count}
      {suffix}
    </span>
  );
}
