import { BRAND } from "@/lib/constants";
import { whatsappUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl(BRAND.whatsapp, "Hi, I'm interested in NammaOffice workspaces")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:bg-[#1ebe5a] transition-colors animate-pulse-slow"
    >
      <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
    </a>
  );
}
