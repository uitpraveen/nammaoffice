import type { GalleryImage } from "@/lib/types";
import { wix } from "@/lib/data/wix-pool";

export const galleryImages: GalleryImage[] = [
  // Salem
  { src: wix.cabin,       alt: "Private cabin interior at NammaOffice Brindavan Road, Salem",       location: "Brindavan Road",   city: "salem"   },
  { src: wix.d,           alt: "Business lounge at NammaOffice Brindavan Road, Salem",              location: "Brindavan Road",   city: "salem"   },
  { src: wix.discussion,  alt: "Meeting hall at NammaOffice Brindavan Road, Salem",                 location: "Brindavan Road",   city: "salem"   },
  { src: wix.b,           alt: "Open desk coworking area at NammaOffice Ramakrishna Road, Salem",   location: "Ramakrishna Road", city: "salem"   },
  { src: wix.c,           alt: "Cubicle workstations at NammaOffice Ramakrishna Road, Salem",       location: "Ramakrishna Road", city: "salem"   },
  { src: wix.newbus,      alt: "NammaOffice at TIDEL NEO, Salem exterior view",                     location: "TIDEL NEO",        city: "salem"   },
  { src: wix.e,           alt: "Managed office space at NammaOffice TIDEL NEO, Salem",              location: "TIDEL NEO",        city: "salem"   },
  { src: wix.n,           alt: "Reception area at NammaOffice New Bus Stand, Salem",                location: "New Bus Stand",    city: "salem"   },
  { src: wix.l,           alt: "Open desk area at NammaOffice Fort Hosur, Salem",                   location: "Fort Hosur",       city: "salem"   },
  // Trichy
  { src: wix.g,           alt: "Private cabin at NammaOffice Asha Grand, Trichy",                   location: "Asha Grand",       city: "trichy"  },
  { src: wix.h,           alt: "Conference room at NammaOffice Asha Grand, Trichy",                 location: "Asha Grand",       city: "trichy"  },
  { src: wix.i,           alt: "Business lounge at NammaOffice Asha Grand, Trichy",                 location: "Asha Grand",       city: "trichy"  },
  // Tirupur
  { src: wix.o,           alt: "NammaOffice at TIDEL NEO, Tirupur exterior view",                   location: "TIDEL NEO",        city: "tirupur" },
  { src: wix.f,           alt: "Private cabin at NammaOffice TIDEL NEO, Tirupur",                   location: "TIDEL NEO",        city: "tirupur" },
  { src: wix.j,           alt: "Open desk coworking at NammaOffice TIDEL NEO, Tirupur",             location: "TIDEL NEO",        city: "tirupur" },
];

export function getGalleryByCity(city: string): GalleryImage[] {
  return galleryImages.filter((img) => img.city === city);
}
