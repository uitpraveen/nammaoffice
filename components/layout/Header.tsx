"use client";

import { BRAND } from "@/lib/constants";
import { cn, formatPhone } from "@/lib/utils";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MapPin, Menu, Phone, Star } from "lucide-react";
import { useState } from "react";

/**
 * Newspaper-Masthead navbar — bold, solid black, sharp corners, no
 * transparency. Two horizontal bands:
 *   1. 28px charcoal utility strip — rating left, phone right
 *   2. 80px solid-black masthead — large logo, Fraunces uppercase serif
 *      nav, full-height gold BOOK NOW tile on the far right
 * A 1px gold rule line sits beneath the masthead. Total ~108px fixed.
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        {/* Utility strip */}
        <div className="h-7 bg-[var(--color-charcoal)] text-white text-[11px] font-medium border-b border-white/5">
          <div className="content-width h-full flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-white/85">
              <Star className="w-3 h-3 fill-[var(--color-gold)] text-[var(--color-gold)]" strokeWidth={1.5} />
              <span className="font-semibold text-white">4.9</span>
              <span className="hidden sm:inline">/5 from 200+ members</span>
              <span className="hidden md:inline opacity-30 mx-1">·</span>
              <span className="hidden md:inline-flex items-center gap-1 text-white/70">
                <MapPin className="w-2.5 h-2.5" strokeWidth={2} />
                8 centres · 3 cities
              </span>
            </span>
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="inline-flex items-center gap-1.5 text-white/85 hover:text-[var(--color-gold-300)] transition-colors"
            >
              <Phone className="w-3 h-3" strokeWidth={2} />
              <span className="font-semibold text-white">{BRAND.phone}</span>
            </a>
          </div>
        </div>

        {/* Masthead bar */}
        <div className="h-16 md:h-20 bg-[#0A0A0B] border-b border-[var(--color-gold)] text-white relative">
          {/* Optional subtle inner rule above the gold border for "newspaper" feel */}
          <span
            aria-hidden
            className="absolute left-0 right-0 bottom-[1px] h-px bg-white/8"
          />

          <div className="content-width h-full flex items-stretch justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center shrink-0 py-2"
              aria-label="NammaOffice — home"
            >
              <Image
                src="/images/logo.png"
                alt="NammaOffice"
                width={1000}
                height={137}
                priority
                className="h-6 md:h-7 w-auto brightness-0 invert"
              />
            </Link>

            {/* Center nav */}
            <div className="flex-1 flex items-center justify-center min-w-0">
              <DesktopNav />
            </div>

            {/* Right cluster — desktop CTA tile + mobile menu button */}
            <div className="flex items-stretch shrink-0">
              <Link
                href="/bookings"
                className={cn(
                  "hidden lg:inline-flex items-center justify-center gap-1.5 h-full px-6 whitespace-nowrap",
                  "bg-[var(--color-gold)] text-[#0A0A0B] hover:bg-white",
                  "transition-colors",
                  "text-[11.5px] font-bold uppercase tracking-[0.18em] font-[var(--font-serif)]"
                )}
              >
                Book Now
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden inline-flex items-center justify-center w-12 self-center h-12 mr-1 text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Spacer for non-home pages — matches utility strip + masthead height */}
      {!isHome && <div className="h-[calc(28px+64px)] md:h-[calc(28px+80px)]" aria-hidden />}
    </>
  );
}
