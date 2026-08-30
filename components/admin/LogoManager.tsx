"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Client } from "@/lib/data/clients";

/**
 * Add and remove client logos.
 *
 * The important idea: nobody has to know what the wall needs. You pick a file,
 * optionally drag a box around the part you want, and the server runs the same
 * trimming and size-matching the rest of the wall was built with. The preview
 * shows the finished mark on the real cream background at the real size, so
 * what you approve is exactly what ships.
 */

interface Props {
  initialClients: Client[];
  canWrite: boolean;
}

interface Preview {
  preview: string;
  entry: Client;
  warning: string | null;
}

/** Fractional crop box, 0..1 of the source image. */
interface Box { x: number; y: number; w: number; h: number }

export function LogoManager({ initialClients, canWrite }: Props) {
  const [clients, setClients] = useState(initialClients);
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [box, setBox] = useState<Box | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, [objectUrl]);

  function chooseFile(next: File | null) {
    if (!next) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setFile(next);
    setObjectUrl(URL.createObjectURL(next));
    setBox(null);
    setPreview(null);
    setError(null);
    if (!name) {
      // "acme-corp logo (1).png" -> "Acme Corp"
      setName(next.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ")
        .replace(/\b(logo|final|copy|\(\d+\))\b/gi, "").replace(/\s+/g, " ").trim()
        .replace(/\b\w/g, (c) => c.toUpperCase()));
    }
  }

  const run = useCallback(async (mode: "preview" | "save") => {
    if (!file || !name.trim()) return;
    setBusy(mode); setError(null); setNotice(null);
    const form = new FormData();
    form.set("file", file);
    form.set("name", name.trim());
    if (mode === "preview") form.set("preview", "true");
    if (box) form.set("crop", JSON.stringify({ x: box.x, y: box.y, width: box.w, height: box.h }));

    const response = await fetch("/api/admin/logos", { method: "POST", body: form });
    const body = await response.json().catch(() => ({}));
    setBusy(null);

    if (!response.ok) { setError(body.error || "Something went wrong."); return; }
    if (mode === "preview") { setPreview(body); return; }

    setClients((current) =>
      [...current.filter((c) => c.id !== body.entry.id), body.entry]
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
    setNotice(`${body.entry.name} added.${body.warning ? " " + body.warning : ""}`);
    setFile(null); setObjectUrl(null); setName(""); setBox(null); setPreview(null);
  }, [file, name, box]);

  async function remove(client: Client) {
    if (!confirm(`Remove ${client.name} from the wall?`)) return;
    setBusy(client.id); setError(null); setNotice(null);
    const response = await fetch("/api/admin/logos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: client.id }),
    });
    const body = await response.json().catch(() => ({}));
    setBusy(null);
    if (!response.ok) { setError(body.error || "Could not remove that logo."); return; }
    setClients((current) => current.filter((c) => c.id !== client.id));
    setNotice(`${client.name} removed.`);
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pb-24">
      <header className="border-b border-[var(--color-border)] bg-white/70 backdrop-blur">
        <div className="content-width flex flex-wrap items-baseline justify-between gap-3 py-5">
          <div>
            <p className="eyebrow">NammaOffice</p>
            <h1 className="display-md mt-1 text-[var(--color-navy)]">Client logos</h1>
          </div>
          <p className="text-sm text-[var(--color-ink-secondary)]">
            {clients.length} on the wall
          </p>
        </div>
      </header>

      <div className="content-width">
        {!canWrite && (
          <p className="mt-6 rounded-xl border border-[var(--color-gold-300)] bg-[var(--color-gold-50)] px-4 py-3 text-sm text-[var(--color-gold-700)]">
            Read-only here. Saving works when this runs on your own machine; the
            production storage step is not finished yet.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-6 rounded-xl border border-[var(--color-gold-300)] bg-white px-4 py-3 text-sm text-[var(--color-gold-700)]">{error}</p>
        )}
        {notice && (
          <p role="status" className="mt-6 rounded-xl border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm text-[var(--color-ink)]">{notice}</p>
        )}

        {/* ---------------- add ---------------- */}
        <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--color-navy)]">Add a logo</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">
            An SVG or a PNG with a transparent background gives the best result.
            A plain photo or screenshot will look soft however it is processed.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--color-ink)]">Logo file</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(e) => chooseFile(e.target.files?.[0] ?? null)}
                className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-navy)] file:px-4 file:py-2 file:text-sm file:text-white"
              />

              <label htmlFor="client-name" className="mt-5 block text-sm font-medium text-[var(--color-ink)]">
                Client name
              </label>
              <input
                id="client-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corp"
                className="mt-2 w-full rounded-xl border border-[var(--color-border-strong)] px-4 py-2.5 text-[15px] outline-none focus-visible:border-[var(--color-gold)]"
              />
              <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">
                Shown on hover and read out by screen readers.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => run("preview")}
                  disabled={!file || !name.trim() || busy !== null}
                  className="rounded-xl border border-[var(--color-navy)] px-4 py-2.5 text-sm font-medium text-[var(--color-navy)] transition disabled:opacity-40 hover:bg-[var(--color-surface-alt)]"
                >
                  {busy === "preview" ? "Processing…" : "Preview"}
                </button>
                <button
                  type="button"
                  onClick={() => run("save")}
                  disabled={!preview || busy !== null || !canWrite}
                  className="rounded-xl bg-[var(--color-gold)] px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-40 hover:bg-[var(--color-gold-600)]"
                >
                  {busy === "save" ? "Saving…" : "Add to wall"}
                </button>
              </div>
            </div>

            <div>
              {objectUrl ? (
                <Cropper src={objectUrl} box={box} onChange={setBox} />
              ) : (
                <div className="grid h-48 place-items-center rounded-xl border border-dashed border-[var(--color-border-strong)] text-sm text-[var(--color-ink-muted)]">
                  Choose a file to see it here
                </div>
              )}
            </div>
          </div>

          {preview && (
            <div className="mt-6 border-t border-[var(--color-border)] pt-6">
              <h3 className="text-sm font-medium text-[var(--color-ink)]">
                How it will look on the wall
              </h3>
              {preview.warning && (
                <p className="mt-2 text-sm text-[var(--color-gold-700)]">{preview.warning}</p>
              )}
              {/* Same ground and same height as the real section, so this is a
                  true preview rather than an approximation. */}
              <div className="mt-3 flex items-center gap-10 overflow-x-auto rounded-xl bg-[var(--color-bg)] px-8 py-6">
                {clients.slice(0, 2).map((c) => (
                  <Image key={c.id} src={c.logo} alt={c.name} width={c.w} height={c.h}
                    className="w-auto shrink-0 opacity-40" style={{ height: 112 }} />
                ))}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.preview} alt={preview.entry.name}
                  className="w-auto shrink-0" style={{ height: 112 }} />
                {clients.slice(2, 4).map((c) => (
                  <Image key={c.id} src={c.logo} alt={c.name} width={c.w} height={c.h}
                    className="w-auto shrink-0 opacity-40" style={{ height: 112 }} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ---------------- current wall ---------------- */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[var(--color-navy)]">On the wall now</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <li key={client.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-white p-3">
                <div className="grid h-16 w-28 shrink-0 place-items-center rounded-lg bg-[var(--color-bg)]">
                  <Image src={client.logo} alt="" width={client.w} height={client.h}
                    className="w-auto" style={{ height: 44 }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">{client.name}</p>
                  <p className="truncate text-xs text-[var(--color-ink-muted)]">{client.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(client)}
                  disabled={busy !== null || !canWrite}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-gold-700)] transition disabled:opacity-30 hover:bg-[var(--color-gold-50)]"
                >
                  {busy === client.id ? "Removing…" : "Remove"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

/**
 * Optional crop. Most logos need nothing here, because the server trims dead
 * space on its own. It exists for the awkward cases: artwork with a strapline
 * you do not want, a border, or two marks in one file.
 */
function Cropper({ src, box, onChange }: {
  src: string;
  box: Box | null;
  onChange: (box: Box | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  const point = (event: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  };

  return (
    <div>
      <div
        ref={ref}
        className="relative select-none overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[repeating-conic-gradient(#f1ede3_0_25%,#fff_0_50%)] bg-[length:16px_16px] touch-none"
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          const p = point(e);
          setDrag(p);
          onChange({ x: p.x, y: p.y, w: 0, h: 0 });
        }}
        onPointerMove={(e) => {
          if (!drag) return;
          const p = point(e);
          onChange({
            x: Math.min(drag.x, p.x), y: Math.min(drag.y, p.y),
            w: Math.abs(p.x - drag.x), h: Math.abs(p.y - drag.y),
          });
        }}
        onPointerUp={() => {
          setDrag(null);
          // A stray click should not become a useless sliver of a crop.
          if (box && (box.w < 0.02 || box.h < 0.02)) onChange(null);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Uploaded logo" className="pointer-events-none block max-h-64 w-full object-contain" />
        {box && box.w > 0 && (
          <div
            className="pointer-events-none absolute border-2 border-[var(--color-gold)] bg-[var(--color-gold)]/10"
            style={{
              left: `${box.x * 100}%`, top: `${box.y * 100}%`,
              width: `${box.w * 100}%`, height: `${box.h * 100}%`,
            }}
          />
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-ink-muted)]">
          Optional: drag a box to keep only part of the image.
        </p>
        {box && (
          <button type="button" onClick={() => onChange(null)}
            className="shrink-0 text-xs font-medium text-[var(--color-gold-700)] underline">
            Clear crop
          </button>
        )}
      </div>
    </div>
  );
}
