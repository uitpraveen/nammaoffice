export const BRAND = {
  name: "NammaOffice",
  tagline: "Your Workspace, Your City, Your Community",
  description:
    "Premium coworking spaces, private cabins, managed offices, and meeting halls across Salem, Trichy, Tirupur, Erode and Hosur.",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+91 9092109213",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919092109213",
  email: "info@nammaoffice.com",
  social: {
    instagram: "https://www.instagram.com/namma_office/",
    linkedin: "https://www.linkedin.com/company/namma-office/",
    facebook: "https://www.facebook.com/profile.php?id=61563468869673",
    youtube: "https://youtube.com/@nammaoffice",
  },
  // TODO: swap with the canonical Google Business reviews URL once
  // confirmed (e.g. https://g.page/r/<id>/review). The search fallback
  // lands every visitor on the GMB knowledge panel for now.
  googleReviewsUrl:
    "https://www.google.com/search?q=NammaOffice+coworking+reviews",
} as const;

export const COLORS = {
  black: "#0E0E0E",
  blackDeep: "#050505",
  blackSoft: "#1A1A1A",
  brick: "#B8553A",
  brickDeep: "#8E3F29",
  cream: "#FAF7F0",
  surface: "#FFFFFF",
  ink: "#1A1817",
  inkSecondary: "#5C5852",
  inkMuted: "#9C988F",
  border: "#E5E1D6",
  borderStrong: "#D6CFBE",
} as const;
