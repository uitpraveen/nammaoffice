"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Forces window scroll to (0, 0) on every client-side route change.
 *
 * Why this is needed even though Next.js scrolls on `<Link>` clicks:
 * - The fixed header + transparent state on home creates layout that some
 *   browsers / Turbopack dev mode restore to a scrolled position.
 * - `scroll-behavior: smooth` on <html> can cause the auto-scroll-to-top to
 *   land mid-animation on the new page.
 * - `behavior: "instant"` here bypasses the smooth-scroll setting and
 *   guarantees the new page starts at top: 0 immediately.
 *
 * If the URL has a hash (#section), we leave the browser to handle that.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, searchParams]);

  return null;
}
