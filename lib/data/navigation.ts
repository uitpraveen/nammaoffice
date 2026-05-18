import type { NavItem } from "@/lib/types";

/**
 * Top nav order chosen by client:
 *   Home · About · Amenities · Contact · Franchise · Registration Forms · Gate Pass
 *
 * "Registration Forms" is a dropdown with four leaves: Company, User,
 * Vendor, Bookings. Amenities scrolls to the home-page #amenities anchor.
 */
export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Contact", href: "/contact" },
  { label: "Franchise", href: "/franchise" },
  {
    label: "Registration Forms",
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
    ],
  },
  { label: "Gate Pass", href: "/gate-pass" },
];
