import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import MetaPixel from "@/components/analytics/MetaPixel";

const cormorant = Cormorant({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
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
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body>
        <GoogleTagManager />
        {children}
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}
