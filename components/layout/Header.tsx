"use client";

import { BRAND } from "@/lib/constants";
import { cn, formatPhone } from "@/lib/utils";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MapPin, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";


export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Transparent only at the top of the home page (over the hero).
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        {/* Stats top bar — solid black for the saffron-bg theme */}
        <div className="bg-[var(--color-charcoal)] text-white relative overflow-hidden h-8 md:h-9">
          <div className="content-width h-full flex items-center justify-center md:justify-between gap-3 text-[11px] md:text-[12px] font-semibold">
            <div className="hidden md:flex items-center h-full gap-x-5 lg:gap-x-7">
              <span className="inline-flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-white" strokeWidth={1.5} />
                4.9 / 5 from 200+ reviews
              </span>
              <span className="self-stretch w-px bg-white/25" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                8 centres · 3 cities
              </span>
              <span className="hidden lg:block self-stretch w-px bg-white/25" aria-hidden="true" />
              <span className="hidden lg:inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" strokeWidth={2} />
                500+ active members
              </span>
            </div>
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-white/90 transition-colors"
            >
              <span aria-hidden>📞</span>
              <span className="hidden sm:inline">Call us :&nbsp;</span>
              90921 09213
            </a>
          </div>
        </div>

        {/* Main nav — transparent over hero, white on scroll */}
        <div
          className={cn(
            "h-14 md:h-16 transition-[background-color,backdrop-filter,border-color,box-shadow,color] duration-300",
            transparent
              ? "bg-black/35 backdrop-blur-md border-b border-white/10 text-white"
              : "bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-[0_1px_0_rgba(10,10,10,0.04)] text-[var(--color-ink)]"
          )}
        >
          <div className="content-width h-full flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center shrink-0"
              aria-label="NammaOffice — home"
            >
              <Image
                src="/images/logo.png"
                alt="NammaOffice"
                width={1000}
                height={137}
                priority
                className={cn(
                  "h-6 sm:h-7 lg:h-8 w-auto transition-[filter] duration-200",
                  transparent ? "brightness-0 invert" : ""
                )}
              />
            </Link>

            <DesktopNav theme={transparent ? "light" : "dark"} />

            <div className="flex items-center gap-2">
              <Link
                href="/bookings"
                className="hidden lg:inline-flex items-center gap-1.5 h-10 px-5 text-[13px] font-semibold rounded-full bg-[var(--color-gold)] text-[var(--color-navy-deep)] hover:bg-[var(--color-gold-deep)] hover:text-white transition-colors shadow-[var(--shadow-cta)]"
              >
                Book Now
                <span aria-hidden>→</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  "lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-1 rounded-full transition-colors",
                  transparent
                    ? "text-white hover:bg-white/15 active:bg-white/25"
                    : "text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] active:bg-[var(--color-border)]"
                )}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Spacer for non-home pages — matches the responsive header height */}
      {!isHome && <div className="h-[calc(32px+56px)] md:h-[calc(36px+64px)]" aria-hidden />}
    </>
  );
}
