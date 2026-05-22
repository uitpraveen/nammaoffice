"use client";

import { BRAND } from "@/lib/constants";
import { cities, locations } from "@/lib/data/locations";
import { navigation } from "@/lib/data/navigation";
import { cn, formatPhone } from "@/lib/utils";
import { useActiveHref } from "@/lib/hooks/use-active-href";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronDown,
  FileText,
  LifeBuoy,
  Mail,
  MapPin,
  Menu,
  Phone,
  Star,
  TicketCheck,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";

// Icon registry for nav-child icon strings. Add new entries here when a
// navigation.ts entry introduces a new `icon` value.
const NAV_ICONS: Record<string, LucideIcon> = {
  Building2,
  UserPlus,
  Briefcase,
  CalendarCheck,
  TicketCheck,
  LifeBuoy,
};
const DEFAULT_NAV_ICON: LucideIcon = FileText;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="11" rx="0.5" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.17 8.44 9.93v-7.02H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.09 22 12.07z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.13-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14c.5-1.88.5-5.81.5-5.81s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}
import type { NavChild, NavItem } from "@/lib/types";

/**
 * Header v8 — Elevate-style dual-tier light navbar.
 *
 *   Row 1 (utility strip, 36px): dark ink band with rating, hours, centres,
 *                                 phone, email, language toggle.
 *   Row 2 (main nav, 76→64px):  white-glass card under the strip with logo,
 *                                 nav items, Reserve-a-Tour CTA. Shrinks on
 *                                 scroll. A shared-layout brick underline
 *                                 morphs between active items.
 *   Mobile:                      utility strip stays, main row collapses to
 *                                 logo + hamburger. Full-screen cream
 *                                 overlay menu.
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /**
   * SmoothScroll attaches a *document* capture-phase click listener that
   * calls `stopImmediatePropagation()` once it identifies a hash anchor,
   * which prevents React's `onClick` (where we'd normally close the
   * overlay) from ever firing. A *window* capture-phase listener runs
   * before document-capture, so we close the overlay there for any
   * anchor click inside the overlay — hash or otherwise.
   */
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a[href]");
      if (!anchor) return;
      if (!overlayRef.current?.contains(anchor)) return;
      setOpen(false);
    };
    window.addEventListener("click", close, { capture: true });
    return () => window.removeEventListener("click", close, { capture: true });
  }, [open]);

  // Close overlay on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top utility strip */}
      <div
        className="fixed top-0 inset-x-0 z-50 h-9 text-[12px]"
        style={{ background: "var(--ink-band)", color: "rgba(255,255,255,0.78)" }}
      >
        <div className="content-width h-full flex items-center justify-between">
          <div className="flex items-center divide-x divide-white/10">
            <div className="flex items-center gap-2 pr-3 whitespace-nowrap">
              <span className="relative flex w-1.5 h-1.5">
                <span
                  className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping"
                  style={{ background: "var(--accent-soft)" }}
                />
                <span
                  className="relative inline-flex w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--accent-soft)" }}
                />
              </span>
              <span>Open now</span>
            </div>
            <a
              href={BRAND.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="See our 4.9 Google reviews"
              className="hidden md:flex items-center gap-1.5 px-3 whitespace-nowrap hover:text-white transition-colors"
            >
              <Star
                className="w-3 h-3"
                strokeWidth={0}
                style={{ fill: "var(--accent-soft)" }}
              />
              <span>
                <span className="text-white font-semibold">4.9</span>
                <span className="opacity-60"> · 500+ Members</span>
              </span>
            </a>
            <div className="hidden lg:flex items-center gap-1.5 px-3 whitespace-nowrap">
              <MapPin className="w-3 h-3" strokeWidth={1.75} />
              <span>{locations.length} centres · {cities.length} cities</span>
            </div>
            <Link
              href="/contact?intent=tour"
              className="hidden xl:flex items-center gap-1.5 px-3 whitespace-nowrap hover:text-white transition-colors"
            >
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] uppercase tracking-[0.12em] font-semibold"
                style={{
                  background: "rgba(184, 85, 58, 0.18)",
                  color: "var(--accent-soft)",
                  border: "1px solid rgba(184, 85, 58, 0.3)",
                }}
              >
                New
              </span>
              <span>Book a free centre tour · 30 mins</span>
            </Link>
          </div>
          <div className="flex items-center divide-x divide-white/10">
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="hidden sm:flex items-center gap-1.5 px-3 whitespace-nowrap hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" strokeWidth={1.75} />
              <span className="mono">{BRAND.phone}</span>
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="hidden md:flex items-center gap-1.5 px-3 whitespace-nowrap hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3" strokeWidth={1.75} />
              <span>{BRAND.email}</span>
            </a>
            <div className="flex items-center gap-2 pl-3">
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={BRAND.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-white transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hidden sm:inline-flex hover:text-white transition-colors"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={BRAND.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hidden sm:inline-flex hover:text-white transition-colors"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main solid nav — charcoal with traveling neon border */}
      <header
        className="nav-neon-border fixed left-0 right-0 z-40 transition-all duration-300"
        style={{
          top: 36,
          background: "rgba(26,26,26,0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,0.4), 0 8px 24px -16px rgba(0,0,0,0.5)"
            : "none",
        }}
      >
        <div className="content-width">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              scrolled ? "h-[64px]" : "h-[76px]"
            )}
          >
            {/* Logo */}
            <Link href="/" className="inline-flex items-center shrink-0" aria-label="NammaOffice — home">
              <Image
                src="/images/logo.png"
                alt="NammaOffice"
                width={1000}
                height={137}
                priority
                className="h-7 md:h-8 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>

            {/* Center nav */}
            <nav className="hidden lg:flex items-center h-full" aria-label="Main navigation">
              {navigation.map((item) =>
                item.children?.length ? (
                  <NavDropdown key={item.href} item={item} pathname={pathname} />
                ) : (
                  <NavLink key={item.href} item={item} pathname={pathname} />
                )
              )}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/contact?intent=tour"
                className="btn-glow-border hidden md:inline-flex items-center gap-1.5 h-10 px-5 text-[13px] font-semibold text-white rounded-md"
              >
                <span className="inline-flex items-center gap-1.5">
                  Book Now
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                </span>
              </Link>
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden w-11 h-11 rounded-md flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                }}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay — charcoal sheet, numbered nav, brick accent */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: "#0E0E0E", color: "#fff" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-6 h-[64px] shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Link href="/" className="inline-flex items-center" aria-label="NammaOffice — home">
                <Image
                  src="/images/logo.png"
                  alt="NammaOffice"
                  width={1000}
                  height={137}
                  className="h-7 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-md flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#fff",
                }}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 pt-7 pb-8">
              {(() => {
                // Group nav into primary (frequent paths) and services
                // (lower-frequency conversion paths) so the mobile menu
                // reads as 5 + 3 instead of one 8-row stack. Pure presentation
                // — desktop nav still iterates the same `navigation` array.
                const primaryHrefs = new Set([
                  "/",
                  "/#about",
                  "/locations",
                  "/#amenities",
                  "/contact",
                ]);
                const primary = navigation.filter((n) =>
                  primaryHrefs.has(n.href)
                );
                const services = navigation.filter(
                  (n) => !primaryHrefs.has(n.href)
                );
                return (
                  <>
                    <p
                      className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      Navigation
                    </p>
                    <div
                      className="flex flex-col"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {primary.map((item, i) => (
                        <MobileMenuRow
                          key={item.href}
                          item={item}
                          pathname={pathname}
                          index={i}
                        />
                      ))}
                    </div>
                    {services.length > 0 && (
                      <>
                        <p
                          className="text-[10.5px] font-bold uppercase tracking-[0.18em] mt-9 mb-2"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          Services
                        </p>
                        <div
                          className="flex flex-col"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {services.map((item, i) => (
                            <MobileMenuRow
                              key={item.href}
                              item={item}
                              pathname={pathname}
                              index={primary.length + i}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}

              <p
                className="text-[10.5px] font-bold uppercase tracking-[0.18em] mt-9 mb-3"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Get in touch
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${formatPhone(BRAND.phone)}`}
                  className="flex items-center gap-2.5 text-[14px]"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  <Phone className="w-4 h-4" strokeWidth={1.75} style={{ color: "var(--accent-soft)" }} />
                  <span className="mono">{BRAND.phone}</span>
                </a>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-2.5 text-[14px]"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  <Mail className="w-4 h-4" strokeWidth={1.75} style={{ color: "var(--accent-soft)" }} />
                  <span>{BRAND.email}</span>
                </a>
                <div className="flex items-center gap-3 mt-3">
                  <a
                    href={BRAND.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-md flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={BRAND.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-md flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={BRAND.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-md flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={BRAND.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-md flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div
              className="px-6 pt-4 pb-6 shrink-0"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "#0E0E0E",
              }}
            >
              <Link
                href="/contact?intent=tour"
                className="btn-glow-border inline-flex w-full items-center justify-center gap-2 h-12 rounded-md text-[14px] font-semibold text-white"
              >
                <span className="inline-flex items-center gap-2">
                  Book Now <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for non-home pages — utility strip (36) + nav (76 expanded). */}
      {!isHome && <div className="h-[112px]" aria-hidden />}
    </>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = useActiveHref(item.href, pathname);
  return (
    <Link
      href={item.href}
      className="relative h-full flex items-center px-3 xl:px-4 text-[12.5px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-colors"
      style={{ color: isActive ? "var(--accent)" : "rgba(255,255,255,0.65)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.65)";
        else e.currentTarget.style.color = "var(--accent)";
      }}
    >
      {item.label}
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="relative h-full flex items-center gap-1.5 px-3 xl:px-4 text-[12.5px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-colors"
        style={{ color: isParentActive ? "var(--accent)" : "rgba(255,255,255,0.65)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => {
          if (!isParentActive) e.currentTarget.style.color = "rgba(255,255,255,0.65)";
          else e.currentTarget.style.color = "var(--accent)";
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "w-3 h-3 opacity-70 transition-transform duration-200",
            open && "rotate-180"
          )}
          strokeWidth={2.5}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full pt-1 w-[240px] z-50"
          >
            <div
              className="rounded-xl overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55),0_8px_20px_-12px_rgba(0,0,0,0.35)]"
              style={{
                background: "rgba(20,20,22,0.98)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              role="menu"
            >
              <div className="p-1.5">
                {children.map((child) => (
                  <DropdownChild
                    key={child.href}
                    child={child}
                    pathname={pathname}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownChild({
  child,
  pathname,
  onSelect,
}: {
  child: NavChild;
  pathname: string;
  onSelect: () => void;
}) {
  const isActive = useActiveHref(child.href, pathname);
  const Icon = (child.icon && NAV_ICONS[child.icon]) || DEFAULT_NAV_ICON;
  return (
    <Link
      href={child.href}
      role="menuitem"
      onClick={onSelect}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 group/item transition-colors"
      style={{ background: isActive ? "rgba(184,85,58,0.18)" : "transparent" }}
      onMouseEnter={(e) =>
        !isActive && (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = isActive ? "rgba(184,85,58,0.18)" : "transparent")
      }
    >
      <span
        className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
        style={{
          background: isActive ? "var(--accent)" : "rgba(255,255,255,0.08)",
          color: isActive ? "#fff" : "var(--accent-soft)",
        }}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      </span>
      <span
        className="flex-1 text-[13px] font-semibold leading-tight"
        style={{ color: isActive ? "var(--accent-soft)" : "rgba(255,255,255,0.85)" }}
      >
        {child.label}
      </span>
      <ArrowUpRight
        className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all"
        style={{ color: "var(--accent-soft)" }}
        strokeWidth={2}
      />
    </Link>
  );
}

function MobileMenuRow({
  item,
  pathname,
  index,
}: {
  item: NavItem;
  pathname: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  // useActiveHref handles hash anchors (`/#about`, `/#amenities`) and
  // subscribes to hashchange/popstate so scroll-spy updates re-light
  // the right row. Combined with a children-path check for dropdowns.
  const isHrefActive = useActiveHref(item.href, pathname);
  const hasActiveChild = !!item.children?.some(
    (c) => pathname === c.href || pathname.startsWith(c.href + "/")
  );
  const isActive = isHrefActive || hasActiveChild;

  const num = String(index + 1).padStart(2, "0");
  const rowBorder = { borderBottom: "1px solid rgba(255,255,255,0.08)" };
  const numColor = isActive ? "var(--accent-soft)" : "rgba(255,255,255,0.35)";
  const labelColor = isActive ? "#fff" : "rgba(255,255,255,0.92)";

  if (item.children?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 + index * 0.035, duration: 0.32 }}
        style={rowBorder}
      >
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-left py-4 flex items-center justify-between gap-4"
          aria-expanded={expanded}
        >
          <span className="flex items-baseline gap-3">
            <span
              className="text-[11px] font-mono tabular-nums tracking-wider"
              style={{ color: numColor }}
            >
              {num}
            </span>
            <span
              className="text-[20px] font-bold uppercase tracking-[0.04em]"
              style={{ color: labelColor }}
            >
              {item.label}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              expanded && "rotate-180"
            )}
            style={{ color: "rgba(255,255,255,0.5)" }}
            strokeWidth={2}
          />
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div
                className="pb-4 pl-9 space-y-1 -mt-1"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", marginLeft: "0.7rem" }}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-2 text-[14px]"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.035, duration: 0.32 }}
      style={rowBorder}
    >
      <Link
        href={item.href}
        className="py-4 flex items-center justify-between gap-4"
      >
        <span className="flex items-baseline gap-3">
          <span
            className="text-[11px] font-mono tabular-nums tracking-wider"
            style={{ color: numColor }}
          >
            {num}
          </span>
          <span
            className="text-[20px] font-bold uppercase tracking-[0.04em]"
            style={{ color: labelColor }}
          >
            {item.label}
          </span>
        </span>
        <ArrowUpRight
          className="w-4 h-4"
          style={{ color: isActive ? "var(--accent-soft)" : "rgba(255,255,255,0.5)" }}
          strokeWidth={2}
        />
      </Link>
    </motion.div>
  );
}
