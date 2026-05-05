import type { Metadata } from "next";
import { BookingsForm } from "@/components/forms/BookingsForm";
import { FormPageShell } from "@/components/sections/FormPageShell";

export const metadata: Metadata = {
  title: "Gate Pass",
  description:
    "Request a visitor gate pass for any NammaOffice TIDEL park. Pick your venue (Salem or Tirupur) and we'll arrange the pass with the host company.",
};

export default function GatePassPage() {
  return (
    <FormPageShell
      eyebrow="Service Desk"
      title="Gate Pass"
      subtitle="Request a visitor pass for the Salem or Tirupur TIDEL parks."
      intro="TIDEL parks require a visitor pass for entry. Submit the form below and our centre team will arrange a pass and notify the host company. Allow at least 30 minutes during peak hours."
    >
      <BookingsForm defaultRequestType="gate-pass" />
    </FormPageShell>
  );
}
