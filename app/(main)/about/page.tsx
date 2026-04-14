import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { CTASection } from "@/components/sections/CTASection";
import { Timeline } from "@/components/sections/Timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { team, milestones } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "About NammaOffice — Our Story, Mission & Team",
  description:
    "Learn about NammaOffice — how we started in Salem and grew to 7 centres across Tamil Nadu. Our mission: make premium workspaces accessible to every entrepreneur.",
  keywords: [
    "about NammaOffice",
    "NammaOffice history",
    "coworking Tamil Nadu story",
  ],
  openGraph: {
    title: "About NammaOffice — Our Story, Mission & Team",
    description:
      "From a single centre on Brindavan Road to 7 locations across Tamil Nadu.",
  },
};

const values = [
  {
    icon: "🎯",
    title: "Mission",
    description:
      "To make premium, professional workspaces accessible to every entrepreneur, freelancer, and growing team in Tamil Nadu's tier-2 cities — eliminating the barrier between ambition and infrastructure.",
  },
  {
    icon: "🔭",
    title: "Vision",
    description:
      "To be the most trusted coworking network in South India — a brand synonymous with community, productivity, and opportunity for the next generation of Tamil Nadu's business leaders.",
  },
  {
    icon: "💡",
    title: "Values",
    description:
      "Community over competition. Flexibility over rigidity. Quality without compromise. We believe that when entrepreneurs thrive, cities thrive — and NammaOffice is committed to being the catalyst.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeroBanner
        title="Our Story"
        subtitle="Born in Salem, built for Tamil Nadu — NammaOffice is more than a coworking space. It's a community."
      />

      {/* Company Story */}
      <section className="section-padding">
        <div className="content-width">
          <div className="max-w-3xl mx-auto space-y-6 font-sans text-warm-gray text-base leading-relaxed">
            <p>
              NammaOffice began with a simple observation: the entrepreneurs and
              professionals of Salem, Trichy, and Tirupur were as ambitious as
              their counterparts in Chennai or Bengaluru — but lacked the
              infrastructure to match. Premium coworking was a metropolitan
              luxury. We set out to change that.
            </p>
            <p>
              In 2019, we opened our first centre on Brindavan Road, Salem, with
              50 seats and a vision. The response was overwhelming. Within months,
              we had a waiting list. Within a year, we were expanding. Today,
              NammaOffice operates 7 centres — 5 in Salem, 1 in Trichy, and 1 in
              Tirupur — and serves over 500 active members ranging from solo
              freelancers to 50-person enterprises.
            </p>
            <p>
              Our philosophy has never changed: create spaces that professionals
              are proud to work from, build communities that support each other&apos;s
              growth, and keep quality high while keeping costs predictable. Every
              NammaOffice centre is designed with the same commitment to ergonomics,
              connectivity, and community that made our Brindavan Road centre a
              success.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <SectionHeading
            title="What Drives Us"
            subtitle="The mission, vision, and values that guide every NammaOffice decision."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item) => (
              <Card key={item.title} className="p-8 flex flex-col gap-4">
                <div className="text-4xl" aria-hidden="true">{item.icon}</div>
                <h3 className="font-serif text-2xl text-warm-charcoal">{item.title}</h3>
                <p className="font-sans text-sm text-warm-gray leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="Our Team"
            subtitle="The people behind NammaOffice — passionate about workspaces, communities, and Tamil Nadu."
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                {/* Photo placeholder */}
                <div className="h-56 bg-gradient-to-br from-terracotta-100 to-olive-100 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-warm-charcoal/40"
                      aria-hidden="true"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-warm-charcoal">{member.name}</h3>
                  <p className="font-sans text-sm text-terracotta font-medium mt-1">{member.role}</p>
                  {member.bio && (
                    <p className="font-sans text-xs text-warm-gray mt-3 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <SectionHeading
            title="Our Journey"
            subtitle="Five years of growth, resilience, and community building across Tamil Nadu."
            className="mb-12"
          />
          <Timeline milestones={milestones} />
        </div>
      </section>

      <CTASection />
    </>
  );
}
