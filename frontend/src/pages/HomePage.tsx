import { useNavigate } from 'react-router-dom';
import { ClinicalDisclaimer, MetricTile, SectionHeader } from '../components/Common';
import { appRoutes } from '../routes/routes';
import { OrganismName } from '../utils/organismLabels';

interface HomePageProps {
  openEvaluation: () => void;
}

export function HomePage({ openEvaluation }: HomePageProps) {
  const navigate = useNavigate();

  return (
    <main className="page-stack">
      <ClinicalDisclaimer />
      <section className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Susceptibilidad antibiotica exploratoria</span>
          <h1>Apoyo exploratorio para interpretar susceptibilidad antibiotica</h1>
          <p>
            Ingrese datos del cultivo y variables clinicas disponibles para obtener una estimacion
            academica de susceptibilidad o resistencia.
          </p>
          <div className="actions-row">
            <button className="primary-action" onClick={openEvaluation} type="button">
              Nueva evaluacion
            </button>
            <button className="secondary-action" onClick={() => navigate(appRoutes.models)} type="button">
              Ver modelos y rendimiento
            </button>
          </div>
        </div>
        <div className="clinical-panel">
          <div className="culture-card">
            <span className="panel-label">Pipeline V2</span>
            <div className="organism-strip">
              {[
                'ESCHERICHIA COLI',
                'KLEBSIELLA PNEUMONIAE',
                'STAPHYLOCOCCUS AUREUS',
                'PROTEUS MIRABILIS',
                'ENTEROCOCCUS SPECIES',
                'PSEUDOMONAS AERUGINOSA',
              ].map((item) => <OrganismName key={item} value={item} />)}
            </div>
            <div className="visual-summary-card">
              <strong>Data-driven susceptibility review</strong>
              <p>Flujo academico para estimar Susceptible o Resistant con variables microbiologicas y clinicas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-grid">
        <MetricTile label="Cobertura" value="6 bacterias" />
        <MetricTile label="Metodologia" value="Binaria" />
        <MetricTile label="Mejor modelo" value="XGBoost" />
        <MetricTile label="F1 macro" value="0.843" />
      </section>

      <section className="workflow-card">
        <SectionHeader
          title="Flujo de trabajo clinico"
          text="La app separa captura de datos, prediccion exploratoria y revision medica."
        />
        <div className="workflow">
          {['Cultivo', 'Antibiotico', 'Variables clinicas', 'Prediccion', 'Revision medica'].map((step, index) => (
            <div className="workflow-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
