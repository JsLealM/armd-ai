import os
from pathlib import Path

try:
    from dotenv import load_dotenv

    load_dotenv(Path(__file__).resolve().parents[1] / ".env")
except ImportError:
    # python-dotenv es opcional; sin el las variables se leen del entorno del proceso.
    pass


PROJECT_ROOT = Path(__file__).resolve().parents[2]

# ---------------------------------------------------------------------------
# Base de datos PostgreSQL (configurable por entorno, con valores por defecto)
# ---------------------------------------------------------------------------
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "armd_ai")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

# Permite sobreescribir todo con una sola URL: postgresql://user:pass@host:port/db
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
)

SCHEMA_PATH = PROJECT_ROOT / "base_datos_prediccion.sql"

# ---------------------------------------------------------------------------
# Artefactos del modelo (generados por el notebook 04D cuando se ejecuta)
# ---------------------------------------------------------------------------
_ARTEFACTOS = PROJECT_ROOT / "modelo" / "V2" / "06_ARTEFACTOS"
MODEL_ARTIFACT_PATH = _ARTEFACTOS / "xgboost_susceptibility_v2.joblib"
MODEL_METADATA_PATH = _ARTEFACTOS / "xgboost_susceptibility_v2_metadata.json"

MODEL_NAME = "XGBoost"
MODEL_VERSION = "v2-xgboost-shap"

# Registro de modelos disponibles (top-3 de la busqueda V2). El usuario elige en la interfaz.
DEFAULT_MODEL_ID = "xgboost"
MODELS = {
    "xgboost": {
        "path": _ARTEFACTOS / "xgboost_susceptibility_v2.joblib",
        "label": "XGBoost (overfit moderado)",
        "model_name": "XGBoost",
        "model_version": "v2-xgboost-top3-moderado",
    },
    "logistic_regression": {
        "path": _ARTEFACTOS / "logreg_susceptibility_v2.joblib",
        "label": "Regresion Logistica (overfit bajo)",
        "model_name": "Regresion Logistica",
        "model_version": "v2-logreg-top3-bajo",
    },
}

# ---------------------------------------------------------------------------
# Red / HTTP
# ---------------------------------------------------------------------------
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
MODEL_SERVICE_URL = os.getenv("MODEL_SERVICE_URL", "http://localhost:8000/ml/susceptibility")

# Origenes CORS permitidos (coma-separados). Por defecto, el frontend local.
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", FRONTEND_URL).split(",")
    if origin.strip()
]
