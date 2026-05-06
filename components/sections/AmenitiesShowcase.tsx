"use client";

import Link from "next/link";
import { motion } from "motion/react";
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

interface Item {
  icon: LucideIcon;
  label: string;
  hint: string;
}

const ITEMS: Item[] = [
  { icon: Wifi, label: "Gigabit Wi-Fi", hint: "1 Gbps fibre, redundant ISPs" },
  { icon: Zap, label: "Power backup", hint: "Generator + UPS, zero downtime" },
  { icon: Wind, label: "Air conditioning", hint: "Year-round comfort" },
  { icon: Coffee, label: "Cafeteria", hint: "Tea / coffee, all day" },
  { icon: Printer, label: "Printing & scan", hint: "High-speed, on-demand" },
  { icon: Car, label: "Free parking", hint: "Cars + two-wheelers" },
  { icon: ShieldCheck, label: "24/7 security", hint: "CCTV + trained staff" },
  { icon: Lock, label: "Personal locker", hint: "Secure storage" },
  { icon: Users, label: "Conference rooms", hint: "AV-ready, bookable" },
  { icon: Bell, label: "Reception", hint: "Mail, calls, visitors" },
  { icon: Armchair, label: "Ergonomic seating", hint: "Premium chairs + desks" },
  { icon: Sofa, label: "Breakout zones", hint: "Quiet relaxation areas" },
];

export function AmenitiesShowcase() {
  return (
    <section className="bg-[var(--color-surface-alt)] py-20 md:py-28">
      <div className="content-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12"
        >
          <div className="max-w-2xl">
            <p className="eyebrow">Amenities</p>
            <h2 className="display-lg mt-3 text-[var(--color-navy)]">
              Everything you need.{" "}
              <span className="text-[var(--color-gold-deep)] italic font-normal">
                Already included.
              </span>
            </h2>
            <p className="mt-4 text-[16px] text-[var(--color-ink-secondary)] leading-relaxed">
              From fibre internet to ergonomic seating — every detail is on every floor, at every centre.
            </p>
          </div>
          <Link
            href="/amenities"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-navy)] hover:text-[var(--color-gold-deep)] transition-colors group"
          >
            See full list
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              strokeWidth={2.25}
            />
          </Link>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ staggerChildren: 0.04, delayChildren: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {ITEMS.map(({ icon: Icon, label, hint }) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-white border border-[var(--color-border)] hover:border-[var(--color-gold-300)] hover:shadow-[var(--shadow-brand)] transition-all"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-gold-50)] text-[var(--color-gold-deep)] group-hover:bg-[var(--color-navy)] group-hover:text-[var(--color-gold)] transition-colors">
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[14.5px] font-semibold text-[var(--color-navy)] leading-tight">
                  {label}
                </p>
                <p className="text-[12.5px] text-[var(--color-ink-secondary)] mt-0.5">
                  {hint}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
