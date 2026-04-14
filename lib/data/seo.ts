export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

export const pageSEO: Record<string, PageSEO> = {
  // Home
  "/": {
    title: "NammaOffice — Premium Coworking Spaces in Salem, Trichy & Tirupur",
    description:
      "NammaOffice offers premium coworking spaces, private cabins, managed offices, and meeting halls across 7 centres in Salem, Trichy, and Tirupur, Tamil Nadu. Flexible plans for individuals and teams.",
    keywords: [
      "coworking space Tamil Nadu",
      "coworking Salem",
      "coworking Trichy",
      "coworking Tirupur",
      "private cabin Salem",
      "managed office Salem",
      "NammaOffice",
    ],
    ogImage: "/images/og/home.jpg",
  },

  // Workspaces listing
  "/workspaces": {
    title: "Workspace Types | Private Cabins, Open Desks & More — NammaOffice",
    description:
      "Explore NammaOffice workspace options: private cabins, open desks, cubicles, meeting halls, business lounges, and managed offices. Find the perfect workspace for your needs.",
    keywords: [
      "private cabin coworking",
      "open desk coworking",
      "managed office Tamil Nadu",
      "meeting hall booking",
      "business lounge",
    ],
    ogImage: "/images/og/workspaces.jpg",
  },

  // Individual workspace pages
  "/workspaces/private-cabin": {
    title: "Private Cabin — Fully Enclosed Office Space | NammaOffice",
    description:
      "Book a private cabin at NammaOffice. Fully enclosed, dedicated offices for 2–10 people with business address, dedicated internet, and 24/7 access across Salem, Trichy, and Tirupur.",
    keywords: [
      "private cabin coworking Salem",
      "private office Salem",
      "private cabin Trichy",
      "private cabin Tirupur",
    ],
    ogImage: "/images/og/private-cabin.jpg",
  },
  "/workspaces/open-desk": {
    title: "Open Desk Coworking — Flexible Hot-Desking | NammaOffice",
    description:
      "Flexible hot-desking at NammaOffice. Daily, weekly, and monthly plans for freelancers and remote workers across Salem, Trichy, and Tirupur. Walk in and work.",
    keywords: [
      "hot desk Salem",
      "coworking day pass Salem",
      "flexible desk Trichy",
      "freelancer workspace Tirupur",
    ],
    ogImage: "/images/og/open-desk.jpg",
  },
  "/workspaces/cubicle": {
    title: "Dedicated Cubicle Workspace | NammaOffice",
    description:
      "Semi-private dedicated desk at NammaOffice. Always your desk — partitioned for focus, with personal storage and business address eligibility. Monthly plans available.",
    keywords: [
      "dedicated desk Salem",
      "cubicle coworking",
      "fixed desk Trichy",
      "dedicated workspace Tirupur",
    ],
    ogImage: "/images/og/cubicle.jpg",
  },
  "/workspaces/meeting-hall": {
    title: "Meeting Hall & Conference Room Booking | NammaOffice",
    description:
      "Book professional meeting halls at NammaOffice. 6–40 person capacity, HD screens, video conferencing, and catering on request. Hourly and full-day bookings.",
    keywords: [
      "meeting room Salem",
      "conference room Trichy",
      "meeting hall Tirupur",
      "boardroom booking Tamil Nadu",
    ],
    ogImage: "/images/og/meeting-hall.jpg",
  },
  "/workspaces/business-lounge": {
    title: "Business Lounge Membership | NammaOffice",
    description:
      "Premium business lounge membership at NammaOffice. Barista coffee, prestigious address, networking community, and meeting room access. Day pass and monthly plans.",
    keywords: [
      "business lounge Salem",
      "premium coworking Trichy",
      "executive lounge Tirupur",
    ],
    ogImage: "/images/og/business-lounge.jpg",
  },
  "/workspaces/managed-office": {
    title: "Managed Office Space for Teams | NammaOffice",
    description:
      "End-to-end managed offices for teams of 10–100+ at NammaOffice. Custom-branded, fully managed with flexible leases. Zero capex, full infrastructure in Salem, Trichy, Tirupur.",
    keywords: [
      "managed office Salem",
      "managed office Trichy",
      "managed office Tirupur",
      "enterprise coworking Tamil Nadu",
    ],
    ogImage: "/images/og/managed-office.jpg",
  },

  // Locations listing
  "/locations": {
    title: "Our Locations — 7 Centres Across Salem, Trichy & Tirupur | NammaOffice",
    description:
      "Find your nearest NammaOffice coworking centre. 7 locations across Salem (5), Trichy (1), and Tirupur (1) with premium workspace facilities.",
    keywords: [
      "coworking locations Tamil Nadu",
      "NammaOffice centres",
      "coworking Salem address",
      "coworking Trichy address",
    ],
    ogImage: "/images/og/locations.jpg",
  },

  // City pages
  "/locations/salem": {
    title: "Coworking Space in Salem — 5 Centres | NammaOffice",
    description:
      "Premium coworking spaces in Salem at 5 locations: Brindavan Road, Ramakrishna Road, New Bus Stand, TIDEL NEO, and Fort Hosur. Book your workspace today.",
    keywords: [
      "coworking space Salem",
      "private cabin Salem",
      "meeting room Salem",
      "managed office Salem",
      "Salem coworking",
    ],
    ogImage: "/images/og/salem.jpg",
  },
  "/locations/trichy": {
    title: "Coworking Space in Trichy — Asha Grand | NammaOffice",
    description:
      "Premium coworking space in Trichy at Asha Grand. Private cabins, open desks, meeting halls, and managed offices in Tiruchirappalli. Book your workspace today.",
    keywords: [
      "coworking space Trichy",
      "coworking Tiruchirappalli",
      "private cabin Trichy",
      "meeting room Trichy",
    ],
    ogImage: "/images/og/trichy.jpg",
  },
  "/locations/tirupur": {
    title: "Coworking Space in Tirupur — TIDEL NEO | NammaOffice",
    description:
      "Premium coworking space in Tirupur at TIDEL NEO. Private cabins, open desks, managed offices for textile exporters and MSMEs. Book your workspace today.",
    keywords: [
      "coworking space Tirupur",
      "office space Tirupur",
      "private cabin Tirupur",
      "managed office Tirupur",
    ],
    ogImage: "/images/og/tirupur.jpg",
  },

  // Individual location pages
  "/locations/salem/brindavan-road": {
    title: "NammaOffice Brindavan Road, Salem — Anushka Tower",
    description:
      "NammaOffice Brindavan Road Salem at Anushka Tower, 5th Floor. Premium coworking with private cabins, open desks, meeting halls, and business lounge. Book today.",
    keywords: ["coworking Brindavan Road Salem", "Anushka Tower Salem office"],
    ogImage: "/images/og/brindavan-road.jpg",
  },
  "/locations/salem/ramakrishna-road": {
    title: "NammaOffice Ramakrishna Road, Salem — Balaji Tower",
    description:
      "NammaOffice Ramakrishna Road Salem at Balaji Tower, 3rd Floor. Private cabins, open desks, cubicles, and meeting halls in Salem's commercial hub. Book today.",
    keywords: [
      "coworking Ramakrishna Road Salem",
      "Balaji Tower Salem office",
    ],
    ogImage: "/images/og/ramakrishna-road.jpg",
  },
  "/locations/salem/new-bus-stand": {
    title: "NammaOffice New Bus Stand, Salem",
    description:
      "NammaOffice near Salem New Bus Stand. Centrally located coworking with excellent transport links. Private cabins, open desks, managed offices. Book today.",
    keywords: [
      "coworking near Salem bus stand",
      "office New Bus Stand Salem",
    ],
    ogImage: "/images/og/new-bus-stand.jpg",
  },
  "/locations/salem/tidel-neo": {
    title: "NammaOffice TIDEL NEO, Salem — IT Park Coworking",
    description:
      "NammaOffice TIDEL NEO Salem. Premium coworking in Salem's IT park for tech companies and startups. Managed offices, private cabins, business lounge. Book today.",
    keywords: [
      "coworking TIDEL NEO Salem",
      "IT park office Salem",
      "tech startup Salem",
    ],
    ogImage: "/images/og/tidel-neo.jpg",
  },
  "/locations/salem/fort-hosur": {
    title: "NammaOffice Fort Hosur, Salem",
    description:
      "NammaOffice Fort Hosur Salem. Coworking in Salem's heritage commercial area, ideal for legal, financial, and trading professionals. Flexible desk plans. Book today.",
    keywords: ["coworking Fort Hosur Salem", "office Salem old town"],
    ogImage: "/images/og/fort-hosur.jpg",
  },
  "/locations/trichy/asha-grand": {
    title: "NammaOffice Asha Grand, Trichy",
    description:
      "NammaOffice Asha Grand Trichy. Premium coworking in the heart of Tiruchirappalli. Private cabins, open desks, meeting halls, managed offices. Book today.",
    keywords: [
      "coworking Asha Grand Trichy",
      "office space Tiruchirappalli",
      "NammaOffice Trichy",
    ],
    ogImage: "/images/og/asha-grand.jpg",
  },
  "/locations/tirupur/tidel-neo": {
    title: "NammaOffice TIDEL NEO, Tirupur",
    description:
      "NammaOffice TIDEL NEO Tirupur. Premium coworking for textile exporters and MSMEs. Private cabins, managed offices, meeting halls in Tirupur's tech park. Book today.",
    keywords: [
      "coworking TIDEL NEO Tirupur",
      "office space Tirupur",
      "NammaOffice Tirupur",
    ],
    ogImage: "/images/og/tidel-neo.jpg",
  },

  // Other pages
  "/about": {
    title: "About NammaOffice — Our Story, Mission & Team",
    description:
      "Learn about NammaOffice — how we started in Salem and grew to 7 centres across Tamil Nadu. Our mission: make premium workspaces accessible to every entrepreneur.",
    keywords: [
      "about NammaOffice",
      "NammaOffice history",
      "coworking Tamil Nadu story",
    ],
    ogImage: "/images/og/about.jpg",
  },
  "/franchise": {
    title: "NammaOffice Franchise — Own a Coworking Centre | 40% ROI",
    description:
      "Own a NammaOffice franchise. 2,000–20,000 sq ft centres, 5+5 year agreement, 40% projected ROI, 2.5 year payback. Full support from site to launch. Apply today.",
    keywords: [
      "coworking franchise Tamil Nadu",
      "NammaOffice franchise",
      "coworking business opportunity",
      "franchise investment India",
    ],
    ogImage: "/images/og/franchise.jpg",
  },
  "/gallery": {
    title: "Gallery — Inside NammaOffice Coworking Spaces | Salem, Trichy, Tirupur",
    description:
      "Take a virtual tour of NammaOffice centres. Browse photos of our private cabins, open desks, meeting halls, business lounges, and managed offices across Salem, Trichy, and Tirupur.",
    keywords: ["NammaOffice gallery", "coworking space photos", "office space images"],
    ogImage: "/images/og/gallery.jpg",
  },
  "/contact": {
    title: "Contact NammaOffice — Book a Tour or Get in Touch",
    description:
      "Contact NammaOffice to book a workspace tour, get pricing information, or make an enquiry. Call +91 9092109213, WhatsApp, or fill out our contact form.",
    keywords: [
      "contact NammaOffice",
      "coworking enquiry Salem",
      "book office tour Tamil Nadu",
    ],
    ogImage: "/images/og/contact.jpg",
  },
  "/blog": {
    title: "Blog — Workspace & Business Insights | NammaOffice",
    description:
      "Insights, tips, and stories from the NammaOffice community. Learn about coworking trends, business growth, and entrepreneurship in Tamil Nadu.",
    keywords: [
      "coworking blog",
      "business blog Tamil Nadu",
      "NammaOffice insights",
    ],
    ogImage: "/images/og/blog.jpg",
  },
};

export function getPageSEO(path: string): PageSEO {
  return (
    pageSEO[path] ?? {
      title: "NammaOffice — Premium Coworking Spaces in Tamil Nadu",
      description:
        "Premium coworking spaces, private cabins, managed offices, and meeting halls across Salem, Trichy, and Tirupur.",
      ogImage: "/images/og/home.jpg",
    }
  );
}
