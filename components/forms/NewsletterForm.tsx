"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 px-4 h-14 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 text-[var(--color-accent-300)]">
        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
        <p className="text-[14px] font-medium">Thanks — you’re subscribed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        aria-label="Email address"
        className="w-full h-14 pl-5 pr-36 rounded-full bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-[14px] focus:outline-none focus:border-[var(--color-accent)] focus:bg-white/10 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="absolute top-1.5 right-1.5 inline-flex items-center gap-1.5 h-11 px-5 bg-[var(--color-accent)] text-white text-[13px] font-semibold rounded-full hover:bg-[var(--color-accent-600)] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "…" : "Subscribe"}
        {status !== "loading" && <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />}
      </button>
      {status === "error" && (
        <p className="mt-2 text-[12.5px] text-red-300">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
