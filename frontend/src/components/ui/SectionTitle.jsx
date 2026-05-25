import { useInView } from "../../hooks/useInView";
import styles from "./SectionTitle.module.css";

/**
 * Section title with optional eyebrow label.
 * Eyebrow uses figmaMono uppercase, title uses display-lg.
 */
export default function SectionTitle({ eyebrow, title, subtitle, align = "left" }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${styles[align]} ${
        isInView ? styles.visible : styles.hidden
      }`}
    >
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <h2 className={styles.title}>{title}</h2>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </div>
  );
}
