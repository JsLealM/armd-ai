# ACLARACIONES DE CONSISTENCIA DEL MODELO

## 1. Por que `time_to_culturetime` no se usa si tiene cobertura de `70.23%`

En [reporte_faltantes_semanticos.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/reporte_faltantes_semanticos.csv:1>) la variable `time_to_culturetime` aparece con:

- `29.77%` de `NaN`
- `70.23%` de cobertura real

Eso significa que **si tenia informacion potencialmente util**.

Sin embargo, **no se excluyo por mala calidad**, sino por **decision metodologica del proyecto**:

- primero se considero usar `antibiotic_class + time_to_culturetime`
- despues se rediseño esta parte para usar solo `multihot` por clase antibiotica previa
- el usuario decidio explicitamente **no usar recencia**

Por eso, en las versiones finales con antibioticos previos:

- ya no entra `antibiotic_class`
- ya no entra `time_to_culturetime`
- se usan columnas binarias `exp_prev_*`

Conclusion correcta:

- `time_to_culturetime` es una variable con cobertura aceptable
- pero **no fue seleccionada en la estrategia final**
- su exclusion es **metodologica**, no un problema de calidad

## 2. Por que `catalogo_grupos_comorbilidades.csv` tiene `11` filas pero el dataset final tiene `8` columnas `comorb_*`

El archivo [catalogo_grupos_comorbilidades.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/catalogo_grupos_comorbilidades.csv:1>) **no es una lista de columnas finales**.

Es un **mapa de componentes originales hacia grupos finales**.

Por eso:

- el catalogo tiene `11` filas
- pero esas `11` filas corresponden a solo `8` grupos distintos

Ejemplos:

- `comorb_diabetes_any` agrupa `3` componentes:
  - `Diabetes mellitus without complication`
  - `Diabetes, complicated`
  - `Diabetes, uncomplicated`
- `comorb_chronic_pulmonary_any` agrupa `2` componentes:
  - `Chronic pulmonary disease`
  - `Chronic obstructive pulmonary disease and bronchiectasis`

Los otros grupos mapean `1` componente cada uno.

Por eso el dataset final [armd_s_aureus_base_modelado_multihot_abx_comorb.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/armd_s_aureus_base_modelado_multihot_abx_comorb.csv:1>) trae correctamente `8` columnas `comorb_*`, no `11`.

Conclusion correcta:

- `11` filas en el catalogo = `11` relaciones componente→grupo
- `8` columnas `comorb_*` = `8` variables binarias finales

## 3. Estado final correcto de las variables por familia

### Exposicion antibiotica previa

- opcion antigua: `antibiotic_class + time_to_culturetime`
- opcion final elegida: `exp_prev_*`

### Comorbilidades

- opcion cruda descartada: `microbiology_cultures_comorbidity.csv` completo
- opcion final experimental: `8` grupos `comorb_*`

## 4. Archivos de referencia para no volver a confundirse

- [RESUMEN_ENTRENAMIENTOS_MODELO.md](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/RESUMEN_ENTRENAMIENTOS_MODELO.md:1>)
- [resumen_entrenamientos_modelo.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/resumen_entrenamientos_modelo.csv:1>)
- [catalogo_grupos_comorbilidades.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/catalogo_grupos_comorbilidades.csv:1>)
- [manifiesto_modelado_multihot_abx_comorb.csv](</D:/6TO-SEMESTRE/Sistemas Inteligentes/2doCorte/Proyecto/modelo/3.DATOS-PROCESADOS/manifiesto_modelado_multihot_abx_comorb.csv:1>)


