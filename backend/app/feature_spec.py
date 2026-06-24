"""Contrato canonico de variables del modelo V2 (dataset final balanceado).

Fuente: modelo/V2/DATOS_PROCESADOS/09_dataset_v2_multibacteria_balanceado_organismo_clase.csv

Se usa TODO el dataset: todas las columnas predictoras (64 features), excluyendo unicamente
los 4 identificadores (anon_id, pat_enc_csn_id_coded, order_proc_id_coded, order_time_jittered_utc)
y la variable objetivo `susceptibility`.

Total: 64 features.
- 6 categoricas + 14 numericas + 4 salas + 18 exp_prev + 8 comorb = 50 que entran como INPUT del usuario.
- 14 indicadores `missing_*` (uno por cada numerica) los DERIVA el backend (no los ingresa el usuario):
  1 si la numerica viene vacia, 0 si trae valor.
"""

# --- Categoricas (valores tal como aparecen en el dataset final) ---
CATEGORICAL_INPUTS = [
    "ordering_mode",
    "culture_description",
    "organism",
    "antibiotic",
    "age",
    "gender",
]

# --- Numericas continuas (cada una tiene su indicador missing_* en el dataset) ---
NUMERIC_INPUTS = [
    "adi_score",
    "adi_state_rank",
    "median_heartrate",
    "median_resprate",
    "median_temp",
    "median_sysbp",
    "median_diasbp",
    "median_wbc",
    "median_neutrophils",
    "median_lymphocytes",
    "median_bun",
    "median_cr",
    "median_lactate",
    "median_procalcitonin",
]

# --- Salas hospitalarias (0/1) ---
WARD_INPUTS = [
    "hosp_ward_IP",
    "hosp_ward_OP",
    "hosp_ward_ER",
    "hosp_ward_ICU",
]

# --- Exposicion antibiotica previa por clase (18) ---
EXP_PREV_INPUTS = [
    "exp_prev_aminoglycoside",
    "exp_prev_ansamycin",
    "exp_prev_antitubercular",
    "exp_prev_beta_lactam",
    "exp_prev_combination_antibiotic",
    "exp_prev_fluoroquinolone",
    "exp_prev_folate_synthesis_inhibitor",
    "exp_prev_fosfomycin",
    "exp_prev_glycopeptide",
    "exp_prev_macrolide_lincosamide",
    "exp_prev_monobactam",
    "exp_prev_nitrofuran",
    "exp_prev_nitroimidazole",
    "exp_prev_oxazolidinone",
    "exp_prev_polymyxin_lipopeptide",
    "exp_prev_sulfonamide",
    "exp_prev_tetracycline",
    "exp_prev_urinary_antiseptic",
]

# --- Comorbilidades agrupadas (8, incluye pancreatic_disorder) ---
COMORB_INPUTS = [
    "comorb_chronic_pulmonary_any",
    "comorb_congestive_heart_failure",
    "comorb_diabetes_any",
    "comorb_organ_transplant_status",
    "comorb_pancreatic_disorder",
    "comorb_renal_failure",
    "comorb_sinusitis",
    "comorb_solid_tumor_non_metastatic",
]

# --- Indicadores de faltante (derivados): uno por cada numerica ---
MISSING_INDICATORS = [f"missing_{col}" for col in NUMERIC_INPUTS]

BINARY_INPUTS = WARD_INPUTS + EXP_PREV_INPUTS + COMORB_INPUTS

# Conjunto completo de columnas de feature (64). El orden real lo fija el bundle exportado
# en metadata['feature_columns']; el ColumnTransformer selecciona por nombre, no por posicion.
ALL_FEATURE_COLUMNS = (
    CATEGORICAL_INPUTS
    + NUMERIC_INPUTS
    + WARD_INPUTS
    + MISSING_INDICATORS
    + EXP_PREV_INPUTS
    + COMORB_INPUTS
)

# Valor que usa el dataset para categoricas ausentes.
NULL_TOKEN = "Null"


def build_feature_row(payload: dict) -> dict:
    """Convierte un PredictionRequest (dict) en la fila de features del modelo (64 columnas).

    - Categoricas vacias -> 'Null' (como en el dataset).
    - Numericas vacias -> None (el imputer del pipeline las maneja).
    - Banderas -> int 0/1.
    - missing_<numerica> derivados: 1 si la numerica viene vacia, 0 si trae valor.
    """
    row: dict = {}

    for col in CATEGORICAL_INPUTS:
        value = payload.get(col)
        row[col] = value if value not in (None, "") else NULL_TOKEN

    for col in NUMERIC_INPUTS:
        value = payload.get(col)
        row[col] = None if value in (None, "") else float(value)
        row[f"missing_{col}"] = 0 if row[col] is not None else 1

    for col in BINARY_INPUTS:
        row[col] = int(bool(payload.get(col)))

    return row
