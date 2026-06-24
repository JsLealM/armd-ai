# Diagrama de base de datos — ARMD-AI (PostgreSQL)

Modelo entidad–relación del historial de predicciones de susceptibilidad antibiótica
(XGBoost + SHAP). Motor: **PostgreSQL** (esquema en `base_datos_prediccion.sql`).

- Archivo editable: **`DIAGRAMA_BD_ARMD_AI.drawio`** (abrir en <https://app.diagrams.net> / draw.io).
- Imagen exportada: ver abajo. Vista rápida adicional: diagrama Mermaid al final (se renderiza en GitHub y VS Code).

![Diagrama de base de datos ARMD-AI](DIAGRAMA_BD_ARMD_AI.png)

## Relaciones

- `prediccion` **1 — N** `shap_valor` (variables SHAP por predicción).
- `prediccion` **1 — N** `prediccion_comorbilidad` **N — 1** `comorbilidad_catalogo` (relación muchos-a-muchos).
- `prediccion` **1 — N** `prediccion_exposicion_antibiotica` **N — 1** `exposicion_antibiotica_catalogo` (muchos-a-muchos).

Todas las llaves foráneas hacia `prediccion` usan `ON UPDATE CASCADE ON DELETE CASCADE`.

## Diagrama ER (Mermaid)

```mermaid
erDiagram
    prediccion ||--o{ shap_valor : "explica"
    prediccion ||--o{ prediccion_comorbilidad : "tiene"
    comorbilidad_catalogo ||--o{ prediccion_comorbilidad : "clasifica"
    prediccion ||--o{ prediccion_exposicion_antibiotica : "tiene"
    exposicion_antibiotica_catalogo ||--o{ prediccion_exposicion_antibiotica : "clasifica"

    prediccion {
        SERIAL prediccion_id PK
        VARCHAR session_id
        VARCHAR paciente_referencia
        VARCHAR organismo "NOT NULL"
        VARCHAR antibiotico "NOT NULL"
        VARCHAR tipo_cultivo "NOT NULL"
        VARCHAR ordering_mode
        VARCHAR edad "grupo etario"
        VARCHAR sexo "0/1"
        INTEGER hosp_ward_icu "0/1"
        INTEGER hosp_ward_er "0/1"
        INTEGER hosp_ward_ip "0/1"
        INTEGER hosp_ward_op "0/1"
        DECIMAL adi_score
        DECIMAL adi_state_rank
        DECIMAL median_wbc
        DECIMAL median_neutrophils
        DECIMAL median_lymphocytes
        DECIMAL median_cr
        DECIMAL median_bun
        DECIMAL median_lactate
        DECIMAL median_procalcitonin
        DECIMAL median_temp
        DECIMAL median_heartrate
        DECIMAL median_resprate
        DECIMAL median_sysbp
        DECIMAL median_diasbp
        VARCHAR modelo_nombre
        VARCHAR modelo_version
        VARCHAR clase_predicha "CHECK Susceptible/Resistant"
        DECIMAL probabilidad_susceptible "CHECK 0..1"
        DECIMAL probabilidad_resistant "CHECK 0..1"
        VARCHAR nivel_confianza
        VARCHAR metodo_explicacion
        TEXT request_json
        TEXT response_json
        TIMESTAMP created_at
    }

    shap_valor {
        SERIAL shap_valor_id PK
        INTEGER prediccion_id FK
        VARCHAR variable
        TEXT valor_variable
        DECIMAL shap_value
        VARCHAR direccion "CHECK"
        INTEGER ranking
    }

    comorbilidad_catalogo {
        SERIAL comorbilidad_id PK
        VARCHAR codigo UK
        VARCHAR nombre "8 grupos"
    }

    prediccion_comorbilidad {
        INTEGER prediccion_id PK,FK
        INTEGER comorbilidad_id PK,FK
        INTEGER presente "0/1"
    }

    exposicion_antibiotica_catalogo {
        SERIAL exposicion_id PK
        VARCHAR codigo UK
        VARCHAR nombre "18 clases"
    }

    prediccion_exposicion_antibiotica {
        INTEGER prediccion_id PK,FK
        INTEGER exposicion_id PK,FK
        INTEGER presente "0/1"
    }
```

## Notas de diseño

- `prediccion` es la tabla central: guarda entrada del caso, probabilidades, clase predicha, versión del
  modelo y los JSON crudos de request/response (`TEXT`).
- `shap_valor` almacena los factores explicativos (SHAP) de cada predicción, con `direccion` y `ranking`.
- Las tablas `*_catalogo` normalizan los códigos de comorbilidad y de exposición antibiótica previa; las
  tablas puente (`prediccion_comorbilidad`, `prediccion_exposicion_antibiotica`) registran cuáles aplican
  a cada predicción (clave primaria compuesta).
