import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className
      )}
    >
      <h2
        className={cn(
          "font-serif text-3xl md:text-4xl lg:text-5xl text-warm-charcoal leading-tight"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-warm-gray font-sans text-base md:text-lg max-w-2xl",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
