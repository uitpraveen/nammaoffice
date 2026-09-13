"use client";

import { useSyncExternalStore } from "react";

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
  };
}
const getHash = () => window.location.hash;
const serverHash = () => "";

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
  // A Next pathname change also renders this hook and reads the latest snapshot.
  const hash = useSyncExternalStore(subscribe, getHash, serverHash);

  if (href === "/") {
    return pathname === "/" && !hash;
  }
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }
  return pathname === href || pathname.startsWith(href + "/");
}
