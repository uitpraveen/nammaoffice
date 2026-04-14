import { SectionHeading } from "@/components/ui/SectionHeading";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "⚡",
    title: "High-Speed Internet",
    description:
      "Dedicated gigabit fibre connections with redundant ISPs ensure zero downtime for your work.",
  },
  {
    icon: "🔓",
    title: "24/7 Access",
    description:
      "Work on your own schedule with round-the-clock biometric access to your workspace.",
  },
  {
    icon: "✨",
    title: "Premium Interiors",
    description:
      "Thoughtfully designed spaces with ergonomic furniture, natural lighting, and a productive ambience.",
  },
  {
    icon: "📅",
    title: "Flexible Plans",
    description:
      "Daily, weekly, monthly, and annual plans — scale up or down as your business needs evolve.",
  },
  {
    icon: "🤝",
    title: "Thriving Community",
    description:
      "Connect, collaborate, and grow with a vibrant ecosystem of entrepreneurs, freelancers, and professionals.",
  },
  {
    icon: "📍",
    title: "Strategic Locations",
    description:
      "Prime addresses across Salem, Trichy, and Tirupur — close to transport hubs and business districts.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-sand">
      <div className="content-width">
        <SectionHeading
          title="Why Choose NammaOffice"
          subtitle="Everything you need to do your best work — in one place."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-4">
              {/* Icon circle */}
              <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0">
                <span className="text-2xl" aria-hidden="true">
                  {feature.icon}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-lg text-warm-charcoal">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm text-warm-gray leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
