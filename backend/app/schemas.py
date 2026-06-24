from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    session_id: str | None = Field(default="frontend-session")
    paciente_referencia: str | None = None
    model_id: str = "xgboost"  # "xgboost" | "logistic_regression"

    # Categoricas (valores del dataset final V2)
    organism: str
    antibiotic: str
    culture_description: str
    age: str | None = None          # grupo etario, p.ej. "65-74 years"
    gender: str | None = None       # codificacion del dataset: "0" / "1"
    ordering_mode: str | None = None  # "Inpatient" / "Outpatient" / "Null"

    # Salas hospitalarias
    hosp_ward_IP: bool = False
    hosp_ward_OP: bool = False
    hosp_ward_ER: bool = False
    hosp_ward_ICU: bool = False

    # Exposicion antibiotica previa por clase (18)
    exp_prev_aminoglycoside: bool = False
    exp_prev_ansamycin: bool = False
    exp_prev_antitubercular: bool = False
    exp_prev_beta_lactam: bool = False
    exp_prev_combination_antibiotic: bool = False
    exp_prev_fluoroquinolone: bool = False
    exp_prev_folate_synthesis_inhibitor: bool = False
    exp_prev_fosfomycin: bool = False
    exp_prev_glycopeptide: bool = False
    exp_prev_macrolide_lincosamide: bool = False
    exp_prev_monobactam: bool = False
    exp_prev_nitrofuran: bool = False
    exp_prev_nitroimidazole: bool = False
    exp_prev_oxazolidinone: bool = False
    exp_prev_polymyxin_lipopeptide: bool = False
    exp_prev_sulfonamide: bool = False
    exp_prev_tetracycline: bool = False
    exp_prev_urinary_antiseptic: bool = False

    # Comorbilidades agrupadas (7)
    comorb_chronic_pulmonary_any: bool = False
    comorb_congestive_heart_failure: bool = False
    comorb_diabetes_any: bool = False
    comorb_organ_transplant_status: bool = False
    comorb_pancreatic_disorder: bool = False
    comorb_renal_failure: bool = False
    comorb_sinusitis: bool = False
    comorb_solid_tumor_non_metastatic: bool = False

    # Numericas continuas (None si no se registra)
    adi_score: float | None = None
    adi_state_rank: float | None = None
    median_heartrate: float | None = None
    median_resprate: float | None = None
    median_temp: float | None = None
    median_sysbp: float | None = None
    median_diasbp: float | None = None
    median_wbc: float | None = None
    median_neutrophils: float | None = None
    median_lymphocytes: float | None = None
    median_bun: float | None = None
    median_cr: float | None = None
    median_lactate: float | None = None
    median_procalcitonin: float | None = None


class ShapValue(BaseModel):
    variable: str
    value: str | float | int | bool | None = None
    shap_value: float
    direction: str
    ranking: int


class PredictionResponse(BaseModel):
    prediccion_id: int | None = None
    model_name: str
    model_version: str
    predicted_class: str
    susceptible_probability: float
    resistant_probability: float
    confidence_level: str
    explanation_method: str
    shap_values: list[ShapValue]


class HistoryItem(BaseModel):
    prediccion_id: int
    created_at: str
    organism: str
    antibiotic: str
    culture_description: str
    predicted_class: str
    susceptible_probability: float
    resistant_probability: float
    model_name: str
    model_version: str
