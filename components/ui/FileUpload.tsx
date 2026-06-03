"use client";

import { cn } from "@/lib/utils";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  label: string;
  name: string;
  accept?: string;
  maxSizeMB?: number;
  required?: boolean;
  helperText?: string;
  error?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
}

export function FileUpload({
  label,
  name,
  accept = ".jpg,.jpeg,.png,.pdf",
  maxSizeMB = 15,
  required,
  helperText,
  error,
  value,
  onChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const id = `file-${name}`;

  function handleSelect(file: File | null) {
    setLocalError(null);
    if (!file) {
      onChange(null);
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setLocalError(`File too large - max ${maxSizeMB} MB. Yours is ${sizeMB.toFixed(1)} MB.`);
      return;
    }
    onChange(file);
  }

  function clear() {
    onChange(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const showError = error || localError;
  const isImage = value?.type.startsWith("image/");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium font-sans text-warm-charcoal">
        {label}
        {required && <span className="text-[var(--color-gold-deep)] ml-0.5">*</span>}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        aria-invalid={showError ? true : undefined}
        className="sr-only"
        onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
      />
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-brand border-2 border-dashed",
            "transition-colors text-center",
            showError
              ? "border-red-400 bg-red-50/50"
              : "border-warm-border bg-white hover:border-[var(--color-gold-300)] hover:bg-[var(--color-gold-50)]"
          )}
        >
          <Upload className="w-5 h-5 text-[var(--color-ink-secondary)]" strokeWidth={1.75} />
          <span className="text-sm font-medium text-warm-charcoal">
            Click to upload
          </span>
          <span className="text-xs text-[var(--color-ink-secondary)]">
            {accept.split(",").map((a) => a.trim().toUpperCase().replace(".", "")).join(" · ")} · max {maxSizeMB} MB
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-brand border border-warm-border bg-white">
          <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--color-gold-50)] text-[var(--color-gold-deep)]">
            {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-warm-charcoal truncate">
              {value.name}
            </span>
            <span className="block text-xs text-[var(--color-ink-secondary)]">
              {(value.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </span>
          <button
            type="button"
            onClick={clear}
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-ink-secondary)] hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label={`Remove ${value.name}`}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}
      {helperText && !showError && (
        <p className="text-xs text-[var(--color-ink-secondary)]">{helperText}</p>
      )}
      {showError && <p className="text-sm text-red-500 font-sans">{showError}</p>}
    </div>
  );
}
