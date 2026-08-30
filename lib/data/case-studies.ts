import { interiorPool } from "@/lib/data/wix-pool";

/**
 * PLACEHOLDER design content for the Client Case Studies section.
 *
 * The companies, quotes and metrics below are FICTIONAL sample data used only
 * to preview the layout — they are not real clients and must not be published
 * as-is. Real case studies will be authored in the CMS (Sanity). Cover images
 * reuse the interior pool.
 */

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  /** Sample/fictional company name. */
  client: string;
  industry: string;
  /** Which NammaOffice centre they work from. */
  centre: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  quote: string;
  quoteAuthor: string;
  metrics: CaseStudyMetric[];
  coverImage: string;
  videoUrl?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "saravana-textiles",
    client: "Saravana Textiles",
    industry: "Textile & Apparel",
    centre: "TIDEL NEO, Tirupur",
    summary:
      "A growing knitwear exporter moved its back-office and design team into a managed office to scale during peak export season.",
    challenge:
      "Saravana Textiles was expanding fast but stuck in a cramped office with unreliable power and no room to add staff during peak season.",
    solution:
      "They moved into a managed office at NammaOffice TIDEL NEO, Tirupur — with power backup, high-speed internet, meeting halls for buyer visits, and the flexibility to add desks month to month.",
    result:
      "The team scaled smoothly through peak season without a long lease, and used the meeting halls to host international buyers in a professional setting.",
    quote:
      "We went from worrying about power cuts to hosting buyers in a boardroom. NammaOffice let us grow without the baggage of a lease.",
    quoteAuthor: "Sample testimonial — Director, Saravana Textiles (placeholder)",
    metrics: [
      { value: "2x", label: "Team size in 6 months" },
      { value: "0", label: "Days lost to power cuts" },
      { value: "Month-to-month", label: "Flexible terms" },
    ],
    coverImage: interiorPool[1],
  },
  {
    slug: "velan-logistics",
    client: "Velan Logistics",
    industry: "Logistics & Supply Chain",
    centre: "Texvalley, Erode",
    summary:
      "A regional logistics firm set up a highway-side operations hub with private cabins and 24/7 access.",
    challenge:
      "Velan needed a professional base on the Salem-Kochi highway for its operations team, close to clients but away from city traffic.",
    solution:
      "Private cabins at NammaOffice Texvalley gave them a calm, well-connected hub with ample parking and easy highway access.",
    result:
      "Faster client turnaround and a central point for the field team to coordinate from.",
    quote:
      "Being right on NH-544 with parking and a proper office changed how fast our team can move.",
    quoteAuthor: "Sample testimonial — Operations Lead, Velan Logistics (placeholder)",
    metrics: [
      { value: "NH-544", label: "Highway-side hub" },
      { value: "24/7", label: "Team access" },
      { value: "30%", label: "Faster coordination" },
    ],
    coverImage: interiorPool[19],
  },
  {
    slug: "aarav-fintech",
    client: "Aarav Fintech",
    industry: "Financial Services",
    centre: "Anushka Tower, Salem",
    summary:
      "An early-stage fintech startup used hot desks and meeting rooms to go from two founders to a full team.",
    challenge:
      "Two founders bootstrapping a fintech product needed a credible address and room to hire — without committing to office overheads.",
    solution:
      "They started on open desks at NammaOffice Anushka Tower and scaled into a private cabin, using meeting rooms for investor pitches.",
    result:
      "Closed a seed round and grew the team, all from a professional base in central Salem.",
    quote:
      "We pitched investors in the boardroom and hired our first ten people — without ever signing a lease.",
    quoteAuthor: "Sample testimonial — Co-founder, Aarav Fintech (placeholder)",
    metrics: [
      { value: "10+", label: "Hires in year one" },
      { value: "Seed", label: "Round closed" },
      { value: "Central", label: "Salem address" },
    ],
    coverImage: interiorPool[34],
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
