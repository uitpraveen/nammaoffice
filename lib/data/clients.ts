import data from "./clients.json";

/**
 * Client logos shown on the home page.
 *
 * The list itself lives in clients.json, and this module only adds the types.
 * That split matters: two things write the list, the admin page at
 * /admin/logos and scripts/build-client-logos.py, and they can only share a
 * file a machine can safely rewrite. An earlier version had the script emit
 * TypeScript, which silently clobbered anything the admin page had saved.
 *
 * Each entry points at a fixed 560px-tall lossless WebP canvas with the mark
 * trimmed and area-normalised inside it, so the UI only sets a height and
 * every logo lands at the right relative size on its own. Two things about
 * that 560 are load-bearing:
 *
 *  - It is 5x the ~112px the wall paints, leaving ~2.5x oversampling on a 2x
 *    screen. An earlier 240px canvas gave 1.07x and the marks visibly lost
 *    their edges. Do not shrink it.
 *  - The canvas is only slightly taller than its mark, so a height of H
 *    renders the average mark at roughly 0.56 * H.
 */
export interface Client {
  id: string;
  name: string;
  /** Logo path under /public. */
  logo: string;
  /** Intrinsic size. Height is always 560; width varies with the mark. */
  w: number;
  h: number;
  /** True when the brand's artwork is a coloured/dark tile that was kept
   *  rather than knocked out (Vi's red square, Corefactors' black bar, ...). */
  tile?: boolean;
}

export const clients: Client[] = data as Client[];
