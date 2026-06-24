# ARMD-AI

Sistema inteligente de **apoyo exploratorio** para predecir la **susceptibilidad antibiótica**
(Susceptible / Resistant) de una combinación organismo–antibiótico, con explicabilidad **SHAP**.

Proyecto académico — Universidad de Pamplona, Sistemas Inteligentes. Autores: Johan Leal, Danilo Castillejo.

> ⚠️ Prototipo académico. **No** reemplaza el antibiograma ni el criterio médico, y **no** es un dispositivo médico.

---

## Stack

- **Modelo**: dos clasificadores del top-3 seleccionables — **XGBoost** (sobreajuste moderado) y
  **Regresión Logística** (sobreajuste bajo) — entrenados sobre el dataset V2 multibacteria (64 variables).
- **Explicabilidad**: **SHAP** (TreeExplainer / LinearExplainer).
- **Backend**: **FastAPI** (Python) + **psycopg2**.
- **Base de datos**: **PostgreSQL**.
- **Frontend**: **React + Vite + TypeScript**.
- **Despliegue**: **Docker Compose**.

## Quickstart (Docker)

```bash
docker compose up --build
```

| Servicio | URL |
|---|---|
| Aplicación (frontend) | http://localhost:5173 |
| API (backend) | http://localhost:8000 — prueba `GET /api/models` |
| Adminer (BD) | http://localhost:8080 |

Apagar: `docker compose down`. Más detalles en [`docs/MANUAL_USUARIO.md`](docs/MANUAL_USUARIO.md).

## Estructura

```
backend/        API FastAPI (predicción + SHAP + historial)
frontend/       React + Vite + TypeScript
modelo/V2/      Notebooks y artefactos del modelo (.joblib)
docs/           Manual de usuario, guía de continuidad y diagramas
base_datos_prediccion.sql   Esquema PostgreSQL (6 tablas)
docker-compose.yml          Orquestación del stack
DocumentoProyecto.docx      Entregable académico
```

## Documentación

- 📘 [Manual de usuario](docs/MANUAL_USUARIO.md) — cómo usar el prototipo.
- 🛠️ [Guía de continuidad](docs/CONTINUIDAD.md) — cómo correr, entender y extender el código.
- 🏗️ [Arquitectura y comunicaciones](docs/DIAGRAMA_ARQUITECTURA_ARMD_AI.md) — flujo del sistema.
- 🗄️ [Diagrama de base de datos](docs/DIAGRAMA_BD_ARMD_AI.md) — modelo entidad–relación.
- 🔌 [Arquitectura del backend](backend/BACKEND_ARCHITECTURE.md) — endpoints y carga de modelos.

## Cómo funciona (resumen)

El frontend envía el caso (con `model_id`) al backend por HTTP. El backend **carga el modelo elegido** desde su
artefacto `.joblib` (`joblib.load`), predice con `predict_proba`, calcula SHAP y guarda el resultado en
PostgreSQL. Los `.joblib` los produce el notebook `modelo/V2/04_MODELADO/04E_exportar_modelo_api.ipynb`.
