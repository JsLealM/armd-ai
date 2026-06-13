# ARMD-AI

Repositorio organizado como monorepo con tres areas principales:

- `frontend/`
- `backend/`
- `modelo/`

## Estructura

### `frontend/`

Aplicacion `React + Vite` para:

- pagina principal de graficas y narrativa visual
- pagina de modelos probados y scores

### `backend/`

API en `FastAPI` para:

- exponer endpoints
- servir resultados
- alojar servicios como RAG

### `modelo/`

Area de analisis y modelado para:

- notebooks
- scripts
- datos del dataset
- datos procesados
- imagenes y artefactos

Dentro de `modelo/` el trabajo queda separado por versiones:

- `V1`: carpetas originales con el pipeline centrado principalmente en `STAPHYLOCOCCUS AUREUS`
- `V2`: nuevo pipeline multibacteria con mejores variables y preprocesamiento

## Documentos principales

- `FRONTEND_ARCHITECTURE.md`
- `BACKEND_ARCHITECTURE.md`
- `PROJECT_CONTEXT.md`
- `SESSION_PROGRESS.md`

