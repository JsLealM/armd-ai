# Backend Architecture - ARMD-AI

## Objetivo

El backend actua como capa HTTP entre el frontend React y los modelos. Recibe un caso clinico, ejecuta la
prediccion de susceptibilidad con el modelo elegido (XGBoost o Regresion Logistica), calcula SHAP, guarda el
resultado y expone el historial.

## Arquitectura actual

```text
frontend React/Vite/TS  (selector de modelo: model_id)
  -> POST /api/predict
backend FastAPI
  -> load_bundle(model_id)  ->  .joblib (XGBoost / Regresion Logistica)
  -> predict_proba + SHAP (TreeExplainer / LinearExplainer)
  -> PostgreSQL historial (psycopg2)
```

## Endpoints

| Endpoint | Metodo | Rol |
|---|---|---|
| `/health` | GET | Verifica estado del backend |
| `/api/models` | GET | Lista los modelos disponibles (para el selector del frontend) |
| `/ml/susceptibility` | POST | Ejecuta inferencia del modelo sin guardar historial |
| `/api/predict` | POST | Ejecuta inferencia y guarda prediccion |
| `/api/history` | GET | Lista predicciones anteriores |
| `/api/history/{prediccion_id}` | GET | Consulta detalle de una prediccion |

## Modelos (dos, seleccionables)

El usuario elige el modelo en la interfaz; el frontend envia `model_id` en la peticion. Ambos son del
top-3 de la busqueda V2, entrenados sobre el dataset final con sus hiperparametros exactos:

| `model_id` | Modelo | Overfitting | SHAP |
|---|---|---|---|
| `xgboost` (por defecto) | XGBoost | moderado | TreeExplainer |
| `logistic_regression` | Regresion Logistica | bajo | LinearExplainer |

- Variable objetivo: `susceptibility` (binaria: `Susceptible` / `Resistant`).
- Entrada: **64 variables** (ver `app/feature_spec.py`); los indicadores `missing_*` los **deriva el backend**.

## Conexion a los modelos (como carga el backend los `.joblib`)

No hay conexion de red al modelo: el backend **lee los artefactos `.joblib`** que exporta el notebook
`modelo/V2/04_MODELADO/04E_exportar_modelo_api.ipynb`.

1. **Registro** (`app/config.py` → `MODELS`): mapea cada `model_id` a su ruta `.joblib`, etiqueta y version.
2. **Carga perezosa** (`app/services/susceptibility_service.py` → `load_bundle(model_id)`): `joblib.load(...)`
   cacheado con `@lru_cache`. El bundle trae `pipeline` (preprocesador + modelo), `feature_columns` (64) y
   `model_type` (`tree` / `linear`).
3. **Prediccion** (`predict_susceptibility`): arma la fila con `feature_spec.build_feature_row`, ordena por
   `feature_columns` y llama `pipeline.predict_proba`.
4. **SHAP**: segun `model_type`, usa `shap.TreeExplainer` (XGBoost) o `shap.LinearExplainer` (Logistica, con el
   `shap_background` guardado en el bundle). Devuelve los factores top por |contribucion|.
5. Si el `.joblib` no existe o no carga, responde en **modo demo** (contrato compatible) sin romper.

Reentrenar = re-correr `04E` y luego `docker compose restart backend` (recarga los `.joblib`).

## Persistencia

El motor es **PostgreSQL** (acceso vía `psycopg2`). La conexion se configura por entorno
(`DATABASE_URL` o `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD`). El esquema se define en:

```text
base_datos_prediccion.sql
```

Tablas principales:

- `prediccion`: datos del caso, probabilidades, clase predicha y JSON de entrada/salida.
- `shap_valor`: variables influyentes por prediccion.
- `comorbilidad_catalogo` y `prediccion_comorbilidad`: comorbilidades seleccionadas.
- `exposicion_antibiotica_catalogo` y `prediccion_exposicion_antibiotica`: antibioticos previos agrupados.

## Roadmap

El agente RAG no hace parte del alcance actual del prototipo funcional. Queda como trabajo futuro para responder preguntas clinicas con recuperacion de guias y documentos.
