import SectionTitle from "../ui/SectionTitle";
import ImagePanel from "../ui/ImagePanel";
import { chartTexts, variableSelection } from "../../data/projectSummary";
import { useInView } from "../../hooks/useInView";
import { Check, AlertTriangle, X } from "lucide-react";
import expo04 from "../../assets/expo/expo_04_decision_variables.png";
import styles from "./VariableSelectionSection.module.css";

export default function VariableSelectionSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="section" id="variables">
      <div className="container">
        <div className="color-block block-cream">
          <SectionTitle
            eyebrow={variableSelection.eyebrow}
            title={variableSelection.title}
          />

          <div className={styles.layout}>
            <div className={styles.chart}>
              <ImagePanel
                title={chartTexts.expo_04.title}
                image={expo04}
                caption={chartTexts.expo_04.caption}
                insight={chartTexts.expo_04.insight}
              />
            </div>

            <div
              ref={ref}
              className={`${styles.lists} ${isInView ? styles.visible : styles.hidden}`}
            >
              <div className={styles.group}>
                <h4 className={styles.groupTitle}>
                  <Check size={16} strokeWidth={2.5} />
                  Retenidas
                </h4>
                <ul className={styles.list}>
                  {variableSelection.retained.map((v) => (
                    <li key={v} className={styles.item}>
                      <code className={styles.code}>{v}</code>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.group}>
                <h4 className={styles.groupTitle}>
                  <AlertTriangle size={16} strokeWidth={2.5} />
                  Con cautela
                </h4>
                <ul className={styles.list}>
                  {variableSelection.cautious.map((v) => (
                    <li key={v} className={styles.item}>
                      <code className={styles.code}>{v}</code>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.group}>
                <h4 className={styles.groupTitle}>
                  <X size={16} strokeWidth={2.5} />
                  Excluidas
                </h4>
                <ul className={styles.list}>
                  {variableSelection.excluded.map((v) => (
                    <li key={v} className={styles.itemText}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
