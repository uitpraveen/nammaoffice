"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const HOME = "/admin/logos";

/**
 * `next` comes from the query string, so it is attacker-controlled: a link like
 * /admin/login?next=https://example.com would bounce staff to someone else's
 * page the moment they signed in, which is a ready-made phishing flow. Only
 * accept a same-origin path inside the admin area.
 *
 * "//host" and "/\host" are rejected because browsers treat both as absolute.
 */
function safeNext(raw: string | null) {
  if (!raw) return HOME;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return HOME;
  return raw === "/admin" || raw.startsWith("/admin/") ? raw : HOME;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (response.ok) {
      router.replace(safeNext(params.get("next")));
      router.refresh();
      return;
    }
    const body = await response.json().catch(() => ({}));
    setError(body.error || "Could not sign in.");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <p className="eyebrow">NammaOffice</p>
      <h1 className="display-md mt-2 text-[var(--color-navy)]">Client logos</h1>
      <p className="mt-3 text-[15px] text-[var(--color-ink-secondary)]">
        Enter the shared password to add or remove logos.
      </p>

      <label htmlFor="password" className="mt-8 block text-sm font-medium text-[var(--color-ink)]">
        Password
      </label>
      <input
        id="password"
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[var(--color-border-strong)] bg-white px-4 py-3 text-[15px] outline-none focus-visible:border-[var(--color-gold)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold-200)]"
      />

      {error && <p role="alert" className="mt-3 text-sm text-[var(--color-gold-600)]">{error}</p>}

      <button
        type="submit"
        disabled={busy || !password}
        className="mt-6 w-full rounded-xl bg-[var(--color-gold)] px-4 py-3 text-[15px] font-medium text-white transition disabled:opacity-40 hover:bg-[var(--color-gold-600)]"
      >
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
