import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ImageMosaic } from "@/components/ui/ImageMosaic";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { CTASection } from "@/components/sections/CTASection";
import { workspaces, getWorkspace } from "@/lib/data/workspaces";
import { getAmenities } from "@/lib/data/amenities";
import { locations } from "@/lib/data/locations";
import type { WorkspaceSlug } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return workspaces.map((ws) => ({ slug: ws.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workspace = getWorkspace(slug as WorkspaceSlug);
  if (!workspace) return {};
  return {
    title: workspace.seoTitle,
    description: workspace.seoDescription,
    openGraph: {
      title: workspace.seoTitle,
      description: workspace.seoDescription,
    },
  };
}

export default async function WorkspacePage({ params }: Props) {
  const { slug } = await params;
  const workspace = getWorkspace(slug as WorkspaceSlug);

  if (!workspace) notFound();

  const amenityList = getAmenities(workspace.amenities);

  // Locations that offer this workspace
  const availableLocations = locations.filter((loc) =>
    workspace.availableAt.includes(loc.slug)
  );

  // Related workspaces (exclude current)
  const relatedWorkspaces = workspaces.filter((ws) => ws.slug !== workspace.slug);

  // Build mosaic images — use placeholder data since real images may not exist
  const mosaicImages = workspace.images.map((src, i) => ({
    src,
    alt: `${workspace.name} — photo ${i + 1}`,
  }));

  // Fallback: if no images defined, create placeholder entries
  const displayImages =
    mosaicImages.length > 0
      ? mosaicImages
      : [{ src: "/images/placeholder.jpg", alt: workspace.name }];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace.name },
        ]}
      />

      {/* Image Mosaic */}
      <div className="content-width mb-12">
        <ImageMosaic images={displayImages} />
      </div>

      {/* Main content */}
      <section className="content-width pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left column */}
          <div className="lg:w-3/5 flex flex-col gap-10">
            <h1 className="font-serif text-4xl md:text-5xl text-warm-charcoal leading-tight">
              {workspace.name}
            </h1>

            {/* Description paragraphs */}
            <div className="font-sans text-warm-gray text-base leading-relaxed space-y-4">
              {workspace.fullDescription.split(". ").reduce<string[]>((acc, sentence, i, arr) => {
                // Group into ~2-sentence paragraphs
                const groupIndex = Math.floor(i / 2);
                acc[groupIndex] = acc[groupIndex]
                  ? acc[groupIndex] + ". " + sentence
                  : sentence;
                return acc;
              }, []).map((para, i) => (
                <p key={i}>{para.trim()}{para.endsWith(".") ? "" : "."}</p>
              ))}
            </div>

            {/* Key highlights */}
            <div>
              <h2 className="font-serif text-2xl text-warm-charcoal mb-5">
                Key Highlights
              </h2>
              <ul className="space-y-3">
                {workspace.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 font-sans text-warm-gray">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-terracotta flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Amenities grid */}
            <div>
              <h2 className="font-serif text-2xl text-warm-charcoal mb-5">
                Included Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenityList.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-3 bg-sand-50 rounded-brand px-4 py-3"
                  >
                    {/* Icon placeholder */}
                    <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-terracotta text-xs font-bold">
                        {amenity.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-sans text-sm text-warm-charcoal leading-snug">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — sticky enquiry card */}
          <div className="lg:w-2/5">
            <div className="sticky top-24">
              <Card className="p-6">
                <h2 className="font-serif text-2xl text-warm-charcoal mb-6">
                  Interested in this workspace?
                </h2>
                <EnquiryForm />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Available At section */}
      {availableLocations.length > 0 && (
        <section className="section-padding bg-sand-50">
          <div className="content-width">
            <SectionHeading
              title="Available At These Locations"
              subtitle={`${workspace.name} is available at ${availableLocations.length} NammaOffice centre${availableLocations.length !== 1 ? "s" : ""}.`}
              className="mb-12"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableLocations.map((loc) => (
                <Card key={loc.slug} hover className="p-6 flex flex-col gap-3">
                  <div className="bg-terracotta-100 rounded-brand h-28 flex items-center justify-center mb-2">
                    <span className="font-serif text-terracotta text-sm text-center px-4">
                      {loc.name}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-warm-charcoal">{loc.name}</h3>
                  <p className="text-warm-gray font-sans text-sm capitalize">{loc.city}</p>
                  <p className="text-warm-gray font-sans text-xs leading-snug">{loc.address}</p>
                  <Button
                    href={`/locations/${loc.city}/${loc.slug}`}
                    variant="outline"
                    size="sm"
                    className="mt-auto"
                  >
                    View Location
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Workspaces — horizontal scroll */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title="Other Workspace Types"
            subtitle="Explore more workspace options at NammaOffice."
            className="mb-10"
          />
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {relatedWorkspaces.map((ws) => (
              <div
                key={ws.slug}
                className="flex-shrink-0 w-72 snap-start bg-white rounded-brand shadow-brand overflow-hidden hover:shadow-brand-hover transition-shadow duration-300"
              >
                <div className="bg-sand-200 h-40 flex items-center justify-center">
                  <span className="font-serif text-warm-charcoal/50 text-sm text-center px-4">
                    {ws.name}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="font-serif text-lg text-warm-charcoal">{ws.name}</h3>
                  <p className="text-warm-gray font-sans text-xs leading-relaxed">
                    {ws.shortDescription.slice(0, 90)}...
                  </p>
                  <Button href={`/workspaces/${ws.slug}`} variant="ghost" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
