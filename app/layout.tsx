import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
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

/**
 * Satoshi from Indian Type Foundry / Fontshare. Self-hosted: .woff2
 * files live in `public/fonts/`. The CSS variable is named `--font-serif`
 * for historical compatibility — every component reads from it.
 */
const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nammaoffice.com"),
  title: {
    default: "NammaOffice — Premium Coworking Spaces in Salem, Trichy, Tirupur, Erode & Hosur",
    template: "%s | NammaOffice",
  },
  description:
    "Premium coworking spaces, private cabins, managed offices, and meeting halls across Salem, Trichy, Tirupur, Erode and Hosur. Book a tour today.",
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
    <html lang="en" className={`${inter.variable} ${satoshi.variable}`}>
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
