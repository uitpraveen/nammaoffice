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
