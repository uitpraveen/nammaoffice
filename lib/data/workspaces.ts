import type { Workspace, WorkspaceSlug } from "@/lib/types";

export const workspaces: Workspace[] = [
  {
    slug: "private-cabin",
    name: "Private Cabin",
    shortDescription:
      "Fully enclosed private offices for teams of 2–10, with dedicated infrastructure and a prestigious business address.",
    fullDescription:
      "Our Private Cabins are designed for entrepreneurs, small teams, and branch offices that need the focus and confidentiality of a traditional office without the overhead. Each cabin comes fully furnished with ergonomic furniture, dedicated internet, and branded glass-door entry. Enjoy the feel of your own office while sharing world-class amenities with a vibrant professional community.",
    icon: "/icons/workspace-cabin.svg",
    images: [
      "/images/workspaces/private-cabin-1.jpg",
      "/images/workspaces/private-cabin-2.jpg",
      "/images/workspaces/private-cabin-3.jpg",
    ],
    features: [
      "Fully enclosed glass-door cabin",
      "Dedicated gigabit internet line",
      "Business address & GST registration support",
      "24/7 access with biometric entry",
      "Personalised door signage",
      "Climate-controlled environment",
      "Weekly housekeeping",
    ],
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "cafeteria",
      "printing",
      "parking",
      "security",
      "locker",
      "conference-room",
      "reception",
      "ergonomic-furniture",
    ],
    capacity: "2–10 people",
    privacy: "Full privacy",
    flexibility: "Monthly & annual plans",
    bestFor: "Startups, branch offices, legal & finance teams",
    availableAt: [
      "brindavan-road-salem",
      "ramakrishna-road-salem",
      "new-bus-stand-salem",
      "tidel-neo-salem",
      "asha-grand-trichy",
      "tidel-neo-tirupur",
    ],
    seoTitle: "Private Cabin Coworking Space | NammaOffice",
    seoDescription:
      "Book a private cabin at NammaOffice in Salem, Trichy, or Tirupur. Fully enclosed offices for 2–10 people with dedicated internet, business address, and premium amenities.",
  },
  {
    slug: "open-desk",
    name: "Open Desk",
    shortDescription:
      "Flexible hot-desking in a vibrant coworking floor — ideal for freelancers and remote workers who thrive in a collaborative environment.",
    fullDescription:
      "The Open Desk is our most flexible workspace option. Walk in, pick your seat, and get straight to work. You get access to our high-speed Wi-Fi, ergonomic seating, printing facilities, and all common area amenities. Perfect for freelancers, remote employees, and digital nomads who want a professional environment without a fixed commitment.",
    icon: "/icons/workspace-open-desk.svg",
    images: [
      "/images/workspaces/open-desk-1.jpg",
      "/images/workspaces/open-desk-2.jpg",
    ],
    features: [
      "Flexible daily, weekly, or monthly plans",
      "Access to shared high-speed internet",
      "Ergonomic seating",
      "Access to common lounge and pantry",
      "Community networking events",
      "Printing & scanning access",
    ],
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "cafeteria",
      "printing",
      "parking",
      "security",
      "breakout-zone",
      "ergonomic-furniture",
    ],
    capacity: "1 person per desk",
    privacy: "Open shared space",
    flexibility: "Daily, weekly, monthly",
    bestFor: "Freelancers, remote workers, digital nomads",
    availableAt: [
      "brindavan-road-salem",
      "ramakrishna-road-salem",
      "new-bus-stand-salem",
      "tidel-neo-salem",
      "fort-hosur-salem",
      "asha-grand-trichy",
      "tidel-neo-tirupur",
    ],
    seoTitle: "Open Desk Coworking Space | NammaOffice",
    seoDescription:
      "Hot-desk at NammaOffice coworking spaces across Salem, Trichy, and Tirupur. Flexible daily and monthly plans for freelancers and remote workers.",
  },
  {
    slug: "cubicle",
    name: "Cubicle",
    shortDescription:
      "Semi-private dedicated desks with partitioned walls — the sweet spot between open desking and a full private cabin.",
    fullDescription:
      "NammaOffice Cubicles offer the best of both worlds: the focus and semi-privacy of a partitioned workspace combined with the community and shared amenities of a coworking environment. Your dedicated desk is always yours — no hot-desking, no sharing. Store your belongings, personalise your space, and enjoy consistent access without a full cabin commitment.",
    icon: "/icons/workspace-cubicle.svg",
    images: [
      "/images/workspaces/cubicle-1.jpg",
      "/images/workspaces/cubicle-2.jpg",
    ],
    features: [
      "Dedicated fixed desk — always yours",
      "Partitioned walls for focus",
      "Personal storage and locker",
      "Business address eligibility",
      "Access to all common amenities",
      "Monthly & quarterly plans",
    ],
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "cafeteria",
      "printing",
      "parking",
      "security",
      "locker",
      "ergonomic-furniture",
      "breakout-zone",
    ],
    capacity: "1 person",
    privacy: "Semi-private with partitions",
    flexibility: "Monthly & quarterly plans",
    bestFor: "Professionals who need a dedicated space without a full cabin",
    availableAt: [
      "brindavan-road-salem",
      "ramakrishna-road-salem",
      "new-bus-stand-salem",
      "asha-grand-trichy",
      "tidel-neo-tirupur",
    ],
    seoTitle: "Dedicated Cubicle Workspace | NammaOffice",
    seoDescription:
      "Book a dedicated cubicle at NammaOffice. Semi-private, always yours — the perfect workspace for professionals in Salem, Trichy, and Tirupur.",
  },
  {
    slug: "meeting-hall",
    name: "Meeting Hall",
    shortDescription:
      "Professional meeting rooms and large conference halls for client presentations, workshops, and team meetings.",
    fullDescription:
      "Impress clients and collaborate effectively in NammaOffice's fully equipped meeting halls. Available in sizes from intimate 6-person boardrooms to large 40-person conference halls, each space features HD projectors or LED screens, high-speed internet, whiteboard walls, and professional AV systems. Book by the hour, half-day, or full day.",
    icon: "/icons/workspace-meeting.svg",
    images: [
      "/images/workspaces/meeting-hall-1.jpg",
      "/images/workspaces/meeting-hall-2.jpg",
      "/images/workspaces/meeting-hall-3.jpg",
    ],
    features: [
      "HD projector / LED display",
      "Video conferencing setup",
      "Whiteboard and flip charts",
      "High-speed dedicated internet",
      "Catering on request",
      "Hourly, half-day, and full-day booking",
      "Professional front desk support",
    ],
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "cafeteria",
      "printing",
      "parking",
      "security",
      "reception",
    ],
    capacity: "6–40 people",
    privacy: "Fully private when booked",
    flexibility: "Hourly, half-day, full-day",
    bestFor: "Client meetings, workshops, training sessions, board meetings",
    availableAt: [
      "brindavan-road-salem",
      "ramakrishna-road-salem",
      "new-bus-stand-salem",
      "tidel-neo-salem",
      "asha-grand-trichy",
      "tidel-neo-tirupur",
    ],
    seoTitle: "Meeting Hall & Conference Room Booking | NammaOffice",
    seoDescription:
      "Book professional meeting halls and conference rooms at NammaOffice in Salem, Trichy, and Tirupur. Hourly and full-day bookings with AV setup included.",
  },
  {
    slug: "business-lounge",
    name: "Business Lounge",
    shortDescription:
      "Premium lounge access for professionals who need a polished environment for casual work, client drop-ins, or between meetings.",
    fullDescription:
      "The NammaOffice Business Lounge is an exclusive, premium workspace designed for senior professionals, consultants, and frequent travellers who need a sophisticated environment on demand. Enjoy premium seating, barista-style coffee, a prestigious business address, and a curated community of high-calibre professionals. Available on day-pass or monthly membership.",
    icon: "/icons/workspace-lounge.svg",
    images: [
      "/images/workspaces/business-lounge-1.jpg",
      "/images/workspaces/business-lounge-2.jpg",
    ],
    features: [
      "Premium ergonomic seating",
      "Complimentary barista coffee and snacks",
      "Prestigious business address",
      "Access to meeting rooms at discounted rates",
      "Dedicated lounge concierge",
      "Networking events and member-only benefits",
    ],
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "cafeteria",
      "printing",
      "parking",
      "security",
      "reception",
      "locker",
      "breakout-zone",
      "ergonomic-furniture",
    ],
    capacity: "Shared lounge",
    privacy: "Open premium lounge",
    flexibility: "Day pass & monthly membership",
    bestFor: "Consultants, senior executives, frequent business travellers",
    availableAt: [
      "brindavan-road-salem",
      "tidel-neo-salem",
      "asha-grand-trichy",
      "tidel-neo-tirupur",
    ],
    seoTitle: "Business Lounge Membership | NammaOffice",
    seoDescription:
      "Join the NammaOffice Business Lounge in Salem, Trichy, or Tirupur. Premium workspace with barista coffee, business address, and a high-calibre professional community.",
  },
  {
    slug: "managed-office",
    name: "Managed Office",
    shortDescription:
      "Fully customised, end-to-end managed office spaces for teams of 10–100+. Your brand, our infrastructure.",
    fullDescription:
      "NammaOffice Managed Offices are purpose-built for growing companies that need a fully fitted, professionally managed workspace without the capital expenditure and hassle of a traditional lease. We handle everything — design, build, IT infrastructure, housekeeping, security, and facilities management — so your team can focus entirely on growth. Custom layouts, your branding, flexible lease terms.",
    icon: "/icons/workspace-managed.svg",
    images: [
      "/images/workspaces/managed-office-1.jpg",
      "/images/workspaces/managed-office-2.jpg",
      "/images/workspaces/managed-office-3.jpg",
    ],
    features: [
      "Custom branded interior design",
      "End-to-end IT infrastructure setup",
      "Dedicated facilities management team",
      "Flexible lease terms (1–5 years)",
      "Scalable — grow from 10 to 100+ seats",
      "All-inclusive pricing (no hidden costs)",
      "Dedicated account manager",
    ],
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "cafeteria",
      "printing",
      "parking",
      "security",
      "locker",
      "conference-room",
      "reception",
      "ergonomic-furniture",
      "breakout-zone",
    ],
    capacity: "10–100+ people",
    privacy: "Fully private dedicated floor/wing",
    flexibility: "1–5 year flexible lease",
    bestFor: "SMEs, IT companies, corporate branch offices",
    availableAt: [
      "tidel-neo-salem",
      "new-bus-stand-salem",
      "asha-grand-trichy",
      "tidel-neo-tirupur",
    ],
    seoTitle: "Managed Office Space for Teams | NammaOffice",
    seoDescription:
      "NammaOffice Managed Offices in Salem, Trichy, and Tirupur. Fully customised, end-to-end managed workspaces for teams of 10–100+. Flexible leases, zero capex.",
  },
];

export function getWorkspace(slug: WorkspaceSlug): Workspace | undefined {
  return workspaces.find((w) => w.slug === slug);
}

export function getWorkspacesByLocation(locationSlug: string): Workspace[] {
  return workspaces.filter((w) => w.availableAt.includes(locationSlug));
}
