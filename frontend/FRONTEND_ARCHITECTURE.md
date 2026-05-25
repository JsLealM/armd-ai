# FRONTEND ARCHITECTURE - ARMD-AI

## 1. Objetivo

El frontend sera un **miniprototipo academico** en `React + Vite`.

No es una app clinica productiva. Su funcion es mostrar:

- el problema del proyecto
- el flujo de limpieza y analisis
- las graficas mas importantes
- las `5` variantes del dataset para modelado
- los resultados de los modelos probados

La variable objetivo del proyecto y del modelado es:

- `susceptibility`

## 2. Estructura general del frontend

La recomendacion final es:

- `1` frontend
- `2` paginas principales
- `1` narrativa analitica centrada en `susceptibility`

No hace falta crear varios dashboards separados. Lo correcto es una sola app con dos rutas:

1. `/`
2. `/modelos`

## 3. Paginas

### 3.1. Ruta `/`

Es la pagina principal del analisis visual.

Debe responder:

- de donde salieron los datos
- como se limpiaron
- que calidad real tienen
- por que se eligieron ciertas variables
- como se comporta `susceptibility`

### 3.2. Ruta `/modelos`

Es la pagina de resultados del modelado.

Debe mostrar:

- las `5` versiones del dataset
- una tabla comparativa de scores
- una matriz de confusion opcional del mejor modelo

## 4. Graficas oficiales para la pagina principal

La seleccion final queda centrada en `susceptibility`.

Estas son las `8` graficas oficiales:

1. `expo_01_resumen_limpieza.png`
2. `expo_02_objetivo_antes_despues.png`
3. `expo_11_faltantes_semanticos.png`
4. `expo_04_decision_variables.png`
5. `expo_08_cultivo_vs_susceptibilidad.png`
6. `expo_09_edad_vs_susceptibilidad.png`
7. `expo_12_heatmap_correlacion_modelado_completo.png`
8. `expo_13_boxplot_wbc_por_susceptibility.png`

## 5. Graficas de respaldo

Estas no son obligatorias en la pagina principal, pero sirven como apoyo:

- `expo_03_nulos_antes_despues.png`
- `expo_05_boxplot_median_wbc.png`
- `expo_06_boxplot_median_cr.png`
- `expo_07_top_antibioticos.png`
- `expo_10_entorno_hospitalario.png`

## 6. Logica de la seleccion

La pagina principal debe contar esta historia:

1. cuanto se limpio el dataset
2. como quedo la variable objetivo
3. por que no basta con mirar solo `NaN`
4. como se decidieron las variables
5. como cambia `susceptibility` segun el tipo de cultivo
6. como cambia `susceptibility` segun la edad
7. como se correlacionan todas las variables finales del modelado
8. como se comporta `median_wbc` segun cada clase de `susceptibility`

## 7. Secciones de la ruta `/`

Orden recomendado:

1. `HeroSection`
2. `DatasetContextSection`
3. `CleaningSection`
4. `DataQualitySection`
5. `VariableSelectionSection`
6. `SusceptibilityBehaviorSection`
7. `ConclusionSection`

### 7.1. `HeroSection`

Debe mostrar:

- nombre del proyecto `ARMD-AI`
- bacteria objetivo `Staphylococcus aureus`
- problema central: prediccion de `susceptibility`
- tecnologias: `JupyterLab`, `Python`, `React + Vite`

### 7.2. `DatasetContextSection`

Debe explicar:

- que el dataset ARMD venia en multiples CSV
- que no se usaron todos indiscriminadamente
- que se filtro temprano por `S. aureus`
- que la unidad analitica se trabajo alrededor de `order_proc_id_coded`

### 7.3. `CleaningSection`

Debe usar:

- `expo_01_resumen_limpieza.png`
- `expo_02_objetivo_antes_despues.png`

### 7.4. `DataQualitySection`

Debe usar:

- `expo_11_faltantes_semanticos.png`

Mensaje clave:

- una variable puede no tener `NaN` y aun asi no tener buena cobertura real

### 7.5. `VariableSelectionSection`

Debe usar:

- `expo_04_decision_variables.png`

### 7.6. `SusceptibilityBehaviorSection`

Debe usar:

- `expo_08_cultivo_vs_susceptibilidad.png`
- `expo_09_edad_vs_susceptibilidad.png`
- `expo_12_heatmap_correlacion_modelado_completo.png`
- `expo_13_boxplot_wbc_por_susceptibility.png`

Esta es la seccion mas importante para el frontend, porque ya muestra el comportamiento de la variable objetivo.

### 7.7. `ConclusionSection`

Debe cerrar con:

- que el dataset ya quedo listo para modelado
- que existen `5` variantes de entrenamiento
- que el siguiente paso es comparar modelos y scores

## 8. Pagina `/modelos`

No debe repetir las imagenes del analisis.

Debe contener solo:

### 8.1. Apartado de variantes

Las `5` versiones:

1. `base`
2. `ampliada`
3. `multihot_abx`
4. `multihot_comorb`
5. `multihot_abx_comorb`

### 8.2. Tabla de resultados

Columnas sugeridas:

- `version_dataset`
- `mejor_modelo`
- `accuracy`
- `balanced_accuracy`
- `f1_macro`

### 8.3. Matriz de confusion

Opcional, pero recomendable como apoyo visual del mejor modelo final.

## 9. Estructura de carpetas

Se recomienda esta estructura minima:

```text
frontend/
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

## 10. Componentes sugeridos

### `ImagePanel`

Para mostrar:

- titulo
- imagen
- texto corto
- mensaje clave

### `SectionTitle`

Para mantener consistencia visual.

### `VariantCards`

Para explicar las `5` versiones del dataset.

### `ResultsTable`

Para los scores de la pagina `/modelos`.

## 11. Archivos de referencia

Para construir el frontend se deben respetar estos archivos:

- `frontend/TEXTOS_GRAFICAS_FRONTEND.md`
- `GUIA_CORTA_EXPOSICION_DATASET.md`
- `RESUMEN_ENTRENAMIENTOS_MODELO.md`
- `ACLARACIONES_CONSISTENCIA_MODELO.md`
- `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`

Y las imagenes salen de:

- `modelo/2.VISUALIZACION-DATOS/EXPOSICION/`

## 12. Notebook actualizado para estas graficas

Las graficas nuevas centradas en `susceptibility` quedaron integradas en:

- `modelo/2.VISUALIZACION-DATOS/03_exposicion_analisis_visual_armd.ipynb`

Graficas nuevas agregadas ahi:

- `expo_12_heatmap_correlacion_modelado_completo.png`
- `expo_13_boxplot_wbc_por_susceptibility.png`

## 13. Decision final

El frontend queda asi:

- `1` app en `React + Vite`
- `2` paginas principales
- pagina `/` enfocada en analisis y comportamiento de `susceptibility`
- pagina `/modelos` enfocada en variantes, scores y matriz de confusion
