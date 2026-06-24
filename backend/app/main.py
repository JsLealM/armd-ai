from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import BACKEND_URL, CORS_ORIGINS, DEFAULT_MODEL_ID, MODELS, MODEL_SERVICE_URL
from .database import get_prediction, initialize_database, list_history, save_prediction
from .schemas import HistoryItem, PredictionRequest, PredictionResponse
from .services.susceptibility_service import predict_susceptibility


app = FastAPI(title="ARMD-AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    try:
        initialize_database()
        print("[ARMD-AI] Base de datos PostgreSQL lista.")
    except Exception as exc:  # noqa: BLE001
        print(f"[ARMD-AI] AVISO: no se pudo conectar/inicializar PostgreSQL: {exc}")
        print("[ARMD-AI] El servidor sigue activo. Funcionan /health, /api/models y /ml/susceptibility.")
        print("[ARMD-AI] /api/predict y /api/history necesitan PostgreSQL (arranca 'docker compose up -d postgres').")


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "backend_url": BACKEND_URL,
        "model_service_url": MODEL_SERVICE_URL,
        "model": "XGBoost",
    }


@app.get("/api/models")
def list_models() -> list[dict]:
    """Modelos disponibles para el selector del frontend (top-3: XGBoost y Regresion Logistica)."""
    return [
        {
            "id": model_id,
            "label": spec["label"],
            "model_name": spec["model_name"],
            "default": model_id == DEFAULT_MODEL_ID,
            "available": spec["path"].exists(),
        }
        for model_id, spec in MODELS.items()
    ]


@app.post("/ml/susceptibility", response_model=PredictionResponse)
def susceptibility(request: PredictionRequest) -> PredictionResponse:
    return predict_susceptibility(request)


@app.post("/api/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest) -> PredictionResponse:
    response = predict_susceptibility(request)
    prediccion_id = save_prediction(request, response)
    return response.model_copy(update={"prediccion_id": prediccion_id})


@app.get("/api/history", response_model=list[HistoryItem])
def history(limit: int = 50) -> list[dict]:
    return list_history(limit=limit)


@app.get("/api/history/{prediccion_id}")
def history_detail(prediccion_id: int) -> dict:
    item = get_prediction(prediccion_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Prediccion no encontrada")
    return item
