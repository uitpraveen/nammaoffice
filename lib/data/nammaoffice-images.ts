/**
 * Real photographs scraped from nammaoffice.com (Wix CDN).
 * These replace the generic Pexels imagery on the home page.
 */

export interface NOImage {
  /** Wix media ID (the part after /media/) */
  id: string;
  /** Alt text */
  alt: string;
}

/** Build an unmodified Wix CDN URL — Next.js Image will optimize it. */
export function noImageUrl(image: NOImage): string {
  return `https://static.wixstatic.com/media/${image.id}`;
}

/* ----- Hero ----- */
export const heroPhoto: NOImage = {
  id: "04fb8d_58b6bcab18c046aea219db1257f02bcb~mv2.jpeg",
  alt: "The NammaOffice team and members working in our coworking space",
};

/* ----- Workspace photos ----- */
export const workspacePhotos: Record<string, NOImage> = {
  "private-cabin": {
    id: "04fb8d_67a613cf39c24e66be711bcba4a3a90b~mv2.jpeg",
    alt: "A NammaOffice dedicated cabin — fully furnished private workspace",
  },
  "open-desk": {
    id: "fd8c76_4abbd8b223bd40769e45fd95a7fab86b~mv2.jpeg",
    alt: "Open-desk coworking floor at NammaOffice with shared seating",
  },
  cubicle: {
    id: "fd8c76_5227acaf08804767adcb2cb06e6bd29c~mv2.jpeg",
    alt: "Semi-private cubicle workstation at NammaOffice",
  },
  "meeting-hall": {
    id: "04fb8d_d183ca1e783b4e7497f94e69d1a101d0~mv2.jpeg",
    alt: "NammaOffice discussion room with conference setup",
  },
  "business-lounge": {
    id: "fd8c76_e8a34fecd3f34010bc0dd3ec2e4101ed~mv2.jpeg",
    alt: "Premium business lounge area at NammaOffice",
  },
  "managed-office": {
    id: "fd8c76_663f3b9fb3164f65bdb59a98c33da458~mv2.jpeg",
    alt: "Managed office floor at NammaOffice with branded workstations",
  },
};

/* ----- Location / city photos ----- */
export const locationPhotos: Record<string, NOImage> = {
  // City-level — used for the home City Cards
  salem: {
    id: "04fb8d_d2ed9c2723e144a1805e5fa96960be20~mv2.jpeg",
    alt: "NammaOffice Ramakrishna Road centre in Salem",
  },
  trichy: {
    id: "fd8c76_7fc3e4598dd04bb7a5af180cefc9bae1~mv2.jpeg",
    alt: "NammaOffice Asha Grand centre in Trichy",
  },
  tirupur: {
    id: "fd8c76_998821dc4c0c46deae1ff06c0a9614ad~mv2.png",
    alt: "NammaOffice TIDEL NEO centre in Tirupur",
  },
  // Specific centres
  "ramakrishna-road": {
    id: "04fb8d_d2ed9c2723e144a1805e5fa96960be20~mv2.jpeg",
    alt: "Ramakrishna Road centre, Salem",
  },
  "rajeshwari-towers": {
    id: "fd8c76_21bc99a38a974b748451300a1a57fa04~mv2.jpeg",
    alt: "Rajeshwari Towers centre, Salem",
  },
  "new-bus-stand": {
    id: "fd8c76_998821dc4c0c46deae1ff06c0a9614ad~mv2.png",
    alt: "New Bus Stand Spaces, Salem",
  },
  "tidel-neo": {
    id: "fd8c76_998821dc4c0c46deae1ff06c0a9614ad~mv2.png",
    alt: "TIDEL NEO Salem centre",
  },
};

/* ----- Gallery / general purpose ----- */
export const galleryPhotos: NOImage[] = [
  { id: "fd8c76_f9722489d56d48b18c7dd9ec02c629bc~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_4abbd8b223bd40769e45fd95a7fab86b~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_5227acaf08804767adcb2cb06e6bd29c~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_e8a34fecd3f34010bc0dd3ec2e4101ed~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_663f3b9fb3164f65bdb59a98c33da458~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_ca54fea7b8a8485db0fd64e3162f518b~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_7fc3e4598dd04bb7a5af180cefc9bae1~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_6980b1eaf30345c28279fecef6e205cb~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_551d4c55472c4ef3932cd574c48a864c~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_85291bd726a444dd8e554e66bca98480~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_81c774f971564ee6b13c4870975bb931~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_7e5040faf8a04f58b5464571b5cd3eea~mv2.jpeg", alt: "NammaOffice space view" },
  { id: "fd8c76_852a9f8695cf42cdbf9851bf34a5eeb6~mv2.jpeg", alt: "NammaOffice space view" },
];
