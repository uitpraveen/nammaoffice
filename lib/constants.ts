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
  plum: "#5C2D5C",
  plumDeep: "#2E1230",
  plumSoft: "#724772",
  magenta: "#D72660",
  magentaDeep: "#B91D52",
  cream: "#FAF7F0",
  surface: "#FFFFFF",
  ink: "#1F1320",
  inkSecondary: "#5A4A5C",
  inkMuted: "#9A8A9C",
  border: "#E5E1D6",
  borderStrong: "#D6CFBE",
} as const;
