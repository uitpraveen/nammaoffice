"use client";

import { navigation } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface DesktopNavProps {
  light?: boolean;
}

export function DesktopNav({ light = false }: DesktopNavProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = useCallback((href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(href);
  }, []);

  const handleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Close on route change
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          pathname.startsWith(item.href + "/") ||
          item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => item.children && handleOpen(item.href)}
            onMouseLeave={handleClose}
          >
            {/* Nav link */}
            <Link
              href={item.href}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2.5",
                "text-[13px] font-semibold uppercase tracking-[0.12em]",
                "transition-colors duration-200",
                // Gold underline
                "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px]",
                "after:bg-terracotta after:transition-transform after:duration-300 after:origin-left",
                isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
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

            {/* Mega dropdown */}
            {item.children && openMenu === item.href && (
              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50",
                  "bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-warm-border/60",
                  "animate-fade-in-up",
                  // Width based on number of children
                  item.children.length > 3 ? "w-[560px]" : "w-[340px]"
                )}
              >
                {/* Header */}
                <div className="px-6 pt-5 pb-3 border-b border-warm-border/40">
                  <Link
                    href={item.href}
                    className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-gray hover:text-terracotta transition-colors"
                  >
                    View All {item.label} &rarr;
                  </Link>
                </div>

                {/* Items grid */}
                <div
                  className={cn(
                    "p-4 gap-1",
                    item.children.length > 3
                      ? "grid grid-cols-2"
                      : "flex flex-col"
                  )}
                >
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/");
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "group flex flex-col gap-1 px-4 py-3.5 rounded-xl transition-all duration-200",
                          isChildActive
                            ? "bg-terracotta/5"
                            : "hover:bg-sand-100"
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors duration-200",
                            isChildActive
                              ? "text-terracotta"
                              : "text-warm-charcoal group-hover:text-terracotta"
                          )}
                        >
                          {child.label}
                        </span>
                        <span className="text-xs leading-relaxed text-warm-gray/80">
                          {child.description}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
