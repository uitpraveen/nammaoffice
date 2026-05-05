import type { Metadata } from "next";
import { VendorForm } from "@/components/forms/VendorForm";
import { FormPageShell } from "@/components/sections/FormPageShell";

export const metadata: Metadata = {
  title: "Vendor Onboarding",
  description:
    "Apply to become a NammaOffice vendor. Cleaning, security, pantry, IT/AV, maintenance, stationery, furniture and more.",
};

export default function VendorRegistrationPage() {
  return (
    <FormPageShell
      eyebrow="Forms"
      title="Vendor Onboarding"
      subtitle="Let's grow, serve, and succeed together."
      intro="Apply to become an approved NammaOffice vendor. We work with partners across cleaning, security, pantry, IT/AV, maintenance, stationery, furniture, and specialised services. Submit the form and our procurement team will review and reach out within 3 business days."
    >
      <VendorForm />
    </FormPageShell>
  );
}
