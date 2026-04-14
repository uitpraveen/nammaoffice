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
  terracotta: "#C4683C",
  olive: "#3D5A3E",
  warmWhite: "#FAF7F2",
  charcoal: "#2C2C2C",
  warmGray: "#6B6560",
  sand: "#F0EBE3",
  border: "#E5DFD6",
} as const;
