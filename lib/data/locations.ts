import type { City, CitySlug, Location } from "@/lib/types";
import { wix } from "@/lib/data/wix-pool";

export const cities: City[] = [
  {
    slug: "salem",
    name: "Salem",
    tagline: "Steel City's Premier Coworking Hub",
    description:
      "Salem is one of Tamil Nadu's fastest-growing tier-2 cities, home to a thriving MSME ecosystem, textile industry, and a rapidly expanding IT corridor. NammaOffice has 5 centres strategically located across Salem's key business districts.",
    seoContent:
      "Looking for coworking space in Salem? NammaOffice offers premium coworking spaces, private cabins, meeting halls, and managed offices at 5 locations across Salem — Brindavan Road, Ramakrishna Road, New Bus Stand, TIDEL NEO, and Fort Hosur. Flexible daily, monthly, and annual plans available.",
    image: wix.ramakrishna,
    centreCount: 5,
    seoTitle: "Coworking Space in Salem | NammaOffice — 5 Centres",
    seoDescription:
      "Premium coworking spaces in Salem at 5 locations. Private cabins, open desks, meeting halls, and managed offices. Book your workspace at NammaOffice Salem today.",
  },
  {
    slug: "trichy",
    name: "Trichy",
    tagline: "Temple City's Modern Workspace Destination",
    description:
      "Tiruchirappalli (Trichy) is a major educational and industrial hub in Tamil Nadu. With strong connectivity, a growing startup ecosystem, and proximity to top engineering colleges, Trichy offers immense opportunity for coworking and managed office solutions.",
    seoContent:
      "Looking for coworking space in Trichy? NammaOffice Asha Grand is Trichy's premium coworking destination, offering private cabins, open desks, meeting halls, and managed offices in the heart of the city. Flexible plans for individuals and teams.",
    image: wix.g,
    centreCount: 1,
    seoTitle: "Coworking Space in Trichy | NammaOffice — Asha Grand",
    seoDescription:
      "Premium coworking space in Trichy at Asha Grand. Private cabins, open desks, meeting halls, and managed offices. Book your workspace at NammaOffice Trichy today.",
  },
  {
    slug: "tirupur",
    name: "Tirupur",
    tagline: "Knitwear Capital's Go-To Business Hub",
    description:
      "Tirupur is globally recognised as India's knitwear and textile export capital. With a booming export economy and growing number of MSMEs, Tirupur entrepreneurs need world-class workspaces to match their global ambitions.",
    seoContent:
      "Looking for coworking space in Tirupur? NammaOffice TIDEL NEO is Tirupur's premium coworking destination, offering private cabins, open desks, meeting halls, and managed offices. Ideal for textile exporters, MSMEs, and growing businesses.",
    image: wix.newbus,
    centreCount: 1,
    seoTitle: "Coworking Space in Tirupur | NammaOffice — TIDEL NEO",
    seoDescription:
      "Premium coworking space in Tirupur at TIDEL NEO. Private cabins, open desks, meeting halls, and managed offices. Book your workspace at NammaOffice Tirupur today.",
  },
];

export const locations: Location[] = [
  {
    slug: "brindavan-road",
    name: "Brindavan Road",
    city: "salem",
    address: "Anushka Tower, 5th Floor, Brindavan Road, Salem — 636 004",
    phone: "+91 9092109213",
    email: "brindavan@nammaoffice.com",
    coordinates: { lat: 11.6643, lng: 78.146 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Our flagship Salem centre on the bustling Brindavan Road. Located on the 5th floor of Anushka Tower, this centre offers panoramic views of Salem city and is steps away from major banks, restaurants, and retail outlets.",
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
    workspaceTypes: [
      "private-cabin",
      "open-desk",
      "cubicle",
      "meeting-hall",
      "business-lounge",
    ],
    images: [wix.b, wix.e, wix.h],
    nearbyLandmarks: [
      "Salem Junction Railway Station (2 km)",
      "Salem Bus Stand (3 km)",
      "Brindavan Park (0.5 km)",
      "Salem Steel Plant (8 km)",
    ],
    nearbyFacilities: [
      { icon: "🏦", label: "SBI, HDFC, ICICI branches nearby" },
      { icon: "🍽️", label: "Multiple restaurants within 200m" },
      { icon: "🏨", label: "Hotel Sarada Park (1 km)" },
      { icon: "🏥", label: "Vinayaka Hospital (1.5 km)" },
    ],
    seoTitle: "Coworking Space on Brindavan Road, Salem | NammaOffice",
    seoDescription:
      "NammaOffice Brindavan Road — premium coworking in Anushka Tower, 5th Floor, Salem. Private cabins, open desks, meeting halls. Book your workspace today.",
  },
  {
    slug: "ramakrishna-road",
    name: "Ramakrishna Road",
    city: "salem",
    address: "Balaji Tower, 3rd Floor, Ramakrishna Road, Salem — 636 007",
    phone: "+91 9092109213",
    email: "ramakrishna@nammaoffice.com",
    coordinates: { lat: 11.6712, lng: 78.1558 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Nestled in the heart of Salem's commercial district on Ramakrishna Road, this centre in Balaji Tower offers premium coworking for businesses in the retail and MSME sector. Excellent connectivity with easy access from all parts of Salem.",
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
    workspaceTypes: ["private-cabin", "open-desk", "cubicle", "meeting-hall"],
    images: [wix.ramakrishna, wix.c, wix.k],
    nearbyLandmarks: [
      "Ramakrishna Hospital (0.8 km)",
      "Salem New Bus Stand (2 km)",
      "Municipal Corporation Office (1 km)",
    ],
    nearbyFacilities: [
      { icon: "🏦", label: "Axis Bank & Canara Bank nearby" },
      { icon: "🍽️", label: "Popular local eateries within 300m" },
      { icon: "⛽", label: "Petrol station 200m away" },
      { icon: "🏥", label: "Ramakrishna Hospital (0.8 km)" },
    ],
    seoTitle: "Coworking Space on Ramakrishna Road, Salem | NammaOffice",
    seoDescription:
      "NammaOffice Ramakrishna Road — Balaji Tower, 3rd Floor, Salem. Premium coworking with private cabins, open desks, and meeting halls. Book today.",
  },
  {
    slug: "new-bus-stand",
    name: "New Bus Stand",
    city: "salem",
    address: "New Bus Stand Area, Salem — 636 004",
    phone: "+91 9092109213",
    email: "busstand@nammaoffice.com",
    coordinates: { lat: 11.6777, lng: 78.1424 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Strategically located near Salem's New Bus Stand, this NammaOffice centre is ideal for professionals and businesses that require maximum accessibility. With excellent public transport connectivity, this location serves clients from across the Salem district.",
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "cafeteria",
      "printing",
      "parking",
      "security",
      "conference-room",
      "reception",
      "ergonomic-furniture",
    ],
    workspaceTypes: [
      "private-cabin",
      "open-desk",
      "cubicle",
      "meeting-hall",
      "managed-office",
    ],
    images: [wix.newbus, wix.n, wix.o],
    nearbyLandmarks: [
      "Salem New Bus Stand (200m)",
      "Salem Railway Station (3 km)",
      "Salem Collectorate (2 km)",
    ],
    nearbyFacilities: [
      { icon: "🚌", label: "Direct bus connectivity across Tamil Nadu" },
      { icon: "🏦", label: "Multiple banks within 500m" },
      { icon: "🍽️", label: "Food court at bus stand" },
      { icon: "🏪", label: "Retail and commercial area" },
    ],
    seoTitle: "Coworking Space near New Bus Stand, Salem | NammaOffice",
    seoDescription:
      "NammaOffice New Bus Stand, Salem — centrally located coworking space with excellent transport links. Private cabins, open desks, managed offices. Book today.",
  },
  {
    slug: "tidel-neo",
    name: "TIDEL NEO",
    city: "salem",
    address: "TIDEL NEO, Salem — 636 005",
    phone: "+91 9092109213",
    email: "tidel.salem@nammaoffice.com",
    coordinates: { lat: 11.6534, lng: 78.1563 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Located within the prestigious TIDEL NEO technology park in Salem, this NammaOffice centre is the go-to workspace for IT companies, tech startups, and technology-driven businesses. The TIDEL park ecosystem provides unmatched networking opportunities.",
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
    workspaceTypes: [
      "private-cabin",
      "open-desk",
      "meeting-hall",
      "business-lounge",
      "managed-office",
    ],
    images: [wix.newbus, wix.e, wix.f],
    nearbyLandmarks: [
      "TIDEL NEO Technology Park",
      "Salem Airport (10 km)",
      "Salem Bypass Road",
    ],
    nearbyFacilities: [
      { icon: "💻", label: "TIDEL NEO tech park ecosystem" },
      { icon: "🏦", label: "Banking facilities within park" },
      { icon: "🍽️", label: "Food court within TIDEL campus" },
      { icon: "🏨", label: "Business hotels nearby" },
    ],
    seoTitle: "Coworking Space at TIDEL NEO Salem | NammaOffice",
    seoDescription:
      "NammaOffice TIDEL NEO Salem — premium IT park coworking for tech companies and startups. Managed offices, private cabins, business lounge. Book today.",
  },
  {
    slug: "fort-hosur",
    name: "Fort Hosur",
    city: "salem",
    address: "Fort Hosur, Salem — 636 001",
    phone: "+91 9092109213",
    email: "forthosur@nammaoffice.com",
    coordinates: { lat: 11.6805, lng: 78.1587 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Our Fort Hosur centre is located in one of Salem's oldest and most established commercial areas. Ideal for businesses in the legal, financial, and trading sectors, this centre combines the heritage of the Fort area with modern coworking infrastructure.",
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "cafeteria",
      "printing",
      "parking",
      "security",
      "reception",
      "ergonomic-furniture",
    ],
    workspaceTypes: ["open-desk"],
    images: [wix.a, wix.l, wix.m],
    nearbyLandmarks: [
      "Salem Fort (0.5 km)",
      "Salem Court Complex (1 km)",
      "Salem District Collectorate (1.5 km)",
    ],
    nearbyFacilities: [
      { icon: "⚖️", label: "Salem Court Complex nearby" },
      { icon: "🏦", label: "Nationalised banks within 300m" },
      { icon: "🍽️", label: "Traditional restaurants and cafes" },
      { icon: "🏛️", label: "Government offices nearby" },
    ],
    seoTitle: "Coworking Space at Fort Hosur, Salem | NammaOffice",
    seoDescription:
      "NammaOffice Fort Hosur Salem — coworking in Salem's heritage commercial district. Ideal for legal, financial, and trading professionals. Book your desk today.",
  },
  {
    slug: "asha-grand",
    name: "Asha Grand",
    city: "trichy",
    address: "Asha Grand, Trichy — 620 017",
    phone: "+91 9092109213",
    email: "trichy@nammaoffice.com",
    coordinates: { lat: 10.7905, lng: 78.7047 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "NammaOffice Asha Grand is Trichy's premier coworking destination. Located in the landmark Asha Grand building, this centre serves the growing community of entrepreneurs, IT professionals, and businesses in the Temple City. World-class amenities in the heart of Trichy's commercial district.",
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
    workspaceTypes: [
      "private-cabin",
      "open-desk",
      "cubicle",
      "meeting-hall",
      "business-lounge",
      "managed-office",
    ],
    images: [wix.g, wix.h, wix.b],
    nearbyLandmarks: [
      "Trichy Junction Railway Station (3 km)",
      "Rockfort Temple (4 km)",
      "Trichy International Airport (8 km)",
      "NIT Trichy (15 km)",
    ],
    nearbyFacilities: [
      { icon: "🏦", label: "Major banks within 300m" },
      { icon: "🍽️", label: "Restaurants and cafes nearby" },
      { icon: "🏨", label: "Hotels within 500m" },
      { icon: "🏥", label: "Hospitals within 2 km" },
    ],
    seoTitle: "Coworking Space in Trichy | NammaOffice Asha Grand",
    seoDescription:
      "NammaOffice Asha Grand Trichy — premium coworking in the heart of Tiruchirappalli. Private cabins, open desks, meeting halls, managed offices. Book today.",
  },
  {
    slug: "tidel-neo-tirupur",
    name: "TIDEL NEO",
    city: "tirupur",
    address: "TIDEL NEO, Tirupur — 641 604",
    phone: "+91 9092109213",
    email: "tirupur@nammaoffice.com",
    coordinates: { lat: 11.1085, lng: 77.3411 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "NammaOffice TIDEL NEO Tirupur is the knitwear capital's most modern coworking space. Located in the government-backed TIDEL technology park, this centre caters to textile exporters, MSME owners, IT companies, and entrepreneurs looking for a professional workspace in Tirupur.",
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
    workspaceTypes: [
      "private-cabin",
      "open-desk",
      "cubicle",
      "meeting-hall",
      "business-lounge",
      "managed-office",
    ],
    images: [
      wix.newbus, wix.o, wix.e,
    ],
    nearbyLandmarks: [
      "Tirupur Railway Station (5 km)",
      "Tirupur Bus Stand (4 km)",
      "SIDCO Industrial Estate (2 km)",
      "Coimbatore Airport (50 km)",
    ],
    nearbyFacilities: [
      { icon: "🏭", label: "SIDCO Industrial Estate nearby" },
      { icon: "🏦", label: "Export-import banking facilities" },
      { icon: "🍽️", label: "Restaurants and food courts" },
      { icon: "🏨", label: "Business hotels within 3 km" },
    ],
    seoTitle: "Coworking Space in Tirupur | NammaOffice TIDEL NEO",
    seoDescription:
      "NammaOffice TIDEL NEO Tirupur — premium coworking for textile exporters, MSMEs, and startups. Private cabins, managed offices, meeting halls. Book today.",
  },
];

export function getCity(slug: CitySlug): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getLocation(slug: string, city?: string): Location | undefined {
  if (city) {
    return locations.find((l) => l.slug === slug && l.city === city);
  }
  return locations.find((l) => l.slug === slug);
}

export function getLocationsByCity(citySlug: CitySlug): Location[] {
  return locations.filter((l) => l.city === citySlug);
}
