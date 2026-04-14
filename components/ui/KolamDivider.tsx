import { cn } from "@/lib/utils";

interface KolamDividerProps {
  variant?: "light" | "dark";
  className?: string;
}

export function KolamDivider({
  variant = "light",
  className,
}: KolamDividerProps) {
  const color = variant === "light" ? "#E5DFD6" : "#FAF7F2";

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="40"
        viewBox="0 0 800 40"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`kolam-pattern-${variant}`}
            x="0"
            y="0"
            width="80"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            {/* Central dot */}
            <circle cx="40" cy="20" r="3" fill={color} />
            {/* Corner dots */}
            <circle cx="10" cy="10" r="2" fill={color} />
            <circle cx="70" cy="10" r="2" fill={color} />
            <circle cx="10" cy="30" r="2" fill={color} />
            <circle cx="70" cy="30" r="2" fill={color} />
            {/* Small accent dots */}
            <circle cx="40" cy="8" r="1.5" fill={color} />
            <circle cx="40" cy="32" r="1.5" fill={color} />
            <circle cx="22" cy="20" r="1.5" fill={color} />
            <circle cx="58" cy="20" r="1.5" fill={color} />
            {/* Curved paths connecting dots - top arc */}
            <path
              d="M10,10 Q25,3 40,8"
              stroke={color}
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M70,10 Q55,3 40,8"
              stroke={color}
              strokeWidth="0.8"
              fill="none"
            />
            {/* Bottom arcs */}
            <path
              d="M10,30 Q25,37 40,32"
              stroke={color}
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M70,30 Q55,37 40,32"
              stroke={color}
              strokeWidth="0.8"
              fill="none"
            />
            {/* Side lines */}
            <path
              d="M10,10 Q3,20 10,30"
              stroke={color}
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M70,10 Q77,20 70,30"
              stroke={color}
              strokeWidth="0.8"
              fill="none"
            />
            {/* Center cross */}
            <line
              x1="22"
              y1="20"
              x2="58"
              y2="20"
              stroke={color}
              strokeWidth="0.6"
            />
            <line
              x1="40"
              y1="8"
              x2="40"
              y2="32"
              stroke={color}
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect
          width="800"
          height="40"
          fill={`url(#kolam-pattern-${variant})`}
        />
      </svg>
    </div>
  );
}
