export interface FranchiseBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface FranchiseInvestment {
  minSize: number;
  maxSize: number;
  unit: string;
  agreementTerm: string;
  projectedROI: string;
  paybackPeriod: string;
  investmentRange: string;
}

export interface FranchiseStep {
  step: number;
  title: string;
  description: string;
}

export interface FranchiseSupportPhase {
  phase: string;
  title: string;
  items: string[];
}

export const franchiseBenefits: FranchiseBenefit[] = [
  {
    icon: "/icons/brand.svg",
    title: "Proven Brand",
    description:
      "Leverage the NammaOffice brand with 5+ years of operational excellence and 500+ satisfied members across Tamil Nadu.",
  },
  {
    icon: "/icons/roi.svg",
    title: "Strong ROI",
    description:
      "Predictable returns backed by a proven business model — detailed unit economics shared in your discovery call.",
  },
  {
    icon: "/icons/support.svg",
    title: "Full Operational Support",
    description:
      "From site selection to launch and beyond — our team guides you through every step of building and running your centre.",
  },
  {
    icon: "/icons/technology.svg",
    title: "Technology Platform",
    description:
      "Access our proprietary booking, billing, and member management platform — no tech investment required.",
  },
  {
    icon: "/icons/training.svg",
    title: "Staff Training",
    description:
      "Comprehensive training programmes for your centre manager and team, including ongoing skill development.",
  },
  {
    icon: "/icons/marketing.svg",
    title: "Marketing & Lead Generation",
    description:
      "Benefit from centralised digital marketing, SEO, social media, and a dedicated lead pipeline from day one.",
  },
  {
    icon: "/icons/design.svg",
    title: "Interior Design & Fitout",
    description:
      "Our design team creates stunning, on-brand interiors optimised for productivity, community, and member satisfaction.",
  },
  {
    icon: "/icons/community.svg",
    title: "Exclusive Territory",
    description:
      "Operate with confidence in your designated territory — no NammaOffice-owned or franchised competition within your zone.",
  },
];

export const franchiseInvestment: FranchiseInvestment = {
  minSize: 2000,
  maxSize: 20000,
  unit: "sq ft",
  agreementTerm: "5+5 years",
  projectedROI: "40%",
  paybackPeriod: "2.5 years",
  investmentRange: "Contact us for a personalised investment estimate",
};

export const franchiseProcess: FranchiseStep[] = [
  {
    step: 1,
    title: "Enquiry & Initial Discussion",
    description:
      "Fill out our franchise enquiry form or call us. Our franchise development team will contact you within 48 hours for an initial discussion about your goals and the opportunity.",
  },
  {
    step: 2,
    title: "Site Evaluation",
    description:
      "Our real estate and operations team will evaluate your proposed site (or help you find one) based on foot traffic, accessibility, competition, and market potential.",
  },
  {
    step: 3,
    title: "Franchise Agreement",
    description:
      "Once the site is approved, we'll walk you through the franchise agreement — a 5+5 year term with clear terms on fees, support, and mutual obligations.",
  },
  {
    step: 4,
    title: "Design & Fitout",
    description:
      "Our design team takes over — creating floor plans, managing the fitout, sourcing furniture, and installing IT infrastructure. Your job: watch your centre come to life.",
  },
  {
    step: 5,
    title: "Training & Soft Launch",
    description:
      "Your team undergoes NammaOffice's training programme. We run a soft launch with founding member offers to generate early sign-ups and community buzz.",
  },
  {
    step: 6,
    title: "Grand Opening & Ongoing Support",
    description:
      "We support your grand opening with marketing, PR, and leadership presence. Post-launch, your dedicated account manager provides ongoing support, reviews, and growth guidance.",
  },
];

export const franchiseSupportPhases: FranchiseSupportPhase[] = [
  {
    phase: "Pre-Launch",
    title: "Before You Open",
    items: [
      "Site selection and due diligence",
      "Interior design and space planning",
      "Fitout project management",
      "IT and technology setup",
      "Staff recruitment guidance",
      "Staff training and certification",
      "Founding member pre-sales campaign",
      "Marketing launch kit and materials",
    ],
  },
  {
    phase: "Launch",
    title: "Opening Day and Beyond",
    items: [
      "Grand opening event support",
      "PR and local media outreach",
      "Social media launch campaign",
      "On-site NammaOffice leadership presence",
      "Member onboarding process setup",
      "First-month operations supervision",
    ],
  },
  {
    phase: "Ongoing",
    title: "Your Growth Partner",
    items: [
      "Dedicated franchise account manager",
      "Monthly performance reviews",
      "Centralised digital marketing and leads",
      "Technology platform updates",
      "Annual staff training refreshers",
      "Community event playbooks",
      "Access to NammaOffice supplier network",
      "Benchmarking against network performance",
    ],
  },
];
