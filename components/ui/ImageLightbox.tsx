"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export interface LightboxSlide {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

interface Props {
  open: boolean;
  index: number;
  slides: LightboxSlide[];
  onClose: () => void;
}

/**
 * Brand-styled wrapper around yet-another-react-lightbox.
 *
 * Plugins enabled:
 *   - Zoom: scroll/pinch to zoom, double-click to zoom (max 3×)
 *   - Counter: "3 / 12" in the bottom-left
 *   - Captions: alt/title displayed under the image
 *   - Thumbnails: scrollable thumb strip along the bottom
 *   - Fullscreen: button in the toolbar
 *
 * Keyboard: ← → to navigate, Esc to close. Touch: swipe to navigate,
 * pinch to zoom. Backdrop click closes.
 */
export function ImageLightbox({ open, index, slides, onClose }: Props) {
  return (
    <Lightbox
      open={open}
      index={index}
      close={onClose}
      slides={slides.map((s) => ({
        src: s.src,
        alt: s.alt ?? "",
        title: s.title ?? s.alt,
        description: s.description,
      }))}
      plugins={[Zoom, Counter, Captions, Thumbnails, Fullscreen]}
      animation={{ fade: 280, swipe: 320 }}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ finite: false, padding: "16px", spacing: "20%" }}
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 1.5,
        doubleTapDelay: 280,
        doubleClickDelay: 280,
        scrollToZoom: true,
      }}
      counter={{
        container: { style: { top: "unset", bottom: 0, right: "unset", left: 0 } },
      }}
      thumbnails={{
        position: "bottom",
        border: 0,
        borderRadius: 8,
        padding: 4,
        gap: 8,
        imageFit: "cover",
        showToggle: true,
      }}
      captions={{ descriptionTextAlign: "center" }}
      styles={{
        root: {
          "--yarl__color_backdrop": "rgba(5, 5, 5, 0.96)",
          "--yarl__color_button": "rgba(255, 255, 255, 0.85)",
          "--yarl__color_button_active": "var(--color-gold-300, #D89678)",
          "--yarl__color_button_disabled": "rgba(255, 255, 255, 0.3)",
          "--yarl__slide_title_color": "rgba(255, 255, 255, 0.95)",
          "--yarl__slide_description_color": "rgba(255, 255, 255, 0.7)",
          "--yarl__slide_captions_container_background":
            "linear-gradient(0deg, rgba(0,0,0,0.65), transparent)",
        },
        thumbnailsContainer: {
          backgroundColor: "rgba(5, 5, 5, 0.6)",
          backdropFilter: "blur(6px)",
        },
      }}
    />
  );
}
