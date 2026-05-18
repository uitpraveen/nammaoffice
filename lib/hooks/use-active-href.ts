"use client";

import { useEffect, useState } from "react";

/**
 * Returns whether a nav `href` should render in its active state for
 * the given pathname, accounting for hash anchors. Subscribes to
 * `hashchange` so client-side anchor scrolling updates the highlight
 * without a full route change.
 *
 * Match rules:
 *   - "/"           → active when pathname is "/" and there's no hash
 *   - "/#section"   → active when pathname is "/" and the hash matches
 *   - any other path → active when the pathname starts with the href
 */
export function useActiveHref(href: string, pathname: string) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setHash(window.location.hash);
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  // Re-sync after a Next.js Link navigation. `pushState`/`replaceState`
  // don't fire `hashchange`, so without this the previous page's hash
  // would linger in state — e.g. /#amenities → /franchise → / would
  // leave Amenities highlighted because the hook still saw "#amenities".
  useEffect(() => {
    if (typeof window === "undefined") return;
    setHash(window.location.hash);
  }, [pathname]);

  if (href === "/") {
    return pathname === "/" && !hash;
  }
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }
  return pathname === href || pathname.startsWith(href + "/");
}
