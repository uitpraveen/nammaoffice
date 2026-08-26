/** Client logos shown on the home page.
 *
 *  This list is exactly the artwork the client supplied, nothing else: the
 *  logos cropped out of the old Wix banner have all been dropped.
 *
 *  Every file under /public/images/clients/ is generated from the brand's raw
 *  artwork by scripts/build-client-logos.py: the artwork's own background is
 *  knocked out (or kept, when the coloured tile *is* the mark), the surrounding
 *  dead space is trimmed away, and the result is area-normalised so a square
 *  monogram and a long wordmark carry the same optical weight. Each file is a
 *  fixed 560px-tall lossless WebP canvas, so the UI only ever sets a height and
 *  every logo lands at the right relative size on its own.
 *
 *  Two things about that 560 are load-bearing:
 *
 *  - It is 5x the ~112px the wall paints, which leaves ~2.5x oversampling on a
 *    2x screen and ~1.7x on a 3x phone. An earlier 240px canvas gave only 1.07x
 *    on a 2x screen, and the marks visibly lost their edges. Do not shrink it.
 *  - The canvas is only slightly taller than its mark, so a height of H renders
 *    the average mark at roughly 0.56 * H.
 *
 *  Lossless matters too: Next re-encodes these to AVIF on the way out, so the
 *  file on disk has to be the last clean copy.
 *
 *  To add or remove a client, change the source artwork folder and re-run:
 *      python3 scripts/build-client-logos.py
 *  The script reports any mark it had to enlarge past its own source, which is
 *  now the only remaining cause of a soft logo on the wall.
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
   *  rather than knocked out (Vi's red square, Kalvium's black bar, ...). */
  tile?: boolean;
}

export const clients: Client[] = [
  { id: "3kts",               name: "3K Technology Services",  logo: "/images/clients/3kts.webp", w:  467, h: 560 },
  { id: "ability-associates", name: "Ability Associates",      logo: "/images/clients/ability-associates.webp", w:  893, h: 560 },
  { id: "apollo-diagnostics", name: "Apollo Diagnostics",      logo: "/images/clients/apollo-diagnostics.webp", w:  586, h: 560 },
  { id: "asian-holidays",     name: "Asian Holiday Resorts",   logo: "/images/clients/asian-holidays.webp", w:  820, h: 560 },
  { id: "bas-india",          name: "BAS India",               logo: "/images/clients/bas-india.webp", w: 1100, h: 560 },
  { id: "claricent-psycare",  name: "Claricent Psycare",       logo: "/images/clients/claricent-psycare.webp", w:  501, h: 560 },
  { id: "closing-deck",       name: "Closing Deck Services",   logo: "/images/clients/closing-deck.webp", w: 1301, h: 560 },
  { id: "compaq-cubics",      name: "Compaq Cubics",           logo: "/images/clients/compaq-cubics.webp", w:  618, h: 560, tile: true },
  { id: "compaq-hopper",      name: "Compaq Hopper",           logo: "/images/clients/compaq-hopper.webp", w:  609, h: 560 },
  { id: "corefactors",        name: "Corefactors",             logo: "/images/clients/corefactors.webp", w:  998, h: 560, tile: true },
  { id: "dialmia",            name: "Dialmia",                 logo: "/images/clients/dialmia.webp", w:  649, h: 560, tile: true },
  { id: "dr-sasi-eye-care",   name: "Dr. Sasi Eye Care",       logo: "/images/clients/dr-sasi-eye-care.webp", w:  483, h: 560, tile: true },
  { id: "evergrow",           name: "EverGrow International",  logo: "/images/clients/evergrow.webp", w:  447, h: 560 },
  { id: "eyal",               name: "EYAL",                    logo: "/images/clients/eyal.webp", w:  505, h: 560 },
  { id: "farmgate-feeds",     name: "Farm Gate Feeds",         logo: "/images/clients/farmgate-feeds.webp", w:  481, h: 560 },
  { id: "featherlite",        name: "Featherlite",             logo: "/images/clients/featherlite.webp", w:  843, h: 560, tile: true },
  { id: "fixocare",           name: "FixoCare",                logo: "/images/clients/fixocare.webp", w: 1114, h: 560 },
  { id: "gail",               name: "GAIL (India)",            logo: "/images/clients/gail.webp", w:  529, h: 560 },
  { id: "indecomm",           name: "Indecomm",                logo: "/images/clients/indecomm.webp", w:  606, h: 560 },
  { id: "kalvium",            name: "Kalvium",                 logo: "/images/clients/kalvium.webp", w: 1165, h: 560, tile: true },
  { id: "koodam",             name: "Koodam Architects",       logo: "/images/clients/koodam.webp", w:  515, h: 560 },
  { id: "legal-brothers",     name: "Legal Brothers Salem",    logo: "/images/clients/legal-brothers.webp", w:  467, h: 560 },
  { id: "lgt-wealth-india",   name: "LGT Wealth India",        logo: "/images/clients/lgt-wealth-india.webp", w:  625, h: 560 },
  { id: "maadhyamik",         name: "Maadhyamik Technologies", logo: "/images/clients/maadhyamik.webp", w:  814, h: 560 },
  { id: "metropolis",         name: "Metropolis",              logo: "/images/clients/metropolis.webp", w:  738, h: 560 },
  { id: "nativespeill",       name: "nativespeill.com",        logo: "/images/clients/nativespeill.webp", w: 1182, h: 560 },
  { id: "niyafin",            name: "Niyafin",                 logo: "/images/clients/niyafin.webp", w:  792, h: 560 },
  { id: "noa-vectra",         name: "NOA Vectra",              logo: "/images/clients/noa-vectra.webp", w:  481, h: 560 },
  { id: "novo",               name: "Novo Insurance Broking",  logo: "/images/clients/novo.webp", w:  964, h: 560 },
  { id: "octadigi",           name: "OctaDigi",                logo: "/images/clients/octadigi.webp", w:  467, h: 560 },
  { id: "ooivu",              name: "OOiVU",                   logo: "/images/clients/ooivu.webp", w:  651, h: 560, tile: true },
  { id: "ovr",                name: "OVR",                     logo: "/images/clients/ovr.webp", w:  394, h: 560, tile: true },
  { id: "payagri",            name: "payAgri",                 logo: "/images/clients/payagri.webp", w:  388, h: 560 },
  { id: "pod-stays",          name: "Pod Stays Global",        logo: "/images/clients/pod-stays.webp", w:  451, h: 560, tile: true },
  { id: "sdq",                name: "SDQ LLC",                 logo: "/images/clients/sdq.webp", w:  439, h: 560 },
  { id: "sierra-digital",     name: "Sierra Digital",          logo: "/images/clients/sierra-digital.webp", w:  492, h: 560 },
  { id: "solarsquare",        name: "SolarSquare",             logo: "/images/clients/solarsquare.webp", w:  547, h: 560 },
  { id: "spantag",            name: "Spantag Technologies",    logo: "/images/clients/spantag.webp", w:  916, h: 560 },
  { id: "strader",            name: "Strader Capital",         logo: "/images/clients/strader.webp", w:  560, h: 560 },
  { id: "think-orange",       name: "Think Orange",            logo: "/images/clients/think-orange.webp", w:  627, h: 560 },
  { id: "thulir",             name: "Thulir Technology",       logo: "/images/clients/thulir.webp", w:  557, h: 560 },
  { id: "trigen-wealth",      name: "TriGen Wealth",           logo: "/images/clients/trigen-wealth.webp", w:  858, h: 560 },
  { id: "v-one-automation",   name: "V-One Automation",        logo: "/images/clients/v-one-automation.webp", w:  488, h: 560 },
  { id: "vee-healthtek",      name: "Vee Healthtek",           logo: "/images/clients/vee-healthtek.webp", w:  539, h: 560 },
  { id: "vi",                 name: "Vi",                      logo: "/images/clients/vi.webp", w:  513, h: 560, tile: true },
  { id: "vulture-lines",      name: "Vulture Lines",           logo: "/images/clients/vulture-lines.webp", w:  617, h: 560 },
  { id: "zentropy",           name: "Zentropy",                logo: "/images/clients/zentropy.webp", w:  949, h: 560, tile: true },
];
