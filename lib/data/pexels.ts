/**
 * Pexels image catalog. All photos are licensed under the Pexels License
 * (free for commercial use, no attribution required, but included for credit).
 *
 * To swap an image: replace the `id` (Pexels photo ID) and update `credit`.
 * The CDN URL is built automatically.
 */

export interface PexelsImage {
  /** Pexels photo ID */
  id: number;
  /** Photographer name for credit (Pexels License doesn't require this, but it's good practice) */
  credit: string;
  /** Alt text — describe the photo for accessibility */
  alt: string;
}

/** Build an optimized Pexels CDN URL. */
export function pexelsUrl(image: PexelsImage, width = 1600): string {
  return `https://images.pexels.com/photos/${image.id}/pexels-photo-${image.id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

/* ----- Hero ----- */
export const heroImage: PexelsImage = {
  id: 3184292,
  credit: "Fauxels / Pexels",
  alt: "A team collaborating around a wooden table in a bright modern coworking space",
};

/* ----- Workspaces (one per type) ----- */
export const workspaceImages: Record<string, PexelsImage> = {
  "private-cabin": {
    id: 380769,
    credit: "Pixabay / Pexels",
    alt: "A clean modern private office with desk, chair and large window",
  },
  "open-desk": {
    id: 1181244,
    credit: "Christina Morillo / Pexels",
    alt: "A person typing on a silver laptop at a coworking table",
  },
  cubicle: {
    id: 1181676,
    credit: "Christina Morillo / Pexels",
    alt: "A focused workstation with monitor, keyboard and warm lighting",
  },
  "meeting-hall": {
    id: 3184419,
    credit: "Fauxels / Pexels",
    alt: "Colleagues meeting around a conference table with laptops and notes",
  },
  "business-lounge": {
    id: 1181715,
    credit: "Christina Morillo / Pexels",
    alt: "A modern lounge area with comfortable seating and natural light",
  },
  "managed-office": {
    id: 380768,
    credit: "Pixabay / Pexels",
    alt: "Spacious open-plan managed office with rows of desks",
  },
};

/* ----- City photos ----- */
export const cityImages: Record<string, PexelsImage> = {
  salem: {
    id: 1797428,
    credit: "James Wheeler / Pexels",
    alt: "Aerial view of a South Indian city skyline at sunset",
  },
  trichy: {
    id: 3581363,
    credit: "Faiq Mukhtarov / Pexels",
    alt: "Historic temple architecture against a vibrant sky",
  },
  tirupur: {
    id: 374074,
    credit: "Pixabay / Pexels",
    alt: "Modern office building exterior with warm glass facade",
  },
};

/* ----- Trust strip / quick-look images ----- */
export const trustImages = {
  laptop: {
    id: 1170412,
    credit: "Pixabay / Pexels",
    alt: "Laptop and coffee on a sunlit desk",
  } as PexelsImage,
  team: {
    id: 3184360,
    credit: "Fauxels / Pexels",
    alt: "Team members reviewing a project together",
  } as PexelsImage,
};
