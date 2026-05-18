import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import MetaPixel from "@/components/analytics/MetaPixel";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nammaoffice.com"),
  title: {
    default: "NammaOffice — Premium Coworking Spaces in Salem, Trichy & Tirupur",
    template: "%s | NammaOffice",
  },
  description:
    "Premium coworking spaces, private cabins, managed offices, and meeting halls across Salem, Trichy, and Tirupur. Book a tour today.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "NammaOffice",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <SmoothScroll />
        <GoogleTagManager />
        {children}
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}
