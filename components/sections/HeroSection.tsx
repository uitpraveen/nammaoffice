"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { KolamDivider } from "@/components/ui/KolamDivider";
import { cities } from "@/lib/data/locations";
import { workspaces } from "@/lib/data/workspaces";
import { BRAND } from "@/lib/constants";

export function HeroSection() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");

  function handleExplore() {
    if (selectedCity && selectedWorkspace) {
      router.push(`/workspaces/${selectedWorkspace}?city=${selectedCity}`);
    } else if (selectedCity) {
      router.push(`/locations/${selectedCity}`);
    } else if (selectedWorkspace) {
      router.push(`/workspaces/${selectedWorkspace}`);
    } else {
      router.push("/workspaces");
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-warm-charcoal via-terracotta-800 to-olive-800">
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 content-width w-full flex flex-col items-center text-center gap-8 py-24">
        <div className="flex flex-col gap-4 max-w-4xl">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
            {BRAND.tagline}
          </h1>
          <p className="font-sans text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Premium coworking spaces across Salem, Trichy &amp; Tirupur — for
            freelancers, startups, and growing teams.
          </p>
        </div>

        {/* Selector row */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-brand p-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="flex-1 px-4 py-3 rounded-brand bg-white text-warm-charcoal font-sans text-base focus:outline-none focus:ring-2 focus:ring-terracotta cursor-pointer"
            aria-label="Select City"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>

          <select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="flex-1 px-4 py-3 rounded-brand bg-white text-warm-charcoal font-sans text-base focus:outline-none focus:ring-2 focus:ring-terracotta cursor-pointer"
            aria-label="Select Workspace Type"
          >
            <option value="">All Workspace Types</option>
            {workspaces.map((ws) => (
              <option key={ws.slug} value={ws.slug}>
                {ws.name}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="md"
            onClick={handleExplore}
            className="whitespace-nowrap"
          >
            Explore
          </Button>
        </div>

        {/* CTA hint */}
        <p className="text-white/60 text-sm font-sans">
          7+ centres · 3 cities · Flexible plans from daily to annual
        </p>
      </div>

      {/* Kolam divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <KolamDivider variant="dark" />
      </div>
    </section>
  );
}
