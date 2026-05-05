"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 250);
    },
    [isAnimating]
  );

  const goPrev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length);
  }, [current, goTo]);

  const goNext = useCallback(() => {
    goTo((current + 1) % testimonials.length);
  }, [current, goTo]);

  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [goNext]);

  const t = testimonials[current];

  return (
    <section className="section-padding bg-white">
      <div className="content-width">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
          <div>
            <p className="eyebrow">Members</p>
            <h2 className="display-lg mt-3 text-[var(--color-ink)]">
              People who chose us.
            </h2>
            <p className="mt-4 text-[16px] text-[var(--color-ink-secondary)] leading-relaxed max-w-md">
              Real stories from founders, freelancers and operators across our
              centres.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <button
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-border-strong)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.25} />
              </button>
              <button
                onClick={goNext}
                aria-label="Next testimonial"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--color-border-strong)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
              </button>
              <span className="ml-3 text-[13px] text-[var(--color-ink-muted)] tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div
            className="relative bg-[var(--color-bg)] border border-[var(--color-border)] rounded-3xl p-8 md:p-12 transition-opacity duration-200"
            style={{ opacity: isAnimating ? 0 : 1 }}
          >
            <Quote
              aria-hidden
              className="absolute top-8 right-8 w-16 h-16 text-[var(--color-accent-100)]"
              strokeWidth={1}
            />

            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < t.rating ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--color-border-strong)]"}`}
                  strokeWidth={1.5}
                />
              ))}
            </div>

            <p className="relative text-[20px] md:text-[24px] leading-[1.4] tracking-[-0.01em] text-[var(--color-ink)] font-medium">
              &ldquo;{t.text}&rdquo;
            </p>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-accent-50)] text-[var(--color-accent)] text-[16px] font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                    {t.name}
                  </p>
                  <p className="text-[13px] text-[var(--color-ink-secondary)] truncate">
                    {t.company}
                    {t.location && <span className="text-[var(--color-ink-muted)]"> · {t.location}</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-[var(--color-accent)]"
                      : "w-1.5 bg-[var(--color-border-strong)] hover:bg-[var(--color-ink-muted)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
