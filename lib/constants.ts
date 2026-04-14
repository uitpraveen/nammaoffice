export const BRAND = {
  name: "NammaOffice",
  tagline: "Your Workspace, Your City, Your Community",
  description:
    "Premium coworking spaces, private cabins, managed offices, and meeting halls across Salem, Trichy, and Tirupur.",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+91 9092109213",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919092109213",
  email: "info@nammaoffice.com",
  social: {
    instagram: "https://instagram.com/nammaoffice",
    linkedin: "https://linkedin.com/company/nammaoffice",
    facebook: "https://facebook.com/nammaoffice",
    youtube: "https://youtube.com/@nammaoffice",
  },
} as const;

export const COLORS = {
  wine: "#7C2D3E",
  charcoal: "#2D2926",
  warmWhite: "#F9F6F1",
  warmGray: "#6B6057",
  sand: "#F0EBE1",
  border: "#DDD6CC",
  richBlack: "#1A1A1A",
  accentGold: "#B8860B",
} as const;
