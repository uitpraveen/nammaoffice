import type { NavItem } from "@/lib/types";

/**
 * Top nav — fully flat. Every item is a direct link to a page; no
 * dropdowns at all. Locations was the last dropdown and now resolves
 * to /locations, which grids all 8 centres in one tap.
 *
 * Forms aggregates the 4 form pages at /forms; Gate Pass aggregates
 * the unified bookings/gate-pass form at /gate-pass.
 */
export const navigation: NavItem[] = [
  { label: "Locations", href: "/locations" },
  { label: "Amenities", href: "/amenities" },
  { label: "Forms", href: "/forms" },
  { label: "Franchise", href: "/franchise" },
  { label: "Gate Pass", href: "/gate-pass" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
