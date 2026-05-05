import Image from "next/image";
import { wix } from "@/lib/data/wix-pool";

/**
 * Three horizontal infinite-scroll rows:
 *  • Row 1 — workspace photo cards (left ←)
 *  • Row 2 — giant background keywords (right →)
 *  • Row 3 — more photos + hashtag pills (left ←)
 *
 * Pure CSS animation. Each row's children are duplicated (rendered twice in
 * the DOM) so the keyframe can translate from `0` to `-50%` and create a
 * seamless loop. Pauses on hover and on `prefers-reduced-motion`.
 */

const ROW_1_PHOTOS = [
  { src: wix.cabin, alt: "Private cabin" },
  { src: wix.discussion, alt: "Discussion room" },
  { src: wix.b, alt: "Open desk" },
  { src: wix.team, alt: "Our team" },
  { src: wix.e, alt: "Managed office" },
  { src: wix.h, alt: "Lounge" },
];

const ROW_2_KEYWORDS = [
  "SALEM",
  "·",
  "TRICHY",
  "·",
  "TIRUPUR",
  "·",
  "COWORKING",
  "·",
  "PRIVATE CABIN",
  "·",
  "MEETING HALL",
  "·",
  "MANAGED OFFICE",
];

interface Row3Item {
  type: "photo" | "tag";
  src?: string;
  alt?: string;
  text?: string;
}

const ROW_3_ITEMS: Row3Item[] = [
  { type: "tag", text: "#FocusedWork" },
  { type: "photo", src: wix.ramakrishna, alt: "Ramakrishna Road" },
  { type: "tag", text: "#PremiumSpaces" },
  { type: "photo", src: wix.f, alt: "Lounge" },
  { type: "tag", text: "#TamilNadu" },
  { type: "photo", src: wix.newbus, alt: "TIDEL NEO" },
  { type: "tag", text: "#FlexiblePlans" },
  { type: "photo", src: wix.j, alt: "Workspace" },
  { type: "tag", text: "#FreshCoffee" },
  { type: "photo", src: wix.l, alt: "Discussion" },
  { type: "tag", text: "#FastInternet" },
];

export function MarqueeShowcase() {
  return (
    <section className="section-padding bg-[var(--color-bg)] overflow-hidden">
      <div className="content-width">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow">In motion</p>
          <h2 className="display-lg mt-3 text-[var(--color-ink)]">
            Spaces that{" "}
            <span className="italic font-normal text-[var(--color-accent)]">
              work for you.
            </span>
          </h2>
          <p className="mt-4 text-[16px] text-[var(--color-ink-secondary)] leading-relaxed">
            A glimpse of every kind of work that happens inside a NammaOffice
            centre.
          </p>
        </div>
      </div>

      <div className="marquee-stack flex flex-col gap-6 md:gap-10">
        {/* Row 1 — photos, left direction */}
        <Marquee direction="left" speed={50}>
          {ROW_1_PHOTOS.map((p, i) => (
            <div
              key={`r1-${i}`}
              className="relative shrink-0 w-[280px] md:w-[340px] aspect-[16/10] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)] border border-[var(--color-border)]"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="340px"
                className="object-cover"
                quality={70}
              />
            </div>
          ))}
        </Marquee>

        {/* Row 2 — giant background text, right direction */}
        <Marquee direction="right" speed={70}>
          {ROW_2_KEYWORDS.map((word, i) => (
            <span
              key={`r2-${i}`}
              className="shrink-0 text-[80px] md:text-[120px] lg:text-[160px] font-bold tracking-[-0.04em] leading-none whitespace-nowrap select-none"
              style={{
                color: "transparent",
                WebkitTextStroke: "1.5px var(--color-accent)",
              }}
            >
              {word}
            </span>
          ))}
        </Marquee>

        {/* Row 3 — mixed photos + hashtag pills, left direction */}
        <Marquee direction="left" speed={40}>
          {ROW_3_ITEMS.map((item, i) => {
            if (item.type === "photo") {
              return (
                <div
                  key={`r3-${i}`}
                  className="relative shrink-0 w-[220px] md:w-[260px] aspect-[5/3] rounded-2xl overflow-hidden bg-[var(--color-surface-alt)] border border-[var(--color-border)]"
                >
                  <Image
                    src={item.src!}
                    alt={item.alt!}
                    fill
                    sizes="260px"
                    className="object-cover"
                    quality={65}
                  />
                </div>
              );
            }
            return (
              <span
                key={`r3-${i}`}
                className="shrink-0 inline-flex items-center h-12 md:h-14 px-6 md:px-7 rounded-full bg-gradient-accent text-white text-[18px] md:text-[22px] font-bold tracking-tight whitespace-nowrap shadow-[0_4px_16px_rgba(31,181,224,0.25)]"
              >
                {item.text}
              </span>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
}

interface MarqueeProps {
  direction: "left" | "right";
  /** seconds for one full loop — bigger = slower */
  speed: number;
  children: React.ReactNode;
}

function Marquee({ direction, speed, children }: MarqueeProps) {
  const animClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="marquee-row group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,#000_5%,#000_95%,transparent_100%)]">
      <div
        className={`flex w-max ${animClass} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s` }}
      >
        {/* Two identical groups so translate(-50%) produces a seamless loop. */}
        <div className="flex gap-4 md:gap-6 shrink-0 pr-4 md:pr-6">
          {children}
        </div>
        <div className="flex gap-4 md:gap-6 shrink-0 pr-4 md:pr-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
