import type { NavItem } from "@/lib/types";

export const navigation: NavItem[] = [
  {
    label: "Workspaces",
    href: "/workspaces",
    children: [
      { label: "Private Cabin", href: "/workspaces/private-cabin" },
      { label: "Open Desk", href: "/workspaces/open-desk" },
      { label: "Cubicle", href: "/workspaces/cubicle" },
      { label: "Meeting Hall", href: "/workspaces/meeting-hall" },
      { label: "Business Lounge", href: "/workspaces/business-lounge" },
      { label: "Managed Office", href: "/workspaces/managed-office" },
    ],
  },
  {
    label: "Locations",
    href: "/locations",
    children: [
      { label: "Salem", href: "/locations/salem" },
      { label: "Trichy", href: "/locations/trichy" },
      { label: "Tirupur", href: "/locations/tirupur" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Franchise", href: "/franchise" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
