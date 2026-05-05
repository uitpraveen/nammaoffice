"use client";

import { navigation } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Armchair,
  ArrowRight,
  Building2,
  ChevronDown,
  DoorClosed,
  FileSignature,
  Handshake,
  HelpCircle,
  Images,
  Mail,
  MapPin,
  PanelsTopLeft,
  Plane,
  Presentation,
  Sofa,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Armchair,
  Building2,
  DoorClosed,
  FileSignature,
  Handshake,
  HelpCircle,
  Images,
  Mail,
  MapPin,
  PanelsTopLeft,
  Plane,
  Presentation,
  Sofa,
  Sparkles,
};

interface DesktopNavProps {
  theme?: "light" | "dark";
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

  useEffect(() => {
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
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]"
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

            {/* Active underline indicator */}
            {isActive && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-3 right-3 bottom-0 h-[2px]",
                  isLight ? "bg-[var(--color-accent-300)]" : "bg-[var(--color-accent)]"
                )}
              />
            )}

            {item.children && openMenu === item.href && (
              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 z-50",
                  item.children.length > 3 ? "w-[640px]" : "w-[340px]"
                )}
              >
                <div className="mt-1 bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(10,10,10,0.25),0_0_0_1px_rgba(10,10,10,0.04)] overflow-hidden">
                  <div
                    className={cn(
                      "p-2",
                      item.children.length > 3 ? "grid grid-cols-2 gap-1" : "flex flex-col gap-1"
                    )}
                  >
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
                              ? "bg-[var(--color-accent-50)]"
                              : "hover:bg-[var(--color-surface-alt)]"
                          )}
                        >
                          <span
                            className={cn(
                              "shrink-0 mt-0.5 inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                              isChildActive
                                ? "bg-[var(--color-accent)] text-white"
                                : "bg-[var(--color-surface-alt)] text-[var(--color-ink-secondary)] group-hover:bg-white group-hover:text-[var(--color-accent)]"
                            )}
                          >
                            <Icon className="w-4 h-4" strokeWidth={1.75} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[14px] font-semibold leading-tight text-[var(--color-ink)]">
                              {child.label}
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
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
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
