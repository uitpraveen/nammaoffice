import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GoogleMap } from "@/components/ui/GoogleMap";
import { CTASection } from "@/components/sections/CTASection";
import { cities, getCity, getLocationsByCity } from "@/lib/data/locations";
import { getTestimonialsByCity } from "@/lib/data/testimonials";
import { googleMapsUrl } from "@/lib/utils";
import type { CitySlug } from "@/lib/types";

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCity(citySlug as CitySlug);
  if (!city) return {};
  return {
    title: city.seoTitle,
    description: city.seoDescription,
    openGraph: {
      title: city.seoTitle,
      description: city.seoDescription,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug as CitySlug);

  if (!city) notFound();

  const cityLocations = getLocationsByCity(city.slug as CitySlug);
  const cityTestimonials = getTestimonialsByCity(city.slug as CitySlug);

  // City center coordinates (average of all locations)
  const avgLat =
    cityLocations.reduce((sum, loc) => sum + loc.coordinates.lat, 0) /
    (cityLocations.length || 1);
  const avgLng =
    cityLocations.reduce((sum, loc) => sum + loc.coordinates.lng, 0) /
    (cityLocations.length || 1);

  return (
    <>
      <HeroBanner title={city.name} subtitle={city.tagline} />

      {/* Centre cards */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title={`NammaOffice in ${city.name}`}
            subtitle={`${cityLocations.length} centre${cityLocations.length !== 1 ? "s" : ""} across ${city.name}`}
            centered={false}
            className="mb-12"
          />

          <div className="flex flex-col gap-8">
            {cityLocations.map((location) => (
              <div
                key={location.slug}
                className="flex flex-col sm:flex-row bg-white rounded-brand shadow-brand overflow-hidden hover:shadow-brand-hover transition-shadow duration-300"
              >
                {/* Placeholder image */}
                <div className="bg-gradient-to-br from-sand-200 to-sand-300 h-48 sm:h-auto sm:w-52 flex-shrink-0 flex items-center justify-center">
                  <span className="font-serif text-warm-charcoal/40 text-sm text-center px-4">
                    {location.name}
                  </span>
                </div>

                {/* Center content */}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h2 className="font-serif text-xl text-warm-charcoal">
                    {location.name}
                  </h2>
                  <p className="text-warm-gray font-sans text-sm">{location.address}</p>
                  <p className="text-warm-gray font-sans text-xs">{location.operatingHours}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {location.workspaceTypes.map((type) => (
                      <Badge key={type} className="capitalize">
                        {type.replace(/-/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right actions */}
                <div className="p-6 flex flex-col gap-3 justify-center flex-shrink-0">
                  <Button
                    href={`/locations/${city.slug}/${location.slug}`}
                    variant="primary"
                    size="sm"
                  >
                    View Details
                  </Button>
                  <a
                    href={googleMapsUrl(location.coordinates.lat, location.coordinates.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-terracotta font-sans font-medium hover:underline text-center"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="section-padding bg-sand-50">
        <div className="content-width">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl text-warm-charcoal mb-6">
              Coworking Space in {city.name}
            </h2>
            <div className="prose prose-warm font-sans text-warm-gray leading-relaxed">
              <p className="mb-4">{city.description}</p>
              <p>{city.seoContent}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="section-padding">
        <div className="content-width">
          <SectionHeading
            title={`Find Us in ${city.name}`}
            className="mb-8"
          />
          <GoogleMap
            lat={avgLat}
            lng={avgLng}
            title={`NammaOffice ${city.name} locations`}
            className="h-80"
          />
        </div>
      </section>

      {/* Testimonials */}
      {cityTestimonials.length > 0 && (
        <section className="section-padding bg-sand-50">
          <div className="content-width">
            <SectionHeading
              title={`What Our ${city.name} Members Say`}
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cityTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-brand shadow-brand p-6 flex flex-col gap-4"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-terracotta"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-sans text-warm-gray text-sm leading-relaxed italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-warm-charcoal text-sm">
                      {testimonial.name}
                    </span>
                    <span className="font-sans text-warm-gray text-xs">
                      {testimonial.company}
                    </span>
                    {testimonial.location && (
                      <span className="font-sans text-warm-gray/60 text-xs mt-0.5">
                        {testimonial.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
