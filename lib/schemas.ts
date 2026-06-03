import type { Location } from "@/lib/types";
import { BRAND } from "@/lib/constants";

/** Brand-level Organization schema for the site root (home page). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: "https://nammaoffice.com",
    logo: "https://nammaoffice.com/images/logo.png",
    description: BRAND.description,
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    areaServed: ["Salem", "Trichy", "Tirupur", "Erode", "Hosur"],
    sameAs: [
      BRAND.social.instagram,
      BRAND.social.linkedin,
      BRAND.social.facebook,
      BRAND.social.youtube,
    ],
  };
}

export function localBusinessSchema(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "CoworkingSpace",
    name: `NammaOffice ${location.name}`,
    description: location.description,
    url: `https://nammaoffice.com/locations/${location.city}/${location.slug}`,
    telephone: location.phone,
    email: location.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city.charAt(0).toUpperCase() + location.city.slice(1),
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
    },
    openingHours: location.operatingHours,
    image: location.images[0] || undefined,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI",
    amenityFeature: location.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: true,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://nammaoffice.com${item.href}`,
    })),
  };
}
