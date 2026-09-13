import { cn } from "@/lib/utils";

import { videoEmbedUrl } from "@/lib/video";

interface VideoEmbedProps {
  /** A YouTube or Vimeo watch/share URL. */
  url: string;
  title?: string;
  className?: string;
}

/** Responsive 16:9 lazy-loaded YouTube/Vimeo embed. */
export function VideoEmbed({ url, title = "Video", className }: VideoEmbedProps) {
  const src = videoEmbedUrl(url);
  if (!src) return null;
  return (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-2xl bg-black",
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
