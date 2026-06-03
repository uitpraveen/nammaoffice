import type { Metadata } from "next";
import { FormPageShell } from "@/components/sections/FormPageShell";
import { ServiceRequestForm } from "@/components/forms/ServiceRequestForm";
import { ZohoFormEmbed } from "@/components/forms/ZohoFormEmbed";
import { embedUrlFor } from "@/lib/forms/mode";

export const metadata: Metadata = {
  alternates: { canonical: "/service-request" },
  title: "Service Request",
  description:
    "Raise a service-desk ticket with the NammaOffice centre team - facilities, AC, WiFi, housekeeping, IT or anything else that needs attention at your branch.",
};

export default function ServiceRequestPage() {
  const embed = embedUrlFor("serviceRequest");
  return (
    <FormPageShell
      eyebrow="Service desk"
      title="Namma Office Service Request"
      subtitle="Tell us what's not working and the centre team will pick it up."
      intro="Tickets land with the centre manager for your branch and the central facilities team. Add a photo or PDF if it helps explain the issue - JPG, PNG or PDF up to 15 MB."
    >
      {embed ? (
        <ZohoFormEmbed url={embed} title="Namma Office Service Request" />
      ) : (
        <ServiceRequestForm />
      )}
    </FormPageShell>
  );
}
