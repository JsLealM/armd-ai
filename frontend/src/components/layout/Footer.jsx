import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>ARMD-AI</span>
          <p className={styles.tagline}>
            Predicción de susceptibilidad antibiótica en S. aureus
          </p>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <span className={styles.colHead}>Proyecto</span>
            <span className={styles.colLink}>Análisis visual</span>
            <span className={styles.colLink}>Resultados de modelos</span>
            <span className={styles.colLink}>Metodología</span>
          </div>

          <div className={styles.col}>
            <span className={styles.colHead}>Tecnologías</span>
            <span className={styles.colLink}>Python + JupyterLab</span>
            <span className={styles.colLink}>React + Vite</span>
            <span className={styles.colLink}>Scikit-learn</span>
          </div>


        </div>

        <div className={styles.bottom}>
          <span className={styles.caption}>
            ARMD-AI · Prototipo académico · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
