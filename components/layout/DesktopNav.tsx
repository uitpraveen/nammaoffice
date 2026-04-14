"use client";

import { navigation } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function DesktopNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = useCallback((href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(href);
  }, []);

  const handleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }, []);

  useEffect(() => {
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  useEffect(() => { setOpenMenu(null); }, [pathname]);

  return (
    <nav className="hidden lg:flex items-center gap-0" aria-label="Main navigation">
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
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-1 px-4 py-6 text-[14px] font-semibold transition-colors duration-200",
                isActive
                  ? "text-terracotta"
                  : "text-warm-charcoal/80 hover:text-terracotta"
              )}
            >
              {item.label}
              {item.children && (
                <svg
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200 opacity-50",
                    openMenu === item.href && "rotate-180 opacity-100"
                  )}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              )}
            </Link>

            {/* Dropdown */}
            {item.children && openMenu === item.href && (
              <>
                {/* Active indicator line */}
                <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-terracotta" />

                {/* Dropdown panel */}
                <div
                  className={cn(
                    "absolute top-full left-1/2 -translate-x-1/2 pt-0 z-50",
                    item.children.length > 3 ? "w-[580px]" : "w-[320px]"
                  )}
                >
                  <div className="mt-0 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-warm-border/50 overflow-hidden">
                    {/* Dropdown header */}
                    <div className="px-5 py-3 bg-sand-50 border-b border-warm-border/40">
                      <Link
                        href={item.href}
                        className="text-[12px] font-bold uppercase tracking-[0.15em] text-warm-gray hover:text-terracotta transition-colors inline-flex items-center gap-1.5"
                      >
                        All {item.label}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>

                    {/* Items */}
                    <div className={cn(
                      "p-3",
                      item.children.length > 3 ? "grid grid-cols-2 gap-0" : "flex flex-col"
                    )}>
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "group flex flex-col gap-0.5 px-4 py-3 rounded-lg transition-all duration-150",
                              isChildActive ? "bg-terracotta/5" : "hover:bg-sand-50"
                            )}
                          >
                            <span className={cn(
                              "text-[14px] font-semibold transition-colors",
                              isChildActive ? "text-terracotta" : "text-warm-charcoal group-hover:text-terracotta"
                            )}>
                              {child.label}
                            </span>
                            <span className="text-[12px] leading-relaxed text-warm-gray/70 line-clamp-1">
                              {child.description}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
