"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "./AdminNav";
import { adminRequest } from "./request";
export function SetupManager({
  initialized,
  database,
  assets,
  legacy,
  local,
}: {
  initialized: boolean;
  database: boolean;
  assets: boolean;
  legacy: boolean;
  local: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function initialize() {
    setBusy(true);
    setError("");
    try {
      await adminRequest("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: legacy ? "legacy" : "committed" }),
      });
      router.replace("/admin/logos");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <AdminNav />
      <main className="content-width max-w-3xl py-12">
        <h1 className="display text-3xl">Setup & backup</h1>
        <p className="mt-4">
          {local
            ? "This editor is saving to local development files."
            : "This editor uses the connected CMS database and image storage."}
        </p>
        <ul className="mt-6 space-y-3">
          <li>
            Content database:{" "}
            {database ? "connected configuration" : "not configured"}
          </li>
          <li>Image storage: {assets ? "configured" : "not configured"}</li>
          <li>
            Content:{" "}
            {initialized ? "initialized" : "not initialized or unavailable"}
          </li>
        </ul>
        {!database && (
          <p className="mt-6 rounded-xl border p-4">
            Ask the developer to connect a free Upstash Redis database in Vercel
            and set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. CMS
            setup instructions are in docs/cms-setup.md.
          </p>
        )}
        {!initialized && (
          <div className="mt-6 rounded-xl border p-5">
            <h2 className="text-lg font-semibold">Import existing logos</h2>
            <p className="mt-3">
              {legacy
                ? "Import the current list from the existing Blob manifest. Images stay at their current URLs; no originals are deleted."
                : "Start with the logos supplied in the repository. If staff have edited logos on the live site, configure BLOB_MANIFEST_URL first."}{" "}
              News and testimonials start empty.
            </p>
            <button
              type="button"
              onClick={initialize}
              disabled={busy || !database}
              className="mt-4 rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              {busy ? "Importing…" : "Initialize CMS"}
            </button>
          </div>
        )}
        {initialized && (
          <div className="mt-6 rounded-xl border p-5">
            <h2 className="text-lg font-semibold">Export a backup</h2>
            <p className="mt-3">
              Includes all content, drafts, archived items and image references.
              Save a backup before major changes. Image files must be backed up
              separately.
            </p>
            <a
              href="/api/admin/setup"
              className="mt-4 inline-block underline"
              download
            >
              Download content backup
            </a>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-5 text-red-700">
            {error}
          </p>
        )}
      </main>
    </>
  );
}
