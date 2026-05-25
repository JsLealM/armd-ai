import { heroContent, projectFlow } from "../../data/projectSummary";
import { ArrowRight, FlaskConical } from "lucide-react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.eyebrowRow}>
            <FlaskConical size={16} strokeWidth={2} />
            <span className={styles.eyebrow}>Prototipo académico</span>
          </div>

          <h1 className={styles.title}>{heroContent.title}</h1>
          <p className={styles.subtitle}>{heroContent.subtitle}</p>
          <p className={styles.description}>{heroContent.description}</p>

          <div className={styles.tags}>
            {heroContent.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className={styles.cta}>
            <a href="#context" className="btn btn-primary">
              Explorar análisis
              <ArrowRight size={18} />
            </a>
            <a href="/modelos" className="btn btn-secondary">
              Ver modelos
            </a>
          </div>
        </div>

        <div className={styles.flow}>
          {projectFlow.map((step, i) => (
            <div key={step.step} className={styles.flowStep}>
              <span className={styles.flowNumber}>{String(step.step).padStart(2, "0")}</span>
              <span className={styles.flowLabel}>{step.label}</span>
              <span className={styles.flowDesc}>{step.description}</span>
              {i < projectFlow.length - 1 ? (
                <ArrowRight size={16} className={styles.flowArrow} />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
