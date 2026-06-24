// Tipos compartidos del frontend ARMD-AI
// Contrato alineado al dataset final V2 (variables de modelado).

export type Direction = 'towards_resistant' | 'towards_susceptible' | 'neutral';

// Datos del formulario clinico. Campos categoricos/numericos se manejan como string
// (lo que entrega un <input>/<select>) y las casillas como boolean. El apiClient
// coerciona los numericos a number|null antes de enviar al backend.
export interface CaseData {
  // Modelo elegido por el usuario
  model_id: string;

  // Categoricas
  organism: string;
  antibiotic: string;
  culture_description: string;
  age: string;            // grupo etario, p.ej. "65-74 years"
  gender: string;         // codificacion del dataset: "0" / "1"
  ordering_mode: string;  // "Inpatient" / "Outpatient" / "Null"

  // Salas hospitalarias
  hosp_ward_IP: boolean;
  hosp_ward_OP: boolean;
  hosp_ward_ER: boolean;
  hosp_ward_ICU: boolean;

  // Exposicion antibiotica previa por clase (18)
  exp_prev_aminoglycoside: boolean;
  exp_prev_ansamycin: boolean;
  exp_prev_antitubercular: boolean;
  exp_prev_beta_lactam: boolean;
  exp_prev_combination_antibiotic: boolean;
  exp_prev_fluoroquinolone: boolean;
  exp_prev_folate_synthesis_inhibitor: boolean;
  exp_prev_fosfomycin: boolean;
  exp_prev_glycopeptide: boolean;
  exp_prev_macrolide_lincosamide: boolean;
  exp_prev_monobactam: boolean;
  exp_prev_nitrofuran: boolean;
  exp_prev_nitroimidazole: boolean;
  exp_prev_oxazolidinone: boolean;
  exp_prev_polymyxin_lipopeptide: boolean;
  exp_prev_sulfonamide: boolean;
  exp_prev_tetracycline: boolean;
  exp_prev_urinary_antiseptic: boolean;

  // Comorbilidades agrupadas (7)
  comorb_chronic_pulmonary_any: boolean;
  comorb_congestive_heart_failure: boolean;
  comorb_diabetes_any: boolean;
  comorb_organ_transplant_status: boolean;
  comorb_pancreatic_disorder: boolean;
  comorb_renal_failure: boolean;
  comorb_sinusitis: boolean;
  comorb_solid_tumor_non_metastatic: boolean;

  // Numericas (string en el formulario)
  adi_score: string;
  adi_state_rank: string;
  median_heartrate: string;
  median_resprate: string;
  median_temp: string;
  median_sysbp: string;
  median_diasbp: string;
  median_wbc: string;
  median_neutrophils: string;
  median_lymphocytes: string;
  median_bun: string;
  median_cr: string;
  median_lactate: string;
  median_procalcitonin: string;

  // Permite indexar dinamicamente (Object.entries, updateField).
  [key: string]: string | boolean;
}

export interface ShapValue {
  variable: string;
  value: string | number | boolean | null;
  shap_value: number;
  direction: Direction | string;
  ranking: number;
}

export interface InfluencingFactor {
  label: string;
  value: string | number;
  direction: Direction | string;
  contribution: number;
}

export interface PredictionResult {
  prediccion_id?: number | null;
  model_name: string;
  model_version: string;
  predicted_class: string;
  susceptible_probability: number;
  resistant_probability: number;
  confidence_level: string;
  explanation_method: string;
  shap_values: ShapValue[];
  influencing_factors: InfluencingFactor[];
}

export interface HistoryItem {
  prediccion_id: number;
  created_at: string;
  organism: string;
  antibiotic: string;
  culture_description: string;
  predicted_class: string;
  susceptible_probability: number;
  resistant_probability: number;
  model_name: string;
  model_version: string;
}

export type ModalKey =
  | 'disclaimer'
  | 'missing-required'
  | 'variable-help'
  | 'model-explanation'
  | 'performance'
  | 'sources'
  | null;

export interface OptionItem {
  value: string;
  label: string;
  scientificName?: boolean;
}

export type SelectOption = string | OptionItem;
