import { cn } from "@/lib/utils";

interface KolamTextureProps {
  className?: string;
}

export function KolamTexture({ className }: KolamTextureProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none select-none",
        className
      )}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="kolam-pattern"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Outer diamond */}
          <path
            d="M30 4 L56 30 L30 56 L4 30 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Inner diamond */}
          <path
            d="M30 16 L44 30 L30 44 L16 30 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />
          {/* Center dot */}
          <circle cx="30" cy="30" r="2" fill="currentColor" />
          {/* Corner dots */}
          <circle cx="30" cy="4" r="1.5" fill="currentColor" />
          <circle cx="56" cy="30" r="1.5" fill="currentColor" />
          <circle cx="30" cy="56" r="1.5" fill="currentColor" />
          <circle cx="4" cy="30" r="1.5" fill="currentColor" />
          {/* Mid-edge lines */}
          <line x1="30" y1="4" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" />
          <line x1="56" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="0.5" />
          <line x1="30" y1="56" x2="30" y2="44" stroke="currentColor" strokeWidth="0.5" />
          <line x1="4" y1="30" x2="16" y2="30" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#kolam-pattern)"
        opacity="0.12"
      />
    </svg>
  );
}
