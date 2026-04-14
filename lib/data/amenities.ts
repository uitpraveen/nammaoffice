import type { Amenity } from "@/lib/types";

export const amenities: Amenity[] = [
  {
    id: "high-speed-wifi",
    name: "High-Speed Wi-Fi",
    icon: "/icons/wifi.svg",
    description: "Dedicated 1 Gbps fibre connection with failover backup",
  },
  {
    id: "power-backup",
    name: "Power Backup",
    icon: "/icons/power.svg",
    description: "Uninterrupted power supply with generator backup",
  },
  {
    id: "air-conditioning",
    name: "Air Conditioning",
    icon: "/icons/ac.svg",
    description: "Central AC maintained at comfortable temperature year-round",
  },
  {
    id: "cafeteria",
    name: "Cafeteria & Pantry",
    icon: "/icons/coffee.svg",
    description: "Fully stocked pantry with complimentary tea and coffee",
  },
  {
    id: "printing",
    name: "Printing & Scanning",
    icon: "/icons/printer.svg",
    description: "High-speed printers, scanners, and copiers available",
  },
  {
    id: "parking",
    name: "Free Parking",
    icon: "/icons/parking.svg",
    description: "Dedicated car and two-wheeler parking for members",
  },
  {
    id: "security",
    name: "24/7 Security",
    icon: "/icons/security.svg",
    description: "CCTV surveillance and trained security personnel",
  },
  {
    id: "locker",
    name: "Personal Locker",
    icon: "/icons/locker.svg",
    description: "Secure storage lockers for your valuables and belongings",
  },
  {
    id: "conference-room",
    name: "Conference Rooms",
    icon: "/icons/conference.svg",
    description: "Bookable conference rooms equipped with AV systems",
  },
  {
    id: "reception",
    name: "Reception & Admin",
    icon: "/icons/reception.svg",
    description: "Professional reception team for mail, calls, and visitors",
  },
  {
    id: "ergonomic-furniture",
    name: "Ergonomic Furniture",
    icon: "/icons/chair.svg",
    description: "Premium ergonomic chairs and height-adjustable desks",
  },
  {
    id: "breakout-zone",
    name: "Breakout Zone",
    icon: "/icons/lounge.svg",
    description: "Dedicated relaxation and informal meeting areas",
  },
];

export function getAmenities(ids: string[]): Amenity[] {
  return amenities.filter((a) => ids.includes(a.id));
}
