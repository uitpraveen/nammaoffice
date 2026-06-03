import type { Metadata } from "next";
import { BookingsForm } from "@/components/forms/BookingsForm";
import { ZohoFormEmbed } from "@/components/forms/ZohoFormEmbed";
import { FormPageShell } from "@/components/sections/FormPageShell";
import { embedUrlFor } from "@/lib/forms/mode";

export const metadata: Metadata = {
  alternates: { canonical: "/gate-pass" },
  title: "Gate Pass",
  description:
    "Request a visitor gate pass for any NammaOffice TIDEL park. Pick your venue (Salem or Tirupur) and we'll arrange the pass with the host company.",
};

export default function GatePassPage() {
  const embed = embedUrlFor("bookings");
  return (
    <FormPageShell
      eyebrow="Service Desk"
      title="Gate Pass"
      subtitle="Request a visitor pass for the Salem or Tirupur TIDEL parks."
      intro="TIDEL parks require a visitor pass for entry. Submit the form below and our centre team will arrange a pass and notify the host company. Allow at least 30 minutes during peak hours."
    >
      {embed ? (
        <ZohoFormEmbed url={embed} title="Gate Pass" />
      ) : (
        <BookingsForm defaultRequestType="gate-pass" />
      )}
    </FormPageShell>
  );
}
