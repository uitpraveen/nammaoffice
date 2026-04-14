import type { Metadata } from "next";
import Link from "next/link";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { workspaces } from "@/lib/data/workspaces";
import { getPageSEO } from "@/lib/data/seo";

export function generateMetadata(): Metadata {
  const seo = getPageSEO("/workspaces");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}

// Distinct placeholder colors per workspace
const workspaceColors: Record<string, string> = {
  "private-cabin": "bg-terracotta-100",
  "open-desk": "bg-olive-100",
  cubicle: "bg-sand-300",
  "meeting-hall": "bg-terracotta-200",
  "business-lounge": "bg-olive-200",
  "managed-office": "bg-warm-charcoal/10",
};

export default function WorkspacesPage() {
  return (
    <>
      <HeroBanner
        title="Workspaces for Every Need"
        subtitle="From hot-desks to fully managed offices — find the workspace that fits how you work."
      />

      {/* Workspace Cards Grid */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="Our Workspace Types"
            subtitle="Six workspace formats designed around different working styles, team sizes, and business needs."
            className="mb-16"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {workspaces.map((workspace) => {
              const colorClass =
                workspaceColors[workspace.slug] ?? "bg-sand-200";
              const excerpt =
                workspace.fullDescription.length > 150
                  ? workspace.fullDescription.slice(0, 150) + "..."
                  : workspace.fullDescription;

              return (
                <div
                  key={workspace.slug}
                  className="flex flex-col sm:flex-row bg-white rounded-brand shadow-brand overflow-hidden hover:shadow-brand-hover transition-shadow duration-300"
                >
                  {/* Placeholder image */}
                  <div
                    className={`${colorClass} h-64 sm:h-auto sm:w-48 flex-shrink-0 flex items-center justify-center`}
                  >
                    <span className="text-warm-charcoal/40 font-serif text-sm text-center px-4 leading-snug">
                      {workspace.name}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <h3 className="font-serif text-2xl text-warm-charcoal">
                      {workspace.name}
                    </h3>
                    <p className="text-warm-gray font-sans text-sm leading-relaxed flex-1">
                      {excerpt}
                    </p>

                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-2">
                      {workspace.features.slice(0, 3).map((feature) => (
                        <Badge key={feature}>{feature}</Badge>
                      ))}
                    </div>

                    <div>
                      <Button
                        href={`/workspaces/${workspace.slug}`}
                        variant="primary"
                        size="sm"
                      >
                        Explore {workspace.name}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <SectionHeading
            title="Compare All Workspace Types"
            subtitle="Side-by-side view of features, amenities, and capacity across all our workspace options."
            className="mb-12"
          />
          <ComparisonTable />
        </div>
      </section>

      <CTASection />
    </>
  );
}
