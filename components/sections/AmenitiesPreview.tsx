import Link from "next/link";
import {
  ArrowRight,
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

const ICONS: { icon: LucideIcon; label: string }[] = [
  { icon: Wifi, label: "Gigabit Wi-Fi" },
  { icon: Zap, label: "Power backup" },
  { icon: Wind, label: "Air conditioning" },
  { icon: Coffee, label: "Cafeteria" },
  { icon: Printer, label: "Printing & scan" },
  { icon: Car, label: "Free parking" },
  { icon: ShieldCheck, label: "24/7 security" },
  { icon: Lock, label: "Personal locker" },
  { icon: Users, label: "Conference rooms" },
  { icon: Bell, label: "Reception" },
  { icon: Armchair, label: "Ergonomic seating" },
  { icon: Sofa, label: "Breakout zones" },
];

export function AmenitiesPreview() {
  return (
    <section className="section-padding bg-[var(--color-surface-alt)]">
      <div className="content-width">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Amenities</p>
            <h2 className="display-lg mt-3 text-[var(--color-navy)]">
              Everything you need, included.
            </h2>
            <p className="mt-4 text-[16px] text-[var(--color-ink-secondary)] leading-relaxed">
              From fibre internet to ergonomic seating, every amenity is on every floor — at every centre.
            </p>
          </div>
          <Link
            href="/amenities"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-navy)] hover:text-[var(--color-gold-deep)] transition-colors"
          >
            See full list
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
          </Link>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ICONS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white border border-[var(--color-border)]"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-gold-50)] text-[var(--color-gold-deep)]">
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <span className="text-[13.5px] font-semibold text-[var(--color-navy)] leading-tight">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
