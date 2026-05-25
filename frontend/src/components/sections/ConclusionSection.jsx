import SectionTitle from "../ui/SectionTitle";
import { conclusionContent } from "../../data/projectSummary";
import { useInView } from "../../hooks/useInView";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import styles from "./ConclusionSection.module.css";

export default function ConclusionSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="section" id="conclusion">
      <div className="container">
        <div className="color-block block-navy">
          <SectionTitle
            eyebrow={conclusionContent.eyebrow}
            title={conclusionContent.title}
          />

          <ul
            ref={ref}
            className={`${styles.list} ${isInView ? styles.visible : styles.hidden}`}
          >
            {conclusionContent.points.map((point, i) => (
              <li
                key={i}
                className={styles.item}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <CheckCircle2 size={18} strokeWidth={2} />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className={styles.cta}>
            <a href="/modelos" className={`btn ${styles.btnInverse}`}>
              Ver resultados de modelos
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
