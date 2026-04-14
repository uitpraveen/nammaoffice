"use client";

import { useState } from "react";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { MasonryGrid } from "@/components/ui/MasonryGrid";
import { galleryImages, getGalleryByCity } from "@/lib/data/gallery";
import { cn } from "@/lib/utils";

type CityFilter = "all" | "salem" | "trichy" | "tirupur";

const filters: { value: CityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "salem", label: "Salem" },
  { value: "trichy", label: "Trichy" },
  { value: "tirupur", label: "Tirupur" },
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<CityFilter>("all");

  const images =
    activeFilter === "all"
      ? galleryImages
      : getGalleryByCity(activeFilter);

  return (
    <>
      <HeroBanner
        title="Our Spaces"
        subtitle="A visual tour of NammaOffice centres across Salem, Trichy, and Tirupur."
      />

      <section className="section-padding">
        <div className="content-width">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center" role="tablist" aria-label="Filter by city">
            {filters.map((filter) => (
              <button
                key={filter.value}
                role="tab"
                aria-selected={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "px-5 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200",
                  activeFilter === filter.value
                    ? "bg-terracotta text-white"
                    : "bg-sand text-warm-gray hover:bg-sand-300"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          {images.length > 0 ? (
            <MasonryGrid images={images} />
          ) : (
            <p className="text-center font-sans text-warm-gray py-12">
              No images found for this location.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
