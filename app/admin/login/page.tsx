import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Sign in" };

/**
 * The form reads ?next= to bounce back where you were headed, and
 * useSearchParams needs a Suspense boundary or the page cannot be prerendered.
 */
export default function AdminLoginPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-[var(--color-bg)] px-5">
      <Suspense fallback={<p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
