/** Client logos shown on the home page. Sourced from the original
 *  client banner on nammaoffice.com (Wix CDN); each entry was cropped
 *  out of the source image into its own PNG under /public/images/clients/.
 *  Order roughly matches the layout on the live banner. */
export interface Client {
  id: string;
  name: string;
  /** Logo path under /public. */
  logo: string;
  /** True if the source artwork already has a coloured/dark background
   *  (e.g. Sierra Digital's blue rectangle, Vi's black square, Compaq
   *  Hopper's red box). The component renders these without the
   *  default white wash so they don't double-up on backgrounds. */
  darkBg?: boolean;
}

export const clients: Client[] = [
  { id: "sierra-digital",      name: "Sierra Digital",          logo: "/images/clients/sierra-digital.png",      darkBg: true },
  { id: "payagri",             name: "payAgri",                 logo: "/images/clients/payagri.png" },
  { id: "farm-connect",        name: "Farm Connect",            logo: "/images/clients/farm-connect.png" },
  { id: "fixocare",            name: "FixoCare",                logo: "/images/clients/fixocare.png" },
  { id: "dr-sasi-eye-care",    name: "Dr. Sasi Eye Care",       logo: "/images/clients/dr-sasi-eye-care.png" },
  { id: "lgt-wealth-india",    name: "LGT Wealth India",        logo: "/images/clients/lgt-wealth-india.png" },
  { id: "nativespecial",       name: "nativespecial.com",       logo: "/images/clients/nativespecial.png" },
  { id: "metropolis",          name: "Metropolis",              logo: "/images/clients/metropolis.png",          darkBg: true },
  { id: "apollo-diagnostics",  name: "Apollo Diagnostics",      logo: "/images/clients/apollo-diagnostics.png" },
  { id: "thulir-technology",   name: "Thulir Technology",       logo: "/images/clients/thulir-technology.png" },
  { id: "vee-healthtek",       name: "Vee Healthtek",           logo: "/images/clients/vee-healthtek.png" },
  { id: "indecomm",            name: "Indecomm",                logo: "/images/clients/indecomm.png" },
  { id: "vi",                  name: "Vi",                      logo: "/images/clients/vi.png",                  darkBg: true },
  { id: "eyal",                name: "EYAL",                    logo: "/images/clients/eyal.png" },
  { id: "asian-holiday",       name: "Asian Holiday Resorts",   logo: "/images/clients/asian-holiday.png" },
  { id: "gail",                name: "GAIL",                    logo: "/images/clients/gail.png" },
  { id: "spantag",             name: "Spantag Technologies",    logo: "/images/clients/spantag.png" },
  { id: "compaq-hopper",       name: "Compaq Hopper EV",        logo: "/images/clients/compaq-hopper.png",       darkBg: true },
  { id: "vulture-lines",       name: "Vulture Lines",           logo: "/images/clients/vulture-lines.png" },
  { id: "ovr",                 name: "OVR",                     logo: "/images/clients/ovr.png" },
  { id: "deecodes",            name: "Deecodes.io",             logo: "/images/clients/deecodes.png" },
  { id: "strader",             name: "Strader",                 logo: "/images/clients/strader.png" },
];
