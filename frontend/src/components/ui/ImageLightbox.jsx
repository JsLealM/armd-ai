import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLightbox } from "../../hooks/useLightbox";
import { X } from "lucide-react";
import styles from "./ImageLightbox.module.css";

/**
 * Full-screen image lightbox rendered via React Portal.
 * Features:
 *  - Backdrop blur + scrim overlay
 *  - Image scales up from 0.85 → 1 with deceleration easing
 *  - Closes on: ESC key, backdrop click, or close button
 *  - Body scroll is locked while open
 */
export default function ImageLightbox() {
  const { isOpen, src, alt, closeLightbox } = useLightbox();
  const overlayRef = useRef(null);
  const imgRef = useRef(null);

  // Lock body scroll & bind ESC key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, closeLightbox]);

  // Click outside the image → close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      closeLightbox();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Imagen ampliada"}
    >
      <button
        className={styles.closeBtn}
        onClick={closeLightbox}
        aria-label="Cerrar"
      >
        <X size={24} strokeWidth={2} />
      </button>

      <img
        ref={imgRef}
        src={src}
        alt={alt || "Imagen ampliada"}
        className={styles.image}
      />
    </div>,
    document.body
  );
}
