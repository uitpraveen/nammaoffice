"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

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
      <p className="text-green-400 text-sm font-medium">
        Subscribed! Thank you.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className={cn(
          "flex-1 px-3 py-2 rounded-brand text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40",
          "focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta",
          "transition-colors duration-200"
        )}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 rounded-brand bg-terracotta text-white text-sm font-medium hover:bg-terracotta-600 transition-colors duration-200 disabled:opacity-60 whitespace-nowrap"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
