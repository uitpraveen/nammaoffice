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
  purple: "#2A1A4A",
  purpleDeep: "#1A0F33",
  purpleSoft: "#4A3270",
  gold: "#E8B547",
  goldDeep: "#C99935",
  cream: "#FAF7F0",
  surface: "#FFFFFF",
  ink: "#1A1330",
  inkSecondary: "#4F4664",
  inkMuted: "#8B83A0",
  border: "#E5E1D6",
  borderStrong: "#D6CFBE",
} as const;
