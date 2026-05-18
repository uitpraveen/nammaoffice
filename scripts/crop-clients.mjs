// Crop /tmp/clients-banner.jpg into individual logo PNGs.
// Coordinates were derived by running scripts/detect-logos.mjs (which
// found 24 ink-fragments) and then manually grouping fragments that
// belong to the same logo (e.g. LGT's diamond + "Wealth India" text,
// FixoCare's icon + wordmark, Spantag's wordmark + bracket symbol).

import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "public/images/clients");
const src = "/tmp/clients-banner.jpg";

// Pad each box by ~12px so an off-by-a-few-pixels detection doesn't clip.
const PAD = 12;
const W = 1920;
const H = 1080;

// Each entry: id, name, [xLeft, xRight, yTop, yBottom]
// Fragments grouped by hand from the auto-detector output.
const RAW = [
  // Row 1 (y 65-210)
  ["sierra-digital",      "Sierra Digital",        [72,  525,  65, 210]],
  ["payagri",             "payAgri",               [623, 710,  65, 210]],
  ["farm-connect",        "Farm Connect",          [738, 984,  65, 210]],
  ["fixocare",            "FixoCare",              [1040,1457, 65, 210]],
  ["dr-sasi-eye-care",    "Dr. Sasi Eye Care",     [1556,1832, 65, 210]],

  // Row 2 (y 235-419)
  ["lgt-wealth-india",    "LGT Wealth India",      [97,  475, 235, 419]],
  ["nativespecial",       "nativespecial.com",     [513, 931, 235, 419]],
  ["metropolis",          "Metropolis",            [1016,1334,235, 419]],
  ["apollo-diagnostics",  "Apollo Diagnostics",    [1386,1604,235, 419]],
  ["thulir-technology",   "Thulir Technology",     [1620,1828,235, 419]],

  // Row 3 (y 476-634)
  ["vee-healthtek",       "Vee Healthtek",         [75,  308, 476, 634]],
  ["indecomm",            "Indecomm",              [424, 643, 476, 634]],
  ["vi",                  "Vi",                    [702, 898, 476, 634]],
  ["eyal",                "EYAL",                  [1014,1194,476, 634]],
  ["asian-holiday",       "Asian Holiday Resorts", [1247,1580,476, 634]],
  ["gail",                "GAIL",                  [1638,1825,476, 634]],

  // Row 4 (y 691-969). Deecodes.io & Strader stack vertically in the
  // last column — split that column horizontally.
  ["spantag",             "Spantag Technologies",  [80,  513, 691, 838]],
  ["compaq-hopper",       "Compaq Hopper EV",      [584, 929, 691, 920]],
  ["vulture-lines",       "Vulture Lines",         [1011,1260,691, 838]],
  ["ovr",                 "OVR",                   [1290,1492,691, 935]],
  ["deecodes",            "Deecodes.io",           [1597,1860,691, 800]],
  ["strader",             "Strader",               [1597,1824,820, 940]],
];

await Promise.all(
  RAW.map(async ([id, , [x1, x2, y1, y2]]) => {
    const left = Math.max(0, x1 - PAD);
    const top = Math.max(0, y1 - PAD);
    const width = Math.min(W, x2 + PAD) - left;
    const height = Math.min(H, y2 + PAD) - top;
    const out = path.join(outDir, `${id}.png`);
    await sharp(src)
      .extract({ left, top, width, height })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`✓ ${id}.png  (${width}×${height})`);
  })
);
console.log(`\nWrote ${RAW.length} logo crops to ${outDir}`);
