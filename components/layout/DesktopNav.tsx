"use client";

import { navigation } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronDown,
  MapPin,
  Ticket,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase,
  Building2,
  CalendarCheck,
  MapPin,
  Ticket,
  UserPlus,
};

interface DesktopNavProps {
  theme?: "light" | "dark";
}

/** Width + grid classes for the dropdown panel based on number of items. */
function panelLayout(count: number) {
  if (count >= 6) return { width: "w-[820px]", grid: "grid grid-cols-3 gap-1" };
  if (count > 3) return { width: "w-[640px]", grid: "grid grid-cols-2 gap-1" };
  return { width: "w-[360px]", grid: "flex flex-col gap-1" };
}

export function DesktopNav({ theme = "dark" }: DesktopNavProps) {
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
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // Close any open menu when the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenMenu(null);
  }, [pathname]);

  const isLight = theme === "light";

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          pathname.startsWith(item.href + "/") ||
          item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

        const layout = item.children ? panelLayout(item.children.length) : null;

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
                "flex items-center gap-1 h-[68px] px-3 text-[13.5px] font-medium transition-colors",
                isLight
                  ? isActive
                    ? "text-white"
                    : "text-white/85 hover:text-white"
                  : isActive
                    ? "text-[var(--color-gold-deep)]"
                    : "text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)]"
              )}
            >
              {item.label}
              {item.children && (
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200 opacity-70",
                    openMenu === item.href && "rotate-180 opacity-100"
                  )}
                  strokeWidth={2.25}
                />
              )}
            </Link>

            {/* Active underline indicator — gold */}
            {isActive && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-3 right-3 bottom-0 h-[2px]",
                  isLight ? "bg-[var(--color-gold-300)]" : "bg-[var(--color-gold)]"
                )}
              />
            )}

            {item.children && layout && openMenu === item.href && (
              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 z-50",
                  layout.width
                )}
              >
                <div className="mt-1 bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(14,14,16,0.28),0_0_0_1px_rgba(14,14,16,0.08)] overflow-hidden">
                  <div className={cn("p-2", layout.grid)}>
                    {item.children.map((child) => {
                      const Icon: LucideIcon =
                        (child.icon ? ICON_MAP[child.icon] : undefined) ?? MapPin;
                      const isChildActive =
                        pathname === child.href || pathname.startsWith(child.href + "/");
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors",
                            isChildActive
                              ? "bg-[var(--color-gold-50)]"
                              : "hover:bg-[var(--color-surface-alt)]"
                          )}
                        >
                          <span
                            className={cn(
                              "shrink-0 mt-0.5 inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                              isChildActive
                                ? "bg-[var(--color-gold)] text-[var(--color-navy-deep)]"
                                : "bg-[var(--color-surface-alt)] text-[var(--color-navy)] group-hover:bg-[var(--color-navy)] group-hover:text-white"
                            )}
                          >
                            <Icon className="w-4 h-4" strokeWidth={1.75} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-2">
                              <span className="text-[14px] font-semibold leading-tight text-[var(--color-navy)]">
                                {child.label}
                              </span>
                              {child.cityTag && (
                                <span className="inline-flex items-center text-[10.5px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded bg-[var(--color-navy)]/8 text-[var(--color-navy)]">
                                  {child.cityTag}
                                </span>
                              )}
                            </span>
                            <span className="block text-[12.5px] text-[var(--color-ink-secondary)] mt-0.5 truncate">
                              {child.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="px-4 py-3 bg-[var(--color-surface-alt)] border-t border-[var(--color-border)]">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-navy)] hover:text-[var(--color-gold-deep)] transition-colors"
                    >
                      View all {item.label.toLowerCase()}
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
