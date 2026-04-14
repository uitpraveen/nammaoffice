"use client";

import { navigation } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DesktopNavProps {
  /** When true, render links in white (for transparent hero top-bar mode) */
  light?: boolean;
}

export function DesktopNav({ light = false }: DesktopNavProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => item.children && setOpenMenu(item.href)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link
              href={item.href}
              className={cn(
                // Base: uppercase, tracked, Montserrat sm/medium
                "relative flex items-center gap-1 px-3 py-2",
                "text-xs font-medium uppercase tracking-wider",
                "transition-colors duration-200",
                // Gold underline pseudo-element via after:
                "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5",
                "after:bg-terracotta after:transition-transform after:duration-300 after:origin-left",
                isActive
                  ? "after:scale-x-100"
                  : "after:scale-x-0 hover:after:scale-x-100",
                // Text color
                light
                  ? isActive
                    ? "text-terracotta-300"
                    : "text-white/90 hover:text-white"
                  : isActive
                    ? "text-terracotta"
                    : "text-warm-charcoal hover:text-warm-charcoal"
              )}
            >
              {item.label}
              {item.children && (
                <svg
                  className={cn(
                    "w-3 h-3 transition-transform duration-200",
                    openMenu === item.href ? "rotate-180" : ""
                  )}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>

            {item.children && openMenu === item.href && (
              <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-brand shadow-brand-hover border border-warm-border py-1.5 z-50">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "block px-4 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors duration-150",
                      pathname === child.href
                        ? "text-terracotta"
                        : "text-warm-charcoal hover:text-terracotta hover:bg-sand-100"
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
