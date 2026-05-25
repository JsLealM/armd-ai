import SectionTitle from "../components/ui/SectionTitle";
import MetricCard from "../components/ui/MetricCard";
import VariantCard from "../components/ui/VariantCard";
import ImagePanel from "../components/ui/ImagePanel";
import { useInView } from "../hooks/useInView";
import { datasetVariants } from "../data/modelVariants";
import {
  validationResults,
  bestModelTest,
  modelingContext,
  formatScore,
} from "../data/modelResults";
import { Trophy, AlertTriangle, BarChart3 } from "lucide-react";
import comparacionImg from "../assets/models/09_comparacion_modelos_validacion.png";
import confusionImg from "../assets/models/10_matriz_confusion_mejor_modelo.png";
import styles from "./ModelsPage.module.css";

function ResultsTable() {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`${styles.tableWrapper} ${isInView ? styles.visible : styles.hidden}`}
    >
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Accuracy</th>
            <th>Bal. Accuracy</th>
            <th>F1 Macro</th>
          </tr>
        </thead>
        <tbody>
          {validationResults.map((row) => (
            <tr key={row.modelo} className={row.isBest ? styles.bestRow : ""}>
              <td className={styles.modelName}>
                {row.isBest ? <Trophy size={14} strokeWidth={2.5} /> : null}
                {row.modelo}
              </td>
              <td>{formatScore(row.accuracy)}</td>
              <td className={styles.primary}>{formatScore(row.balanced_accuracy)}</td>
              <td>{formatScore(row.f1_macro)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ModelsPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <SectionTitle
            eyebrow={modelingContext.eyebrow}
            title={modelingContext.title}
            subtitle={modelingContext.objective}
          />

          <div className={styles.heroMetrics}>
            <MetricCard
              value={formatScore(bestModelTest.balanced_accuracy)}
              label="Mejor balanced_accuracy"
              context={`${bestModelTest.modelo} · Test set`}
              delay={0}
            />
            <MetricCard
              value="5"
              label="Variantes de dataset"
              context="Progresivas en complejidad"
              delay={100}
            />
            <MetricCard
              value="6"
              label="Algoritmos evaluados"
              context="Dataset base"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ── Dataset Variants ── */}
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Variantes"
            title="Las 5 versiones del dataset"
            subtitle="Cada variante agrega información progresiva para evaluar qué combinación de features mejora la predicción."
          />

          <div className={styles.variantGrid}>
            {datasetVariants.map((v, i) => (
              <VariantCard key={v.id} {...v} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Results Table ── */}
      <section className="section">
        <div className="container">
          <div className="color-block block-coral">
            <SectionTitle
              eyebrow="Validación cruzada"
              title="Resultados en dataset base"
              subtitle="Métrica principal: balanced_accuracy, que pondera equitativamente las tres clases."
            />

            <ResultsTable />

            <div className={styles.chartsRow}>
              <ImagePanel
                title="Comparación de modelos"
                image={comparacionImg}
                caption="Accuracy vs. balanced_accuracy vs. f1_macro para cada modelo evaluado en validación."
              />
              <ImagePanel
                title="Matriz de confusión — DecisionTree"
                image={confusionImg}
                caption="El mejor modelo por balanced_accuracy muestra mejor distribución entre las tres clases, aunque Intermediate sigue siendo la más difícil."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Methodological Note ── */}
      <section className="section">
        <div className="container">
          <div className="color-block block-navy">
            <SectionTitle
              eyebrow="Nota metodológica"
              title="¿Por qué no basta con accuracy?"
            />

            <div className={styles.noteGrid}>
              <div className={styles.noteCard}>
                <BarChart3 size={20} strokeWidth={2} />
                <h4 className={styles.noteTitle}>Problema desbalanceado</h4>
                <p className={styles.noteText}>{modelingContext.whyBalanced}</p>
              </div>

              <div className={styles.noteCard}>
                <AlertTriangle size={20} strokeWidth={2} />
                <h4 className={styles.noteTitle}>Clase Intermediate</h4>
                <p className={styles.noteText}>{modelingContext.intermediateNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
