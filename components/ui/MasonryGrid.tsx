"use client";

import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { Lightbox } from "./Lightbox";

interface MasonryImage {
  src: string;
  alt: string;
  location?: string;
}

interface MasonryGridProps {
  images: MasonryImage[];
}

function MasonryItem({
  image,
  index,
  onClick,
}: {
  image: MasonryImage;
  index: number;
  onClick: () => void;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const delay = (index % 6) * 100;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "relative overflow-hidden rounded-brand cursor-pointer group mb-3",
        "transition-all duration-700 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      aria-label={`View ${image.alt}`}
    >
      <div className="relative w-full aspect-[3/4]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      {image.location && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <span className="px-4 py-3 text-white font-sans text-sm font-medium">
            {image.location}
          </span>
        </div>
      )}
    </div>
  );
}

export function MasonryGrid({ images }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
        {images.map((image, index) => (
          <MasonryItem
            key={index}
            image={image}
            index={index}
            onClick={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
