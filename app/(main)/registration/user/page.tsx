import type { Metadata } from "next";
import { UserRegistrationForm } from "@/components/forms/UserRegistrationForm";
import { ZohoFormEmbed } from "@/components/forms/ZohoFormEmbed";
import { FormPageShell } from "@/components/sections/FormPageShell";
import { embedUrlFor } from "@/lib/forms/mode";

export const metadata: Metadata = {
  alternates: { canonical: "/registration/user" },
  title: "User Registration",
  description:
    "Register as a NammaOffice member or visitor. Quick onboarding for access to our centres across Salem, Trichy, and Tirupur.",
};

export default function UserRegistrationPage() {
  const embed = embedUrlFor("user");
  return (
    <FormPageShell
      eyebrow="Forms"
      title="User Registration"
      subtitle="Onboarding for members & visitors."
      intro="Tell us a few details so we can get your access set up. This information is used only for membership KYC and on-site identification - never shared with third parties."
    >
      {embed ? (
        <ZohoFormEmbed url={embed} title="User Registration" />
      ) : (
        <UserRegistrationForm />
      )}
    </FormPageShell>
  );
}
