import { API_BASE_URL } from '../config/api';
import {
  adiFields,
  comorbidityFields,
  exposureFields,
  labFields,
  wardFields,
} from '../data/formOptions';
import { getOrganismLabel } from '../utils/organismLabels';
import type {
  CaseData,
  HistoryItem,
  InfluencingFactor,
  PredictionResult,
  ShapValue,
} from '../types';

// Campos numericos del formulario que viajan como number | null al backend.
// (age es categorico -> grupo etario; no entra aqui.)
const NUMERIC_FIELDS = new Set<string>([
  ...adiFields.map(([field]) => field),
  ...labFields.map(([field]) => field),
]);

// Diccionario variable -> etiqueta legible para los factores SHAP.
const VARIABLE_LABELS: Record<string, string> = {
  antibiotic: 'Antibiotico evaluado',
  organism: 'Organismo',
  culture_description: 'Tipo de cultivo',
  age: 'Edad',
  gender: 'Sexo',
  ...Object.fromEntries(wardFields.map(([field, label]) => [field, `Sala: ${label}`])),
  ...Object.fromEntries(exposureFields.map(([field, label]) => [field, `Exposicion previa: ${label}`])),
  ...Object.fromEntries(comorbidityFields.map(([field, label]) => [field, `Comorbilidad: ${label}`])),
  ...Object.fromEntries(labFields.map(([field, label]) => [field, label])),
  ...Object.fromEntries(adiFields.map(([field, label]) => [field, label])),
  ordering_mode: 'Modo de orden',
  comorb_diabetes_any_or_renal: 'Comorbilidad: Diabetes o Renal',
};

function friendlyLabel(variable: string): string {
  return VARIABLE_LABELS[variable] ?? variable;
}

function friendlyValue(variable: string, value: ShapValue['value']): string | number {
  if (variable === 'organism' && typeof value === 'string') {
    return getOrganismLabel(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No';
  }
  if (value === null || value === undefined) {
    return 'Sin registro';
  }
  return value;
}

function toNumberOrNull(raw: string | boolean): number | null {
  if (typeof raw === 'boolean') return raw ? 1 : 0;
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

// Convierte el estado del formulario al contrato PredictionRequest del backend.
export function serializeCase(caseData: CaseData): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    session_id: 'frontend-session',
    paciente_referencia: null,
  };

  for (const [key, value] of Object.entries(caseData)) {
    if (NUMERIC_FIELDS.has(key)) {
      payload[key] = toNumberOrNull(value);
    } else {
      payload[key] = value;
    }
  }

  return payload;
}

function shapToFactors(shapValues: ShapValue[]): InfluencingFactor[] {
  return shapValues.map((item) => ({
    label: friendlyLabel(item.variable),
    value: friendlyValue(item.variable, item.value),
    direction: item.direction,
    contribution: item.shap_value,
  }));
}

function normalizeResult(raw: Omit<PredictionResult, 'influencing_factors'>): PredictionResult {
  return {
    ...raw,
    influencing_factors: shapToFactors(raw.shap_values ?? []),
  };
}

async function parseError(response: Response): Promise<never> {
  let detail = `${response.status} ${response.statusText}`;
  try {
    const data = await response.json();
    if (data && typeof data.detail === 'string') detail = data.detail;
  } catch {
    // respuesta sin cuerpo JSON
  }
  throw new Error(`Error del backend: ${detail}`);
}

export async function predict(caseData: CaseData): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serializeCase(caseData)),
  });
  if (!response.ok) return parseError(response);
  const data = (await response.json()) as Omit<PredictionResult, 'influencing_factors'>;
  return normalizeResult(data);
}

export async function getHistory(limit = 50): Promise<HistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/history?limit=${limit}`);
  if (!response.ok) return parseError(response);
  return (await response.json()) as HistoryItem[];
}

export async function getHistoryDetail(prediccionId: number): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_BASE_URL}/api/history/${prediccionId}`);
  if (!response.ok) return parseError(response);
  return (await response.json()) as Record<string, unknown>;
}
