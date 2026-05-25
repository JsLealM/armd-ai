import SectionTitle from "../ui/SectionTitle";
import ImagePanel from "../ui/ImagePanel";
import { chartTexts } from "../../data/projectSummary";
import expo11 from "../../assets/expo/expo_11_faltantes_semanticos.png";
import styles from "./DataQualitySection.module.css";

export default function DataQualitySection() {
  return (
    <section className="section" id="quality">
      <div className="container">
        <div className="color-block block-pink">
          <SectionTitle
            eyebrow="Cobertura Real"
            title="Calidad Semántica vs. Técnica"
            subtitle="Una variable puede tener 0% de nulos técnicos (NaN) y aun así carecer de información útil real."
          />

          <div className={styles.contentWrapper}>
            <div className={styles.chartWrapper}>
              <ImagePanel
                title={chartTexts.expo_11.title}
                image={expo11}
                caption={chartTexts.expo_11.caption}
                insight={chartTexts.expo_11.insight}
              />
            </div>
            <div className={styles.textDetails}>
              <h4 className={styles.detailTitle}>¿Qué es un faltante semántico?</h4>
              <p className={styles.detailText}>
                Ocurre cuando el sistema clínico registra celdas vacías mediante etiquetas explícitas como <code>SIN_REGISTRO</code>, <code>SIN_REGLA</code> o <code>NO_APLICA</code>. Para un software tradicional de base de datos, este campo no es un nulo, por lo que pasa desapercibido en filtros automáticos de calidad.
              </p>
              <h4 className={styles.detailTitle}>Impacto en el Modelado</h4>
              <p className={styles.detailText}>
                Si entrenamos un modelo con variables que tienen 100% de cobertura técnica pero cuyos valores son genéricos o sin reglas aplicables, el algoritmo aprende "ruido". Este análisis garantizó que cada variable seleccionada tuviera relevancia semántica e información sustancial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
