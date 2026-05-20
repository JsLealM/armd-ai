# RESUMEN DE ENTRENAMIENTOS DEL MODELO

## Objetivo

Este archivo resume que versiones del dataset se van a comparar, cuantas corridas principales se haran y que variables entran en cada una.

## Variable objetivo

- `susceptibility`

Clases objetivo:

- `Susceptible`
- `Intermediate`
- `Resistant`

## Variables que nunca entran como predictor

- `anon_id`
- `pat_enc_csn_id_coded`
- `order_proc_id_coded`
- `order_time_jittered_utc`
- `susceptibility`

## Tabla resumen

| entrenamiento | dataset | variables predictoras | idea metodologica |
|---|---|---|---|
| `1` | `armd_s_aureus_base_modelado_base.csv` | `antibiotic`, `culture_description`, `age`, `gender`, `hosp_ward_ICU`, `hosp_ward_ER`, `hosp_ward_IP`, `hosp_ward_OP` | version mas simple y solida |
| `2` | `armd_s_aureus_base_modelado_ampliada.csv` | todas las de `base` + `ordering_mode`, `procedure_name`, `median_wbc`, `median_cr` | agrega variables clinicas de uso mas cuidadoso |
| `3` | `armd_s_aureus_base_modelado_multihot_abx.csv` | todas las de `ampliada` + columnas `exp_prev_*` | agrega exposicion antibiotica previa en formato multihot |
| `4` | `armd_s_aureus_base_modelado_multihot_comorb.csv` | todas las de `ampliada` + columnas `comorb_*` | agrega comorbilidades reducidas en formato multihot |
| `5` | `armd_s_aureus_base_modelado_multihot_abx_comorb.csv` | todas las de `ampliada` + columnas `exp_prev_*` + columnas `comorb_*` | version experimental mas completa |

## Detalle por entrenamiento

### Entrenamiento 1: `base`

Variables predictoras:

- `antibiotic`
- `culture_description`
- `age`
- `gender`
- `hosp_ward_ICU`
- `hosp_ward_ER`
- `hosp_ward_IP`
- `hosp_ward_OP`

### Entrenamiento 2: `ampliada`

Variables predictoras:

- todas las de `base`
- `ordering_mode`
- `procedure_name`
- `median_wbc`
- `median_cr`

### Entrenamiento 3: `multihot_abx`

Variables predictoras:

- todas las de `ampliada`
- `exp_prev_*`

Nota:

- esta version reemplaza la idea de una sola columna `antibiotic_class`
- no usa recencia
- por eso `time_to_culturetime` no entra aqui, aunque tenia cobertura aceptable
- su exclusion fue una decision metodologica, no un problema de calidad

### Entrenamiento 4: `multihot_comorb`

Variables predictoras:

- todas las de `ampliada`
- `comorb_congestive_heart_failure`
- `comorb_organ_transplant_status`
- `comorb_diabetes_any`
- `comorb_solid_tumor_non_metastatic`
- `comorb_chronic_pulmonary_any`
- `comorb_renal_failure`
- `comorb_pancreatic_disorder`
- `comorb_sinusitis`

### Entrenamiento 5: `multihot_abx_comorb`

Variables predictoras:

- todas las de `ampliada`
- todas las `exp_prev_*`
- todas las `comorb_*`

## Cuantas corridas principales se haran

Se haran `5` corridas principales, una por cada version del dataset:

1. `base`
2. `ampliada`
3. `multihot_abx`
4. `multihot_comorb`
5. `multihot_abx_comorb`

## Criterio de comparacion

La comparacion no debe basarse solo en `accuracy`.

Las metricas mas importantes para decidir la mejor version seran:

- `balanced_accuracy`
- `f1_macro`
- comportamiento de la clase `Intermediate`
- interpretabilidad metodologica


