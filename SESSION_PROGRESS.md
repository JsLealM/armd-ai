# SESSION_PROGRESS

## CHECKPOINT_ACTUAL

FASE_ACTIVA: `FASE 6 - Preparacion metodologica del modelado`

SUBTAREA_ACTUAL: `ejecutar el notebook de modelado primero con VERSION_DATASET="base" y luego con VERSION_DATASET="ampliada"`

ULTIMO_CHECKPOINT_SEGURO: `notebook de modelado ya ajustado para version base/ampliada; datasets base y ampliada generados; manifiesto de modelado exportado`

SIGUIENTE_ACCION_OBLIGATORIA: `correr el notebook de modelado con VERSION_DATASET="base" y guardar resultados; luego repetir con VERSION_DATASET="ampliada"`

NO_HACER_AUN:
- `no hacer tuning fino de hiperparametros todavia`
- `no mezclar variables excluidas en la primera corrida`

BLOQUEADO_POR:
- `no hay bloqueo tecnico fuerte`
- `solo falta decidir si el notebook de modelado arranca con dataset base o compara base vs ampliada desde el principio`

ARCHIVO_FUENTE_ACTUAL:
- `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`

EVIDENCIA_ESPERADA_PARA_CERRAR_ESTA_FASE:
- `dataset final de modelado base`
- `dataset final de modelado ampliado`
- `manifiesto de columnas y roles`

## Estado actual del proyecto

Proyecto: `ARMD-AI`

Ruta del proyecto:
`D:\6TO-SEMESTRE\Sistemas Inteligentes\2doCorte\Proyecto`

Fase actual:
`Preparacion metodologica del modelado`

Restriccion actual del alcance:
- No se esta entrenando el modelo todavia.
- No se esta trabajando mortalidad ni inadecuacion empirica.
- El foco actual es solo la preparacion y comprension del dataset para `Staphylococcus aureus`.

## Contexto base usado

Archivos de referencia principales:
- `PROJECT_CONTEXT.md`
- `PLAN_TRABAJO.md`
- `modelo/data/README.md`

Documento guia para futuras sesiones:
- `PLAN_TRABAJO.md`

Decisiones de trabajo tomadas:
- Se trabajara en espanol dentro del notebook.
- Se usara `matplotlib` para las visualizaciones.
- Se filtrara temprano por `STAPHYLOCOCCUS AUREUS` para ahorrar memoria.
- No se hara imputacion estadistica ciega.
- Se dejara evidencia visual del estado antes y despues de la limpieza.
- Para representar exposicion antibiotica previa, se priorizara una codificacion por clase antibiotica en lugar de farmaco exacto.
- Si una observacion tiene multiples exposiciones antibioticas previas, la opcion metodologica preferida sera codificacion multihot por clase antibiotica mas una variable temporal derivada por cercania al cultivo.
- Se verifico la estructura real de `modelo/data/microbiology_cultures_antibiotic_class_exposure.csv` y si permite exposiciones multiples por `order_proc_id_coded`.
- En el subconjunto limpio de `S. aureus`, 5831 de 8414 ordenes (69.3%) tienen exposicion antibiotica previa no nula y 4327 de esas 5831 (74.21%) presentan multiples clases antibioticas previas, por lo que una sola columna categorica pierde bastante informacion.
- Recomendacion metodologica actual: para una segunda iteracion del modelo, construir variables binarias multihot por clase antibiotica y una o mas variables temporales derivadas usando la menor distancia en dias al cultivo por clase o una ventana global de recencia.
- Decision actual del usuario: no incorporar variables de recencia para exposicion antibiotica previa.
- Decision metodologica vigente: si se rediseña esta parte de la base, usar solo codificacion multihot por clase antibiotica previa, sin `time_to_culturetime` ni ventanas de recencia derivadas.
- Se implemento un generador documentado en `modelo/4.MODELADO-Y-VALIDACION/construir_dataset_multihot_abx.py` para crear una base experimental con exposicion antibiotica previa en formato multihot por clase.
- La base experimental generada reemplaza `antibiotic_class` y `time_to_culturetime` por 18 columnas binarias `exp_prev_*`, una por clase antibiotica previa detectada en la cohorte de `S. aureus`.
- Para la exposicion del proyecto se priorizara una capa visual separada del notebook de modelado, con graficas grandes, legibles y faciles de defender oralmente.
- Se decidio usar solo `matplotlib` tambien en las visualizaciones de exposicion.
- Regla operativa reforzada: aunque existan scripts auxiliares, los resultados importantes de analisis y exposicion deben quedar explicados y visibles tambien en notebooks de Jupyter Lab dentro del flujo del proyecto.
- Regla operativa reforzada: el entorno esperado para ejecutar notebooks y utilidades del proyecto sigue siendo Miniconda con el ambiente `armd-ai`.

## Estructura creada

Se crearon estas carpetas en la raiz del proyecto:
- `modelo/1.ANALIZAR-DATASET-UNIR`
- `modelo/2.VISUALIZACION-DATOS`
- `modelo/3.DATOS-PROCESADOS`
- `modelo/4.MODELADO-Y-VALIDACION`

## Entorno de trabajo

Archivo de entorno creado:
- `modelo/environment.yml`

Entorno Miniconda creado:
- `armd-ai`

Kernel Jupyter registrado:
- `Python (armd-ai)`

Nota tecnica:
- Se elimino `pyarrow` del entorno porque generaba errores de importacion con `pandas` y `scikit-learn`.
- Se instalo `xgboost` para la fase de comparacion de clasificadores.
- El entorno fue verificado con import exitoso de:
  - `pandas`
  - `numpy`
  - `matplotlib`
  - `scikit-learn`
  - `scipy`
  - `statsmodels`
  - `missingno`
  - `jupyterlab`
  - `xgboost`

## Notebook principal creado

Ruta:
- `modelo/1.ANALIZAR-DATASET-UNIR/01_analisis_limpieza_visualizacion_armd.ipynb`

Objetivo del notebook:
- cargar el dataset con cuidado de memoria
- filtrar `STAPHYLOCOCCUS AUREUS`
- unir tablas clave
- analizar el estado inicial
- limpiar y normalizar
- comparar antes vs despues
- guardar resultados procesados
- ya existen graficas basicas guardadas en `modelo/2.VISUALIZACION-DATOS`

## Generador de graficas para exposicion

Archivo creado:
- `modelo/2.VISUALIZACION-DATOS/generar_graficas_exposicion.py`

Salida generada:
- carpeta `modelo/2.VISUALIZACION-DATOS/EXPOSICION`

Graficas creadas:
- `expo_01_resumen_limpieza.png`
- `expo_02_objetivo_antes_despues.png`
- `expo_03_nulos_antes_despues.png`
- `expo_04_decision_variables.png`
- `expo_05_boxplot_median_wbc.png`
- `expo_06_boxplot_median_cr.png`
- `expo_07_top_antibioticos.png`
- `expo_08_cultivo_vs_susceptibilidad.png`
- `expo_09_edad_vs_susceptibilidad.png`
- `expo_10_entorno_hospitalario.png`

Objetivo:
- dejar un paquete de imagenes listo para explicar limpieza, calidad, seleccion de variables y comportamiento de datos en una exposicion corta o un miniprototipo frontend

## Notebook de exposicion visual

Archivo creado:
- `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`

Objetivo:
- mostrar las graficas de exposicion dentro de Jupyter Lab
- dejar explicacion por grafica: que muestra, por que da ese resultado y que mensaje sirve para defender en la exposicion
- mantener la documentacion visual alineada con la regla del proyecto de trabajar y explicar dentro de notebooks

## Complemento de faltantes semanticos

Archivos creados:
- `modelo/2.VISUALIZACION-DATOS/generar_reporte_faltantes_semanticos.py`
- `modelo/1.ANALIZAR-DATASET-UNIR/02_complemento_faltantes_semanticos_armd.ipynb`
- `modelo/3.DATOS-PROCESADOS/reporte_faltantes_semanticos.csv`
- `modelo/2.VISUALIZACION-DATOS/EXPOSICION/expo_11_faltantes_semanticos.png`

Hallazgo clave:
- `comparacion_nulos.csv` solo refleja `NaN` tecnicos y puede ocultar ausencia informativa cuando una variable fue rellenada con categorias como `SIN_REGISTRO` o `SIN_REGLA`

Ejemplos confirmados:
- `procedure_name`: `0%` de `NaN` reales, pero `65.53%` de faltante semantico
- `antibiotic_class`: `0%` de `NaN` reales, pero `29.77%` de faltante semantico
- `prior_organism`, `implied_susceptibility` y `Rule`: `0%` de `NaN` reales, pero `100%` de faltante semantico

Decision metodologica nueva:
- para exposicion y discusion tecnica, no volver a interpretar `0%` de nulos como `100%` de cobertura real sin revisar antes el reporte de faltantes semanticos

## Guia corta de exposicion del dataset

Archivo creado:
- `GUIA_CORTA_EXPOSICION_DATASET.md`

Objetivo:
- tener un guion corto y directo para explicar el flujo desde el dataset original hasta las bases finales de modelado sin depender de leer el documento largo

## Conclusión registrada sobre comorbilidades

- el archivo `microbiology_cultures_comorbidity.csv` es clinicamente valioso y si puede considerarse importante desde la perspectiva del dataset
- aun asi, no se uso en esta primera iteracion porque:
  - no era parte obligatoria del set de variables definido en el alcance actual
  - pesa cerca de `20 GB`
  - excedia la complejidad razonable para la RAM disponible y para la primera version del pipeline
  - requeria una ingenieria de agregacion propia antes de poder entrar al modelo
- conclusion practica: importante clinicamente, pero no prioritario ni conveniente para la primera iteracion del proyecto

### Hallazgos tecnicos adicionales al revisar el CSV de comorbilidades

- estructura detectada:
  - columnas: `anon_id`, `pat_enc_csn_id_coded`, `order_proc_id_coded`, `order_time_jittered_utc`, `comorbidity_component`, `comorbidity_component_start_days_culture`, `comorbidity_component_end_days_culture`
- en una muestra controlada de `200,000` filas:
  - `443` componentes unicos
  - promedio de `1.5` filas por orden
  - `98.25%` de `comorbidity_component_end_days_culture` vacio
- al cruzarlo por streaming con la cohorte limpia de `S. aureus`:
  - `8,342` de `8,414` ordenes si tienen match con comorbilidades
  - `2,474,947` filas coincidentes
  - promedio de `296.69` filas por orden
  - maximo de `7,751` filas para una sola orden
  - `499` componentes unicos

### Interpretacion

- si hay cobertura alta y por eso la tabla podria aportar señal clinica
- pero la granularidad es demasiado explosiva para entrar directa al modelo
- la tabla requeriria una fase propia de agregacion, reduccion y control de ruido
- algunos componentes muy frecuentes como `Cystic fibrosis` o `Invalid PDX` sugieren que hay que auditar calidad semantica antes de usarla
- cuantificacion mas fina en la cohorte limpia de `S. aureus`:
  - `498` componentes unicos globales
  - `8,327` ordenes con al menos un componente no nulo
  - `4,840` pacientes con al menos un componente no nulo
  - promedio de `30.99` componentes unicos por orden
  - percentil 95 de `86` componentes unicos por orden
  - maximo de `182` componentes unicos en una sola orden
  - promedio de `31.72` componentes unicos por paciente
  - percentil 95 de `90` componentes unicos por paciente
  - maximo de `182` componentes unicos en un paciente
- `0%` de nulo en `comorbidity_component`
- `0%` de nulo en `comorbidity_component_start_days_culture`
- `98.56%` de nulo en `comorbidity_component_end_days_culture`

## Organizacion de CSV procesados

Archivos creados:
- `modelo/3.DATOS-PROCESADOS/organizar_csv_procesados.py`
- `modelo/3.DATOS-PROCESADOS/07_organizacion_csv_procesados.ipynb`
- `modelo/3.DATOS-PROCESADOS/INDICE_CSV_PROCESADOS.md`

Subcarpetas creadas:
- `modelo/3.DATOS-PROCESADOS/01_BASE_LIMPIA`
- `modelo/3.DATOS-PROCESADOS/02_ANALISIS_Y_CALIDAD`
- `modelo/3.DATOS-PROCESADOS/03_MODELOS_BASE_Y_AMPLIADA`
- `modelo/3.DATOS-PROCESADOS/04_MODELOS_EXPERIMENTALES`

Decision tecnica:
- no se movieron ni se borraron los CSV originales de la raiz de `modelo/3.DATOS-PROCESADOS`
- se crearon copias organizadas por etapa para no romper rutas ya usadas en notebooks y documentos

## Notebook piloto de comorbilidades

Archivo creado:
- `modelo/1.ANALIZAR-DATASET-UNIR/04_piloto_comorbilidades_armd.ipynb`

Objetivo:
- dejar documentada en notebook la evaluacion inicial del archivo de comorbilidades
- registrar por que no entra directo al modelo
- dejar lista la idea de una futura estrategia `multihot` reducida y auditada

## Notebook de modelado creado

Ruta:
- `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`

Objetivo del notebook:
- cargar la base limpia
- hacer una particion temporal train / validation / test
- preparar variables numericas y categoricas
- comparar varios clasificadores
- evaluar metricas multiclase
- guardar resultados del experimento

Modelos incluidos:
- `DummyClassifier`
- `LogisticRegression`
- `KNeighborsClassifier`
- `DecisionTreeClassifier`
- `RandomForestClassifier`
- `XGBoost`

Nota:
- Este notebook fue creado y validado como JSON, pero todavia no fue ejecutado completo.
- Esta documentado en espanol y trae explicaciones cortas sobre `Pipeline`, `ColumnTransformer`, escalado, imputacion e hiperparametros base.

## Datasets finales de modelado creados

Archivos:
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_base.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_ampliada.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_abx.csv`
- `modelo/3.DATOS-PROCESADOS/catalogo_clases_antibioticas_multihot.csv`

Resumen:
- version `base`: variables mas solidas para una primera corrida
- version `ampliada`: version base + variables catalogadas como `usar con cuidado`
- el manifiesto indica que columnas son identificadores, cual es temporal para el split, cuales son predictoras y cual es la variable objetivo
- version `multihot_abx`: version experimental que conserva la base, mantiene `ordering_mode`, `procedure_name`, `median_wbc` y `median_cr`, y reemplaza la exposicion antibiotica simple por 18 columnas binarias `exp_prev_*`

## Tablas del dataset ya revisadas

Se validaron columnas reales de:
- `microbiology_cultures_cohort.csv`
- `microbiology_cultures_demographics.csv`
- `microbiology_cultures_ward_info.csv`
- `microbiology_cultures_labs.csv`
- `microbiology_cultures_antibiotic_class_exposure.csv`
- `microbiology_culture_prior_infecting_organism.csv`
- `microbiology_cultures_priorprocedures.csv`
- `microbiology_cultures_implied_susceptibility.csv`
- `implied_susceptibility_rules.csv`
- `microbiology_cultures_nursing_home_visits.csv`

Hallazgos importantes:
- El valor del organismo objetivo aparece como `STAPHYLOCOCCUS AUREUS`.
- En el archivo principal hay mas de 2 millones de filas.
- El subconjunto de `STAPHYLOCOCCUS AUREUS` supera las 100 mil filas.
- El dataset usa muchos valores `Null`.
- Existe un typo real en una columna del dataset:
  - origen: `prior_infecting_organism_days_to_culutre`
  - en el notebook se normaliza a: `prior_infecting_organism_days_to_culture`

## Skills acordadas para el proyecto

Antes de comenzar cada bloque de trabajo, se indicara la skill usada.

Uso previsto:
- `DATA_ENGINEER`: carga, estructura, uniones, memoria, procesamiento.
- `DATA_ANALYST`: analisis exploratorio, visualizaciones, interpretacion.
- `DATA_SCIENTIST`: criterio de limpieza, validacion de variables y preparacion para modelado.

Formato acordado con el usuario:
- `Skill en uso: DATA_ENGINEER`
- `Skill en uso: DATA_ANALYST`
- `Skill en uso: DATA_SCIENTIST`

## Que falta por hacer

Pendiente inmediato:
- decidir si el notebook de modelado arranca comparando:
  - `dataset base`
  - `dataset ampliado`
- ajustar el notebook de modelado para leer la base final correspondiente
- correr la primera comparacion de clasificadores sin tuning fino
- documentar en el notebook de modelado la justificacion tecnica y los posibles sesgos de la variable de exposicion antibiotica previa
- decidir si la primera corrida del modelado se mantiene con `antibiotic_class + time_to_culturetime` o si se abre una segunda base experimental con codificacion multihot por clases antibioticas previas
- si se crea una segunda base experimental, documentar que la exposicion antibiotica previa se represento solo con multihot por clase y sin variables temporales por decision metodologica del proyecto
- ajustar el notebook de modelado para poder leer y comparar tambien `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx.csv`
- El notebook `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb` ya fue ajustado para aceptar `VERSION_DATASET="multihot_abx"` ademas de `base` y `ampliada`
- revisar visualmente la carpeta `modelo/2.VISUALIZACION-DATOS/EXPOSICION` para elegir las mejores graficas de la presentacion
- si hace falta, crear una seleccion final de 5 a 7 laminas visuales con narrativa corta por grafica

Pendiente despues:
- afinar conclusiones del analisis
- decidir si se corrige `prior_organism` desde el notebook de limpieza
- decidir si `nursing_home_visit_culture` entra en una segunda iteracion del modelo
- evaluar tecnicas de balanceo o ajuste de hiperparametros
- comparar resultados entre clasificadores

## Comandos utiles para retomar

Abrir terminal Miniconda y ejecutar:

```bash
cd "D:\6TO-SEMESTRE\Sistemas Inteligentes\2doCorte\Proyecto"
conda activate armd-ai
jupyter lab
```

Notebook a abrir:

```text
1.ANALIZAR-DATASET-UNIR/01_analisis_limpieza_visualizacion_armd.ipynb
```

Notebook siguiente:

```text
4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb
```

## Ultimo punto seguro de reanudacion

El proyecto ya tiene:
- estructura base creada
- entorno configurado
- kernel de Jupyter disponible
- notebook principal creado
- bitacora persistente creada

Siguiente accion recomendada:
- ajustar el notebook de modelado para comparar primero la version base y luego la version ampliada
- despues de eso, comparar la base `multihot_abx` como experimento metodologico adicional
- en paralelo, preparar el hilo narrativo de la exposicion con las nuevas graficas de `modelo/2.VISUALIZACION-DATOS/EXPOSICION`

## Cierre de sesion 2026-05-18

### Resumen corto de lo hecho en esta sesion

- se reviso si la exposicion antibiotica previa podia representarse mejor y se confirmo que una misma orden puede tener multiples clases antibioticas previas
- se descarto usar recencia por decision metodologica del proyecto
- se construyo una base experimental nueva con exposicion antibiotica multihot por clase:
  - `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx.csv`
- se creo su manifiesto:
  - `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_abx.csv`
- se ajusto el notebook de modelado para soportar `VERSION_DATASET="multihot_abx"`
- se creo un paquete visual para exposicion en:
  - `modelo/2.VISUALIZACION-DATOS/EXPOSICION`
- se creo un notebook de exposicion visual:
  - `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`
- se detecto que `comparacion_nulos.csv` solo mide `NaN` tecnicos y no siempre refleja cobertura informativa real
- para resolver eso se creo:
  - `modelo/3.DATOS-PROCESADOS/reporte_faltantes_semanticos.csv`
  - `modelo/2.VISUALIZACION-DATOS/EXPOSICION/expo_11_faltantes_semanticos.png`
  - `modelo/1.ANALIZAR-DATASET-UNIR/02_complemento_faltantes_semanticos_armd.ipynb`

### Aclaracion metodologica importante

- `porcentaje_na_real`: porcentaje de celdas realmente vacias como `NaN`
- `porcentaje_faltante_semantico`: porcentaje de celdas que no estan vacias tecnicamente, pero contienen etiquetas como `SIN_REGISTRO` o `SIN_REGLA`
- `porcentaje_cobertura_real`: porcentaje de celdas que si traen informacion util real

Formula conceptual:
- `cobertura_real = 100 - na_real - faltante_semantico`

Ejemplo:
- si `procedure_name` tiene `0%` de `NaN` pero `65.53%` de `SIN_REGISTRO`, entonces su `porcentaje_cobertura_real` es `34.47%`

### Donde quedamos realmente

Fase actual:
- `FASE 6 - Preparacion metodologica del modelado`

Estado real:
- ya hay 3 bases listas para comparar:
  - `base`
  - `ampliada`
  - `multihot_abx`
- ya hay material visual suficiente para exposicion
- ya se corrio completo el notebook de modelado para la version `base`
- aun falta correr y comparar `ampliada` y `multihot_abx`

### Resultado actual de la primera corrida base

Archivos generados:
- `modelo/4.MODELADO-Y-VALIDACION/resultados_validacion_modelos_base.csv`
- `modelo/4.MODELADO-Y-VALIDACION/resultado_test_mejor_modelo_base.csv`

Hallazgo inicial:
- en la version `base`, `DecisionTree` fue el mejor modelo segun `balanced_accuracy` en validacion
- metricas principales en validacion para `DecisionTree`:
  - `accuracy`: `0.5838`
  - `balanced_accuracy`: `0.6165`
  - `f1_macro`: `0.4260`
- metricas principales en test para `DecisionTree`:
  - `accuracy`: `0.5867`
  - `balanced_accuracy`: `0.6227`
  - `f1_macro`: `0.4197`

Lectura metodologica:
- varios modelos tuvieron `accuracy` alta por el desbalance de clases, pero no superaron a `DecisionTree` en `balanced_accuracy`
- esto refuerza que la metrica principal no debe ser solo `accuracy`

### Primera iteracion recomendada al retomar

Objetivo:
- correr y documentar la primera comparacion real de modelos sin tuning fino

Actividades a terminar:
1. abrir Jupyter Lab en el entorno `armd-ai`
2. ejecutar `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb` con `VERSION_DATASET="base"`
3. guardar y revisar metricas de validacion y prueba
4. repetir con `VERSION_DATASET="ampliada"`
5. repetir con `VERSION_DATASET="multihot_abx"`
6. comparar cual base se comporta mejor:
   - rendimiento general
   - comportamiento en clase `Intermediate`
   - interpretabilidad metodologica
7. decidir cual base sera la principal del proyecto en esta etapa

### Actividades paralelas para la exposicion

1. revisar la carpeta `modelo/2.VISUALIZACION-DATOS/EXPOSICION`
2. elegir 5 a 7 graficas finales
3. usar `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb` para leer las explicaciones
4. explicar en la exposicion la diferencia entre:
   - `comparacion_nulos.csv`
   - `reporte_faltantes_semanticos.csv`

## Actualizacion 2026-05-19 - comorbilidades multihot y cinco datasets finales de modelado

### Cambios ejecutados

- se implemento el script:
  - `modelo/4.MODELADO-Y-VALIDACION/construir_datasets_comorb.py`
- se genero y documento en notebook la construccion de datasets con comorbilidades:
  - `modelo/4.MODELADO-Y-VALIDACION/06_construccion_datasets_comorb.ipynb`
- se actualizo el notebook piloto de comorbilidades para reflejar que el proyecto ya no tiene solo `3` variantes de modelado
- se actualizo el notebook de modelado para aceptar tambien:
  - `VERSION_DATASET="multihot_comorb"`
  - `VERSION_DATASET="multihot_abx_comorb"`
- se actualizo la organizacion de CSV procesados para incluir las nuevas salidas

### Nuevos archivos generados

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_abx_comorb.csv`
- `modelo/3.DATOS-PROCESADOS/catalogo_grupos_comorbilidades.csv`
- `modelo/3.DATOS-PROCESADOS/cobertura_grupos_comorbilidades.csv`

### Estado actual de los datasets de modelado

Ahora hay `5` CSV candidatos para entrenar o comparar modelos:

1. `armd_s_aureus_base_modelado_base.csv`
2. `armd_s_aureus_base_modelado_ampliada.csv`
3. `armd_s_aureus_base_modelado_multihot_abx.csv`
4. `armd_s_aureus_base_modelado_multihot_comorb.csv`
5. `armd_s_aureus_base_modelado_multihot_abx_comorb.csv`

Dimensiones verificadas:

- `base`: `82319` filas, `13` columnas
- `ampliada`: `82319` filas, `19` columnas
- `multihot_abx`: `82319` filas, `35` columnas
- `multihot_comorb`: `82319` filas, `25` columnas
- `multihot_abx_comorb`: `82319` filas, `43` columnas

### Grupos multihot de comorbilidad usados en esta primera version

Se usaron `8` grupos binarios:

- `comorb_congestive_heart_failure`
- `comorb_organ_transplant_status`
- `comorb_diabetes_any`
- `comorb_solid_tumor_non_metastatic`
- `comorb_chronic_pulmonary_any`
- `comorb_renal_failure`
- `comorb_pancreatic_disorder`
- `comorb_sinusitis`

Coberturas verificadas:

- `comorb_congestive_heart_failure`: `89.65%`
- `comorb_organ_transplant_status`: `7.85%`
- `comorb_diabetes_any`: `29.72%`
- `comorb_solid_tumor_non_metastatic`: `8.95%`
- `comorb_chronic_pulmonary_any`: `28.63%`
- `comorb_renal_failure`: `13.48%`
- `comorb_pancreatic_disorder`: `24.13%`
- `comorb_sinusitis`: `64.62%`

### Organizacion de archivos

- `modelo/3.DATOS-PROCESADOS/INDICE_CSV_PROCESADOS.md` ahora deja explicitos los `5` CSV de entrenamiento/modelado
- `modelo/3.DATOS-PROCESADOS/04_MODELOS_EXPERIMENTALES` ya contiene las copias organizadas de:
  - `multihot_abx`
  - `multihot_comorb`
  - `multihot_abx_comorb`

### Siguiente paso recomendado

- correr `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb` con:
  - `VERSION_DATASET="ampliada"`
  - `VERSION_DATASET="multihot_abx"`
  - `VERSION_DATASET="multihot_comorb"`
  - `VERSION_DATASET="multihot_abx_comorb"`
- comparar si agregar comorbilidades mejora realmente `balanced_accuracy`, `f1_macro` y el comportamiento de la clase `Intermediate`

### Documentacion narrativa actualizada

Tambien se actualizaron los documentos explicativos para que no queden desfasados frente a los nuevos CSV:

- `PROCEDIMIENTO_DATASET_A_MODELADO.md`
- `GUIA_CORTA_EXPOSICION_DATASET.md`

Correccion importante en esos documentos:

- antes describian comorbilidades como algo totalmente excluido
- ahora describen la situacion correcta:
  - no se uso el archivo crudo de `20 GB`
  - si se construyeron dos variantes experimentales reducidas con grupos `multihot`

### Resumen corto para retomar rapido

Se creo tambien un resumen compacto de las `5` corridas principales del modelo:

- `RESUMEN_ENTRENAMIENTOS_MODELO.md`
- `modelo/3.DATOS-PROCESADOS/resumen_entrenamientos_modelo.csv`

Ese resumen deja claro:

- que variable se predice
- que variables entran en cada entrenamiento
- cuantas corridas principales se van a hacer

### Revision de consistencia 2026-05-19

Se detectaron y aclararon dos puntos que podian confundir:

1. `time_to_culturetime`
- en `reporte_faltantes_semanticos.csv` aparece con `70.23%` de cobertura real
- eso es correcto
- no se excluyo por mala calidad
- se excluyo por decision metodologica: no usar recencia en la estrategia final de exposicion antibiotica previa

2. `catalogo_grupos_comorbilidades.csv`
- tiene `11` filas
- pero eso no significa `11` columnas finales
- el catalogo es un mapeo componente→grupo
- el numero correcto de variables binarias finales `comorb_*` es `8`

Archivos creados para dejar esto explicito:

- `ACLARACIONES_CONSISTENCIA_MODELO.md`
- `modelo/3.DATOS-PROCESADOS/resumen_grupos_comorbilidades.csv`

### Guia para segundo integrante

Se creo tambien una guia de onboarding para que otra persona pueda estudiar el proyecto sin revisar todo al azar:

- `GUIA_ONBOARDING.md`

La guia prioriza:

- documentos cortos primero
- notebooks centrales despues
- CSV clave como apoyo

### Actualizacion de graficas para exposicion y frontend

Se reforzo la capa visual porque hacia falta mostrar no solo conteos y boxplots, sino tambien comportamiento o tendencia de los datos.

Cambios hechos:

- se actualizo `modelo/2.VISUALIZACION-DATOS/generar_graficas_exposicion.py`
- se regeneraron las imagenes de `modelo/2.VISUALIZACION-DATOS/EXPOSICION`
- se actualizo `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`

Nuevas graficas agregadas:

- `expo_12_tendencia_edad_resistencia.png`
- `expo_13_tendencia_wbc_resistencia.png`
- `expo_14_tendencia_cr_resistencia.png`

Idea metodologica:

- para este problema no conviene hablar de una recta de regresion clasica general sobre la variable objetivo porque `susceptibility` es categorica
- es mas defendible mostrar tendencias de resistencia por grupos de edad y por bins de variables numericas

Seleccion recomendada para frontend:

- `expo_01_resumen_limpieza`
- `expo_02_objetivo_antes_despues`
- `expo_04_decision_variables`
- `expo_08_cultivo_vs_susceptibilidad`
- `expo_11_faltantes_semanticos`
- `expo_12_tendencia_edad_resistencia`
- `expo_13_tendencia_wbc_resistencia`

### Contexto del frontend React + Vite

Se creo un documento especifico para guiar la implementacion del miniprototipo frontend:

- `FRONTEND_ARCHITECTURE.md`

Ese archivo define:

- objetivo del frontend
- tipo de prototipo a construir
- secciones recomendadas
- arquitectura de carpetas para `React + Vite`
- componentes sugeridos
- graficas que si deben entrar
- siguiente paso recomendado para implementacion

### Ajuste nuevo de arquitectura del proyecto

Se decidio que el frontend no sera de una sola pagina, sino de dos:

- `/` para graficas y narrativa visual
- `/modelos` para modelos probados y scores

Tambien se dejo definida una estructura recomendada del proyecto:

- `frontend/`
- `backend/`
- `modelo/`

Decision importante:

- no se recomienda mezclar `backend` y `modelo`
- `backend` sera `FastAPI`
- `modelo` debe concentrar notebooks, scripts y datos del trabajo analitico

Archivos creados para dejar esto listo:

- `FRONTEND_ARCHITECTURE.md`
- `frontend/README.md`
- `backend/README.md`
- `modelo/README.md`

### Reorganizacion fisica del repositorio

Se aplico ya la migracion real del proyecto para dejar la estructura:

- `frontend/`
- `backend/`
- `modelo/`

Se movieron dentro de `modelo/`:

- `data/`
- `1.ANALIZAR-DATASET-UNIR/`
- `2.VISUALIZACION-DATOS/`
- `3.DATOS-PROCESADOS/`
- `4.MODELADO-Y-VALIDACION/`
- `environment.yml`

Tambien se actualizaron los documentos de raiz para que apunten a rutas bajo `modelo/`.

### Backend con RAG

Se dejo documentado que el backend en `FastAPI` si puede alojar un servicio RAG.

Archivos nuevos:

- `BACKEND_ARCHITECTURE.md`

Decision arquitectonica:

- `modelo/` produce conocimiento y artefactos
- `backend/` consume y expone servicios
- el RAG debe vivir en `backend/`, no mezclado con notebooks

### Refuerzo de regla notebook-first

Se corrigieron procesos que todavia dependian demasiado de scripts `.py` sueltos.

Cambios:

- `modelo/1.ANALIZAR-DATASET-UNIR/02_complemento_faltantes_semanticos_armd.ipynb` ahora ejecuta la generacion del reporte desde notebook
- `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb` ahora regenera las imagenes desde notebook
- se creo `modelo/4.MODELADO-Y-VALIDACION/05_construccion_dataset_multihot_abx.ipynb` para que la variante `multihot_abx` tambien quede ejecutable desde notebook

Objetivo:

- que otra persona no tenga que correr manualmente un `.py` por fuera para reproducir los artefactos principales

### Checkpoint guardado antes de regeneracion manual

Estado guardado a solicitud del usuario:

- la estructura monorepo ya quedo organizada en:
  - `frontend/`
  - `backend/`
  - `modelo/`
- la documentacion principal ya apunta a rutas bajo `modelo/`
- el backend ya tiene contexto arquitectonico para `FastAPI` y para un futuro servicio `RAG`
- el frontend ya tiene contexto arquitectonico para `React + Vite` con dos paginas:
  - `/`
  - `/modelos`
- los notebooks importantes ya quedaron reforzados para una ejecucion mas notebook-first
- el usuario va a ejecutar manualmente los procesos de regeneracion

### Siguiente paso obligatorio despues de la ejecucion manual

Cuando el usuario termine de ejecutar todo manualmente, la siguiente tarea sera:

1. comparar los archivos generados contra lo esperado
2. verificar que los CSV procesados quedaron bien
3. verificar que las imagenes quedaron bien
4. verificar que la organizacion en subcarpetas se haya reconstruido correctamente
5. detectar cualquier artefacto faltante o inconsistente

### Archivos clave a verificar despues

- `modelo/3.DATOS-PROCESADOS/`
- `modelo/3.DATOS-PROCESADOS/01_BASE_LIMPIA/`
- `modelo/3.DATOS-PROCESADOS/02_ANALISIS_Y_CALIDAD/`
- `modelo/3.DATOS-PROCESADOS/03_MODELOS_BASE_Y_AMPLIADA/`
- `modelo/3.DATOS-PROCESADOS/04_MODELOS_EXPERIMENTALES/`
- `modelo/2.VISUALIZACION-DATOS/EXPOSICION/`

### Numeracion explicita de notebooks

Se renombraron los notebooks principales para que el orden quede visible desde el nombre del archivo:

1. `modelo/1.ANALIZAR-DATASET-UNIR/01_analisis_limpieza_visualizacion_armd.ipynb`
2. `modelo/1.ANALIZAR-DATASET-UNIR/02_complemento_faltantes_semanticos_armd.ipynb`
3. `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`
4. `modelo/1.ANALIZAR-DATASET-UNIR/04_piloto_comorbilidades_armd.ipynb`
5. `modelo/4.MODELADO-Y-VALIDACION/05_construccion_dataset_multihot_abx.ipynb`
6. `modelo/4.MODELADO-Y-VALIDACION/06_construccion_datasets_comorb.ipynb`
7. `modelo/3.DATOS-PROCESADOS/07_organizacion_csv_procesados.ipynb`
8. `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`

Tambien se recupero el notebook de exposicion visual desde su checkpoint para no perderlo al aplicar esta numeracion.

### Correccion del notebook 03

Se reviso `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb` porque estaba fallando con `FileNotFoundError`.

Hallazgo:

- el notebook habia quedado restaurado desde un checkpoint viejo
- ya no tenia la celda notebook-first para regenerar las imagenes
- faltaba el script `modelo/2.VISUALIZACION-DATOS/generar_graficas_exposicion.py`

Correcciones aplicadas:

- se recreo `modelo/2.VISUALIZACION-DATOS/generar_graficas_exposicion.py`
- el notebook `03_exposicion_analisis_visual_armd.ipynb` ahora ejecuta ese script desde una celda usando el mismo interprete del kernel
- despues de regenerar, el notebook lista las imagenes `expo_*.png` encontradas

Limitacion de validacion desde terminal:

- no fue posible ejecutar la prueba completa fuera de Jupyter porque el `python` disponible en terminal no tiene `matplotlib`
- tampoco estuvo disponible `conda` en la sesion de shell para invocar explicitamente `armd-ai`

Conclusion:

- la correccion estructural del notebook `03` ya quedo hecha
- la validacion final debe hacerse corriendolo desde JupyterLab con el kernel `armd-ai`, que es el entorno oficial del proyecto

### Ajuste final notebook-first del notebook 03

Despues del error `CalledProcessError` reportado por el usuario, se elimino la dependencia de `subprocess` dentro de `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`.

Ahora:

- el notebook genera directamente las graficas `expo_01` a `expo_11`
- usa los CSV reales de `modelo/3.DATOS-PROCESADOS/`
- corrige internamente diferencias de nombres de columnas como `antes/despues` y `frecuencia`

Motivo:

- el usuario requiere que la reproduccion principal quede en notebooks
- no debe depender de correr un `.py` manual ni de que `subprocess` invoque correctamente otro archivo

### Correccion del notebook 04

Se reviso `modelo/1.ANALIZAR-DATASET-UNIR/04_piloto_comorbilidades_armd.ipynb`.

Error detectado:

- el notebook intentaba leer `resumen_comorbilidades_piloto.csv`
- y `top_comorbilidades_piloto.csv`
- pero esos artefactos no existian en `modelo/3.DATOS-PROCESADOS/`

Correccion aplicada:

- el notebook ahora genera esos dos CSV directamente si no existen
- la reconstruccion se hace por streaming sobre `modelo/data/microbiology_cultures_comorbidity.csv`
- usa como filtro las ordenes de `armd_s_aureus_base_limpia.csv`

Resultado esperado:

- al correr el notebook `04` desde JupyterLab, primero reconstruye los artefactos faltantes
- luego muestra el resumen cuantitativo y el top de componentes sin depender de un `.py` externo

### Pulido del notebook 08

Se ajusto `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb` para dejarlo mas coherente con la estructura final del proyecto.

Cambios:

- las rutas ahora detectan mejor si el notebook se esta ejecutando desde `modelo/4.MODELADO-Y-VALIDACION/` o desde `modelo/`
- se corrigio el texto que todavia hablaba de `tres` datasets y ahora ya habla de `cinco`
- la matriz de confusion ahora se guarda con sufijo de version:
  - `10_matriz_confusion_mejor_modelo_<version>.png`
- se agrego una seccion final explicando como cerrar la comparacion entre las 5 corridas

Estado:

- el notebook `08` ya esta bastante cerca de considerarse estructuralmente completo
- sigue faltando la validacion funcional final corriendolo con cada una de las 5 variantes del dataset

### Correccion de errores iniciales del notebook 08

Se revisaron los errores del `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`.

Causa raiz encontrada:

- el notebook todavia intentaba leer `armd_s_aureus_base_modelado_base.csv` desde una ruta valida, pero el archivo no existia en ese momento
- al fallar esa lectura, todo lo siguiente caia en cascada con `NameError` (`df`, `df_train`, `modelos`, `df_resultados_val`, etc.)

Correccion aplicada:

- el notebook ahora detecta mejor `RUTA_PROYECTO`
- si faltan `armd_s_aureus_base_modelado_base.csv` o `armd_s_aureus_base_modelado_ampliada.csv`, los reconstruye automaticamente desde `armd_s_aureus_base_limpia.csv`

Objetivo:

- que el notebook no dependa de que esos dos CSV ya existan manualmente antes de correrlo

### Apoyo para frontend y entendimiento del proyecto

Se agregaron dos archivos de apoyo:

- `frontend/TEXTOS_GRAFICAS_FRONTEND.md`
- `GLOSARIO.md`

Contenido:

- `TEXTOS_GRAFICAS_FRONTEND.md` deja el texto corto sugerido debajo de cada una de las 7 graficas oficiales del frontend
- `GLOSARIO.md` traduce y explica terminos del proyecto, variables en ingles y conceptos de modelado

Motivo:

- el usuario necesita apoyo para exposicion
- varios terminos del proyecto no eran obvios en ingles


