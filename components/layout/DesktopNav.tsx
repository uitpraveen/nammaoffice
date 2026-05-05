"use client";

import { navigation } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Newspaper-masthead nav — Fraunces uppercase serif, generous letter
 * spacing, gold underline on the active route, gold underline that
 * slides in left-to-right on hover. Always renders white-on-black
 * inside the masthead bar.
 */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden lg:flex items-center gap-x-5 xl:gap-x-7"
      aria-label="Main navigation"
    >
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group relative inline-block py-1 whitespace-nowrap"
          >
            <span
              className={cn(
                "block font-[var(--font-serif)] text-[11.5px] uppercase tracking-[0.16em] font-medium",
                "transition-colors duration-200",
                isActive ? "text-[var(--color-gold)]" : "text-white/85 group-hover:text-white"
              )}
            >
              {item.label}
            </span>
            <span
              aria-hidden
              className={cn(
                "absolute left-0 right-0 -bottom-1 h-[1.5px] origin-left transition-transform duration-200",
                "bg-[var(--color-gold)]",
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
