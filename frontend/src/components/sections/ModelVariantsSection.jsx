import SectionTitle from "../ui/SectionTitle";
import VariantCard from "../ui/VariantCard";
import { datasetVariants } from "../../data/modelVariants";
import styles from "./ModelVariantsSection.module.css";

export default function ModelVariantsSection() {
  return (
    <section className="section" id="variants">
      <div className="container">
        <div className="color-block block-mint">
          <SectionTitle
            eyebrow="Versiones de modelado"
            title="5 variantes de dataset"
            subtitle="Cada variante agrega información progresiva para evaluar qué combinación de features mejora la predicción."
          />

          <div className={styles.grid}>
            {datasetVariants.map((variant, i) => (
              <VariantCard key={variant.id} {...variant} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
