"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Check,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  GraduationCap,
  Headphones,
  HandCoins,
  LandPlot,
  Mail,
  Megaphone,
  Ruler,
  ShieldCheck,
  Wrench,
  MapPin,
  Minus,
  Phone,
  Plus,
  Sparkles,
  Timer,
} from "lucide-react";
import { FranchiseForm } from "@/components/forms/FranchiseForm";
import {
  franchiseBenefits,
  franchiseInvestment,
  franchiseProcess,
  franchiseSupportPhases,
} from "@/lib/data/franchise";
import { getFaqsByCategory } from "@/lib/data/faqs";

const franchiseFaqs = getFaqsByCategory("franchise");

const benefitIcons = [
  ShieldCheck,    // Proven Brand
  TrendingUp,     // Strong ROI
  Headphones,     // Full Operational Support
  Wrench,         // Technology Platform
  GraduationCap,  // Staff Training
  Megaphone,      // Marketing & Lead Generation
  Sparkles,       // Interior Design & Fitout
  Users,          // Exclusive Territory
];

export default function FranchisePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--canvas)" }}>
      <Hero />
      <StatsBand />
      <WhyPartner />
      <WhoCanApply />
      <Inclusions />
      <InvestmentTerms />
      <Process />
      <Support />
      <ApplicationForm />
      <FAQSection />
      <CTA />
    </div>
  );
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 pt-10 lg:pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hairline"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <span className="pulse-dot" />
              <span
                className="eyebrow"
                style={{ letterSpacing: "0.14em" }}
              >
                Now inviting partners · FY 25–26
              </span>
            </div>
            <h1 className="display mt-6 text-[44px] sm:text-[60px] lg:text-[76px]" style={{ color: "var(--ink)" }}>
              Own a <span className="display-italic">premium</span>
              <br />
              workspace brand
              <br />
              in your city.
            </h1>
            <p
              className="mt-6 text-[17px] lg:text-[18px] max-w-[560px]"
              style={{ color: "var(--ink-muted)" }}
            >
              Partner with NammaOffice to launch a flagship coworking centre — backed by a proven playbook, member demand, and end-to-end support from real estate to operations.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-md text-[14px] font-semibold text-white"
                style={{
                  background: "var(--accent)",
                  boxShadow: "0 8px 24px -10px rgba(168,72,46,0.55)",
                }}
              >
                Apply for a franchise
                <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              </a>
              <a
                href="#why-partner"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-md text-[14px] font-semibold border hairline"
                style={{ background: "var(--card)", color: "var(--ink)", borderColor: "var(--border)" }}
              >
                Why partner with us
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]" style={{ color: "var(--ink-dim)" }}>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} /> Proven across 10 centres
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} /> End-to-end playbook
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} /> Tier-2 first
              </div>
            </div>
          </motion.div>

          {/* Right — image + non-financial floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative h-[520px] lg:h-[620px]"
          >
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border hairline shadow-2xl"
              style={{ borderColor: "var(--border)" }}
            >
              <Image
                src="/images/elevate/franchise-hero.jpg"
                alt="Premium coworking lobby"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.35))",
                }}
              />
            </div>

            {/* Floating tag — Inviting partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="absolute -left-3 lg:-left-8 top-10 w-[230px] rounded-xl p-4 backdrop-blur-xl border"
              style={{
                background: "rgba(255,255,255,0.92)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em]"
                style={{ color: "var(--ink-dim)" }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                Inviting partners
              </div>
              <div className="mt-2 display text-[26px] leading-tight" style={{ color: "var(--ink)" }}>
                FY 25–26
              </div>
              <div className="text-[12px] mt-1" style={{ color: "var(--ink-muted)" }}>
                Tier-2 cities across South India.
              </div>
            </motion.div>

            {/* Floating mini stat — centres & cities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="absolute -right-3 lg:-right-6 bottom-10 w-[260px] rounded-xl p-4 backdrop-blur-xl border"
              style={{
                background: "rgba(255,255,255,0.92)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em]"
                style={{ color: "var(--ink-dim)" }}
              >
                <span>Operating network</span>
                <MapPin className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="display text-[36px] leading-none" style={{ color: "var(--ink)" }}>
                    10
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.14em] mt-2" style={{ color: "var(--ink-dim)" }}>
                    Centres
                  </div>
                </div>
                <div>
                  <div className="display text-[36px] leading-none" style={{ color: "var(--ink)" }}>
                    5
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.14em] mt-2" style={{ color: "var(--ink-dim)" }}>
                    Cities live
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── STATS BAND ───────────────────────── */
function StatsBand() {
  const stats = [
    { k: "10", l: "Operating centres" },
    { k: "5", l: "Cities live" },
  ];
  return (
    <section className="relative" style={{ background: "var(--ink-band)", color: "#fff" }}>
      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 py-12 grid grid-cols-2 divide-x divide-white/10">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="px-6 py-4 lg:py-2"
          >
            <div className="display text-[44px] lg:text-[54px] leading-none">{s.k}</div>
            <div className="text-[12px] uppercase tracking-[0.16em] text-white/60 mt-2">
              {s.l}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── WHY PARTNER ───────────────────────── */
function WhyPartner() {
  return (
    <section id="why-partner" className="py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow">Why partner with us</p>
            <h2 className="display mt-3 text-[36px] lg:text-[52px]" style={{ color: "var(--ink)" }}>
              A workspace business,{" "}
              <span className="display-italic">without the guesswork.</span>
            </h2>
            <p className="mt-5 max-w-[440px]" style={{ color: "var(--ink-muted)" }}>
              We&apos;ve spent years engineering every part of the centre — from
              layout and lease negotiations to community programming. You
              inherit the entire system.
            </p>
            <div
              className="mt-8 relative rounded-xl overflow-hidden border hairline aspect-[16/10]"
              style={{ borderColor: "var(--border)" }}
            >
              <Image
                src="/images/elevate/franchise-interior.jpg"
                alt="Coworking interior"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {franchiseBenefits.map((benefit, i) => {
              const Icon = benefitIcons[i] ?? ShieldCheck;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ delay: (i % 4) * 0.08, duration: 0.6 }}
                  className="group relative p-7 rounded-xl border hairline overflow-hidden transition-all hover:-translate-y-1"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "var(--accent-bg)" }}
                  />
                  <div className="relative">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                      style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="display text-[22px] leading-tight" style={{ color: "var(--ink)" }}>
                      {benefit.title}
                    </h3>
                    <p className="text-[15px] mt-3" style={{ color: "var(--ink-muted)" }}>
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── INCLUSIONS ───────────────────────── */
function Inclusions() {
  const rows = [
    { k: "Site selection & lease", v: "End to end", icon: MapPin },
    { k: "Brand toolkit & playbook", v: "Day one", icon: Sparkles },
    { k: "Operations training", v: "30-day immersion", icon: GraduationCap },
    { k: "Member pipeline & marketing", v: "Pre-launch", icon: Megaphone },
    { k: "Technology platform", v: "Fully included", icon: Wrench },
    { k: "Dedicated success manager", v: "Ongoing", icon: Headphones },
  ];
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-16 items-start">
          <div>
            <p className="eyebrow">What you inherit</p>
            <h2
              className="display mt-3 text-[36px] lg:text-[52px]"
              style={{ color: "var(--ink)" }}
            >
              Built systems,{" "}
              <span className="display-italic">in your city.</span>
            </h2>
            <p
              className="mt-5 text-[16px] max-w-[520px] leading-[1.6]"
              style={{ color: "var(--ink-muted)" }}
            >
              Years of operating know-how, packaged into a turnkey system you
              inherit on day one. You bring the city — we bring everything else.
            </p>

            <div
              className="mt-8 rounded-2xl border hairline overflow-hidden divide-y"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              {rows.map((r, i) => (
                <motion.div
                  key={r.k}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center"
                      style={{
                        background: "var(--accent-bg)",
                        color: "var(--accent)",
                      }}
                    >
                      <r.icon className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <span
                      className="text-[14px]"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {r.k}
                    </span>
                  </div>
                  <span
                    className="display text-[16px]"
                    style={{ color: "var(--ink)" }}
                  >
                    {r.v}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative pb-16 lg:pb-0">
            <div
              className="relative rounded-2xl overflow-hidden border hairline h-[420px] lg:h-[560px]"
              style={{ borderColor: "var(--border)" }}
            >
              <Image
                src="/images/elevate/franchise-facade.jpg"
                alt="NammaOffice flagship facade"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,10,10,0) 55%, rgba(10,10,10,0.30))",
                }}
              />
            </div>

            {/* Floating reference card */}
            <div
              className="absolute left-4 right-4 -bottom-6 lg:left-8 lg:right-8 lg:-bottom-10 rounded-xl p-6 border hairline"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                boxShadow:
                  "0 1px 0 rgba(0,0,0,0.04), 0 28px 50px -20px rgba(0,0,0,0.18)",
              }}
            >
              <div
                className="flex items-center gap-2 eyebrow"
                style={{ color: "var(--ink-dim)" }}
              >
                <MapPin
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--accent)" }}
                />
                Live network
              </div>
              <div
                className="mt-2 display text-[22px]"
                style={{ color: "var(--ink)" }}
              >
                Salem · Trichy · Tirupur · Erode · Hosur
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                <div>
                  <div
                    className="display text-[28px]"
                    style={{ color: "var(--ink)" }}
                  >
                    10
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-[0.14em] mt-1"
                    style={{ color: "var(--ink-dim)" }}
                  >
                    Centres
                  </div>
                </div>
                <div
                  className="border-l hairline"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="display text-[28px]"
                    style={{ color: "var(--ink)" }}
                  >
                    5
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-[0.14em] mt-1"
                    style={{ color: "var(--ink-dim)" }}
                  >
                    Cities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── WHO CAN APPLY ───────────────────────── */
function WhoCanApply() {
  const profiles = [
    {
      icon: HandCoins,
      title: "Entrepreneurs",
      description:
        "Operators with space and investment ready, looking to launch a premium coworking centre in their city.",
    },
    {
      icon: LandPlot,
      title: "Landowners",
      description:
        "Owners of underutilized commercial land or buildings at prime urban locations seeking productive returns.",
    },
    {
      icon: Building2,
      title: "Real-estate developers",
      description:
        "Developers wanting to add a flexible-workspace floor or wing to a new or existing commercial project.",
    },
  ];

  return (
    <section className="py-20 lg:py-24" style={{ background: "var(--canvas-alt)" }}>
      <div className="content-width">
        <div className="max-w-2xl mb-12">
          <p className="eyebrow">Who should apply</p>
          <h2
            className="display mt-3 text-[34px] lg:text-[48px]"
            style={{ color: "var(--ink)" }}
          >
            Built for three kinds of{" "}
            <span className="display-italic">partners.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {profiles.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="rounded-xl border hairline p-7"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3
                className="display text-[22px] leading-tight"
                style={{ color: "var(--ink)" }}
              >
                {title}
              </h3>
              <p
                className="text-[14.5px] mt-3 leading-[1.6]"
                style={{ color: "var(--ink-muted)" }}
              >
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── INVESTMENT & TERMS ───────────────────────── */
function InvestmentTerms() {
  const items = [
    {
      icon: Ruler,
      label: "Area required",
      value: `${franchiseInvestment.minSize.toLocaleString()}–${franchiseInvestment.maxSize.toLocaleString()}`,
      unit: franchiseInvestment.unit,
    },
    {
      icon: Calendar,
      label: "Agreement term",
      value: "5 + 5",
      unit: "years",
    },
    {
      icon: HandCoins,
      label: "Investment",
      value: "On call",
      unit: "personalised estimate",
    },
    {
      icon: Timer,
      label: "Payback period",
      value: "On call",
      unit: "based on city + format",
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      <div className="content-width">
        <div className="max-w-2xl mb-12">
          <p className="eyebrow">Investment &amp; terms</p>
          <h2
            className="display mt-3 text-[34px] lg:text-[48px]"
            style={{ color: "var(--ink)" }}
          >
            Honest numbers,{" "}
            <span className="display-italic">discussed openly.</span>
          </h2>
          <p
            className="mt-5 text-[16px] leading-[1.6] max-w-[560px]"
            style={{ color: "var(--ink-muted)" }}
          >
            Headline parameters below — unit economics, investment range and
            payback projections are walked through in your discovery call so
            the numbers match your city, building, and target format.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, label, value, unit }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.06, duration: 0.55 }}
              className="rounded-xl border hairline p-6"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center mb-4"
                style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <p
                className="text-[11px] uppercase tracking-[0.16em]"
                style={{ color: "var(--ink-dim)" }}
              >
                {label}
              </p>
              <div
                className="display text-[28px] lg:text-[32px] leading-none mt-2"
                style={{ color: "var(--ink)" }}
              >
                {value}
              </div>
              <p className="text-[12.5px] mt-2" style={{ color: "var(--ink-muted)" }}>
                {unit}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── PROCESS ───────────────────────── */
function Process() {
  return (
    <section className="py-24 lg:py-32" style={{ background: "var(--canvas-alt)" }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow">Path to launch</p>
          <h2 className="display mt-3 text-[36px] lg:text-[52px]" style={{ color: "var(--ink)" }}>
            From handshake to{" "}
            <span className="display-italic">opening day.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {franchiseProcess.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="relative rounded-xl p-7 border hairline"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mono text-[14px] font-semibold border-2"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  background: "var(--card)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="display text-[22px] mt-5 leading-tight" style={{ color: "var(--ink)" }}>
                {step.title}
              </h3>
              <p className="text-[14.5px] mt-3 leading-[1.6]" style={{ color: "var(--ink-muted)" }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SUPPORT ───────────────────────── */
function Support() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow">End-to-end support</p>
          <h2 className="display mt-3 text-[36px] lg:text-[52px]" style={{ color: "var(--ink)" }}>
            Everything you need, from{" "}
            <span className="display-italic">site to scale.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {franchiseSupportPhases.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="rounded-2xl p-7 border hairline flex flex-col"
              style={{
                background: i === 1 ? "var(--ink-band)" : "var(--card)",
                color: i === 1 ? "#fff" : "var(--ink)",
                borderColor: "var(--border)",
                boxShadow: i === 1 ? "0 30px 60px -30px rgba(0,0,0,0.4)" : "0 1px 0 rgba(0,0,0,0.02)",
              }}
            >
              <span
                className="inline-flex items-center self-start px-2.5 py-1 rounded-full text-[11px] uppercase tracking-[0.14em] font-medium"
                style={{
                  background: i === 1 ? "rgba(255,255,255,0.08)" : "var(--accent-bg)",
                  color: i === 1 ? "#fff" : "var(--accent)",
                  border: i === 1 ? "1px solid rgba(255,255,255,0.18)" : "none",
                }}
              >
                {phase.phase}
              </span>
              <h3
                className="display text-[24px] lg:text-[26px] mt-5 leading-tight"
                style={{ color: i === 1 ? "#fff" : "var(--ink)" }}
              >
                {phase.title}
              </h3>
              <ul className="mt-6 space-y-2.5 text-[14px] flex-1">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{
                        color: i === 1 ? "var(--accent-soft)" : "var(--accent)",
                      }}
                      strokeWidth={2.25}
                    />
                    <span style={{ color: i === 1 ? "rgba(255,255,255,0.85)" : "var(--ink-muted)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── APPLICATION FORM ───────────────────────── */
function ApplicationForm() {
  return (
    <section id="apply" className="py-24 lg:py-32">
      <div className="max-w-[1040px] mx-auto px-5 lg:px-10">
        <div className="text-center max-w-[640px] mx-auto mb-12">
          <p className="eyebrow">Apply</p>
          <h2 className="display mt-3 text-[36px] lg:text-[52px]" style={{ color: "var(--ink)" }}>
            Apply for a <span className="display-italic">franchise.</span>
          </h2>
          <p
            className="mt-5 text-[16px] leading-[1.6]"
            style={{ color: "var(--ink-muted)" }}
          >
            Fill in your details and our franchise development team will reach
            out within 48 hours.
          </p>
        </div>
        <div
          className="rounded-2xl border hairline p-6 md:p-8"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 30px 60px -30px rgba(0,0,0,0.10)",
          }}
        >
          <FranchiseForm />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  if (!franchiseFaqs.length) return null;

  return (
    <section className="py-24 lg:py-32" style={{ background: "var(--canvas-alt)" }}>
      <div className="max-w-[1040px] mx-auto px-5 lg:px-10">
        <div className="text-center max-w-[640px] mx-auto">
          <p className="eyebrow">Frequently asked</p>
          <h2 className="display mt-3 text-[36px] lg:text-[52px]" style={{ color: "var(--ink)" }}>
            Questions, <span className="display-italic">answered.</span>
          </h2>
        </div>

        <div
          className="mt-12 divide-y border-y hairline"
          style={{ borderColor: "var(--border)" }}
        >
          {franchiseFaqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.question}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left flex items-center justify-between py-6 gap-6"
                >
                  <span
                    className="display text-[19px] lg:text-[22px]"
                    style={{ color: "var(--ink)" }}
                  >
                    {f.question}
                  </span>
                  <span
                    className="w-9 h-9 rounded-full border hairline flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      background: isOpen ? "var(--accent)" : "transparent",
                      color: isOpen ? "#fff" : "var(--ink)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p
                        className="pb-6 text-[15.5px] max-w-[680px]"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {f.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA ───────────────────────── */
function CTA() {
  return (
    <section className="pt-16 lg:pt-24 pb-28 lg:pb-32">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[32px] overflow-hidden grain"
          style={{
            background:
              "linear-gradient(135deg, #c75a3a 0%, #b04e30 40%, #8b3621 100%)",
            color: "#fff",
            boxShadow:
              "0 40px 80px -32px rgba(168, 72, 46, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* Glow orbs for depth */}
          <div
            aria-hidden
            className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full opacity-50 pointer-events-none"
            style={{ background: "#ffb288", filter: "blur(90px)" }}
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-32 w-[26rem] h-[26rem] rounded-full opacity-35 pointer-events-none"
            style={{ background: "#ffd8c4", filter: "blur(100px)" }}
          />

          {/* Subtle white grid pattern */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* Content */}
          <div className="relative p-10 sm:p-14 lg:p-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-end">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    borderColor: "rgba(255,255,255,0.22)",
                  }}
                >
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inset-0 rounded-full bg-white opacity-60 animate-ping" />
                    <span className="relative w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/90">
                    Take the next step
                  </span>
                </div>

                <h2
                  className="display mt-6 text-[44px] sm:text-[56px] lg:text-[76px] leading-[1.0]"
                  style={{ color: "#fff" }}
                >
                  Bring NammaOffice
                  <br />
                  <span
                    className="display-italic"
                    style={{ color: "#ffd8c4" }}
                  >
                    to your city.
                  </span>
                </h2>

                <p className="text-white/85 mt-6 max-w-[540px] text-[16px] lg:text-[17px] leading-[1.6]">
                  Reach out to our franchise development team — we&apos;ll walk
                  you through the playbook, the city availability map, and the
                  path to opening day.
                </p>

                {/* Inline proof row */}
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                  {[
                    { v: "10", l: "Centres" },
                    { v: "5", l: "Cities" },
                    { v: "48h", l: "Response" },
                  ].map((p) => (
                    <div key={p.l} className="flex items-baseline gap-2">
                      <span
                        className="display text-[28px] leading-none"
                        style={{ color: "#fff" }}
                      >
                        {p.v}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/65">
                        {p.l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — CTA stack */}
              <div className="flex flex-col gap-3">
                <Link
                  href="#apply"
                  className="group inline-flex items-center justify-between h-14 px-6 rounded-xl text-[15px] font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    background: "#fff",
                    color: "var(--ink)",
                    boxShadow: "0 12px 28px -10px rgba(0,0,0,0.25)",
                  }}
                >
                  Apply for a franchise
                  <ArrowUpRight
                    className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </Link>
                <a
                  href="tel:+919092109213"
                  className="inline-flex items-center justify-between h-14 px-6 rounded-xl text-[15px] font-semibold border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <Phone className="w-4 h-4 opacity-80" strokeWidth={1.75} />
                    Talk to our team
                  </span>
                  <span className="mono text-[12.5px] opacity-80">
                    +91 9092109213
                  </span>
                </a>
                <a
                  href="mailto:info@nammaoffice.com"
                  className="inline-flex items-center justify-between h-14 px-6 rounded-xl text-[15px] font-semibold border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="w-4 h-4 opacity-80" strokeWidth={1.75} />
                    Email franchise team
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" strokeWidth={1.75} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
