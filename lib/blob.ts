import { put } from "@vercel/blob";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string | null;
  /** True if uploaded to Vercel Blob; false if BLOB_READ_WRITE_TOKEN is missing. */
  stored: boolean;
}

/**
 * Upload a File to Vercel Blob if the token is configured. If not, returns
 * file metadata with `stored: false` so the API route can still email the
 * submission without crashing.
 */
export async function uploadFile(
  file: File,
  pathPrefix: string
): Promise<UploadedFile> {
  const meta = {
    name: file.name,
    size: file.size,
    type: file.type,
  };

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ...meta, url: null, stored: false };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${pathPrefix}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });

  return { ...meta, url: blob.url, stored: true };
}

/** Render an UploadedFile as an HTML link or "[file pending upload]". */
export function fileLinkHtml(f: UploadedFile | null | undefined): string {
  if (!f) return "-";
  if (f.url) {
    return `<a href="${f.url}" target="_blank" rel="noreferrer">${escapeHtml(f.name)}</a> (${formatBytes(f.size)})`;
  }
  return `${escapeHtml(f.name)} (${formatBytes(f.size)}) - <em>not stored, contact submitter for the file</em>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
