"""Normalise the raw client-logo artwork into optically-matched PNGs.

Per logo:
  1. Sample the border to find the artwork's own background colour.
  2. Light neutral background -> flood-fill it away from the edges (interior
     whites survive, e.g. white type inside a coloured badge) and emit alpha.
     Coloured background -> the tile IS the logo: trim its excess padding,
     re-pad evenly and round the corners into the alpha channel.
  3. Trim to the opaque bounding box (this is the "remove extra space" step).
  4. Area-normalise the scale so a square mark and a long wordmark carry the
     same optical weight, then centre it on a fixed-height canvas so the CSS
     only ever has to set a height.
"""
import os, glob, json, re, sys
import numpy as np
from scipy import ndimage
from PIL import Image

SRC   = "/Users/praveen/Downloads/Company Logos"
# This folder is the single source of truth for the client list: whatever is
# in it ships, and nothing else. Logos from the old Wix banner were dropped.
OUT   = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

# The wall renders each canvas at ~112 CSS px tall. A 240px canvas therefore
# painted only 1.07x the device pixels a 2x screen needs, and less than one
# device pixel per source pixel on a 3x phone: that is why the marks looked
# soft next to the originals. Rendering at 5x the CSS height leaves ~2.7x
# oversampling on 2x screens and ~1.8x on 3x, which is what "crisp" costs.
CANVAS_H     = 560
_S           = CANVAS_H / 240.0   # every measurement below is a ratio of the canvas

PAD_X        = round(14 * _S)
# Optical area every mark is normalised toward. Deliberately close to CANVAS_H:
# the canvas carries only enough slack for the tallest marks, so a logo is not
# shrunk twice (once by normalisation, again by the canvas).
TARGET_A     = round(172 * _S) ** 2
H_MIN, H_MAX = round(100 * _S), round(214 * _S)
W_MAX        = round(600 * _S)

FORCE_TILE = {"Dr. Sasi Eye Care"}   # peach panel is part of the mark

# filename stem -> (slug, display name)
META = {
    "3KTS-LOGO":                                           ("3kts",               "3K Technology Services"),
    "Ability Associates":                                  ("ability-associates", "Ability Associates"),
    "Apollo diagnostics":                                  ("apollo-diagnostics", "Apollo Diagnostics"),
    "Asian Holidays":                                      ("asian-holidays",     "Asian Holiday Resorts"),
    "BAS INDIA":                                           ("bas-india",          "BAS India"),
    "Claricent Psycare":                                   ("claricent-psycare",  "Claricent Psycare"),
    "Closing_Deck-LOGO___2_":                              ("closing-deck",       "Closing Deck Services"),
    "Compaq Hopper":                                       ("compaq-hopper",      "Compaq Hopper"),
    "CompaqCubicsLogo01":                                  ("compaq-cubics",      "Compaq Cubics"),
    "Corefactors":                                         ("corefactors",        "Corefactors"),
    "Deecodes.io":                                         ("deecodes",           "Deecodes.io"),
    "Dialmia":                                             ("dialmia",            "Dialmia"),
    "Dr. Sasi Eye Care":                                   ("dr-sasi-eye-care",   "Dr. Sasi Eye Care"),
    "EverGrow_International_Accounting_Service_Pvt_Ltd":   ("evergrow",           "EverGrow International"),
    "Eyal":                                                ("eyal",               "EYAL"),
    "Farmgate Feeds":                                      ("farmgate-feeds",     "Farm Gate Feeds"),
    "Featherlite":                                         ("featherlite",        "Featherlite"),
    "FIXO CARE":                                           ("fixocare",           "FixoCare"),
    "GAIL (India) Limited":                                ("gail",               "GAIL (India)"),
    "Indecomm":                                            ("indecomm",           "Indecomm"),
    "Kalvium":                                             ("kalvium",            "Kalvium"),
    "Legal Brothers salem":                                ("legal-brothers",     "Legal Brothers Salem"),
    "Logo_-_KOODAM":                                       ("koodam",             "Koodam Architects"),
    "Maadhyamik_name_logo":                                ("maadhyamik",         "Maadhyamik Technologies"),
    "Metropolis":                                          ("metropolis",         "Metropolis"),
    "Native Speill":                                       ("nativespeill",       "nativespeill.com"),
    "Niyafin":                                             ("niyafin",            "Niyafin"),
    "NOA VECTRA Pvt Ltd":                                  ("noa-vectra",         "NOA Vectra"),
    "Nova":                                                ("novo",               "Novo Insurance Broking"),
    "OCTA Digi":                                           ("octadigi",           "OctaDigi"),
    "ooivu":                                               ("ooivu",              "OOiVU"),
    "OVR":                                                 ("ovr",                "OVR"),
    "Pay Agri":                                            ("payagri",            "payAgri"),
    "POD STAYS GLOBAL PRIVATE LIMITED":                    ("pod-stays",          "Pod Stays Global"),
    "SDQ LLC":                                             ("sdq",                "SDQ LLC"),
    "Sierra Digital":                                      ("sierra-digital",     "Sierra Digital"),
    "SOLAR_LOO":                                           ("solarsquare",        "SolarSquare"),
    "Spantag Technologies":                                ("spantag",            "Spantag Technologies"),
    "strader capital private limited":                     ("strader",            "Strader Capital"),
    "Think Orange":                                        ("think-orange",       "Think Orange"),
    "Thulir Technologies":                                 ("thulir",             "Thulir Technology"),
    "Trigen Wealth":                                       ("trigen-wealth",      "TriGen Wealth"),
    "v-one automation":                                    ("v-one-automation",   "V-One Automation"),
    "Vee-Healthtek":                                       ("vee-healthtek",      "Vee Healthtek"),
    "VI":                                                  ("vi",                 "Vi"),
    "Vulture Lines":                                       ("vulture-lines",      "Vulture Lines"),
    "Wealth India":                                        ("lgt-wealth-india",   "LGT Wealth India"),
    "Zentrophy":                                           ("zentropy",           "Zentropy"),
}


def border_bg(a):
    h, w = a.shape[:2]
    b = max(1, min(h, w) // 100)
    px = np.concatenate([a[:b].reshape(-1, 3), a[-b:].reshape(-1, 3),
                         a[:, :b].reshape(-1, 3), a[:, -b:].reshape(-1, 3)])
    return np.median(px, axis=0)


def knockout(a, bg, tol=34, feather=42):
    d = np.abs(a.astype(np.int16) - bg.astype(np.int16)).max(axis=2)
    lbl, _ = ndimage.label(d <= tol)
    edge = np.unique(np.concatenate([lbl[0], lbl[-1], lbl[:, 0], lbl[:, -1]]))
    edge = edge[edge != 0]
    if edge.size == 0:
        return np.full(a.shape[:2], 255, np.uint8)
    bgmask = np.isin(lbl, edge)
    alpha = np.where(bgmask, 0, 255).astype(np.float32)
    ring = ndimage.binary_dilation(bgmask, iterations=2) & ~bgmask
    alpha[ring] = (np.clip((d - tol) / float(feather), 0, 1) * 255)[ring]
    return alpha.astype(np.uint8)


def rounded_alpha(h, w, r):
    y, x = np.ogrid[:h, :w]
    keep = np.ones((h, w), bool)
    for cy, cx in ((r, r), (h - 1 - r, r), (r, w - 1 - r), (h - 1 - r, w - 1 - r)):
        outside = ((y - cy) ** 2 + (x - cx) ** 2) > r * r
        quad = ((y < r) if cy == r else (y > h - 1 - r)) & \
               ((x < r) if cx == r else (x > w - 1 - r))
        keep &= ~(outside & quad)
    return (keep * 255).astype(np.uint8)


def opaque_bbox(alpha, t=8):
    ys, xs = np.where(alpha > t)
    return None if ys.size == 0 else (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)


entries, report = [], []
for f in sorted(glob.glob(os.path.join(SRC, "*.jpg"))):
    stem = os.path.splitext(os.path.basename(f))[0]
    if stem not in META:
        print("  ?? no META entry for", stem); continue
    slug, name = META[stem]

    raw = Image.open(f)
    if raw.mode in ("RGBA", "LA", "P"):        # flatten any existing alpha onto white
        raw = raw.convert("RGBA")
        flat = Image.new("RGBA", raw.size, (255, 255, 255, 255))
        raw = Image.alpha_composite(flat, raw)
    im = raw.convert("RGB")
    a = np.asarray(im)

    bg = border_bg(a)
    neutral_light = bg.min() >= 195 and (bg.max() - bg.min()) <= 26
    if neutral_light and stem not in FORCE_TILE:
        rgb, alpha, kind = a, knockout(a, bg), "cutout"
    else:
        d = np.abs(a.astype(np.int16) - bg.astype(np.int16)).max(axis=2)
        bb = opaque_bbox(((d > 30) * 255).astype(np.uint8), 0)
        if bb:
            x0, y0, x1, y1 = bb
            m = int(round(0.11 * max(x1 - x0, y1 - y0)))
            rgb = a[max(0, y0 - m):min(a.shape[0], y1 + m),
                    max(0, x0 - m):min(a.shape[1], x1 + m)]
        else:
            rgb = a
        h, w = rgb.shape[:2]
        alpha, kind = rounded_alpha(h, w, max(4, int(0.10 * min(h, w)))), "tile"

    bb = opaque_bbox(alpha)
    if bb is None:
        print("  !! empty:", stem); continue
    x0, y0, x1, y1 = bb
    rgb, alpha = rgb[y0:y1, x0:x1], alpha[y0:y1, x0:x1]
    h, w = alpha.shape

    s = (TARGET_A / float(w * h)) ** 0.5
    if h * s < H_MIN: s = H_MIN / h
    if h * s > H_MAX: s = H_MAX / h
    if w * s > W_MAX: s = W_MAX / w
    nw, nh = max(1, round(w * s)), max(1, round(h * s))

    art = Image.fromarray(np.dstack([rgb, alpha[..., None]]).astype(np.uint8)).convert("RGBA")
    art = art.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (nw + 2 * PAD_X, CANVAS_H), (0, 0, 0, 0))
    canvas.paste(art, (PAD_X, (CANVAS_H - nh) // 2), art)
    canvas.save(os.path.join(OUT, slug + ".webp"), lossless=True, method=6)

    entries.append({"id": slug, "name": name, "w": canvas.width, "h": CANVAS_H, "tile": kind == "tile"})
    report.append((name, slug, canvas.size, (nw, nh), kind,
                   os.path.getsize(os.path.join(OUT, slug + ".webp")), nh / float(h)))

for r in sorted(report, key=lambda r: r[0].lower()):
    warn = f"  <- UPSCALED {r[6]:.1f}x, source too small" if r[6] > 1.02 else ""
    print(f"{r[0]:26s} {r[1]:20s} canvas={r[2][0]:4d}x{r[2][1]}  art={r[3][0]:4d}x{r[3][1]:<4d} {r[4]:6s} {r[5]//1024:4d}KB{warn}")
json.dump(entries, open(os.path.join(OUT, "_entries.json"), "w"), indent=1)
soft = [r[0] for r in report if r[6] > 1.02]
print(len(entries), "logos ->", OUT, "| total", sum(r[5] for r in report) // 1024, "KB")
if soft:
    print(f"\n{len(soft)} mark(s) enlarged past their source artwork (send higher-res files to fix):")
    for n in sorted(soft):
        print("   ", n)
