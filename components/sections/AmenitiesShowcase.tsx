"use client";

import { motion } from "motion/react";
import {
  Wifi,
  BatteryCharging,
  Snowflake,
  Coffee,
  Printer,
  ParkingSquare,
  Shield,
  Lock,
  Presentation,
  Bell,
  Armchair,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import { fadeUp } from "@/lib/motion";

interface Item {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const items: Item[] = [
  { icon: Wifi,             title: "High-speed internet", desc: "Fast, reliable Wi-Fi" },
  { icon: BatteryCharging,  title: "Backup",     desc: "Generator + UPS, zero downtime" },
  { icon: Snowflake,        title: "Climate",    desc: "Year-round comfort" },
  { icon: Coffee,           title: "Cafeteria",  desc: "Tea / coffee, all day" },
  { icon: Printer,          title: "Print",      desc: "High-speed, on-demand" },
  { icon: ParkingSquare,    title: "Parking",    desc: "Cars + two-wheelers" },
  { icon: Shield,           title: "Security",   desc: "CCTV + trained staff" },
  { icon: Lock,             title: "Locker",     desc: "Secure storage" },
  { icon: Presentation,     title: "Conference", desc: "AV-ready, bookable" },
  { icon: Bell,             title: "Reception",  desc: "Mail, calls, visitors" },
  { icon: Armchair,         title: "Seating",    desc: "Premium chairs + desks" },
  { icon: TreePine,         title: "Breakout",   desc: "Quiet relaxation areas" },
];

export function AmenitiesShowcase() {
  return (
    <section
      id="amenities"
      className="py-24 md:py-32"
      style={{ background: "var(--card)" }}
    >
      <div className="content-width">
        <motion.div {...fadeUp} className="mb-16 max-w-[64ch]">
          <p className="eyebrow mb-6">Amenities</p>
          <h2 className="display text-[40px] md:text-[64px]">
            Everything you need.{" "}
            <span className="display-italic">Already included.</span>
          </h2>
          <p
            className="mt-6 text-[17px] leading-[1.65] max-w-[52ch]"
            style={{ color: "var(--ink-muted)" }}
          >
            From fibre internet to ergonomic seating — every detail is on every
            floor, at every centre.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px border hairline rounded-2xl overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.05 }}
              className="bg-card p-7 md:p-8 group transition-colors duration-300"
              style={{ background: "var(--card)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--accent-bg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--card)")
              }
            >
              <item.icon
                className="w-5 h-5 mb-6"
                strokeWidth={1.5}
                style={{ color: "var(--accent)" }}
              />
              <h3 className="display text-[22px] md:text-[26px]" style={{ color: "var(--ink)" }}>
                {item.title}
              </h3>
              <p
                className="mt-2 text-[13px] leading-[1.55]"
                style={{ color: "var(--ink-muted)" }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
