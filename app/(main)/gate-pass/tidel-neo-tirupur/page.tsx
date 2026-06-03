import type { Metadata } from "next";
import { BookingsForm } from "@/components/forms/BookingsForm";
import { ZohoFormEmbed } from "@/components/forms/ZohoFormEmbed";
import { FormPageShell } from "@/components/sections/FormPageShell";
import { embedUrlFor } from "@/lib/forms/mode";

export const metadata: Metadata = {
  alternates: { canonical: "/gate-pass/tidel-neo-tirupur" },
  title: "Gate Pass - Tirupur TIDEL NEO",
  description:
    "Request a visitor gate pass for the Tirupur TIDEL NEO technology park. Provide visitor details, host company, and time of visit.",
};

export default function TirupurTidelGatePassPage() {
  const embed = embedUrlFor("bookings");
  return (
    <FormPageShell
      eyebrow="Service Desk"
      title="Gate Pass - Tirupur TIDEL NEO"
      subtitle="Request a visitor pass for the Tirupur TIDEL park."
      intro="TIDEL NEO Tirupur requires a visitor pass for entry. Submit the request below and our centre team will arrange a pass and notify the host company. Allow at least 30 minutes during peak hours."
    >
      {embed ? (
        <ZohoFormEmbed url={embed} title="Gate Pass - Tirupur TIDEL NEO" />
      ) : (
        <BookingsForm defaultRequestType="gate-pass" defaultVenue="tirupur/tidel-neo" lockVenue />
      )}
    </FormPageShell>
  );
}
