# INDICE DE CSV PROCESADOS

Este indice organiza los CSV sin romper las rutas originales del proyecto.

Regla aplicada:
- los CSV originales se conservan en la raiz de `3.DATOS-PROCESADOS`
- se crearon subcarpetas con copias clasificadas por etapa y uso

## CSV de entrenamiento/modelado

Los `5` CSV que deben considerarse como bases de entrenamiento o comparacion de modelos son:

- `armd_s_aureus_base_modelado_base.csv`
- `armd_s_aureus_base_modelado_ampliada.csv`
- `armd_s_aureus_base_modelado_multihot_abx.csv`
- `armd_s_aureus_base_modelado_multihot_comorb.csv`
- `armd_s_aureus_base_modelado_multihot_abx_comorb.csv`

## 01_BASE_LIMPIA

Base limpia principal despues del proceso de integracion y limpieza.

- `01_BASE_LIMPIA/01_armd_s_aureus_base_limpia.csv`  <- origen `armd_s_aureus_base_limpia.csv`

## 02_ANALISIS_Y_CALIDAD

Tablas resumen, calidad, nulos, cobertura y verificacion de variables, incluyendo comorbilidades.

- `02_ANALISIS_Y_CALIDAD/01_resumen_filas_antes_despues.csv`  <- origen `resumen_filas_antes_despues.csv`
- `02_ANALISIS_Y_CALIDAD/02_tabla_susceptibilidad_antes_despues.csv`  <- origen `tabla_susceptibilidad_antes_despues.csv`
- `02_ANALISIS_Y_CALIDAD/03_comparacion_nulos.csv`  <- origen `comparacion_nulos.csv`
- `02_ANALISIS_Y_CALIDAD/04_reporte_faltantes_semanticos.csv`  <- origen `reporte_faltantes_semanticos.csv`
- `02_ANALISIS_Y_CALIDAD/05_verificacion_variables_modelado.csv`  <- origen `verificacion_variables_modelado.csv`
- `02_ANALISIS_Y_CALIDAD/06_tabla_cultivos_limpios.csv`  <- origen `tabla_cultivos_limpios.csv`
- `02_ANALISIS_Y_CALIDAD/07_tabla_top_antibioticos_limpios.csv`  <- origen `tabla_top_antibioticos_limpios.csv`
- `02_ANALISIS_Y_CALIDAD/08_resumen_comorbilidades_piloto.csv`  <- origen `resumen_comorbilidades_piloto.csv`
- `02_ANALISIS_Y_CALIDAD/09_top_comorbilidades_piloto.csv`  <- origen `top_comorbilidades_piloto.csv`
- `02_ANALISIS_Y_CALIDAD/10_cobertura_grupos_comorbilidades.csv`  <- origen `cobertura_grupos_comorbilidades.csv`
- `02_ANALISIS_Y_CALIDAD/11_resumen_grupos_comorbilidades.csv`  <- origen `resumen_grupos_comorbilidades.csv`

## 03_MODELOS_BASE_Y_AMPLIADA

Datasets finales clasicos para la primera iteracion del modelado.

- `03_MODELOS_BASE_Y_AMPLIADA/01_armd_s_aureus_base_modelado_base.csv`  <- origen `armd_s_aureus_base_modelado_base.csv`
- `03_MODELOS_BASE_Y_AMPLIADA/02_armd_s_aureus_base_modelado_ampliada.csv`  <- origen `armd_s_aureus_base_modelado_ampliada.csv`
- `03_MODELOS_BASE_Y_AMPLIADA/03_manifiesto_modelado.csv`  <- origen `manifiesto_modelado.csv`

## 04_MODELOS_EXPERIMENTALES

Datasets y manifiestos de versiones experimentales, incluyendo multihot de antibioticos y comorbilidades.

- `04_MODELOS_EXPERIMENTALES/01_armd_s_aureus_base_modelado_multihot_abx.csv`  <- origen `armd_s_aureus_base_modelado_multihot_abx.csv`
- `04_MODELOS_EXPERIMENTALES/02_armd_s_aureus_base_modelado_multihot_comorb.csv`  <- origen `armd_s_aureus_base_modelado_multihot_comorb.csv`
- `04_MODELOS_EXPERIMENTALES/03_armd_s_aureus_base_modelado_multihot_abx_comorb.csv`  <- origen `armd_s_aureus_base_modelado_multihot_abx_comorb.csv`
- `04_MODELOS_EXPERIMENTALES/04_manifiesto_modelado_multihot_abx.csv`  <- origen `manifiesto_modelado_multihot_abx.csv`
- `04_MODELOS_EXPERIMENTALES/05_manifiesto_modelado_multihot_comorb.csv`  <- origen `manifiesto_modelado_multihot_comorb.csv`
- `04_MODELOS_EXPERIMENTALES/06_manifiesto_modelado_multihot_abx_comorb.csv`  <- origen `manifiesto_modelado_multihot_abx_comorb.csv`
- `04_MODELOS_EXPERIMENTALES/07_catalogo_clases_antibioticas_multihot.csv`  <- origen `catalogo_clases_antibioticas_multihot.csv`
- `04_MODELOS_EXPERIMENTALES/08_catalogo_grupos_comorbilidades.csv`  <- origen `catalogo_grupos_comorbilidades.csv`
