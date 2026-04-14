"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CityData {
  slug: string;
  name: string;
  tagline: string;
  centreCount: number;
  gradient: string;
}

interface LocationsSearchProps {
  cities: CityData[];
}

export default function LocationsSearch({ cities }: LocationsSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? cities.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          city.tagline.toLowerCase().includes(query.toLowerCase())
      )
    : cities;

  return (
    <div className="flex flex-col gap-10">
      {/* Search bar */}
      <div className="max-w-lg mx-auto w-full">
        <input
          type="text"
          placeholder="Search by city or area name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-5 py-3 rounded-brand border border-warm-border bg-white font-sans text-warm-charcoal placeholder-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta shadow-brand transition"
          aria-label="Search locations"
        />
      </div>

      {/* City cards */}
      {filtered.length === 0 ? (
        <p className="text-center text-warm-gray font-sans py-12">
          No cities match your search. Try &ldquo;Salem&rdquo; or &ldquo;Trichy&rdquo;.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {filtered.map((city) => (
            <div
              key={city.slug}
              className="flex flex-col sm:flex-row bg-white rounded-brand shadow-brand overflow-hidden hover:shadow-brand-hover transition-shadow duration-300"
            >
              {/* Gradient placeholder */}
              <div
                className={`bg-gradient-to-br ${city.gradient} h-48 sm:h-auto sm:w-64 flex-shrink-0 flex flex-col items-center justify-center gap-2 p-6`}
              >
                <span className="font-serif text-3xl text-white">{city.name}</span>
                <span className="font-sans text-sm text-white/70">
                  {city.centreCount} Centre{city.centreCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-center gap-4 flex-1">
                <h2 className="font-serif text-2xl text-warm-charcoal">{city.name}</h2>
                <p className="font-sans text-warm-gray text-base">{city.tagline}</p>
                <p className="font-sans text-warm-gray/70 text-sm">
                  {city.centreCount} coworking centre{city.centreCount !== 1 ? "s" : ""}
                </p>
                <div>
                  <Button href={`/locations/${city.slug}`} variant="primary" size="md">
                    View All Centres
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
