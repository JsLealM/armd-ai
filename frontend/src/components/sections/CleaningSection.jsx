import SectionTitle from "../ui/SectionTitle";
import MetricCard from "../ui/MetricCard";
import ImagePanel from "../ui/ImagePanel";
import { chartTexts, metrics } from "../../data/projectSummary";
import expo01 from "../../assets/expo/expo_01_resumen_limpieza.png";
import expo02 from "../../assets/expo/expo_02_objetivo_antes_despues.png";
import styles from "./CleaningSection.module.css";

export default function CleaningSection() {
  return (
    <section className="section" id="cleaning">
      <div className="container">
        <SectionTitle
          eyebrow="Calidad de datos"
          title="Limpieza conservadora, calidad real"
          subtitle="El dataset se depuró sin destruir la base de trabajo. Pero la calidad no se mide solo con NaN."
        />

        <div className={styles.metricsRow}>
          <MetricCard {...metrics.recordsBefore} delay={0} />
          <MetricCard {...metrics.recordsAfter} delay={100} />
          <MetricCard {...metrics.datasetVariants} delay={200} />
          <MetricCard {...metrics.modelsEvaluated} delay={300} />
        </div>

        <div className={styles.chartsBlock}>
          <div className="color-block block-lime">
            <div className={styles.chartsGrid}>
              <ImagePanel
                title={chartTexts.expo_01.title}
                image={expo01}
                caption={chartTexts.expo_01.caption}
                insight={chartTexts.expo_01.insight}
                delay={0}
              />
              <ImagePanel
                title={chartTexts.expo_02.title}
                image={expo02}
                caption={chartTexts.expo_02.caption}
                insight={chartTexts.expo_02.insight}
                delay={150}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
