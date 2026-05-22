import type { NavItem } from "@/lib/types";

/**
 * Top nav order chosen by client:
 *   Home · About · Locations · Amenities · Contact · Franchise · Forms
 *
 * "Forms" is the single dropdown — houses the four registration forms
 * (Company / User / Vendor), the combined Bookings + Gate Pass form,
 * and the Service Desk ticket form. Bookings and Gate Pass were
 * separate menu items but they post to the same Zoho form, so the
 * single entry just toggles `requestType` inside the page.
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
        label: "Bookings & Gate Pass",
        href: "/bookings",
        description: "Book a meeting hall or request a TIDEL gate pass.",
        icon: "CalendarCheck",
      },
      {
        label: "Service Request",
        href: "/service-request",
        description: "Raise a service-desk ticket — facilities, IT, housekeeping.",
        icon: "LifeBuoy",
      },
    ],
  },
];
