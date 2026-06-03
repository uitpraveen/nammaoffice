import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  Ticket,
} from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { GoogleMap } from "@/components/ui/GoogleMap";
import { LocationHeroStrip, LocationInsideGallery } from "@/components/sections/LocationGallery";
import { Reveal } from "@/components/ui/Reveal";
import { locations, getCity, getLocation } from "@/lib/data/locations";
import { getAmenities } from "@/lib/data/amenities";
import { googleMapsUrl, whatsappUrl, formatPhone } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/schemas";
import type { CitySlug } from "@/lib/types";

const WORKSPACE_LABELS: Record<string, string> = {
  "private-cabin": "Private Cabin",
  "open-desk": "Open Desk",
  cubicle: "Cubicle",
  "meeting-hall": "Meeting Hall",
  "business-lounge": "Business Lounge",
  "managed-office": "Managed Office",
};

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
  const { city: citySlug, location: locationSlug } = await params;
  const location = getLocation(locationSlug, citySlug);
  if (!location) return {};
  const canonical = `/locations/${location.city}/${location.slug}`;
  return {
    // `absolute` bypasses the "%s | NammaOffice" template - seoTitle already
    // carries the brand, so this avoids a doubled "… | NammaOffice | NammaOffice".
    title: { absolute: location.seoTitle },
    description: location.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: location.seoTitle,
      description: location.seoDescription,
      url: canonical,
      images: location.images[0] ? [location.images[0]] : undefined,
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { city: citySlug, location: locationSlug } = await params;

  const city = getCity(citySlug as CitySlug);
  const location = getLocation(locationSlug, citySlug);

  if (!city || !location || location.city !== citySlug) notFound();

  const amenityList = getAmenities(location.amenities);
  const directionsUrl = googleMapsUrl(location.address);
  const waUrl = whatsappUrl(
    formatPhone(location.phone),
    `Hi, I'm interested in booking a workspace at NammaOffice ${location.name}, ${city.name}.`
  );

  // Determine which gate-pass URL applies (if this centre is a TIDEL park).
  const gatePassUrl =
    location.slug === "tidel-neo" && city.slug === "salem"
      ? "/gate-pass/tidel-neo-salem"
      : location.slug === "tidel-neo" && city.slug === "tirupur"
        ? "/gate-pass/tidel-neo-tirupur"
        : null;

  return (
    <>
      <JsonLd data={localBusinessSchema(location)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: city.name, href: `/locations/${city.slug}` },
          { name: location.name, href: `/locations/${city.slug}/${location.slug}` },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations" },
          { label: city.name, href: `/locations/${city.slug}` },
          { label: location.name },
        ]}
      />

      <LocationHeroStrip
        images={location.images}
        locationName={location.name}
        cityName={city.name}
      />

      <section className="content-width pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left - content */}
          <div className="lg:w-[62%] flex flex-col gap-12">
            <Reveal>
              <p className="eyebrow !text-[var(--color-gold-deep)]">{city.name}</p>
              <h1 className="font-display text-4xl md:text-5xl text-[var(--color-navy)] leading-tight mt-2">
                {location.name}
              </h1>
              <p className="mt-5 text-[15.5px] text-[var(--color-ink-secondary)] leading-relaxed max-w-2xl">
                {location.description}
              </p>
            </Reveal>

            <LocationInsideGallery
              images={location.images}
              locationName={location.name}
              cityName={city.name}
            />

            {/* Workspace types */}
            {location.workspaceTypes.length > 0 && (
              <Reveal>
                <h2 className="font-display text-2xl text-[var(--color-navy)] mb-5">
                  Workspaces available here
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {location.workspaceTypes.map((slug) => (
                    <div
                      key={slug}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-[var(--color-border)]"
                    >
                      <Building2 className="w-4 h-4 text-[var(--color-gold-deep)] shrink-0" strokeWidth={1.75} />
                      <span className="text-sm font-medium text-[var(--color-navy)]">
                        {WORKSPACE_LABELS[slug] ?? slug}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Amenities */}
            <Reveal>
              <h2 className="font-display text-2xl text-[var(--color-navy)] mb-5">
                Amenities at this centre
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenityList.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-alt)]"
                  >
                    <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-gold-50)] text-[var(--color-gold-deep)]">
                      <Check className="w-4 h-4" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-navy)] leading-tight">
                        {a.name}
                      </p>
                      {a.description && (
                        <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5 leading-snug">
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Operating hours + Nearby */}
            <Reveal>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="font-display text-xl text-[var(--color-navy)] mb-3 inline-flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[var(--color-gold-deep)]" strokeWidth={1.75} />
                    Operating hours
                  </h2>
                  <p className="text-[14.5px] text-[var(--color-ink-secondary)]">
                    {location.operatingHours}
                  </p>
                </div>

                {location.nearbyLandmarks.length > 0 && (
                  <div>
                    <h2 className="font-display text-xl text-[var(--color-navy)] mb-3 inline-flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[var(--color-gold-deep)]" strokeWidth={1.75} />
                      Nearby landmarks
                    </h2>
                    <ul className="space-y-1.5">
                      {location.nearbyLandmarks.map((lm) => (
                        <li
                          key={lm}
                          className="text-[13.5px] text-[var(--color-ink-secondary)] flex items-start gap-2"
                        >
                          <span className="mt-1.5 inline-block w-1 h-1 rounded-full bg-[var(--color-gold)] shrink-0" />
                          {lm}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Nearby facilities */}
            {location.nearbyFacilities.length > 0 && (
              <Reveal>
                <h2 className="font-display text-xl text-[var(--color-navy)] mb-4">
                  Around the building
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {location.nearbyFacilities.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white rounded-xl border border-[var(--color-border)] px-4 py-3"
                    >
                      <span className="text-xl" aria-hidden>
                        {f.icon}
                      </span>
                      <span className="text-[13.5px] text-[var(--color-ink-secondary)] leading-snug">
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Right - sticky sidebar */}
          <aside className="lg:w-[38%]">
            <div className="sticky top-32 flex flex-col gap-5">
              <GoogleMap
                query={location.address}
                title={`${location.name}, ${city.name}`}
                className="h-56 rounded-2xl overflow-hidden"
              />

              <div className="rounded-2xl bg-white border border-[var(--color-border)] p-6 flex flex-col gap-4 shadow-[var(--shadow-brand)]">
                <h2 className="font-display text-xl text-[var(--color-navy)]">Visit us</h2>

                <div className="flex items-start gap-3 text-[13.5px] text-[var(--color-ink-secondary)]">
                  <MapPin className="w-4 h-4 mt-0.5 text-[var(--color-gold-deep)] shrink-0" strokeWidth={2} />
                  <span className="leading-relaxed">{location.address}</span>
                </div>

                <a
                  href={`tel:${formatPhone(location.phone)}`}
                  className="flex items-center gap-3 text-[13.5px] text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--color-gold-deep)] shrink-0" strokeWidth={2} />
                  {location.phone}
                </a>

                <a
                  href={`mailto:${location.email}`}
                  className="flex items-center gap-3 text-[13.5px] text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--color-gold-deep)] shrink-0" strokeWidth={2} />
                  {location.email}
                </a>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/bookings"
                    className="inline-flex items-center justify-center gap-1.5 h-11 px-5 text-[14px] font-semibold rounded-full bg-[var(--color-gold)] text-[var(--color-navy-deep)] hover:bg-[var(--color-gold-deep)] hover:text-white transition-colors shadow-[var(--shadow-cta)]"
                  >
                    <CalendarCheck className="w-4 h-4" strokeWidth={2} />
                    Book this centre
                  </Link>

                  {gatePassUrl && (
                    <Link
                      href={gatePassUrl}
                      className="inline-flex items-center justify-center gap-1.5 h-11 px-5 text-[14px] font-semibold rounded-full border border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white transition-colors"
                    >
                      <Ticket className="w-4 h-4" strokeWidth={2} />
                      Request gate pass
                    </Link>
                  )}

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 h-11 px-5 text-[13.5px] font-semibold rounded-full text-[var(--color-navy)] hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    Get directions
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 h-11 px-5 text-[13.5px] font-semibold rounded-full text-[var(--color-navy)] hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    WhatsApp us
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
