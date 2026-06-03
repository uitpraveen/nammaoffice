"use client";

import { useEffect, useRef, useState } from "react";

interface ZohoFormEmbedProps {
  /** Zoho public form page URL (the …/formperma/<id> link). */
  url: string;
  title: string;
}

/**
 * Renders a Zoho form inside an iframe and auto-sizes its height.
 *
 * Zoho public forms post a `"<formperma>|<height>|…"` message to the parent
 * window when the iframe src carries `?zf_rszfm=1`. We listen for it and grow
 * the iframe to fit, so the form never has an inner scrollbar. A generous
 * initial height avoids a layout jump before the first message arrives.
 */
export function ZohoFormEmbed({ url, title }: ZohoFormEmbedProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1100);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.data !== "string") return;
      const parts = e.data.split("|");
      if (parts.length < 2) return;
      const [perma, rawHeight] = parts;
      const h = parseInt(rawHeight, 10);
      const iframe = ref.current;
      if (!iframe || !Number.isFinite(h)) return;
      // Only react to messages from *our* form's iframe.
      if (iframe.src.includes("formperma") && iframe.src.includes(perma)) {
        setHeight(h + 15);
      }
    }
    window.addEventListener("message", onMessage, false);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const src = url.includes("?") ? `${url}&zf_rszfm=1` : `${url}?zf_rszfm=1`;

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      aria-label={title}
      loading="lazy"
      style={{ width: "100%", height: `${height}px`, border: "none", display: "block" }}
    />
  );
}
