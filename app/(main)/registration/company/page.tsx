import type { Metadata } from "next";
import { CompanyRegistrationForm } from "@/components/forms/CompanyRegistrationForm";
import { ZohoFormEmbed } from "@/components/forms/ZohoFormEmbed";
import { FormPageShell } from "@/components/sections/FormPageShell";
import { embedUrlFor } from "@/lib/forms/mode";

export const metadata: Metadata = {
  alternates: { canonical: "/registration/company" },
  title: "Company Registration",
  description:
    "Register your company with NammaOffice - Private Limited, LLP, Partnership, Sole Proprietorship, or OPC. End-to-end filing assistance.",
};

export default function CompanyRegistrationPage() {
  const embed = embedUrlFor("company");
  return (
    <FormPageShell
      eyebrow="Forms"
      title="Company Registration"
      subtitle="Tell us about your business - we'll handle the rest."
      intro="Whether you're starting a Private Limited, LLP, Partnership, Sole Proprietorship, or OPC, our team will guide you through end-to-end filing. Tell us a few basics and we'll be in touch within 24 hours."
    >
      {embed ? (
        <ZohoFormEmbed url={embed} title="Company Registration" />
      ) : (
        <CompanyRegistrationForm />
      )}
    </FormPageShell>
  );
}
