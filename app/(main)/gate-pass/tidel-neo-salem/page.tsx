import type { Metadata } from "next";
import { BookingsForm } from "@/components/forms/BookingsForm";
import { FormPageShell } from "@/components/sections/FormPageShell";

export const metadata: Metadata = {
  title: "Gate Pass — Salem TIDEL NEO",
  description:
    "Request a visitor gate pass for the Salem TIDEL NEO technology park. Provide visitor details, host company, and time of visit.",
};

export default function SalemTidelGatePassPage() {
  return (
    <FormPageShell
      eyebrow="Service Desk"
      title="Gate Pass — Salem TIDEL NEO"
      subtitle="Request a visitor pass for the Salem TIDEL park."
      intro="TIDEL NEO Salem requires a visitor pass for entry. Submit the request below and our centre team will arrange a pass and notify the host company. Allow at least 30 minutes during peak hours."
    >
      <BookingsForm defaultRequestType="gate-pass" defaultVenue="salem/tidel-neo" />
    </FormPageShell>
  );
}
