import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Heart, Telescope } from "lucide-react";
import { HeroBanner } from "@/components/sections/HeroBanner";

export const metadata: Metadata = {
  title: "About NammaOffice — Our Story & Mission",
  description:
    "How NammaOffice grew from a single Salem centre to 8 premium workspaces across Tamil Nadu — built for tier-2 entrepreneurs, freelancers, and growing teams.",
  keywords: ["about NammaOffice", "NammaOffice history", "coworking Tamil Nadu story"],
  openGraph: {
    title: "About NammaOffice — Our Story & Mission",
    description: "From a single Brindavan Road centre to 8 locations across Tamil Nadu.",
  },
};

const VALUES = [
  {
    icon: Compass,
    title: "Mission",
    description:
      "Make premium, professional workspaces accessible to every entrepreneur, freelancer, and growing team in Tamil Nadu's tier-2 cities — eliminating the barrier between ambition and infrastructure.",
  },
  {
    icon: Telescope,
    title: "Vision",
    description:
      "To be the most trusted coworking network in South India — synonymous with community, productivity, and opportunity for the next generation of Tamil Nadu's business leaders.",
  },
  {
    icon: Heart,
    title: "Values",
    description:
      "Community over competition. Flexibility over rigidity. Quality without compromise. When entrepreneurs thrive, cities thrive — and NammaOffice is committed to being the catalyst.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeroBanner
        eyebrow="Our story"
        title="Born in Salem. Built for Tamil Nadu."
        subtitle="NammaOffice is more than a coworking space — it's a community of builders, freelancers, and growing businesses across Salem, Trichy, and Tirupur."
      />

      {/* Story */}
      <section className="content-width py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-6 text-[15.5px] text-[var(--color-ink-secondary)] leading-relaxed">
          <p>
            NammaOffice began with a simple observation: the entrepreneurs and professionals of Salem, Trichy, and Tirupur were as ambitious as their counterparts in Chennai or Bengaluru — but lacked the infrastructure to match. Premium coworking was a metropolitan luxury. We set out to change that.
          </p>
          <p>
            Our first centre opened on Brindavan Road, in the Fairlands area of Salem, with 50 seats and a vision. The response was overwhelming. Within months, we had a waiting list. Within a year, we were expanding. Today, NammaOffice operates <strong className="text-[var(--color-navy)]">8 centres</strong> — 6 in Salem, 1 in Trichy, and 1 in Tirupur — serving members ranging from solo freelancers to 50-person teams.
          </p>
          <p>
            Our philosophy has never changed: build spaces professionals are proud to work from, foster communities that support each other&apos;s growth, and keep quality high while keeping costs predictable. Every NammaOffice centre is designed with the same commitment to ergonomics, connectivity, and community that made our first centre a success.
          </p>
        </div>
      </section>

      {/* Mission · Vision · Values */}
      <section className="bg-[var(--color-surface-alt)] py-16 md:py-24">
        <div className="content-width">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow">What drives us</p>
            <h2 className="display-lg mt-3 text-[var(--color-navy)]">
              Mission, vision, values.
            </h2>
            <p className="mt-4 text-[15.5px] text-[var(--color-ink-secondary)] leading-relaxed">
              The principles that guide every NammaOffice decision — from how we design our spaces to how we treat our members.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border border-[var(--color-border)] p-6 md:p-7 flex flex-col gap-4"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-navy)] text-[var(--color-gold)]">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-2xl text-[var(--color-navy)]">{title}</h3>
                <p className="text-[14px] text-[var(--color-ink-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="content-width py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat number="8" label="Centres" />
          <Stat number="3" label="Cities" />
          <Stat number="500+" label="Members" />
          <Stat number="4.9" label="Rating" />
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 h-12 px-6 text-[14px] font-semibold rounded-full bg-[var(--color-gold)] text-[var(--color-navy-deep)] hover:bg-[var(--color-gold-deep)] hover:text-white transition-colors shadow-[var(--shadow-cta)]"
          >
            Explore our centres
            <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
          </Link>
        </div>
      </section>

    </>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="font-display text-4xl md:text-5xl text-[var(--color-navy)] leading-none">
        {number}
      </p>
      <p className="mt-2 text-[12px] uppercase tracking-[0.18em] font-semibold text-[var(--color-gold-deep)]">
        {label}
      </p>
    </div>
  );
}
