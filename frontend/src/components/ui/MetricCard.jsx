import { useInView } from "../../hooks/useInView";
import styles from "./MetricCard.module.css";

/**
 * Large number + label card for key stats.
 * Follows DESIGN.md pricing-card pattern: hairline border, rounded-lg.
 */
export default function MetricCard({ value, label, context, delay = 0 }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`${styles.card} ${isInView ? styles.visible : styles.hidden}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
      {context ? <span className={styles.context}>{context}</span> : null}
    </div>
  );
}
