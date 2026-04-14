import { cn } from "@/lib/utils";
import { googleMapsEmbedUrl } from "@/lib/utils";

interface GoogleMapProps {
  lat: number;
  lng: number;
  title: string;
  className?: string;
}

export function GoogleMap({ lat, lng, title, className }: GoogleMapProps) {
  const src = googleMapsEmbedUrl(lat, lng);

  return (
    <div className={cn("w-full overflow-hidden rounded-brand", className)}>
      <iframe
        src={src}
        title={title}
        width="100%"
        height="300"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
