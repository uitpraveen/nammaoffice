import type { Metadata } from "next";
import { VendorForm } from "@/components/forms/VendorForm";
import { ZohoFormEmbed } from "@/components/forms/ZohoFormEmbed";
import { FormPageShell } from "@/components/sections/FormPageShell";
import { embedUrlFor } from "@/lib/forms/mode";

export const metadata: Metadata = {
  alternates: { canonical: "/registration/vendor" },
  title: "Vendor Onboarding",
  description:
    "Apply to become a NammaOffice vendor. Cleaning, security, pantry, IT/AV, maintenance, stationery, furniture and more.",
};

export default function VendorRegistrationPage() {
  const embed = embedUrlFor("vendor");
  return (
    <FormPageShell
      eyebrow="Forms"
      title="Vendor Onboarding"
      subtitle="Let's grow, serve, and succeed together."
      intro="Apply to become an approved NammaOffice vendor. We work with partners across cleaning, security, pantry, IT/AV, maintenance, stationery, furniture, and specialised services. Submit the form and our procurement team will review and reach out within 3 business days."
    >
      {embed ? (
        <ZohoFormEmbed url={embed} title="Vendor Onboarding" />
      ) : (
        <VendorForm />
      )}
    </FormPageShell>
  );
}
