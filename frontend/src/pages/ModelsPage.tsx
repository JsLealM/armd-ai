import { MetricTile, ProbabilityBar, SectionHeader } from '../components/Common';
import { ModelTable } from '../components/ModelTable';
import { modelRows } from '../data/demoData';
import type { ModalKey } from '../types';

interface ModelsPageProps {
  setModal: (modal: ModalKey) => void;
}

export function ModelsPage({ setModal }: ModelsPageProps) {
  return (
    <main className="page-stack">
      <div className="pane-header">
        <div>
          <span className="eyebrow">Evaluacion V2</span>
          <h1>Modelo oficial</h1>
          <p>Resumen del modelo XGBoost seleccionado para la prediccion binaria multibacteria.</p>
        </div>
        <button className="secondary-action" onClick={() => setModal('performance')} type="button">
          Ver tabla completa
        </button>
      </div>
      <section className="metric-grid">
        <MetricTile label="Mejor modelo" value="XGBoost" />
        <MetricTile label="F1 macro" value="0.843" />
        <MetricTile label="Balanced accuracy" value="0.839" />
        <MetricTile label="MSE" value="0.146" />
      </section>
      <section className="card">
        <SectionHeader
          title="Tabla de scores"
          text="F1 macro fue la metrica principal porque evalua de forma equilibrada Susceptible y Resistant. XGBoost se conserva como modelo final por rendimiento competitivo e integracion directa con SHAP."
        />
        <ModelTable />
      </section>
      <section className="model-comparison">
        {modelRows.map((row) => (
          <div className="model-card" key={row.model}>
            <strong>{row.model}</strong>
            <ProbabilityBar label="F1 macro" value={Math.round(row.f1 * 100)} variant="neutral" />
            <small>Accuracy {row.accuracy.toFixed(3)} / MSE {row.mse.toFixed(3)}</small>
          </div>
        ))}
      </section>
    </main>
  );
}
