import type { NavItem } from "@/lib/types";

/**
 * Top nav — fully flat. Logical grouping in this order:
 *   Browse → Why-us → Action → Corporate
 *   Locations · Amenities · Franchise · Forms · Gate Pass · About · Contact
 *
 * No dropdowns. Forms aggregates the 4 form pages at /forms; Gate Pass
 * aggregates the unified bookings/gate-pass form at /gate-pass.
 */
export const navigation: NavItem[] = [
  { label: "Locations", href: "/locations" },
  { label: "Amenities", href: "/amenities" },
  { label: "Franchise", href: "/franchise" },
  { label: "Forms", href: "/forms" },
  { label: "Gate Pass", href: "/gate-pass" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
