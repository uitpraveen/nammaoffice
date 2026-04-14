import type { NavItem } from "@/lib/types";

export const navigation: NavItem[] = [
  {
    label: "Workspaces",
    href: "/workspaces",
    children: [
      {
        label: "Private Cabin",
        href: "/workspaces/private-cabin",
        description: "Fully furnished, lockable workspace for focused productivity",
      },
      {
        label: "Open Desk",
        href: "/workspaces/open-desk",
        description: "Flexible shared seating in a vibrant community environment",
      },
      {
        label: "Cubicle",
        href: "/workspaces/cubicle",
        description: "Semi-private workstations balancing focus and openness",
      },
      {
        label: "Meeting Hall",
        href: "/workspaces/meeting-hall",
        description: "AV-equipped rooms for presentations and conferences",
      },
      {
        label: "Business Lounge",
        href: "/workspaces/business-lounge",
        description: "Premium networking space for client meetings",
      },
      {
        label: "Managed Office",
        href: "/workspaces/managed-office",
        description: "Plug-and-play offices for teams of 10 to 100+",
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
        description: "5 premium centres across the Steel City's business districts",
      },
      {
        label: "Trichy",
        href: "/locations/trichy",
        description: "Asha Grand — coworking in the Temple City's heart",
      },
      {
        label: "Tirupur",
        href: "/locations/tirupur",
        description: "TIDEL NEO — workspace in the Knitwear Capital",
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
        description: "End-to-end business entity formation and filing",
      },
      {
        label: "Virtual Office",
        href: "/services/virtual-office",
        description: "Prestigious address, mail handling, and GST support",
      },
      {
        label: "Workation",
        href: "/workation",
        description: "Combine work and travel from inspiring locations",
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
        description: "Our story, mission, and the team behind NammaOffice",
      },
      {
        label: "Franchise",
        href: "/franchise",
        description: "Partner with us — 40% ROI, 2.5 year payback",
      },
      {
        label: "Gallery",
        href: "/gallery",
        description: "Browse photos of our spaces across all cities",
      },
      {
        label: "FAQ",
        href: "/faq",
        description: "Answers to common questions about our workspaces",
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];
