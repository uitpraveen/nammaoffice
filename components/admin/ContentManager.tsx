"use client";
import Image from "next/image";
import { useState } from "react";
import type { NewsItem, Testimonial } from "@/lib/cms/types";
import { AdminNav } from "./AdminNav";
import { adminRequest } from "./request";

type Kind = "news" | "testimonials";
type Item = NewsItem | Testimonial;
type Draft = Record<string, string>;
const fieldClass = "mt-2 w-full min-w-0 rounded-lg border p-3 text-sm";
function empty(kind: Kind): Draft {
  return kind === "news"
    ? {
        id: "",
        version: "",
        title: "",
        slug: "",
        date: "",
        category: "News",
        excerpt: "",
        body: "",
        coverImage: "",
        coverAlt: "",
        videoUrl: "",
        status: "draft",
      }
    : {
        id: "",
        version: "",
        quote: "",
        name: "",
        role: "",
        company: "",
        centre: "",
        order: "0",
        status: "draft",
      };
}
function draftOf(item: Item): Draft {
  return Object.fromEntries(
    Object.entries(item).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.join("\n\n") : String(v),
    ]),
  );
}
export function ContentManager({
  kind,
  initialItems,
}: {
  kind: Kind;
  initialItems: Item[];
}) {
  const [items, setItems] = useState(initialItems),
    [form, setForm] = useState<Draft>(empty(kind));
  const [busy, setBusy] = useState(false),
    [dirty, setDirty] = useState(false),
    [preview, setPreview] = useState(false);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const news = kind === "news";
  function change(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }
  function edit(item?: Item) {
    if (dirty && !confirm("Discard the unsaved changes in this editor?"))
      return;
    setForm(item ? draftOf(item) : empty(kind));
    setDirty(false);
    setPreview(false);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    const submitted = { ...form, id: form.id || crypto.randomUUID(), kind };
    setForm(submitted);
    try {
      const { entry } = await adminRequest("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitted),
      });
      setItems((current) => [
        ...current.filter((i) => i.id !== entry.id),
        entry,
      ]);
      setForm(draftOf(entry));
      setDirty(false);
      setNotice(
        entry.status === "published"
          ? "Published to the website."
          : entry.status === "archived"
            ? "Archived and hidden from the website. You can restore it by changing its status."
            : "Draft saved. It is not visible on the website.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function upload(file?: File) {
    if (!file || busy) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("Choose an image under 3 MB.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      data.set("file", file);
      const result = await adminRequest("/api/admin/assets", {
        method: "POST",
        body: data,
      });
      change("coverImage", result.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function field(
    key: string,
    label: string,
    max: number,
    type = "text",
    required = false,
  ) {
    return (
      <label className="block min-w-0 text-sm font-medium" key={key}>
        {label}
        {required ? " *" : ""}
        {type === "textarea" ? (
          <textarea
            name={key}
            value={form[key]}
            maxLength={max}
            rows={key === "body" ? 12 : 4}
            required={required}
            onChange={(e) => change(key, e.target.value)}
            className={fieldClass}
          />
        ) : (
          <input
            name={key}
            type={type}
            value={form[key]}
            maxLength={max}
            min={type === "number" ? 0 : undefined}
            max={type === "number" ? 10000 : undefined}
            required={required}
            onChange={(e) => change(key, e.target.value)}
            className={fieldClass}
          />
        )}
      </label>
    );
  }
  return (
    <>
      <AdminNav />
      <main className="content-width min-w-0 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="display text-3xl">
            {news ? "News" : "Client testimonials"}
          </h1>
          <button
            type="button"
            disabled={busy}
            onClick={() => edit()}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            {news ? "New article" : "New testimonial"}
          </button>
        </div>
        <p className="mt-3 text-sm">
          Drafts are private. Publish when ready, or archive to hide an item
          while keeping it available for later.
        </p>
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-300 p-4 text-red-800"
          >
            {error}{" "}
            <a className="underline" href={`/admin/${kind}`}>
              Reload editor
            </a>
          </div>
        )}
        {notice && (
          <p role="status" className="mt-5 rounded-xl border p-4">
            {notice}
          </p>
        )}
        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form
            onSubmit={save}
            className="min-w-0 rounded-xl border hairline bg-white p-5"
          >
            <h2 className="mb-5 text-xl font-semibold">
              {form.version ? "Edit" : "Create"}{" "}
              {news ? "article" : "testimonial"}
            </h2>
            <fieldset disabled={busy} className="min-w-0 space-y-5">
              {news ? (
                <>
                  {field("title", "Title", 180, "text", true)}
                  {field(
                    "slug",
                    "URL slug (lowercase letters, numbers and hyphens)",
                    100,
                    "text",
                    true,
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field("date", "Article date", 10, "date", true)}
                    <label className="text-sm font-medium">
                      Category
                      <select
                        value={form.category}
                        onChange={(e) => change("category", e.target.value)}
                        className={fieldClass}
                      >
                        {["News", "Video", "Insight", "Event"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="text-xs">
                    The date is displayed on the article. Publishing makes it
                    visible immediately; scheduling is not enabled.
                  </p>
                  {field(
                    "excerpt",
                    "Summary",
                    600,
                    "textarea",
                    form.status === "published",
                  )}
                  {field(
                    "body",
                    "Article (separate paragraphs with a blank line)",
                    30000,
                    "textarea",
                    form.status === "published",
                  )}
                  <label className="block text-sm font-medium">
                    Cover image (optional, under 3 MB)
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => {
                        upload(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                      className="mt-2 block w-full min-w-0 text-sm"
                    />
                  </label>
                  {form.coverImage && (
                    <div>
                      <Image
                        unoptimized
                        width={1600}
                        height={1200}
                        src={form.coverImage}
                        alt={form.coverAlt || "Cover preview"}
                        className="max-h-48 w-auto max-w-full rounded-lg"
                      />
                      <button
                        type="button"
                        className="mt-2 text-sm underline"
                        onClick={() => change("coverImage", "")}
                      >
                        Remove cover
                      </button>
                    </div>
                  )}
                  {field(
                    "coverAlt",
                    "Cover image description",
                    200,
                    "text",
                    Boolean(form.coverImage),
                  )}
                  {field(
                    "videoUrl",
                    "YouTube or Vimeo URL (optional)",
                    500,
                    "url",
                  )}
                </>
              ) : (
                <>
                  {field("quote", "Client quote", 2000, "textarea", true)}
                  {field("name", "Person’s name", 150, "text", true)}
                  {field("role", "Role (optional)", 150)}
                  {field("company", "Company", 150, "text", true)}
                  {field("centre", "NammaOffice centre (optional)", 150)}
                  {field(
                    "order",
                    "Display order (lowest first)",
                    5,
                    "number",
                    true,
                  )}
                </>
              )}
              <label className="block text-sm font-medium">
                Status
                <select
                  value={form.status}
                  onChange={(e) => change("status", e.target.value)}
                  className={fieldClass}
                >
                  <option value="draft">Draft — private</option>
                  <option value="published">
                    Published — visible on website
                  </option>
                  <option value="archived">
                    Archived — hidden and restorable
                  </option>
                </select>
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--color-navy)] px-5 py-2.5 text-white"
                >
                  {busy ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setPreview((v) => !v)}
                  className="rounded-lg border px-5 py-2.5"
                >
                  {preview ? "Hide preview" : "Preview"}
                </button>
              </div>
            </fieldset>
            {preview && (
              <section
                aria-label="Content preview"
                className="mt-6 overflow-hidden rounded-xl border bg-[var(--color-bg)] p-5"
              >
                <p className="mb-3 text-xs uppercase tracking-wider">
                  Unsaved preview
                </p>
                {news ? (
                  <>
                    <h3 className="display break-words text-2xl">
                      {form.title}
                    </h3>
                    <p className="mt-3 text-sm">{form.excerpt}</p>
                    {form.body.split(/\n\s*\n/).map((p, i) => (
                      <p
                        className="mt-4 whitespace-pre-wrap break-words text-sm"
                        key={i}
                      >
                        {p}
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    <blockquote className="break-words text-xl">
                      “{form.quote}”
                    </blockquote>
                    <p className="mt-4">
                      {form.name} · {form.company}
                    </p>
                    <p className="text-sm">{form.role}</p>
                  </>
                )}
              </section>
            )}
          </form>
          <aside className="min-w-0">
            <h2 className="text-xl font-semibold">
              Saved {news ? "articles" : "testimonials"}
            </h2>
            {!items.length && (
              <p className="mt-4 text-sm">
                No content yet. Create a draft to get started.
              </p>
            )}
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border hairline bg-white p-4"
                >
                  <p className="break-words font-medium">
                    {"title" in item
                      ? item.title
                      : `${item.name} · ${item.company}`}
                  </p>
                  <p className="mt-1 text-sm capitalize">{item.status}</p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <button
                      disabled={busy}
                      className="underline"
                      type="button"
                      onClick={() => edit(item)}
                    >
                      Edit
                    </button>
                    {"slug" in item && item.status === "published" && (
                      <a
                        className="underline"
                        href={`/news/${item.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View article
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </>
  );
}
