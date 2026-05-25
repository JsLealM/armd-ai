import { useInView } from "../../hooks/useInView";
import { useLightbox } from "../../hooks/useLightbox";
import { Info } from "lucide-react";
import styles from "./ImagePanel.module.css";

/**
 * Chart image display with title, caption, and optional insight callout.
 * Image frame uses rounded-md with hairline border.
 * Click on the image to open it in the full-screen lightbox.
 */
export default function ImagePanel({ title, image, caption, insight, delay = 0 }) {
  const [ref, isInView] = useInView();
  const { openLightbox } = useLightbox();

  const handleImageClick = () => {
    openLightbox(image, title || "Gráfica");
  };

  return (
    <div
      ref={ref}
      className={`${styles.panel} ${isInView ? styles.visible : styles.hidden}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {title ? <h3 className={styles.title}>{title}</h3> : null}

      <div
        className={styles.imageFrame}
        onClick={handleImageClick}
        role="button"
        tabIndex={0}
        aria-label={`Ver ${title || "imagen"} en tamaño completo`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleImageClick(); }}
      >
        <img src={image} alt={title || "Gráfica"} loading="lazy" />
      </div>

      {caption ? <p className={styles.caption}>{caption}</p> : null}

      {insight ? (
        <div className={styles.insight}>
          <Info size={16} strokeWidth={2} />
          <span>{insight}</span>
        </div>
      ) : null}
    </div>
  );
}

