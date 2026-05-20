# PLAN_TRABAJO

## PANEL_DE_CONTROL

FASE_ACTIVA: `FASE 5 - Definicion de dataset final para modelado`

ESTADO_GLOBAL: `EN PROGRESO`

SUBTAREA_ACTUAL: `usar las decisiones ya aprobadas para consolidar datasets finales base y ampliado`

ULTIMO_CHECKPOINT_VALIDO: `analisis exploratorio ejecutado; verificacion final de variables cerrada; datasets de modelado base y ampliado generados`

SIGUIENTE_ACCION_OBLIGATORIA: `ajustar el notebook de modelado para comparar dataset base vs dataset ampliado`

NO_HACER_AUN:
- `no hacer tuning de hiperparametros`
- `no reincorporar variables excluidas en la primera corrida`

CRITERIO_PARA_AVANZAR_DE_FASE:
- `solo avanzar cuando exista evidencia concreta de cierre de la fase actual`

ARCHIVO_PRINCIPAL_DE_ESTA_FASE:
- `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`

## Objetivo de este plan

Este archivo define una ruta de trabajo clara para el proyecto `ARMD-AI`, de manera que cualquier sesion futura pueda retomarse sin depender de la memoria del chat.

La idea es seguir una secuencia tecnica correcta:

1. entender los datos
2. verificar calidad
3. limpiar y justificar
4. decidir variables
5. entrenar modelos
6. validar
7. comparar
8. documentar conclusiones

Este plan tambien sirve como heuristica de trabajo: antes de avanzar de fase, se verifica si la fase actual ya quedo bien cerrada.

---

## Regla general del proyecto

No saltar al modelado si antes no se resolvio:
- calidad de datos
- nulos
- ruido
- sesgo potencial
- variables inutiles o fragiles
- riesgo de `data leakage`

Regla practica:
- primero calidad
- despues modelado
- despues comparacion
- despues conclusiones

---

## FASE 0 - Contexto y organizacion

### Objetivo

Tener claro el alcance real del proyecto y la estructura de trabajo.

### Entradas

- `PROJECT_CONTEXT.md`
- `modelo/data/README.md`
- `SESSION_PROGRESS.md`

### Salidas esperadas

- alcance delimitado
- estructura de carpetas creada
- entorno configurado
- notebook base de analisis creado

### Estado actual

`COMPLETADA`

---

## FASE 1 - Analisis exploratorio inicial

### Objetivo

Entender como viene el dataset antes de tomar decisiones de limpieza o modelado.

### Tareas

1. cargar archivo principal con control de memoria
2. filtrar temprano por `STAPHYLOCOCCUS AUREUS`
3. revisar volumen total y volumen filtrado
4. revisar distribucion de `susceptibility`
5. revisar antibioticos mas frecuentes
6. revisar tipos de cultivo mas frecuentes
7. revisar nulos iniciales

### Preguntas que esta fase debe responder

- cuantos registros reales quedan para la bacteria objetivo
- que clase domina
- que tan desbalanceado esta el problema
- que variables ya muestran problemas de cobertura

### Evidencia requerida

- graficas guardadas en `modelo/2.VISUALIZACION-DATOS`
- tablas resumen en `modelo/3.DATOS-PROCESADOS`

### Estado actual

`COMPLETADA`

---

## FASE 2 - Construccion de base analitica unificada

### Objetivo

Unir solo las tablas necesarias para las variables del proyecto, sin cargar el dataset completo innecesariamente.

### Tareas

1. identificar columnas necesarias por archivo
2. cargar tablas auxiliares con `usecols`
3. usar llaves consistentes para los merges
4. revisar si hay tablas con una fila por orden o multiples filas por orden
5. agregar o resumir tablas de multiples registros
6. construir una base analitica coherente

### Verificaciones obligatorias

- revisar si el numero de filas se mantiene razonablemente
- revisar si el merge duplico filas sin querer
- revisar si hay columnas que quedaron totalmente vacias
- revisar typos en columnas de origen

### Hallazgos ya detectados

- typo en `prior_infecting_organism_days_to_culutre`
- `implied_susceptibility` viene practicamente vacia para esta bacteria
- `prior_organism` necesita ajuste porque usa categorias mas generales

### Estado actual

`PARCIALMENTE COMPLETADA`

Pendiente:
- corregir la logica de `prior_organism` en una iteracion futura si se quiere rescatar esa variable

---

## FASE 3 - Limpieza y normalizacion

### Objetivo

Dejar una base consistente para analisis y posterior modelado.

### Tareas

1. eliminar filas sin clase objetivo util
2. conservar solo:
   - `Susceptible`
   - `Intermediate`
   - `Resistant`
3. estandarizar texto
4. convertir banderas binarias a formato consistente
5. revisar duplicados
6. marcar categorias faltantes de forma controlada
7. no hacer imputacion estadistica ciega en la fase exploratoria

### Verificaciones obligatorias

- cuantas filas se pierden
- si la limpieza fue conservadora o agresiva
- si la variable objetivo queda bien definida

### Estado actual

`COMPLETADA`

Resultado actual:
- limpieza conservadora
- solo se eliminaron pocos registros respecto al total filtrado

---

## FASE 4 - Verificacion final de calidad de datos

### Objetivo

Antes del modelado, decidir tecnicamente que variables son confiables, cuales son fragiles y cuales conviene excluir.

### Esta es la fase correcta actual

`COMPLETADA`

### Tareas obligatorias

1. construir una tabla final de verificacion de variables
2. para cada variable registrar:
   - nombre
   - tipo
   - porcentaje de nulos
   - cardinalidad o categorias principales
   - decision:
     - `usar`
     - `usar con cuidado`
     - `excluir`
   - justificacion tecnica
3. revisar variables con casi todo vacio
4. revisar variables con categorias muy raras
5. revisar si hay riesgo de ruido
6. revisar si hay riesgo de sesgo
7. revisar si una variable puede inducir `data leakage`

### Variables que necesitan decision explicita

- `nursing_home_visit_culture`
- `prior_organism`
- `prior_infecting_organism_days_to_culture`
- `implied_susceptibility`
- `Rule`
- `median_wbc`
- `median_cr`
- `ordering_mode`

### Criterios de decision sugeridos

#### Usar

Cuando:
- tiene cobertura razonable
- tiene sentido clinico
- no induce fuga de informacion
- no esta vacia casi por completo

#### Usar con cuidado

Cuando:
- tiene valor clinico
- pero muchos nulos o poca cobertura
- o puede necesitar una transformacion especial

#### Excluir

Cuando:
- esta casi completamente vacia
- tiene informacion redundante o inutil
- introduce mucho ruido
- no aporta senal real

### Resultado esperado

Un bloque nuevo en el notebook de analisis llamado algo como:
- `Verificacion final de variables para modelado`

Y una salida CSV como:
- `verificacion_variables_modelado.csv`

### Evidencia de cierre ya disponible

- `modelo/3.DATOS-PROCESADOS/verificacion_variables_modelado.csv`
- decision formal por variable en el notebook de analisis
- separacion entre variables `usar`, `usar con cuidado` y `excluir`

---

## FASE 5 - Definicion de dataset final para modelado

### Objetivo

Construir una version final de la base ya pensada especificamente para entrenamiento.

### Tareas

1. partir del CSV limpio actual
2. aplicar decisiones de la fase 4
3. excluir columnas descartadas
4. separar identificadores de variables predictoras
5. dejar una version final del dataset para modelado

### Salida esperada

Algo como:
- `armd_s_aureus_base_modelado.csv`

### Estado actual

`COMPLETADA`

### Evidencia de cierre ya disponible

- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_base.csv`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_ampliada.csv`
- `modelo/3.DATOS-PROCESADOS/manifiesto_modelado.csv`

### Decision tecnica aplicada

- version `base`: solo variables mas solidas
- version `ampliada`: version base + variables catalogadas como `usar con cuidado`

### Regla

No crear este archivo hasta cerrar la fase 4.

---

## FASE 6 - Preparacion metodologica del modelado

### Objetivo

Definir claramente como se entrenara y validara el modelo.

### Tareas

1. definir variable objetivo
2. definir variables predictoras finales
3. definir tratamiento de numericas
4. definir tratamiento de categoricas
5. definir estrategia para faltantes dentro del pipeline
6. definir particion temporal
7. definir metricas oficiales

### Decisiones metodologicas esperadas

- particion temporal, no aleatoria simple
- metricas:
  - `accuracy`
  - `balanced_accuracy`
  - `precision_macro`
  - `recall_macro`
  - `f1_macro`
- revisar si se usara:
  - pesos de clase
  - sobremuestreo
  - ambos

### Estado actual

`EN PROGRESO`

Ya existe el notebook:
- `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`

Ahora puede ejecutarse porque la fase 4 y la fase 5 ya dejaron evidencia suficiente.

---

## FASE 7 - Comparacion de clasificadores

### Objetivo

Comparar varios modelos con la misma base y las mismas reglas de evaluacion.

### Modelos previstos

- `DummyClassifier`
- `LogisticRegression`
- `KNeighborsClassifier`
- `DecisionTreeClassifier`
- `RandomForestClassifier`
- `XGBoost`

### Regla metodologica

Todos deben evaluarse con:
- misma particion temporal
- mismas metricas
- mismo dataset final
- mismo criterio de comparacion

### Preguntas que esta fase debe responder

- que tanto supera cada modelo al baseline
- si `KNN` compite o no compite bien
- si `XGBoost` justifica su complejidad
- si `RandomForest` ofrece mejor equilibrio
- cual modelo falla mas en `Intermediate`

### Estado actual

`NO INICIADA`

Aunque el notebook ya fue creado, aun no debe considerarse fase activa.

---

## FASE 8 - Ajuste y refinamiento

### Objetivo

Mejorar el mejor enfoque encontrado.

### Posibles tareas

1. ajustar hiperparametros
2. probar inclusion de variables inicialmente excluidas
3. evaluar `SMOTE` o tecnicas similares
4. comparar `class_weight` vs sobremuestreo
5. revisar matriz de confusion
6. revisar errores por clase

### Regla

No hacer tuning fino de todos los modelos desde el principio. Primero comparar configuraciones base razonables.

---

## FASE 9 - Cierre tecnico y redaccion

### Objetivo

Dejar resultados claros para explicacion academica.

### Tareas

1. redactar conclusiones del analisis exploratorio
2. justificar exclusiones de variables
3. justificar estrategia de validacion temporal
4. justificar modelo final elegido
5. resumir riesgos de sesgo y ruido
6. dejar resultados de metricas y confusion matrix

### Preguntas que el informe final debe poder responder

- por que se filtro `Staphylococcus aureus`
- como se limpio el dataset
- por que unas variables se conservaron y otras no
- por que se uso validacion temporal
- que modelos se compararon
- cual fue el mejor y por que
- que limitaciones siguen existiendo

---

## Heuristica de trabajo para futuras sesiones

Antes de empezar cualquier sesion, revisar en este orden:

1. `SESSION_PROGRESS.md`
2. `PLAN_TRABAJO.md`
3. `PROJECT_CONTEXT.md`

Luego responder estas 5 preguntas:

1. En que fase estamos realmente.
2. Que falta para cerrar esa fase.
3. Que archivo es la fuente principal de trabajo en esa fase.
4. Que evidencia debe producirse antes de avanzar.
5. Que cosas no debemos hacer todavia.

Regla fuerte:
- no cambiar de fase solo porque ya existe un notebook adelantado
- se cambia de fase solo cuando la fase actual ya tiene evidencia suficiente

Checklist de reanudacion rapida:
- leer `SESSION_PROGRESS.md`
- leer `PLAN_TRABAJO.md`
- ubicar `FASE_ACTIVA`
- verificar `SIGUIENTE_ACCION_OBLIGATORIA`
- revisar `NO_HACER_AUN`
- trabajar sobre el `ARCHIVO_PRINCIPAL_DE_ESTA_FASE`

---

## Archivos clave del proyecto

- `PROJECT_CONTEXT.md`
- `SESSION_PROGRESS.md`
- `PLAN_TRABAJO.md`
- `modelo/1.ANALIZAR-DATASET-UNIR/01_analisis_limpieza_visualizacion_armd.ipynb`
- `modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_limpia.csv`
- `modelo/4.MODELADO-Y-VALIDACION/08_modelado_validacion_multiclase_armd.ipynb`

---

## Siguiente paso correcto

La fase activa correcta es:

`FASE 6 - Preparacion metodologica del modelado`

La siguiente accion concreta debe ser:

- ajustar el notebook de modelado para comparar primero la version base y luego la version ampliada

No ejecutar aun:
- tuning de hiperparametros


