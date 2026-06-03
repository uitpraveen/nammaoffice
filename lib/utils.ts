import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  return phone.replace(/\s/g, "");
}

export function whatsappUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// `query` is either a full street address (preferred - Google geocodes it to
// the real place) or a "lat,lng" string. Driving directions to the address are
// far more accurate than hand-typed coordinates.
export function googleMapsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

// The classic `maps.google.com/maps?q=<query>&output=embed` form auto-drops
// a red marker on the result (the `/maps/embed?pb=...` form only centers the
// viewport without a pin, so locations looked unmarked before). `query` is an
// address (geocoded to the real place) or a "lat,lng" string.
export function googleMapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=en&output=embed`;
}
