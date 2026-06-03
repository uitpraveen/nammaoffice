import type { Metadata } from "next";
import { cities, locations } from "@/lib/data/locations";
import { LocationsShowcase } from "@/components/sections/LocationsShowcase";

const totalCentres = locations.length;
const totalCities = cities.length;
const cityListAnd = cities
  .map((c) => c.name)
  .join(", ")
  .replace(/, ([^,]*)$/, " and $1");
const centreBreakdown = cities
  .map((c) => {
    const n = locations.filter((l) => l.city === c.slug).length;
    return `${c.name} (${n})`;
  })
  .join(", ");

export const metadata: Metadata = {
  alternates: { canonical: "/locations" },
  title: `All Locations - ${totalCentres} Centres Across ${cityListAnd}`,
  description: `NammaOffice has ${totalCentres} centres across ${totalCities} cities - ${centreBreakdown}. Find your nearest premium coworking space.`,
};

/**
 * /locations now reuses the LocationsShowcase bento that anchors the
 * home page (#centres). Same look, same data, just hides the loop-back
 * "View all centres" affordance and uses an "Our centres" eyebrow that
 * reads more naturally as a destination page than a teaser.
 */
export default function LocationsPage() {
  return <LocationsShowcase hideViewAll eyebrow="Our centres" />;
}
