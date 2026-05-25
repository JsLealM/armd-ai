import { useInView } from "../../hooks/useInView";
import styles from "./VariantCard.module.css";

/**
 * Card for each dataset variant.
 * Uses the color-block concept from DESIGN.md as a colored stripe accent.
 */
export default function VariantCard({ name, description, details, badge, color, delay = 0 }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`${styles.card} ${isInView ? styles.visible : styles.hidden}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={styles.accent} style={{ backgroundColor: color }} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.badge}>{badge}</span>
        </div>
        <p className={styles.description}>{description}</p>
        <p className={styles.details}>{details}</p>
      </div>
    </div>
  );
}
