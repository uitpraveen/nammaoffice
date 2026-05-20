"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Mounts Lenis once at the app root so all page scrolling is eased,
 * intercepts in-page anchor clicks so the URL never gets a doubled
 * hash, runs a scroll-spy to keep the nav's active item in sync, and
 * resets scroll on every Next.js navigation.
 *
 * Three href shapes get special handling for in-page anchors:
 *   - "#section"  — same-page anchor; always intercepted
 *   - "/#section" — home-page anchor; intercepted only when we're
 *                   already on `/` so cross-page links still navigate
 *   - "/" on `/`  — clears any hash and slides back to the top
 *
 * Capture-phase listening makes us run before Next.js `Link`'s
 * onClick, and `history.replaceState` updates the URL without nesting
 * hashes (the bug `/#x#x` came from Next.js Link's same-path push).
 *
 * Respects `prefers-reduced-motion` — falls back to native scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const suppressSpyUntilRef = useRef(0);
  const isFirstNavRef = useRef(true);

  // ---------- One-time mount: Lenis + click + scroll-spy ----------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const scrollToHash = (hash: string) => {
      const target = document.querySelector(hash);
      if (target) lenis.scrollTo(target as HTMLElement);
    };

    // On first paint, if URL already has a hash, scroll to that
    // section (Lenis controls scroll, so the browser's native anchor
    // jump won't land in the right place).
    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }

    const onAnchorClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const rawHref = a.getAttribute("href");
      if (!rawHref) return;

      // Clicking Home (`/`) while already on `/` should clear any hash
      // and slide back to the top. Next.js Link won't fire hashchange
      // for this so we manage it manually.
      if (rawHref === "/" && window.location.pathname === "/") {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (window.location.hash) {
          history.replaceState(null, "", "/");
          window.dispatchEvent(new Event("hashchange"));
        }
        lenis.scrollTo(0);
        return;
      }

      let hash: string | null = null;
      if (rawHref.startsWith("#")) {
        hash = rawHref;
      } else if (rawHref.startsWith("/#") && window.location.pathname === "/") {
        hash = rawHref.slice(1);
      } else {
        return;
      }

      if (!document.querySelector(hash)) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      if (window.location.hash !== hash) {
        history.replaceState(null, "", hash);
        window.dispatchEvent(new Event("hashchange"));
      }
      scrollToHash(hash);
    };

    document.addEventListener("click", onAnchorClick, { capture: true });

    // ---------- Scroll spy ---------------------------------------
    // Observe only navigable anchors — Hero (Home), About and Amenities.
    // Other sections (Centres, Clients, Stats) sit *between* these
    // navigable ones and intentionally leave the URL alone, so the
    // highlight on the last navigable section persists while the user
    // scrolls through the gap. The auto-scroll-to-top that an earlier
    // version of this triggered is blocked in `ScrollToTop` by a
    // `lastKeyRef` bailout.
    const SECTION_TO_HASH: Record<string, string> = {
      hero: "",
      about: "#about",
      centres: "#centres",
      amenities: "#amenities",
    };

    let activeSpyHash = window.location.hash;

    const SUPPRESS_MS = 1400;
    const onClickToSuppress = () => {
      suppressSpyUntilRef.current = Date.now() + SUPPRESS_MS;
    };
    document.addEventListener("click", onClickToSuppress, { capture: true });

    const sections = Object.keys(SECTION_TO_HASH)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressSpyUntilRef.current) return;
        if (window.location.pathname !== "/") return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ id: e.target.id, top: e.boundingClientRect.top }));
        if (visible.length === 0) return;
        visible.sort((a, b) => Math.abs(a.top) - Math.abs(b.top));
        const dominantId = visible[0].id;
        if (!(dominantId in SECTION_TO_HASH)) return;
        const targetHash = SECTION_TO_HASH[dominantId];

        if (activeSpyHash === targetHash) return;
        activeSpyHash = targetHash;

        const newPath = targetHash || "/";
        if (window.location.hash === targetHash) return;
        history.replaceState(null, "", newPath);
        window.dispatchEvent(new Event("hashchange"));
      },
      {
        rootMargin: "-22% 0px -70% 0px",
        threshold: 0,
      }
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
      document.removeEventListener("click", onAnchorClick, { capture: true });
      document.removeEventListener("click", onClickToSuppress, { capture: true });
      observer.disconnect();
    };
  }, []);

  // ---------- Reset scroll on every Next.js navigation ----------
  // pushState/replaceState don't reset Lenis's internal scroll, so a
  // tall page like `/` would carry its scroll into shorter pages
  // (e.g. /locations/...) and leave them rendered near the bottom.
  //
  // The trickier case: cross-page anchor links like `/contact → /#amenities`.
  // The new home page mounts with images and reveal animations still
  // settling, so a single scroll on the next animation frame lands at
  // a stale offsetTop. We watch body height for ~1.5s after the
  // navigation and re-snap to the target every time it changes —
  // images finishing decode, viewport-reveal animations resolving, etc.
  // We bail out early if the user starts scrolling manually.
  useEffect(() => {
    if (isFirstNavRef.current) {
      isFirstNavRef.current = false;
      return;
    }

    suppressSpyUntilRef.current = Date.now() + 1500;

    let canceled = false;
    let userInterrupted = false;

    // Only count REAL user input as an interruption — synthetic events
    // dispatched internally by Lenis or by us (`new Event("hashchange")`)
    // have `isTrusted: false` and shouldn't bail out the re-snap loop.
    const onUserScroll = (e: Event) => {
      if (e.isTrusted) userInterrupted = true;
    };
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchstart", onUserScroll, { passive: true });

    const performScroll = () => {
      if (canceled || userInterrupted) return;
      const lenis = lenisRef.current;
      if (!lenis) return;

      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { immediate: true });
          return;
        }
      }
      lenis.scrollTo(0, { immediate: true });
    };

    // Re-snap at multiple checkpoints so the scroll catches up once
    // images finish decoding, motion-reveal animations resolve, and
    // any other late layout shifts settle. The early snaps cover most
    // cases, the late ones rescue stragglers.
    const timeouts = [0, 60, 160, 320, 600, 1000, 1400].map((ms) =>
      window.setTimeout(performScroll, ms)
    );

    return () => {
      canceled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchstart", onUserScroll);
    };
  }, [pathname]);

  return null;
}
