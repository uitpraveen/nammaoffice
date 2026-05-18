// Auto-detect the bounding boxes of every logo in the client banner by
// finding contiguous rows / columns of non-white pixels. Outputs JSON
// that crop-clients.mjs can consume verbatim.
//
// Heuristic: a row is "ink" if more than 0.5% of its pixels are
// non-white (R<240 or G<240 or B<240). Same heuristic per column
// inside each row.

import sharp from "sharp";

const SRC = "/tmp/clients-banner.jpg";
const INK_THRESHOLD = 0.005;        // fraction of pixels that must be non-white
const WHITE_R = 245;
const WHITE_G = 245;
const WHITE_B = 245;

const { data, info } = await sharp(SRC)
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
console.error(`Banner: ${W}×${H} (${C} channels)`);

const isInk = (i) => data[i] < WHITE_R || data[i + 1] < WHITE_G || data[i + 2] < WHITE_B;

// Step 1: ink density per row → find row bands
const rowDensity = new Float32Array(H);
for (let y = 0; y < H; y++) {
  let ink = 0;
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    if (isInk(i)) ink++;
  }
  rowDensity[y] = ink / W;
}

// Smooth and threshold to find row bands (groups of consecutive ink rows).
const rowBands = [];
let inBand = false;
let bandStart = 0;
for (let y = 0; y < H; y++) {
  const isInkRow = rowDensity[y] > INK_THRESHOLD;
  if (isInkRow && !inBand) {
    bandStart = y;
    inBand = true;
  } else if (!isInkRow && inBand) {
    if (y - bandStart >= 40) rowBands.push([bandStart, y]); // ignore noise
    inBand = false;
  }
}
if (inBand && H - bandStart >= 40) rowBands.push([bandStart, H]);

// Merge close bands (< 30px gap apart) — treats a row of logos as one band
const merged = [];
for (const band of rowBands) {
  if (merged.length && band[0] - merged[merged.length - 1][1] < 30) {
    merged[merged.length - 1][1] = band[1];
  } else {
    merged.push([...band]);
  }
}
console.error(`Found ${merged.length} row bands:`, merged);

// Step 2: for each row band, find column bands inside it
const out = [];
for (let bi = 0; bi < merged.length; bi++) {
  const [yStart, yEnd] = merged[bi];
  const colDensity = new Float32Array(W);
  const rowH = yEnd - yStart;
  for (let x = 0; x < W; x++) {
    let ink = 0;
    for (let y = yStart; y < yEnd; y++) {
      const i = (y * W + x) * C;
      if (isInk(i)) ink++;
    }
    colDensity[x] = ink / rowH;
  }

  // Find column bands within this row
  const colBands = [];
  let inCol = false;
  let colStart = 0;
  for (let x = 0; x < W; x++) {
    const isInkCol = colDensity[x] > INK_THRESHOLD;
    if (isInkCol && !inCol) {
      colStart = x;
      inCol = true;
    } else if (!isInkCol && inCol) {
      if (x - colStart >= 40) colBands.push([colStart, x]);
      inCol = false;
    }
  }
  if (inCol && W - colStart >= 40) colBands.push([colStart, W]);

  // Merge close column bands (< 30px) — keeps multi-piece logos together
  const mergedCols = [];
  for (const band of colBands) {
    if (mergedCols.length && band[0] - mergedCols[mergedCols.length - 1][1] < 30) {
      mergedCols[mergedCols.length - 1][1] = band[1];
    } else {
      mergedCols.push([...band]);
    }
  }
  console.error(`Row ${bi + 1} (y ${yStart}-${yEnd}): ${mergedCols.length} logos`);

  for (const [xStart, xEnd] of mergedCols) {
    out.push({
      row: bi + 1,
      box: [
        Math.max(0, xStart - 8),
        Math.max(0, yStart - 8),
        Math.min(W, xEnd + 8) - Math.max(0, xStart - 8),
        Math.min(H, yEnd + 8) - Math.max(0, yStart - 8),
      ],
    });
  }
}

console.log(JSON.stringify(out, null, 2));
