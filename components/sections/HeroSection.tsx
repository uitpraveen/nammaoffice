"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#2D2926] to-[#1a1a1a] -mt-[112px] pt-[112px]">
      {/* Subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(124,45,62,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(45,41,38,0.3),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 content-width w-full flex flex-col items-center text-center gap-10 py-20">
        <div className="flex flex-col gap-5 max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[56px] text-white leading-[1.15] font-bold">
            {BRAND.tagline}
          </h1>
          <p className="font-sans text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Premium coworking spaces across Salem, Trichy &amp; Tirupur — for
            freelancers, startups, and growing teams.
          </p>
        </div>

        {/* Selector row */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl p-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="flex-1 px-4 py-3.5 rounded-lg bg-white text-warm-charcoal font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-terracotta cursor-pointer"
            aria-label="Select City"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>{city.name}</option>
            ))}
          </select>

          <select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="flex-1 px-4 py-3.5 rounded-lg bg-white text-warm-charcoal font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-terracotta cursor-pointer"
            aria-label="Select Workspace Type"
          >
            <option value="">All Workspace Types</option>
            {workspaces.map((ws) => (
              <option key={ws.slug} value={ws.slug}>{ws.name}</option>
            ))}
          </select>

          <button
            onClick={handleExplore}
            className="px-8 py-3.5 bg-terracotta text-white text-[15px] font-semibold rounded-lg hover:bg-terracotta-600 transition-colors whitespace-nowrap"
          >
            Explore
          </button>
        </div>

        {/* Stats hint */}
        <div className="flex items-center gap-6 text-white/50 text-sm font-sans">
          <span>7+ Centres</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>3 Cities</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>Flexible Plans</span>
        </div>
      </div>
    </section>
  );
}
