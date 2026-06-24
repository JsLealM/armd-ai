from functools import lru_cache

from ..config import DEFAULT_MODEL_ID, MODELS
from ..feature_spec import build_feature_row
from ..schemas import PredictionRequest, PredictionResponse, ShapValue

TOP_SHAP = 8
POSITIVE_CLASS = "Resistant"
NEGATIVE_CLASS = "Susceptible"


def _resolve_model_id(model_id: str | None) -> str:
    return model_id if model_id in MODELS else DEFAULT_MODEL_ID


@lru_cache(maxsize=8)
def load_bundle(model_id: str):
    """Carga el bundle exportado por el notebook 04E para el modelo indicado.

    bundle (dict): pipeline, feature_columns, classes, model_type ('tree'|'linear'),
    y (solo linear) shap_background. Devuelve None si el artefacto no existe (modo demo).
    """
    spec = MODELS.get(model_id)
    if spec is None or not spec["path"].exists():
        return None

    import joblib

    try:
        bundle = joblib.load(spec["path"])
    except Exception as exc:  # noqa: BLE001
        print(f"[ARMD-AI] AVISO: no se pudo cargar el artefacto '{model_id}': {exc}")
        print("[ARMD-AI] Revisa que xgboost/scikit-learn coincidan con los del entorno que exporto el modelo.")
        return None

    if not isinstance(bundle, dict):
        return {"pipeline": bundle, "feature_columns": None, "model_type": "tree"}
    return bundle


@lru_cache(maxsize=8)
def _get_explainer(model_id: str):
    bundle = load_bundle(model_id)
    if bundle is None:
        return None
    import shap

    pipeline = bundle["pipeline"]
    classifier = pipeline[-1]
    if bundle.get("model_type") == "linear":
        background = bundle.get("shap_background")
        if background is None:
            return None
        return shap.LinearExplainer(classifier, background)
    return shap.TreeExplainer(classifier)


def predict_susceptibility(request: PredictionRequest) -> PredictionResponse:
    model_id = _resolve_model_id(request.model_id)
    spec = MODELS[model_id]
    bundle = load_bundle(model_id)
    if bundle is None:
        return _demo_prediction(request, spec)

    import numpy as np
    import pandas as pd

    pipeline = bundle["pipeline"]
    feature_columns = bundle.get("feature_columns")

    row = build_feature_row(request.model_dump())
    frame = pd.DataFrame([row])
    if feature_columns:
        for col in feature_columns:
            if col not in frame.columns:
                frame[col] = None
        frame = frame[feature_columns]

    classes = list(getattr(pipeline, "classes_", bundle.get("classes") or [NEGATIVE_CLASS, POSITIVE_CLASS]))
    pos_index = classes.index(POSITIVE_CLASS) if POSITIVE_CLASS in classes else 1
    neg_index = 1 - pos_index if len(classes) == 2 else classes.index(NEGATIVE_CLASS)

    probabilities = pipeline.predict_proba(frame)[0]
    resistant_probability = float(probabilities[pos_index])
    susceptible_probability = float(probabilities[neg_index])
    predicted_class = POSITIVE_CLASS if resistant_probability >= susceptible_probability else NEGATIVE_CLASS

    is_linear = bundle.get("model_type") == "linear"
    shap_values = _real_shap_values(model_id, pipeline, frame, np)
    method = "SHAP LinearExplainer (Regresion Logistica)" if is_linear else "SHAP TreeExplainer (XGBoost)"

    return PredictionResponse(
        model_name=spec["model_name"],
        model_version=spec["model_version"],
        predicted_class=predicted_class,
        susceptible_probability=susceptible_probability,
        resistant_probability=resistant_probability,
        confidence_level=_confidence_level(susceptible_probability, resistant_probability),
        explanation_method=method,
        shap_values=shap_values,
    )


def _real_shap_values(model_id, pipeline, frame, np) -> list[ShapValue]:
    """SHAP real sobre las features transformadas; top-N por |contribucion|."""
    try:
        explainer = _get_explainer(model_id)
        if explainer is None:
            return []
        preprocessor = pipeline[:-1]
        transformed = preprocessor.transform(frame)
        try:
            names = list(preprocessor.get_feature_names_out())
        except Exception:
            names = [f"f{i}" for i in range(transformed.shape[1])]

        if hasattr(transformed, "toarray"):
            transformed = transformed.toarray()

        raw = explainer.shap_values(transformed)
        if isinstance(raw, list):
            raw = raw[1] if len(raw) > 1 else raw[0]
        values = np.asarray(raw)
        if values.ndim > 1:
            values = values[0]

        order = np.argsort(np.abs(values))[::-1][:TOP_SHAP]
        result: list[ShapValue] = []
        for ranking, idx in enumerate(order, start=1):
            contribution = float(values[idx])
            result.append(
                ShapValue(
                    variable=_clean_name(names[idx]),
                    value=None,
                    shap_value=contribution,
                    direction="towards_resistant" if contribution > 0 else "towards_susceptible",
                    ranking=ranking,
                )
            )
        return result
    except Exception:
        return []


def _clean_name(name: str) -> str:
    for prefix in ("num__", "cat__", "remainder__", "onehot__"):
        if name.startswith(prefix):
            name = name[len(prefix):]
    return name


def _demo_prediction(request: PredictionRequest, spec: dict) -> PredictionResponse:
    resistant = 0.42
    if request.organism == "STAPHYLOCOCCUS AUREUS" and request.antibiotic in ("Oxacillin", "OXACILLIN"):
        resistant += 0.20
    if request.organism == "PSEUDOMONAS AERUGINOSA":
        resistant += 0.12
    if request.exp_prev_beta_lactam:
        resistant += 0.07
    if request.exp_prev_fluoroquinolone:
        resistant += 0.06
    if request.hosp_ward_ICU:
        resistant += 0.05
    if request.comorb_diabetes_any or request.comorb_renal_failure:
        resistant += 0.04

    resistant = max(0.08, min(0.92, resistant))
    susceptible = 1 - resistant
    predicted_class = POSITIVE_CLASS if resistant >= susceptible else NEGATIVE_CLASS

    return PredictionResponse(
        model_name=spec["model_name"],
        model_version=f"{spec['model_version']}-demo",
        predicted_class=predicted_class,
        susceptible_probability=susceptible,
        resistant_probability=resistant,
        confidence_level=_confidence_level(susceptible, resistant),
        explanation_method="Contrato compatible con SHAP; valores demo hasta exportar el artefacto del modelo",
        shap_values=_fallback_shap_values(request, predicted_class),
    )


def _fallback_shap_values(request: PredictionRequest, predicted_class: str) -> list[ShapValue]:
    towards_resistant = predicted_class == POSITIVE_CLASS
    factors = [
        ("antibiotic", request.antibiotic, 0.16 if towards_resistant else -0.10),
        ("organism", request.organism, 0.13 if towards_resistant else -0.08),
        (
            "exp_prev_beta_lactam",
            request.exp_prev_beta_lactam,
            0.08 if request.exp_prev_beta_lactam else -0.04,
        ),
        ("hosp_ward_ICU", request.hosp_ward_ICU, 0.05 if request.hosp_ward_ICU else -0.02),
        (
            "comorb_diabetes_any_or_renal",
            request.comorb_diabetes_any or request.comorb_renal_failure,
            0.04 if (request.comorb_diabetes_any or request.comorb_renal_failure) else -0.03,
        ),
    ]

    return [
        ShapValue(
            variable=variable,
            value=value,
            shap_value=contribution,
            direction="towards_resistant" if contribution > 0 else "towards_susceptible",
            ranking=index,
        )
        for index, (variable, value, contribution) in enumerate(factors, start=1)
    ]


def _confidence_level(susceptible: float, resistant: float) -> str:
    distance = abs(susceptible - resistant)
    if distance > 0.35:
        return "Alta"
    if distance > 0.16:
        return "Media"
    return "Baja"
