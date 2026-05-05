import type { NavItem } from "@/lib/types";

export const navigation: NavItem[] = [
  {
    label: "Workspaces",
    href: "/workspaces",
    children: [
      {
        label: "Private Cabin",
        href: "/workspaces/private-cabin",
        description: "Lockable office for focused work",
        icon: "DoorClosed",
      },
      {
        label: "Open Desk",
        href: "/workspaces/open-desk",
        description: "Flexible shared seating",
        icon: "Armchair",
      },
      {
        label: "Cubicle",
        href: "/workspaces/cubicle",
        description: "Dedicated semi-private desk",
        icon: "PanelsTopLeft",
      },
      {
        label: "Meeting Hall",
        href: "/workspaces/meeting-hall",
        description: "AV-ready rooms for presentations",
        icon: "Presentation",
      },
      {
        label: "Business Lounge",
        href: "/workspaces/business-lounge",
        description: "Premium space for client meetings",
        icon: "Sofa",
      },
      {
        label: "Managed Office",
        href: "/workspaces/managed-office",
        description: "Plug-and-play offices for teams",
        icon: "Building2",
      },
    ],
  },
  {
    label: "Locations",
    href: "/locations",
    children: [
      {
        label: "Salem",
        href: "/locations/salem",
        description: "5 centres across the Steel City",
        icon: "MapPin",
      },
      {
        label: "Trichy",
        href: "/locations/trichy",
        description: "Asha Grand — Temple City",
        icon: "MapPin",
      },
      {
        label: "Tirupur",
        href: "/locations/tirupur",
        description: "TIDEL NEO — Knitwear Capital",
        icon: "MapPin",
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Company Registration",
        href: "/services/company-registration",
        description: "End-to-end business filing",
        icon: "FileSignature",
      },
      {
        label: "Virtual Office",
        href: "/services/virtual-office",
        description: "Address, mail, GST support",
        icon: "Mail",
      },
      {
        label: "Workation",
        href: "/workation",
        description: "Work from inspiring locations",
        icon: "Plane",
      },
    ],
  },
  {
    label: "Company",
    href: "/about",
    children: [
      {
        label: "About Us",
        href: "/about",
        description: "Our story and mission",
        icon: "Sparkles",
      },
      {
        label: "Franchise",
        href: "/franchise",
        description: "40% ROI partnership program",
        icon: "Handshake",
      },
      {
        label: "Gallery",
        href: "/gallery",
        description: "Photos from our spaces",
        icon: "Images",
      },
      {
        label: "FAQ",
        href: "/faq",
        description: "Common questions answered",
        icon: "HelpCircle",
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];
