import type { GalleryImage } from "@/lib/types";

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/gallery/brindavan-cabin.jpg",
    alt: "Private cabin interior at NammaOffice Brindavan Road, Salem",
    location: "Brindavan Road",
    city: "salem",
  },
  {
    src: "/images/gallery/brindavan-lounge.jpg",
    alt: "Business lounge at NammaOffice Brindavan Road, Salem",
    location: "Brindavan Road",
    city: "salem",
  },
  {
    src: "/images/gallery/brindavan-meeting.jpg",
    alt: "Meeting hall at NammaOffice Brindavan Road, Salem",
    location: "Brindavan Road",
    city: "salem",
  },
  {
    src: "/images/gallery/ramakrishna-open-desk.jpg",
    alt: "Open desk coworking area at NammaOffice Ramakrishna Road, Salem",
    location: "Ramakrishna Road",
    city: "salem",
  },
  {
    src: "/images/gallery/ramakrishna-cubicle.jpg",
    alt: "Cubicle workstations at NammaOffice Ramakrishna Road, Salem",
    location: "Ramakrishna Road",
    city: "salem",
  },
  {
    src: "/images/gallery/tidel-salem-exterior.jpg",
    alt: "NammaOffice at TIDEL NEO, Salem exterior view",
    location: "TIDEL NEO",
    city: "salem",
  },
  {
    src: "/images/gallery/tidel-salem-managed.jpg",
    alt: "Managed office space at NammaOffice TIDEL NEO, Salem",
    location: "TIDEL NEO",
    city: "salem",
  },
  {
    src: "/images/gallery/new-bus-stand-reception.jpg",
    alt: "Reception area at NammaOffice New Bus Stand, Salem",
    location: "New Bus Stand",
    city: "salem",
  },
  {
    src: "/images/gallery/fort-hosur-desk.jpg",
    alt: "Open desk area at NammaOffice Fort Hosur, Salem",
    location: "Fort Hosur",
    city: "salem",
  },
  {
    src: "/images/gallery/asha-grand-cabin.jpg",
    alt: "Private cabin at NammaOffice Asha Grand, Trichy",
    location: "Asha Grand",
    city: "trichy",
  },
  {
    src: "/images/gallery/asha-grand-meeting.jpg",
    alt: "Conference room at NammaOffice Asha Grand, Trichy",
    location: "Asha Grand",
    city: "trichy",
  },
  {
    src: "/images/gallery/asha-grand-lounge.jpg",
    alt: "Business lounge at NammaOffice Asha Grand, Trichy",
    location: "Asha Grand",
    city: "trichy",
  },
  {
    src: "/images/gallery/tidel-tirupur-exterior.jpg",
    alt: "NammaOffice at TIDEL NEO, Tirupur exterior view",
    location: "TIDEL NEO",
    city: "tirupur",
  },
  {
    src: "/images/gallery/tidel-tirupur-cabin.jpg",
    alt: "Private cabin at NammaOffice TIDEL NEO, Tirupur",
    location: "TIDEL NEO",
    city: "tirupur",
  },
  {
    src: "/images/gallery/tidel-tirupur-open-desk.jpg",
    alt: "Open desk coworking at NammaOffice TIDEL NEO, Tirupur",
    location: "TIDEL NEO",
    city: "tirupur",
  },
];

export function getGalleryByCity(city: string): GalleryImage[] {
  return galleryImages.filter((img) => img.city === city);
}
