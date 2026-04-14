"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
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
      }, 300);
    },
    [isAnimating]
  );

  const goPrev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length);
  }, [current, goTo]);

  const goNext = useCallback(() => {
    goTo((current + 1) % testimonials.length);
  }, [current, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [goNext]);

  const t = testimonials[current];

  return (
    <section className="section-padding bg-warm-white">
      <div className="content-width">
        <SectionHeading
          title="What Our Community Says"
          subtitle="Real stories from real members across our 7+ centres."
          className="mb-12"
        />

        <div className="max-w-3xl mx-auto">
          {/* Testimonial card */}
          <div
            className="bg-white rounded-brand shadow-brand p-8 md:p-12 flex flex-col gap-6 transition-opacity duration-300"
            style={{ opacity: isAnimating ? 0 : 1 }}
          >
            {/* Large quote mark */}
            <span
              className="font-serif text-6xl text-terracotta leading-none select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Quote text */}
            <p className="font-sans text-lg italic text-warm-charcoal leading-relaxed -mt-4">
              {t.text}
            </p>

            {/* Author row */}
            <div className="flex items-center gap-4 pt-2 border-t border-warm-border">
              {/* Placeholder avatar */}
              <div className="w-16 h-16 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
                <span className="font-serif text-xl text-terracotta">
                  {t.name.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans font-medium text-warm-charcoal">
                  {t.name}
                </span>
                <span className="font-sans text-sm text-warm-gray">
                  {t.company}
                </span>
                {t.location && (
                  <span className="font-sans text-xs text-warm-gray">
                    {t.location}
                  </span>
                )}
                <StarRating rating={t.rating} className="mt-1" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Prev button */}
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-warm-border bg-white hover:bg-sand hover:border-terracotta transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2.5 bg-terracotta"
                      : "w-2.5 h-2.5 bg-warm-border hover:bg-terracotta/40"
                  }`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-warm-border bg-white hover:bg-sand hover:border-terracotta transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
