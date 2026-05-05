"use client";

import { Counter } from "@/components/ui/Counter";
import { stats } from "@/lib/data/stats";

const bannerStats = stats.slice(0, 4);

export function StatsBanner() {
  return (
    <section className="bg-gradient-accent relative overflow-hidden">
      {/* Soft static highlight */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.18), transparent 50%), radial-gradient(circle at 90% 100%, rgba(0,0,0,0.18), transparent 50%)",
        }}
      />

      <div className="content-width relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
          {bannerStats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 ${idx % 2 === 0 ? "pr-6 lg:pr-8" : "pl-6 lg:pl-8"} ${idx >= 2 ? "pt-8 lg:pt-0" : "pb-8 lg:pb-0"} lg:px-8`}
            >
              <div className="text-white text-[44px] md:text-[56px] font-bold tracking-[-0.03em] leading-none">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/80 text-[13px] md:text-[14px] leading-snug max-w-[160px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
