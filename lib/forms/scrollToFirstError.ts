// Fixed nav is ~100px; the site uses 124px scroll-padding. 120 keeps the
// focused field clear of the nav with a little breathing room.
const HEADER_OFFSET = 120;

interface LenisLike {
  scrollTo: (
    target: number | HTMLElement,
    opts?: { offset?: number; immediate?: boolean; force?: boolean },
  ) => void;
}

/**
 * Scroll the first invalid field (first `[aria-invalid="true"]` in DOM order,
 * which is the topmost one) into view and focus it.
 *
 * Lenis-aware: the site mounts Lenis at the app root and exposes it as
 * `window.__lenis` (absent under prefers-reduced-motion). A native
 * `window.scrollTo` is fought by Lenis's RAF loop and won't land, so when
 * Lenis is present we drive it with an absolute Y (rect-based, since
 * `offsetTop` is unreliable inside the nested FormSection wrappers).
 *
 * Notes from testing the live Lenis instance:
 *  - Animated `lenis.scrollTo(y)` is unreliable here (gets ignored); only
 *    `{ immediate: true, force: true }` lands consistently - an instant jump
 *    to the error is fine UX and always works.
 *  - We defer with setTimeout (not requestAnimationFrame): the call happens
 *    inside React's submit handler before `aria-invalid` is committed, and
 *    rAF is paused in background tabs (so it wouldn't fire if the user tabbed
 *    away). A 0ms timeout runs after React commits and fires regardless of
 *    tab visibility.
 */
export function scrollToFirstError() {
  if (typeof window === "undefined") return;
  setTimeout(() => {
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
    if (lenis) {
      lenis.scrollTo(y, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    // Focus without a native scroll jump that would fight Lenis.
    el.focus({ preventScroll: true });
  }, 0);
}
