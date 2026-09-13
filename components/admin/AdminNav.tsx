"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "./request";
export function AdminNav() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    setError("");
    try {
      await adminRequest("/api/admin/login", { method: "DELETE" });
      router.replace("/admin/login");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="border-b hairline bg-white">
      <nav
        aria-label="Content management"
        className="content-width flex flex-wrap items-center gap-x-6 gap-y-3 py-4 text-sm"
      >
        <Link href="/admin/logos">Client logos</Link>
        <Link href="/admin/news">News</Link>
        <Link href="/admin/testimonials">Testimonials</Link>
        <Link href="/admin/setup">Setup & backup</Link>
        <Link href="/" target="_blank">
          View website
        </Link>
        <button
          type="button"
          onClick={signOut}
          disabled={busy}
          className="ml-auto underline"
        >
          {busy ? "Signing out…" : "Sign out"}
        </button>
        {error && (
          <p role="alert" className="w-full text-red-700">
            {error}
          </p>
        )}
      </nav>
    </div>
  );
}
