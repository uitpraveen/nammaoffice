import type { Metadata } from "next";
import { UserRegistrationForm } from "@/components/forms/UserRegistrationForm";
import { FormPageShell } from "@/components/sections/FormPageShell";

export const metadata: Metadata = {
  title: "User Registration",
  description:
    "Register as a NammaOffice member or visitor. Quick onboarding for access to our centres across Salem, Trichy, and Tirupur.",
};

export default function UserRegistrationPage() {
  return (
    <FormPageShell
      eyebrow="Forms"
      title="User Registration"
      subtitle="Onboarding for members & visitors."
      intro="Tell us a few details so we can get your access set up. This information is used only for membership KYC and on-site identification — never shared with third parties."
    >
      <UserRegistrationForm />
    </FormPageShell>
  );
}
