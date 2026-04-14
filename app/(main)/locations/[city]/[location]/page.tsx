import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ImageMosaic } from "@/components/ui/ImageMosaic";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GoogleMap } from "@/components/ui/GoogleMap";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { CTASection } from "@/components/sections/CTASection";
import {
  cities,
  locations,
  getCity,
  getLocation,
} from "@/lib/data/locations";
import { getWorkspacesByLocation } from "@/lib/data/workspaces";
import { getAmenities } from "@/lib/data/amenities";
import { googleMapsUrl, whatsappUrl, formatPhone } from "@/lib/utils";
import type { CitySlug } from "@/lib/types";

type Props = {
  params: Promise<{ city: string; location: string }>;
};

export async function generateStaticParams() {
  return locations.map((loc) => ({
    city: loc.city,
    location: loc.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location: locationSlug } = await params;
  const location = getLocation(locationSlug);
  if (!location) return {};
  return {
    title: location.seoTitle,
    description: location.seoDescription,
    openGraph: {
      title: location.seoTitle,
      description: location.seoDescription,
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { city: citySlug, location: locationSlug } = await params;

  const city = getCity(citySlug as CitySlug);
  const location = getLocation(locationSlug);

  if (!city || !location || location.city !== citySlug) notFound();

  const amenityList = getAmenities(location.amenities);
  const workspaceList = getWorkspacesByLocation(location.slug);

  const mosaicImages = location.images.map((src, i) => ({
    src,
    alt: `${location.name}, ${city.name} — photo ${i + 1}`,
  }));

  const displayImages =
    mosaicImages.length > 0
      ? mosaicImages
      : [{ src: "/images/placeholder.jpg", alt: location.name }];

  const directionsUrl = googleMapsUrl(
    location.coordinates.lat,
    location.coordinates.lng
  );

  const waUrl = whatsappUrl(
    formatPhone(location.phone),
    `Hi, I'm interested in booking a workspace at NammaOffice ${location.name}, ${city.name}.`
  );

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations" },
          { label: city.name, href: `/locations/${city.slug}` },
          { label: location.name },
        ]}
      />

      {/* Image Mosaic */}
      <div className="content-width mb-12">
        <ImageMosaic images={displayImages} />
      </div>

      {/* Main content */}
      <section className="content-width pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left column — 65% */}
          <div className="lg:w-[65%] flex flex-col gap-10">
            <div>
              <p className="font-sans text-warm-gray text-sm uppercase tracking-wider mb-2">
                {city.name}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-warm-charcoal leading-tight">
                {location.name}
              </h1>
            </div>

            {/* Description */}
            <p className="font-sans text-warm-gray text-base leading-relaxed">
              {location.description}
            </p>

            {/* Available Workspaces */}
            {workspaceList.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-warm-charcoal mb-5">
                  Available Workspace Types
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {workspaceList.map((ws) => (
                    <Card key={ws.slug} hover className="p-5 flex flex-col gap-3">
                      <h3 className="font-serif text-lg text-warm-charcoal">
                        {ws.name}
                      </h3>
                      <p className="font-sans text-warm-gray text-sm leading-relaxed">
                        {ws.shortDescription.slice(0, 80)}...
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        <Badge className="text-xs">
                          {ws.capacity}
                        </Badge>
                        <Badge className="text-xs">
                          {ws.flexibility}
                        </Badge>
                      </div>
                      <Button
                        href={`/workspaces/${ws.slug}`}
                        variant="ghost"
                        size="sm"
                        className="mt-1 self-start"
                      >
                        Learn More
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <h2 className="font-serif text-2xl text-warm-charcoal mb-5">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenityList.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-3 bg-sand-50 rounded-brand px-4 py-3"
                  >
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

            {/* Operating Hours */}
            <div>
              <h2 className="font-serif text-2xl text-warm-charcoal mb-4">
                Operating Hours
              </h2>
              <p className="font-sans text-warm-gray text-base">
                {location.operatingHours}
              </p>
            </div>

            {/* Nearby Facilities */}
            {location.nearbyFacilities.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-warm-charcoal mb-5">
                  Nearby Facilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {location.nearbyFacilities.map((facility, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white rounded-brand border border-warm-border px-4 py-3"
                    >
                      <span className="text-xl" aria-hidden="true">
                        {facility.icon}
                      </span>
                      <span className="font-sans text-sm text-warm-gray leading-snug">
                        {facility.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Landmarks */}
            {location.nearbyLandmarks.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-warm-charcoal mb-5">
                  Nearby Landmarks
                </h2>
                <ul className="space-y-2">
                  {location.nearbyLandmarks.map((landmark) => (
                    <li
                      key={landmark}
                      className="flex items-center gap-3 font-sans text-warm-gray text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-terracotta flex-shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column — sticky sidebar 35% */}
          <div className="lg:w-[35%]">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Map */}
              <GoogleMap
                lat={location.coordinates.lat}
                lng={location.coordinates.lng}
                title={`${location.name}, ${city.name}`}
                className="h-56"
              />

              {/* Contact & Directions card */}
              <Card className="p-6 flex flex-col gap-4">
                <h2 className="font-serif text-xl text-warm-charcoal">
                  Visit Us
                </h2>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-terracotta flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p className="font-sans text-warm-gray text-sm leading-relaxed">
                    {location.address}
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-terracotta flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.9 2 2 0 0 1 3.55 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6.01 6.01l1.35-1.35a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a
                    href={`tel:${formatPhone(location.phone)}`}
                    className="font-sans text-warm-gray text-sm hover:text-terracotta transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-terracotta flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a
                    href={`mailto:${location.email}`}
                    className="font-sans text-warm-gray text-sm hover:text-terracotta transition-colors"
                  >
                    {location.email}
                  </a>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3 mt-2">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-brand transition-all duration-200 font-sans font-medium inline-flex items-center justify-center px-6 py-3 text-base bg-terracotta text-white hover:bg-terracotta-600 gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    Get Directions
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-brand transition-all duration-200 font-sans font-medium inline-flex items-center justify-center px-6 py-3 text-base border-2 border-olive text-olive hover:bg-olive hover:text-white gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </Card>

              {/* Enquiry Form */}
              <Card className="p-6">
                <h2 className="font-serif text-xl text-warm-charcoal mb-5">
                  Book a Tour
                </h2>
                <EnquiryForm preselectedLocation={location.slug} />
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
