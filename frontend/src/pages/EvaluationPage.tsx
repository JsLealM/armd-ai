import type { Dispatch, SetStateAction } from 'react';
import { ProgressMeter, SectionHeader } from '../components/Common';
import { CheckGrid, GroupTitle, InputField, SelectField } from '../components/FormControls';
import {
  adiFields,
  ageGroups,
  antibiotics,
  comorbidityFields,
  cultureDescriptions,
  exposureFields,
  genders,
  labFields,
  models,
  orderingModes,
  organisms,
  requiredFields,
  wardFields,
  type FieldTuple,
} from '../data/formOptions';
import { emptyCase, initialCase } from '../data/demoData';
import { OrganismName } from '../utils/organismLabels';
import type { CaseData, ModalKey } from '../types';

interface EvaluationPageProps {
  caseData: CaseData;
  setCaseData: Dispatch<SetStateAction<CaseData>>;
  runPrediction: () => void;
  setModal: (modal: ModalKey) => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function EvaluationPage({
  caseData,
  setCaseData,
  runPrediction,
  setModal,
  submitting,
  errorMessage,
}: EvaluationPageProps) {
  const requiredCompleted = requiredFields.filter((field) => Boolean(caseData[field])).length;
  const optionalFilled = Object.entries(caseData).filter(
    ([key, value]) => !requiredFields.includes(key) && value !== '' && value !== false,
  ).length;

  const updateField = (field: string, value: string | boolean) =>
    setCaseData((current) => ({ ...current, [field]: value }));

  return (
    <main className="split-page">
      <section className="form-pane">
        <div className="pane-header">
          <div>
            <span className="eyebrow">Nueva evaluacion</span>
            <h1>Prediccion de susceptibilidad</h1>
            <p>Variables del dataset final V2. Los campos clinicos opcionales pueden quedar sin registro.</p>
          </div>
          <div className="actions-row compact-actions">
            <button className="secondary-action" onClick={() => setCaseData(initialCase)} type="button">
              Usar caso demo
            </button>
            <button className="ghost-action" onClick={() => setCaseData(emptyCase)} type="button">
              Limpiar
            </button>
          </div>
        </div>

        <div className="form-section">
          <GroupTitle title="Modelo de prediccion" />
          <div className="form-grid">
            <SelectField label="Modelo" value={caseData.model_id} options={models} onChange={(value) => updateField('model_id', value)} />
          </div>
        </div>

        <div className="form-section">
          <GroupTitle title="Informacion obligatoria" onHelp={() => setModal('variable-help')} />
          <div className="form-grid three">
            <SelectField label="Microorganismo" value={caseData.organism} options={organisms} required onChange={(value) => updateField('organism', value)} />
            <SelectField label="Antibiotico evaluado" value={caseData.antibiotic} options={antibiotics} required onChange={(value) => updateField('antibiotic', value)} />
            <SelectField label="Tipo de cultivo" value={caseData.culture_description} options={cultureDescriptions} required onChange={(value) => updateField('culture_description', value)} />
            <SelectField label="Grupo etario" value={caseData.age} options={ageGroups} required onChange={(value) => updateField('age', value)} />
            <SelectField label="Sexo (cod. dataset 0/1)" value={caseData.gender} options={genders} required onChange={(value) => updateField('gender', value)} />
            <SelectField label="Modo de orden" value={caseData.ordering_mode} options={orderingModes} onChange={(value) => updateField('ordering_mode', value)} />
          </div>
        </div>

        <FormChecklistSection title="Ubicacion hospitalaria" fields={wardFields} caseData={caseData} updateField={updateField} />

        <div className="form-section">
          <GroupTitle title="Indice socioeconomico (ADI)" />
          <div className="form-grid labs">
            {adiFields.map(([field, label, unit]) => (
              <InputField
                key={field}
                label={label}
                value={caseData[field] as string}
                type="number"
                placeholder={unit}
                onChange={(value) => updateField(field, value)}
              />
            ))}
          </div>
        </div>

        <FormChecklistSection title="Exposicion previa a antibioticos (18 clases)" fields={exposureFields} caseData={caseData} updateField={updateField} onHelp={() => setModal('variable-help')} />
        <FormChecklistSection title="Comorbilidades" fields={comorbidityFields} caseData={caseData} updateField={updateField} />

        <div className="form-section">
          <GroupTitle title="Valores clinicos / laboratorio" />
          <div className="form-grid labs">
            {labFields.map(([field, label, unit]) => (
              <InputField
                key={field}
                label={label}
                value={caseData[field] as string}
                type="number"
                placeholder={unit}
                onChange={(value) => updateField(field, value)}
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="summary-pane">
        <div className="sticky-panel">
          <SectionHeader title="Resumen del caso" text="Validacion previa al calculo exploratorio." />
          <ProgressMeter label="Campos requeridos" value={requiredCompleted} max={requiredFields.length} />
          <ProgressMeter label="Variables opcionales usadas" value={optionalFilled} max={41} />
          <dl className="case-list">
            <div><dt>Organismo</dt><dd><OrganismName value={caseData.organism} /></dd></div>
            <div><dt>Antibiotico</dt><dd>{caseData.antibiotic || 'Sin registro'}</dd></div>
            <div><dt>Cultivo</dt><dd>{caseData.culture_description || 'Sin registro'}</dd></div>
          </dl>
          {errorMessage ? <div className="warning-banner"><strong>Error.</strong><span>{errorMessage}</span></div> : null}
          <button className="primary-action full" onClick={runPrediction} type="button" disabled={submitting}>
            {submitting ? 'Calculando...' : 'Calcular susceptibilidad'}
          </button>
          <button className="link-action" onClick={() => setModal('model-explanation')} type="button">
            Como interpretar el resultado
          </button>
        </div>
      </aside>
    </main>
  );
}

interface FormChecklistSectionProps {
  title: string;
  fields: FieldTuple[];
  caseData: CaseData;
  updateField: (field: string, value: boolean) => void;
  onHelp?: () => void;
}

function FormChecklistSection({ title, fields, caseData, updateField, onHelp }: FormChecklistSectionProps) {
  return (
    <div className="form-section">
      <GroupTitle title={title} onHelp={onHelp} />
      <CheckGrid fields={fields} values={caseData} updateField={updateField} />
    </div>
  );
}
