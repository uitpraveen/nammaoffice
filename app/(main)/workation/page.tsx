import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { WorkationForm } from "@/components/forms/WorkationForm";

export const metadata: Metadata = {
  title: "Workation — Work From Anywhere | NammaOffice",
  description:
    "Experience a NammaOffice workation in Salem, Trichy, or Tirupur. Combine work and travel with high-speed Wi-Fi, comfortable stays, and the NammaOffice community.",
  keywords: [
    "workation Tamil Nadu",
    "work and travel Salem",
    "workation India",
    "remote work experience",
    "workation coworking",
  ],
  openGraph: {
    title: "Workation — Work From Anywhere | NammaOffice",
    description:
      "Combine work and travel at NammaOffice. Workation packages in Salem, Trichy, and Tirupur.",
  },
};

const features = [
  {
    icon: "📶",
    title: "High-Speed Wi-Fi",
    description:
      "Blazing-fast, reliable internet connections at every NammaOffice centre — because your work can't wait for buffering.",
  },
  {
    icon: "🛏️",
    title: "Comfortable Stay",
    description:
      "We connect you with vetted accommodation partners near our centres so you can rest well and work better.",
  },
  {
    icon: "⚖️",
    title: "Work-Life Balance",
    description:
      "Structured work hours at the coworking space plus time to explore local culture, cuisine, and nature.",
  },
  {
    icon: "🤝",
    title: "Community",
    description:
      "Work alongside NammaOffice's vibrant community of entrepreneurs, freelancers, and remote professionals.",
  },
  {
    icon: "🌆",
    title: "Local Experiences",
    description:
      "Discover the best of Tamil Nadu's tier-2 cities — from Salem's steel bazaars to Trichy's temples and Tirupur's textile culture.",
  },
];

const galleryPlaceholders = [
  { bg: "bg-terracotta-100", label: "Common Area, Salem" },
  { bg: "bg-olive-100", label: "Rooftop View, Trichy" },
  { bg: "bg-sand-300", label: "Lounge, Tirupur" },
  { bg: "bg-terracotta-50", label: "Open Desk, Salem" },
  { bg: "bg-olive-50", label: "Meeting Hall, Trichy" },
  { bg: "bg-sand-200", label: "Cafeteria, Tirupur" },
];

export default function WorkationPage() {
  return (
    <>
      <HeroBanner
        title="Work From Anywhere. Work at Your Best."
        subtitle="NammaOffice workations blend professional productivity with the joy of travel. Discover a new city without missing a deadline."
      />

      {/* What is a Workation? */}
      <section className="section-padding">
        <div className="content-width">
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              title="What is a Workation?"
              centered={false}
              className="mb-8"
            />
            <div className="space-y-5 font-sans text-warm-gray text-base leading-relaxed">
              <p>
                A workation is the perfect blend of remote work and travel — bringing
                together the discipline of a structured workspace with the inspiration
                of a new environment. Instead of working from your usual desk, you
                pack your laptop and head to a city that energises you, while keeping
                your professional output intact.
              </p>
              <p>
                At NammaOffice, we make workations seamless. Our centres across Salem,
                Trichy, and Tirupur offer premium coworking infrastructure — high-speed
                Wi-Fi, ergonomic seating, meeting rooms, and a community of fellow
                professionals. We work with local accommodation partners to ensure you
                have comfortable, well-connected places to stay.
              </p>
              <p>
                Whether you're a freelancer exploring Tamil Nadu, a remote team looking
                for a change of scenery, or an entrepreneur testing a new market —
                NammaOffice has the infrastructure and community to make your workation
                a success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <SectionHeading
            title="Everything You Need to Work and Explore"
            subtitle="Five pillars that make a NammaOffice workation different."
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} hover className="p-6 flex flex-col gap-4">
                <div className="text-4xl" aria-hidden="true">{feature.icon}</div>
                <div>
                  <h3 className="font-serif text-xl text-warm-charcoal mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-warm-gray leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Placeholder */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="A Glimpse of the NammaOffice Experience"
            subtitle="Real spaces, real community, across Salem, Trichy, and Tirupur."
            className="mb-12"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPlaceholders.map((item) => (
              <div
                key={item.label}
                className={`${item.bg} rounded-brand aspect-[4/3] flex items-end p-4`}
              >
                <span className="font-sans text-xs text-warm-charcoal/60 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workation Form */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              title="Plan Your Workation"
              subtitle="Tell us your dates and group size — we'll put together the ideal workation package for you."
              className="mb-10"
            />
            <Card className="p-8">
              <WorkationForm />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
