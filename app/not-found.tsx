import Link from "next/link";
import { DM_Serif_Display, DM_Sans } from "next/font/google";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function NotFound() {
  return (
    <div
      className={`${dmSerifDisplay.variable} ${dmSans.variable} min-h-screen bg-warm-white flex items-center justify-center px-5`}
    >
      <div className="text-center max-w-lg">
        {/* Large 404 */}
        <p
          className="font-serif text-[120px] md:text-[160px] leading-none text-terracotta select-none"
          aria-hidden="true"
        >
          404
        </p>

        {/* Heading */}
        <h1 className="font-serif text-2xl md:text-3xl text-warm-charcoal mt-2 mb-4 leading-snug">
          Looks like this page took a workation
        </h1>

        {/* Description */}
        <p className="font-sans text-base text-warm-gray leading-relaxed mb-8">
          The page you&apos;re looking for has packed its bags and headed somewhere
          sunny. Don&apos;t worry - our best workspaces are still right here.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-brand bg-terracotta text-white hover:bg-terracotta-600 transition-all duration-200 font-sans font-medium inline-flex items-center justify-center px-8 py-4 text-lg"
          >
            Go Home
          </Link>
          <Link
            href="/#centres"
            className="rounded-brand border-2 border-olive text-olive hover:bg-olive hover:text-white transition-all duration-200 font-sans font-medium inline-flex items-center justify-center px-8 py-4 text-lg"
          >
            Browse Centres
          </Link>
        </div>
      </div>
    </div>
  );
}
