import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { workspaces } from "@/lib/data/workspaces";

// Placeholder colors per workspace type
const workspaceColors: Record<string, string> = {
  "private-cabin": "bg-terracotta-100",
  "open-desk": "bg-olive-100",
  cubicle: "bg-sand-100",
  "meeting-hall": "bg-terracotta-200",
  "business-lounge": "bg-olive-200",
  "managed-office": "bg-sand-300",
};

export function WorkspaceCardsGrid() {
  return (
    <section className="section-padding bg-warm-white">
      <div className="content-width">
        <SectionHeading
          title="Workspaces Designed for You"
          subtitle="From solo freelancers to large enterprise teams — we have the perfect space for every stage of your journey."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => (
            <Card key={ws.slug} hover className="flex flex-col">
              {/* Placeholder image area */}
              <div
                className={`h-48 flex items-center justify-center ${workspaceColors[ws.slug] ?? "bg-sand"}`}
              >
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center">
                    <span className="text-terracotta text-xl font-serif">
                      {ws.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-warm-charcoal font-sans text-sm font-medium">
                    {ws.name}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="font-serif text-xl text-warm-charcoal">
                  {ws.name}
                </h3>
                <p className="text-warm-gray font-sans text-sm leading-relaxed flex-1">
                  {ws.shortDescription}
                </p>
                <div className="flex items-center gap-4 text-xs text-warm-gray font-sans">
                  <span>{ws.capacity}</span>
                  <span className="text-warm-border">·</span>
                  <span>{ws.flexibility}</span>
                </div>
                <Link
                  href={`/workspaces/${ws.slug}`}
                  className="text-terracotta font-sans text-sm font-medium hover:text-terracotta-600 transition-colors inline-flex items-center gap-1 mt-1"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
