/**
 * All real photographs originally sourced from the live nammaoffice.com
 * (Wix CDN). They are now downloaded and self-hosted inside the app at
 * `public/images/wix/` - we no longer hot-link static.wixstatic.com.
 * This file is the single source of truth for image paths in data files.
 *
 * Inventory snapshot 2026-05-06: 109 unique image URLs were found in
 * the static HTML across the public site (home + franchise + plans +
 * private/open/meeting + 8 location detail pages + workation + events
 * + newsinsights + every form/registration page). Three were dropped as
 * stray vector/non-photo assets (wheelchair + reception icons) and one
 * team group-photo on request, leaving the set referenced below - split
 * into a hand-curated `wix` map of scenes that components want by name,
 * plus per-page pools that components can index into for a page-
 * appropriate photo.
 *
 * To localize a new image: drop the file in `public/images/wix/` and
 * reference it as `W + "<filename>"`. `W` is the local public path.
 */

const W = "/images/wix/";

/**
 * Hand-curated semantic shortcuts. Existing components import from
 * here by name (`wix.team`, `wix.cabin`, etc.) - keep these stable.
 */
export const wix = {
  // Distinctive, named scenes
  cabin: W + "04fb8d_67a613cf39c24e66be711bcba4a3a90b~mv2.jpeg",
  discussion: W + "04fb8d_d183ca1e783b4e7497f94e69d1a101d0~mv2.jpeg",
  ramakrishna: W + "04fb8d_d2ed9c2723e144a1805e5fa96960be20~mv2.jpeg",
  rajeshwari: W + "fd8c76_21bc99a38a974b748451300a1a57fa04~mv2.jpeg",
  newbus: W + "fd8c76_998821dc4c0c46deae1ff06c0a9614ad~mv2.png",

  // Salem Balaji / Rajeshwari shared hero image (used on the live
  // per-location pages on nammaoffice.com).
  balaji: W + "f7f019_f8b7942c38bd469780ba9c0e69086fab~mv2.jpeg",

  // Named scene photos surfaced via `alt` text on the live home page.
  dining: W + "04fb8d_0cdcbc70cb5d4268acdf338a42520dc4~mv2.jpeg",

  // General-purpose pool (interior shots, workstations, lounges)
  a: W + "fd8c76_f9722489d56d48b18c7dd9ec02c629bc~mv2.jpeg",
  b: W + "fd8c76_4abbd8b223bd40769e45fd95a7fab86b~mv2.jpeg",
  c: W + "fd8c76_5227acaf08804767adcb2cb06e6bd29c~mv2.jpeg",
  d: W + "fd8c76_e8a34fecd3f34010bc0dd3ec2e4101ed~mv2.jpeg",
  e: W + "fd8c76_663f3b9fb3164f65bdb59a98c33da458~mv2.jpeg",
  f: W + "fd8c76_ca54fea7b8a8485db0fd64e3162f518b~mv2.jpeg",
  g: W + "fd8c76_7fc3e4598dd04bb7a5af180cefc9bae1~mv2.jpeg",
  h: W + "fd8c76_6980b1eaf30345c28279fecef6e205cb~mv2.jpeg",
  i: W + "fd8c76_551d4c55472c4ef3932cd574c48a864c~mv2.jpeg",
  j: W + "fd8c76_85291bd726a444dd8e554e66bca98480~mv2.jpeg",
  k: W + "fd8c76_81c774f971564ee6b13c4870975bb931~mv2.jpeg",
  l: W + "fd8c76_7e5040faf8a04f58b5464571b5cd3eea~mv2.jpeg",
  m: W + "fd8c76_852a9f8695cf42cdbf9851bf34a5eeb6~mv2.jpeg",
  n: W + "fd8c76_ab72411ba34541698b01d58b304ed24f~mv2.png",
  o: W + "fd8c76_b44f4470548f4009b65d0147e449690f~mv2.png",
} as const;

/**
 * Home-page imagery - heroes, gallery rolls, lifestyle shots,
 * cafeteria, lounges, badges. 74 entries.
 *
 * Includes 3 GIF accents and several PNG transparencies (logos /
 * overlays) at the end. Filter by extension if a consumer needs
 * photos only.
 */
export const homePool: readonly string[] = [
  W + "04fb8d_03be2eb4ba8742a9914d231c3b01edbf~mv2.jpg",
  W + "04fb8d_0cdcbc70cb5d4268acdf338a42520dc4~mv2.jpeg",
  W + "04fb8d_1a7a2dfad4b84c22a294f102cff6c669~mv2.jpeg",
  W + "04fb8d_34ef7b92e6414fa7bda9c4fd0382e662~mv2.jpeg",
  W + "04fb8d_36149694609e40c4bb11f31f0a80dba4~mv2.jpeg",
  W + "04fb8d_45ebb4d3e61a42beb4253c93dd43fba7~mv2.jpeg",
  W + "04fb8d_71427ddf58fb4f8ca33a44ece6a55391~mv2.jpeg",
  W + "04fb8d_71679030277f4bb0855c487da9cf1736~mv2.jpeg",
  W + "04fb8d_9f42debd3e0b44f48cccca32bfc10f27~mv2.jpeg",
  W + "04fb8d_a058b392eac8432ab087c940083fd45c~mv2.jpeg",
  W + "04fb8d_b1ff75ce598e42379bf3193f56182d9c~mv2.jpeg",
  W + "04fb8d_b5fd1cdb49614ecdaf5c28192e9c080f~mv2.jpeg",
  W + "04fb8d_bb797a30e4b24b9ba2c31fa8769a4545~mv2.jpeg",
  W + "04fb8d_c41ba5c005b84f57994970227fa03a2a~mv2.jpg",
  W + "04fb8d_d2ff680160df482f9efc30b6dfdcbf48~mv2.jpg",
  W + "04fb8d_d32b63fc987c4fc7b544e9bcdab51f3c~mv2.jpeg",
  W + "fd8c76_016a747db81a43f1b3bea29f8e24363f~mv2.jpeg",
  W + "fd8c76_0d7b8ba865cf48168671dbbe325c4bac~mv2.jpeg",
  W + "fd8c76_11f20951644c484e96d6a61c74c58c03~mv2.jpeg",
  W + "fd8c76_1512758b68ae45f6a2d38dadff42c714~mv2.jpeg",
  W + "fd8c76_1a37645f42f64958885201f6c872f5eb~mv2.jpeg",
  W + "fd8c76_1b35ae9393464d56abe9e584c5667368~mv2.jpeg",
  W + "fd8c76_23431451d3dc42068a03733a5698184c~mv2.jpeg",
  W + "fd8c76_27bba0481c644ed49b3933e0d6a3a644~mv2.jpeg",
  W + "fd8c76_2b57a8b6f1b248c780d207cee189b0d6~mv2.jpeg",
  W + "fd8c76_4328959acf804e2084a580910d3db65b~mv2.jpeg",
  W + "fd8c76_5320a5d0f9cc404dac8a5397fbb0a8d9~mv2.jpeg",
  W + "fd8c76_69053cc670a84bf2b6b9748086a6c192~mv2.jpeg",
  W + "fd8c76_7188fafbb93b4b83b0edbf11ac365783~mv2.jpeg",
  W + "fd8c76_74a6d33639f946c8b5b5a0f34dda4056~mv2.jpeg",
  W + "fd8c76_7fdc3def9cfc4c828726f23deec5b7ba~mv2.jpeg",
  W + "fd8c76_856492ca2cc0460f9d569385dcd37096~mv2.jpeg",
  W + "fd8c76_99f59ffc2fcf450b80da4d7ed86f8874~mv2.jpeg",
  W + "fd8c76_a567df2dc08942fd94eb8b5cc16292a8~mv2.jpg",
  W + "fd8c76_a989392be7a148d78a8e7e34d8a25b36~mv2.jpeg",
  W + "fd8c76_a98eeeeb02e74cf29ae8be2ad8a0ed79~mv2.jpeg",
  W + "fd8c76_adfce44807574a80854621331513bb54~mv2.jpeg",
  W + "fd8c76_b063e87299be428e987bdb30d5bdd0dc~mv2.jpeg",
  W + "fd8c76_cc103dd727914e0281de78da9f3367ee~mv2.jpeg",
  W + "fd8c76_d016f9a45737481e8356ce4a6160e8f4~mv2.jpeg",
  W + "fd8c76_d52103781e3b4471baf59da33069f7ea~mv2.jpeg",
  W + "fd8c76_d83ef70381da4450bb512f9d15a09362~mv2.jpeg",
  W + "fd8c76_da9ba4ed2c194c8b8d35bbcfadcea51c~mv2.jpeg",
  W + "fd8c76_e9ba12135fff4004b1536c9f75aa762c~mv2.jpeg",
  W + "fd8c76_ec51171939344a288b02c17146419e92~mv2.jpeg",
  W + "fd8c76_efcbd8c72a154ce8be5263e11e3d59eb~mv2.jpeg",
  W + "fd8c76_f19b24b1920b49ca9de3847a7659ccf8~mv2.jpeg",
  W + "fd8c76_f5aef83229954645ba42733ee99d5f65~mv2.jpeg",
  W + "fd8c76_f70beedfdb6f4c6dabf49d4d6c2b4ba4~mv2.jpeg",
  W + "fd8c76_f74a00e95a5f44e298fb5e8fd11b4fd1~mv2.jpeg",
  W + "fd8c76_fccea0b54ba44cc58e0175725c69b6a2~mv2.jpeg",
  W + "fd8c76_fcfdb77631f947948f359da459f15793~mv2.jpeg",
  W + "fd8c76_fe7bcc0459834ff6b6746fb16f261770~mv2.jpeg",
  // PNG overlays / logo washes
  W + "fd8c76_269cd82503244cc6bbe8f9aa6a95bb20~mv2.png",
  W + "fd8c76_367b4edde38043adb5e2d58cb71790dc~mv2.png",
  W + "fd8c76_4e999ceb6b99492aab5e6114328b27ca~mv2.png",
  W + "fd8c76_85725eb1f0664d4482fcd0ba4b114bfa~mv2.png",
  W + "fd8c76_8bd10cb2e3cd40d18b5a12cd6e5d12f9~mv2.png",
  W + "fd8c76_ce4f33380056401fbbe457f3232e5ae3~mv2.png",
  W + "fd8c76_e6bfb6612d004330880f05a552f644ff~mv2.png",
  W + "fd8c76_e775a10ea9844ec79872b983b43b4374~mv2.png",
  W + "fd8c76_fb49882e7cf14257b25220f03ee49e79~mv2.png",
  // GIF accents (small UI animations)
  W + "fd8c76_012a65dfe11d41f5b3df952b1ceeaa03~mv2.gif",
  W + "fd8c76_28858792fe2b48f58445b82ca04cf344~mv2.gif",
  W + "fd8c76_6c914d5f2d2e4a45b601a4af36bcad93~mv2.gif",
];

/** Franchise-page graphics - partner logos, hero photos, info badges. 8 entries. */
export const franchisePool: readonly string[] = [
  W + "11062b_45f8b560a8b54c2396c4cdfc4c01992a~mv2.jpg",
  W + "11062b_f7afc017def84e5ba9a6ca14916bdd9c~mv2.jpg",
  W + "fd8c76_0f050ec81fad42bbab16bdbdf0c6fb02~mv2.jpg",
  W + "fd8c76_ebefd72faf4d4774bfbc687288905e25~mv2.jpg",
  W + "fd8c76_0e65668386724a6393f717e0c0f563b6~mv2.png",
  W + "fd8c76_4cfb890d35724b04957c51df6fe10be5~mv2.png",
  W + "fd8c76_636d474432ad4f54b6c5c67064086a7b~mv2.png",
  W + "fd8c76_78bb96c3669c490c8c2d34da27f70413~mv2.png",
];

/** News & insights article cards. 3 entries. */
export const newsPool: readonly string[] = [
  W + "04fb8d_c484232ab59a4a589cf3e80816bf34c1~mv2.jpg",
  W + "04fb8d_d685818ea84749ec9d935f3678d13e36~mv2.jpeg",
  W + "04fb8d_dd17262330a34d73bfd8c2c0494067dc~mv2.jpeg",
];

/** Workation page hero (Unsplash via Wix). 1 entry. */
export const workationPool: readonly string[] = [
  W + "nsplsh_c6f14e562ba84fb5ae26abdc04c2edb6~mv2.jpg",
];

/** Private-office page hero. 1 entry. */
export const privatePool: readonly string[] = [
  W + "11062b_b53bfa02d7114683a8de7a3c4fb446a5~mv2.jpg",
];

/** Events page hero. 1 entry. */
export const eventsPool: readonly string[] = [
  W + "04fb8d_397da2ebd4dc4c12962675cf6dfca47d~mv2.jpg",
];

/**
 * Every unique image hosted on nammaoffice.com - flat-listed for
 * galleries that need to cycle. Stable order: hand-curated semantic
 * shortcuts first, then per-page pools.
 */
export const wixAll: readonly string[] = [
  ...Object.values(wix),
  ...homePool,
  ...franchisePool,
  ...newsPool,
  ...workationPool,
  ...privatePool,
  ...eventsPool,
];

/**
 * The `04fb8d_*` Wix bucket photographs from the home page. Alt-text
 * inspection (`Our Team`, `Dedicated Cabin`, `Discussion room`,
 * `Dining Area`) confirms these belong to the TIDEL Salem flagship
 * centre. Used as the per-centre gallery for both TIDEL locations.
 */
export const tidelGallery: readonly string[] = [
  W + "04fb8d_03be2eb4ba8742a9914d231c3b01edbf~mv2.jpg",
  W + "04fb8d_1a7a2dfad4b84c22a294f102cff6c669~mv2.jpeg",
  W + "04fb8d_34ef7b92e6414fa7bda9c4fd0382e662~mv2.jpeg",
  W + "04fb8d_36149694609e40c4bb11f31f0a80dba4~mv2.jpeg",
  W + "04fb8d_45ebb4d3e61a42beb4253c93dd43fba7~mv2.jpeg",
  W + "04fb8d_71427ddf58fb4f8ca33a44ece6a55391~mv2.jpeg",
  W + "04fb8d_71679030277f4bb0855c487da9cf1736~mv2.jpeg",
  W + "04fb8d_9f42debd3e0b44f48cccca32bfc10f27~mv2.jpeg",
  W + "04fb8d_a058b392eac8432ab087c940083fd45c~mv2.jpeg",
  W + "04fb8d_b1ff75ce598e42379bf3193f56182d9c~mv2.jpeg",
  W + "04fb8d_b5fd1cdb49614ecdaf5c28192e9c080f~mv2.jpeg",
  W + "04fb8d_bb797a30e4b24b9ba2c31fa8769a4545~mv2.jpeg",
  W + "04fb8d_c41ba5c005b84f57994970227fa03a2a~mv2.jpg",
  W + "04fb8d_d32b63fc987c4fc7b544e9bcdab51f3c~mv2.jpeg",
];

/**
 * General interior pool - workstations, lounges, hallways, pantries,
 * meeting rooms drawn from the `fd8c76_*` Wix bucket. Cropped to
 * real photographs only (JPEG/JPG); the small PNG/GIF amenity icons
 * are excluded.
 */
export const interiorPool: readonly string[] = [
  W + "fd8c76_016a747db81a43f1b3bea29f8e24363f~mv2.jpeg",
  W + "fd8c76_0d7b8ba865cf48168671dbbe325c4bac~mv2.jpeg",
  W + "fd8c76_11f20951644c484e96d6a61c74c58c03~mv2.jpeg",
  W + "fd8c76_1512758b68ae45f6a2d38dadff42c714~mv2.jpeg",
  W + "fd8c76_1a37645f42f64958885201f6c872f5eb~mv2.jpeg",
  W + "fd8c76_1b35ae9393464d56abe9e584c5667368~mv2.jpeg",
  W + "fd8c76_23431451d3dc42068a03733a5698184c~mv2.jpeg",
  W + "fd8c76_27bba0481c644ed49b3933e0d6a3a644~mv2.jpeg",
  W + "fd8c76_2b57a8b6f1b248c780d207cee189b0d6~mv2.jpeg",
  W + "fd8c76_4328959acf804e2084a580910d3db65b~mv2.jpeg",
  W + "fd8c76_5320a5d0f9cc404dac8a5397fbb0a8d9~mv2.jpeg",
  W + "fd8c76_69053cc670a84bf2b6b9748086a6c192~mv2.jpeg",
  W + "fd8c76_7188fafbb93b4b83b0edbf11ac365783~mv2.jpeg",
  W + "fd8c76_74a6d33639f946c8b5b5a0f34dda4056~mv2.jpeg",
  W + "fd8c76_7fdc3def9cfc4c828726f23deec5b7ba~mv2.jpeg",
  W + "fd8c76_852a9f8695cf42cdbf9851bf34a5eeb6~mv2.jpeg",
  W + "fd8c76_856492ca2cc0460f9d569385dcd37096~mv2.jpeg",
  W + "fd8c76_99f59ffc2fcf450b80da4d7ed86f8874~mv2.jpeg",
  W + "fd8c76_a567df2dc08942fd94eb8b5cc16292a8~mv2.jpg",
  W + "fd8c76_a989392be7a148d78a8e7e34d8a25b36~mv2.jpeg",
  W + "fd8c76_a98eeeeb02e74cf29ae8be2ad8a0ed79~mv2.jpeg",
  W + "fd8c76_adfce44807574a80854621331513bb54~mv2.jpeg",
  W + "fd8c76_b063e87299be428e987bdb30d5bdd0dc~mv2.jpeg",
  W + "fd8c76_cc103dd727914e0281de78da9f3367ee~mv2.jpeg",
  W + "fd8c76_d016f9a45737481e8356ce4a6160e8f4~mv2.jpeg",
  W + "fd8c76_d52103781e3b4471baf59da33069f7ea~mv2.jpeg",
  W + "fd8c76_d83ef70381da4450bb512f9d15a09362~mv2.jpeg",
  W + "fd8c76_da9ba4ed2c194c8b8d35bbcfadcea51c~mv2.jpeg",
  W + "fd8c76_e9ba12135fff4004b1536c9f75aa762c~mv2.jpeg",
  W + "fd8c76_ec51171939344a288b02c17146419e92~mv2.jpeg",
  W + "fd8c76_efcbd8c72a154ce8be5263e11e3d59eb~mv2.jpeg",
  W + "fd8c76_f19b24b1920b49ca9de3847a7659ccf8~mv2.jpeg",
  W + "fd8c76_f5aef83229954645ba42733ee99d5f65~mv2.jpeg",
  W + "fd8c76_f70beedfdb6f4c6dabf49d4d6c2b4ba4~mv2.jpeg",
  W + "fd8c76_f74a00e95a5f44e298fb5e8fd11b4fd1~mv2.jpeg",
  W + "fd8c76_fccea0b54ba44cc58e0175725c69b6a2~mv2.jpeg",
  W + "fd8c76_fcfdb77631f947948f359da459f15793~mv2.jpeg",
  W + "fd8c76_fe7bcc0459834ff6b6746fb16f261770~mv2.jpeg",
];


/**
 * TIDEL NEO Salem - real centre photographs supplied by the client
 * (1st / 2nd / 3rd floor), resized + optimized and self-hosted. This is the
 * dedicated Salem TIDEL gallery (Tirupur keeps using `tidelGallery`).
 */
export const tidelSalemGallery: readonly string[] = [
  W + "tidel-salem/tidel-salem-01.jpg",
  W + "tidel-salem/tidel-salem-02.jpg",
  W + "tidel-salem/tidel-salem-03.jpg",
  W + "tidel-salem/tidel-salem-04.jpg",
  W + "tidel-salem/tidel-salem-05.jpg",
  W + "tidel-salem/tidel-salem-06.jpg",
  W + "tidel-salem/tidel-salem-07.jpg",
  W + "tidel-salem/tidel-salem-08.jpg",
  W + "tidel-salem/tidel-salem-09.jpg",
  W + "tidel-salem/tidel-salem-10.jpg",
  W + "tidel-salem/tidel-salem-11.jpg",
  W + "tidel-salem/tidel-salem-12.jpg",
  W + "tidel-salem/tidel-salem-13.jpg",
  W + "tidel-salem/tidel-salem-14.jpg",
  W + "tidel-salem/tidel-salem-15.jpg",
  W + "tidel-salem/tidel-salem-16.jpg",
  W + "tidel-salem/tidel-salem-17.jpg",
  W + "tidel-salem/tidel-salem-18.jpg",
  W + "tidel-salem/tidel-salem-19.jpg",
  W + "tidel-salem/tidel-salem-20.jpg",
  W + "tidel-salem/tidel-salem-21.jpg",
  W + "tidel-salem/tidel-salem-22.jpg",
  W + "tidel-salem/tidel-salem-23.jpg",
  W + "tidel-salem/tidel-salem-24.jpg",
  W + "tidel-salem/tidel-salem-25.jpg",
  W + "tidel-salem/tidel-salem-26.jpg",
  W + "tidel-salem/tidel-salem-27.jpg",
  W + "tidel-salem/tidel-salem-28.jpg",
  W + "tidel-salem/tidel-salem-29.jpg",
  W + "tidel-salem/tidel-salem-30.jpg",
  W + "tidel-salem/tidel-salem-31.jpg",
  W + "tidel-salem/tidel-salem-32.jpg",
  W + "tidel-salem/tidel-salem-33.jpg",
  W + "tidel-salem/tidel-salem-34.jpg",
  W + "tidel-salem/tidel-salem-35.jpg",
  W + "tidel-salem/tidel-salem-36.jpg",
];


/**
 * TIDEL NEO Tirupur - real centre photographs supplied by the client,
 * cropped (letterbox black bars removed) + optimized and self-hosted.
 * Dedicated Tirupur gallery (Salem uses tidelSalemGallery).
 */
export const tidelTirupurGallery: readonly string[] = [
  // -10 leads: it is the representative shot shown on the city-page card and as
  // the detail-page hero.
  W + "tidel-tirupur/tidel-tirupur-10.jpg",
  W + "tidel-tirupur/tidel-tirupur-01.jpg",
  W + "tidel-tirupur/tidel-tirupur-02.jpg",
  W + "tidel-tirupur/tidel-tirupur-03.jpg",
  W + "tidel-tirupur/tidel-tirupur-04.jpg",
  W + "tidel-tirupur/tidel-tirupur-05.jpg",
  W + "tidel-tirupur/tidel-tirupur-06.jpg",
  W + "tidel-tirupur/tidel-tirupur-07.jpg",
  W + "tidel-tirupur/tidel-tirupur-08.jpg",
  W + "tidel-tirupur/tidel-tirupur-09.jpg",
  W + "tidel-tirupur/tidel-tirupur-11.jpg",
  W + "tidel-tirupur/tidel-tirupur-12.jpg",
  W + "tidel-tirupur/tidel-tirupur-13.jpg",
];


/**
 * Asha Grand, Trichy - real centre photographs from the client handover
 * deck (slides 8-22), optimized and self-hosted. Dedicated Trichy gallery.
 */
export const ashaGrandGallery: readonly string[] = [
  W + "asha-grand/asha-grand-01.jpg",
  W + "asha-grand/asha-grand-02.jpg",
  W + "asha-grand/asha-grand-03.jpg",
  W + "asha-grand/asha-grand-04.jpg",
  W + "asha-grand/asha-grand-05.jpg",
  W + "asha-grand/asha-grand-06.jpg",
  W + "asha-grand/asha-grand-07.jpg",
  W + "asha-grand/asha-grand-08.jpg",
  W + "asha-grand/asha-grand-09.jpg",
  W + "asha-grand/asha-grand-10.jpg",
  W + "asha-grand/asha-grand-11.jpg",
  W + "asha-grand/asha-grand-12.jpg",
  W + "asha-grand/asha-grand-13.jpg",
  W + "asha-grand/asha-grand-14.jpg",
  W + "asha-grand/asha-grand-15.jpg",
  W + "asha-grand/asha-grand-16.jpg",
  W + "asha-grand/asha-grand-17.jpg",
  W + "asha-grand/asha-grand-18.jpg",
  W + "asha-grand/asha-grand-19.jpg",
  W + "asha-grand/asha-grand-20.jpg",
  W + "asha-grand/asha-grand-21.jpg",
  W + "asha-grand/asha-grand-22.jpg",
  W + "asha-grand/asha-grand-23.jpg",
  W + "asha-grand/asha-grand-24.jpg",
  W + "asha-grand/asha-grand-25.jpg",
];


/**
 * Anushka Tower (Fairlands), Salem - real centre photographs supplied by
 * the client, self-hosted. Dedicated Fairlands gallery.
 */
export const anushkaGallery: readonly string[] = [
  W + "anushka/anushka-01.webp",
  W + "anushka/anushka-02.webp",
  W + "anushka/anushka-03.webp",
  W + "anushka/anushka-04.webp",
  W + "anushka/anushka-05.webp",
  W + "anushka/anushka-06.webp",
];


/**
 * Rajeshwari Towers, Salem - real centre photographs supplied by the
 * client, self-hosted. Dedicated Rajeshwari gallery.
 */
export const rajeshwariGallery: readonly string[] = [
  W + "rajeshwari/rajeshwari-01.webp",
  W + "rajeshwari/rajeshwari-02.webp",
  W + "rajeshwari/rajeshwari-03.webp",
  W + "rajeshwari/rajeshwari-04.webp",
  W + "rajeshwari/rajeshwari-05.webp",
  W + "rajeshwari/rajeshwari-06.webp",
];


/**
 * Balaji Tower (Ramakrishna Road), Salem - real centre photographs from
 * the client, self-hosted. Dedicated Balaji Tower gallery.
 */
export const balajiGallery: readonly string[] = [
  W + "balaji/balaji-01.webp",
  W + "balaji/balaji-02.webp",
  W + "balaji/balaji-03.webp",
  W + "balaji/balaji-04.webp",
  W + "balaji/balaji-05.webp",
  W + "balaji/balaji-06.webp",
  W + "balaji/balaji-07.webp",
  W + "balaji/balaji-08.webp",
  W + "balaji/balaji-09.webp",
];
