# FRONTEND ARCHITECTURE - ARMD-AI

## 1. Objetivo del frontend

El frontend no sera un sistema clinico productivo.

En esta etapa sera un **miniprototipo de exposicion** para mostrar:

- el contexto del proyecto
- el flujo de limpieza y analisis del dataset
- las graficas mas importantes
- las decisiones metodologicas
- las variantes del dataset usadas para modelado

Tecnologia decidida:

- `React`
- `Vite`

## 2. Tipo de frontend que se va a construir

El frontend sera una aplicacion de **dos paginas principales** montada con `React + Vite`.

No necesita:

- autenticacion
- backend propio
- base de datos
- formularios complejos
- consumo de API en tiempo real

Si necesita:

- buena narrativa visual
- estructura clara
- imagenes legibles
- textos cortos debajo de cada grafica
- navegacion simple
- una pagina para analisis visual
- una pagina para resultados de modelos

## 3. Objetivo academico del prototipo

El prototipo debe dejar claro:

1. de donde salen los datos
2. como se filtraron y limpiaron
3. por que se eligieron ciertas variables
4. como se ven los patrones mas importantes del dataset
5. que variantes de dataset quedaron listas para modelado

El frontend no debe parecer una app clinica final.

Debe parecer una **demo academica elegante y clara** del proyecto `ARMD-AI`.

## 4. Informacion que debe mostrar

### 4.1. Seccion de portada

Debe mostrar:

- nombre del proyecto: `ARMD-AI`
- subtitulo corto
- bacteria objetivo: `Staphylococcus aureus`
- problema: prediccion de `susceptibility`
- tecnologias principales:
  - analisis en `JupyterLab`
  - modelado en `Python`
  - frontend en `React + Vite`

### 4.2. Seccion de contexto del dataset

Debe explicar:

- que el dataset original ARMD venia en multiples CSV
- que no se uso todo indiscriminadamente
- que se filtro temprano por `S. aureus`
- que el trabajo se enfoco solo en prediccion de susceptibilidad antibiotica

### 4.3. Seccion de limpieza y calidad de datos

Debe mostrar estas graficas:

- `expo_01_resumen_limpieza.png`
- `expo_02_objetivo_antes_despues.png`
- `expo_11_faltantes_semanticos.png`

Y texto corto para responder:

- cuantas filas habia antes y despues
- que paso con la variable objetivo
- por que `NaN` no era suficiente para medir calidad

### 4.4. Seccion de seleccion de variables

Debe mostrar:

- `expo_04_decision_variables.png`

Y explicar:

- que variables se usan
- cuales se usan con cuidado
- cuales se excluyen

### 4.5. Seccion de comportamiento de los datos

Debe mostrar estas graficas:

- `expo_08_cultivo_vs_susceptibilidad.png`
- `expo_10_entorno_hospitalario.png`
- `expo_05_boxplot_median_wbc.png`

Esta parte es importante porque muestra:

- diferencias por tipo de cultivo
- composicion del entorno hospitalario
- presencia de dispersion y valores raros en una variable clinica

### 4.6. Seccion de variantes de modelado

Debe explicar las `5` versiones del dataset:

1. `base`
2. `ampliada`
3. `multihot_abx`
4. `multihot_comorb`
5. `multihot_abx_comorb`

Esto no necesita un grafico obligatorio.

Puede resolverse con:

- tarjetas
- tabla simple
- timeline horizontal

### 4.7. Seccion final

Debe cerrar con:

- estado actual del proyecto
- que ya existe para modelado
- que sigue despues

## 5. Arquitectura recomendada del frontend

## 5.1. Estructura general

Se recomienda esta estructura minima:

```text
src/
  assets/
    expo/
  components/
    layout/
    sections/
    ui/
  data/
  pages/
    HomePage.jsx
    ModelsPage.jsx
  App.jsx
  main.jsx
```

## 5.2. Carpetas recomendadas

### `assets/expo/`

Aqui deben vivir las imagenes `.png` seleccionadas para el frontend.

Seleccion final para la pagina principal:

- `expo_01_resumen_limpieza.png`
- `expo_02_objetivo_antes_despues.png`
- `expo_04_decision_variables.png`
- `expo_08_cultivo_vs_susceptibilidad.png`
- `expo_10_entorno_hospitalario.png`
- `expo_11_faltantes_semanticos.png`
- `expo_05_boxplot_median_wbc.png`

Graficas de respaldo, por si el frontend necesita una seccion extra o una pestaña secundaria:

- `expo_03_nulos_antes_despues.png`
- `expo_06_boxplot_median_cr.png`
- `expo_07_top_antibioticos.png`
- `expo_09_edad_vs_susceptibilidad.png`

### `components/layout/`

Componentes estructurales:

- `Navbar`
- `PageShell`
- `SectionContainer`
- `Footer`

### `components/sections/`

Secciones grandes de la pagina:

- `HeroSection`
- `DatasetContextSection`
- `CleaningSection`
- `VariableSelectionSection`
- `BehaviorSection`
- `ModelVariantsSection`
- `ConclusionSection`

### `components/ui/`

Piezas reutilizables:

- `MetricCard`
- `InfoCard`
- `ImagePanel`
- `SectionTitle`
- `Timeline`
- `VariantTable`

### `data/`

Aqui conviene centralizar textos y configuraciones para no quemarlos dentro de JSX.

Ejemplos:

- `projectSummary.js`
- `chartsConfig.js`
- `modelVariants.js`

## 6. Paginas recomendadas

Se recomiendan estas dos rutas:

### Ruta 1: `/`

Pagina principal de analisis y narrativa visual.

Debe contener:

- hero
- contexto del dataset
- limpieza
- calidad real
- seleccion de variables
- comportamiento y tendencias
- cierre del proyecto

Orden recomendado de graficas en esta pagina:

1. `expo_01_resumen_limpieza.png`
2. `expo_02_objetivo_antes_despues.png`
3. `expo_11_faltantes_semanticos.png`
4. `expo_04_decision_variables.png`
5. `expo_08_cultivo_vs_susceptibilidad.png`
6. `expo_10_entorno_hospitalario.png`
7. `expo_05_boxplot_median_wbc.png`

Esta seleccion busca que la pagina cuente una historia clara:

1. cuanto se limpio
2. como quedo la variable objetivo
3. por que no basta con mirar solo `NaN`
4. como se eligieron variables
5. como cambia la susceptibilidad segun el tipo de cultivo
6. de que entornos hospitalarios viene la cohorte
7. donde hay dispersion y valores atipicos en una variable clinica importante

### Ruta 2: `/modelos`

Pagina de resultados de modelado.

Debe contener:

- un apartado claro con las `5` variantes del dataset
- una tabla comparativa de resultados
- una matriz de confusion como apoyo visual opcional

Esta pagina no necesita usar las graficas `expo_*.png` del analisis.
Debe centrarse en:

- explicar las `5` versiones del dataset:
  - `base`
  - `ampliada`
  - `multihot_abx`
  - `multihot_comorb`
  - `multihot_abx_comorb`
- una tabla tipo:
  - version del dataset
  - mejor modelo
  - `accuracy`
  - `balanced_accuracy`
  - `f1_macro`
- una matriz de confusion del mejor modelo elegido, si luego se exporta desde el notebook `08`

No se prioriza para esta pagina:

- una lista larga de todos los modelos con mucho detalle
- demasiadas tarjetas numericas
- repetir las graficas `expo_*.png` de la pagina principal

## 7. Decision final sobre graficas

Para esta version del frontend, las graficas oficiales a usar seran `7`:

1. `expo_01_resumen_limpieza.png`
2. `expo_02_objetivo_antes_despues.png`
3. `expo_11_faltantes_semanticos.png`
4. `expo_04_decision_variables.png`
5. `expo_08_cultivo_vs_susceptibilidad.png`
6. `expo_10_entorno_hospitalario.png`
7. `expo_05_boxplot_median_wbc.png`

No se priorizan en la pagina principal:

- `expo_03_nulos_antes_despues.png`
  porque `expo_11` explica mejor la calidad real de la informacion
- `expo_06_boxplot_median_cr.png`
  porque con un solo boxplot bien explicado suele bastar
- `expo_07_top_antibioticos.png`
  porque aporta contexto, pero no es tan fuerte como `expo_08`
- `expo_09_edad_vs_susceptibilidad.png`
  porque hoy la narrativa visual principal ya queda mejor balanceada con cultivo, entorno y calidad

## 7. Secciones recomendadas en pantalla

## 7.1. Hero

Contenido:

- titulo fuerte
- descripcion corta
- una frase del problema
- chips o etiquetas con:
  - `S. aureus`
  - `Susceptibility`
  - `React + Vite`
  - `JupyterLab`

## 7.2. Flujo del proyecto

Mostrar un mini flujo tipo:

`Dataset crudo -> Filtrado -> Limpieza -> Analisis -> Variantes de modelado`

## 7.3. Calidad de datos

Mostrar 2 o 3 tarjetas resumen:

- registros antes y despues
- clases objetivo finales
- idea de cobertura real

Luego mostrar las graficas clave.

## 7.4. Variables importantes

Mostrar:

- una explicacion corta
- la grafica de decision de variables
- una lista corta de variables retenidas

## 7.5. Comportamiento y tendencias

Esta seccion debe verse mas analitica.

Debe contener:

- tipo de cultivo vs susceptibility
- tendencia por edad
- tendencia por `median_wbc`

## 7.6. Variantes para modelado

Mostrar las `5` variantes de forma visual:

- nombre
- idea
- que agrega respecto a la anterior

Ejemplo:

- `base`: variables mas solidas
- `ampliada`: agrega variables clinicas con cuidado
- `multihot_abx`: agrega exposicion antibiotica previa
- `multihot_comorb`: agrega comorbilidades reducidas
- `multihot_abx_comorb`: combina ambas familias

## 7.7. Pagina de modelos y scores

La pagina `/modelos` debe organizarse en bloques claros:

### Resumen superior

- objetivo del modelado
- metrica principal
- cantidad de variantes del dataset comparadas

### Tabla de variantes del dataset

Debe mostrar:

- nombre de la variante
- que variables agrega
- numero de columnas

### Tabla de resultados

Debe mostrar, por cada modelo probado:

- nombre del modelo
- dataset usado
- `accuracy`
- `balanced_accuracy`
- `f1_macro`

### Bloque de mejor resultado

Debe dejar visible:

- mejor modelo por cada dataset
- mejor variante global segun la metrica principal

### Nota metodologica

Debe recordar:

- que `accuracy` sola no basta
- que el problema esta desbalanceado
- que interesa especialmente el comportamiento de `Intermediate`

## 8. Componentes recomendados

## 8.1. `ImagePanel`

Debe recibir:

- `title`
- `image`
- `caption`
- `insight`

Uso:

- mostrar una grafica con una explicacion corta debajo

## 8.2. `MetricCard`

Debe mostrar:

- numero grande
- etiqueta
- contexto corto

Ejemplos:

- `82,519` registros antes
- `82,319` registros despues
- `5` datasets finales de modelado

## 8.3. `VariantTable` o `VariantCards`

Debe mostrar las cinco versiones de dataset de forma clara.

## 8. Componentes recomendados para la pagina de modelos

### `ResultsTable`

Para mostrar resultados comparativos por dataset y por algoritmo.

### `ScoreCard`

Para destacar:

- mejor `balanced_accuracy`
- mejor `f1_macro`
- mejor modelo global

### `DatasetVariantCard`

Para explicar de forma visual cada una de las 5 variantes.

## 9. Datos que pueden quedar hardcodeados

Para esta fase esta bien dejar hardcodeado:

- textos cortos
- resumenes numericos
- configuracion de tarjetas
- rutas de imagenes
- nombres de variantes del modelo

No hace falta una API.

## 10. Que no se recomienda hacer

No conviene:

- meter demasiadas graficas en una sola vista
- usar todas las imagenes existentes
- llenar la pagina de texto largo
- simular features clinicos que no existen todavia
- convertir el prototipo en dashboard con demasiados filtros

## 11. Graficas recomendadas para la pagina principal del frontend

Estas son las `7` principales:

1. `expo_01_resumen_limpieza.png`
2. `expo_02_objetivo_antes_despues.png`
3. `expo_04_decision_variables.png`
4. `expo_08_cultivo_vs_susceptibilidad.png`
5. `expo_11_faltantes_semanticos.png`
6. `expo_12_tendencia_edad_resistencia.png`
7. `expo_13_tendencia_wbc_resistencia.png`

Graficas de respaldo:

- `expo_03_nulos_antes_despues.png`
- `expo_05_boxplot_median_wbc.png`
- `expo_06_boxplot_median_cr.png`
- `expo_07_top_antibioticos.png`
- `expo_09_edad_vs_susceptibilidad.png`
- `expo_10_entorno_hospitalario.png`
- `expo_14_tendencia_cr_resistencia.png`

## 12. Datos recomendados para la pagina `/modelos`

La pagina de modelos deberia apoyarse en estos archivos:

- `modelo/4.MODELADO-Y-VALIDACION/resultados_validacion_modelos_base.csv`
- `modelo/4.MODELADO-Y-VALIDACION/resultado_test_mejor_modelo_base.csv`

Y, a medida que se ejecuten las demas variantes:

- `resultados_validacion_modelos_ampliada.csv`
- `resultados_validacion_modelos_multihot_abx.csv`
- `resultados_validacion_modelos_multihot_comorb.csv`
- `resultados_validacion_modelos_multihot_abx_comorb.csv`

Idealmente, despues se puede consolidar todo en un solo JSON o CSV resumen para el frontend.

## 13. Estructura general del proyecto recomendada

La recomendacion es **no juntar backend y modelo**.

Lo mas limpio es:

```text
frontend/
backend/
modelo/
```

### `frontend/`

Debe contener la app `React + Vite`.

### `backend/`

Debe contener la API en `FastAPI`.

### `modelo/`

Debe contener:

- notebooks
- scripts de analisis
- scripts de modelado
- datos procesados
- imagenes de exposicion

### Por que no conviene juntar `backend` y `modelo`

Porque cumplen papeles distintos:

- `backend` expone endpoints
- `modelo` concentra investigacion, notebooks, datasets, scripts y experimentos

Si mezclas ambos desde el inicio:

- se ensucian responsabilidades
- se vuelve mas dificil mantener rutas
- se complica la evolucion futura del proyecto

## 14. Estrategia recomendada de reorganizacion

Como el proyecto ya tiene muchos archivos y notebooks funcionando, no conviene mover todo agresivamente hoy.

La estrategia correcta es:

1. crear las carpetas nuevas:
   - `frontend/`
   - `backend/`
   - `modelo/`
2. dejar documentado que `modelo/` sera el nuevo hogar del trabajo analitico
3. mover de forma gradual cuando ya se quiera estabilizar rutas

En esta etapa, lo mas seguro es:

- crear la estructura nueva
- no romper el trabajo actual
- luego migrar con calma

## 15. Archivos del proyecto que el frontend debe respetar

Para entender el contenido, el frontend debe tomar como referencia estos archivos:

- `GUIA_CORTA_EXPOSICION_DATASET.md`
- `RESUMEN_ENTRENAMIENTOS_MODELO.md`
- `ACLARACIONES_CONSISTENCIA_MODELO.md`
- `modelo/2.VISUALIZACION-DATOS/exposicion_analisis_visual_armd.ipynb`

Y para las imagenes:

- carpeta `modelo/2.VISUALIZACION-DATOS/EXPOSICION`

## 16. Propuesta de narrativa visual

Orden recomendado:

1. problema
2. dataset
3. limpieza
4. calidad real
5. variables seleccionadas
6. comportamiento de los datos
7. versiones de modelado
8. siguiente paso

Ese orden ayuda a que el profesor entienda:

- primero la base
- luego la evidencia
- despues el modelado

## 17. Estado actual del frontend

En este momento este documento solo define la arquitectura y el contexto.

Todavia faltaria:

- crear el proyecto `React + Vite`
- definir `React Router`
- copiar las imagenes seleccionadas
- construir componentes
- maquetar las dos paginas
- conectar los textos e imagenes
- preparar la tabla de scores

## 18. Siguiente paso recomendado

El siguiente paso correcto seria:

1. crear el proyecto con `Vite`
2. instalar y configurar `React Router`
3. crear las dos paginas:
   - `HomePage`
   - `ModelsPage`
4. cargar las `7` graficas clave en la pagina principal
5. preparar una tabla inicial de scores en la pagina de modelos

