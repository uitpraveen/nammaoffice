import type { Metadata } from "next";
import { CompanyRegistrationForm } from "@/components/forms/CompanyRegistrationForm";
import { FormPageShell } from "@/components/sections/FormPageShell";

export const metadata: Metadata = {
  title: "Company Registration",
  description:
    "Register your company with NammaOffice — Private Limited, LLP, Partnership, Sole Proprietorship, or OPC. End-to-end filing assistance.",
};

export default function CompanyRegistrationPage() {
  return (
    <FormPageShell
      eyebrow="Forms"
      title="Company Registration"
      subtitle="Tell us about your business — we'll handle the rest."
      intro="Whether you're starting a Private Limited, LLP, Partnership, Sole Proprietorship, or OPC, our team will guide you through end-to-end filing. Tell us a few basics and we'll be in touch within 24 hours."
    >
      <CompanyRegistrationForm />
    </FormPageShell>
  );
}
