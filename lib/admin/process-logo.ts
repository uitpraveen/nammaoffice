import sharp from "sharp";

/**
 * Server-side port of scripts/build-client-logos.py.
 *
 * Turns a brand's raw artwork into the same optically-matched canvas the
 * client wall expects, so a logo uploaded through the admin page comes out
 * identical to one built by the Python script:
 *
 *   1. Sample the border to find the artwork's own background colour.
 *   2. Light neutral background -> flood-fill it away from the edges, so
 *      interior whites survive (white type inside a coloured badge stays).
 *      Coloured background -> the tile IS the mark: keep it, even out its
 *      padding and round the corners into the alpha.
 *   3. Trim to the opaque bounding box. This is the "remove dead space" step.
 *   4. Area-normalise the scale so a square monogram and a long wordmark carry
 *      the same optical weight, then centre it on a fixed-height canvas so the
 *      CSS only ever has to set a height.
 *
 * Keep the constants below in step with the Python script, or logos added
 * through the admin page will not match the ones already on the wall.
 */

/** 5x the ~112px the wall paints, which is what keeps marks crisp on 2x and
 *  3x screens. Shrinking this visibly softens every logo. */
export const CANVAS_H = 560;
const S = CANVAS_H / 240;

const PAD_X = Math.round(14 * S);
/** Optical area every mark is normalised toward. */
const TARGET_A = Math.round(172 * S) ** 2;
const H_MIN = Math.round(100 * S);
const H_MAX = Math.round(214 * S);
const W_MAX = Math.round(600 * S);

/** How far a pixel may sit from the sampled background and still count as
 *  background. Generous enough to swallow JPEG halo around the mark. */
const BG_TOL = 34;
/** Width of the soft edge where alpha fades in, hiding JPEG ringing. */
const BG_FEATHER = 42;

export interface Crop {
  /** Fractions of the source image, 0..1, so the caller does not need to know
   *  the intrinsic pixel size. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProcessedLogo {
  /** Lossless WebP, a CANVAS_H-tall transparent canvas. */
  webp: Buffer;
  width: number;
  height: number;
  /** True when the artwork's own coloured panel was kept rather than removed. */
  tile: boolean;
  /** How much the mark had to be enlarged past its source. Above ~1.0 means
   *  the supplied file is too small and the result will look soft. */
  upscale: number;
}

type Raw = { data: Buffer; width: number; height: number; channels: number };

function at(raw: Raw, x: number, y: number) {
  return (y * raw.width + x) * raw.channels;
}

/** Median colour of the outermost band, which is the artwork's background. */
function borderColour(raw: Raw): [number, number, number] {
  const band = Math.max(1, Math.floor(Math.min(raw.width, raw.height) / 100));
  const rs: number[] = [], gs: number[] = [], bs: number[] = [];
  const push = (x: number, y: number) => {
    const i = at(raw, x, y);
    rs.push(raw.data[i]); gs.push(raw.data[i + 1]); bs.push(raw.data[i + 2]);
  };
  for (let y = 0; y < band; y++) for (let x = 0; x < raw.width; x++) { push(x, y); push(x, raw.height - 1 - y); }
  for (let x = 0; x < band; x++) for (let y = 0; y < raw.height; y++) { push(x, y); push(raw.width - 1 - x, y); }
  const mid = (a: number[]) => { a.sort((p, q) => p - q); return a[a.length >> 1]; };
  return [mid(rs), mid(gs), mid(bs)];
}

/** Chebyshev distance from the background colour, per pixel. */
function bgDistance(raw: Raw, bg: [number, number, number]): Uint8Array {
  const d = new Uint8Array(raw.width * raw.height);
  for (let p = 0, i = 0; p < d.length; p++, i += raw.channels) {
    d[p] = Math.max(
      Math.abs(raw.data[i] - bg[0]),
      Math.abs(raw.data[i + 1] - bg[1]),
      Math.abs(raw.data[i + 2] - bg[2]),
    );
  }
  return d;
}

/**
 * Alpha channel with the edge-connected background removed.
 *
 * Deliberately a flood fill inward from the border rather than "make every
 * near-white pixel transparent": that is what lets white type inside a
 * coloured badge survive, because it is not reachable from the edge.
 */
function knockout(raw: Raw, dist: Uint8Array): Uint8Array {
  const { width: w, height: h } = raw;
  const alpha = new Uint8Array(w * h).fill(255);
  const isBg = new Uint8Array(w * h);          // 1 = background, reached from an edge
  const stack: number[] = [];

  const seed = (p: number) => {
    if (!isBg[p] && dist[p] <= BG_TOL) { isBg[p] = 1; stack.push(p); }
  };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }

  while (stack.length) {
    const p = stack.pop()!;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) seed(p - 1);
    if (x < w - 1) seed(p + 1);
    if (y > 0) seed(p - w);
    if (y < h - 1) seed(p + w);
  }

  for (let p = 0; p < alpha.length; p++) if (isBg[p]) alpha[p] = 0;

  // Feather the ring just outside the removed region so JPEG halo does not
  // leave a hard fringe against the cream page.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (isBg[p]) continue;
      const touchesBg =
        (x > 0 && isBg[p - 1]) || (x < w - 1 && isBg[p + 1]) ||
        (y > 0 && isBg[p - w]) || (y < h - 1 && isBg[p + w]);
      if (touchesBg) {
        alpha[p] = Math.round(Math.min(1, Math.max(0, (dist[p] - BG_TOL) / BG_FEATHER)) * 255);
      }
    }
  }
  return alpha;
}

/** Bounding box of everything at least `t` opaque. */
function opaqueBox(alpha: Uint8Array, w: number, h: number, t = 8) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (alpha[y * w + x] > t) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

/** Rounded-rectangle alpha, used to soften a kept coloured tile's corners. */
function roundedAlpha(w: number, h: number, r: number): Uint8Array {
  const a = new Uint8Array(w * h).fill(255);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Only the four corner squares can be cut; everything else stays opaque.
      if (!((x < r || x > w - 1 - r) && (y < r || y > h - 1 - r))) continue;
      const cx = x < r ? r : w - 1 - r;
      const cy = y < r ? r : h - 1 - r;
      if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) a[y * w + x] = 0;
    }
  }
  return a;
}

/**
 * Cap on the working resolution. The flood fill and the bounding-box scan are
 * both O(pixels), and the output is only CANVAS_H tall, so a 6000px source
 * costs a lot of time and memory for detail that is thrown away moments later.
 * Set above any real logo artwork, so this is a guard against a pathological
 * upload (a 8000px phone photo is 190MB once decoded to RGBA) rather than
 * something that fires day to day. scripts/build-client-logos.py applies the
 * same cap, so both pipelines stay in step at every input size.
 */
const MAX_WORKING_EDGE = 4000;

export async function processLogo(input: Buffer, crop?: Crop): Promise<ProcessedLogo> {
  let img = sharp(input, { failOn: "none" });
  let meta = await img.metadata();
  if (!meta.width || !meta.height) throw new Error("Could not read that image.");

  if (Math.max(meta.width, meta.height) > MAX_WORKING_EDGE) {
    img = sharp(await img.resize({
      width: meta.width >= meta.height ? MAX_WORKING_EDGE : undefined,
      height: meta.height > meta.width ? MAX_WORKING_EDGE : undefined,
      kernel: "lanczos3",
    }).toBuffer(), { failOn: "none" });
    meta = await img.metadata();
  }

  // Manual crop first, so the caller can cut away a border, a strapline, or a
  // second logo the automatic trim would otherwise keep.
  if (crop) {
    const left = Math.max(0, Math.round(crop.x * meta.width));
    const top = Math.max(0, Math.round(crop.y * meta.height));
    const width = Math.max(1, Math.min(meta.width - left, Math.round(crop.width * meta.width)));
    const height = Math.max(1, Math.min(meta.height - top, Math.round(crop.height * meta.height)));
    img = sharp(await img.extract({ left, top, width, height }).toBuffer(), { failOn: "none" });
  }

  // Flatten any existing transparency onto white, so a source PNG and a source
  // JPEG of the same mark go down the identical path.
  const flat = await img.flatten({ background: "#ffffff" }).toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
  const raw: Raw = { data: flat.data as Buffer, width: flat.info.width, height: flat.info.height, channels: flat.info.channels };

  const bg = borderColour(raw);
  const dist = bgDistance(raw, bg);
  const neutralLight = Math.min(...bg) >= 195 && Math.max(...bg) - Math.min(...bg) <= 26;

  let rgbBuf: Buffer, rgbW: number, rgbH: number, alpha: Uint8Array, tile: boolean;

  if (neutralLight) {
    tile = false;
    rgbBuf = raw.data; rgbW = raw.width; rgbH = raw.height;
    alpha = knockout(raw, dist);
  } else {
    // The coloured panel is part of the mark. Trim its own padding, re-pad it
    // evenly, then round the corners.
    tile = true;
    const inkAlpha = new Uint8Array(raw.width * raw.height);
    for (let p = 0; p < inkAlpha.length; p++) inkAlpha[p] = dist[p] > 30 ? 255 : 0;
    const box = opaqueBox(inkAlpha, raw.width, raw.height, 0);
    let left = 0, top = 0, width = raw.width, height = raw.height;
    if (box) {
      const m = Math.round(0.11 * Math.max(box.width, box.height));
      left = Math.max(0, box.left - m);
      top = Math.max(0, box.top - m);
      width = Math.min(raw.width - left, box.width + 2 * m);
      height = Math.min(raw.height - top, box.height + 2 * m);
    }
    const cut = await sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: raw.channels as 3 | 4 } })
      .extract({ left, top, width, height }).raw().toBuffer({ resolveWithObject: true });
    rgbBuf = cut.data as Buffer; rgbW = cut.info.width; rgbH = cut.info.height;
    alpha = roundedAlpha(rgbW, rgbH, Math.max(4, Math.round(0.1 * Math.min(rgbW, rgbH))));
  }

  const box = opaqueBox(alpha, rgbW, rgbH);
  if (!box) throw new Error("That image looks blank once its background is removed.");

  // Stitch RGB + our alpha into RGBA, cropped to the mark.
  const ch = neutralLight ? raw.channels : 3;
  const rgba = Buffer.alloc(box.width * box.height * 4);
  for (let y = 0; y < box.height; y++) {
    for (let x = 0; x < box.width; x++) {
      const sp = (y + box.top) * rgbW + (x + box.left);
      const si = sp * ch, di = (y * box.width + x) * 4;
      rgba[di] = rgbBuf[si]; rgba[di + 1] = rgbBuf[si + 1]; rgba[di + 2] = rgbBuf[si + 2];
      rgba[di + 3] = alpha[sp];
    }
  }

  // Optical normalisation: equal area, then clamped so nothing is absurdly
  // short, tall or wide.
  let scale = Math.sqrt(TARGET_A / (box.width * box.height));
  if (box.height * scale < H_MIN) scale = H_MIN / box.height;
  if (box.height * scale > H_MAX) scale = H_MAX / box.height;
  if (box.width * scale > W_MAX) scale = W_MAX / box.width;
  const nw = Math.max(1, Math.round(box.width * scale));
  const nh = Math.max(1, Math.round(box.height * scale));

  const art = await sharp(rgba, { raw: { width: box.width, height: box.height, channels: 4 } })
    .resize(nw, nh, { kernel: "lanczos3", fit: "fill" })
    .png()
    .toBuffer();

  const canvasW = nw + 2 * PAD_X;
  const webp = await sharp({
    create: { width: canvasW, height: CANVAS_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: art, left: PAD_X, top: Math.round((CANVAS_H - nh) / 2) }])
    .webp({ lossless: true, effort: 6 })
    .toBuffer();

  return { webp, width: canvasW, height: CANVAS_H, tile, upscale: nh / box.height };
}

/** Turn a brand name into the slug used for the filename and the id. */
export function toSlug(name: string) {
  return name.trim().toLowerCase()
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
