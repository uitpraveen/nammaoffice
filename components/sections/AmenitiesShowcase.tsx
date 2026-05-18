"use client";

import { motion } from "motion/react";
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

interface Item {
  icon: LucideIcon;
  label: string;
  hint: string;
  color: string;
  shadow: string;
}

const ITEMS: Item[] = [
  { icon: Wifi,        label: "Gigabit Wi-Fi",     hint: "1 Gbps fibre, redundant ISPs",   color: "#F97316", shadow: "249, 115, 22" },
  { icon: Zap,         label: "Power backup",      hint: "Generator + UPS, zero downtime", color: "#F59E0B", shadow: "245, 158, 11" },
  { icon: Wind,        label: "Air conditioning",  hint: "Year-round comfort",             color: "#06B6D4", shadow: "6, 182, 212"  },
  { icon: Coffee,      label: "Cafeteria",         hint: "Tea / coffee, all day",          color: "#A16207", shadow: "161, 98, 7"   },
  { icon: Printer,     label: "Printing & scan",   hint: "High-speed, on-demand",          color: "#6366F1", shadow: "99, 102, 241" },
  { icon: Car,         label: "Free parking",      hint: "Cars + two-wheelers",            color: "#10B981", shadow: "16, 185, 129" },
  { icon: ShieldCheck, label: "24/7 security",     hint: "CCTV + trained staff",           color: "#EF4444", shadow: "239, 68, 68"  },
  { icon: Lock,        label: "Personal locker",   hint: "Secure storage",                 color: "#475569", shadow: "71, 85, 105"  },
  { icon: Users,       label: "Conference rooms",  hint: "AV-ready, bookable",             color: "#8B5CF6", shadow: "139, 92, 246" },
  { icon: Bell,        label: "Reception",         hint: "Mail, calls, visitors",          color: "#EC4899", shadow: "236, 72, 153" },
  { icon: Armchair,    label: "Ergonomic seating", hint: "Premium chairs + desks",         color: "#14B8A6", shadow: "20, 184, 166" },
  { icon: Sofa,        label: "Breakout zones",    hint: "Quiet relaxation areas",         color: "#E11D48", shadow: "225, 29, 72"  },
];

/**
 * Amenities showcase — anchored at id="amenities" so the nav menu
 * scrolls here instead of routing to a separate page. Each tile gets
 * its own vibrant accent so the section reads colourful against the
 * otherwise restrained matt-black + brick palette.
 */
export function AmenitiesShowcase() {
  return (
    <section
      id="amenities"
      className="relative overflow-hidden bg-[var(--color-surface-alt)] py-20 md:py-28"
    >
      {/* Soft, blurred colour orbs — give the section a confetti glow without competing with the cards. */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#F97316] opacity-[0.18] blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-[24rem] h-[24rem] rounded-full bg-[#06B6D4] opacity-[0.18] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[26rem] h-[26rem] rounded-full bg-[#10B981] opacity-[0.16] blur-[120px]" />
        <div className="absolute -bottom-16 right-1/3 w-[22rem] h-[22rem] rounded-full bg-[#8B5CF6] opacity-[0.16] blur-[120px]" />
      </div>

      <div className="content-width relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
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
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {ITEMS.map(({ icon: Icon, label, hint, color, shadow }) => (
            <motion.li
              key={label}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.94 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              style={
                {
                  "--tile-rgb": shadow,
                } as React.CSSProperties
              }
              className="group relative flex flex-col gap-4 p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-[var(--color-border)] transition-all duration-300 hover:border-transparent hover:shadow-[0_18px_40px_-12px_rgba(var(--tile-rgb),0.45)]"
            >
              {/* Top tinted ribbon — subtle wash of the tile colour at the top of the card. */}
              <span
                aria-hidden
                style={{ background: `linear-gradient(180deg, rgba(${shadow},0.14) 0%, transparent 100%)` }}
                className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <span
                style={{
                  backgroundColor: color,
                  boxShadow: `0 10px 24px -8px rgba(${shadow},0.55), inset 0 1px 0 rgba(255,255,255,0.25)`,
                }}
                className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              >
                <Icon className="w-5 h-5" strokeWidth={2.25} />
              </span>

              <div className="relative">
                <p className="text-[14.5px] font-semibold text-[var(--color-navy)] leading-tight">
                  {label}
                </p>
                <p className="text-[12.5px] text-[var(--color-ink-secondary)] mt-1 leading-relaxed">
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
