"use client";

import { Counter } from "@/components/ui/Counter";
import { stats } from "@/lib/data/stats";

// Show only 4 key stats on the banner
const bannerStats = stats.slice(0, 4);

export function StatsBanner() {
  return (
    <section className="bg-terracotta py-16 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="content-width relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {bannerStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="font-serif text-4xl sm:text-5xl text-white">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-sans text-sm text-white/80 leading-snug max-w-[120px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
