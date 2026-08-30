import { interiorPool } from "@/lib/data/wix-pool";

/**
 * PLACEHOLDER design content for the News & Videos hub.
 *
 * This is sample copy used purely to preview the layout. Real posts will be
 * authored in the CMS (Sanity) once it is wired up; nothing here should be
 * treated as published/true content. Cover images reuse the interior pool.
 */

export type NewsCategory = "News" | "Video" | "Insight" | "Event";

export interface NewsPost {
  slug: string;
  title: string;
  /** ISO date, used for sorting. */
  date: string;
  /** Pre-formatted date for display (avoids any runtime-date dependency). */
  dateLabel: string;
  category: NewsCategory;
  excerpt: string;
  coverImage: string;
  /** Optional YouTube/Vimeo URL — when present the post renders a video. */
  videoUrl?: string;
  /** Body paragraphs. */
  body: string[];
}

export const newsPosts: NewsPost[] = [
  {
    slug: "tidel-neo-salem-centre-opens",
    title: "NammaOffice opens its newest centre at TIDEL NEO, Salem",
    date: "2026-05-28",
    dateLabel: "28 May 2026",
    category: "News",
    excerpt:
      "Our latest centre brings premium managed offices and meeting halls to Salem's flagship technology park at Karuppur.",
    coverImage: interiorPool[9],
    body: [
      "We are excited to open our newest NammaOffice centre inside TIDEL NEO, the government-backed technology park at Karuppur, Salem. The centre offers private cabins, open desks, meeting halls and managed offices for teams of every size.",
      "Members get high-speed internet, power backup, air-conditioning, and access to a vibrant community of founders, freelancers and growing companies — all within Salem's premier IT address.",
      "This is placeholder copy for the design preview. Final article content will be published through the CMS.",
    ],
  },
  {
    slug: "inside-the-ipod-focus-pods",
    title: "Inside the iPOD: smart focus pods land at Reliance Mall, Salem",
    date: "2026-05-20",
    dateLabel: "20 May 2026",
    category: "Video",
    excerpt:
      "Take a 60-second tour of the iPOD — a private, noise-free, plug-and-play pod you can book from just ₹99/hour.",
    coverImage: interiorPool[7],
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    body: [
      "The iPOD is a smart private pod designed for deep, focused work — book it by the hour right inside Reliance Mall, Salem.",
      "Noise-free, plug-and-play, and stylishly compact, it is ideal for calls, interviews and heads-down sessions when you need a quiet space on the go.",
      "(Sample video shown for layout preview — replace with your own walkthrough in the CMS.)",
    ],
  },
  {
    slug: "coworking-msme-growth-tier-2",
    title: "5 ways coworking accelerates MSME growth in Tier-2 cities",
    date: "2026-05-12",
    dateLabel: "12 May 2026",
    category: "Insight",
    excerpt:
      "From lower overheads to instant networking, here is how flexible workspaces are reshaping business in Salem, Trichy, Tirupur, Erode and Hosur.",
    coverImage: interiorPool[25],
    body: [
      "Tier-2 cities across Tamil Nadu are seeing a surge in startups, MSMEs and remote teams. Flexible workspaces let them scale without the cost and lock-in of a traditional lease.",
      "Shared amenities, professional addresses, meeting rooms on demand and a built-in community of peers all help businesses move faster.",
      "This is placeholder copy for the design preview.",
    ],
  },
  {
    slug: "founders-breakfast-meetup",
    title: "Community meetup: Founders' Breakfast at TIDEL NEO",
    date: "2026-04-30",
    dateLabel: "30 April 2026",
    category: "Event",
    excerpt:
      "Members gathered for an early-morning networking session over coffee — connecting founders, freelancers and investors across the region.",
    coverImage: interiorPool[16],
    body: [
      "Our monthly Founders' Breakfast brought together members from across NammaOffice centres for an informal morning of conversation, connections and fresh ideas.",
      "Events like these are part of what makes a NammaOffice membership more than just a desk.",
      "This is placeholder copy for the design preview.",
    ],
  },
];

export const sortedNews: NewsPost[] = [...newsPosts].sort((a, b) =>
  a.date < b.date ? 1 : -1,
);

export function getNewsPost(slug: string): NewsPost | undefined {
  return newsPosts.find((p) => p.slug === slug);
}
