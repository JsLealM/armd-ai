import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiskBadge, SectionHeader } from '../components/Common';
import { usePrediction } from '../context/PredictionContext';
import { appRoutes } from '../routes/routes';
import { OrganismName } from '../utils/organismLabels';

export function HistoryPage() {
  const { history, historyLoading, historyError, refreshHistory } = usePrediction();

  useEffect(() => {
    void refreshHistory();
  }, [refreshHistory]);

  return (
    <main className="page-stack">
      <div className="pane-header">
        <div>
          <span className="eyebrow">Historial persistido</span>
          <h1>Predicciones anteriores</h1>
          <p>Registro consultado en tiempo real desde GET /api/history (PostgreSQL).</p>
        </div>
        <div className="actions-row compact-actions">
          <button className="secondary-action" onClick={() => void refreshHistory()} type="button">
            Actualizar
          </button>
          <Link className="primary-action compact" to={appRoutes.evaluation}>
            Nueva evaluacion
          </Link>
        </div>
      </div>

      <section className="card">
        <SectionHeader
          title="Casos guardados"
          text="Cada prediccion ejecutada queda almacenada en la base de datos con sus probabilidades y factores SHAP."
        />
        {historyError ? (
          <div className="warning-banner">
            <strong>No se pudo cargar el historial.</strong>
            <span>{historyError}</span>
          </div>
        ) : null}
        {historyLoading ? (
          <div className="empty-state">
            <strong>Cargando historial...</strong>
          </div>
        ) : history.length === 0 && !historyError ? (
          <div className="empty-state">
            <strong>No hay predicciones guardadas.</strong>
            <span>Ejecute una nueva evaluacion para registrar el primer caso.</span>
          </div>
        ) : history.length > 0 ? (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Caso</th>
                  <th>Fecha</th>
                  <th>Microorganismo</th>
                  <th>Antibiotico</th>
                  <th>Prediccion</th>
                  <th>Prob. Resistant</th>
                  <th>Modelo</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.prediccion_id}>
                    <td>#{item.prediccion_id}</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td><OrganismName value={item.organism} /></td>
                    <td>{item.antibiotic}</td>
                    <td>
                      <RiskBadge
                        label={item.predicted_class}
                        variant={item.predicted_class === 'Resistant' ? 'resistant' : 'susceptible'}
                      />
                    </td>
                    <td>{Math.round(item.resistant_probability * 100)}%</td>
                    <td>{item.model_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
