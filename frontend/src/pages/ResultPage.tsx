import { Navigate } from 'react-router-dom';
import { FactorBar, ProbabilityBar, RiskBadge, SectionHeader } from '../components/Common';
import { usePrediction } from '../context/PredictionContext';
import { wardFields } from '../data/formOptions';
import { appRoutes } from '../routes/routes';
import { OrganismName } from '../utils/organismLabels';
import type { ModalKey } from '../types';

interface ResultPageProps {
  setModal: (modal: ModalKey) => void;
}

export function ResultPage({ setModal }: ResultPageProps) {
  const { caseData, result } = usePrediction();

  // Sin resultado (acceso directo a la ruta o recarga): volver al formulario.
  if (!result) {
    return <Navigate replace to={appRoutes.evaluation} />;
  }

  const resistant = Math.round(result.resistant_probability * 100);
  const susceptible = Math.round(result.susceptible_probability * 100);
  const isResistant = result.predicted_class === 'Resistant';

  return (
    <main className="page-stack">
      <div className="result-header">
        <div>
          <span className="eyebrow">Resultado de prediccion</span>
          <h1>{result.prediccion_id ? `Caso #${result.prediccion_id}` : 'Resultado'}</h1>
          <p>Resultado exploratorio generado por {result.model_name} ({result.model_version}).</p>
        </div>
        <button className="secondary-action" type="button" onClick={() => window.print()}>
          Exportar reporte
        </button>
      </div>
      <div className="warning-banner">
        <strong>Advertencia clinica.</strong>
        <span>Use este resultado solo como apoyo exploratorio. Confirme con antibiograma y protocolos institucionales.</span>
      </div>
      <section className="result-grid">
        <div className="result-main-card">
          <div className="result-title-row">
            <div>
              <h2><OrganismName value={caseData.organism || 'STAPHYLOCOCCUS AUREUS'} /></h2>
              <p>vs {caseData.antibiotic || 'OXACILLIN'}</p>
            </div>
            <RiskBadge label={`Mayor probabilidad: ${result.predicted_class}`} variant={isResistant ? 'resistant' : 'susceptible'} />
          </div>
          <ProbabilityBar label="Resistant" value={resistant} variant="resistant" />
          <ProbabilityBar label="Susceptible" value={susceptible} variant="susceptible" />
          <div className="confidence-row">
            <span>Nivel de confianza</span>
            <strong>{result.confidence_level}</strong>
          </div>
        </div>
        <div className="side-card">
          <SectionHeader title="Resumen del caso" text="Variables principales enviadas al modelo." />
          <dl className="case-list">
            <div><dt>Organismo</dt><dd><OrganismName value={caseData.organism} /></dd></div>
            <div><dt>Antibiotico</dt><dd>{caseData.antibiotic || 'Sin registro'}</dd></div>
            <div><dt>Cultivo</dt><dd>{caseData.culture_description || 'Sin registro'}</dd></div>
            <div><dt>Edad</dt><dd>{caseData.age || 'Sin registro'}</dd></div>
            <div><dt>Entorno</dt><dd>{wardFields.filter(([field]) => caseData[field]).map(([, label]) => label).join(', ') || 'Sin registro'}</dd></div>
          </dl>
        </div>
      </section>
      <section className="analysis-grid">
        <div className="card">
          <SectionHeader
            title="Factores que influyeron"
            text={`${result.explanation_method}. Estas contribuciones explican la prediccion; no implican causalidad clinica.`}
          />
          <div className="factor-list">
            {result.influencing_factors.map((factor) => (
              <FactorBar factor={factor} key={`${factor.label}-${factor.value}`} />
            ))}
          </div>
          <button className="link-action" onClick={() => setModal('model-explanation')} type="button">
            Ver explicacion del modelo
          </button>
        </div>
        <div className="card tinted">
          <SectionHeader title="Acciones sugeridas" text="No son indicaciones terapeuticas." />
          <ul className="action-list">
            <li>Revisar antibiograma final cuando este disponible.</li>
            <li>Consultar infectologia si la probabilidad de resistencia es alta.</li>
            <li>Validar exposicion antibiotica previa e historia clinica.</li>
            <li>Revisar comorbilidades y calidad de datos ingresados.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
