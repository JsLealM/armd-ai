import SectionTitle from "../ui/SectionTitle";
import { datasetContext, projectFlow } from "../../data/projectSummary";
import { Database, Filter, Layers } from "lucide-react";
import styles from "./DatasetContextSection.module.css";

export default function DatasetContextSection() {
  // Map icons for a small visual journey
  const icons = [
    <Database size={24} strokeWidth={2} />,
    <Filter size={24} strokeWidth={2} />,
    <Layers size={24} strokeWidth={2} />,
  ];

  return (
    <section className="section" id="context">
      <div className="container">
        <div className="color-block block-lilac">
          <SectionTitle
            eyebrow={datasetContext.eyebrow}
            title={datasetContext.title}
          />
          
          <div className={styles.contentGrid}>
            <div className={styles.paragraphsCol}>
              {datasetContext.paragraphs.map((p, idx) => (
                <p key={idx} className={styles.paragraph}>
                  {p}
                </p>
              ))}
            </div>

            <div className={styles.flowCol}>
              <h3 className={styles.flowTitle}>Flujo de Consistencia</h3>
              <div className={styles.flowSteps}>
                {projectFlow.slice(0, 3).map((item, idx) => (
                  <div key={item.step} className={styles.flowStep}>
                    <div className={styles.iconCircle}>
                      {icons[idx]}
                    </div>
                    <div className={styles.stepInfo}>
                      <span className={styles.stepLabel}>{item.label}</span>
                      <p className={styles.stepDesc}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
