import { cn } from "@/lib/utils";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

export function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  className,
}: HeroBannerProps) {
  return (
    <section
      className={cn(
        "relative h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-warm-charcoal via-terracotta-700 to-olive-700",
        className
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 content-width w-full flex flex-col items-center text-center gap-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-lg text-white/80 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
