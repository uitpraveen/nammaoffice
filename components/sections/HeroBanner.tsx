import { cn } from "@/lib/utils";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  backgroundImage?: string;
  className?: string;
  /** Show a soft gold accent dot above the title (decorative only). */
  decorated?: boolean;
}

export function HeroBanner({
  title,
  subtitle,
  eyebrow,
  backgroundImage,
  className,
  decorated = true,
}: HeroBannerProps) {
  return (
    <section
      className={cn(
        "relative h-[340px] md:h-[400px] flex items-center justify-center overflow-hidden",
        "bg-[var(--color-navy-deep)]",
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
      {/* Soft gold radial glow + dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 70% 20%, rgba(184,85,58,0.16), transparent 55%)",
        }}
      />
      {backgroundImage && <div className="absolute inset-0 bg-[var(--color-navy-deep)]/65" aria-hidden="true" />}

      <div className="relative z-10 content-width w-full flex flex-col items-center text-center gap-3">
        {decorated && (
          <span
            className="block w-10 h-[2px] bg-[var(--color-gold)] rounded-full"
            aria-hidden="true"
          />
        )}
        {eyebrow && (
          <p className="eyebrow !text-[var(--color-gold-300)]">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white leading-tight max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
