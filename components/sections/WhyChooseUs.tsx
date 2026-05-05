import {
  CalendarRange,
  Clock,
  MapPin,
  Sparkles,
  Users2,
  Wifi,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Wifi className="w-5 h-5" strokeWidth={1.75} />,
    title: "Gigabit fibre internet",
    description:
      "Dedicated lines and redundant ISPs at every centre — no buffering, no excuses.",
  },
  {
    icon: <Clock className="w-5 h-5" strokeWidth={1.75} />,
    title: "24/7 biometric access",
    description:
      "Walk in at any hour. Your hours, your schedule, your space.",
  },
  {
    icon: <Sparkles className="w-5 h-5" strokeWidth={1.75} />,
    title: "Considered interiors",
    description:
      "Ergonomic furniture, plants, natural light. Designed for long, focused days.",
  },
  {
    icon: <CalendarRange className="w-5 h-5" strokeWidth={1.75} />,
    title: "Plans that flex",
    description:
      "Day passes, monthly seats, annual cabins — scale up and down as you grow.",
  },
  {
    icon: <Users2 className="w-5 h-5" strokeWidth={1.75} />,
    title: "Real community",
    description:
      "Founders, freelancers, agencies — meet at the coffee bar, find your next client.",
  },
  {
    icon: <MapPin className="w-5 h-5" strokeWidth={1.75} />,
    title: "Strategic locations",
    description:
      "Prime addresses near transport hubs and business districts in every city.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-[var(--color-bg)]">
      <div className="content-width">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="eyebrow">Why NammaOffice</p>
          <h2 className="display-lg mt-3 text-[var(--color-ink)]">
            The details add up.
          </h2>
          <p className="mt-4 text-[16px] text-[var(--color-ink-secondary)] leading-relaxed">
            Six things we get right, every day, at every centre.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-border-strong)] hover:shadow-[0_4px_16px_rgba(10,10,10,0.04)] transition-all"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-accent-50)] text-[var(--color-accent)] group-hover:bg-gradient-accent group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-[14px] text-[var(--color-ink-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
