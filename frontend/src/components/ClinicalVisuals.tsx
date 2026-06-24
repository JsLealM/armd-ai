interface SpecimenItem {
  label: string;
  value: string;
  tone: string;
}

const specimenItems: SpecimenItem[] = [
  { label: 'Blood', value: 'S. aureus', tone: 'resistant' },
  { label: 'Urine', value: 'E. coli', tone: 'susceptible' },
  { label: 'Resp.', value: 'P. aeruginosa', tone: 'warning' },
];

const pipelineSteps = ['Cultivo', 'Variables', 'Modelo', 'Revision'];

export function ClinicalConsole() {
  return (
    <div className="clinical-console" aria-label="Resumen visual del flujo ARMD-AI">
      <div className="console-header">
        <div>
          <span className="panel-label">ARMD-AI V2</span>
          <h2>Microbiology decision support</h2>
        </div>
        <span className="console-status">Demo activo</span>
      </div>

      <div className="specimen-rack">
        {specimenItems.map((item) => (
          <div className={`specimen-vial ${item.tone}`} key={`${item.label}-${item.value}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="console-result">
        <div>
          <span>Probabilidad estimada</span>
          <strong>62%</strong>
          <small>Resistant demo</small>
        </div>
        <div className="console-meter" aria-hidden="true">
          <span className="safe" />
          <span className="risk" />
        </div>
      </div>

      <div className="pipeline-strip">
        {pipelineSteps.map((step, index) => (
          <div className="pipeline-node" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ClinicalStatCardProps {
  eyebrow: string;
  value: string;
  label: string;
  variant?: string;
}

export function ClinicalStatCard({ eyebrow, value, label, variant = 'default' }: ClinicalStatCardProps) {
  return (
    <div className={`clinical-stat-card ${variant}`}>
      <span>{eyebrow}</span>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}
