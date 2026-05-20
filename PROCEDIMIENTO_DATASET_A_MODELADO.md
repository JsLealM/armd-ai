# PROCEDIMIENTO COMPLETO: DESDE LOS CSV CRUDOS HASTA LAS BASES FINALES DE MODELADO

## 1. Objetivo de este documento

Este archivo resume de forma clara todo el procedimiento seguido en el proyecto `ARMD-AI`, desde el dataset original compuesto por multiples CSV hasta las bases finales listas para modelado.

La idea es que sirva para:

- entender el flujo completo de trabajo
- explicar el proyecto en una exposicion
- justificar por que se usaron unos archivos y otros no
- documentar las decisiones tecnicas del pipeline

---

## 2. Punto de partida: dataset original

El dataset original ARMD se encuentra en la carpeta `data/` y contiene 16 CSV principales mas archivos auxiliares.

### Archivos principales del dataset

1. `microbiology_cultures_cohort.csv`
2. `microbiology_cultures_ward_info.csv`
3. `microbiology_cultures_prior_med.csv`
4. `microbiology_cultures_microbial_resistance.csv`
5. `microbiology_cultures_demographics.csv`
6. `microbiology_cultures_labs.csv`
7. `microbiology_cultures_vitals.csv`
8. `microbiology_cultures_antibiotic_class_exposure.csv`
9. `microbiology_cultures_antibiotic_subtype_exposure.csv`
10. `microbiology_culture_prior_infecting_organism.csv`
11. `microbiology_cultures_comorbidity.csv`
12. `microbiology_cultures_priorprocedures.csv`
13. `microbiology_cultures_adi_scores.csv`
14. `microbiology_cultures_nursing_home_visits.csv`
15. `microbiology_cultures_implied_susceptibility.csv`
16. `implied_susceptibility_rules.csv`

### Archivo eje del proyecto

El archivo principal fue:

- `microbiology_cultures_cohort.csv`

Este archivo fue la base porque contiene:

- `organism`
- `antibiotic`
- `susceptibility`
- `culture_description`
- los identificadores de enlace

Sin este archivo no se podia definir la cohorte objetivo ni la variable de salida del modelo.

---

## 3. Alcance real del proyecto

El proyecto no busco modelar todo el dataset completo.

### Restricciones del alcance

- solo se trabajo con `Staphylococcus aureus`
- solo se trabajo la prediccion de `susceptibility`
- no se trabajo mortalidad
- no se trabajo inadecuacion empirica
- no se hizo un uso indiscriminado de todas las tablas del dataset

### Regla clave

Solo se usaron los archivos necesarios para construir las variables definidas en `PROJECT_CONTEXT.md`.

---

## 4. Como quedo finalmente el tema de comorbilidades

El archivo:

- `microbiology_cultures_comorbidity.csv`

no se uso de forma directa en la primera base clasica del proyecto por varias razones tecnicas y metodologicas.

### 4.1. No hacia parte del conjunto de variables obligatorias de la primera base clasica

En `PROJECT_CONTEXT.md` se definio un conjunto muy concreto de variables a construir.

Ese archivo de comorbilidades no aparecia como parte obligatoria del set final de predictores aprobado para la primera iteracion de la base clasica.

### 4.2. Era muy costoso para memoria respecto al beneficio inmediato

El archivo pesa cerca de:

- `19.66 GB`

Eso, para un entorno con aproximadamente `13 GB RAM`, era un riesgo fuerte de:

- consumo excesivo de memoria
- lentitud extrema
- caida del notebook
- complejidad de joins innecesaria para la primera iteracion

### 4.3. Requeria una ingenieria de agregacion mucho mas compleja

La tabla de comorbilidades no se podia usar de forma directa como una sola columna simple.

Habria que decidir, por ejemplo:

- si usar presencia o ausencia por comorbilidad
- si resumir por paciente o por orden
- si usar ventanas temporales
- si agrupar por familia diagnostica
- si reducir dimensionalidad

Eso habria abierto una rama metodologica nueva y pesada antes de cerrar lo esencial del proyecto.

### 4.4. Podia introducir alta dimensionalidad y ruido

Un archivo de comorbilidades puede generar:

- demasiadas categorias
- gran dispersión
- fuerte sparsity
- necesidad de agregaciones adicionales

Eso es peligroso en una primera iteracion donde primero queriamos:

- una base interpretable
- una limpieza clara
- una primera comparacion de modelos estable

### 4.5. El proyecto ya capturaba parte del contexto clinico por otras variables

Aunque no se usaron comorbilidades explicitas, ya habia variables con sentido clinico fuerte:

- `age`
- `culture_description`
- `hosp_ward_ICU`
- `hosp_ward_ER`
- `hosp_ward_IP`
- `hosp_ward_OP`
- `procedure_name`
- `median_wbc`
- `median_cr`

Es decir: no se dejo el modelo totalmente ciego al contexto del paciente.

### Conclusión de la primera decision

No usar comorbilidades crudas en la primera base clasica fue una decision razonable porque:

- no eran obligatorias en el alcance actual
- eran demasiado pesadas para la infraestructura disponible
- requerian un rediseño metodologico propio
- aumentaban la complejidad antes de cerrar la primera version del pipeline

Esto no significaba que fueran inutiles.

Significaba que:

- podian evaluarse en una iteracion futura
- no eran adecuadas para la primera version controlada del proyecto

### 4.6. Decision actual del proyecto

Despues del analisis posterior, el archivo de comorbilidades si se reaprovecho, pero no de forma cruda.

Se construyo una version experimental reducida basada en grupos binarios `multihot`, para no meter las casi `500` categorias originales directamente al modelo.

Los grupos seleccionados en esta primera implementacion experimental fueron:

- `comorb_congestive_heart_failure`
- `comorb_organ_transplant_status`
- `comorb_diabetes_any`
- `comorb_solid_tumor_non_metastatic`
- `comorb_chronic_pulmonary_any`
- `comorb_renal_failure`
- `comorb_pancreatic_disorder`
- `comorb_sinusitis`

En otras palabras:

- no se uso `microbiology_cultures_comorbidity.csv` crudo
- si se uso una version agregada, reducida y controlada de comorbilidades para dos datasets experimentales

---

## 5. Archivos que si se usaron

### Usados de forma directa

1. `microbiology_cultures_cohort.csv`
2. `microbiology_cultures_demographics.csv`
3. `microbiology_cultures_ward_info.csv`
4. `microbiology_cultures_labs.csv`
5. `microbiology_cultures_antibiotic_class_exposure.csv`
6. `microbiology_culture_prior_infecting_organism.csv`
7. `microbiology_cultures_nursing_home_visits.csv`
8. `microbiology_cultures_priorprocedures.csv`
9. `microbiology_cultures_implied_susceptibility.csv`
10. `implied_susceptibility_rules.csv`

### Usados despues en transformaciones experimentales posteriores

- `microbiology_cultures_antibiotic_class_exposure.csv`
- `microbiology_cultures_comorbidity.csv`

El archivo de exposicion antibiotica primero se uso en una version simple:

- `antibiotic_class`
- `time_to_culturetime`

y despues se reutilizo para construir una base experimental:

- multihot por clase antibiotica previa

El archivo de comorbilidades no se integro crudo. Primero se audito por streaming y luego se reutilizo para construir:

- una version reducida `multihot_comorb`
- una version combinada `multihot_abx_comorb`

---

## 6. Archivos que no se usaron en esta fase

### No usados de forma directa por no estar en el alcance actual o por complejidad innecesaria

- `microbiology_cultures_prior_med.csv`
- `microbiology_cultures_microbial_resistance.csv`
- `microbiology_cultures_vitals.csv`
- `microbiology_cultures_antibiotic_subtype_exposure.csv`
- `microbiology_cultures_adi_scores.csv`

### Razones generales

- no eran parte del set obligatorio de variables
- agregaban complejidad antes de cerrar la primera iteracion
- podian requerir transformaciones adicionales costosas
- algunas eran redundantes frente a otras variables mas manejables
- en el caso de comorbilidades, el archivo no se uso crudo, sino solo despues de una reduccion experimental controlada

---

## 7. Paso 1: filtrado temprano de la cohorte

El primer gran paso fue cargar el archivo principal:

- `microbiology_cultures_cohort.csv`

y filtrar de inmediato por:

- `organism == STAPHYLOCOCCUS AUREUS`

### Por que se hizo esto al inicio

- para reducir memoria
- para trabajar solo con la bacteria objetivo del proyecto
- para no unir tablas auxiliares para millones de filas innecesarias

### Resultado conceptual

Se paso de una base muy grande del dataset total a una cohorte enfocada solo en `S. aureus`.

---

## 8. Paso 2: construccion de la base analitica unificada

Despues del filtrado temprano, se unieron solo las tablas necesarias.

### Claves de enlace usadas

- `order_proc_id_coded`
- en algunos casos tambien estaban disponibles `anon_id` y `pat_enc_csn_id_coded`

### Logica de la union

Se hizo un `merge` tipo `left` desde la cohorte principal hacia las tablas auxiliares, para no perder registros de la cohorte objetivo.

### Variables agregadas desde otras tablas

#### Desde `microbiology_cultures_demographics.csv`

- `age`
- `gender`

#### Desde `microbiology_cultures_ward_info.csv`

- `hosp_ward_ICU`
- `hosp_ward_ER`
- `hosp_ward_IP`
- `hosp_ward_OP`

#### Desde `microbiology_cultures_labs.csv`

- `median_wbc`
- `median_cr`

#### Desde `microbiology_cultures_antibiotic_class_exposure.csv`

- `antibiotic_class`
- `time_to_culturetime`

#### Desde `microbiology_culture_prior_infecting_organism.csv`

- `prior_organism`
- `prior_infecting_organism_days_to_culture`

#### Desde `microbiology_cultures_nursing_home_visits.csv`

- `nursing_home_visit_culture`

#### Desde `microbiology_cultures_priorprocedures.csv`

- `procedure_name`

#### Desde `microbiology_cultures_implied_susceptibility.csv`

- `implied_susceptibility`

#### Desde `implied_susceptibility_rules.csv`

- `Rule`

---

## 9. Paso 3: decisiones de agregacion por tablas con multiples filas

No todas las tablas tenian una sola fila por orden.

### Ejemplo

Archivos como:

- `microbiology_cultures_antibiotic_class_exposure.csv`
- `microbiology_culture_prior_infecting_organism.csv`
- `microbiology_cultures_priorprocedures.csv`

podian tener varias filas por `order_proc_id_coded`.

### Que se hizo en la primera version

Se uso una logica de agregacion sencilla para quedarnos con el registro mas cercano o mas util para la fase exploratoria.

Eso hizo la base mas estable y mas facil de explicar.

---

## 10. Paso 4: limpieza del dataset unificado

Con la base unificada construida, se aplico la limpieza principal.

### Reglas aplicadas

#### 10.1. Estandarizacion de texto

Se limpiaron espacios y formatos en variables categoricas.

#### 10.2. Eliminacion de filas con faltantes criticos

Se eliminaron filas con nulos en:

- `antibiotic`
- `culture_description`
- `susceptibility`

#### 10.3. Restriccion de la variable objetivo

Solo se conservaron estas clases:

- `Susceptible`
- `Intermediate`
- `Resistant`

Se eliminaron registros con clases no utiles como:

- `Inconclusive`
- valores vacios

#### 10.4. Eliminacion de duplicados exactos

Se aplico `drop_duplicates()`

En la practica, los 200 registros removidos se explicaron por la variable objetivo y no por duplicados.

### Resultado de la limpieza

Archivo resultante:

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_limpia.csv`

Resumen:

- antes de limpieza: `82,519` filas
- despues de limpieza: `82,319` filas

### Interpretacion

La limpieza fue conservadora.

Solo se eliminaron:

- `196` filas con `susceptibility` vacia
- `4` filas con `susceptibility = Inconclusive`

---

## 11. Paso 5: tratamiento de faltantes categoricos

En varias variables categoricas no se eliminaron filas. En cambio, se reemplazaron nulos por etiquetas explicitas.

### Etiquetas usadas

- `SIN_REGISTRO`
- `SIN_REGLA`

### Variables donde se aplico esto

- `age`
- `gender`
- `antibiotic_class`
- `prior_organism`
- `procedure_name`
- `implied_susceptibility`
- `Rule`

### Por que se hizo

- para no perder filas
- para dejar explicito que faltaba informacion
- para poder separar limpieza tecnica de cobertura real

---

## 12. Paso 6: verificacion final de variables

Despues de la limpieza, se construyo una verificacion formal variable por variable.

Archivo:

- `modelo/3.DATOS-PROCESADOS/verificacion_variables_modelado.csv`

### Que contiene

Por cada variable:

- nombre
- tipo
- porcentaje de nulos
- cardinalidad
- decision
- justificacion tecnica

### Tipos de decision

- `usar`
- `usar con cuidado`
- `excluir`

### Variables mas solidas

- `culture_description`
- `antibiotic`
- `age`
- `gender`
- `hosp_ward_ICU`
- `hosp_ward_ER`
- `hosp_ward_IP`
- `hosp_ward_OP`

### Variables con cautela

- `median_wbc`
- `median_cr`
- `ordering_mode`
- `procedure_name`
- `antibiotic_class`
- `time_to_culturetime`

### Variables excluidas

- `nursing_home_visit_culture`
- `prior_organism`
- `prior_infecting_organism_days_to_culture`
- `implied_susceptibility`
- `Rule`

---

## 13. Paso 7: problema detectado con el analisis de nulos

Inicialmente se genero:

- `modelo/3.DATOS-PROCESADOS/comparacion_nulos.csv`

Ese archivo compara `NaN` antes y despues.

### Problema

No siempre refleja cobertura real.

Por ejemplo:

- `procedure_name` podia salir con `0%` de nulos despues
- pero eso no significa que quedo completa
- solo significa que muchos nulos fueron convertidos a `SIN_REGISTRO`

### Solucion

Se creo un reporte nuevo:

- `modelo/3.DATOS-PROCESADOS/reporte_faltantes_semanticos.csv`

que separa:

- `porcentaje_na_real`
- `porcentaje_faltante_semantico`
- `porcentaje_cobertura_real`

### Ejemplos clave

- `procedure_name`: `0%` de `NaN`, pero `65.53%` de faltante semantico
- `antibiotic_class`: `0%` de `NaN`, pero `29.77%` de faltante semantico
- `prior_organism`: `0%` de `NaN`, pero `100%` de faltante semantico

---

## 14. Paso 8: construccion de datasets finales de modelado

Con la verificacion de variables cerrada, se construyeron versiones finales de la base para modelado.

### 14.1. Base principal limpia

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_limpia.csv`

Es la base unificada y limpia, pero aun no es la version mas compacta para modelar.

### 14.2. Version base

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_base.csv`

Contiene solo las variables mas solidas para una primera corrida.

### 14.3. Version ampliada

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_ampliada.csv`

Contiene la version base mas algunas variables marcadas como `usar con cuidado`.

### 14.4. Manifiesto de modelado

- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado.csv`

Este archivo explica:

- que columnas son identificadores
- cual es la columna temporal
- cuales entran como predictores
- cual es la variable objetivo

---

## 15. Paso 9: rediseño de la exposicion antibiotica previa

Despues del analisis inicial, se detecto que una misma `order_proc_id_coded` podia tener varias clases antibioticas previas.

### Problema

Usar una sola columna `antibiotic_class` perdia informacion.

### Decision metodologica

No usar recencia en esta iteracion.

Usar solo:

- multihot por clase antibiotica previa

### Implementacion

Se creo el script:

- `modelo/4.MODELADO-Y-VALIDACION/construir_dataset_multihot_abx.py`

### Resultado

Se genero:

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_abx.csv`
- `modelo/3.DATOS-PROCESADOS/catalogo_clases_antibioticas_multihot.csv`

### Que cambia esta version

Reemplaza:

- `antibiotic_class`
- `time_to_culturetime`

por:

- 18 columnas binarias `exp_prev_*`

una por cada clase antibiotica previa detectada en la cohorte.

---

## 16. Paso 10: incorporacion experimental de comorbilidades reducidas

Despues del piloto de comorbilidades, se decidio no usar las casi `500` categorias originales en bruto.

### Decision metodologica

Construir grupos binarios reducidos `multihot` a partir de componentes clinicamente mas defendibles.

### Implementacion

Se creo:

- `modelo/4.MODELADO-Y-VALIDACION/construir_datasets_comorb.py`
- `modelo/4.MODELADO-Y-VALIDACION/06_construccion_datasets_comorb.ipynb`

### Resultado

Se generaron:

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_abx_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/catalogo_grupos_comorbilidades.csv`
- `modelo/3.DATOS-PROCESADOS/cobertura_grupos_comorbilidades.csv`

### Que cambia esta version

Se agregan `8` columnas binarias `comorb_*` con grupos reducidos de comorbilidad:

- `comorb_congestive_heart_failure`
- `comorb_organ_transplant_status`
- `comorb_diabetes_any`
- `comorb_solid_tumor_non_metastatic`
- `comorb_chronic_pulmonary_any`
- `comorb_renal_failure`
- `comorb_pancreatic_disorder`
- `comorb_sinusitis`

Esto dio lugar a dos nuevas variantes:

- `multihot_comorb`: base ampliada mas grupos binarios de comorbilidad
- `multihot_abx_comorb`: multihot de antibioticos previos mas grupos binarios de comorbilidad

---

## 17. Paso 11: preparacion del notebook de modelado

Se ajusto:

- `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`

para aceptar cinco versiones del dataset:

- `base`
- `ampliada`
- `multihot_abx`
- `multihot_comorb`
- `multihot_abx_comorb`

El notebook:

- carga la base elegida
- hace particion temporal
- separa variables numericas y categoricas
- aplica imputacion dentro del pipeline
- compara varios modelos
- guarda resultados

---

## 18. Paso 12: material para exposicion

Ademas del pipeline de datos y modelado, se dejaron listos materiales visuales.

### Script de graficas para exposicion

- `modelo/2.VISUALIZACION-DATOS/generar_graficas_exposicion.py`

### Notebook de exposicion visual

- `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`

### Complemento de faltantes semanticos

- `modelo/1.ANALIZAR-DATASET-UNIR/02_complemento_faltantes_semanticos_armd.ipynb`

### Carpeta de imagenes

- `modelo/2.VISUALIZACION-DATOS/EXPOSICION`

---

## 19. Resumen final del flujo completo

### Flujo simplificado

1. partir del dataset ARMD completo
2. usar `microbiology_cultures_cohort.csv` como eje
3. filtrar temprano por `STAPHYLOCOCCUS AUREUS`
4. unir solo las tablas necesarias para las variables del proyecto
5. limpiar textos y faltantes criticos
6. conservar solo `Susceptible`, `Intermediate`, `Resistant`
7. marcar faltantes categoricos con `SIN_REGISTRO` y `SIN_REGLA`
8. generar base limpia final
9. verificar variable por variable
10. construir bases de modelado:
   - `base`
   - `ampliada`
   - `multihot_abx`
   - `multihot_comorb`
   - `multihot_abx_comorb`
11. preparar notebook de modelado para comparar las cinco variantes
12. preparar material visual para exposicion

---

## 20. Archivos finales mas importantes del proyecto

### Analisis y limpieza

- `modelo/1.ANALIZAR-DATASET-UNIR/01_analisis_limpieza_visualizacion_armd.ipynb`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_limpia.csv`
- `modelo/3.DATOS-PROCESADOS/verificacion_variables_modelado.csv`
- `modelo/3.DATOS-PROCESADOS/comparacion_nulos.csv`
- `modelo/3.DATOS-PROCESADOS/reporte_faltantes_semanticos.csv`

### Bases para modelado

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_base.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_ampliada.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_abx.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_abx_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/catalogo_grupos_comorbilidades.csv`
- `modelo/3.DATOS-PROCESADOS/cobertura_grupos_comorbilidades.csv`

### Modelado

- `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`
- `modelo/4.MODELADO-Y-VALIDACION/06_construccion_datasets_comorb.ipynb`

### Exposicion

- `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`
- `modelo/1.ANALIZAR-DATASET-UNIR/02_complemento_faltantes_semanticos_armd.ipynb`
- `modelo/2.VISUALIZACION-DATOS/EXPOSICION/`

---

## 21. Conclusión

El proyecto no consistio en “usar todos los CSV del dataset”.

Consistio en hacer una seleccion tecnica y controlada:

- filtrar la bacteria objetivo
- escoger solo variables coherentes con el alcance
- limpiar sin destruir la base
- distinguir entre nulos tecnicos y ausencia informativa real
- construir versiones de modelado comparables

No usar el archivo de comorbilidades de 20 GB en bruto no fue un olvido.

Fue una decision metodologica razonable dada:

- la RAM disponible
- el alcance real del proyecto
- la necesidad de controlar ruido y dimensionalidad

La evolucion posterior del proyecto fue mas fina:

- no usar comorbilidades crudas
- si probar una version reducida y agrupada en dos datasets experimentales
- la necesidad de cerrar primero una primera iteracion explicable y estable


