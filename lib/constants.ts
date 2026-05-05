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
  navy: "#0B2545",
  navyDeep: "#08182E",
  navySoft: "#1B365D",
  gold: "#C8A24A",
  goldDeep: "#A88533",
  cream: "#FAF7F0",
  surface: "#FFFFFF",
  ink: "#0F172A",
  inkSecondary: "#475569",
  inkMuted: "#94A3B8",
  border: "#E5E1D6",
  borderStrong: "#D6CFBE",
} as const;
