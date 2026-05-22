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
        "relative overflow-hidden bg-[var(--color-navy-deep)]",
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
      {/* Soft brick glow tucked top-right, plus a subtle gold underline accent
          along the bottom edge so the band visually rhymes with the navbar. */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 85% -10%, rgba(184,85,58,0.22), transparent 50%)",
        }}
      />
      {backgroundImage && (
        <div className="absolute inset-0 bg-[var(--color-navy-deep)]/70" aria-hidden="true" />
      )}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-300)]/40 to-transparent"
      />

      {/* Compact two-line layout. Decorative tick rendered inline next to
          the eyebrow so we don't burn vertical space on a separate row.
          Top nav clearance is already handled by Header's 112px spacer on
          non-home routes, so we only need a small breathing pad here. */}
      <div className="relative z-10 content-width py-10 md:py-12">
        <div className="flex flex-col gap-2.5 max-w-3xl">
          {(decorated || eyebrow) && (
            <div className="flex items-center gap-3">
              {decorated && (
                <span
                  aria-hidden
                  className="block w-6 h-[2px] bg-[var(--color-gold)] rounded-full"
                />
              )}
              {eyebrow && (
                <p className="eyebrow !text-[var(--color-gold-300)]">{eyebrow}</p>
              )}
            </div>
          )}
          <h1 className="font-display text-[28px] sm:text-3xl md:text-4xl text-white leading-[1.15] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[14.5px] md:text-[15.5px] text-white/70 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
