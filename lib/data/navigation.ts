import type { NavItem } from "@/lib/types";
import { cities, locations } from "@/lib/data/locations";

/**
 * Locations dropdown — flat list of all 8 centres with a city tag chip.
 * Generated from `locations` data so adding a centre updates the nav.
 * Order: Salem (6), Trichy, Tirupur — matches the homepage and footer.
 *
 * Locations is the only dropdown in the v2 nav. Forms and Service Desk
 * (formerly dropdowns) collapsed to single landing pages — `/forms` and
 * `/gate-pass` — that internally grid the sub-options. Lighter chrome,
 * one less mental step for the user.
 */
const locationChildren = locations.map((loc) => {
  const city = cities.find((c) => c.slug === loc.city);
  return {
    label: loc.name,
    href: `/locations/${loc.city}/${loc.slug}`,
    description: loc.address,
    icon: "MapPin",
    cityTag: city?.name ?? loc.city,
  };
});

export const navigation: NavItem[] = [
  {
    label: "Locations",
    href: "/locations",
    children: locationChildren,
  },
  { label: "Amenities", href: "/amenities" },
  { label: "Forms", href: "/forms" },
  { label: "Franchise", href: "/franchise" },
  { label: "Gate Pass", href: "/gate-pass" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
