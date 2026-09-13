import Link from "next/link";
import { AdminNav } from "./AdminNav";
export function AdminUnavailable() {
  return (
    <>
      <AdminNav />
      <main className="content-width py-12">
        <h1 className="display text-3xl">Content is unavailable</h1>
        <p className="mt-4">
          Complete CMS setup, or try again if storage is temporarily
          unavailable. Existing content has not been replaced.
        </p>
        <Link className="mt-5 inline-block underline" href="/admin/setup">
          Open setup
        </Link>
      </main>
    </>
  );
}
