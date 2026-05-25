import SectionTitle from "../ui/SectionTitle";
import ImagePanel from "../ui/ImagePanel";
import { chartTexts } from "../../data/projectSummary";
import expo08 from "../../assets/expo/expo_08_cultivo_vs_susceptibilidad.png";
import expo09 from "../../assets/expo/expo_09_edad_vs_susceptibilidad.png";
import expo12 from "../../assets/expo/expo_12_heatmap_correlacion_modelado_completo.png";
import expo13 from "../../assets/expo/expo_13_boxplot_wbc_por_susceptibility.png";
import styles from "./SusceptibilityBehaviorSection.module.css";

export default function SusceptibilityBehaviorSection() {
  return (
    <section className="section" id="behavior">
      <div className="container">
        <div className="color-block block-mint">
          <SectionTitle
            eyebrow="Comportamiento del Objetivo"
            title="Factores Relacionados con la Susceptibilidad"
            subtitle="Análisis detallado de cómo varía la susceptibilidad según microbiología, demografía, correlaciones e indicadores de laboratorio."
          />

          <div className={styles.grid}>
            {/* Row 1: 2 Columns (expo08 y expo09) */}
            <div className={styles.half}>
              <ImagePanel
                title={chartTexts.expo_08.title}
                image={expo08}
                caption={chartTexts.expo_08.caption}
                insight={chartTexts.expo_08.insight}
                delay={0}
              />
            </div>
            
            <div className={styles.half}>
              <ImagePanel
                title={chartTexts.expo_09.title}
                image={expo09}
                caption={chartTexts.expo_09.caption}
                insight={chartTexts.expo_09.insight}
                delay={100}
              />
            </div>

            {/* Row 2: Full Width Heatmap (expo12) */}
            <div className={styles.wide}>
              <ImagePanel
                title={chartTexts.expo_12.title}
                image={expo12}
                caption={chartTexts.expo_12.caption}
                insight={chartTexts.expo_12.insight}
                delay={200}
              />
            </div>

            {/* Row 3: Half-width centered/split (expo13 with custom textual explanation) */}
            <div className={styles.half}>
              <ImagePanel
                title={chartTexts.expo_13.title}
                image={expo13}
                caption={chartTexts.expo_13.caption}
                insight={chartTexts.expo_13.insight}
                delay={300}
              />
            </div>

            <div className={styles.textPanel}>
              <h4 className={styles.panelTitle}>Indicadores Clínicos Clave</h4>
              <p className={styles.panelText}>
                Las variables clínicas como <code>median_wbc</code> (recuento de leucocitos medianos) y <code>median_cr</code> (creatinina mediana) actúan como indicadores indirectos del estado sistémico del paciente.
              </p>
              <p className={styles.panelText}>
                El boxplot revela que, aunque la mediana general es similar, la distribución de valores extremos de leucocitos varía entre las clases de susceptibilidad, indicando que pacientes con aislamientos resistentes o intermedios presentan respuestas inflamatorias más severas o atípicas.
              </p>
              <div className={styles.badgeRow}>
                <span className="badge">Leucocitos</span>
                <span className="badge">Resistencia</span>
                <span className="badge">Correlaciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
