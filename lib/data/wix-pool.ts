/**
 * All real photographs from nammaoffice.com (Wix CDN).
 * Used as the single source of truth for image paths in data files.
 */

const W = "https://static.wixstatic.com/media/";

export const wix = {
  // Distinctive, named scenes
  team: W + "04fb8d_58b6bcab18c046aea219db1257f02bcb~mv2.jpeg",
  cabin: W + "04fb8d_67a613cf39c24e66be711bcba4a3a90b~mv2.jpeg",
  discussion: W + "04fb8d_d183ca1e783b4e7497f94e69d1a101d0~mv2.jpeg",
  ramakrishna: W + "04fb8d_d2ed9c2723e144a1805e5fa96960be20~mv2.jpeg",
  rajeshwari: W + "fd8c76_21bc99a38a974b748451300a1a57fa04~mv2.jpeg",
  newbus: W + "fd8c76_998821dc4c0c46deae1ff06c0a9614ad~mv2.png",

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

/** All images flat-listed (useful for galleries that need to cycle). */
export const wixAll: string[] = Object.values(wix);
