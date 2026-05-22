import type { NavItem } from "@/lib/types";

/**
 * Top nav order chosen by client:
 *   Home · About · Locations · Amenities · Contact · Franchise · Forms
 *
 * "Forms" is the single dropdown — houses the four registration forms,
 * the bookings form, and the TIDEL gate-pass request. Keeps the top
 * bar to 7 items so it doesn't run wide on shorter desktops.
 * Amenities scrolls to the home-page #amenities anchor.
 */
export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Locations", href: "/#centres" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Contact", href: "/contact" },
  { label: "Franchise", href: "/franchise" },
  {
    label: "Forms",
    href: "/forms",
    children: [
      {
        label: "Company Form",
        href: "/registration/company",
        description: "Register Pvt Ltd, LLP, OPC, partnership or proprietorship.",
        icon: "Building2",
      },
      {
        label: "User Form",
        href: "/registration/user",
        description: "Member onboarding — KYC, vehicle and contact details.",
        icon: "UserPlus",
      },
      {
        label: "Vendor Form",
        href: "/registration/vendor",
        description: "Apply to become an approved NammaOffice vendor.",
        icon: "Briefcase",
      },
      {
        label: "Bookings Form",
        href: "/bookings",
        description: "Book a meeting hall or request a TIDEL gate pass.",
        icon: "CalendarCheck",
      },
      {
        label: "Gate Pass",
        href: "/gate-pass",
        description: "Request a visitor pass for the Salem or Tirupur TIDEL parks.",
        icon: "TicketCheck",
      },
    ],
  },
];
