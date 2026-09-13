"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Client } from "@/lib/data/clients";
import type { ManagedClient } from "@/lib/cms/types";
import type { Crop } from "@/lib/admin/process-logo";
import { AdminNav } from "./AdminNav";
import { adminRequest } from "./request";

interface Preview {
  preview: string;
  entry: Client;
  warning: string | null;
}
const button =
  "rounded-lg border border-[var(--color-navy)] px-4 py-2 text-sm disabled:opacity-40";
export function LogoManager({
  initialClients,
  canWrite,
}: {
  initialClients: ManagedClient[];
  canWrite: boolean;
}) {
  const [clients, setClients] = useState(initialClients);
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [box, setBox] = useState<Crop | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [replacement, setReplacement] = useState<ManagedClient | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const lock = useRef(false);
  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl],
  );
  const active = clients.filter((c) => c.status === "published");
  const archived = clients.filter((c) => c.status === "archived");
  const duplicate =
    preview && !replacement && clients.find((c) => c.id === preview.entry.id);
  function reset(client: ManagedClient | null = null) {
    setReplacement(client);
    setName(client?.name || "");
    setFile(null);
    setObjectUrl(null);
    setBox(null);
    setPreview(null);
    setFileKey((k) => k + 1);
    setError("");
  }
  function chooseFile(next: File | null) {
    setPreview(null);
    setBox(null);
    setError("");
    setFile(null);
    setObjectUrl(null);
    if (!next) return;
    if (next.size > 3 * 1024 * 1024) {
      setError("Choose an image under 3 MB.");
      return;
    }
    setFile(next);
    setObjectUrl(URL.createObjectURL(next));
    if (!name)
      setName(
        next.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim(),
      );
  }
  function updateClient(entry: ManagedClient) {
    setClients((current) =>
      [...current.filter((c) => c.id !== entry.id), entry].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    );
  }
  async function run(mode: "preview" | "save") {
    if (lock.current || !file || !name.trim()) return;
    lock.current = true;
    setBusy(mode);
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("name", name.trim());
      form.set("version", replacement?.version || "");
      if (replacement) form.set("id", replacement.id);
      if (mode === "preview") form.set("preview", "true");
      if (box) form.set("crop", JSON.stringify(box));
      const body = await adminRequest("/api/admin/logos", {
        method: "POST",
        body: form,
      });
      if (mode === "preview") setPreview(body);
      else {
        updateClient(body.entry);
        reset();
        setNotice(
          `${body.entry.name} published.${body.warning ? ` ${body.warning}` : ""}`,
        );
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      lock.current = false;
      setBusy("");
    }
  }
  async function changeStatus(client: ManagedClient) {
    if (lock.current) return;
    if (
      client.status === "published" &&
      !confirm(
        `Remove ${client.name} from the website? You can restore it from Archived logos.`,
      )
    )
      return;
    lock.current = true;
    setBusy(client.id);
    setError("");
    setNotice("");
    try {
      const body = await adminRequest("/api/admin/logos", {
        method: client.status === "published" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: client.id, version: client.version }),
      });
      updateClient(body.entry);
      setNotice(
        `${client.name} ${body.entry.status === "archived" ? "archived" : "restored"}.`,
      );
      if (replacement?.id === client.id) reset();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      lock.current = false;
      setBusy("");
    }
  }
  function cards(items: ManagedClient[]) {
    return (
      <ul className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((client) => (
          <li
            key={client.id}
            className="min-w-0 rounded-xl border hairline bg-white p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden">
                <Image
                  unoptimized
                  src={client.logo}
                  alt=""
                  width={client.w}
                  height={client.h}
                  className="max-h-14 max-w-full object-contain"
                />
              </div>
              <p className="min-w-0 break-words text-sm font-medium">
                {client.name}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                className={button}
                disabled={!!busy || !canWrite}
                onClick={() => {
                  reset(client);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Replace
              </button>
              <button
                type="button"
                className={button}
                disabled={!!busy || !canWrite}
                onClick={() => changeStatus(client)}
              >
                {busy === client.id
                  ? "Saving…"
                  : client.status === "archived"
                    ? "Restore"
                    : "Remove"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <>
      <AdminNav />
      <main className="min-h-screen bg-[var(--color-bg)] pb-20">
        <div className="content-width min-w-0 pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="display text-3xl">Client logos</h1>
            <p className="text-sm">{active.length} on the wall</p>
          </div>
          {!canWrite && (
            <p role="alert" className="mt-5 rounded-xl border p-4">
              Image storage is not configured. Open Setup & backup for the
              required settings.
            </p>
          )}
          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
            >
              {error}{" "}
              <a className="ml-2 underline" href="/admin/logos">
                Reload editor
              </a>{" "}
              <a className="ml-2 underline" href="/admin/login">
                Sign in
              </a>
            </div>
          )}
          {notice && (
            <p role="status" className="mt-5 rounded-xl border p-4 text-sm">
              {notice}
            </p>
          )}
          <section className="mt-6 min-w-0 rounded-2xl border hairline bg-white p-5 md:p-6">
            <h2 className="text-xl font-semibold">
              {replacement ? `Replace ${replacement.name}` : "Add a logo"}
            </h2>
            <p className="mt-2 text-sm">
              Use an SVG, PNG, JPG or WebP under 3 MB. Preview before
              publishing.
            </p>
            <fieldset
              disabled={!!busy}
              className="mt-5 grid min-w-0 gap-5 md:grid-cols-2"
            >
              <div className="min-w-0">
                <label
                  htmlFor="logo-file"
                  className="block text-sm font-medium"
                >
                  Logo file
                </label>
                <input
                  key={fileKey}
                  id="logo-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => chooseFile(e.target.files?.[0] || null)}
                  className="mt-2 block w-full min-w-0 text-sm"
                />
                <label
                  htmlFor="client-name"
                  className="mt-5 block text-sm font-medium"
                >
                  Client name
                </label>
                <input
                  id="client-name"
                  value={name}
                  maxLength={150}
                  onChange={(e) => {
                    setName(e.target.value);
                    setPreview(null);
                  }}
                  className="mt-2 w-full rounded-xl border p-3"
                />
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={button}
                    disabled={!file || !name.trim()}
                    onClick={() => run("preview")}
                  >
                    {busy === "preview" ? "Processing…" : "Preview"}
                  </button>
                  <button
                    type="button"
                    className={`${button} bg-[var(--color-navy)] text-white`}
                    disabled={!preview || !!duplicate || !canWrite}
                    onClick={() => run("save")}
                  >
                    {busy === "save"
                      ? "Saving…"
                      : replacement
                        ? "Publish replacement"
                        : "Add to wall"}
                  </button>
                  {replacement && (
                    <button
                      type="button"
                      className={button}
                      onClick={() => reset()}
                    >
                      Cancel replacement
                    </button>
                  )}
                </div>
                {duplicate && (
                  <p role="alert" className="mt-3 text-sm">
                    This client already exists.{" "}
                    <button
                      type="button"
                      className="underline"
                      onClick={() => reset(duplicate)}
                    >
                      Replace its logo
                    </button>{" "}
                    or restore it from the list.
                  </p>
                )}
              </div>
              <div className="min-w-0">
                {objectUrl ? (
                  <Cropper
                    src={objectUrl}
                    box={box}
                    disabled={!!busy}
                    onChange={(next) => {
                      setBox(next);
                      setPreview(null);
                    }}
                  />
                ) : (
                  <div className="grid h-40 place-items-center rounded-xl border border-dashed text-sm">
                    Choose a file to see it here
                  </div>
                )}
              </div>
            </fieldset>
            {preview && (
              <div className="mt-6 min-w-0 border-t pt-5">
                <h3 className="font-medium">How it will look on the wall</h3>
                {preview.warning && (
                  <p className="mt-2 text-sm">{preview.warning}</p>
                )}
                <div className="mt-3 flex max-w-full items-center gap-8 overflow-x-auto rounded-xl bg-[var(--color-bg)] p-5">
                  {active.slice(0, 1).map((c) => (
                    <Image
                      unoptimized
                      key={c.id}
                      src={c.logo}
                      alt={c.name}
                      width={c.w}
                      height={c.h}
                      className="h-28 w-auto shrink-0 opacity-40"
                    />
                  ))}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.preview}
                    alt={preview.entry.name}
                    className="h-28 w-auto shrink-0"
                  />
                </div>
              </div>
            )}
          </section>
          <section className="mt-10">
            <h2 className="text-xl font-semibold">On the wall now</h2>
            {cards(active)}
          </section>
          {archived.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Archived logos</h2>
              <p className="mt-2 text-sm">
                Hidden from the website. Original artwork is kept so these can
                be restored.
              </p>
              {cards(archived)}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
function Cropper({
  src,
  box,
  onChange,
  disabled,
}: {
  src: string;
  box: Crop | null;
  onChange: (box: Crop | null) => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const point = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  };
  return (
    <div>
      <div
        className="relative inline-block max-w-full select-none overflow-hidden rounded-lg border bg-white align-top touch-none"
        onPointerDown={(e) => {
          if (disabled) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = point(e);
          onChange(null);
        }}
        onPointerMove={(e) => {
          if (!drag.current || disabled) return;
          const p = point(e),
            d = drag.current;
          onChange({
            x: Math.min(d.x, p.x),
            y: Math.min(d.y, p.y),
            width: Math.abs(p.x - d.x),
            height: Math.abs(p.y - d.y),
          });
        }}
        onPointerUp={() => {
          drag.current = null;
          if (box && (box.width < 0.02 || box.height < 0.02)) onChange(null);
        }}
        onPointerCancel={() => {
          drag.current = null;
          onChange(null);
        }}
      >
        {/* The element bounds equal the rendered image bounds; there is no object-contain letterboxing. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={ref}
          src={src}
          alt="Uploaded logo"
          draggable={false}
          className="pointer-events-none block h-auto max-h-64 w-auto max-w-full"
        />
        {box && (
          <div
            className="pointer-events-none absolute border-2 border-amber-600 bg-amber-300/20"
            style={{
              left: `${box.x * 100}%`,
              top: `${box.y * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
            }}
          />
        )}
      </div>
      <p className="mt-2 text-xs">
        Optional: drag to keep part of the image.{" "}
        {box && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(null)}
            className="underline"
          >
            Clear crop
          </button>
        )}
      </p>
    </div>
  );
}
