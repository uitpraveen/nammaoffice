import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Mid-page dark accent strip — a single dark moment that breaks up the
 * cream surfaces and gives the page visual rhythm. SaaS-style stat tiles
 * with gradient borders + soft glow.
 */
export function StatsBand() {
  return (
    <section className="bg-[var(--color-charcoal)] relative overflow-hidden">
      {/* Subtle dot-grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(215,38,96,0.55) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Soft gold radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 60% at 80% 30%, rgba(215,38,96,0.18), transparent 60%), radial-gradient(40% 60% at 10% 90%, rgba(215,38,96,0.10), transparent 60%)",
        }}
      />

      <div className="content-width relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-10 lg:gap-16 items-center">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--color-gold-300)" }}
            >
              By the numbers
            </p>
            <h2 className="display-lg !text-white mt-3 leading-tight">
              Built across Tamil Nadu&apos;s
              <br />
              <span className="text-[var(--color-gold-300)] italic font-normal">
                fastest-growing
              </span>{" "}
              cities.
            </h2>
            <p className="mt-5 text-[15px] text-white/65 leading-relaxed max-w-md">
              Eight centres. Three cities. Hundreds of members building everything from textile exports to SaaS startups.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-gold-300)] hover:text-[var(--color-gold)] transition-colors"
            >
              About NammaOffice
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.25} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Centres" value="8" />
            <Stat label="Cities" value="3" />
            <Stat label="Members" value="500+" />
            <Stat label="Rating" value="4.9" suffix="/5" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div
      className="relative rounded-2xl p-5 md:p-6 transition-transform hover:-translate-y-0.5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p className="font-display text-3xl md:text-4xl text-white tabular-nums leading-none">
        {value}
        {suffix && <span className="text-[var(--color-gold-300)] text-2xl">{suffix}</span>}
      </p>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
        {label}
      </p>
    </div>
  );
}
