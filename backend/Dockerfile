# Imagen del backend FastAPI (ARMD-AI)
FROM python:3.11-slim

# libgomp1 es necesaria para xgboost; sin ella falla el import.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace/backend

# Instala dependencias primero (cache de capas).
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# El codigo del backend y los artefactos del modelo se montan como volumen
# (ver docker-compose.yml), por eso aqui no se copia la app.

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
