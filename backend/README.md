# Backend ARMD-AI

API en `FastAPI` para conectar frontend, modelo de susceptibilidad e historial de predicciones.

## Alcance actual

- Modelo unico oficial: `XGBoost`.
- Tarea: prediccion binaria de susceptibilidad antibiotica.
- Clases: `Susceptible` y `Resistant`.
- Explicabilidad: contrato compatible con `SHAP TreeExplainer`.
- Persistencia: PostgreSQL mediante `base_datos_prediccion.sql` (driver `psycopg2`).
- Historial: guarda predicciones anteriores con entradas, probabilidades y valores SHAP.

## Roadmap

- Integrar RAG/agente clinico despues de cerrar el prototipo principal.
- Conectar guias clinicas y respuestas conversacionales desde un modulo separado.

## URLs del prototipo

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Prediccion orquestada y guardada: `POST http://localhost:8000/api/predict`
- Servicio de modelo: `POST http://localhost:8000/ml/susceptibility`
- Historial: `GET http://localhost:8000/api/history`
- Detalle de historial: `GET http://localhost:8000/api/history/{prediccion_id}`

## Base de datos (PostgreSQL)

La conexion se configura por variables de entorno (ver `backend/.env.example`); por defecto
`postgresql://postgres:postgres@localhost:5432/armd_ai`. La forma mas rapida de levantar PostgreSQL
es con el `docker-compose.yml` de la raiz, que ademas auto-carga el esquema:

```bash
docker compose up -d postgres
```

Al iniciar, el backend ejecuta `base_datos_prediccion.sql` si las tablas no existen (idempotente).

## Ejecucion

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # opcional: ajustar credenciales de PostgreSQL
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Artefacto del modelo (XGBoost + SHAP real)

El backend carga un bundle entrenado sobre el **dataset final V2** usando **todas sus variables
predictoras (64 features)**; solo se excluyen los 4 identificadores y el target `susceptibility`:

```text
modelo/V2/06_ARTEFACTOS/xgboost_susceptibility_v2.joblib
```

Se genera (con el kernel `Python (armd-ai)`) ejecutando el notebook de exportacion:

```text
modelo/V2/04_MODELADO/04E_exportar_modelo_api.ipynb
```

El bundle incluye `pipeline` (ColumnTransformer + XGBClassifier) y `feature_columns`.
Con el artefacto presente, `app/services/susceptibility_service.py` calcula **SHAP real**
con `shap.TreeExplainer` y deriva internamente los indicadores `missing_median_*`
(ver `app/feature_spec.py`). Si el artefacto aun no existe, el backend responde con una
prediccion demo compatible con el contrato para poder probar frontend, historial y base de datos.
