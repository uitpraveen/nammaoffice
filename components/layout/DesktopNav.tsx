"use client";

import { navigation } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";
import { useActiveHref } from "@/lib/hooks/use-active-href";
import type { NavChild, NavItem } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Newspaper-masthead nav — Fraunces uppercase serif, generous letter
 * spacing. Active route is rendered bold + brick-gold; hover only
 * brightens the colour (no underline). Always white-on-black inside
 * the masthead bar.
 *
 * Hash-anchor items (`/#about`, `/#amenities`) are kept in sync via
 * the `useActiveHref` hook so they highlight when the URL hash points
 * at their target. The label text is rendered twice in each link: an
 * invisible always-bold copy reserves the slot width so toggling
 * between bold (active) and medium (idle) doesn't shift adjacent
 * items.
 *
 * Items with `children` render as a hover/focus dropdown panel.
 */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden lg:flex items-center gap-x-5 xl:gap-x-7"
      aria-label="Main navigation"
    >
      {navigation.map((item) =>
        item.children?.length ? (
          <NavDropdown key={item.href} item={item} pathname={pathname} />
        ) : (
          <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
        )
      )}
    </nav>
  );
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const isActive = useActiveHref(href, pathname);

  return (
    <Link
      href={href}
      className="group relative inline-block py-1 whitespace-nowrap"
      aria-current={isActive ? "page" : undefined}
    >
      <span
        aria-hidden
        className="block font-[var(--font-serif)] text-[11.5px] uppercase tracking-[0.16em] font-bold invisible"
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-[var(--font-serif)] text-[11.5px] uppercase tracking-[0.16em]",
          "transition-[color,font-weight] duration-200",
          isActive
            ? "text-[var(--color-gold)] font-bold"
            : "text-white/85 font-medium group-hover:text-white"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const children = item.children ?? [];
  const isParentActive =
    pathname === item.href ||
    pathname.startsWith(item.href + "/") ||
    children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        className="group relative inline-flex items-center gap-1 py-1 whitespace-nowrap"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          aria-hidden
          className="block font-[var(--font-serif)] text-[11.5px] uppercase tracking-[0.16em] font-bold invisible"
        >
          {item.label}
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-1 font-[var(--font-serif)] text-[11.5px] uppercase tracking-[0.16em]",
            "transition-[color,font-weight] duration-200",
            isParentActive
              ? "text-[var(--color-gold)] font-bold"
              : "text-white/85 font-medium group-hover:text-white"
          )}
        >
          {item.label}
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform duration-200 opacity-80",
              open && "rotate-180"
            )}
            strokeWidth={2.25}
          />
        </span>
      </button>

      <div
        id={menuId}
        role="menu"
        aria-label={item.label}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[240px] z-50",
          "transition-[opacity,transform] duration-150 origin-top",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        )}
      >
        <div className="relative rounded-xl bg-[var(--color-navy-deep,#0b0b0d)] border border-white/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
          <span
            aria-hidden
            className="absolute left-1/2 -top-[6px] -translate-x-1/2 w-3 h-3 rotate-45 bg-[var(--color-navy-deep,#0b0b0d)] border-l border-t border-white/10"
          />
          <ul className="py-1.5">
            {children.map((child) => (
              <li key={child.href}>
                <DropdownChild child={child} pathname={pathname} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DropdownChild({ child, pathname }: { child: NavChild; pathname: string }) {
  const isActive = useActiveHref(child.href, pathname);
  return (
    <Link
      href={child.href}
      role="menuitem"
      className={cn(
        "group/item relative flex items-center justify-between px-5 py-2.5",
        "font-[var(--font-serif)] text-[12px] uppercase tracking-[0.16em] transition-colors",
        isActive
          ? "text-[var(--color-gold)] font-bold"
          : "text-white/80 font-medium hover:text-white"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-[var(--color-gold)] transition-opacity duration-200",
          isActive ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"
        )}
      />
      {child.label}
      <span
        aria-hidden
        className={cn(
          "text-[var(--color-gold)] text-[14px] transition-all duration-200",
          isActive
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0"
        )}
      >
        →
      </span>
    </Link>
  );
}
