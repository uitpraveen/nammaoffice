import type { NavItem } from "@/lib/types";
import { cities, locations } from "@/lib/data/locations";

/**
 * Locations dropdown — flat list of all 8 centres with a city tag chip.
 * Generated from `locations` data so adding a centre updates the nav.
 * Order: Salem (6), Trichy, Tirupur — matches the homepage and footer.
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
  {
    label: "Amenities",
    href: "/amenities",
  },
  {
    label: "Forms",
    href: "/registration/company",
    children: [
      {
        label: "Company Registration",
        href: "/registration/company",
        description: "Register your company with NammaOffice",
        icon: "Building2",
      },
      {
        label: "User Registration",
        href: "/registration/user",
        description: "Register as a member or visitor",
        icon: "UserPlus",
      },
      {
        label: "Vendor Form",
        href: "/registration/vendor",
        description: "Onboard as a NammaOffice vendor",
        icon: "Briefcase",
      },
      {
        label: "Bookings",
        href: "/bookings",
        description: "Book a meeting hall or boardroom",
        icon: "CalendarCheck",
      },
    ],
  },
  {
    label: "Franchise",
    href: "/franchise",
  },
  {
    label: "Service Desk",
    href: "/gate-pass/tidel-neo-salem",
    children: [
      {
        label: "Gate Pass — Salem TIDEL",
        href: "/gate-pass/tidel-neo-salem",
        description: "Request a visitor gate pass for Salem TIDEL NEO",
        icon: "Ticket",
      },
      {
        label: "Gate Pass — Tirupur TIDEL",
        href: "/gate-pass/tidel-neo-tirupur",
        description: "Request a visitor gate pass for Tirupur TIDEL NEO",
        icon: "Ticket",
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
