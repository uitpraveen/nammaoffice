"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

interface MosaicImage {
  src: string;
  alt: string;
}

interface ImageMosaicProps {
  images: MosaicImage[];
}

export function ImageMosaic({ images }: ImageMosaicProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const MAX_VISIBLE = 4;
  const visibleImages = images.slice(0, MAX_VISIBLE);
  const extraCount = images.length - MAX_VISIBLE;

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 gap-2 h-80 md:h-96">
        {visibleImages.map((img, index) => {
          const isFirst = index === 0;
          const isLastVisible = index === MAX_VISIBLE - 1;
          const showOverlay = isLastVisible && extraCount > 0;

          return (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden rounded-brand cursor-pointer group",
                isFirst ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              )}
              onClick={() => setLightboxIndex(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setLightboxIndex(index);
              }}
              aria-label={`View ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes={
                  isFirst
                    ? "(max-width: 768px) 66vw, 50vw"
                    : "(max-width: 768px) 33vw, 25vw"
                }
              />
              {showOverlay && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-sans font-semibold text-xl">
                    +{extraCount} more
                  </span>
                </div>
              )}
            </div>
          );
        })}
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
