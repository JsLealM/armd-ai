# PLAN DE MEJORA - MODELO MULTIBACTERIA Y PREPROCESAMIENTO

Este documento registra el cambio de alcance propuesto por el profesor:

> Pasar de un modelo centrado solo en `Staphylococcus aureus` a un modelo que use mas de una bacteria, con mejor seleccion de variables, limpieza y preprocesamiento.

## 1. Cambio principal de alcance

El proyecto original estaba limitado a:

- bacteria unica: `STAPHYLOCOCCUS AUREUS`
- objetivo: `susceptibility`

La nueva propuesta es:

- usar multiples bacterias con suficiente volumen
- agregar `organism` como variable predictora
- mejorar el preprocesamiento y la seleccion de datos
- evitar variables con fuga de informacion

La variable objetivo sigue siendo:

- `susceptibility`

## 2. Revision rapida del dataset crudo

Se reviso `modelo/data/microbiology_cultures_cohort.csv` por streaming, sin cargarlo completo en RAM.

Top organismos con clases validas `Susceptible`, `Intermediate`, `Resistant`:

| Organismo | Filas validas | Susceptible | Intermediate | Resistant | Antibioticos |
|---|---:|---:|---:|---:|---:|
| `ESCHERICHIA COLI` | 874,189 | 729,553 | 22,041 | 122,595 | 37 |
| `KLEBSIELLA PNEUMONIAE` | 151,805 | 124,462 | 6,719 | 20,624 | 36 |
| `STAPHYLOCOCCUS AUREUS` | 82,319 | 63,876 | 577 | 17,866 | 23 |
| `PROTEUS MIRABILIS` | 67,742 | 55,065 | 946 | 11,731 | 34 |
| `ENTEROCOCCUS SPECIES` | 64,463 | 50,524 | 1,697 | 12,242 | 17 |
| `PSEUDOMONAS AERUGINOSA` | 48,660 | 40,020 | 3,180 | 5,460 | 27 |
| `MUCOID PSEUDOMONAS AERUGINOSA` | 32,733 | 25,508 | 2,212 | 5,013 | 22 |
| `KLEBSIELLA OXYTOCA` | 25,050 | 21,150 | 684 | 3,216 | 31 |
| `ENTEROBACTER CLOACAE COMPLEX` | 23,879 | 16,840 | 807 | 6,232 | 29 |
| `COAG NEGATIVE STAPHYLOCOCCUS` | 20,453 | 11,897 | 370 | 8,186 | 19 |

## 3. Bacterias recomendadas para la primera version multibacteria

Para terminar esta semana sin romper el pipeline, recomiendo una version `multibacteria_v1` con estos organismos:

1. `ESCHERICHIA COLI`
2. `KLEBSIELLA PNEUMONIAE`
3. `STAPHYLOCOCCUS AUREUS`
4. `PROTEUS MIRABILIS`
5. `ENTEROCOCCUS SPECIES`
6. `PSEUDOMONAS AERUGINOSA`

Motivo:

- tienen volumen suficiente
- tienen varios antibioticos evaluados
- tienen registros en las tres clases de `susceptibility`
- cubren bacterias clinicamente relevantes y diversas

## 4. Normalizacion de organismos

Antes de entrenar, conviene normalizar algunos nombres.

Ejemplos:

- `STAPH AUREUS {MRSA}` puede considerarse variante relacionada con `STAPHYLOCOCCUS AUREUS`, pero no se debe mezclar sin decidirlo metodologicamente.
- `MUCOID PSEUDOMONAS AERUGINOSA` puede tratarse como variante de `PSEUDOMONAS AERUGINOSA` o dejarse separada.
- Organismos con prefijos raros como `ZZZENTEROBACTER AEROGENES` requieren auditoria antes de usarse.

Decision recomendada para `multibacteria_v1`:

- usar nombres exactos de los 6 organismos principales
- dejar variantes especiales para una segunda iteracion
- incluir `organism` como predictor categorico

## 5. Riesgo de desbalance entre bacterias

`ESCHERICHIA COLI` domina el dataset con mas de 874 mil filas validas.

Riesgo:

- el modelo puede aprender muy bien `E. coli` y peor las bacterias menos frecuentes

Estrategias recomendadas:

- usar `organism` como variable predictora
- evaluar metricas macro
- usar pesos por clase o pesos por organismo si hace falta
- considerar un limite maximo de filas por organismo para una version experimental reproducible

Decision practica para esta semana:

- construir primero el dataset completo de los 6 organismos
- si el entrenamiento es pesado o dominado por `E. coli`, crear una version balanceada por organismo

## 6. Mejores variables candidatas del dataset crudo

Se revisaron archivos adicionales del crudo contra las ordenes de `S. aureus` para estimar utilidad y cobertura. Aunque esa medicion fue sobre la cohorte previa, sirve para decidir fuentes candidatas.

| Archivo | Cobertura aproximada en `S. aureus` | Valor potencial |
|---|---:|---|
| `microbiology_cultures_adi_scores.csv` | 100.00% | contexto socioeconomico o vulnerabilidad |
| `microbiology_cultures_prior_med.csv` | 77.78% | historial de medicamentos previos |
| `microbiology_cultures_antibiotic_subtype_exposure.csv` | 69.30% | exposicion antibiotica mas detallada |
| `microbiology_cultures_vitals.csv` | 63.17% | severidad clinica por signos vitales |
| `microbiology_culture_prior_infecting_organism.csv` | 56.54% | historial microbiologico previo |
| `microbiology_cultures_microbial_resistance.csv` | 51.98% | resistencia previa, pero con alto riesgo de leakage |
| `microbiology_cultures_labs.csv` | 31.13% | laboratorios clinicos |
| `microbiology_cultures_priorprocedures.csv` | 32.97% | procedimientos previos |

## 7. Variables recomendadas para la nueva version

### Variables centrales

- `organism`
- `antibiotic`
- `culture_description`
- `susceptibility`

### Variables demograficas y entorno

- `age`
- `gender`
- `hosp_ward_ICU`
- `hosp_ward_ER`
- `hosp_ward_IP`
- `hosp_ward_OP`

### Variables nuevas recomendadas

- `adi_score`
- `adi_state_rank`
- signos vitales seleccionados:
  - `median_temp`
  - `median_heartrate`
  - `median_resprate`
  - `median_sysbp`
  - `median_diasbp`
- laboratorios seleccionados:
  - `median_wbc`
  - `median_cr`
  - `median_bun`
  - `median_lactate`
  - `median_procalcitonin`
  - `median_neutrophils`
  - `median_lymphocytes`
- exposicion antibiotica previa:
  - `exp_prev_*` por clase antibiotica
- comorbilidades reducidas:
  - `comorb_*`

## 8. Variables que requieren auditoria antes de usarse

### `microbiology_cultures_microbial_resistance.csv`

Es potencialmente muy fuerte, pero peligrosa.

Riesgo:

- puede introducir fuga de informacion si contiene resistencia del mismo evento o informacion demasiado cercana al resultado objetivo

Decision:

- no usarla en la primera version multibacteria
- auditarla en un notebook separado antes de incorporarla

### `implied_susceptibility` y `Rule`

Riesgo:

- pueden estar demasiado cerca de reglas del antibiograma
- podrian introducir conocimiento derivado de la propia susceptibilidad

Decision:

- mantenerlas excluidas para el modelo predictivo base

### `prior_med`

Riesgo:

- incluye muchos medicamentos que no son antibioticos
- puede tener alta cardinalidad

Decision:

- no usar medicamento exacto
- si se usa, resumir por categorias clinicas utiles

## 9. Estrategia de limpieza recomendada

### 9.1. Limpieza inicial

- leer `microbiology_cultures_cohort.csv`
- filtrar solo organismos seleccionados
- conservar solo `Susceptible`, `Intermediate`, `Resistant`
- eliminar filas sin:
  - `organism`
  - `antibiotic`
  - `culture_description`
  - `susceptibility`

### 9.2. Normalizacion

- limpiar espacios
- convertir texto a mayusculas en variables clave si aplica
- homologar nombres de organismos seleccionados solo cuando haya decision documentada

### 9.3. Integracion

Usar `left join` desde la cohorte principal multibacteria hacia:

- demographics
- ward_info
- adi_scores
- vitals
- labs seleccionados
- antibiotic_class_exposure resumido
- comorbidity reducida
- prior_organism corregido si se decide usar

### 9.4. Faltantes

No imputar ciegamente.

Estrategia recomendada:

- variables categoricas: `SIN_REGISTRO`
- variables numericas: mediana dentro del train o imputador dentro del pipeline
- agregar indicadores de faltante para variables clinicas importantes:
  - `missing_median_wbc`
  - `missing_median_cr`
  - `missing_median_temp`
  - etc.

## 10. Estrategia de preprocesamiento para modelado

Usar un pipeline de `scikit-learn`.

### Categóricas

- `OneHotEncoder(handle_unknown="ignore")`
- no hacer ordinal encoding para categorias sin orden clinico

### Numericas

- `SimpleImputer(strategy="median")`
- `StandardScaler` solo para modelos sensibles a escala
- arboles como Random Forest, XGBoost o LightGBM no dependen tanto de escalado

### Target

- `LabelEncoder` para `susceptibility`
- clases:
  - `Susceptible`
  - `Intermediate`
  - `Resistant`

### Validacion

Preferible:

- split temporal usando `order_time_jittered_utc`

Si no alcanza el tiempo:

- `train_test_split` estratificado por `susceptibility`
- reportar la limitacion

### Metricas

No usar solo `accuracy`.

Metricas principales:

- `balanced_accuracy`
- `f1_macro`
- matriz de confusion
- reporte por clase

## 11. Notebooks nuevos recomendados

Para no romper el trabajo anterior de `S. aureus`, crear notebooks nuevos:

1. `09_exploracion_multibacteria_armd.ipynb`
2. `10_construccion_dataset_multibacteria.ipynb`
3. `11_modelado_multibacteria_armd.ipynb`

Motivo:

- conservar la version anterior
- implementar el cambio de alcance de forma ordenada
- permitir comparar `S. aureus` vs multibacteria

## 12. Plan para terminar esta semana

### Dia 1

- cerrar seleccion de organismos
- crear notebook `09`
- generar graficas de distribucion por organismo, antibiotico y `susceptibility`

### Dia 2

- crear dataset multibacteria base
- agregar `organism`
- agregar demographics, ward y ADI

### Dia 3

- agregar vitals y labs seleccionados
- agregar faltantes semanticos y missing indicators

### Dia 4

- construir datasets finales
- entrenar modelos base
- comparar metricas

### Dia 5

- actualizar frontend, documentos y exposicion
- dejar conclusiones y limitaciones

## 13. Decision recomendada

No destruir el pipeline anterior.

Se recomienda:

- mantener el trabajo de `S. aureus` como version `v1`
- crear una version `v2_multibacteria`
- documentar que el cambio responde a retroalimentacion del profesor
- comparar si el enfoque multibacteria mejora generalizacion o aporta mayor robustez

## 14. Frase para defender el cambio

> Inicialmente el proyecto se centro en `Staphylococcus aureus` para controlar el alcance y construir un pipeline reproducible. Con la retroalimentacion del profesor, se propone una segunda version multibacteria que incorpora organismos frecuentes del dataset y mejores variables clinicas, manteniendo controles de limpieza, preprocesamiento y riesgo de fuga de informacion.
