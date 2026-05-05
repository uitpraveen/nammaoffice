"use client";

import { navigation } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DesktopNavProps {
  theme?: "light" | "dark";
}

/**
 * Flat horizontal nav for the floating pill. Each item gets an animated
 * gold underline that slides in from left on hover; the active route
 * shows a permanent underline.
 */
export function DesktopNav({ theme = "dark" }: DesktopNavProps) {
  const pathname = usePathname();
  const isLight = theme === "light";

  return (
    <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative px-3 py-2 text-[13px] font-medium transition-colors rounded-full",
              isLight
                ? isActive
                  ? "text-white"
                  : "text-white/80 hover:text-white"
                : isActive
                  ? "text-[var(--color-navy)]"
                  : "text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)]"
            )}
          >
            <span className="relative z-10">{item.label}</span>

            {/* Animated underline — slides in left-to-right on hover.
                Active route keeps it visible permanently. */}
            <span
              aria-hidden
              className={cn(
                "absolute left-3 right-3 bottom-1 h-[1.5px] origin-left transition-transform duration-200",
                isLight ? "bg-[var(--color-gold-300)]" : "bg-[var(--color-gold)]",
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
