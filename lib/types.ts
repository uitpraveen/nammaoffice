export interface Location {
  slug: string;
  name: string;
  city: CitySlug;
  address: string;
  phone: string;
  email: string;
  coordinates: { lat: number; lng: number };
  operatingHours: string;
  description: string;
  amenities: string[];
  workspaceTypes: WorkspaceSlug[];
  images: string[];
  nearbyLandmarks: string[];
  nearbyFacilities: { icon: string; label: string }[];
  seoTitle: string;
  seoDescription: string;
}

export type CitySlug = "salem" | "trichy" | "tirupur";

export interface City {
  slug: CitySlug;
  name: string;
  tagline: string;
  description: string;
  seoContent: string;
  image: string;
  centreCount: number;
  seoTitle: string;
  seoDescription: string;
}

export type WorkspaceSlug =
  | "private-cabin"
  | "open-desk"
  | "cubicle"
  | "meeting-hall"
  | "business-lounge"
  | "managed-office";

export interface Workspace {
  slug: WorkspaceSlug;
  name: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  images: string[];
  features: string[];
  amenities: string[];
  capacity: string;
  privacy: string;
  flexibility: string;
  bestFor: string;
  availableAt: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  photo: string;
  rating: number;
  text: string;
  location?: string;
  city?: CitySlug;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "pricing" | "locations" | "franchise" | "services";
}

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface ClientLogo {
  name: string;
  logo: string;
  url?: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export interface NavChild {
  label: string;
  href: string;
  description: string;
  /** Lucide icon name (PascalCase). Optional — falls back to a default. */
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  location: string;
  city: CitySlug;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}
