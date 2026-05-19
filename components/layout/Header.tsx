"use client";

import { BRAND } from "@/lib/constants";
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
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
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
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-5 lg:px-10">
          <div className="flex items-center divide-x divide-white/10">
            <div className="flex items-center gap-2 pr-4">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-soft)" }} />
              <span>Open now</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-4">
              <Clock className="w-3 h-3" strokeWidth={1.75} />
              <span>Mon–Sat · 8 AM – 9 PM</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-4">
              <MapPin className="w-3 h-3" strokeWidth={1.75} />
              <span>10 centres · 5 cities</span>
            </div>
          </div>
          <div className="flex items-center divide-x divide-white/10">
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="hidden sm:flex items-center gap-1.5 px-4 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" strokeWidth={1.75} />
              <span className="mono">{BRAND.phone}</span>
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="hidden md:flex items-center gap-1.5 px-4 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3" strokeWidth={1.75} />
              <span>{BRAND.email}</span>
            </a>
            <button className="pl-4 hover:text-white transition-colors">EN</button>
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
        <div className="max-w-[1440px] mx-auto px-5 lg:px-10">
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
                href="/contact"
                className="hidden md:inline-flex h-9 items-center px-3 text-[13px] font-medium transition-colors"
                style={{ color: "rgba(255,255,255,0.75)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              >
                Contact
              </Link>
              <span className="hidden md:block h-5 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
              <Link
                href="/bookings"
                className="inline-flex items-center gap-1.5 h-10 px-5 text-[13px] font-semibold text-white transition-all rounded-md"
                style={{
                  background: "var(--accent)",
                  boxShadow: "0 1px 0 rgba(0,0,0,0.2), 0 6px 18px -4px rgba(168,72,46,0.65)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-soft)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
              >
                Reserve a Tour
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
              </Link>
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden w-10 h-10 rounded-md flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#fff",
                }}
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ background: "var(--canvas)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="h-full flex flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center"
                  aria-label="NammaOffice — home"
                >
                  <Image
                    src="/images/logo.png"
                    alt="NammaOffice"
                    width={1000}
                    height={137}
                    className="h-7 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-md flex items-center justify-center bg-white"
                  style={{ border: "1px solid var(--border)" }}
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
                <p className="eyebrow mb-5">Menu</p>
                <div
                  className="flex flex-col border-y"
                  style={{ borderColor: "var(--border)" }}
                >
                  {navigation.map((item, i) => (
                    <MobileMenuRow
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      index={i}
                      onClose={() => setOpen(false)}
                    />
                  ))}
                </div>
                <div className="mt-8 space-y-2 text-[13px] text-ink-muted">
                  <a
                    href={`tel:${formatPhone(BRAND.phone)}`}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />{" "}
                    <span className="mono">{BRAND.phone}</span>
                  </a>
                  <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" strokeWidth={1.75} /> {BRAND.email}
                  </a>
                </div>
              </div>
              <Link
                href="/bookings"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 h-12 py-4 rounded-md text-[14px] font-semibold text-white"
                style={{ background: "var(--accent)" }}
              >
                Reserve a Tour <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
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
      className="relative h-full flex items-center px-4 text-[12.5px] font-bold uppercase tracking-[0.12em] transition-colors"
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
        className="relative h-full flex items-center gap-1.5 px-4 text-[12.5px] font-bold uppercase tracking-[0.12em] transition-colors"
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
            className="absolute left-0 top-full pt-2 min-w-[280px] z-50"
          >
            <div
              className="rounded-xl bg-white border p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]"
              style={{ borderColor: "var(--border)" }}
              role="menu"
            >
              {children.map((child) => (
                <DropdownChild key={child.href} child={child} pathname={pathname} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownChild({ child, pathname }: { child: NavChild; pathname: string }) {
  const isActive = useActiveHref(child.href, pathname);
  return (
    <Link
      href={child.href}
      role="menuitem"
      className="block rounded-lg px-3 py-2.5 group/item transition-colors"
      style={{ background: isActive ? "var(--accent-bg)" : "transparent" }}
      onMouseEnter={(e) =>
        !isActive && (e.currentTarget.style.background = "var(--canvas-alt)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = isActive ? "var(--accent-bg)" : "transparent")}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-[13.5px] font-medium leading-tight"
          style={{ color: isActive ? "var(--accent)" : "var(--ink)" }}
        >
          {child.label}
        </span>
        <ArrowUpRight
          className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all"
          style={{ color: "var(--accent)" }}
          strokeWidth={1.75}
        />
      </div>
      {child.description && (
        <p className="mt-0.5 text-[11.5px] leading-snug" style={{ color: "var(--ink-dim)" }}>
          {child.description}
        </p>
      )}
    </Link>
  );
}

function MobileMenuRow({
  item,
  pathname,
  index,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  index: number;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive =
    pathname === item.href ||
    (item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/")) ??
      false);

  if (item.children?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 + index * 0.04, duration: 0.4 }}
        className="border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-left display text-[28px] py-5 flex items-center justify-between"
          style={{ color: isActive ? "var(--accent)" : "var(--ink)" }}
        >
          {item.label}
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              expanded && "rotate-180"
            )}
            style={{ color: "var(--ink-dim)" }}
            strokeWidth={1.5}
          />
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pb-5 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className="block px-4 py-2.5 rounded-md text-[15px]"
                    style={{ color: "var(--ink-muted)" }}
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + index * 0.04, duration: 0.4 }}
      className="border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <Link
        href={item.href}
        onClick={onClose}
        className="display text-[28px] py-5 flex items-center justify-between"
        style={{ color: isActive ? "var(--accent)" : "var(--ink)" }}
      >
        {item.label}
        <ArrowUpRight
          className="w-5 h-5"
          style={{ color: "var(--ink-dim)" }}
          strokeWidth={1.5}
        />
      </Link>
    </motion.div>
  );
}
