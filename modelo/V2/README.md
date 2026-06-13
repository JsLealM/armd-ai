# V2 - Pipeline Multibacteria

Esta carpeta contiene la segunda version del trabajo analitico del proyecto `ARMD-AI`.

## Objetivo

Construir una version mejorada del pipeline usando multiples bacterias y mejores estrategias de limpieza, preprocesamiento e ingenieria de variables.

La variable objetivo de V2 queda como clasificacion binaria:

- `susceptibility = Susceptible`
- `susceptibility = Resistant`

La clase `Intermediate` se excluye de V2 para tener un planteamiento mas estable y clinicamente mas claro.

## Diferencia frente a V1

La V1 queda conservada en las carpetas originales de `modelo/`:

- `1.ANALIZAR-DATASET-UNIR/`
- `2.VISUALIZACION-DATOS/`
- `3.DATOS-PROCESADOS/`
- `4.MODELADO-Y-VALIDACION/`

La V1 estaba centrada principalmente en:

- `STAPHYLOCOCCUS AUREUS`

La V2 se enfocara en:

- multiples bacterias frecuentes
- nuevas variables clinicas
- mejor preprocesamiento
- validacion mas robusta

## Organismos candidatos iniciales

Para la primera version multibacteria se recomiendan:

1. `ESCHERICHIA COLI`
2. `KLEBSIELLA PNEUMONIAE`
3. `STAPHYLOCOCCUS AUREUS`
4. `PROTEUS MIRABILIS`
5. `ENTEROCOCCUS SPECIES`
6. `PSEUDOMONAS AERUGINOSA`

## Estructura

```text
V2/
  01_EXPLORACION_MULTIBACTERIA/
  02_CONSTRUCCION_DATASET/
  03_VISUALIZACION/
  04_MODELADO/
  05_RESULTADOS/
  DATOS_PROCESADOS/
  GRAFICAS/
```

## Notebooks esperados

1. `01_EXPLORACION_MULTIBACTERIA/01_exploracion_multibacteria_armd.ipynb`
2. `02_CONSTRUCCION_DATASET/02_construccion_dataset_multibacteria.ipynb`
3. `03_VISUALIZACION/03_visualizacion_multibacteria.ipynb`
4. `04_MODELADO/04_modelado_multibacteria_armd.ipynb`

## Orden de ejecucion

Ejecutar en JupyterLab con el kernel `armd-ai`:

1. `01_exploracion_multibacteria_armd.ipynb`
2. `02_construccion_dataset_multibacteria.ipynb`
3. `03_visualizacion_multibacteria.ipynb`
4. `04_modelado_multibacteria_armd.ipynb`

## Datasets que construye V2

El notebook `02` genera tres datasets principales:

- `07_dataset_v2_multibacteria_completo.csv`
- `08_dataset_v2_multibacteria_balanceado_clase.csv`
- `09_dataset_v2_multibacteria_balanceado_organismo_clase.csv`

El dataset recomendado para el entrenamiento inicial es:

- `09_dataset_v2_multibacteria_balanceado_organismo_clase.csv`

Ese dataset reduce el dominio de `ESCHERICHIA COLI` y controla mejor la distribucion por bacteria y clase objetivo.

El notebook `02` tambien genera imagenes inmediatamente despues del preprocesamiento:

- `GRAFICAS/07_v2_preprocesamiento_cambio_susceptibility.png`
- `GRAFICAS/08_v2_preprocesamiento_cambio_organismos.png`
- `GRAFICAS/09_v2_preprocesamiento_faltantes_clinicos.png`

Estas imagenes sirven para verificar visualmente que el preprocesamiento produjo un cambio real en la distribucion de clases, organismos y faltantes clinicos.

## Variables principales de V2

V2 usa:

- `organism`
- `antibiotic`
- `culture_description`
- `age`
- `gender`
- `hosp_ward_*`
- `adi_score`
- `adi_state_rank`
- signos vitales seleccionados
- laboratorios seleccionados
- exposicion antibiotica previa `exp_prev_*`
- comorbilidades reducidas `comorb_*`

La exposicion antibiotica previa `exp_prev_*` es obligatoria en V2. El notebook `04` valida que esas columnas existan antes de entrenar.

## Diagnostico de variables

El notebook `03` revisa:

- nulos
- cardinalidad
- correlacion numerica
- multicolinealidad con VIF
- decision preliminar de variables

El notebook `04` usa esas decisiones para excluir variables no recomendadas.

## Modelado

El notebook `04` prueba varios modelos:

- Logistic Regression
- Linear SVM (`LinearSVC`)
- SGD lineal
- KNN con reduccion SVD
- Complement Naive Bayes
- Gaussian Naive Bayes con reduccion SVD
- Decision Tree
- Random Forest
- Extra Trees
- AdaBoost con arbol base
- Gradient Boosting clasico
- HistGradientBoosting
- MLP con reduccion SVD
- XGBoost

Usa:

- validacion cruzada estratificada
- busqueda de hiperparametros con exactamente `200` configuraciones por cada familia de modelo
- `2800` combinaciones totales entre las 14 familias de modelos
- `8400` fits internos estimados cuando se usa validacion cruzada de 3 folds
- `f1_macro` como metrica principal
- `mse` como metrica auxiliar
- CUDA para XGBoost si esta disponible, con fallback a CPU

No se activa SVM con kernel RBF completo por defecto porque, con este tamano de dataset y one-hot encoding, puede tardar demasiado o quedarse sin memoria. La alternativa incluida es `LinearSVC`, que es mas defendible para datos grandes y dispersos.

### Ejecucion en cluster

Para correr la busqueda masiva en un cluster se creo un notebook separado:

- `04_MODELADO/04B_modelado_cluster_multibacteria_armd.ipynb`

Ese notebook esta preparado para un cluster aproximado de `60` hilos y `100GB` RAM:

- `N_JOBS_GRID = 40`
- `N_JOBS_MODELO = 1`
- `N_JOBS_XGBOOST = 12`
- `CONFIGURACIONES_POR_MODELO = 200`
- `REANUDAR = True`

La salida del notebook de cluster se guarda separada en:

- `05_RESULTADOS/cluster/`
- `GRAFICAS/cluster/`

El CSV principal del cluster incluye metricas clinicas completas por modelo: `f1_macro`, `balanced_accuracy`, sensibilidad/especificidad de `Resistant`, PPV, NPV, MCC, kappa, MAE, MSE, ROC-AUC, PR-AUC, log loss y Brier score cuando el modelo soporta probabilidades.

El notebook incluye instrucciones para correrlo desde JupyterLab, terminal con `jupyter nbconvert` y un ejemplo de job `SLURM`.

Los resultados detallados de validacion cruzada se guardan por modelo y tambien en un consolidado general dentro de `05_RESULTADOS/`.

El ultimo bloque del notebook `04` deja explicito el mejor modelo final y genera graficas de:

- matriz de confusion
- ranking final de modelos
- distribucion de resultados en validacion cruzada
- metricas por organismo
- top 20 configuraciones
- importancia de variables del mejor modelo
- diagnostico de overfitting por brecha train-validacion
- comparacion de modelos base contra ajuste conservador de umbral
- curvas ROC para todos los modelos base
- curvas precision-recall para todos los modelos base

Para decision clinica no se debe mirar solo `accuracy`. El notebook `04` tambien guarda:

- `07_scores_clinicos_todos_modelos_v2_binario_balanceado_organismo_clase.csv`
- `08_diagnostico_overfitting_cv_v2_binario_balanceado_organismo_clase.csv`
- `09_scores_umbral_optimizado_v2_binario_balanceado_organismo_clase.csv`
- `10_scores_clinicos_base_vs_umbral_v2_binario_balanceado_organismo_clase.csv`

Estos archivos incluyen `f1_macro`, `balanced_accuracy`, sensibilidad de `Resistant`, especificidad, precision, recall, ROC-AUC, PR-AUC, log loss, Brier score, MCC, kappa, MAE y MSE.

## Nota de rendimiento

El bloque de comorbilidades del notebook `02` lee `microbiology_cultures_comorbidity.csv`, que pesa cerca de 20 GB.

Ese bloque puede tardar bastante, pero evita cargar el archivo completo en memoria.

## Regla de trabajo

La V2 no debe sobrescribir archivos de la V1.

Todo CSV, imagen o resultado nuevo debe guardarse dentro de:

- `modelo/V2/DATOS_PROCESADOS/`
- `modelo/V2/GRAFICAS/`
- `modelo/V2/05_RESULTADOS/`

## Fuentes de datos

La V2 sigue leyendo los CSV crudos desde:

- `modelo/data/`

Esa carpeta no se sube a GitHub porque contiene el dataset pesado.
