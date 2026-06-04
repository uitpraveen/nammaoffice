import type { City, CitySlug, Location } from "@/lib/types";
import { wix, tidelSalemGallery, tidelTirupurGallery, ashaGrandGallery, interiorPool } from "@/lib/data/wix-pool";

export const cities: City[] = [
  {
    slug: "salem",
    name: "Salem",
    tagline: "Steel City's Premier Coworking Hub",
    description:
      "Salem is one of Tamil Nadu's fastest-growing tier-2 cities, home to a thriving MSME ecosystem, textile industry, and a rapidly expanding IT corridor. NammaOffice has 6 centres strategically located across Salem's key business districts.",
    seoContent:
      "Looking for coworking space in Salem? NammaOffice offers premium coworking spaces, private cabins, meeting halls, and managed offices at 6 locations across Salem - Fairlands, Ramakrishna Road, Rajeshwari Towers, New Bus Stand, TIDEL NEO, and IPOD (Reliance Mega Mall). Flexible daily, monthly, and annual plans available.",
    image: wix.ramakrishna,
    centreCount: 6,
    seoTitle: "Coworking Space in Salem | NammaOffice - 6 Centres",
    seoDescription:
      "Premium coworking spaces in Salem at 6 locations. Private cabins, open desks, meeting halls, and managed offices. Book your workspace at NammaOffice Salem today.",
  },
  {
    slug: "trichy",
    name: "Trichy",
    tagline: "Temple City's Modern Workspace Destination",
    description:
      "Tiruchirappalli (Trichy) is a major educational and industrial hub in Tamil Nadu. With strong connectivity, a growing startup ecosystem, and proximity to top engineering colleges, Trichy offers immense opportunity for coworking and managed office solutions.",
    seoContent:
      "Looking for coworking space in Trichy? NammaOffice Asha Grand on Ramanathapuram Road, Gundur is Trichy's premium coworking destination - private cabins, open desks, meeting halls, and managed offices well-placed for businesses across the city's southern corridor. Flexible plans for individuals and teams.",
    image: wix.g,
    centreCount: 1,
    seoTitle: "Coworking Space in Trichy | NammaOffice - Asha Grand",
    seoDescription:
      "Premium coworking space in Trichy at Asha Grand, Ramanathapuram Road, Gundur. Private cabins, open desks, meeting halls, and managed offices. Book your workspace at NammaOffice Trichy today.",
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
    seoTitle: "Coworking Space in Tirupur | NammaOffice - TIDEL NEO",
    seoDescription:
      "Premium coworking space in Tirupur at TIDEL NEO. Private cabins, open desks, meeting halls, and managed offices. Book your workspace at NammaOffice Tirupur today.",
  },
  {
    slug: "erode",
    name: "Erode",
    tagline: "Turmeric City's Modern Workspace Address",
    description:
      "Erode is a major textile, turmeric, and trading hub on the Bhavani river, with deep roots in handloom, garments, and agri-business. Strategically located on NH-544 between Salem and Coimbatore, Erode is well placed for businesses serving south India's industrial corridor.",
    seoContent:
      "Looking for coworking space in Erode? NammaOffice Texvalley is Erode's premium business address, offering private cabins, open desks, meeting halls, and managed offices on the Salem–Kochi highway. Ideal for textile exporters, traders, and MSMEs.",
    image: wix.ramakrishna,
    centreCount: 1,
    seoTitle: "Coworking Space in Erode | NammaOffice - Texvalley",
    seoDescription:
      "Premium coworking space in Erode at Texvalley, NH-544. Private cabins, meeting halls, and managed offices. Book your workspace at NammaOffice Erode today.",
  },
  {
    slug: "hosur",
    name: "Hosur",
    tagline: "Industrial Gateway to Bengaluru",
    description:
      "Hosur is Tamil Nadu's industrial gateway to Bengaluru, anchored by Sipcot's large industrial estates and home to multinational manufacturers, EV makers, and ancillary suppliers. With unmatched access to the Bengaluru ecosystem, Hosur is fast becoming a magnet for new-age businesses.",
    seoContent:
      "Looking for coworking space in Hosur? NammaOffice Sipcot Phase II is Hosur's premium workspace, offering private cabins, open desks, meeting halls, and managed offices inside the Sipcot industrial complex. Ideal for manufacturers, exporters, and Bengaluru-adjacent teams.",
    image: wix.newbus,
    centreCount: 1,
    seoTitle: "Coworking Space in Hosur | NammaOffice - Sipcot Phase II",
    seoDescription:
      "Premium coworking space in Hosur at Sipcot Phase II Industrial Complex. Private cabins, managed offices, meeting halls. Book your workspace at NammaOffice Hosur today.",
  },
];

export const locations: Location[] = [
  {
    slug: "fairlands",
    name: "Anushka Tower (Fairlands)",
    city: "salem",
    address:
      "5th Floor, Anushka Tower, Brindavan Road, above LIC, opposite IBACO Icecream, Salem, Tamil Nadu - 636 016",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 11.6643, lng: 78.146 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Our flagship Salem centre on the bustling Brindavan Road in Fairlands. Located on the 5th floor of Anushka Tower (above LIC, opposite IBACO), this centre offers panoramic views of Salem city and is steps away from major banks, restaurants, and retail outlets.",
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
    images: [
      interiorPool[0],
      interiorPool[1],
      interiorPool[2],
      interiorPool[3],
      interiorPool[4],
      interiorPool[5],
      interiorPool[6],
      wix.cabin,
      wix.discussion,
    ],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space at Anushka Tower, Fairlands, Salem | NammaOffice",
    seoDescription:
      "NammaOffice Fairlands - 5th Floor, Anushka Tower, Brindavan Road, Salem. Premium coworking with private cabins, open desks, and meeting halls. Book today.",
  },
  {
    slug: "ramakrishna-road",
    name: "Balaji Tower (Ramakrishna Road)",
    city: "salem",
    address:
      "3rd Floor, Balaji Towers, 11, Ramakrishna Road, Seerangapalayam, Salem, Tamil Nadu - 636 007",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 11.6712, lng: 78.1558 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Nestled in the heart of Salem's commercial district on Ramakrishna Road, this centre in Balaji Towers offers premium coworking for businesses in the retail and MSME sector. Excellent connectivity with easy access from all parts of Salem.",
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
    images: [
      interiorPool[8],
      interiorPool[9],
      interiorPool[10],
      interiorPool[11],
      interiorPool[12],
      interiorPool[43],
      interiorPool[44],
      interiorPool[45],
      wix.cabin,
      wix.discussion,
    ],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space at Balaji Towers, Ramakrishna Road, Salem | NammaOffice",
    seoDescription:
      "NammaOffice Ramakrishna Road - Balaji Towers, 3rd Floor, Seerangapalayam, Salem. Premium coworking with private cabins, open desks, and meeting halls. Book today.",
  },
  {
    slug: "rajeshwari-towers",
    name: "Rajeshwari Towers",
    city: "salem",
    address:
      "4th Floor, Rajeshwari Towers, 69/4, Ramakrishna Road, Seerangapalayam, Salem, Tamil Nadu - 636 007",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 11.6735, lng: 78.1503 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "NammaOffice Rajeshwari Towers brings premium coworking to a landmark address in central Salem. Spacious cabins, well-appointed meeting halls, and a quiet business-lounge atmosphere - designed for professionals who value calm focus alongside on-demand collaboration spaces.",
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
    images: [
      wix.rajeshwari,
      interiorPool[13],
      interiorPool[14],
      interiorPool[15],
      interiorPool[16],
      interiorPool[17],
      interiorPool[18],
      interiorPool[19],
      wix.cabin,
    ],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space at Rajeshwari Towers, Salem | NammaOffice",
    seoDescription:
      "NammaOffice Rajeshwari Towers - 4th Floor, 69/4 Ramakrishna Road, Salem. Premium coworking with private cabins, meeting halls, and business lounge. Book today.",
  },
  {
    slug: "new-bus-stand",
    name: "New Bus Stand",
    city: "salem",
    address:
      "Bus Stand, 24, West, New Bus Stand Road, opp. ATC, Meyyanur, Salem, Tamil Nadu - 636 004",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 11.6777, lng: 78.1424 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Strategically located opposite ATC on West New Bus Stand Road in Meyyanur, this NammaOffice centre is ideal for professionals and businesses that require maximum accessibility. With excellent public transport connectivity, this location serves clients from across the Salem district.",
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
    images: [
      wix.newbus,
      interiorPool[20],
      interiorPool[21],
      interiorPool[22],
      interiorPool[23],
      interiorPool[24],
      interiorPool[25],
      interiorPool[26],
      wix.cabin,
      wix.discussion,
    ],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space near New Bus Stand, Meyyanur, Salem | NammaOffice",
    seoDescription:
      "NammaOffice New Bus Stand, Meyyanur, Salem - coworking opposite ATC with excellent transport links. Private cabins, open desks, managed offices. Book today.",
  },
  {
    slug: "tidel-neo",
    name: "TIDEL NEO",
    city: "salem",
    address:
      "P36Q+CJH TIDEL NEO, Kullagoundanoor, Karuppur, Salem, Tamil Nadu - 636 011",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 11.5667, lng: 78.1989 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "Located within the prestigious TIDEL NEO technology park in Karuppur, this NammaOffice centre is the go-to workspace for IT companies, tech startups, and technology-driven businesses. The TIDEL park ecosystem provides unmatched networking opportunities.",
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
    images: [...tidelSalemGallery],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space at TIDEL NEO Salem | NammaOffice",
    seoDescription:
      "NammaOffice TIDEL NEO Salem - premium IT park coworking in Karuppur for tech companies and startups. Managed offices, private cabins, business lounge. Book today.",
  },
  {
    slug: "ipod",
    name: "IPOD (Reliance Mega Mall)",
    city: "salem",
    address:
      "1st Floor, Reliance Mega Mall, 5 Road Junction, Meyyanur, Salem, Tamil Nadu - 636 004",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 11.647, lng: 78.1577 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "NammaOffice IPOD sits inside Reliance Mega Mall at the 5 Road Junction in Meyyanur - one of Salem's busiest commercial nodes. With a mall ecosystem of retail, dining, and entertainment downstairs, this centre is built for teams that want vibrancy on tap.",
    amenities: [
      "high-speed-wifi",
      "power-backup",
      "air-conditioning",
      "parking",
      "security",
      "ergonomic-furniture",
    ],
    workspaceTypes: [
      "private-cabin",
      "open-desk",
      "cubicle",
      "meeting-hall",
      "business-lounge",
    ],
    images: [
      interiorPool[27],
      interiorPool[28],
      interiorPool[29],
      interiorPool[30],
      interiorPool[31],
      interiorPool[32],
      interiorPool[33],
      wix.cabin,
      wix.discussion,
    ],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space at Reliance Mega Mall, Meyyanur, Salem | NammaOffice",
    seoDescription:
      "NammaOffice IPOD - 1st Floor, Reliance Mega Mall, 5 Road Junction, Meyyanur, Salem. Premium coworking inside a vibrant mall. Book today.",
  },
  {
    slug: "asha-grand",
    name: "Asha Grand",
    city: "trichy",
    address:
      "TS No 13, 1, Ramanathapuram Road, Thiruvalarchi Patti, Gundur, Tiruchirappalli, Tamil Nadu - 620 007",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 10.7397, lng: 78.7553 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "NammaOffice Asha Grand is Trichy's flagship coworking address on Ramanathapuram Road, Gundur - well-placed for businesses across the city's southern corridor and for teams travelling between Trichy, Pudukkottai and Madurai. Premium private cabins, open desks, meeting halls and managed offices, with the airport and railway junction both within easy reach.",
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
    images: [...ashaGrandGallery],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space at Asha Grand Trichy | NammaOffice",
    seoDescription:
      "NammaOffice Asha Grand Trichy - premium coworking on Ramanathapuram Road, Gundur. Private cabins, open desks, meeting halls, managed offices. Book today.",
  },
  {
    slug: "tidel-neo",
    name: "TIDEL NEO",
    city: "tirupur",
    address:
      "TIDEL NEO, 2nd Floor, 424/4, Palaniyappa Nagar, Rakkiyapalayam Road, Thirumuruganpoondi, Tirupur - 641 652",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 11.1085, lng: 77.3411 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "NammaOffice TIDEL NEO Tirupur is the knitwear capital's most modern coworking space. Located in the government-backed TIDEL technology park at Thirumuruganpoondi, this centre caters to textile exporters, MSME owners, IT companies, and entrepreneurs looking for a professional workspace in Tirupur.",
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
    images: [...tidelTirupurGallery],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space in Tirupur | NammaOffice TIDEL NEO",
    seoDescription:
      "NammaOffice TIDEL NEO Tirupur - premium coworking for textile exporters, MSMEs, and startups. Private cabins, managed offices, meeting halls. Book today.",
  },
  {
    slug: "texvalley",
    name: "Texvalley",
    city: "erode",
    address:
      "Texvalley, NH-544, Salem–Kochi Highway, Gangapuram (P.O), Chithode, Erode, Tamil Nadu - 638 102",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 11.365, lng: 77.7 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "NammaOffice Texvalley sits on NH-544 (the Salem–Kochi highway) at Chithode - ideal for traders and textile exporters who run between Erode, Coimbatore, and Tirupur. Easy highway access, plenty of parking, and a calm professional environment removed from city traffic.",
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
      "breakout-zone",
    ],
    workspaceTypes: [
      "private-cabin",
      "open-desk",
      "meeting-hall",
      "business-lounge",
      "managed-office",
    ],
    images: [
      interiorPool[27],
      interiorPool[28],
      interiorPool[29],
      interiorPool[30],
      interiorPool[31],
      wix.cabin,
      wix.discussion,
    ],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space at Texvalley, Erode | NammaOffice",
    seoDescription:
      "NammaOffice Texvalley - coworking on NH-544 (Salem–Kochi Highway) at Chithode, Erode. Private cabins, meeting halls, managed offices. Book today.",
  },
  {
    slug: "sipcot-phase-2",
    name: "Sipcot Phase II",
    city: "hosur",
    address:
      "Plot CP-3 & CP-4, near TVS Academy, Sipcot Phase II Industrial Complex, Moranapalli, Hosur, Tamil Nadu - 635 109",
    phone: "+91 9092109213",
    email: "info@nammaoffice.com",
    coordinates: { lat: 12.7409, lng: 77.8253 },
    operatingHours: "Mon–Sat: 8:00 AM – 9:00 PM",
    description:
      "NammaOffice Sipcot Phase II sits inside Hosur's flagship industrial complex, next to TVS Academy. Ideal for manufacturers, EV-segment teams, and Bengaluru-adjacent businesses who want a professional workspace anchored to Hosur's industrial ecosystem.",
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
      interiorPool[32],
      interiorPool[33],
      interiorPool[34],
      interiorPool[35],
      interiorPool[36],
      wix.cabin,
      wix.discussion,
      wix.dining,
    ],
    nearbyLandmarks: [],
    nearbyFacilities: [],
    seoTitle: "Coworking Space at Sipcot Phase II, Hosur | NammaOffice",
    seoDescription:
      "NammaOffice Sipcot Phase II - coworking inside Hosur's flagship industrial complex, near TVS Academy. Managed offices, private cabins, meeting halls. Book today.",
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

/** All centres in display order - used by nav, locations index, and footer. */
export function getAllLocations(): Location[] {
  return locations;
}
