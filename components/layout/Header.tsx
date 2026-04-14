"use client";

import { BRAND } from "@/lib/constants";
import { cn, formatPhone } from "@/lib/utils";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-10 text-xs transition-all duration-300",
          scrolled
            ? "bg-warm-charcoal text-white/80"
            : "bg-warm-charcoal/90 text-white/70"
        )}
      >
        <div className="content-width h-full flex items-center justify-between">
          <span className="hidden sm:block font-sans tracking-wide">
            Premium Coworking in Salem, Trichy &amp; Tirupur
          </span>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 16.352V17.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
              </svg>
              {BRAND.phone}
            </a>
            <a href={`mailto:${BRAND.email}`} className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
              </svg>
              {BRAND.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "fixed top-10 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
            : "bg-white/95 backdrop-blur-sm"
        )}
      >
        <div className="content-width h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0" aria-label="NammaOffice home">
            <span className="font-serif text-[26px] font-bold tracking-[0.06em] text-warm-charcoal">
              Namma
            </span>
            <span className="font-serif text-[26px] font-bold tracking-[0.06em] text-terracotta">
              Office
            </span>
          </Link>

          {/* Desktop Nav — center */}
          <DesktopNav />

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/book-tour"
              className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 bg-terracotta text-white text-sm font-semibold rounded-lg hover:bg-terracotta-600 transition-colors duration-200"
            >
              Book a Tour
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-warm-charcoal hover:text-terracotta transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-[112px]" />
    </>
  );
}
