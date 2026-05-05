import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { amenities } from "@/lib/data/amenities";
import {
  Wifi,
  Zap,
  Wind,
  Coffee,
  Printer,
  Car,
  ShieldCheck,
  Lock,
  Users,
  Bell,
  Armchair,
  Sofa,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "high-speed-wifi": Wifi,
  "power-backup": Zap,
  "air-conditioning": Wind,
  cafeteria: Coffee,
  printing: Printer,
  parking: Car,
  security: ShieldCheck,
  locker: Lock,
  "conference-room": Users,
  reception: Bell,
  "ergonomic-furniture": Armchair,
  "breakout-zone": Sofa,
};

export const metadata: Metadata = {
  title: "Amenities",
  description:
    "Premium amenities across every NammaOffice centre — high-speed Wi-Fi, power backup, AC, cafeteria, parking, 24/7 security, conference rooms, and more.",
};

export default function AmenitiesPage() {
  return (
    <>
      <HeroBanner
        eyebrow="Built for productive work"
        title="Every detail handled."
        subtitle="From 1 Gbps fibre to ergonomic chairs to 24/7 security — every centre comes fully equipped so you can focus on the work."
      />

      <section className="content-width py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {amenities.map((a) => {
            const Icon = ICON_MAP[a.id] ?? ShieldCheck;
            return (
              <div
                key={a.id}
                className="rounded-2xl bg-white border border-[var(--color-border)] p-6 flex flex-col gap-3 hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-brand)] transition-all"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-gold-50)] text-[var(--color-gold-deep)]">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-xl text-[var(--color-navy)] leading-tight">
                  {a.name}
                </h3>
                {a.description && (
                  <p className="text-[14px] text-[var(--color-ink-secondary)] leading-relaxed">
                    {a.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-[var(--color-navy)] py-14 md:py-20">
        <div className="content-width text-center max-w-2xl mx-auto">
          <p className="eyebrow !text-[var(--color-gold-300)]">Ready to visit?</p>
          <h2 className="font-display text-3xl md:text-4xl text-white mt-3 leading-tight">
            See the amenities in person.
          </h2>
          <p className="mt-4 text-[15px] text-white/70 leading-relaxed">
            Walk a centre, meet the team, and experience the workspace before you commit. Book a tour or request a gate pass to drop by.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/bookings"
              className="inline-flex items-center justify-center gap-1.5 h-12 px-6 text-[14px] font-semibold rounded-full bg-[var(--color-gold)] text-[var(--color-navy-deep)] hover:bg-[var(--color-gold-deep)] hover:text-white transition-colors shadow-[var(--shadow-cta)]"
            >
              Book a tour
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <Link
              href="/locations"
              className="inline-flex items-center justify-center gap-1.5 h-12 px-6 text-[14px] font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Browse all centres
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
