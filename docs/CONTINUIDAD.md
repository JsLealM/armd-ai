# Guía de continuidad — ARMD-AI (para retomar el código)

Documento para que cualquier persona pueda **entender, correr y extender** el proyecto.

---

## 1. Estructura del repositorio

```
ARMD-AI/
├── README.md                     Landing del proyecto
├── DocumentoProyecto.docx        Entregable académico
├── docker-compose.yml            Stack completo (postgres + backend + frontend + adminer)
├── base_datos_prediccion.sql     Esquema PostgreSQL (6 tablas)
├── docs/                         Anexos y diagramas
│   ├── MANUAL_USUARIO.md
│   ├── CONTINUIDAD.md            (este archivo)
│   ├── DIAGRAMA_ARQUITECTURA_ARMD_AI.drawio + .md
│   └── DIAGRAMA_BD_ARMD_AI.drawio + .md
├── backend/                      API FastAPI (Python)
│   ├── Dockerfile · requirements.txt · .env.example
│   └── app/  (main, config, database, schemas, feature_spec, services/)
├── frontend/                     React + Vite + TypeScript
│   ├── Dockerfile · package.json · .env.example
│   └── src/  (pages, components, services, context, data, types)
└── modelo/V2/                    Notebooks y artefactos del modelo
    ├── DATOS_PROCESADOS/09_dataset_...balanceado_organismo_clase.csv   (dataset final)
    ├── 04_MODELADO/04E_exportar_modelo_api.ipynb                        (entrena/exporta)
    └── 06_ARTEFACTOS/  xgboost_susceptibility_v2.joblib · logreg_susceptibility_v2.joblib
```

> `frontend/.agents/` son skills de agentes de código: están en `.gitignore` y **no** se suben a GitHub.

---

## 2. Cómo correr

### Con Docker (recomendado)
```bash
docker compose up --build      # postgres, backend (:8000), frontend (:5173), adminer (:8080)
docker compose down            # apagar (conserva la base)
docker compose restart backend # recargar el backend (p.ej. tras reentrenar)
```

### Local (sin Docker)
- **Base**: `docker compose up -d postgres` o un PostgreSQL propio (base `armd_ai`).
- **Backend**: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000`.
- **Frontend**: `cd frontend && npm install && npm run dev`.

Variables de entorno: `backend/.env.example` (BD y CORS) y `frontend/.env.example` (`VITE_API_BASE_URL`).

---

## 3. API (contrato HTTP)

| Endpoint | Método | Rol |
|---|---|---|
| `/health` | GET | Estado del backend |
| `/api/models` | GET | Modelos disponibles (para el selector) |
| `/ml/susceptibility` | POST | Predice sin guardar |
| `/api/predict` | POST | Predice y guarda en el historial |
| `/api/history` · `/api/history/{id}` | GET | Historial y detalle |

`POST /api/predict` recibe el caso + `model_id` (`xgboost` | `logistic_regression`).

---

## 4. Cómo se conecta el backend a los modelos

No hay conexión de red: el backend **lee los `.joblib`** que exporta el notebook.

1. `backend/app/config.py` → **`MODELS`**: mapa `model_id` → ruta del `.joblib`, etiqueta y versión.
2. `backend/app/services/susceptibility_service.py` → **`load_bundle(model_id)`**: `joblib.load(...)` cacheado
   (`@lru_cache`). El bundle trae `pipeline` (preprocesador + modelo), `feature_columns` (64) y `model_type`.
3. **`predict_susceptibility`**: arma la fila con `feature_spec.build_feature_row`, ordena por `feature_columns`
   y llama `pipeline.predict_proba`.
4. **SHAP** según `model_type`: `shap.TreeExplainer` (XGBoost) o `shap.LinearExplainer` (Regresión Logística,
   con el `shap_background` guardado en el bundle).
5. Si el artefacto falta o no carga, responde en **modo demo** (contrato compatible) sin romper.

---

## 5. Reentrenar / exportar los modelos

1. Abrir `modelo/V2/04_MODELADO/04E_exportar_modelo_api.ipynb` con el kernel `Python (armd-ai)` y **Run All**.
2. Genera en `modelo/V2/06_ARTEFACTOS/`: `xgboost_susceptibility_v2.joblib` y `logreg_susceptibility_v2.joblib`.
3. `docker compose restart backend` para que recargue los nuevos artefactos.

El notebook entrena ambos modelos del top-3 con sus **hiperparámetros exactos** sobre el **dataset final**
(`09_dataset_v2_multibacteria_balanceado_organismo_clase.csv`).

---

## 6. Contrato de variables (64) y base de datos

- **Features**: definidas en `backend/app/feature_spec.py` = 6 categóricas + 14 numéricas + 4 salas +
  18 `exp_prev_*` + 8 `comorb_*` + 14 `missing_*` (estos los **deriva el backend**, no son input del usuario).
  Coincide exactamente con lo que entrena `04E` (todo el dataset menos 4 identificadores y el target).
- **Base de datos**: `base_datos_prediccion.sql`, 6 tablas (`prediccion`, `shap_valor`,
  `comorbilidad_catalogo` + `prediccion_comorbilidad`, `exposicion_antibiotica_catalogo` +
  `prediccion_exposicion_antibiotica`). Ver `docs/DIAGRAMA_BD_ARMD_AI.*`.

---

## 7. Cómo extender

- **Añadir un modelo**: exporta su `.joblib` (mismo formato de bundle) y regístralo en `MODELS` (`config.py`);
  aparece solo en `/api/models` y en el selector del frontend (`frontend/src/data/formOptions.ts`).
- **Añadir/quitar una variable**: ajusta `backend/app/feature_spec.py`, el formulario
  (`frontend/src/data/formOptions.ts` + `types.ts`) y reentrena con `04E`. Mantén los tres alineados.
- **Roadmap**: agente RAG clínico (pantalla *Asistente*), calibración de probabilidades y validación externa.
