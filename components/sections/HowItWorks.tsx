import Link from "next/link";
import { ArrowRight, CalendarCheck, Compass, KeyRound } from "lucide-react";

interface Step {
  num: string;
  icon: typeof Compass;
  eyebrow: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    icon: Compass,
    eyebrow: "Browse",
    title: "Find your fit",
    description:
      "Filter by city, workspace type and team size. From a quiet cabin in Salem to a meeting hall in Tirupur — every centre listed with photos, amenities and live availability.",
  },
  {
    num: "02",
    icon: CalendarCheck,
    eyebrow: "Tour",
    title: "Walk through it",
    description:
      "Book a free tour at the centre that fits. Meet the team, sit at the desk, test the wifi. We'll set up workspace trials too — no commitment.",
  },
  {
    num: "03",
    icon: KeyRound,
    eyebrow: "Move in",
    title: "Start working tomorrow",
    description:
      "Pick a plan — daily, monthly or annual — and you're in. Door access, member portal, GST-ready invoicing — all sorted before your first coffee.",
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-white border-y border-[var(--color-border)]">
      <div className="content-width">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-end mb-12 md:mb-16">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="display-lg mt-3 text-[var(--color-ink)]">
              Three steps from{" "}
              <span className="italic font-normal text-[var(--color-accent)]">
                hello
              </span>{" "}
              to working.
            </h2>
          </div>
          <p className="text-[16px] text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
            We've trimmed the friction out of finding a workspace. Browse, tour,
            move in — most members are at their new desk within 48 hours of
            their first enquiry.
          </p>
        </div>

        <div className="relative">
          {/* Faint connecting rail behind the cards on desktop */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-12 left-[8%] right-[8%] h-px bg-[var(--color-border)]"
          />

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 relative">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.num}
                  className="group relative bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] p-6 md:p-7 hover:border-[var(--color-border-strong)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(10,10,10,0.06)] transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-accent)] text-white shadow-[0_4px_16px_rgba(31,181,224,0.25)]">
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-[44px] font-bold tabular-nums leading-none text-[var(--color-secondary)] tracking-[-0.03em]">
                      {s.num}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                    {s.eyebrow}
                  </p>
                  <h3 className="mt-2 text-[20px] md:text-[22px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[14px] text-[var(--color-ink-secondary)] leading-relaxed">
                    {s.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/book-tour"
            className="inline-flex items-center gap-2 h-12 px-7 bg-[var(--color-accent)] text-white text-[14px] font-semibold rounded-full hover:bg-[var(--color-accent-600)] transition-colors shadow-[0_4px_16px_rgba(31,181,224,0.25)]"
          >
            Start with a tour
            <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 h-12 px-7 border border-[var(--color-border-strong)] text-[var(--color-ink)] text-[14px] font-semibold rounded-full hover:border-[var(--color-ink)] transition-colors"
          >
            See plans &amp; pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
