# BACKEND ARCHITECTURE - ARMD-AI

## 1. Tecnologia

El backend se planea en:

- `FastAPI`

## 2. Rol del backend

El backend no debe reemplazar notebooks ni scripts de investigacion.

Debe encargarse de:

- exponer endpoints al frontend
- servir resultados consolidados
- ejecutar inferencia si despues se conecta un modelo
- alojar servicios de consulta como RAG

## 3. Se recomienda incluir RAG en el backend

Si, **el agente RAG puede y debe vivir en el backend**.

Eso tiene sentido porque el frontend no deberia:

- recuperar documentos
- construir prompts
- manejar embeddings
- invocar modelos directamente

El backend si puede centralizar esa logica.

## 4. Arquitectura sugerida

```text
backend/
  app/
    api/
      routes/
        health.py
        models.py
        rag.py
    core/
      config.py
    services/
      rag/
        loader.py
        chunker.py
        embeddings.py
        retriever.py
        prompt_builder.py
        agent.py
    schemas/
      rag.py
      model_results.py
    main.py
```

## 5. Relacion entre backend y modelo

La separacion correcta es:

- `modelo/` contiene notebooks, scripts, datos y artefactos del trabajo analitico
- `backend/` expone servicios y consume artefactos preparados

Ejemplos:

- el backend puede leer metricas exportadas por `modelo/`
- el backend puede leer documentos markdown de `modelo/`
- el backend puede cargar una base vectorial construida a partir de contenido de `modelo/`

## 6. Fuentes ideales para el RAG

Al inicio, el RAG podria usar como base documental:

- `modelo/PROJECT_CONTEXT.md`
- `PLAN_TRABAJO.md`
- `SESSION_PROGRESS.md`
- `GUIA_CORTA_EXPOSICION_DATASET.md`
- `PROCEDIMIENTO_DATASET_A_MODELADO.md`
- `RESUMEN_ENTRENAMIENTOS_MODELO.md`
- `ACLARACIONES_CONSISTENCIA_MODELO.md`

## 7. Primera fase recomendada

No hace falta arrancar con un RAG complejo.

Primera fase:

1. endpoint simple en FastAPI
2. lectura de documentos markdown del proyecto
3. recuperacion basica por similitud o por busqueda textual
4. respuesta guiada para frontend

## 8. Conclusión

Si, el RAG encaja mejor en `backend/` que en `modelo/`.

`modelo/` produce conocimiento y artefactos.

`backend/` los convierte en servicios consumibles por el frontend.
