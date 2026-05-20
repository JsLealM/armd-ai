# BACKEND

Este directorio se reserva para la API del proyecto en `FastAPI`.

Rol esperado:

- exponer endpoints
- servir resultados consolidados si mas adelante se necesitan
- conectar frontend con inferencia o artefactos del modelo
- alojar servicios auxiliares como RAG o agentes de consulta

Importante:

- no se recomienda mezclar aqui notebooks ni scripts experimentales
- esos deben vivir en `../modelo/`

## RAG en el backend

Si, el backend es un buen lugar para meter el componente RAG.

La razon es que el RAG cumple mejor un rol de servicio que de notebook:

- recibe consultas
- recupera contexto
- arma prompts
- llama modelo
- devuelve respuesta al frontend

### Recomendacion

Separarlo dentro del backend como modulo propio.

Ejemplo de estructura:

```text
backend/
  app/
    api/
    core/
    services/
      rag/
        retriever.py
        embeddings.py
        prompt_builder.py
        agent.py
    main.py
```

### Relacion con `modelo/`

Lo correcto es:

- `modelo/` produce artefactos, datasets, metricas y conocimiento del proyecto
- `backend/` consume lo necesario para exponer servicios

Si el RAG necesita documentos del proyecto, puede leerlos desde:

- `../modelo/`

pero la logica del servicio debe vivir en `backend/`.
